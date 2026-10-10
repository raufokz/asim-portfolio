/** Debug the admin login 500: dump the auth user/identity rows + token response. */
import dns from "node:dns/promises";
import pg from "pg";
import { loadEnv } from "./env.mjs";

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const ref = new URL(url).hostname.split(".")[0];
const password = decodeURIComponent(env.DATABASE_URL?.match(/^postgresql:\/\/postgres:([^@]*)@/)?.[1] ?? "");

// token endpoint response body
const res = await fetch(`${url}/auth/v1/token?grant_type=password`, {
  method: "POST",
  headers: { apikey: key, "Content-Type": "application/json" },
  body: JSON.stringify({ email: env.ADMIN_EMAIL, password: env.ADMIN_PASSWORD }),
});
console.log("token →", res.status, await res.text());

// connect via pooler
const regions = ["ap-northeast-1", "ap-southeast-1", "eu-central-1", "us-east-1", "us-west-1", "eu-west-1", "eu-west-2", "ap-south-1"];
let client = null;
for (const r of regions) {
  const host = `aws-0-${r}.pooler.supabase.com`;
  try { await dns.resolve4(host); } catch { continue; }
  const c = new pg.Client({ host, port: 6543, user: `postgres.${ref}`, password, database: "postgres", ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 8000 });
  try { await c.connect(); client = c; break; } catch {}
}
if (!client) { console.log("no db connection"); process.exit(1); }

const u = await client.query(`select id, email, email_confirmed_at, aud, role, is_sso_user, is_anonymous,
  left(encrypted_password, 7) as hash_prefix, length(encrypted_password) as hash_len,
  raw_user_meta_data, raw_app_meta_data, created_at, updated_at, last_sign_in_at
  from auth.users where email = $1`, [env.ADMIN_EMAIL]);
console.log("user row:", JSON.stringify(u.rows, null, 2));

const i = await client.query(`select id, user_id, provider_id, provider, identity_data, last_sign_in_at, created_at
  from auth.identities where provider = 'email' order by created_at`);
console.log("identities:", JSON.stringify(i.rows, null, 2));

const cnt = await client.query("select count(*)::int as n from auth.users");
console.log("total users:", cnt.rows[0].n);

await client.end();
