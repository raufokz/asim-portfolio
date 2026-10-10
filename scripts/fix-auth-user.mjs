/**
 * Fix manually-created auth users so GoTrue can log them in:
 *  - raw_app_meta_data / raw_user_meta_data must be '{}' (not NULL)
 *  - token columns must be '' (not NULL) — GoTrue scans them into plain strings
 * Run: node scripts/fix-auth-user.mjs
 */
import dns from "node:dns/promises";
import pg from "pg";
import { loadEnv } from "./env.mjs";

const env = loadEnv();
const ref = new URL(env.NEXT_PUBLIC_SUPABASE_URL).hostname.split(".")[0];
const password = decodeURIComponent(env.DATABASE_URL?.match(/^postgresql:\/\/postgres:([^@]*)@/)?.[1] ?? "");

let client = null;
for (const r of ["ap-northeast-1", "ap-southeast-1", "ap-south-1", "eu-central-1", "us-east-1", "us-west-1", "eu-west-1", "eu-west-2", "ap-northeast-2", "sa-east-1", "ca-central-1", "me-south-1", "af-south-1", "eu-north-1", "ap-east-1", "me-central-1", "ap-southeast-2", "us-east-2", "us-west-2", "eu-central-2", "eu-west-3"]) {
  const host = `aws-0-${r}.pooler.supabase.com`;
  try { await dns.resolve4(host); } catch { continue; }
  const c = new pg.Client({ host, port: 6543, user: `postgres.${ref}`, password, database: "postgres", ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 8000 });
  try { await c.connect(); client = c; break; } catch {}
}
if (!client) throw new Error("no connection");

const r = await client.query(`update auth.users set
    raw_app_meta_data = coalesce(raw_app_meta_data, '{}'::jsonb),
    raw_user_meta_data = coalesce(raw_user_meta_data, '{}'::jsonb),
    confirmation_token = coalesce(confirmation_token, ''),
    recovery_token = coalesce(recovery_token, ''),
    email_change_token_new = coalesce(email_change_token_new, ''),
    email_change = coalesce(email_change, '')
  where raw_app_meta_data is null or raw_user_meta_data is null
     or confirmation_token is null or recovery_token is null
     or email_change_token_new is null or email_change is null
  returning email`);
console.log("fixed users:", r.rows.map((x) => x.email).join(", ") || "(none needed fixing)");
await client.end();
