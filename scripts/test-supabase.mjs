/**
 * End-to-end verification of the Supabase backend:
 *  - anon (publishable key): can read published content, can submit inquiries,
 *    but CANNOT read inquiries or manage content (RLS)
 *  - authenticated (admin login): full access
 * Run: node scripts/test-supabase.mjs
 */
import { loadEnv } from "./env.mjs";

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const email = env.ADMIN_EMAIL;
const password = env.ADMIN_PASSWORD;

let failures = 0;
const check = (name, ok, detail = "") => {
  console.log(`${ok ? "PASS" : "FAIL"}  ${name}${detail ? ` — ${detail}` : ""}`);
  if (!ok) failures++;
};

const anonHeaders = { apikey: key, Authorization: `Bearer ${key}` };

// 1. anon can read published projects
const r1 = await fetch(`${url}/rest/v1/projects?select=slug&published=eq.true&limit=3`, { headers: anonHeaders });
check("anon SELECT projects", r1.status === 200, `HTTP ${r1.status}`);

// 2. anon CANNOT read inquiries (RLS filters all rows → 200 with count 0)
const r2 = await fetch(`${url}/rest/v1/inquiries?select=count`, { headers: anonHeaders });
const r2body = await r2.json();
check(
  "anon SELECT inquiries blocked",
  r2.status === 200 && Array.isArray(r2body) && (r2body[0]?.count ?? 1) === 0,
  `HTTP ${r2.status} body=${JSON.stringify(r2body).slice(0, 80)}`,
);

// 3. anon CANNOT manage content (RLS)
const r3 = await fetch(`${url}/rest/v1/projects`, {
  method: "POST",
  headers: { ...anonHeaders, "Content-Type": "application/json", Prefer: "return=minimal" },
  body: JSON.stringify({ slug: "rls-test", title: "x", category: "x", year: "2026", description: "x", cover: "/x.jpg" }),
});
check("anon INSERT project blocked", r3.status === 401 || r3.status === 403, `HTTP ${r3.status}`);

// 4. anon CAN submit an inquiry
const inquiry = {
  name: "RLS Test Bot",
  email: "rls-test@example.com",
  company: "",
  service: "logo-identity",
  budget: "Not sure yet",
  deadline: "Flexible",
  message: "Automated RLS test inquiry — safe to delete.",
};
const r4 = await fetch(`${url}/rest/v1/inquiries`, {
  method: "POST",
  headers: { ...anonHeaders, "Content-Type": "application/json", Prefer: "return=minimal" },
  body: JSON.stringify(inquiry),
});
check("anon INSERT inquiry allowed", r4.status === 201, `HTTP ${r4.status}`);

// 5. admin login
const r5 = await fetch(`${url}/auth/v1/token?grant_type=password`, {
  method: "POST",
  headers: { apikey: key, "Content-Type": "application/json" },
  body: JSON.stringify({ email, password }),
});
const authBody = await r5.json();
check("admin login", r5.status === 200 && !!authBody.access_token, `HTTP ${r5.status}`);
const token = authBody.access_token ?? "";
const authHeaders = { apikey: key, Authorization: `Bearer ${token}` };

if (token) {
  // 6. authed can read inquiries
  const r6 = await fetch(`${url}/rest/v1/inquiries?select=count`, { headers: authHeaders });
  check("admin SELECT inquiries", r6.status === 200, `HTTP ${r6.status}`);

  // 7. authed can manage content (insert + delete a test project)
  const r7 = await fetch(`${url}/rest/v1/projects`, {
    method: "POST",
    headers: { ...authHeaders, "Content-Type": "application/json", Prefer: "return=representation" },
    body: JSON.stringify({ slug: "rls-test", title: "RLS Test", category: "Test", year: "2026", description: "test", cover: "/x.jpg", published: false }),
  });
  const created = await r7.json();
  check("admin INSERT project", r7.status === 201, `HTTP ${r7.status}`);
  if (r7.status === 201 && created[0]) {
    const r8 = await fetch(`${url}/rest/v1/projects?id=eq.${created[0].id}`, { method: "DELETE", headers: authHeaders });
    check("admin DELETE project", r8.status === 204, `HTTP ${r8.status}`);
  }

  // 8. authed can update inquiry status
  const r9 = await fetch(`${url}/rest/v1/inquiries?email=eq.rls-test@example.com`, { headers: authHeaders });
  const rows = await r9.json();
  if (Array.isArray(rows) && rows[0]) {
    const r10 = await fetch(`${url}/rest/v1/inquiries?id=eq.${rows[0].id}`, {
      method: "PATCH",
      headers: { ...authHeaders, "Content-Type": "application/json", Prefer: "return=minimal" },
      body: JSON.stringify({ status: "read" }),
    });
    check("admin UPDATE inquiry status", r10.status === 204, `HTTP ${r10.status}`);
    // cleanup: delete the test inquiry
    const r11 = await fetch(`${url}/rest/v1/inquiries?id=eq.${rows[0].id}`, { method: "DELETE", headers: authHeaders });
    check("admin DELETE test inquiry (cleanup)", r11.status === 204, `HTTP ${r11.status}`);
  } else {
    check("find test inquiry for cleanup", false, "row not found");
  }
}

console.log(failures === 0 ? "\nALL CHECKS PASSED" : `\n${failures} CHECK(S) FAILED`);
process.exit(failures === 0 ? 0 : 1);
