/**
 * Connectivity check: Supabase REST API + direct Postgres.
 * Prints only PASS/FAIL and non-secret metadata — never keys or passwords.
 * Run: node scripts/check-supabase.mjs
 */
import { loadEnv } from "./env.mjs";

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const databaseUrl = env.DATABASE_URL;

let failures = 0;
const check = (name, ok, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
};

if (!url || !key) {
  console.log("FAIL  NEXT_PUBLIC_SUPABASE_URL / NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY missing in .env.local");
  process.exit(1);
}

// 1. REST API ping (anon/publishable key)
try {
  const res = await fetch(`${url}/rest/v1/`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  check("REST API reachable", res.status === 200, `HTTP ${res.status}`);
} catch (e) {
  check("REST API reachable", false, String(e).slice(0, 120));
}

// 2. Direct Postgres connection
if (!databaseUrl) {
  check("DATABASE_URL present", false, "missing in .env.local");
} else {
  try {
    const { Client } = await import("pg");
    const client = new Client({
      connectionString: databaseUrl,
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 15000,
    });
    await client.connect();
    const r = await client.query("select current_database(), current_user");
    check(
      "Postgres direct connection",
      true,
      `db=${r.rows[0].current_database} user=${r.rows[0].current_user}`,
    );
    await client.end();
  } catch (e) {
    check("Postgres direct connection", false, String(e).slice(0, 160));
  }
}

process.exit(failures === 0 ? 0 : 1);
