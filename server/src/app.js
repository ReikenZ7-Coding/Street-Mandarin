// The Street Mandarin server: the app's own files, accounts, progress sync, and the AI route.
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { Hono } from "hono";
import { getCookie, setCookie, deleteCookie } from "hono/cookie";
import { hashPassword, checkPassword, newToken, sha256, encrypt, decrypt, limiter } from "./security.js";
import { callClaude, checkKey, parseJson, AiError } from "./claude.js";
import { askAi, listModels, localStatus, isLocalUrl, nameFor, PROVIDERS, COMPUTER } from "./your-ai.js";
import { priceOf } from "./config.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(here, "../..");
// Only these files are served: never the server's code, the repo's history or anything else in it
const APP_FILES = ["index.html", "client.js", "ai.js", "scenes.js", "why.js", "voices.js", "daily.js", "journey.js", "people.js", "films.js", "street.js", "vendor/three-street.js"];
// The filmed world's clips and posters (made by tools/make-films.js), served from films/ by name only
const FILMS_DIR = path.join(APP_ROOT, "films"), FILM_RE = /^[a-z0-9-]{1,40}\.(webm|jpg)$/;
const FILM_TYPES = { ".webm": "video/webm", ".jpg": "image/jpeg" };
const TYPES = { ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8" };

const COOKIE = "sm_session";
const SESSION_DAYS = 30;
const EMAIL_RE = /^[^\s@]{1,64}@[^\s@]{1,190}\.[^\s@]{2,}$/;
// The progress keys the app keeps (the same ones its progress code copies), and how big they may get
const KEY_RE = /^sm-[a-z0-9-]{1,40}$/;
const MAX_VALUE = 2_000_000, MAX_TOTAL = 8_000_000;
const USER_COLS = "id, email, api_key_enc, api_key_hint, ai_conn, ai_key_enc";

export function createApp({ db, config, ai: aiIn = {} }) {
  const ai = { callClaude, checkKey, askAi, listModels, localStatus, ...aiIn };
  // Without a choice of their own, solo learners get the model this computer runs (LOCAL_AI_URL)
  const envLocal = config.ai.provider === "local"
    ? { kind: "computer", provider: "", url: config.ai.localUrl, model: config.ai.localModel, key: config.ai.localKey, name: config.ai.localName } : null;
  const app = new Hono();
  const files = new Map(APP_FILES.map(f => {
    let body = fs.readFileSync(path.join(APP_ROOT, f), "utf8");
    // The page is the same one the Claude artifact uses; client.js connects it to this server
    if (f === "index.html") body = body.replace('<script src="scenes.js"></script>', '<script src="client.js"></script>\n<script src="scenes.js"></script>');
    return [f, body];
  }));
  const loginLimit = limiter(10, 15 * 60 * 1000), signupLimit = limiter(5, 60 * 60 * 1000), aiLimit = limiter(30, 60 * 1000);

  app.use("*", async (c, next) => {
    await next();
    c.header("X-Content-Type-Options", "nosniff");
    c.header("Referrer-Policy", "same-origin");
    c.header("Content-Security-Policy", "frame-ancestors 'none'");
  });

  // Requests that change something must come from this site's own pages, as JSON
  app.use("/api/*", async (c, next) => {
    if (c.req.method !== "GET") {
      const origin = c.req.header("origin"), host = c.req.header("host");
      let from = null; try { from = origin ? new URL(origin).host : null; } catch { from = "?"; }
      if (origin && host && from !== host) return c.json({ code: "bad_origin", error: "Not allowed from another site." }, 403);
      if (c.req.method !== "DELETE" && !String(c.req.header("content-type") || "").startsWith("application/json")) return c.json({ code: "bad_request", error: "Send JSON." }, 415);
    }
    c.header("Cache-Control", "no-store");
    await next();
  });

  // Behind a host's proxy, the last address in X-Forwarded-For is the one the proxy saw (earlier ones can be made up)
  const ip = c => (c.req.header("x-forwarded-for") || "").split(",").map(s => s.trim()).filter(Boolean).pop() || "local";
  const body = async c => { try { return await c.req.json(); } catch { return {}; } };

  // Solo mode has one person, always signed in
  let soloMade = false;
  async function theSoloUser() {
    if (!soloMade) { await db.query("insert into users (email, pass) values ('me@solo.local', 'solo') on conflict (email) do nothing"); soloMade = true; }
    // Read fresh each time: Your AI can change between requests
    return (await db.query(`select ${USER_COLS} from users where email = 'me@solo.local'`))[0];
  }
  async function currentUser(c) {
    if (config.solo) return theSoloUser();
    const token = getCookie(c, COOKIE);
    if (!token) return null;
    const rows = await db.query(
      `select ${USER_COLS.replace(/(^|, )/g, "$1u.")} from sessions s join users u on u.id = s.user_id where s.token_hash = $1 and s.expires_at > now()`,
      [sha256(token)]);
    return rows[0] || null;
  }
  const needUser = async (c, next) => {
    const u = await currentUser(c);
    if (!u) return c.json({ code: "signed_out", error: "Sign in first." }, 401);
    c.set("user", u);
    await next();
  };

  async function startSession(c, userId) {
    const token = newToken();
    await db.query("insert into sessions (token_hash, user_id, expires_at) values ($1, $2, now() + interval '30 days')", [sha256(token), userId]);
    setCookie(c, COOKIE, token, { httpOnly: true, sameSite: "Lax", secure: config.production, path: "/", maxAge: SESSION_DAYS * 86400 });
  }

  /* ---------- accounts ---------- */
  // Solo has no accounts to make, leave or delete
  app.use("/api/auth/*", async (c, next) => config.solo ? c.json({ code: "solo", error: "This copy runs in solo mode, with no sign-in." }, 404) : next());
  app.use("/api/account", async (c, next) => config.solo && c.req.method === "DELETE" ? c.json({ code: "solo", error: "This copy runs in solo mode." }, 403) : next());

  app.post("/api/auth/signup", async c => {
    if (!signupLimit(ip(c))) return c.json({ code: "rate_limited", error: "Too many sign-ups from here. Try again later." }, 429);
    const { email, password } = await body(c);
    const e = String(email || "").trim().toLowerCase(), pw = String(password || "");
    if (!EMAIL_RE.test(e)) return c.json({ code: "bad_email", error: "That doesn't look like an email address." }, 400);
    if (pw.length < 8 || pw.length > 200) return c.json({ code: "bad_password", error: "Use a password of at least 8 characters." }, 400);
    const rows = await db.query("insert into users (email, pass) values ($1, $2) on conflict (email) do nothing returning id", [e, await hashPassword(pw)]);
    if (!rows.length) return c.json({ code: "taken", error: "There's already an account with that email. Sign in instead." }, 409);
    await startSession(c, rows[0].id);
    return c.json({ ok: true });
  });

  app.post("/api/auth/login", async c => {
    const { email, password } = await body(c);
    const e = String(email || "").trim().toLowerCase();
    if (!loginLimit(ip(c) + "|" + e)) return c.json({ code: "rate_limited", error: "Too many tries. Wait a few minutes, then try again." }, 429);
    const u = (await db.query("select id, pass from users where email = $1", [e]))[0];
    // Check a password either way, so a missing account takes as long as a wrong password
    const ok = await checkPassword(String(password || ""), u ? u.pass : "scrypt$AAAAAAAAAAAAAAAAAAAAAA==$" + "A".repeat(86) + "==");
    if (!u || !ok) return c.json({ code: "bad_login", error: "That email and password don't match." }, 401);
    await startSession(c, u.id);
    return c.json({ ok: true });
  });

  app.post("/api/auth/logout", async c => {
    const token = getCookie(c, COOKIE);
    if (token) await db.query("delete from sessions where token_hash = $1", [sha256(token)]);
    deleteCookie(c, COOKIE, { path: "/" });
    return c.json({ ok: true });
  });

  /* ---------- the account page: who you are, your key, what the AI has used ---------- */
  async function spentTodayMicros(userId) {
    const r = await db.query("select coalesce(sum(cost_micros), 0)::float8 as m from ai_usage where user_id = $1 and not own_key and at >= date_trunc('day', now())", [userId]);
    return Number(r[0].m);
  }
  async function spentMonthMicros() {
    const r = await db.query("select coalesce(sum(cost_micros), 0)::float8 as m from ai_usage where not own_key and at >= date_trunc('month', now())");
    return Number(r[0].m);
  }
  function aiStatus(u, todayMicros) {
    const mode = config.ai.mode, hasKey = !!u.api_key_enc;
    const free = mode !== "byok" && !!config.ai.ownerKey;
    const left = free ? Math.max(0, config.ai.dailyAllowanceUsd * 1e6 - todayMicros) : 0;
    return { mode, hasKey, keyHint: u.api_key_hint || "", freeToday: free, freeLeftToday: left / 1e6, canUseAi: hasKey || (free && left > 0) };
  }

  /* ---------- Your AI: Claude, an online AI with your own key, or (solo) a model on this computer ---------- */
  // The connection a learner's AI requests use: their own choice, then their Claude key, then this server's default
  function connOf(u) {
    if (u.ai_conn) {
      let conn; try { conn = JSON.parse(u.ai_conn); } catch { conn = null; }
      if (conn) {
        let key = "";
        if (u.ai_key_enc) { try { key = decrypt(config.secret, u.ai_key_enc); } catch { return { ...conn, broken: true }; } }
        return { ...conn, key };
      }
    }
    if (u.api_key_enc || !envLocal) return { kind: "claude" };
    return { ...envLocal, fromEnv: true };
  }
  // What the page is told about it (never the key)
  async function aiInfo(conn) {
    if (conn.kind === "claude") return { kind: "claude", name: "Claude", can: null };
    const out = { kind: conn.kind, provider: conn.provider || "", model: conn.model || "", name: conn.name || nameFor(conn.model), can: conn.can || null, tested: conn.tested || null, keyHint: conn.keyHint || "", fromEnv: !!conn.fromEnv };
    if (conn.kind === "computer" || conn.provider === "other") out.url = conn.url;
    if (conn.kind === "computer") { const st = await ai.localStatus(conn); out.ok = st.ok; out.model = st.model || out.model; if (!conn.name) out.name = nameFor(out.model); }
    return out;
  }

  app.get("/api/account", async c => {
    const u = await currentUser(c);
    const where = { solo: config.solo, provider: config.ai.provider };
    if (!u) return c.json({ signedIn: false, mode: config.ai.mode, ...where });
    const conn = connOf(u), info = await aiInfo(conn);
    const claude = aiStatus(u, await spentTodayMicros(u.id));
    // Any AI that isn't Claude is the learner's own, so it's always theirs to use
    return c.json({ signedIn: true, email: u.email, ...where, ...claude, canUseAi: conn.kind !== "claude" || claude.canUseAi, ai: info });
  });

  // The connection a learner is setting up, checked: on the website only the known services, and never an address of their own
  function draftConn(u, b) {
    const kind = b.kind === "computer" ? "computer" : "online";
    let conn;
    if (kind === "computer") {
      if (!config.solo) throw new AiError("bad_request", "On the website, a model on your computer is reached from the page itself.", 400);
      const url = String(b.url || "").trim().replace(/\/+$/, "");
      if (!isLocalUrl(url)) throw new AiError("bad_request", "That isn't an address on this computer (localhost).", 400);
      conn = { kind, provider: (COMPUTER.find(p => p.url === url) || {}).id || "other", url };
    } else if (b.provider === "other") {
      if (!config.solo) throw new AiError("bad_request", "Pick one of the services in the list.", 400);
      const url = String(b.url || "").trim().replace(/\/+$/, "");
      if (!/^https?:\/\/[^\s/]+/.test(url)) throw new AiError("bad_request", "That doesn't look like a web address.", 400);
      conn = { kind, provider: "other", url };
    } else {
      const p = PROVIDERS.find(x => x.id === b.provider);
      if (!p) throw new AiError("bad_request", "Pick one of the services in the list.", 400);
      conn = { kind, provider: p.id, url: p.url };
    }
    let key = String(b.key || "").trim();
    // Picking another model from the same service keeps the key you already saved
    const saved = u.ai_conn ? connOf(u) : null;
    if (!key && saved && saved.kind === conn.kind && saved.provider === conn.provider && saved.url === conn.url) key = saved.key || "";
    if (key && (key.length > 400 || /\s/.test(key))) throw new AiError("bad_key", "That doesn't look like a key.", 400);
    if (!key && kind === "online") throw new AiError("needs_key", "Paste your key first.", 400);
    return { ...conn, key };
  }
  const testOf = b => !b.can ? { can: null, tested: null } : {
    can: { check: !!b.can.check, chat: !!(b.can.check && b.can.chat), long: !!(b.can.check && b.can.long) },
    tested: { at: Date.now(), results: (Array.isArray(b.results) ? b.results : []).slice(0, 5).map(r => ({ id: String(r.id || "").slice(0, 10), ok: !!r.ok, why: String(r.why || "").slice(0, 200), ms: Math.max(0, Number(r.ms) || 0) })) },
  };
  const aiErr = (c, e) => { if (e instanceof AiError || (e && typeof e.code === "string" && Number.isInteger(e.status))) return c.json({ code: e.code, error: e.message }, e.status); throw e; };

  // The models a service offers you (which also checks the key, for free). In solo, {find: true} looks for LM Studio and Ollama.
  app.post("/api/ai/models", needUser, async c => {
    const u = c.get("user"), b = await body(c);
    if (!aiLimit(String(u.id))) return c.json({ code: "rate_limited", error: "Too many tries at once. Wait a moment." }, 429);
    if (b.find) {
      if (!config.solo) return c.json({ code: "bad_request", error: "Only in solo mode." }, 400);
      const found = await Promise.all(COMPUTER.map(async p => { try { return { provider: p.id, name: p.name, url: p.url, running: true, models: await ai.listModels({ kind: "computer", url: p.url }, { ms: 2500 }) }; } catch { return { provider: p.id, name: p.name, url: p.url, running: false, models: [] }; } }));
      return c.json({ found });
    }
    try { const conn = draftConn(u, b); return c.json({ models: await ai.listModels(conn) }); } catch (e) { return aiErr(c, e); }
  });

  app.put("/api/ai/conn", needUser, async c => {
    const u = c.get("user"), b = await body(c);
    if (!aiLimit(String(u.id))) return c.json({ code: "rate_limited", error: "Too many tries at once. Wait a moment." }, 429);
    let conn;
    try {
      conn = draftConn(u, b);
      conn.model = String(b.model || "").trim().slice(0, 200);
      if (!conn.model) throw new AiError("bad_request", "Pick a model.", 400);
      await ai.listModels(conn); // the key works, and the service is there
    } catch (e) { return aiErr(c, e); }
    const { key, ...keep } = conn;
    const saved = { ...keep, name: nameFor(conn.model), keyHint: key ? "…" + key.slice(-4) : "", ...testOf(b) };
    await db.query("update users set ai_conn = $1, ai_key_enc = $2 where id = $3", [JSON.stringify(saved), key ? encrypt(config.secret, key) : null, u.id]);
    return c.json({ ai: await aiInfo(saved) });
  });

  // What Test it found, so the app knows which parts this AI can be trusted with
  app.patch("/api/ai/conn", needUser, async c => {
    const u = c.get("user"), b = await body(c);
    const now = connOf(u);
    if (now.kind === "claude") return c.json({ code: "bad_request", error: "Pick an AI first." }, 400);
    // Testing this computer's default model keeps it, results and all
    const { key, fromEnv, ...conn } = now;
    Object.assign(conn, testOf(b));
    await db.query("update users set ai_conn = $1, ai_key_enc = $2 where id = $3", [JSON.stringify(conn), key ? encrypt(config.secret, key) : null, u.id]);
    return c.json({ ok: true });
  });

  // Test it, before anything is saved: the same call /api/ai makes, with the AI being set up
  app.post("/api/ai/try", needUser, async c => {
    const u = c.get("user"), b = await body(c);
    if (!aiLimit(String(u.id))) return c.json({ code: "rate_limited", error: "Too many tries at once. Wait a moment." }, 429);
    if (typeof b.prompt !== "string" || !b.prompt.trim() || b.prompt.length > 20000) return c.json({ code: "bad_request", error: "Nothing to ask." }, 400);
    try {
      const conn = draftConn(u, b);
      conn.model = String(b.model || "").trim().slice(0, 200);
      if (!conn.model) throw new AiError("bad_request", "Pick a model.", 400);
      const shape = b.shape && typeof b.shape === "object" && JSON.stringify(b.shape).length < 20000 ? b.shape : null;
      return c.json({ result: (await ai.askAi(conn, b.prompt, { quick: b.tier === "quick", shape })).result });
    } catch (e) { return aiErr(c, e); }
  });

  // Back to Claude (or, in solo, the model this computer runs)
  app.delete("/api/ai/conn", needUser, async c => {
    await db.query("update users set ai_conn = null, ai_key_enc = null where id = $1", [c.get("user").id]);
    return c.json({ ok: true });
  });

  app.put("/api/account/key", needUser, async c => {
    const u = c.get("user");
    const key = String((await body(c)).key || "").trim();
    if (!/^sk-ant-[A-Za-z0-9_-]{20,300}$/.test(key)) return c.json({ code: "bad_key", error: "That doesn't look like a Claude API key. It starts with sk-ant-." }, 400);
    try { if (!(await ai.checkKey(key, config.ai.modelQuick))) return c.json({ code: "bad_key", error: "Claude didn't accept that key. Check you copied all of it." }, 400); }
    catch (e) { return c.json({ code: e.code || "upstream", error: e.message }, e.status || 502); }
    // Saving a Claude key is choosing Claude, so any other AI is set aside
    await db.query("update users set api_key_enc = $1, api_key_hint = $2, ai_conn = null, ai_key_enc = null where id = $3", [encrypt(config.secret, key), "…" + key.slice(-4), u.id]);
    return c.json({ ok: true, keyHint: "…" + key.slice(-4) });
  });

  app.delete("/api/account/key", needUser, async c => {
    await db.query("update users set api_key_enc = null, api_key_hint = null where id = $1", [c.get("user").id]);
    return c.json({ ok: true });
  });

  app.delete("/api/account", needUser, async c => {
    await db.query("delete from users where id = $1", [c.get("user").id]);
    deleteCookie(c, COOKIE, { path: "/" });
    return c.json({ ok: true });
  });

  /* ---------- progress sync: each key wins by its newest change ---------- */
  app.get("/api/progress", needUser, async c => {
    const rows = await db.query("select key, value, t::float8 as t from progress where user_id = $1", [c.get("user").id]);
    const keys = {};
    rows.forEach(r => { keys[r.key] = { v: r.value, t: Number(r.t) }; });
    return c.json({ keys });
  });

  // PUT from the page; the beacon is the same save sent as the page closes
  const saveProgress = async c => {
    const u = c.get("user");
    const incoming = (await body(c)).keys;
    if (!incoming || typeof incoming !== "object") return c.json({ code: "bad_request", error: "Nothing to save." }, 400);
    const entries = Object.entries(incoming).slice(0, 100);
    for (const [k, x] of entries) {
      if (!KEY_RE.test(k) || !x || typeof x.t !== "number" || !(x.v === null || typeof x.v === "string")) return c.json({ code: "bad_request", error: `Can't save ${k}.` }, 400);
      if (x.v && x.v.length > MAX_VALUE) return c.json({ code: "too_big", error: "Some of your progress is too big to save." }, 413);
    }
    const sizes = await db.query("select key, coalesce(length(value), 0) as n from progress where user_id = $1", [u.id]);
    const size = new Map(sizes.map(r => [r.key, Number(r.n)]));
    entries.forEach(([k, x]) => size.set(k, x.v ? x.v.length : 0));
    if ([...size.values()].reduce((a, b) => a + b, 0) > MAX_TOTAL) return c.json({ code: "too_big", error: "Your saved progress is too big to sync." }, 413);
    for (const [k, x] of entries) {
      // A null value records that the key was cleared on a device
      await db.query(
        `insert into progress (user_id, key, value, t) values ($1, $2, $3, $4)
         on conflict (user_id, key) do update set value = excluded.value, t = excluded.t where progress.t < excluded.t`,
        [u.id, k, x.v, Math.round(x.t)]);
    }
    return c.json({ ok: true });
  };
  app.put("/api/progress", needUser, saveProgress);
  app.post("/api/progress-beacon", needUser, saveProgress);

  /* ---------- the AI route: the app's sample.json(prompt, {cache, modelTier}) ---------- */
  app.post("/api/ai", needUser, async c => {
    const u = c.get("user");
    if (!aiLimit(String(u.id))) return c.json({ code: "rate_limited", error: "Too many messages at once. Wait a moment." }, 429);
    const { prompt, tier, cache, shape: shapeIn } = await body(c);
    // The JSON schema an answer must match, for any AI that isn't Claude (its server holds the answer to it)
    const shape = shapeIn && typeof shapeIn === "object" && !Array.isArray(shapeIn) && JSON.stringify(shapeIn).length < 20000 ? shapeIn : null;
    if (typeof prompt !== "string" || !prompt.trim()) return c.json({ code: "bad_request", error: "Nothing to ask." }, 400);
    if (prompt.length > config.ai.maxPromptChars) return c.json({ code: "too_big", error: "That request is too long." }, 413);
    const conn = connOf(u), other = conn.kind !== "claude";
    if (conn.broken) return c.json({ code: "needs_key", error: "Your saved key can't be read any more. Add it again in Your AI." }, 403);
    const quick = tier === "quick", model = other ? `${conn.kind}:${conn.provider || ""}:${conn.model || "loaded"}` : quick ? config.ai.modelQuick : config.ai.modelMain;

    // Shared answers are free: someone already paid for exactly this one
    const hash = cache ? sha256(model + "\n" + prompt) : null;
    if (hash) {
      const hit = await db.query("select body from ai_cache where hash = $1", [hash]);
      if (hit.length) return c.json({ result: JSON.parse(hit[0].body), cached: true });
    }

    // Your own AI: the learner's key or computer pays, so nothing is counted against anyone's allowance
    if (other) {
      try {
        const out = await ai.askAi(conn, prompt, { quick, shape });
        await db.query("insert into ai_usage (user_id, model, input_tokens, output_tokens, cost_micros, own_key) values ($1, $2, $3, $4, 0, true)",
          [u.id, `${conn.kind}:${conn.provider || ""}:${out.model || ""}`, out.usage.input, out.usage.output]);
        if (hash) await db.query("insert into ai_cache (hash, body) values ($1, $2) on conflict (hash) do nothing", [hash, JSON.stringify(out.result)]);
        return c.json({ result: out.result });
      } catch (e) { return aiErr(c, e); }
    }

    // Whose key pays: the learner's own if they added one, otherwise the owner's within the limits
    let apiKey = "", ownKey = false;
    if (u.api_key_enc) {
      try { apiKey = decrypt(config.secret, u.api_key_enc); ownKey = true; }
      catch { return c.json({ code: "needs_key", error: "Your saved Claude key can't be read any more. Add it again in Your AI." }, 403); }
    } else if (config.ai.mode === "byok" || !config.ai.ownerKey) {
      return c.json({ code: "needs_key", error: "Choose an AI in Your AI to use this." }, 403);
    } else {
      if (await spentTodayMicros(u.id) >= config.ai.dailyAllowanceUsd * 1e6) return c.json({ code: "allowance", error: "You've used today's free AI. Add your own Claude key, or another AI, in Your AI for more, or come back tomorrow." }, 429);
      if (config.ai.monthlyBudgetUsd > 0 && await spentMonthMicros() >= config.ai.monthlyBudgetUsd * 1e6) return c.json({ code: "budget", error: "The free AI is paused until next month. Add your own Claude key, or another AI, in Your AI to keep going." }, 429);
      apiKey = config.ai.ownerKey;
    }

    let out;
    try { out = await ai.callClaude({ apiKey, model, prompt, quick }); }
    catch (e) {
      if (e instanceof AiError) return c.json({ code: e.code, error: e.message }, e.status);
      throw e;
    }
    const [pin, pout] = priceOf(model);
    await db.query("insert into ai_usage (user_id, model, input_tokens, output_tokens, cost_micros, own_key) values ($1, $2, $3, $4, $5, $6)",
      [u.id, model, out.usage.input, out.usage.output, Math.ceil(out.usage.input * pin + out.usage.output * pout), ownKey]);
    if (out.refused) return c.json({ code: "refused", error: "Claude wouldn't answer that one." }, 422);
    const result = parseJson(out.text);
    if (result === undefined || result === null || typeof result !== "object") return c.json({ code: "shape", error: "The answer didn't come back in the right shape. Try again." }, 502);
    if (hash) await db.query("insert into ai_cache (hash, body) values ($1, $2) on conflict (hash) do nothing", [hash, JSON.stringify(result)]);
    return c.json({ result });
  });

  /* ---------- the app itself ---------- */
  app.get("/health", c => c.text("ok"));
  app.get("/", c => c.body(files.get("index.html"), 200, { "Content-Type": TYPES[".html"], "Cache-Control": "no-cache" }));
  // Clips are sent in pieces when the browser asks for a range, so it can start playing and loop without fetching it all again
  app.get("/films/:name", c => {
    const name = c.req.param("name");
    if (!FILM_RE.test(name)) return c.notFound();
    const file = path.join(FILMS_DIR, name);
    let size; try { size = fs.statSync(file).size; } catch { return c.notFound(); }
    const head = { "Content-Type": FILM_TYPES[path.extname(name)], "Accept-Ranges": "bytes", "Cache-Control": "public, max-age=86400" };
    const m = /^bytes=(\d*)-(\d*)$/.exec(c.req.header("range") || "");
    if (m && (m[1] || m[2])) {
      let start = m[1] ? +m[1] : Math.max(0, size - +m[2]), end = m[1] && m[2] ? Math.min(+m[2], size - 1) : size - 1;
      if (start >= size || start > end) return c.body(null, 416, { "Content-Range": `bytes */${size}` });
      const buf = Buffer.alloc(end - start + 1), fd = fs.openSync(file, "r");
      try { fs.readSync(fd, buf, 0, buf.length, start); } finally { fs.closeSync(fd); }
      return c.body(buf, 206, { ...head, "Content-Range": `bytes ${start}-${end}/${size}`, "Content-Length": String(buf.length) });
    }
    return c.body(fs.readFileSync(file), 200, { ...head, "Content-Length": String(size) });
  });
  app.get("/vendor/:file", c => { // three.js for 夜城's street, carried with the app
    const f = "vendor/" + c.req.param("file");
    if (!files.has(f)) return c.notFound();
    return c.body(files.get(f), 200, { "Content-Type": TYPES[".js"], "Cache-Control": "public, max-age=86400" });
  });
  app.get("/:file", c => {
    const f = c.req.param("file");
    if (!files.has(f)) return c.notFound();
    return c.body(files.get(f), 200, { "Content-Type": TYPES[path.extname(f)], "Cache-Control": "no-cache" });
  });

  app.onError((e, c) => {
    console.error(e);
    return c.json({ code: "server", error: "Something went wrong on our side." }, 500);
  });
  return app;
}
