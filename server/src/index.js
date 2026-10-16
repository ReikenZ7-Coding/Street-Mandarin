import { serve } from "@hono/node-server";
import { loadConfig } from "./config.js";
import { openDb } from "./db.js";
import { createApp } from "./app.js";

const config = loadConfig();
const db = await openDb(config.databaseUrl || "pglite:./data/dev");
const app = createApp({ db, config });
// Old sessions are tidied away once a day
setInterval(() => db.query("delete from sessions where expires_at < now()").catch(() => {}), 864e5).unref();
serve({ fetch: app.fetch, port: config.port }, info => {
  console.log(`Street Mandarin on http://localhost:${info.port} (AI: ${config.ai.mode}${config.databaseUrl ? "" : ", local database in server/data"})`);
});
