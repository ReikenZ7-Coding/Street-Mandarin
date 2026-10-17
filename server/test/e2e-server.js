// Runs the real server with a stand-in for Claude, for browser tests: node test/e2e-server.js [port]
import { serve } from "@hono/node-server";
import { openDb } from "../src/db.js";
import { createApp } from "../src/app.js";
import { loadConfig } from "../src/config.js";

const port = Number(process.argv[2] || 8799);
const ai = {
  async checkKey(key) { return key.includes("good"); },
  async callClaude({ prompt }) {
    const usage = { input: 500, output: 200 };
    if (prompt.includes("They just sent")) return { usage, text: JSON.stringify({ messages: [{ h: "好啊，明天见！", p: "Hǎo a, míngtiān jiàn!", e: "Sure, see you tomorrow!" }], you: { h: "明天见", p: "Míngtiān jiàn", e: "See you tomorrow" }, verdict: "good", note: "", better_h: "", better_p: "", tag: "", about: "" }) };
    if (prompt.includes("How do I say") || prompt.includes("wants to text this")) return { usage, text: JSON.stringify({ options: [{ h: "明天见", p: "Míngtiān jiàn", e: "See you tomorrow", note: "The usual goodbye." }] }) };
    return { usage, text: "{}" };
  },
};
const db = await openDb("");
const app = createApp({ db, config: loadConfig({ AI_MODE: process.env.AI_MODE || "byok", APP_SECRET: "e2e".repeat(20) }), ai });
serve({ fetch: app.fetch, port }, () => console.log("e2e server on", port));
