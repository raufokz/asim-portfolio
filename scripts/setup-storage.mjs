/**
 * Creates the `media` Supabase Storage bucket (for admin image uploads) and
 * its RLS policies. Applies supabase/migrations/0002_storage.sql — idempotent.
 *
 * Run: node scripts/setup-storage.mjs
 */
import { resolve } from "node:path";
import { loadEnv } from "./env.mjs";
import { connect, applySqlFile } from "./db.mjs";

const env = loadEnv();
const client = await connect(env);

await applySqlFile(client, resolve(process.cwd(), "supabase/migrations/0002_storage.sql"));

const bucket = await client.query("select id, public from storage.buckets where id = 'media'");
if (bucket.rows.length === 0) {
  console.error("media bucket was not created");
  process.exit(1);
}
console.log(`  media bucket: public=${bucket.rows[0].public}`);

const policies = await client.query(
  "select policyname from pg_policies where schemaname = 'storage' and tablename = 'objects' and policyname like 'media %' order by policyname",
);
console.log(`  media policies: ${policies.rows.map((r) => r.policyname).join(", ") || "none"}`);

await client.end();
console.log("\nDONE — image uploads are ready. Upload from /admin.");
