import crypto from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(crypto.scrypt);
const SCRYPT = { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 };

export async function hashPassword(pw) {
  const salt = crypto.randomBytes(16);
  const key = await scrypt(pw, salt, 64, SCRYPT);
  return `scrypt$${salt.toString("base64")}$${key.toString("base64")}`;
}
export async function checkPassword(pw, stored) {
  const [kind, salt, hash] = String(stored).split("$");
  if (kind !== "scrypt" || !salt || !hash) return false;
  const want = Buffer.from(hash, "base64");
  const got = await scrypt(pw, Buffer.from(salt, "base64"), want.length, SCRYPT);
  return crypto.timingSafeEqual(want, got);
}

export const newToken = () => crypto.randomBytes(32).toString("base64url");
export const sha256 = s => crypto.createHash("sha256").update(s).digest("hex");

// Learners' own Claude keys are kept encrypted with a key derived from APP_SECRET
const keyFrom = secret => crypto.createHash("sha256").update("sm-api-key:" + secret).digest();
export function encrypt(secret, text) {
  const iv = crypto.randomBytes(12), c = crypto.createCipheriv("aes-256-gcm", keyFrom(secret), iv);
  const body = Buffer.concat([c.update(text, "utf8"), c.final()]);
  return [iv, c.getAuthTag(), body].map(b => b.toString("base64")).join(".");
}
export function decrypt(secret, packed) {
  const [iv, tag, body] = String(packed).split(".").map(s => Buffer.from(s, "base64"));
  const d = crypto.createDecipheriv("aes-256-gcm", keyFrom(secret), iv);
  d.setAuthTag(tag);
  return Buffer.concat([d.update(body), d.final()]).toString("utf8");
}

// A small in-memory limiter: `limit` hits per `ms` for each key (enough for one server instance)
export function limiter(limit, ms) {
  const hits = new Map();
  return key => {
    const now = Date.now(), h = (hits.get(key) || []).filter(t => now - t < ms);
    if (hits.size > 50000) hits.clear();
    if (h.length >= limit) { hits.set(key, h); return false; }
    h.push(now); hits.set(key, h); return true;
  };
}
