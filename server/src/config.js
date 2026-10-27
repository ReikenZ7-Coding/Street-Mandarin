// Everything the server can be told, from the environment. See server/README.md.
const num = (v, d) => (v === undefined || v === "" ? d : Number(v));

export function loadConfig(env = process.env) {
  const mode = env.AI_MODE || "byok";
  if (!["byok", "mix", "owner"].includes(mode)) throw new Error(`AI_MODE must be byok, mix or owner, not "${mode}"`);
  const provider = env.AI_PROVIDER || "claude";
  if (!["claude", "local"].includes(provider)) throw new Error(`AI_PROVIDER must be claude or local, not "${provider}"`);
  // Solo: one person on their own computer. No sign-in, and the server only listens to this computer.
  const solo = env.SOLO === "1" || env.SOLO === "true";
  const secret = env.APP_SECRET || "";
  if (env.NODE_ENV === "production" && !solo && !env.DATABASE_URL) throw new Error("Set DATABASE_URL to a Postgres database in production (the built-in one keeps nothing across deploys).");
  if (env.NODE_ENV === "production" && secret.length < 32) throw new Error("Set APP_SECRET to a long random string (at least 32 characters) in production.");
  return {
    port: num(env.PORT, 8787),
    host: env.HOST || (solo ? "127.0.0.1" : "0.0.0.0"),
    solo,
    production: env.NODE_ENV === "production",
    databaseUrl: env.DATABASE_URL || "",
    // Used to encrypt learners' own Claude keys at rest. Changing it makes stored keys unreadable.
    secret: secret || "dev-only-secret-do-not-use-in-production",
    ai: {
      // Where the AI runs unless you pick another in Your AI: Claude's API, or a model on your own
      // computer (LM Studio, Ollama, llama.cpp: anything with an OpenAI-style /v1/chat/completions)
      provider,
      localUrl: (env.LOCAL_AI_URL || "http://localhost:1234/v1").replace(/\/+$/, ""),
      // Empty means whichever model the local server has loaded
      localModel: env.LOCAL_AI_MODEL || "",
      // What the app calls your model in its own words ("Qwen is writing chapter 2…"); by default, from the model's name
      localName: (env.LOCAL_AI_NAME || "").slice(0, 30),
      localKey: env.LOCAL_AI_KEY || "",
      mode,
      // Matthew's key, only used in mix and owner modes
      ownerKey: env.ANTHROPIC_API_KEY || "",
      modelQuick: env.MODEL_QUICK || "claude-haiku-5-5",
      modelMain: env.MODEL_MAIN || "claude-opus-5-5",
      // Daily free allowance per learner on the owner's key, in US dollars (mix and owner modes)
      dailyAllowanceUsd: num(env.DAILY_ALLOWANCE_USD, 0.05),
      // Hard monthly cap on the owner's key across everyone
      monthlyBudgetUsd: num(env.MONTHLY_BUDGET_USD, 0),
      maxPromptChars: num(env.MAX_PROMPT_CHARS, 120000),
    },
  };
}

// US dollars per million tokens, input and output (thinking is billed as output)
export const PRICES = {
  "claude-haiku-5-5": [0.10, 0.50],
  "claude-sonnet-5-5": [2, 10],
  "claude-opus-5-5": [4, 20],
};
// A price we don't know is assumed to be the dearest, so caps stay safe
export const priceOf = model => PRICES[model] || [10, 50];
