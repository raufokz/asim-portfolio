// Verifies the exact queries the admin dashboard pages run (authed reads of all tables).
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

const tables = [
  ["dashboard counts", "projects?select=count", "count"],
  ["dashboard counts", "services?select=count", "count"],
  ["dashboard counts", "before_after?select=count", "count"],
  ["dashboard counts", "testimonials?select=count", "count"],
  ["dashboard counts", "inquiries?select=count", "count"],
  ["inquiries page", "inquiries?select=*&order=created_at.desc&limit=50", null],
  ["projects page", "projects?select=*&order=sort_order.asc", null],
  ["services page", "services?select=*&order=sort_order.asc", null],
  ["before-after page", "before_after?select=*&order=sort_order.asc", null],
  ["before-after page", "projects?select=id,slug,title&order=sort_order.asc", null],
  ["testimonials page", "testimonials?select=*&order=sort_order.asc", null],
  ["settings page", "site_settings?select=key,value", null],
];

let fail = 0;
for (const [page, query, mode] of tables) {
  const res = await fetch(`${URL}/rest/v1/${query}`, { headers });
  const body = await res.json();
  const ok =
    res.status === 200 &&
    (mode === "count" ? typeof body[0]?.count === "number" : Array.isArray(body));
  if (!ok) fail++;
  console.log(
    `${ok ? "PASS" : "FAIL"}  ${page}: ${query.slice(0, 48)} -> ${res.status} ${
      Array.isArray(body) ? `${body.length} rows` : JSON.stringify(body).slice(0, 60)
    }`,
  );
}
process.exit(fail === 0 ? 0 : 1);
