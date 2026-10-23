// `npm run solo`: Street Mandarin just for you, on this computer, with the AI from your own model
// (LM Studio's server on its usual port unless LOCAL_AI_URL says otherwise). Works the same on
// Windows, macOS and Linux.
process.env.SOLO ??= "1";
process.env.AI_PROVIDER ??= "local";
await import("./index.js");
