// Deletes leftover test inquiries (from test-supabase.mjs anon-insert checks).
// Keeps real inquiries. Reads credentials from .env.local; never prints them.
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
const headers = { apikey: KEY, Authorization: `Bearer ${access_token}` };

const res = await fetch(`${URL}/rest/v1/inquiries?select=id,name,email,created_at`, { headers });
const rows = await res.json();
console.log(`inquiries found: ${rows.length}`);

// Test rows have recognizable test markers (from test scripts).
const isTestRow = (r) =>
  /test/i.test(r.name) || /test/i.test(r.email) || /example/i.test(r.email) || /e2e/i.test(r.email) || /realtestdomain/i.test(r.email);

let deleted = 0;
for (const row of rows) {
  if (isTestRow(row)) {
    const del = await fetch(`${URL}/rest/v1/inquiries?id=eq.${row.id}`, {
      method: "DELETE",
      headers,
    });
    if (del.status === 204) {
      deleted++;
      console.log(`deleted test row: ${row.name} <${row.email}>`);
    } else {
      console.log(`FAILED to delete ${row.id}: ${del.status}`);
    }
  } else {
    console.log(`kept real inquiry: ${row.name} <${row.email}>`);
  }
}

const after = await (await fetch(`${URL}/rest/v1/inquiries?select=id`, { headers })).json();
console.log(`\ndeleted ${deleted}, remaining ${after.length}`);
