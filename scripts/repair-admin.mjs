/**
 * One-off repair + verification:
 *  - dedupes seeded testimonials (older double-run of the migration)
 *  - ensures the admin auth user exists WITH an email identity
 *  - (re)sets the admin password to a fresh random value saved to .env.local
 * Run: node scripts/repair-admin.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import dns from "node:dns/promises";
import { randomBytes, randomUUID } from "node:crypto";
import pg from "pg";
import { loadEnv } from "./env.mjs";

const { Client } = pg;
const env = loadEnv();
const ref = new URL(env.NEXT_PUBLIC_SUPABASE_URL).hostname.split(".")[0];
const password = decodeURIComponent(
  env.DATABASE_URL?.match(/^postgresql:\/\/postgres:([^@]*)@/)?.[1] ?? "",
);
const ADMIN_EMAIL = "admin@asim.design";

async function connect() {
  const regions = ["ap-northeast-1", "ap-southeast-1", "ap-southeast-2", "ap-northeast-2", "ap-south-1", "ap-east-1", "eu-central-1", "eu-central-2", "eu-west-1", "eu-west-2", "eu-west-3", "eu-north-1", "us-east-1", "us-east-2", "us-west-1", "us-west-2", "sa-east-1", "ca-central-1", "me-south-1", "me-central-1", "af-south-1"];
  const hosts = [`${ref}.pooler.supabase.com`, ...regions.map((r) => `aws-0-${r}.pooler.supabase.com`)];
  for (const host of hosts) {
    try { await dns.resolve4(host); } catch { continue; }
    for (const port of [6543, 5432]) {
      const client = new Client({ host, port, user: `postgres.${ref}`, password, database: "postgres", ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 8000 });
      try {
        await client.connect();
        await client.query("select 1");
        return client;
      } catch { try { await client.end(); } catch {} }
    }
  }
  throw new Error("no connection");
}

const client = await connect();
const esc = (s) => s.replace(/'/g, "''");

// 1. Dedupe testimonials (keep the oldest row per name+quote)
const dedup = await client.query(`
  delete from public.testimonials
  where id not in (
    select id from (
      select id, row_number() over (partition by name, quote order by created_at asc, id::text asc) as rn
      from public.testimonials
    ) ranked where rn = 1
  )
  returning id
`);
console.log(`deduped testimonials: removed ${dedup.rowCount} duplicate(s)`);

// 2. Ensure admin user + identity, reset password
const userRes = await client.query(`select id from auth.users where email = '${esc(ADMIN_EMAIL)}'`);
let userId = userRes.rows[0]?.id;
const freshPassword = `${randomBytes(12).toString("base64url")}!A1z`;

if (!userId) {
  userId = randomUUID();
  await client.query(`insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, created_at, updated_at)
    values ('00000000-0000-0000-0000-000000000000', '${userId}', 'authenticated', 'authenticated', '${esc(ADMIN_EMAIL)}', crypt('${esc(freshPassword)}', gen_salt('bf')), now(), '{}'::jsonb, '{}'::jsonb, now(), now())`);
  console.log("admin user created");
} else {
  await client.query(`update auth.users set encrypted_password = crypt('${esc(freshPassword)}', gen_salt('bf')), updated_at = now() where id = '${userId}'`);
  console.log("admin password reset");
}

const identRes = await client.query(`select id from auth.identities where user_id = '${userId}' and provider = 'email'`);
if (identRes.rows.length === 0) {
  await client.query(`insert into auth.identities (user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
    values ('${userId}', '${userId}', jsonb_build_object('sub', '${userId}', 'email', '${esc(ADMIN_EMAIL)}'), 'email', now(), now(), now())`);
  console.log("admin email identity created");
} else {
  console.log("admin email identity already present");
}

// 3. Save credentials to .env.local
const envPath = resolve(process.cwd(), ".env.local");
let content = readFileSync(envPath, "utf8");
content = content.replace(/^ADMIN_EMAIL=.*$/m, `ADMIN_EMAIL=${ADMIN_EMAIL}`);
content = content.replace(/^ADMIN_PASSWORD=.*$/m, `ADMIN_PASSWORD=${freshPassword}`);
if (!/^ADMIN_EMAIL=/m.test(content)) content += `\nADMIN_EMAIL=${ADMIN_EMAIL}\n`;
if (!/^ADMIN_PASSWORD=/m.test(content)) content += `ADMIN_PASSWORD=${freshPassword}\n`;
writeFileSync(envPath, content);
console.log("credentials saved to .env.local (ADMIN_EMAIL / ADMIN_PASSWORD)");

const t = await client.query("select count(*)::int as n from public.testimonials");
console.log(`testimonials now: ${t.rows[0].n} rows`);
await client.end();
console.log("repair done ✓");
