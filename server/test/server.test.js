// Server tests: accounts, progress sync, the AI route in each mode, with a stand-in for Claude
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { openDb } from "../src/db.js";
import { createApp } from "../src/app.js";
import { loadConfig } from "../src/config.js";
import { parseJson } from "../src/claude.js";

const calls = [];
const fakeAi = {
  async callClaude({ apiKey, model, prompt, quick }) {
    calls.push({ apiKey, model, prompt, quick });
    if (prompt.includes("BROKEN")) return { text: "sorry, no json here", usage: { input: 10, output: 5 } };
    return { text: '```json\n{"messages":[{"h":"你好","p":"Nǐ hǎo","e":"Hi"}]}\n```', usage: { input: 1000, output: 400 } };
  },
  async checkKey(key) { return key.endsWith("good-key-0000000000000000"); },
};

const dbs = [];
after(async () => { for (const d of dbs) await d.close(); });
async function makeApp(env = {}) {
  // TEST_DATABASE_URL runs the same tests on a real Postgres server, each app in a fresh schema
  const db = await openDb(process.env.TEST_DATABASE_URL || "", { schema: "t" + Date.now() + Math.random().toString(36).slice(2, 6) });
  dbs.push(db);
  const config = loadConfig({ AI_MODE: "byok", APP_SECRET: "x".repeat(40), ...env });
  return createApp({ db, config, ai: fakeAi });
}

// A tiny browser: keeps the session cookie and sends JSON from the site's own origin
let n = 0;
function browser(app) {
  let cookie = "";
  const addr = "10.0.0." + (++n);
  return async (method, url, body, headers = {}) => {
    const res = await app.request("http://sm.test" + url, {
      method,
      headers: { host: "sm.test", origin: "http://sm.test", "x-forwarded-for": addr, ...(body ? { "content-type": "application/json" } : {}), ...(cookie ? { cookie } : {}), ...headers },
      body: body ? JSON.stringify(body) : undefined,
    });
    const set = res.headers.get("set-cookie");
    if (set) cookie = set.split(";")[0].endsWith("=") ? "" : set.split(";")[0];
    const text = await res.text();
    let json; try { json = JSON.parse(text); } catch {}
    return { status: res.status, json, text, headers: res.headers };
  };
}

let app;
before(async () => { app = await makeApp(); });

test("serves the app with client.js added, and nothing else from the repo", async () => {
  const b = browser(app);
  const home = await b("GET", "/");
  assert.equal(home.status, 200);
  assert.match(home.text, /<script src="client.js"><\/script>\n<script src="scenes.js">/);
  assert.equal((await b("GET", "/client.js")).status, 200);
  assert.equal((await b("GET", "/people.js")).status, 200);
  for (const p of ["/README.md", "/server/src/app.js", "/.git/config", "/..%2Fpackage.json", "/package.json"]) assert.equal((await b("GET", p)).status, 404, p);
});

test("serves the filmed world's clips, in ranges when asked, and nothing else from films/", async () => {
  const fs = await import("node:fs"), path = await import("node:path"), { fileURLToPath } = await import("node:url");
  const file = path.join(path.dirname(fileURLToPath(import.meta.url)), "../../films/zz-test.webm");
  fs.writeFileSync(file, Buffer.from("0123456789"));
  try {
    const whole = await app.request("http://sm.test/films/zz-test.webm");
    assert.equal(whole.status, 200); assert.equal(whole.headers.get("content-type"), "video/webm"); assert.equal(await whole.text(), "0123456789");
    const part = await app.request("http://sm.test/films/zz-test.webm", { headers: { range: "bytes=2-5" } });
    assert.equal(part.status, 206); assert.equal(part.headers.get("content-range"), "bytes 2-5/10"); assert.equal(await part.text(), "2345");
    const tail = await app.request("http://sm.test/films/zz-test.webm", { headers: { range: "bytes=-3" } });
    assert.equal(await tail.text(), "789");
    assert.equal((await app.request("http://sm.test/films/zz-test.webm", { headers: { range: "bytes=20-" } })).status, 416);
    for (const p of ["/films/.gitkeep", "/films/..%2Fpackage.json", "/films/zz-test.mp4", "/films/missing.webm"]) assert.equal((await app.request("http://sm.test" + p)).status, 404, p);
    assert.equal((await app.request("http://sm.test/films.js")).status, 200);
  } finally { fs.unlinkSync(file); }
});

test("sign up, sign out, sign in", async () => {
  const b = browser(app);
  assert.equal((await b("GET", "/api/account")).json.signedIn, false);
  assert.equal((await b("POST", "/api/auth/signup", { email: "bad", password: "longenough" })).json.code, "bad_email");
  assert.equal((await b("POST", "/api/auth/signup", { email: "a@b.co", password: "short" })).json.code, "bad_password");
  assert.equal((await b("POST", "/api/auth/signup", { email: " Matt@Example.com ", password: "longenough" })).status, 200);
  const acct = (await b("GET", "/api/account")).json;
  assert.equal(acct.signedIn, true); assert.equal(acct.email, "matt@example.com"); assert.equal(acct.canUseAi, false); assert.equal(acct.mode, "byok");
  assert.equal((await b("POST", "/api/auth/signup", { email: "matt@example.com", password: "longenough" })).json.code, "taken");
  await b("POST", "/api/auth/logout", {});
  assert.equal((await b("GET", "/api/account")).json.signedIn, false);
  assert.equal((await b("POST", "/api/auth/login", { email: "matt@example.com", password: "wrongwrong" })).json.code, "bad_login");
  assert.equal((await b("POST", "/api/auth/login", { email: "nobody@example.com", password: "wrongwrong" })).json.code, "bad_login");
  assert.equal((await b("POST", "/api/auth/login", { email: "MATT@example.com", password: "longenough" })).status, 200);
  assert.equal((await b("GET", "/api/account")).json.signedIn, true);
});

test("sign-ups are limited per address", async () => {
  const lim = await makeApp();
  const b = browser(lim);
  for (let i = 0; i < 5; i++) assert.equal((await b("POST", "/api/auth/signup", { email: `s${i}@example.com`, password: "longenough" })).status, 200);
  assert.equal((await b("POST", "/api/auth/signup", { email: "s9@example.com", password: "longenough" })).status, 429);
});

test("changes must come from the site itself, as JSON", async () => {
  const b = browser(app);
  assert.equal((await b("POST", "/api/auth/signup", { email: "x@y.co", password: "longenough" }, { origin: "https://evil.example" })).status, 403);
  const res = await app.request("http://sm.test/api/auth/login", { method: "POST", headers: { host: "sm.test", "content-type": "text/plain" }, body: "{}" });
  assert.equal(res.status, 415);
});

test("progress syncs between devices, newest change wins per key", async () => {
  const phone = browser(app), laptop = browser(app);
  await phone("POST", "/api/auth/signup", { email: "sync@example.com", password: "longenough" });
  await laptop("POST", "/api/auth/login", { email: "sync@example.com", password: "longenough" });
  assert.equal((await phone("PUT", "/api/progress", { keys: { "sm-notes": { v: "[1]", t: 100 }, "sm-done": { v: "{}", t: 100 } } })).status, 200);
  assert.deepEqual((await laptop("GET", "/api/progress")).json.keys["sm-notes"], { v: "[1]", t: 100 });
  // An older change doesn't overwrite a newer one
  await laptop("PUT", "/api/progress", { keys: { "sm-notes": { v: "[old]", t: 50 }, "sm-done": { v: '{"noodles":1}', t: 200 } } });
  const k = (await phone("GET", "/api/progress")).json.keys;
  assert.equal(k["sm-notes"].v, "[1]"); assert.equal(k["sm-done"].v, '{"noodles":1}');
  // Cleared on one device is cleared everywhere
  await phone("PUT", "/api/progress", { keys: { "sm-notes": { v: null, t: 300 } } });
  assert.equal((await laptop("GET", "/api/progress")).json.keys["sm-notes"].v, null);
  // Only the app's own keys, and not too big
  assert.equal((await phone("PUT", "/api/progress", { keys: { "evil": { v: "x", t: 1 } } })).status, 400);
  assert.equal((await phone("PUT", "/api/progress", { keys: { "sm-big": { v: "x".repeat(2_000_001), t: 1 } } })).status, 413);
  // The page-close beacon saves the same way
  assert.equal((await phone("POST", "/api/progress-beacon", { keys: { "sm-said": { v: "12", t: 400 } } })).status, 200);
  assert.equal((await laptop("GET", "/api/progress")).json.keys["sm-said"].v, "12");
  // Someone else can't see it
  const other = browser(app);
  await other("POST", "/api/auth/signup", { email: "other@example.com", password: "longenough" });
  assert.deepEqual((await other("GET", "/api/progress")).json.keys, {});
  assert.equal((await browser(app)("GET", "/api/progress")).status, 401);
});

test("byok: the AI needs your own key, which is checked, stored encrypted and never sent back", async () => {
  const b = browser(app);
  await b("POST", "/api/auth/signup", { email: "key@example.com", password: "longenough" });
  assert.equal((await b("POST", "/api/ai", { prompt: "hi", tier: "quick" })).json.code, "needs_key");
  assert.equal((await b("PUT", "/api/account/key", { key: "not-a-key" })).json.code, "bad_key");
  assert.equal((await b("PUT", "/api/account/key", { key: "sk-ant-api03-wrong-key-00000000000000000" })).json.code, "bad_key");
  const key = "sk-ant-api03-good-key-0000000000000000";
  assert.equal((await b("PUT", "/api/account/key", { key })).status, 200);
  const acct = await b("GET", "/api/account");
  assert.equal(acct.json.hasKey, true); assert.equal(acct.json.keyHint, "…0000"); assert.ok(!acct.text.includes("good-key"));
  calls.length = 0;
  const r = await b("POST", "/api/ai", { prompt: "Say hi as 陈老板", tier: "quick" });
  assert.equal(r.status, 200);
  assert.deepEqual(r.json.result, { messages: [{ h: "你好", p: "Nǐ hǎo", e: "Hi" }] });
  assert.equal(calls[0].apiKey, key); assert.equal(calls[0].model, "claude-haiku-5-5"); assert.equal(calls[0].quick, true);
  await b("POST", "/api/ai", { prompt: "Write the chapter" });
  assert.equal(calls[1].model, "claude-opus-5-5"); assert.equal(calls[1].quick, false);
  assert.equal((await b("POST", "/api/ai", { prompt: "BROKEN" })).json.code, "shape");
  assert.equal((await b("POST", "/api/ai", { prompt: "x".repeat(130000) })).status, 413);
  await b("DELETE", "/api/account/key");
  assert.equal((await b("POST", "/api/ai", { prompt: "hi" })).json.code, "needs_key");
});

test("shared answers are paid for once", async () => {
  const a = browser(app), b2 = browser(app);
  for (const [b, e] of [[a, "c1@example.com"], [b2, "c2@example.com"]]) {
    await b("POST", "/api/auth/signup", { email: e, password: "longenough" });
    await b("PUT", "/api/account/key", { key: "sk-ant-api03-good-key-0000000000000000" });
  }
  calls.length = 0;
  const p = { prompt: 'How do I say "see you tomorrow"?', tier: "quick", cache: true };
  assert.equal((await a("POST", "/api/ai", p)).json.cached, undefined);
  assert.equal((await b2("POST", "/api/ai", p)).json.cached, true);
  assert.equal(calls.length, 1);
});

test("mix mode: a free daily allowance on the owner's key, then your own key", async () => {
  const mix = await makeApp({ AI_MODE: "mix", ANTHROPIC_API_KEY: "sk-ant-owner", DAILY_ALLOWANCE_USD: "0.001" });
  const b = browser(mix);
  await b("POST", "/api/auth/signup", { email: "mix@example.com", password: "longenough" });
  const acct = (await b("GET", "/api/account")).json;
  assert.equal(acct.canUseAi, true); assert.equal(acct.freeToday, true);
  calls.length = 0;
  // Haiku: 1000 in, 400 out = 0.0001 + 0.0002 = $0.0003 a call, so the 4th call is over $0.001
  for (let i = 0; i < 4; i++) assert.equal((await b("POST", "/api/ai", { prompt: "hi " + i, tier: "quick" })).status, 200);
  assert.equal(calls[0].apiKey, "sk-ant-owner");
  const over = await b("POST", "/api/ai", { prompt: "one more", tier: "quick" });
  assert.equal(over.status, 429); assert.equal(over.json.code, "allowance");
  assert.equal((await b("GET", "/api/account")).json.canUseAi, false);
  await b("PUT", "/api/account/key", { key: "sk-ant-api03-good-key-0000000000000000" });
  assert.equal((await b("POST", "/api/ai", { prompt: "mine now", tier: "quick" })).status, 200);
  assert.equal(calls.at(-1).apiKey, "sk-ant-api03-good-key-0000000000000000");
});

test("owner mode stops at the monthly budget", async () => {
  const own = await makeApp({ AI_MODE: "owner", ANTHROPIC_API_KEY: "sk-ant-owner", DAILY_ALLOWANCE_USD: "1", MONTHLY_BUDGET_USD: "0.0005" });
  const b = browser(own);
  await b("POST", "/api/auth/signup", { email: "own@example.com", password: "longenough" });
  for (let i = 0; i < 2; i++) assert.equal((await b("POST", "/api/ai", { prompt: "hi " + i, tier: "quick" })).status, 200);
  assert.equal((await b("POST", "/api/ai", { prompt: "again", tier: "quick" })).json.code, "budget");
});

test("deleting an account removes everything in it", async () => {
  const b = browser(app);
  await b("POST", "/api/auth/signup", { email: "gone@example.com", password: "longenough" });
  await b("PUT", "/api/progress", { keys: { "sm-notes": { v: "[1]", t: 1 } } });
  assert.equal((await b("DELETE", "/api/account")).status, 200);
  assert.equal((await b("GET", "/api/account")).json.signedIn, false);
  assert.equal((await browser(app)("POST", "/api/auth/login", { email: "gone@example.com", password: "longenough" })).json.code, "bad_login");
});

test("parseJson copes with fences and chatter", () => {
  assert.deepEqual(parseJson('{"a":1}'), { a: 1 });
  assert.deepEqual(parseJson('```json\n{"a":1}\n```'), { a: 1 });
  assert.deepEqual(parseJson('Here you go: {"a":[1,2]} hope that helps'), { a: [1, 2] });
  assert.equal(parseJson("no json"), undefined);
});

test("production refuses a weak secret", () => {
  assert.throws(() => loadConfig({ NODE_ENV: "production", APP_SECRET: "short", DATABASE_URL: "postgres://x" }));
  assert.throws(() => loadConfig({ NODE_ENV: "production", APP_SECRET: "x".repeat(40) }));
  assert.doesNotThrow(() => loadConfig({ NODE_ENV: "production", APP_SECRET: "x".repeat(40), DATABASE_URL: "postgres://x" }));
  assert.throws(() => loadConfig({ AI_MODE: "free-for-all" }));
});
