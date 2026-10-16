// Everything the server can be told, from the environment. See server/README.md.
const num = (v, d) => (v === undefined || v === "" ? d : Number(v));

export function loadConfig(env = process.env) {
  const mode = env.AI_MODE || "byok";
  if (!["byok", "mix", "owner"].includes(mode)) throw new Error(`AI_MODE must be byok, mix or owner, not "${mode}"`);
  const secret = env.APP_SECRET || "";
  if (env.NODE_ENV === "production" && !env.DATABASE_URL) throw new Error("Set DATABASE_URL to a Postgres database in production (the built-in one keeps nothing across deploys).");
  if (env.NODE_ENV === "production" && secret.length < 32) throw new Error("Set APP_SECRET to a long random string (at least 32 characters) in production.");
  return {
    port: num(env.PORT, 8787),
    production: env.NODE_ENV === "production",
    databaseUrl: env.DATABASE_URL || "",
    // Used to encrypt learners' own Claude keys at rest. Changing it makes stored keys unreadable.
    secret: secret || "dev-only-secret-do-not-use-in-production",
    ai: {
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
