// Your AI: choosing an online AI with your own key, or (solo) a model on this computer, what Test it found,
// and going back to Claude. The website only ever calls the known services, never an address a learner gives.
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { createRequire } from "node:module";
import { openDb } from "../src/db.js";
import { createApp } from "../src/app.js";
import { loadConfig } from "../src/config.js";

const SM_AI = createRequire(import.meta.url)("../../ai.js");

// A stand-in OpenAI-style service: it knows one key, lists two models, and answers in JSON
const seen = [];
const fake = http.createServer((req, res) => {
  let b = ""; req.on("data", d => (b += d)); req.on("end", () => {
    res.setHeader("content-type", "application/json");
    if (req.headers.authorization && req.headers.authorization !== "Bearer sk-right-key") { res.statusCode = 401; return res.end('{"error":"bad key"}'); }
    if (req.url === "/v1/models") return res.end(JSON.stringify({ data: [{ id: "deepseek-chat" }, { id: "text-embedding-3" }, { id: "qwen3-8b" }] }));
    const body = JSON.parse(b); seen.push({ body, auth: req.headers.authorization });
    res.end(JSON.stringify({ choices: [{ message: { content: '{"ok":"' + body.model + '"}' }, finish_reason: "stop" }], usage: { prompt_tokens: 10, completion_tokens: 5 } }));
  });
});
let port;
before(() => new Promise(r => fake.listen(0, () => { port = fake.address().port; r(); })));
after(() => fake.close());

const dbs = [];
after(async () => { for (const d of dbs) await d.close(); });
async function makeApp(env = {}, ai = {}) {
  const db = await openDb(""); dbs.push(db);
  return createApp({ db, config: loadConfig({ APP_SECRET: "y".repeat(40), ...env }), ai });
}
function browser(app) {
  let cookie = "";
  return async (method, url, body) => {
    const res = await app.request("http://sm.test" + url, { method, headers: { host: "sm.test", origin: "http://sm.test", ...(body ? { "content-type": "application/json" } : {}), ...(cookie ? { cookie } : {}) }, body: body ? JSON.stringify(body) : undefined });
    const set = res.headers.get("set-cookie"); if (set) cookie = set.split(";")[0];
    return { status: res.status, json: await res.json().catch(() => null) };
  };
}

test("website: an online AI with your key, tested, then back to Claude", async () => {
  const asked = [];
  // The known services' real addresses can't be called from a test, so the call itself is stood in for
  const app = await makeApp({}, {
    async listModels(conn) { asked.push(["models", conn.url, conn.key]); if (conn.key !== "sk-right-key") throw Object.assign(new Error("DeepSeek didn't accept that key."), { code: "bad_key", status: 400 }); return ["deepseek-chat", "deepseek-reasoner"]; },
    async askAi(conn, prompt) { asked.push(["ask", conn.model, conn.key, prompt]); return { result: { messages: [] }, usage: { input: 5, output: 5 }, model: conn.model }; },
  });
  const b = browser(app);
  assert.equal((await b("POST", "/api/ai/models", { provider: "deepseek", key: "sk-right-key" })).status, 401); // signed out
  await b("POST", "/api/auth/signup", { email: "a@b.co", password: "longenough" });
  assert.equal((await b("GET", "/api/account")).json.ai.kind, "claude");
  assert.equal((await b("POST", "/api/ai/models", { provider: "deepseek", key: "sk-wrong" })).json.code, "bad_key");
  assert.deepEqual((await b("POST", "/api/ai/models", { provider: "deepseek", key: "sk-right-key" })).json.models, ["deepseek-chat", "deepseek-reasoner"]);
  // the service's own address is used, whatever the page sends
  await b("POST", "/api/ai/models", { provider: "deepseek", key: "sk-right-key", url: "http://169.254.169.254/latest" });
  assert.ok(asked.every(a => a[0] !== "models" || a[1] === "https://api.deepseek.com/v1"));
  const put = await b("PUT", "/api/ai/conn", { kind: "online", provider: "deepseek", key: "sk-right-key", model: "deepseek-chat" });
  assert.equal(put.status, 200); assert.equal(put.json.ai.name, "DeepSeek"); assert.equal(put.json.ai.keyHint, "…-key"); assert.equal(put.json.ai.can, null);
  const acct = (await b("GET", "/api/account")).json;
  assert.equal(acct.canUseAi, true); assert.equal(acct.ai.provider, "deepseek"); assert.equal(JSON.stringify(acct).includes("sk-right-key"), false);
  // requests go to it, with the key, and cost nobody's allowance
  const r = await b("POST", "/api/ai", { prompt: "They just sent: 你好", tier: "quick" });
  assert.equal(r.status, 200); assert.deepEqual(asked.at(-1).slice(0, 3), ["ask", "deepseek-chat", "sk-right-key"]);
  // another model from the same service keeps the saved key
  assert.equal((await b("PUT", "/api/ai/conn", { kind: "online", provider: "deepseek", model: "deepseek-reasoner" })).status, 200);
  await b("POST", "/api/ai", { prompt: "hi" }); assert.deepEqual(asked.at(-1).slice(0, 3), ["ask", "deepseek-reasoner", "sk-right-key"]);
  // what Test it found
  assert.equal((await b("PATCH", "/api/ai/conn", { can: { check: true, chat: true, long: false }, results: [{ id: "long", ok: false, why: "out of shape", ms: 900 }] })).status, 200);
  assert.deepEqual((await b("GET", "/api/account")).json.ai.can, { check: true, chat: true, long: false });
  // back to Claude
  await b("DELETE", "/api/ai/conn");
  assert.equal((await b("GET", "/api/account")).json.ai.kind, "claude");
  assert.equal((await b("POST", "/api/ai", { prompt: "hi" })).json.code, "needs_key");
});

test("website: no addresses of your own, and no model on your computer through the server", async () => {
  const app = await makeApp({}, { async listModels() { throw new Error("should not be called"); } });
  const b = browser(app);
  await b("POST", "/api/auth/signup", { email: "c@d.co", password: "longenough" });
  for (const draft of [{ provider: "other", url: "http://10.0.0.5/v1", key: "k" }, { kind: "computer", url: "http://localhost:1234/v1" }, { provider: "nope", key: "k" }]) {
    const r = await b("POST", "/api/ai/models", draft);
    assert.equal(r.status, 400, JSON.stringify(draft));
  }
  assert.equal((await b("PUT", "/api/ai/conn", { kind: "computer", url: "http://localhost:1234/v1", model: "x" })).status, 400);
  assert.equal((await b("POST", "/api/ai/models", { find: true })).status, 400);
});

test("saving a Claude key chooses Claude", async () => {
  const app = await makeApp({}, { async checkKey() { return true; }, async listModels() { return ["m"]; } });
  const b = browser(app);
  await b("POST", "/api/auth/signup", { email: "e@f.co", password: "longenough" });
  await b("PUT", "/api/ai/conn", { provider: "gemini", key: "AIzaKey", model: "gemini-2.5-flash" });
  assert.equal((await b("GET", "/api/account")).json.ai.name, "Gemini");
  await b("PUT", "/api/account/key", { key: "sk-ant-" + "a".repeat(30) });
  assert.equal((await b("GET", "/api/account")).json.ai.kind, "claude");
});

test("solo: any address of your own, and a model on this computer, found and used through the real call", async () => {
  const app = await makeApp({ SOLO: "1", AI_PROVIDER: "local", LOCAL_AI_URL: "http://localhost:9/v1" });
  const b = browser(app);
  const found = (await b("POST", "/api/ai/models", { find: true })).json.found;
  assert.deepEqual(found.map(f => f.provider), ["lmstudio", "ollama"]);
  // a model on this computer at an address of its own (llama.cpp, say)
  const url = `http://127.0.0.1:${port}/v1`;
  assert.deepEqual((await b("POST", "/api/ai/models", { kind: "computer", url })).json.models, ["deepseek-chat", "qwen3-8b"]);
  assert.equal((await b("POST", "/api/ai/models", { kind: "computer", url: "http://192.168.1.4:1234/v1" })).status, 400);
  assert.equal((await b("PUT", "/api/ai/conn", { kind: "computer", url, model: "qwen3-8b" })).status, 200);
  const a = (await b("GET", "/api/account")).json.ai;
  assert.equal(a.kind, "computer"); assert.equal(a.ok, true); assert.equal(a.name, "Qwen");
  seen.length = 0;
  assert.deepEqual((await b("POST", "/api/ai", { prompt: "hi", tier: "quick" })).json.result, { ok: "qwen3-8b" });
  assert.equal(seen[0].body.messages[0].content, SM_AI.SYSTEM);
  // an online service of your own choosing, with a key
  assert.equal((await b("PUT", "/api/ai/conn", { provider: "other", url: `http://localhost:${port}/v1`, key: "sk-wrong", model: "deepseek-chat" })).json.code, "bad_key");
  assert.equal((await b("PUT", "/api/ai/conn", { provider: "other", url: `http://localhost:${port}/v1`, key: "sk-right-key", model: "deepseek-chat" })).status, 200);
  seen.length = 0; await b("POST", "/api/ai", { prompt: "hi" });
  assert.equal(seen[0].auth, "Bearer sk-right-key"); assert.equal(seen[0].body.max_tokens, 12000);
  // back to the model this computer runs by default
  await b("DELETE", "/api/ai/conn");
  assert.equal((await b("GET", "/api/account")).json.ai.fromEnv, true);
});

test("ai.js: names, model lists, and Test it", async () => {
  assert.equal(SM_AI.nameFor("qwen/qwen3.5-9b"), "Qwen"); assert.equal(SM_AI.nameFor("deepseek-chat"), "DeepSeek");
  assert.equal(SM_AI.nameFor("glm-4.6"), "GLM"); assert.equal(SM_AI.nameFor("anthropic/claude-sonnet-5-5"), "Claude");
  assert.equal(SM_AI.nameFor("gpt-5-mini"), "GPT"); assert.equal(SM_AI.nameFor("models/gemini-2.5-flash"), "Gemini"); assert.equal(SM_AI.nameFor("x"), "your AI");
  assert.deepEqual(await SM_AI.listModels({ kind: "online", url: `http://localhost:${port}/v1/`, key: "sk-right-key" }), ["deepseek-chat", "qwen3-8b"]);
  // a model that gets everything right passes all three; one that calls a wrong answer right fails checking, and so everything
  const good = async p => /几位/.test(p) ? { results: [{ n: 1, verdict: "good", better: "" }, { n: 2, verdict: "wrong", better: "两位。" }, { n: 3, verdict: "good", better: "" }, { n: 4, verdict: "wrong", better: "不要，谢谢。" }] }
    : /小陈/.test(p) ? { messages: [{ h: "我在上班呢！你呢？", p: "Wǒ zài shàngbān ne! Nǐ ne?", e: "I'm at work! You?" }] }
    : { title_english: "Dumplings", blocks: [{ t: "n", text: "Steam." }, { t: "l", who: "王阿姨", h: "来啦！", p: "Lái la!", e: "Here you are!" }, { t: "n", text: "She smiles." }, { t: "l", who: "王阿姨", h: "吃什么？", p: "Chī shénme?", e: "What'll you have?" }],
      moment: { prompt: "Ask for a bowl of dumplings.", opts: [{ h: "我要一碗饺子。", p: "Wǒ yào yì wǎn jiǎozi.", e: "A bowl of dumplings.", k: "good", note: "Natural.", r: ["好嘞！", "Hǎo lei!", "Coming!"] }, { h: "饺子。", p: "Jiǎozi.", e: "Dumplings.", k: "okay", note: "Blunt.", r: ["一碗？", "Yì wǎn?", "One bowl?"] }, { h: "我是饺子。", p: "Wǒ shì jiǎozi.", e: "I am a dumpling.", k: "wrong", note: "是 is 'to be'.", r: ["啊？", "Á?", "Huh?"] }] } };
  const all = await SM_AI.test(good);
  assert.deepEqual(all.can, { check: true, chat: true, long: true });
  const lax = async (p, o) => /几位/.test(p) ? { results: [1, 2, 3, 4].map(n => ({ n, verdict: "good", better: "" })) } : good(p, o);
  const r = await SM_AI.test(lax);
  assert.deepEqual(r.can, { check: false, chat: false, long: false }); assert.match(r.results[0].why, /called a wrong one right/);
  const numbers = async (p, o) => /小陈/.test(p) ? { messages: [{ h: "我在上班", p: "wo3 zai4 shang4ban1", e: "At work" }] } : good(p, o);
  assert.match((await SM_AI.test(numbers)).results[1].why, /tone marks/);
  // not reaching it isn't a verdict: it stops and says why
  await assert.rejects(SM_AI.test(async () => { throw Object.assign(new Error("off"), { code: "model_offline" }); }), /off/);
});
