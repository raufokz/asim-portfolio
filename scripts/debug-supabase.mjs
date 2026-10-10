/** Debug helper: inspect REST responses + DNS/IPv4 reachability. No secrets printed. */
import dns from "node:dns/promises";
import { loadEnv } from "./env.mjs";

const env = loadEnv();
const url = env.NEXT_PUBLIC_SUPABASE_URL;
const key = env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;
const host = new URL(url).hostname;
const dbHost = env.DATABASE_URL ? new URL(env.DATABASE_URL.replace("postgresql://", "http://")).hostname : null;

console.log("REST host:", host);
console.log("DB host:  ", dbHost);

// DNS records
for (const h of [host, dbHost]) {
  if (!h) continue;
  try {
    const all = await dns.lookup(h, { all: true });
    console.log(`DNS ${h}:`, all.map((a) => `${a.family}:${a.address}`).join(", "));
  } catch (e) {
    console.log(`DNS ${h}: FAILED — ${e.code}`);
  }
}

// Auth health (no key needed)
try {
  const res = await fetch(`${url}/auth/v1/health`);
  console.log("GET /auth/v1/health →", res.status, await res.text());
} catch (e) {
  console.log("GET /auth/v1/health → ERROR", String(e).slice(0, 120));
}

// REST root with key — print body (PostgREST errors are not secret)
try {
  const res = await fetch(`${url}/rest/v1/`, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  const body = await res.text();
  console.log("GET /rest/v1/ →", res.status, body.slice(0, 300));
} catch (e) {
  console.log("GET /rest/v1/ → ERROR", String(e).slice(0, 120));
}

// REST root WITHOUT key (should be 401/403 — confirms endpoint alive)
try {
  const res = await fetch(`${url}/rest/v1/`);
  console.log("GET /rest/v1/ (no key) →", res.status, (await res.text()).slice(0, 120));
} catch (e) {
  console.log("GET /rest/v1/ (no key) → ERROR", String(e).slice(0, 120));
}

// TCP reachability on 5432 and 6543 (IPv4)
if (dbHost) {
  const v4 = (await dns.lookup(dbHost, { family: 4 }).catch(() => null));
  console.log("DB IPv4:", v4?.address ?? "none");
  if (v4) {
    for (const port of [5432, 6543]) {
      const ok = await new Promise((resolve) => {
        const net = require("node:net");
        const s = net.connect({ host: v4.address, port, timeout: 8000 });
        s.on("connect", () => { s.end(); resolve(true); });
        s.on("timeout", () => { s.destroy(); resolve(false); });
        s.on("error", () => resolve(false));
      });
      console.log(`TCP ${v4.address}:${port} → ${ok ? "OPEN" : "blocked/closed"}`);
    }
  }
}
