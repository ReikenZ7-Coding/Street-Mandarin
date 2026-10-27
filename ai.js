/* Your AI: the rules every AI that isn't Claude follows in Street Mandarin, in one place.
   - The house rules (one system prompt), the call to any OpenAI-style API (LM Studio, Ollama, llama.cpp,
     OpenRouter, DeepSeek, GLM, Qwen, Gemini, OpenAI…), pulling clean JSON out of the reply, one more try
     when it isn't, and stripping a model's thinking.
   - "Test it": three small real requests that say which parts of the app a model can be trusted with.
   The page loads this file as a script (window.SM_AI); the server imports the same file. */
(function (root, make) {
  const api = make();
  if (typeof module === "object" && module.exports) module.exports = api; else root.SM_AI = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  const SYSTEM = `You are the AI inside Street Mandarin, an app for learning Mandarin through real situations in China. The learner is a beginner to lower-intermediate.
Rules for every answer:
- Do exactly what the request asks, and reply with ONE valid JSON object in the shape it gives. No code fences, no comments, no text before or after the JSON.
- Chinese is simplified characters, natural and spoken, the way people in mainland China really talk.
- Pinyin uses tone marks (nǐ hǎo), never tone numbers, with words joined as in a dictionary.
- English is plain and natural.
- When you play a character, stay in character, keep it friendly and everyday, and keep to what that person would really say. Never mention that you are an AI.
- When you judge the learner's Chinese, be accurate and kind: a slip is something a local would find odd or misunderstand, not a matter of style.`;

  // Online services that speak the OpenAI-style API. On the website only these addresses are called.
  const PROVIDERS = [
    { id: "anthropic", name: "Claude (Anthropic)", url: "https://api.anthropic.com/v1", keys: "https://console.anthropic.com/settings/keys", about: "Claude, with an API key from Anthropic (a Claude.ai plan can't be used here).", dialect: "anthropic" },
    { id: "openrouter", name: "OpenRouter", url: "https://openrouter.ai/api/v1", keys: "https://openrouter.ai/settings/keys", about: "One account for Claude, GPT, Gemini, DeepSeek, GLM, Qwen and hundreds more." },
    { id: "deepseek", name: "DeepSeek", url: "https://api.deepseek.com/v1", keys: "https://platform.deepseek.com/api_keys", about: "Strong Chinese, low prices." },
    { id: "zai", name: "GLM (Z.ai)", url: "https://api.z.ai/api/paas/v4", keys: "https://z.ai/manage-apikey/apikey-list", about: "Zhipu's GLM models." },
    { id: "qwen", name: "Qwen (Alibaba Cloud)", url: "https://dashscope-intl.aliyuncs.com/compatible-mode/v1", keys: "https://modelstudio.console.alibabacloud.com/", about: "Alibaba's Qwen models, through Model Studio." },
    { id: "gemini", name: "Gemini (Google)", url: "https://generativelanguage.googleapis.com/v1beta/openai", keys: "https://aistudio.google.com/apikey", about: "Has a free tier." },
    { id: "openai", name: "ChatGPT (OpenAI)", url: "https://api.openai.com/v1", keys: "https://platform.openai.com/api-keys", about: "ChatGPT's models, with an OpenAI API key (a ChatGPT plan can't be used here)." },
  ];
  // Apps that run a model on your own computer, on their usual ports
  const COMPUTER = [
    { id: "lmstudio", name: "LM Studio", url: "http://localhost:1234/v1" },
    { id: "ollama", name: "Ollama", url: "http://localhost:11434/v1" },
  ];
  const provider = id => PROVIDERS.find(p => p.id === id) || COMPUTER.find(p => p.id === id) || null;

  // What the app calls a model in its own words ("Qwen is writing chapter 2…")
  const NAMES = [[/claude/i, "Claude"], [/qwen|qwq/i, "Qwen"], [/deepseek/i, "DeepSeek"], [/glm|zhipu|chatglm/i, "GLM"], [/gemini|gemma/i, "Gemini"], [/gpt|o\d-|^o\d$|openai/i, "GPT"],
    [/llama/i, "Llama"], [/mistral|mixtral/i, "Mistral"], [/kimi|moonshot/i, "Kimi"], [/yi-|01-ai/i, "Yi"], [/phi/i, "Phi"]];
  const nameFor = model => { const m = String(model || ""); const hit = NAMES.find(([re]) => re.test(m.split("/").pop()) || re.test(m)); return hit ? hit[1] : "your AI"; };
  // Model lists include models that can't chat (embeddings, images, speech)
  const chatModel = id => !/embed|tts|whisper|dall-e|image|imagen|audio|moderation|realtime|transcribe|rerank|veo|speech|vision-only/i.test(id);

  const stripThinking = t => String(t || "").replace(/<think>[\s\S]*?<\/think>/g, "").replace(/^[\s\S]*<\/think>/, "").trim();
  function parseJson(text) {
    const t = String(text).trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
    try { return JSON.parse(t); } catch {}
    const a = t.search(/[{[]/), b = Math.max(t.lastIndexOf("}"), t.lastIndexOf("]"));
    if (a >= 0 && b > a) { try { return JSON.parse(t.slice(a, b + 1)); } catch {} }
    return undefined;
  }

  const fail = (code, message, status = 502) => Object.assign(new Error(message), { code, status });
  // How a connection is named in a message: "Your local AI", "DeepSeek"
  const who = conn => conn.kind === "computer" ? "Your local AI" : (provider(conn.provider) || {}).name || "That AI";
  // Claude speaks its own API (its OpenAI-style one refuses the settings small models need); everything else is OpenAI-style
  const isClaude = conn => conn.provider === "anthropic";
  const headers = conn => isClaude(conn)
    ? { "content-type": "application/json", "x-api-key": conn.key || "", "anthropic-version": "2023-06-01", "anthropic-dangerous-direct-browser-access": "true" }
    : { "content-type": "application/json", ...(conn.key ? { authorization: `Bearer ${conn.key}` } : {}), ...(conn.provider === "openrouter" ? { "X-Title": "Street Mandarin" } : {}) };
  const timeout = ms => (typeof AbortSignal !== "undefined" && AbortSignal.timeout ? AbortSignal.timeout(ms) : undefined);
  const offline = conn => conn.kind === "computer"
    ? fail("model_offline", "Your local AI isn't running. Start the server in LM Studio (or Ollama) with your model loaded, then try again.", 503)
    : fail("upstream", `Couldn't reach ${who(conn)}.`, 502);

  // The models a service offers (and a quick check that a key works: listing costs nothing)
  async function listModels(conn, { fetch = globalThis.fetch, ms = 8000 } = {}) {
    let r;
    try { r = await fetch(conn.url.replace(/\/+$/, "") + "/models", { headers: headers(conn), signal: timeout(ms) }); }
    catch { throw offline(conn); }
    if (r.status === 401 || r.status === 403) throw fail("bad_key", `${who(conn)} didn't accept that key. Check you copied all of it.`, 400);
    if (!r.ok) throw fail("upstream", `${who(conn)} didn't answer (${r.status}).`, 502);
    const j = await r.json().catch(() => ({}));
    return (j.data || j.models || []).map(m => String(m.id || m.name || "").replace(/^models\//, "")).filter(id => id && chatModel(id));
  }

  // Servers that can hold an answer to a JSON schema (LM Studio, Ollama, llama.cpp, most online ones) get one,
  // so a small model can't wander off into chatter or a half-closed bracket. A server that refuses is remembered.
  const noSchema = new Set(), quirks = new Map();
  async function call(conn, { prompt, quick, shape, retryNote }, { fetch = globalThis.fetch } = {}) {
    const url = conn.url.replace(/\/+$/, ""), local = conn.kind === "computer";
    let model = conn.model;
    if (!model && local) { try { model = (await listModels(conn, { fetch, ms: 4000 }))[0]; } catch {} }
    if (!model) throw offline(conn);
    const messages = [{ role: "system", content: SYSTEM }, { role: "user", content: prompt }];
    if (retryNote) messages.push({ role: "assistant", content: retryNote.previous }, { role: "user", content: retryNote.ask });
    // Online models get more room: some think before they answer, and that counts towards the limit
    const max = local ? (quick ? 2000 : 7000) : (quick ? 4000 : 12000);
    const id = url + "|" + model, quirk = quirks.get(id) || {};
    const ask = withSchema => isClaude(conn)
      ? fetch(url + "/messages", { method: "POST", headers: headers(conn), signal: timeout(quick ? 120000 : 600000),
          body: JSON.stringify({ model, max_tokens: max, system: SYSTEM, messages: messages.slice(1) }) })
      : fetch(url + "/chat/completions", {
          method: "POST", headers: headers(conn),
          body: JSON.stringify({
            model, messages, stream: false,
            // Reasoning models (OpenAI's newer ones) refuse a temperature and want max_completion_tokens: learnt from their first refusal
            ...(quirk.noTemp ? {} : { temperature: quick ? 0.6 : 0.8 }), ...(quirk.completion ? { max_completion_tokens: max } : { max_tokens: max }),
            ...(withSchema ? { response_format: { type: "json_schema", json_schema: { name: "answer", strict: true, schema: shape || { type: "object" } } } } : {}),
          }),
          signal: timeout(quick ? 120000 : 600000),
        });
    let r;
    try {
      for (let tries = 0; tries < 4; tries++) {
        const withSchema = !isClaude(conn) && !noSchema.has(id);
        r = await ask(withSchema);
        if (isClaude(conn) || r.status !== 400) break;
        const t = await r.clone().text().catch(() => "");
        if (withSchema && /response_format|json_schema|schema|grammar|structured/i.test(t)) noSchema.add(id);
        else if (!quirk.noTemp && /temperature/i.test(t)) quirk.noTemp = true;
        else if (!quirk.completion && /max_tokens|max_completion_tokens/i.test(t)) quirk.completion = true;
        else break;
        quirks.set(id, quirk);
      }
    } catch (e) {
      if (e && e.name === "TimeoutError") throw fail("rate_limited", `${who(conn)} took too long. Try again, or try a shorter request.`, 504);
      throw offline(conn);
    }
    if (!r.ok) {
      const t = await r.text().catch(() => "");
      if (r.status === 401 || r.status === 403) throw fail("bad_key", `${who(conn)} refused the key.`, 403);
      if (r.status === 402 || /credit|balance|billing|quota|insufficient/i.test(t)) throw fail("no_credit", `${who(conn)} says the account is out of credit.`, 402);
      if (r.status === 429 || r.status === 529) throw fail("rate_limited", `${who(conn)} is busy. Try again in a moment.`, 429);
      if (/context|too long|exceed|maximum.*tokens/i.test(t)) throw fail("too_big", local ? "That's too long for your local AI's context window. Raise the context length in LM Studio (16384 or more)." : `That's too long for ${who(conn)}.`, 413);
      if (r.status === 404) throw fail("upstream", `${who(conn)} doesn't have the model ${model}. Pick another in Your AI.`, 502);
      throw fail("upstream", `${who(conn)} couldn't answer that time.`, 502);
    }
    const j = await r.json().catch(() => ({}));
    if (isClaude(conn)) {
      const u = j.usage || {};
      if (j.stop_reason === "refusal") throw fail("refused", "Claude wouldn't answer that one.", 422);
      return { text: (j.content || []).filter(b => b.type === "text").map(b => b.text).join(""), usage: { input: u.input_tokens || 0, output: u.output_tokens || 0 }, truncated: j.stop_reason === "max_tokens", model };
    }
    const choice = (j.choices || [])[0] || {}, u = j.usage || {};
    return { text: stripThinking(choice.message && choice.message.content), usage: { input: u.prompt_tokens || 0, output: u.completion_tokens || 0 }, truncated: choice.finish_reason === "length", model };
  }

  // The whole ask: call, read the JSON, and one more try (showing the model its reply) if it wasn't clean
  async function ask(conn, prompt, opts = {}, env = {}) {
    let out = await call(conn, { prompt, quick: !!opts.quick, shape: opts.shape }, env);
    let result = parseJson(out.text);
    if (!result || typeof result !== "object") {
      out = await call(conn, { prompt, quick: !!opts.quick, shape: opts.shape, retryNote: { previous: out.text.slice(0, 4000), ask: "That wasn't one valid JSON object. Reply again with only the JSON object the request asks for." } }, env);
      result = parseJson(out.text);
    }
    if (!result || typeof result !== "object") throw fail("shape", out.truncated ? (conn.kind === "computer" ? "The answer was cut off. Raise the context length or max tokens in LM Studio, then try again." : "The answer was cut off. Try again.") : "The answer didn't come back in the right shape. Try again.", 502);
    return { result, usage: out.usage, model: out.model };
  }

  /* ---------- Test it: what a model can be trusted with ---------- */
  // The app's AI judges people's Chinese, and a model that calls a wrong sentence right teaches a mistake.
  // So each part of the app switches on only for a model that passes its test.
  const S = { type: "string" };
  const obj = (props, required = Object.keys(props)) => ({ type: "object", properties: props, required, additionalProperties: false });
  const hasHan = s => /[一-鿿]/.test(String(s || ""));
  const toned = s => /[āáǎàēéěèīíǐìōóǒòūúǔùǖǘǚǜ]/i.test(String(s || "")) && !/[a-zü][1-5]\b/i.test(String(s || ""));
  const line3 = { type: "array", items: S, minItems: 3, maxItems: 3 };
  const TESTS = [
    { id: "check", name: "Checking your answers", quick: true,
      prompt: `You are checking a beginner's spoken Mandarin. For each exchange, judge the learner's reply the way a local would hear it:
"good" = natural, and answers what was asked; "okay" = understood, but a little off; "wrong" = a local would find it odd, misunderstand it, or it doesn't answer what was asked.
1. A waiter asks: 几位？ (How many of you?) The learner says: 两位。
2. A waiter asks: 几位？ The learner says: 我很好，谢谢。
3. A waiter asks: 你要什么？ The learner says: 我要一碗牛肉面。
4. A shop assistant asks: 要袋子吗？ (Do you want a bag?) The learner says: 我是袋子。
Reply as JSON: {"results": [{"n": 1, "verdict": "good" or "okay" or "wrong", "better": "for okay or wrong, what a local would say instead, in characters; otherwise empty"}, …]} with all four, in order.`,
      shape: obj({ results: { type: "array", minItems: 4, maxItems: 4, items: obj({ n: { type: "integer" }, verdict: { enum: ["good", "okay", "wrong"] }, better: S }) } }),
      judge(r) {
        const v = (r.results || []).map(x => x && x.verdict), want = [["good", "okay"], ["wrong"], ["good", "okay"], ["wrong"]];
        const missed = want.map((w, i) => w.includes(v[i]) ? 0 : i + 1).filter(Boolean);
        if (v.length !== 4) return "It didn't judge all four answers.";
        if (missed.length) return `It judged ${4 - missed.length} of 4 answers right${missed.some(i => i % 2 === 0) ? ", and called a wrong one right" : ""}.`;
        if (![1, 3].every(i => hasHan(r.results[i].better))) return "It caught the mistakes but didn't say what to say instead.";
        return "";
      } },
    { id: "chat", name: "Chats", quick: true,
      prompt: `You are 小陈 (Xiǎo Chén), a friendly 25-year-old office worker in Shanghai, texting on WeChat with a foreigner who is learning Mandarin. They just sent: "你好！你今天做什么？"
Reply as yourself, the way you'd really text: 1 or 2 short messages in simple Chinese (HSK 1 to 3), each at most 25 characters.
Reply as JSON: {"messages": [{"h": "the message in simplified characters", "p": "its pinyin, with tone marks", "e": "its English"}]}`,
      shape: obj({ messages: { type: "array", minItems: 1, maxItems: 3, items: obj({ h: S, p: S, e: S }) } }),
      judge(r) {
        const m = r.messages || [];
        if (!m.length || m.length > 3) return "It didn't reply with one to three messages.";
        if (!m.every(x => hasHan(x.h) && !/[a-z]{3,}/i.test(x.h))) return "Its messages weren't in Chinese characters.";
        if (!m.every(x => String(x.h).length <= 40)) return "Its messages were far longer than a text.";
        if (!m.every(x => toned(x.p))) return "Its pinyin didn't have tone marks.";
        if (!m.every(x => /[a-z]/i.test(x.e))) return "It left out the English.";
        if (m.some(x => /\bAI\b|人工智能|语言模型|assistant/i.test(x.h + x.e))) return "It stepped out of character.";
        return "";
      } },
    { id: "long", name: "Long Story", quick: false,
      prompt: `Write a very short scene for a light novel set in China, for a beginner learning Mandarin. The reader ("you") walks into a small dumpling shop in Xi'an, and the owner, 王阿姨, greets them.
Write 4 to 6 blocks: narration in English as {"t": "n", "text": "…"}, and spoken lines as {"t": "l", "who": "the speaker in characters", "h": "the line in characters", "p": "pinyin with tone marks", "e": "English"}. At least two blocks are spoken lines.
End with a moment where the reader has to answer her: "moment": {"prompt": "what the reader needs to say, in English", "opts": [three options]}. Each option is {"h", "p", "e", "k", "note", "r"}: k is "good" for the one natural answer, "okay" for one that's understood but a little off, "wrong" for one a local would misunderstand; note says why, in one English sentence; r is her reply to that option as ["characters", "pinyin", "English"].
Reply as JSON: {"title_english": "…", "blocks": […], "moment": {…}}`,
      shape: obj({ title_english: S,
        blocks: { type: "array", minItems: 4, maxItems: 8, items: { anyOf: [obj({ t: { const: "n" }, text: S }), obj({ t: { const: "l" }, who: S, h: S, p: S, e: S })] } },
        moment: obj({ prompt: S, opts: { type: "array", minItems: 3, maxItems: 3, items: obj({ h: S, p: S, e: S, k: { enum: ["good", "okay", "wrong"] }, note: S, r: line3 }) } }) }),
      judge(r) {
        const b = r.blocks || [], lines = b.filter(x => x && x.t === "l"), o = (r.moment || {}).opts || [];
        if (b.length < 4 || !b.every(x => x && (x.t === "n" ? x.text : x.t === "l"))) return "The scene came back out of shape.";
        if (lines.length < 2 || !lines.every(x => hasHan(x.h) && toned(x.p))) return "Its spoken lines were missing characters or tone marks.";
        if (o.length !== 3 || o.map(x => x && x.k).sort().join() !== "good,okay,wrong") return "The choice at the end didn't have one good, one okay and one wrong answer.";
        if (!o.every(x => hasHan(x.h) && Array.isArray(x.r) && x.r.length === 3 && hasHan(x.r[0]) && x.note)) return "The answers at the end were missing their replies or notes.";
        return "";
      } },
  ];
  // Chats and Long Story judge your Chinese too, so they also need the first test passed
  const canFrom = ok => ({ check: !!ok.check, chat: !!(ok.check && ok.chat), long: !!(ok.check && ok.long) });

  // json(prompt, opts) is however the app reaches this AI (direct, or through the server), so the test takes the same road
  async function test(json, onStep = () => {}) {
    const results = [];
    for (const t of TESTS) {
      onStep({ id: t.id, name: t.name, state: "running" });
      const t0 = Date.now();
      let why;
      try { why = t.judge(await json(t.prompt, { modelTier: t.quick ? "quick" : "", shape: t.shape, cache: false }) || {}); }
      catch (e) {
        // Not reaching it at all isn't a verdict on the model: stop and say why
        if (e && ["model_offline", "bad_key", "no_credit", "not_granted", "needs_key", "signed_out", "upstream", "rate_limited"].includes(e.code)) { onStep({ id: t.id, name: t.name, state: "error" }); throw e; }
        why = "Its answer didn't come back in the right shape.";
      }
      const res = { id: t.id, name: t.name, ok: !why, why, ms: Date.now() - t0 };
      results.push(res); onStep({ ...res, state: res.ok ? "passed" : "failed" });
    }
    const ok = Object.fromEntries(results.map(r => [r.id, r.ok]));
    return { can: canFrom(ok), results, at: Date.now() };
  }

  return { SYSTEM, PROVIDERS, COMPUTER, provider, nameFor, stripThinking, parseJson, listModels, call, ask, test, TESTS, canFrom };
});
