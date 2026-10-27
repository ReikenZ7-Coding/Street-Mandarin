// Your AI on the server: any OpenAI-style service (OpenRouter, DeepSeek, GLM, Qwen, Gemini, OpenAI) with the
// learner's own key, or in solo mode a model on this computer (LM Studio, Ollama, llama.cpp). The rules for
// talking to them (house rules, JSON shapes, one more try, stripping thinking) are the page's own, from ai.js.
import { createRequire } from "node:module";
import { AiError } from "./claude.js";

const SM_AI = createRequire(import.meta.url)("../../ai.js");
export const { SYSTEM, PROVIDERS, COMPUTER, nameFor, parseJson } = SM_AI;

const wrap = e => (e && e.code ? new AiError(e.code, e.message, e.status || 502) : new AiError("upstream", "Couldn't reach your AI.", 502));

export async function askAi(conn, prompt, { quick, shape } = {}) {
  try { return await SM_AI.ask(conn, prompt, { quick, shape }); } catch (e) { throw wrap(e); }
}
export async function listModels(conn, opts) {
  try { return await SM_AI.listModels(conn, opts); } catch (e) { throw wrap(e); }
}
// Is a model on this computer up, and which one is loaded? For Your AI.
export async function localStatus(conn) {
  if (conn.model) { try { await SM_AI.listModels(conn, { ms: 3000 }); return { ok: true, model: conn.model }; } catch { return { ok: false, model: conn.model }; } }
  try { const m = (await SM_AI.listModels(conn, { ms: 3000 }))[0]; return { ok: !!m, model: m || "" }; } catch { return { ok: false, model: "" }; }
}

// Only these addresses count as this computer (solo mode); the website never calls a learner's own address
export const isLocalUrl = u => { try { const x = new URL(u); return /^https?:$/.test(x.protocol) && ["localhost", "127.0.0.1", "[::1]"].includes(x.hostname); } catch { return false; } };
