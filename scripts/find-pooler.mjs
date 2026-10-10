/**
 * Find a reachable Supabase connection pooler for this project.
 * The pooler hostname is region-based; we authenticate against each candidate
 * with the project-qualified username (postgres.<project-ref>) until one works.
 * Prints the working connection config (without the password).
 */
import dns from "node:dns/promises";
import { Client } from "pg";
import { loadEnv } from "./env.mjs";

const env = loadEnv();
const ref = new URL(env.NEXT_PUBLIC_SUPABASE_URL).hostname.split(".")[0];
// DATABASE_URL stores the percent-encoded password — decode it for pg.
const encodedPassword = env.DATABASE_URL?.match(/^postgresql:\/\/postgres:([^@]*)@/)?.[1];
const password = encodedPassword ? decodeURIComponent(encodedPassword) : "";

console.log("project ref:", ref);

// Candidate hostnames: dedicated pooler pattern first, then shared poolers by region.
const candidates = [
  `${ref}.pooler.supabase.com`,
  ...[
    "ap-southeast-1", "ap-southeast-2", "ap-northeast-1", "ap-northeast-2",
    "ap-south-1", "ap-east-1", "eu-central-1", "eu-central-2", "eu-west-1",
    "eu-west-2", "eu-west-3", "eu-north-1", "us-east-1", "us-east-2",
    "us-west-1", "us-west-2", "sa-east-1", "ca-central-1", "me-south-1",
    "me-central-1", "af-south-1",
  ].map((r) => `aws-0-${r}.pooler.supabase.com`),
];

const ports = [6543, 5432];

for (const host of candidates) {
  let addresses;
  try {
    addresses = await dns.resolve4(host);
  } catch {
    continue; // no A record → skip silently
  }
  for (const port of ports) {
    const client = new Client({
      host,
      port,
      user: `postgres.${ref}`,
      password,
      database: "postgres",
      ssl: { rejectUnauthorized: false },
      connectionTimeoutMillis: 8000,
      query_timeout: 8000,
    });
    try {
      await client.connect();
      const r = await client.query("select current_database() as db, current_user as usr");
      console.log(`SUCCESS host=${host} port=${port} → db=${r.rows[0].db} user=${r.rows[0].usr}`);
      console.log(`POOLER_CONNECTION_STRING=postgresql://postgres.${ref}:ENCODED_PASSWORD@${host}:${port}/postgres`);
      await client.end();
      process.exit(0);
    } catch (e) {
      const code = e.code ?? "";
      if (code === "28P01") {
        console.log(`auth failed (wrong region?) ${host}:${port} — ${e.message}`);
      }
      // try next
    } finally {
      try { await client.end(); } catch {}
    }
  }
}

console.log("NO POOLER REACHABLE — direct DB and all regional poolers failed.");
process.exit(1);
