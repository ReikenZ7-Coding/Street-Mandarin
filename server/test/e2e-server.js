// Runs the real server with stand-ins for Claude and the online AIs, for browser tests: node test/e2e-server.js [port]
import { serve } from "@hono/node-server";
import { openDb } from "../src/db.js";
import { createApp } from "../src/app.js";
import { loadConfig } from "../src/config.js";
import { createRequire } from "node:module";

// The online AIs' real addresses aren't called in a test: the stand-in model answers for them
const { answer } = createRequire(import.meta.url)("../../tests/browser/ai/standin-model.js");

const port = Number(process.argv[2] || 8799);
const ai = {
  async checkKey(key) { return key.includes("good"); },
  async callClaude({ prompt }) {
    const usage = { input: 500, output: 200 };
    if (prompt.includes("They just sent")) return { usage, text: JSON.stringify({ messages: [{ h: "好啊，明天见！", p: "Hǎo a, míngtiān jiàn!", e: "Sure, see you tomorrow!" }], you: { h: "明天见", p: "Míngtiān jiàn", e: "See you tomorrow" }, verdict: "good", note: "", better_h: "", better_p: "", tag: "", about: "" }) };
    if (prompt.includes("How do I say") || prompt.includes("wants to text this")) return { usage, text: JSON.stringify({ options: [{ h: "明天见", p: "Míngtiān jiàn", e: "See you tomorrow", note: "The usual goodbye." }] }) };
    return { usage, text: "{}" };
  },
  async listModels(conn) {
    if (!String(conn.key).includes("good")) throw Object.assign(new Error("DeepSeek didn't accept that key. Check you copied all of it."), { code: "bad_key", status: 400 });
    return ["deepseek-chat", "deepseek-lax"];
  },
  async askAi(conn, prompt) { return { result: answer(prompt, conn.model), usage: { input: 100, output: 50 }, model: conn.model }; },
};
const db = await openDb("");
const app = createApp({ db, config: loadConfig({ AI_MODE: process.env.AI_MODE || "byok", APP_SECRET: "e2e".repeat(20) }), ai });
serve({ fetch: app.fetch, port }, () => console.log("e2e server on", port));
