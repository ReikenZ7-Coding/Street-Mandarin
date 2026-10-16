// Your own model: solo mode, and the OpenAI-style local API (LM Studio, Ollama, llama.cpp),
// tested against a stand-in local server
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import http from "node:http";
import { openDb } from "../src/db.js";
import { createApp } from "../src/app.js";
import { loadConfig } from "../src/config.js";

const seen = [];
let reply = () => '{"ok":true}';
const fake = http.createServer((req, res) => {
  let b = ""; req.on("data", d => (b += d)); req.on("end", () => {
    res.setHeader("content-type", "application/json");
    if (req.url === "/v1/models") return res.end(JSON.stringify({ data: [{ id: "qwen3.5-9b-test" }] }));
    const body = JSON.parse(b); seen.push(body);
    res.end(JSON.stringify({ choices: [{ message: { content: reply(body) }, finish_reason: "stop" }], usage: { prompt_tokens: 900, completion_tokens: 120 } }));
  });
});
let port;
before(() => new Promise(r => fake.listen(0, () => { port = fake.address().port; r(); })));
after(() => fake.close());

async function soloApp(env = {}) {
  const db = await openDb("");
  return createApp({ db, config: loadConfig({ SOLO: "1", AI_PROVIDER: "local", LOCAL_AI_URL: `http://localhost:${port}/v1/`, ...env }) });
}
const call = async (app, method, url, body) => {
  const res = await app.request("http://localhost" + url, { method, headers: { host: "localhost", ...(body ? { "content-type": "application/json" } : {}) }, body: body ? JSON.stringify(body) : undefined });
  return { status: res.status, json: await res.json().catch(() => null) };
};

test("solo: always you, no sign-in, nothing to delete", async () => {
  const app = await soloApp();
  const a = (await call(app, "GET", "/api/account")).json;
  assert.equal(a.signedIn, true); assert.equal(a.solo, true); assert.equal(a.canUseAi, true);
  assert.equal(a.localOk, true); assert.equal(a.localModel, "qwen3.5-9b-test");
  assert.equal((await call(app, "POST", "/api/auth/signup", { email: "x@y.co", password: "longenough" })).status, 404);
  assert.equal((await call(app, "DELETE", "/api/account")).status, 403);
  assert.equal((await call(app, "PUT", "/api/progress", { keys: { "sm-said": { v: "3", t: 5 } } })).status, 200);
  assert.equal((await call(app, "GET", "/api/progress")).json.keys["sm-said"].v, "3");
});

test("solo listens only to this computer", () => {
  assert.equal(loadConfig({ SOLO: "1" }).host, "127.0.0.1");
  assert.equal(loadConfig({}).host, "0.0.0.0");
  assert.doesNotThrow(() => loadConfig({ SOLO: "1", NODE_ENV: "production", APP_SECRET: "x".repeat(40) }));
});

test("asks the loaded model, with the house rules, and strips its thinking", async () => {
  const app = await soloApp();
  seen.length = 0;
  reply = () => '<think>The learner said hi, I should reply warmly.</think>\n```json\n{"messages":[{"h":"你好！","p":"Nǐ hǎo!","e":"Hi!"}]}\n```';
  const r = await call(app, "POST", "/api/ai", { prompt: "They just sent: 你好", tier: "quick" });
  assert.equal(r.status, 200);
  assert.deepEqual(r.json.result, { messages: [{ h: "你好！", p: "Nǐ hǎo!", e: "Hi!" }] });
  assert.equal(seen[0].model, "qwen3.5-9b-test");
  assert.equal(seen[0].messages[0].role, "system"); assert.match(seen[0].messages[0].content, /ONE valid JSON object/);
  assert.equal(seen[0].messages[1].content, "They just sent: 你好");
  assert.equal(seen[0].max_tokens, 2000);
});

test("a reply that isn't JSON gets one more try", async () => {
  const app = await soloApp();
  seen.length = 0;
  let n = 0;
  reply = () => (++n === 1 ? "Sure! Here is my answer: the noodles are great." : '{"fixed":true}');
  const r = await call(app, "POST", "/api/ai", { prompt: "Write the chapter" });
  assert.equal(r.status, 200); assert.deepEqual(r.json.result, { fixed: true });
  assert.equal(seen.length, 2); assert.equal(seen[1].messages.at(-1).role, "user"); assert.match(seen[1].messages.at(-1).content, /only the JSON/);
  assert.equal(seen[0].max_tokens, 7000);
  n = 0; reply = () => "still not json";
  assert.equal((await call(app, "POST", "/api/ai", { prompt: "again" })).json.code, "shape");
});

test("LOCAL_AI_MODEL picks the model; a stopped model says how to start it", async () => {
  const pinned = await soloApp({ LOCAL_AI_MODEL: "my-qwen" });
  seen.length = 0; reply = () => '{"a":1}';
  await call(pinned, "POST", "/api/ai", { prompt: "hi", tier: "quick" });
  assert.equal(seen[0].model, "my-qwen");
  const off = createApp({ db: await openDb(""), config: loadConfig({ SOLO: "1", AI_PROVIDER: "local", LOCAL_AI_URL: "http://localhost:9/v1" }) });
  const a = (await call(off, "GET", "/api/account")).json;
  assert.equal(a.localOk, false);
  const r = await call(off, "POST", "/api/ai", { prompt: "hi", tier: "quick" });
  assert.equal(r.status, 503); assert.equal(r.json.code, "model_offline"); assert.match(r.json.error, /LM Studio/);
});

test("the page calls your model by its name, not Claude", async () => {
  const app = await soloApp({ LOCAL_AI_NAME: "Qwen" });
  const js = await (await app.request("http://localhost/client.js")).text();
  assert.match(js, /^window\.SM_AI_NAME = "Qwen";/);
  const plain = createApp({ db: await openDb(""), config: loadConfig({}) });
  assert.doesNotMatch(await (await plain.request("http://localhost/client.js")).text(), /SM_AI_NAME =/);
});
