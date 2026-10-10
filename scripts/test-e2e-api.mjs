// End-to-end test of the public contact form -> API route -> Supabase -> admin visibility.
// Reads credentials from .env.local; never prints them.
import { loadEnv } from "./env.mjs";

const env = loadEnv();
const SITE = "http://localhost:3000";
const URL = env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const ADMIN_EMAIL = env.ADMIN_EMAIL;
const ADMIN_PASSWORD = env.ADMIN_PASSWORD;

let pass = 0;
let fail = 0;
const check = (name, ok, detail = "") => {
  if (ok) {
    pass++;
    console.log(`PASS  ${name}`);
  } else {
    fail++;
    console.log(`FAIL  ${name} ${detail}`);
  }
};

async function inquiryCount() {
  // Log in as admin, then count inquiries (RLS allows authenticated reads).
  const login = await fetch(`${URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  const { access_token } = await login.json();
  const res = await fetch(`${URL}/rest/v1/inquiries?select=id,name,email,status`, {
    headers: { apikey: KEY, Authorization: `Bearer ${access_token}` },
  });
  return res.json();
}

const before = await inquiryCount();
console.log(`inquiries in DB before: ${before.length}`);

// 1. Valid inquiry -> 200, saved, demo=false
{
  const res = await fetch(`${SITE}/api/inquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "E2E Test Client",
      email: "e2e-test@realtestdomain.com",
      company: "E2E Co",
      service: "brand-identity",
      budget: "$500 – $1,500",
      deadline: "Within a month",
      message: "This is an end-to-end test inquiry from the automated test suite.",
      website: "",
    }),
  });
  const body = await res.json();
  check("valid inquiry -> 200", res.status === 200, `got ${res.status}`);
  check("valid inquiry -> saved (demo=false)", body.ok === true && body.demo === false, JSON.stringify(body));
}

// 2. Invalid inquiry -> 422 with field errors
{
  const res = await fetch(`${SITE}/api/inquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "X",
      email: "not-an-email",
      service: "",
      message: "short",
      website: "",
    }),
  });
  const body = await res.json();
  check("invalid inquiry -> 422", res.status === 422, `got ${res.status}`);
  check(
    "invalid inquiry -> field errors",
    !!body.errors && !!body.errors.name && !!body.errors.email && !!body.errors.message,
    JSON.stringify(body.errors ?? body),
  );
}

// 3. Honeypot -> 200 but NOT saved
{
  const res = await fetch(`${SITE}/api/inquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Bot McBotface",
      email: "bot@spam.example",
      service: "brand-identity",
      message: "Buy my stuff please, this is spam",
      website: "http://spam.example",
    }),
  });
  const body = await res.json();
  check("honeypot -> 200 (silent)", res.status === 200, `got ${res.status}`);
  check("honeypot -> appears ok to bot", body.ok === true, JSON.stringify(body));
}

// 4. Verify DB state: exactly one new row (the valid one), honeypot not saved
{
  const after = await inquiryCount();
  const newRows = after.filter((r) => !before.some((b) => b.id === r.id));
  check("exactly one new row in DB", newRows.length === 1, `got ${newRows.length}`);
  check(
    "new row is the valid inquiry",
    newRows[0]?.name === "E2E Test Client" && newRows[0]?.email === "e2e-test@realtestdomain.com",
    JSON.stringify(newRows[0] ?? null),
  );
  check("new row status = new", newRows[0]?.status === "new", newRows[0]?.status);
  check(
    "honeypot bot NOT in DB",
    !after.some((r) => r.email === "bot@spam.example"),
  );
  console.log(`inquiries in DB after: ${after.length}`);
}

// 5. Malformed JSON -> 400
{
  const res = await fetch(`${SITE}/api/inquiries`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: "{not json",
  });
  check("malformed JSON -> 400", res.status === 400, `got ${res.status}`);
}

// 6. Non-POST method -> 405
{
  const res = await fetch(`${SITE}/api/inquiries`);
  check("GET /api/inquiries -> 405", res.status === 405, `got ${res.status}`);
}

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
