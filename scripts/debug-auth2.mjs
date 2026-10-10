/** Compare a manually-created auth user vs a signup-created user, column by column. */
import dns from "node:dns/promises";
import pg from "pg";
import { loadEnv } from "./env.mjs";

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const ref = new URL(url).hostname.split(".")[0];
const password = decodeURIComponent(env.DATABASE_URL?.match(/^postgresql:\/\/postgres:([^@]*)@/)?.[1] ?? "");

// 1. Try signup with a throwaway account (public endpoint, publishable key)
const signupRes = await fetch(`${url}/auth/v1/signup`, {
  method: "POST",
  headers: { apikey: key, "Content-Type": "application/json" },
  body: JSON.stringify({ email: "debug-signup@example.com", password: "DebugPass123!" }),
});
const signupBody = await signupRes.json();
console.log("signup →", signupRes.status, JSON.stringify(signupBody).slice(0, 200));

// 2. Can the signup user log in?
const loginRes = await fetch(`${url}/auth/v1/token?grant_type=password`, {
  method: "POST",
  headers: { apikey: key, "Content-Type": "application/json" },
  body: JSON.stringify({ email: "debug-signup@example.com", password: "DebugPass123!" }),
});
console.log("signup-user login →", loginRes.status, (await loginRes.text()).slice(0, 120));

// 3. Connect and dump both users fully
let client = null;
for (const r of ["ap-northeast-1", "ap-southeast-1", "eu-central-1", "us-east-1", "us-west-1", "eu-west-1", "eu-west-2", "ap-south-1", "ap-northeast-2", "sa-east-1", "ca-central-1", "me-south-1", "af-south-1", "eu-north-1", "ap-east-1", "me-central-1", "ap-southeast-2", "us-east-2", "us-west-2", "eu-central-2", "eu-west-3"]) {
  const host = `aws-0-${r}.pooler.supabase.com`;
  try { await dns.resolve4(host); } catch { continue; }
  const c = new pg.Client({ host, port: 6543, user: `postgres.${ref}`, password, database: "postgres", ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 8000 });
  try { await c.connect(); client = c; break; } catch {}
}
if (!client) throw new Error("no connection");

const cols = await client.query(`select column_name, data_type, is_nullable, column_default
  from information_schema.columns where table_schema = 'auth' and table_name = 'users' order by ordinal_position`);
console.log("\nauth.users columns:");
for (const c of cols.rows) console.log(`  ${c.column_name} ${c.data_type} nullable=${c.is_nullable} default=${c.column_default}`);

for (const email of [env.ADMIN_EMAIL, "debug-signup@example.com"]) {
  const r = await client.query("select * from auth.users where email = $1", [email]);
  if (r.rows[0]) {
    const row = r.rows[0];
    console.log(`\nuser ${email}:`);
    for (const [k, v] of Object.entries(row)) {
      const val = v === null ? "NULL" : typeof v === "string" && v.length > 40 ? v.slice(0, 40) + "…" : JSON.stringify(v);
      console.log(`  ${k} = ${val}`);
    }
  } else {
    console.log(`\nuser ${email}: NOT FOUND`);
  }
}

await client.end();
