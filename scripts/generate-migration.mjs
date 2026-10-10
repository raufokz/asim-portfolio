/**
 * Generates supabase/migrations/0001_init.sql from the local content files:
 * schema + Row Level Security policies + idempotent seed data.
 *
 * The SQL is plain statements only (no dollar-quoted blocks) so it can be
 * executed statement-by-statement through any connection, including the
 * Supabase connection pooler. It is also safe to paste into the Supabase
 * dashboard SQL Editor. Contains NO secrets.
 *
 * Run: node scripts/generate-migration.mjs
 */
import ts from "typescript";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

/** Transpile a TS data file to a temp .mjs and import it. */
async function importTsData(relPath) {
  const abs = resolve(root, relPath);
  const source = readFileSync(abs, "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: {
      module: ts.ModuleKind.ESNext,
      target: ts.ScriptTarget.ES2022,
    },
  });
  const tmp = resolve("/tmp", relPath.replace(/\//g, "_").replace(/\.ts$/, ".mjs"));
  writeFileSync(tmp, outputText);
  return import(tmp);
}

const sqlString = (v) => `'${String(v ?? "").replace(/'/g, "''")}'`;
const sqlArray = (arr) =>
  arr && arr.length ? `ARRAY[${arr.map(sqlString).join(", ")}]::text[]` : `'{}'::text[]`;
const sqlJson = (v) => `${sqlString(JSON.stringify(v ?? []))}::jsonb`;
const sqlBool = (v) => (v ? "true" : "false");

const { projects } = await importTsData("src/data/projects.ts");
const { services } = await importTsData("src/data/services.ts");
const { beforeAfterItems } = await importTsData("src/data/beforeAfter.ts");
const { testimonials } = await importTsData("src/data/testimonials.ts");
const { site } = await importTsData("src/data/site.ts");

const statements = [];
const push = (s) => statements.push(s.trim());

// ── Schema ──────────────────────────────────────────────────────────────────
push(`create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
)`);

push(`create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  year text not null,
  description text not null,
  cover text not null,
  thumbnail text,
  client text,
  overview text,
  brief text,
  challenge text,
  approach text,
  process text[] not null default '{}',
  services text[] not null default '{}',
  palette jsonb not null default '[]',
  fonts jsonb not null default '[]',
  before_after_slug text,
  is_concept boolean not null default true,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
)`);

push(`create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text not null,
  category text not null,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
)`);

push(`create table if not exists public.before_after (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  description text,
  before_image text not null,
  after_image text not null,
  before_label text not null default 'Before',
  after_label text not null default 'After',
  project_slug text,
  is_concept boolean not null default true,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
)`);

push(`create table if not exists public.testimonials (
  id uuid primary key default gen_random_uuid(),
  quote text not null,
  name text not null,
  role text,
  company text,
  is_placeholder boolean not null default false,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
)`);

push(`create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  company text,
  service text,
  budget text,
  deadline text,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived')),
  created_at timestamptz not null default now()
)`);

// ── Row Level Security ──────────────────────────────────────────────────────
// Public (anon) can READ published content and INSERT inquiries.
// Authenticated (the admin) can do everything.
// The admin UI is only a convenience — the DATABASE enforces access.
const contentTables = ["projects", "services", "before_after", "testimonials"];
for (const table of contentTables) {
  push(`alter table public.${table} enable row level security`);
  push(`drop policy if exists "public read published ${table}" on public.${table}`);
  push(`create policy "public read published ${table}" on public.${table}
    for select to anon, authenticated using (published = true)`);
  push(`drop policy if exists "admin manage ${table}" on public.${table}`);
  push(`create policy "admin manage ${table}" on public.${table}
    for all to authenticated using (true) with check (true)`);
}

push(`alter table public.site_settings enable row level security`);
push(`drop policy if exists "public read site settings" on public.site_settings`);
push(`create policy "public read site settings" on public.site_settings
  for select to anon, authenticated using (true)`);
push(`drop policy if exists "admin manage site settings" on public.site_settings`);
push(`create policy "admin manage site settings" on public.site_settings
  for all to authenticated using (true) with check (true)`);

push(`alter table public.inquiries enable row level security`);
push(`drop policy if exists "public insert inquiries" on public.inquiries`);
push(`create policy "public insert inquiries" on public.inquiries
  for insert to anon, authenticated with check (true)`);
push(`drop policy if exists "admin read inquiries" on public.inquiries`);
push(`create policy "admin read inquiries" on public.inquiries
  for select to authenticated using (true)`);
push(`drop policy if exists "admin update inquiries" on public.inquiries`);
push(`create policy "admin update inquiries" on public.inquiries
  for update to authenticated using (true) with check (true)`);
push(`drop policy if exists "admin delete inquiries" on public.inquiries`);
push(`create policy "admin delete inquiries" on public.inquiries
  for delete to authenticated using (true)`);

// ── Seed data (idempotent upserts) ──────────────────────────────────────────
for (const [i, p] of projects.entries()) {
  push(`insert into public.projects (slug, title, category, year, description, cover, thumbnail, client, overview, brief, challenge, approach, process, services, palette, fonts, before_after_slug, is_concept, published, sort_order, updated_at)
    values (${sqlString(p.slug)}, ${sqlString(p.title)}, ${sqlString(p.category)}, ${sqlString(p.year)}, ${sqlString(p.description)}, ${sqlString(p.cover)}, ${sqlString(p.thumbnail)}, ${sqlString(p.client)}, ${sqlString(p.overview)}, ${sqlString(p.brief)}, ${sqlString(p.challenge)}, ${sqlString(p.approach)}, ${sqlArray(p.process)}, ${sqlArray(p.services)}, ${sqlJson(p.palette)}, ${sqlJson(p.fonts)}, ${p.beforeAfterId ? sqlString(p.beforeAfterId) : "null"}, ${sqlBool(p.isConcept)}, true, ${i}, now())
    on conflict (slug) do update set title = excluded.title, category = excluded.category, year = excluded.year, description = excluded.description, cover = excluded.cover, thumbnail = excluded.thumbnail, client = excluded.client, overview = excluded.overview, brief = excluded.brief, challenge = excluded.challenge, approach = excluded.approach, process = excluded.process, services = excluded.services, palette = excluded.palette, fonts = excluded.fonts, before_after_slug = excluded.before_after_slug, is_concept = excluded.is_concept, published = excluded.published, sort_order = excluded.sort_order, updated_at = now()`);
}

for (const [i, s] of services.entries()) {
  push(`insert into public.services (slug, title, description, category, sort_order, published, updated_at)
    values (${sqlString(s.id)}, ${sqlString(s.title)}, ${sqlString(s.description)}, ${sqlString(s.category)}, ${i}, true, now())
    on conflict (slug) do update set title = excluded.title, description = excluded.description, category = excluded.category, sort_order = excluded.sort_order, published = excluded.published, updated_at = now()`);
}

for (const [i, b] of beforeAfterItems.entries()) {
  push(`insert into public.before_after (slug, title, description, before_image, after_image, before_label, after_label, project_slug, is_concept, published, sort_order, updated_at)
    values (${sqlString(b.id)}, ${sqlString(b.title)}, ${sqlString(b.description)}, ${sqlString(b.beforeImage)}, ${sqlString(b.afterImage)}, ${sqlString(b.beforeLabel ?? "Before")}, ${sqlString(b.afterLabel ?? "After")}, ${b.projectId ? sqlString(b.projectId) : "null"}, ${sqlBool(b.isConcept)}, true, ${i}, now())
    on conflict (slug) do update set title = excluded.title, description = excluded.description, before_image = excluded.before_image, after_image = excluded.after_image, before_label = excluded.before_label, after_label = excluded.after_label, project_slug = excluded.project_slug, is_concept = excluded.is_concept, published = excluded.published, sort_order = excluded.sort_order, updated_at = now()`);
}

for (const [i, t] of testimonials.entries()) {
  // Idempotent without a unique constraint: skip if an identical row exists.
  push(`insert into public.testimonials (quote, name, role, company, is_placeholder, published, sort_order, updated_at)
    select ${sqlString(t.quote)}, ${sqlString(t.name)}, ${sqlString(t.role)}, ${sqlString(t.company)}, ${sqlBool(t.isPlaceholder)}, true, ${i}, now()
    where not exists (select 1 from public.testimonials where name = ${sqlString(t.name)} and quote = ${sqlString(t.quote)})`);
}

const settingsEntries = [
  ["name", site.name],
  ["role", site.role],
  ["logoText", site.logoText],
  ["tagline", site.tagline],
  ["description", site.description],
  ["heroDescription", site.heroDescription],
  ["url", site.url],
  ["email", site.email],
  ["location", site.location],
  ["availability", site.availability],
  ["socials", site.socials],
];
for (const [key, value] of settingsEntries) {
  push(`insert into public.site_settings (key, value, updated_at)
    values (${sqlString(key)}, ${sqlJson(value)}, now())
    on conflict (key) do update set value = excluded.value, updated_at = now()`);
}

// ── Write file ──────────────────────────────────────────────────────────────
const header = `-- Muhammad Asim — Portfolio database: schema + RLS + seed data
-- Generated by scripts/generate-migration.mjs — safe to re-run (idempotent).
-- Apply via: Supabase dashboard → SQL Editor (paste & run)
--        or: node scripts/setup-database.mjs
-- Contains NO secrets. Admin user is bootstrapped separately by the setup script.
`;

const outDir = resolve(root, "supabase/migrations");
mkdirSync(outDir, { recursive: true });
const outFile = resolve(outDir, "0001_init.sql");
writeFileSync(outFile, `${header}\n${statements.map((s) => `${s};`).join("\n\n")}\n`);

console.log(`wrote ${outFile}`);
console.log(`statements: ${statements.length}`);
console.log(`seed rows: ${projects.length} projects, ${services.length} services, ${beforeAfterItems.length} before/after, ${testimonials.length} testimonials, ${settingsEntries.length} settings`);
