/** Round 2: validate the publishable key against real endpoints + hunt for an IPv4 DB path. */
import dns from "node:dns/promises";
import net from "node:net";
import { loadEnv } from "./env.mjs";

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

// 1. Does the publishable key authenticate? Query a (probably missing) table.
//    PGRST205/404 = key OK (auth passed, table missing). 401 = key invalid.
try {
  const res = await fetch(`${url}/rest/v1/projects?select=count`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  const body = await res.text();
  console.log("GET /rest/v1/projects (anon) →", res.status, body.slice(0, 200));
} catch (e) {
  console.log("GET /rest/v1/projects → ERROR", String(e).slice(0, 120));
}

// 2. Auth endpoint alive? (wrong creds → 400 invalid_grant, not 401)
try {
  const res = await fetch(`${url}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: key, "Content-Type": "application/json" },
    body: JSON.stringify({ email: "nobody@example.com", password: "wrong-password" }),
  });
  const body = await res.text();
  console.log("POST /auth/v1/token (bad creds) →", res.status, body.slice(0, 160));
} catch (e) {
  console.log("POST /auth/v1/token → ERROR", String(e).slice(0, 120));
}

// 3. Auth health with key
try {
  const res = await fetch(`${url}/auth/v1/health`, { headers: { apikey: key } });
  console.log("GET /auth/v1/health (key) →", res.status, await res.text());
} catch (e) {
  console.log("GET /auth/v1/health → ERROR", String(e).slice(0, 120));
}

// 4. Hunt for IPv4 on the DB host via resolve4 (different resolver than lookup)
const dbHost = "db.alovdygyvacafjcnzomy.supabase.co";
try {
  const a = await dns.resolve4(dbHost);
  console.log("resolve4", dbHost, "→", a.join(", "));
} catch (e) {
  console.log("resolve4", dbHost, "→ no A record:", e.code);
}

// 5. Try TCP 5432/6543 on the IPv6 address (in case IPv6 works after all)
const v6 = "2406:da14:1d4f:7401:802e:89bb:b367:f69";
for (const port of [5432, 6543]) {
  const ok = await new Promise((resolve) => {
    const s = net.connect({ host: v6, port, timeout: 6000, family: 6 });
    s.on("connect", () => { s.end(); resolve(true); });
    s.on("timeout", () => { s.destroy(); resolve(false); });
    s.on("error", (e) => { console.log(`  (${port} err: ${e.code})`); resolve(false); });
  });
  console.log(`TCP [${v6}]:${port} → ${ok ? "OPEN" : "unreachable"}`);
}

// 6. Try the Supabase connection pooler hostname pattern (has A records)
for (const pooler of [
  "aws-0-ap-southeast-1.pooler.supabase.com",
  "aws-0-eu-central-1.pooler.supabase.com",
  "aws-0-us-east-1.pooler.supabase.com",
  "aws-0-us-west-1.pooler.supabase.com",
  "aws-0-eu-west-2.pooler.supabase.com",
  "aws-0-ap-south-1.pooler.supabase.com",
]) {
  try {
    const a = await dns.resolve4(pooler);
    const ok = await new Promise((resolve) => {
      const s = net.connect({ host: a[0], port: 6543, timeout: 5000 });
      s.on("connect", () => { s.end(); resolve(true); });
      s.on("timeout", () => { s.destroy(); resolve(false); });
      s.on("error", () => resolve(false));
    });
    console.log(`pooler ${pooler} (${a[0]}) :6543 → ${ok ? "OPEN" : "closed"}`);
    if (ok) break;
  } catch {
    console.log(`pooler ${pooler} → no A record`);
  }
}
