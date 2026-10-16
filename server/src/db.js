// One small interface over two Postgres engines: a real server in production (DATABASE_URL),
// or PGlite, Postgres compiled to WebAssembly, in development and tests (no install needed).
import postgres from "postgres";

const SCHEMA = `
create table if not exists users (
  id serial primary key,
  email text unique not null,
  pass text not null,
  api_key_enc text,
  api_key_hint text,
  created_at timestamptz not null default now()
);
create table if not exists sessions (
  token_hash text primary key,
  user_id integer not null references users(id) on delete cascade,
  expires_at timestamptz not null
);
create index if not exists sessions_user on sessions(user_id);
-- One row per saved key of the app's progress (the same keys the progress code copies)
create table if not exists progress (
  user_id integer not null references users(id) on delete cascade,
  key text not null,
  value text,
  t bigint not null,
  primary key (user_id, key)
);
create table if not exists ai_usage (
  id bigserial primary key,
  user_id integer references users(id) on delete set null,
  at timestamptz not null default now(),
  model text not null,
  input_tokens integer not null,
  output_tokens integer not null,
  cost_micros bigint not null,
  own_key boolean not null
);
create index if not exists ai_usage_at on ai_usage(at);
create index if not exists ai_usage_user_at on ai_usage(user_id, at);
-- Answers that can be shared ("How do I say…?", glosses), so each is paid for once
create table if not exists ai_cache (
  hash text primary key,
  body text not null,
  created_at timestamptz not null default now()
);
`;

// `schema` keeps the tables in their own Postgres schema (the tests use one per run)
export async function openDb(url, { schema } = {}) {
  let db;
  if (url && /^postgres(ql)?:/.test(url)) {
    if (schema) { const s = postgres(url, { max: 1, onnotice: () => {} }); await s.unsafe(`create schema if not exists "${schema}"`); await s.end(); }
    const sql = postgres(url, { max: 5, onnotice: () => {}, ...(schema ? { connection: { search_path: schema } } : {}) });
    db = {
      query: (text, params = []) => sql.unsafe(text, params),
      exec: text => sql.unsafe(text),
      close: () => sql.end(),
    };
  } else {
    // "pglite:./data/dev" keeps data in a folder; anything else is in memory
    const { PGlite } = await import("@electric-sql/pglite");
    const pg = new PGlite(url && url.startsWith("pglite:") ? url.slice(7) : undefined);
    db = {
      query: async (text, params = []) => (await pg.query(text, params)).rows,
      exec: text => pg.exec(text),
      close: () => pg.close(),
    };
  }
  await db.exec(SCHEMA);
  return db;
}
