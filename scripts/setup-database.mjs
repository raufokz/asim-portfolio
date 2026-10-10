/**
 * Applies supabase/migrations/0001_init.sql and bootstraps the admin user.
 *
 * Connection strategy:
 *   1. Try DATABASE_URL from .env.local (direct connection, port 5432).
 *   2. Fall back to the Supabase connection pooler (port 6543) with the
 *      project-qualified username postgres.<project-ref>, trying each region.
 *
 * The admin bootstrap creates auth user admin@asim.design with a random
 * password, saved to .env.local as ADMIN_EMAIL / ADMIN_PASSWORD (never printed).
 *
 * Run: node scripts/setup-database.mjs
 */
import { readFileSync, appendFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { randomBytes, randomUUID } from "node:crypto";
import { loadEnv } from "./env.mjs";
import { connect, applySqlFile } from "./db.mjs";

const env = loadEnv();
const ADMIN_EMAIL = "admin@asim.design";

const client = await connect(env);

// ── Apply migration ─────────────────────────────────────────────────────────
const migrationPath = resolve(process.cwd(), "supabase/migrations/0001_init.sql");
if (!existsSync(migrationPath)) {
  console.error("migration not found:", migrationPath, "— run scripts/generate-migration.mjs first");
  process.exit(1);
}
await applySqlFile(client, migrationPath);

// ── Bootstrap admin user ────────────────────────────────────────────────────
const existing = await client.query("select id from auth.users where email = $1", [ADMIN_EMAIL]);
let adminPassword = null;
if (existing.rows.length > 0) {
  console.log(`admin user already exists: ${ADMIN_EMAIL}`);
} else {
  adminPassword = `${randomBytes(12).toString("base64url")}!A1z`;
  const userId = randomUUID();
  const esc = (s) => s.replace(/'/g, "''");
  // Literals are inlined (not parameterized): the connection pooler's
  // transaction mode cannot always infer parameter types.
  // NOTE: GoTrue requires raw_*_meta_data = '{}' and the token columns = ''
  // (NULL breaks its query scan during login → HTTP 500).
  await client.query(
    `insert into auth.users (instance_id, id, aud, role, email, encrypted_password, email_confirmed_at, raw_app_meta_data, raw_user_meta_data, confirmation_token, recovery_token, email_change_token_new, email_change, created_at, updated_at)
     values ('00000000-0000-0000-0000-000000000000', '${userId}', 'authenticated', 'authenticated', '${esc(ADMIN_EMAIL)}', crypt('${esc(adminPassword)}', gen_salt('bf')), now(), '{}'::jsonb, '{}'::jsonb, '', '', '', '', now(), now())`,
  );
  await client.query(
    `insert into auth.identities (user_id, provider_id, identity_data, provider, last_sign_in_at, created_at, updated_at)
     values ('${userId}', '${userId}', jsonb_build_object('sub', '${userId}', 'email', '${esc(ADMIN_EMAIL)}'), 'email', now(), now(), now())`,
  );
  console.log(`admin user created: ${ADMIN_EMAIL}`);
}

// Save admin credentials to .env.local (never printed)
const envPath = resolve(process.cwd(), ".env.local");
const envContent = readFileSync(envPath, "utf8");
const lines = [`ADMIN_EMAIL=${ADMIN_EMAIL}`];
if (adminPassword) lines.push(`ADMIN_PASSWORD=${adminPassword}`);
if (!envContent.includes("ADMIN_EMAIL=")) {
  appendFileSync(envPath, `\n# Admin bootstrap login (created by scripts/setup-database.mjs)\n${lines.join("\n")}\n`);
  console.log("admin credentials saved to .env.local (ADMIN_EMAIL / ADMIN_PASSWORD)");
} else if (adminPassword && !envContent.includes("ADMIN_PASSWORD=")) {
  appendFileSync(envPath, `ADMIN_PASSWORD=${adminPassword}\n`);
  console.log("ADMIN_PASSWORD saved to .env.local");
}

// ── Verify ──────────────────────────────────────────────────────────────────
for (const table of ["projects", "services", "before_after", "testimonials", "inquiries", "site_settings"]) {
  const r = await client.query(`select count(*)::int as n from public.${table}`);
  console.log(`  ${table}: ${r.rows[0].n} rows`);
}
const u = await client.query("select count(*)::int as n from auth.users");
console.log(`  auth.users: ${u.rows[0].n} user(s)`);

await client.end();
console.log("\nDONE — database is ready. Start the app and log in at /admin");
