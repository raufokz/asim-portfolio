// Live proof that the public site reads from Supabase:
// updates site_settings.availability to a unique marker, prints it, and (with --revert) restores.
// Usage: node scripts/live-db-proof.mjs [--revert]
import { loadEnv } from "./env.mjs";

const env = loadEnv();
const URL = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

const login = await fetch(`${URL}/auth/v1/token?grant_type=password`, {
  method: "POST",
  headers: { apikey: KEY, "Content-Type": "application/json" },
  body: JSON.stringify({ email: env.ADMIN_EMAIL, password: env.ADMIN_PASSWORD }),
});
const { access_token } = await login.json();
const headers = {
  apikey: KEY,
  Authorization: `Bearer ${access_token}`,
  "Content-Type": "application/json",
  Prefer: "return=representation",
};

const get = await fetch(`${URL}/rest/v1/site_settings?key=eq.availability&select=value`, { headers });
const current = (await get.json())[0]?.value;
console.log(`current availability in DB: ${JSON.stringify(current)}`);

const revert = process.argv.includes("--revert");
const value = revert ? current : "LIVE-DB-PROOF-7f3a9c";
const res = await fetch(`${URL}/rest/v1/site_settings?key=eq.availability`, {
  method: "PATCH",
  headers,
  body: JSON.stringify({ value, updated_at: new Date().toISOString() }),
});
const body = await res.json();
console.log(`${revert ? "reverted" : "set"} availability -> ${res.status} ${JSON.stringify(body[0]?.value ?? body)}`);
