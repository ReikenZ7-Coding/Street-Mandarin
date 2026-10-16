// A model running on your own computer, through the OpenAI-style API that LM Studio, Ollama and
// llama.cpp all offer. Small models need firmer instructions than Claude, so the rules for every
// answer live here, in one system prompt, and a reply that isn't clean JSON gets one more try.
import { AiError } from "./claude.js";

export const LOCAL_SYSTEM = `You are the AI inside Street Mandarin, an app for learning Mandarin through real situations in China. The learner is a beginner to lower-intermediate.
Rules for every answer:
- Do exactly what the request asks, and reply with ONE valid JSON object in the shape it gives. No code fences, no comments, no text before or after the JSON.
- Chinese is simplified characters, natural and spoken, the way people in mainland China really talk.
- Pinyin uses tone marks (nǐ hǎo), never tone numbers, with words joined as in a dictionary.
- English is plain and natural.
- When you play a character, stay in character, keep it friendly and everyday, and keep to what that person would really say. Never mention that you are an AI.
- When you judge the learner's Chinese, be accurate and kind: a slip is something a local would find odd or misunderstand, not a matter of style.`;

const stripThinking = t => String(t || "").replace(/<think>[\s\S]*?<\/think>/g, "").replace(/^[\s\S]*<\/think>/, "").trim();

let cachedModel = { url: "", name: "", at: 0 };
export async function localModelName({ localUrl, localModel, localKey }) {
  if (localModel) return localModel;
  if (cachedModel.url === localUrl && Date.now() - cachedModel.at < 60000) return cachedModel.name;
  const r = await fetch(localUrl + "/models", { headers: localKey ? { authorization: `Bearer ${localKey}` } : {}, signal: AbortSignal.timeout(4000) });
  if (!r.ok) throw new Error("models " + r.status);
  const j = await r.json();
  const name = (j.data || [])[0]?.id || "";
  cachedModel = { url: localUrl, name, at: Date.now() };
  return name;
}

// Is the local model up? For the Account dialog.
export async function localStatus(ai) {
  try { const name = await localModelName(ai); return { ok: !!name, model: name }; }
  catch { return { ok: false, model: ai.localModel || "" }; }
}

// Servers that can hold an answer to a JSON schema (LM Studio, Ollama, llama.cpp) get one: a small
// model then can't wander off into chatter, a half-closed bracket or a missing field. A server
// that refuses the option is remembered and asked plainly from then on.
const noSchema = new Set();
const ANY_OBJECT = { type: "object" };

export async function callLocal(ai, { prompt, quick, retryNote, shape }) {
  let model;
  try { model = await localModelName(ai); } catch { model = ""; }
  if (!model) throw new AiError("model_offline", "Your local AI isn't running. Start the server in LM Studio (or Ollama) with your model loaded, then try again.", 503);
  const messages = [{ role: "system", content: LOCAL_SYSTEM }, { role: "user", content: prompt }];
  if (retryNote) messages.push({ role: "assistant", content: retryNote.previous }, { role: "user", content: retryNote.ask });
  const ask = withSchema => fetch(ai.localUrl + "/chat/completions", {
    method: "POST",
    headers: { "content-type": "application/json", ...(ai.localKey ? { authorization: `Bearer ${ai.localKey}` } : {}) },
    body: JSON.stringify({
      model, messages, temperature: quick ? 0.6 : 0.8, max_tokens: quick ? 2000 : 7000, stream: false,
      ...(withSchema ? { response_format: { type: "json_schema", json_schema: { name: "answer", strict: true, schema: shape || ANY_OBJECT } } } : {}),
    }),
    signal: AbortSignal.timeout(quick ? 120000 : 600000),
  });
  let r;
  try {
    const withSchema = !noSchema.has(ai.localUrl);
    r = await ask(withSchema);
    if (withSchema && r.status >= 400 && r.status < 500) {
      const t = await r.clone().text().catch(() => "");
      if (/response_format|json_schema|schema|grammar/i.test(t)) { noSchema.add(ai.localUrl); r = await ask(false); }
    }
  } catch (e) {
    if (e && e.name === "TimeoutError") throw new AiError("rate_limited", "Your local AI took too long. Try again, or try a shorter request.", 504);
    throw new AiError("model_offline", "Your local AI isn't running. Start the server in LM Studio (or Ollama) with your model loaded, then try again.", 503);
  }
  if (!r.ok) {
    const t = await r.text().catch(() => "");
    if (/context|too long|exceed/i.test(t)) throw new AiError("too_big", "That's too long for your local AI's context window. Raise the context length in LM Studio (16384 or more).", 413);
    throw new AiError("upstream", "Your local AI couldn't answer that time.", 502);
  }
  const j = await r.json();
  const choice = (j.choices || [])[0] || {};
  const u = j.usage || {};
  return {
    text: stripThinking(choice.message && choice.message.content),
    usage: { input: u.prompt_tokens || 0, output: u.completion_tokens || 0 },
    truncated: choice.finish_reason === "length",
    model,
  };
}
