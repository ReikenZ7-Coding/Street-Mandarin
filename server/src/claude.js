// The one place the server talks to Claude. The app's prompts each ask for a JSON object,
// so this returns the model's text and token usage, and parseJson pulls the object out.
import Anthropic from "@anthropic-ai/sdk";

const SYSTEM = "You are the AI inside Street Mandarin, an app for learning Mandarin through real situations. Reply with exactly the JSON the request asks for: no code fences and no text before or after it.";
// Models that can hand a declined request to another model inside the same call
const FALLBACK_MODELS = new Set(["claude-opus-5-5", "claude-opus-5", "claude-sonnet-5-5", "claude-fable-5-1"]);

export class AiError extends Error {
  constructor(code, message, status = 502) { super(message); this.code = code; this.status = status; }
}

export async function callClaude({ apiKey, model, prompt, quick }) {
  const client = new Anthropic({ apiKey, maxRetries: 1, timeout: 5 * 60 * 1000 });
  const params = {
    model,
    max_tokens: quick ? 8000 : 16000,
    system: SYSTEM,
    // Chats and quick lookups need speed more than depth; Long Story gets the model's usual effort
    output_config: { effort: quick ? "low" : "medium" },
    messages: [{ role: "user", content: prompt }],
  };
  let res;
  try {
    res = FALLBACK_MODELS.has(model)
      ? await client.beta.messages.create({ ...params, betas: ["server-side-fallback-2026-07-01"], fallbacks: "default" })
      : await client.messages.create(params);
  } catch (e) {
    if (e instanceof Anthropic.AuthenticationError || e instanceof Anthropic.PermissionDeniedError) throw new AiError("bad_key", "That Claude key was refused.", 403);
    if (e instanceof Anthropic.RateLimitError) throw new AiError("rate_limited", "Claude is busy. Try again in a moment.", 429);
    if (e instanceof Anthropic.BadRequestError && /credit|billing|balance/i.test(e.message)) throw new AiError("no_credit", "That Claude account is out of credit.", 402);
    if (e instanceof Anthropic.APIError) throw new AiError("upstream", "Claude didn't answer that time.", 502);
    throw new AiError("upstream", "Couldn't reach Claude.", 502);
  }
  const u = res.usage || {};
  const usage = {
    input: (u.input_tokens || 0) + (u.cache_creation_input_tokens || 0) + (u.cache_read_input_tokens || 0),
    output: u.output_tokens || 0,
  };
  if (res.stop_reason === "refusal") return { text: "", usage, refused: true };
  const text = (res.content || []).filter(b => b.type === "text").map(b => b.text).join("");
  return { text, usage, truncated: res.stop_reason === "max_tokens" };
}

// Checks a learner's key without spending anything: listing a model is free
export async function checkKey(apiKey, model) {
  try { await new Anthropic({ apiKey, maxRetries: 0, timeout: 15000 }).models.retrieve(model); return true; }
  catch (e) {
    if (e instanceof Anthropic.AuthenticationError || e instanceof Anthropic.PermissionDeniedError) return false;
    throw new AiError("upstream", "Couldn't reach Claude to check the key. Try again in a moment.", 502);
  }
}

export function parseJson(text) {
  const t = String(text).trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  try { return JSON.parse(t); } catch {}
  const a = t.search(/[{[]/), b = Math.max(t.lastIndexOf("}"), t.lastIndexOf("]"));
  if (a >= 0 && b > a) { try { return JSON.parse(t.slice(a, b + 1)); } catch {} }
  return undefined;
}
