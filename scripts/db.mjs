/** Shared Postgres helpers for the setup scripts (connection + SQL file apply). */
import { readFileSync } from "node:fs";
import dns from "node:dns/promises";
import pg from "pg";

const { Client } = pg;

async function tryConnect(config) {
  const client = new Client({ ...config, ssl: { rejectUnauthorized: false }, connectionTimeoutMillis: 10000 });
  await client.connect();
  await client.query("select 1");
  return client;
}

/**
 * Connect to the project database.
 *   1. DATABASE_URL from .env.local (direct connection).
 *   2. Supabase connection pooler, trying each region (port 6543 then 5432).
 */
export async function connect(env) {
  if (env.DATABASE_URL) {
    try {
      console.log("trying direct connection (DATABASE_URL)…");
      // Strip sslmode: newer pg maps `require` to `verify-full`, which rejects
      // Supabase's CA. We connect with ssl.rejectUnauthorized=false instead.
      const connectionString = env.DATABASE_URL.replace(/[?&]sslmode=[^&]*/g, "");
      const client = await tryConnect({ connectionString });
      console.log("connected: direct");
      return client;
    } catch (e) {
      console.log("direct failed:", e.code ?? e.message);
    }
  }

  const ref = new URL(env.NEXT_PUBLIC_SUPABASE_URL).hostname.split(".")[0];
  const encodedPassword = env.DATABASE_URL?.match(/^postgresql:\/\/postgres:([^@]*)@/)?.[1] ?? "";
  const password = decodeURIComponent(encodedPassword);
  const regions = [
    "ap-southeast-1", "ap-southeast-2", "ap-northeast-1", "ap-northeast-2",
    "ap-south-1", "ap-east-1", "eu-central-1", "eu-central-2", "eu-west-1",
    "eu-west-2", "eu-west-3", "eu-north-1", "us-east-1", "us-east-2",
    "us-west-1", "us-west-2", "sa-east-1", "ca-central-1", "me-south-1",
    "me-central-1", "af-south-1",
  ];
  const hosts = [`${ref}.pooler.supabase.com`, ...regions.map((r) => `aws-0-${r}.pooler.supabase.com`)];
  for (const host of hosts) {
    try { await dns.resolve4(host); } catch { continue; }
    for (const port of [6543, 5432]) {
      try {
        const client = await tryConnect({
          host, port, user: `postgres.${ref}`, password, database: "postgres",
        });
        console.log(`connected: pooler ${host}:${port}`);
        return client;
      } catch { /* next */ }
    }
  }
  throw new Error("Could not connect to the database (direct or pooler). Check DATABASE_URL / network.");
}

/** Split SQL into statements, respecting single-quoted strings. */
export function splitStatements(sql) {
  const withoutComments = sql
    .split(/\n/)
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n");
  const statements = [];
  let current = "";
  let inString = false;
  for (let i = 0; i < withoutComments.length; i++) {
    const ch = withoutComments[i];
    if (inString) {
      current += ch;
      if (ch === "'") {
        if (withoutComments[i + 1] === "'") {
          current += "'";
          i++;
        } else {
          inString = false;
        }
      }
    } else if (ch === "'") {
      inString = true;
      current += ch;
    } else if (ch === ";") {
      if (current.trim().length > 0) statements.push(current.trim());
      current = "";
    } else {
      current += ch;
    }
  }
  if (current.trim().length > 0) statements.push(current.trim());
  return statements;
}

/** Apply every statement in a .sql file to the given client. */
export async function applySqlFile(client, path) {
  const statements = splitStatements(readFileSync(path, "utf8"));
  console.log(`applying ${statements.length} statements from ${path}…`);
  for (const [i, stmt] of statements.entries()) {
    try {
      await client.query(stmt);
    } catch (e) {
      console.error(`statement ${i + 1} failed:`, e.message);
      console.error(stmt.slice(0, 200));
      process.exit(1);
    }
  }
  console.log("migration applied ✓");
}
