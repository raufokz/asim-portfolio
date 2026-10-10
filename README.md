# Muhammad Asim — Graphic Designer Portfolio

A premium, fully responsive portfolio website for **Muhammad Asim — Graphic Designer & Visual Artist**.
Built with **Next.js 15 (App Router) + TypeScript + Tailwind CSS v4 + Lucide icons**, backed by **Supabase** (Postgres + Auth + Row Level Security) with a full **admin dashboard** at `/admin`.

## Commands

```bash
npm run dev    # start the dev server (http://localhost:3000)
npm run build  # production build
npm start      # serve the production build (0.0.0.0:3000)
node scripts/setup-database.mjs    # apply schema + seed + admin user
node scripts/setup-storage.mjs     # create the `media` Storage bucket for uploads
node scripts/make-concept-art.mjs  # regenerate the concept before/after + portrait artwork
```

## What's inside

- **Hero** — editorial headline, layered artwork collage with a rotating badge, availability indicator (live from DB settings), entrance animations, scroll indicator.
- **Featured Work** — asymmetric 12-column grid of 10 concept projects; every card links to a full case study at `/work/[slug]` (overview, brief, challenge, approach, process, palette, typography, application mockups, before/after where relevant, next-project navigation).
- **Before & After** — accessible comparison slider (mouse drag, touch drag, arrow/Home/End keys, ARIA slider semantics) with 4 selectable concept comparisons.
- **Services** — all 24 design services with category filters and unique parametric SVG artwork per card. "Inquire about this" pre-selects the service in the contact form.
- **About / Process / Skills** — editorial about section, 4-step process timeline, tools & disciplines (no fake proficiency scores).
- **Testimonials** — clearly marked **placeholder** cards. Replace with real client feedback; never present them as authentic.
- **Contact** — full inquiry form (name, email, company, service, budget, deadline, message) with validation, loading state, honeypot, and **real submissions saved to Supabase** (visible in the admin dashboard).
- **Admin dashboard (`/admin`)** — manage inquiries, projects, services, before/after comparisons, testimonials, and site settings. See "Supabase backend & admin dashboard" below.
- **Footer** — branding, quick nav, dynamic copyright year, back-to-top.

## Editing content

**Primary way: the admin dashboard (`/admin`).** Log in with the admin account (see `.env.local` → `ADMIN_EMAIL` / `ADMIN_PASSWORD`). Changes appear on the public site within ~60 seconds (ISR revalidation). New projects, services, and before/after items created in the dashboard appear automatically — no code changes needed.

**Fallback / seed source: the local data files.** The public site reads from Supabase first and falls back to these files if the database is unreachable or not configured, so the site never breaks:

| File | What it controls |
| --- | --- |
| `src/data/site.ts` | Name, logo, tagline, email, location, availability, nav, social links, SEO description |
| `src/data/projects.ts` | All 10 projects + full case-study copy, palettes, fonts, process steps |
| `src/data/services.ts` | All 24 services, descriptions, categories/filters |
| `src/data/beforeAfter.ts` | The 4 comparison items (image paths, labels, copy) |
| `src/data/testimonials.ts` | Testimonials (currently placeholders) |
| `src/data/process.ts` | The 4 process steps |
| `src/data/skills.ts` | Tools list + skill categories |

If you edit these files, re-run `node scripts/setup-database.mjs` (or `node scripts/generate-migration.mjs` + apply) to re-seed the database from them.

## Honesty & placeholders (please read)

- **Projects** — every project is labeled **"Concept Project"** (`isConcept: true`). No fictional client, metric, award, or certification is presented as real.
- **Testimonials** — placeholder cards with a visible `PLACEHOLDER` badge. Replace with genuine quotes in the admin dashboard or remove the section.
- **Before/After** — comparisons are labeled *illustrative concept comparisons*, not client redesigns.
- **Contact form** — submissions are **really saved** to Supabase and managed in `/admin/inquiries`. If Supabase is not configured, the form shows an honest "demo mode — nothing was sent" notice and never pretends a submission succeeded.
- **Social links & email** — placeholders in the admin dashboard (Settings → Social links). Replace with real values.
- **Portrait** — `public/about/asim-portrait.jpg` is a stylized placeholder illustration; replace with a real photo.

## Supabase backend & admin dashboard

### Architecture

- **Database**: Supabase Postgres. Tables: `projects`, `services`, `before_after`, `testimonials`, `site_settings`, `inquiries` (see `supabase/migrations/0001_init.sql` — the full schema + seed, idempotent, safe to re-run).
- **Auth**: Supabase Auth (email + password). One admin user (`ADMIN_EMAIL`). The admin dashboard is a client-side gate; **real security is Row Level Security (RLS)** — anonymous visitors can only read *published* content and insert inquiries; only the authenticated admin can read inquiries or modify content.
- **Public site**: reads content live from Supabase via `src/lib/content.ts` (cached 60s with `unstable_cache`, pages use ISR `revalidate = 60`). Falls back to `src/data/*` if Supabase is unconfigured or unreachable.
- **Contact form**: POSTs to the built-in API route `/api/inquiries` (`src/app/api/inquiries/route.ts`), which validates input (422 with field errors on invalid), silently discards honeypot spam, and inserts into `inquiries`. Optionally forwards to `NEXT_PUBLIC_FORM_ENDPOINT` if you also want an external form service. If nothing is configured, it returns an honest 501 demo response.
- **Security model**: only the **publishable** key is used (safe to expose client-side). No secret/service key is needed or stored. `/admin` and `/api` are disallowed in `robots.txt` and the admin layout is `noindex`.

### Setup (fresh environment)

1. Create a Supabase project at https://supabase.com, note the **project URL**, **publishable key**, and **database password**.
2. Create `.env.local` (see `.env.example`):

   ```bash
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT-REF.supabase.co
   NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
   DATABASE_URL=postgresql://postgres.YOUR-PROJECT-REF:YOUR-DB-PASSWORD@aws-0-ap-northeast-1.pooler.supabase.com:6543/postgres?sslmode=require
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   # NEXT_PUBLIC_FORM_ENDPOINT=  (optional, external form service)
   ```

   > Use the **connection pooler** host (`aws-0-<region>.pooler.supabase.com:6543`, user `postgres.<project-ref>`) for scripts; the direct DB host is IPv6-only and unreachable from many networks. If your project is in a different region, adjust the pooler host (`node scripts/find-pooler.mjs` lists candidates).
3. Apply the schema + seed and create the admin user:

   ```bash
   node scripts/setup-database.mjs
   ```

   This applies `supabase/migrations/0001_init.sql` (92 statements, idempotent) and appends `ADMIN_EMAIL` + a random `ADMIN_PASSWORD` to `.env.local`.
4. Create the media bucket for image uploads:

   ```bash
   node scripts/setup-storage.mjs
   ```

   This applies `supabase/migrations/0002_storage.sql`: creates a public `media` bucket (anyone can read, only the signed-in admin can upload/delete).
5. Verify everything:

   ```bash
   node scripts/test-supabase.mjs   # 10 checks: RLS, anon/auth REST, admin login, CRUD
   npm run build && npm start
   node scripts/test-e2e-api.mjs   # 12 checks: live form -> API -> DB -> admin visibility
   ```
6. Open `/admin`, log in with the admin credentials, and start managing content.

### Admin dashboard usage

| Route | What you can do |
| --- | --- |
| `/admin` | Dashboard: counts of projects/services/comparisons/testimonials/inquiries + 5 most recent inquiries |
| `/admin/inquiries` | Read inquiries, change status (new → read → replied → archived), reply by email (mailto), delete. New-inquiry banner on the dashboard |
| `/admin/projects` | Full CRUD: title, slug, category, year, description, cover/thumbnail (**upload or paste**), client, case-study copy (overview/brief/challenge/approach), process steps, services, palette colors, fonts, before/after link, concept label, published toggle, sort order |
| `/admin/services` | CRUD: title, slug, description, category, sort order, published |
| `/admin/before-after` | CRUD: title, slug, description, before/after images (**upload or paste**) + labels, linked project, concept label, published |
| `/admin/testimonials` | CRUD: quote, name, role, company, **placeholder flag** (keep it on until you have a real quote), published |
| `/admin/settings` | Site-wide settings: name, role, logo text, tagline, SEO description, hero text, URL, email, location, availability badge, social links |

All edits are slide-over editors; the public site picks changes up within ~60 seconds. Image fields (project cover/thumbnail, before/after pairs) accept **direct file uploads** to Supabase Storage (bucket `media`, max 6 MB) as well as a pasted path/URL.

### Utility scripts (`scripts/`)

| Script | Purpose |
| --- | --- |
| `setup-database.mjs` | Apply migration + seed + create/reset the admin auth user (idempotent) |
| `setup-storage.mjs` | Create the `media` Storage bucket + upload policies (`0002_storage.sql`) |
| `generate-migration.mjs` | Regenerate `supabase/migrations/0001_init.sql` from `src/data/*` |
| `test-supabase.mjs` | 10 backend checks: RLS rules, anon/auth REST access, admin login, CRUD |
| `test-e2e-api.mjs` | 12 end-to-end checks against the running site: form → API → DB → admin |
| `test-admin-reads.mjs` | Verifies every admin-dashboard query works with the admin token |
| `repair-admin.mjs` | Dedupe testimonials, reset admin password, repair auth user |
| `fix-auth-user.mjs` | Fix manually created auth users (GoTrue needs `'{}'` meta + `''` token columns) |
| `cleanup-test-inquiries.mjs` | Delete test inquiries left by the test scripts |
| `live-db-proof.mjs` | Set/revert a marker in `site_settings` to prove the site renders live DB data |
| `check-supabase.mjs`, `debug-*.mjs`, `find-pooler.mjs` | Diagnostics |

### Security notes & maintenance

- **Rotate the database password** in the Supabase dashboard (Settings → Database) if it was ever pasted into a chat or shared. Then update `DATABASE_URL` in `.env.local`. `.env.local` is gitignored — never commit it.
- To **change the admin password**: edit `ADMIN_PASSWORD` in `.env.local`, then run `node scripts/repair-admin.mjs`.
- RLS policies live in `supabase/migrations/0001_init.sql`; re-applying the migration is safe (idempotent).
- The admin gate is client-side only — treat **RLS as the real security boundary** (it is correctly configured; see `test-supabase.mjs`).
- If the database is deleted/recreated, re-run `node scripts/setup-database.mjs`; the site keeps working from local fallback data in the meantime.

## Replacing images

**Easiest way: upload from the admin dashboard** (`/admin/projects`, `/admin/before-after`) — files go to the Supabase Storage `media` bucket and the URL is saved automatically. Requires `node scripts/setup-storage.mjs` once.

Manual fallback:
- Project covers: `public/work/*.jpg` (referenced in the projects data / admin dashboard)
- Before/after pairs: `public/before-after/*.jpg` (regenerate the vector originals with `node scripts/make-concept-art.mjs`)
- Portrait: `public/about/asim-portrait.jpg`
- Keep filenames or update the paths in the admin dashboard accordingly. Use landscape/consistent aspect artwork; cards crop with `object-fit: cover`.

## Accessibility & performance notes

- Semantic landmarks, heading hierarchy, labeled form fields, visible focus states.
- Before/after slider: `role="slider"`, arrow/Home/End keys, pointer + touch drag, `touch-action: pan-y` so vertical scrolling still works.
- Mobile drawer: focus trap, Escape to close, body scroll lock.
- `prefers-reduced-motion` disables marquee, floats, reveals, and smooth scrolling.
- Images lazy-load below the fold with descriptive alt text; layout shift is controlled via fixed aspect-ratio frames.
- Public pages are statically prerendered and revalidated every 60s (ISR); the admin dashboard and API route are dynamic.

## QA checklist (run before publishing)

- [ ] `npm run build` passes with no errors
- [ ] `node scripts/test-supabase.mjs` — all 10 checks pass
- [ ] `node scripts/test-e2e-api.mjs` — all 12 checks pass (requires `npm start`)
- [ ] All nav links scroll to the correct sections; active state follows scroll
- [ ] Mobile menu opens/closes, traps focus, closes on Escape
- [ ] Before/after slider: mouse drag, touch drag, arrow keys, Home/End
- [ ] Every project card opens the correct `/work/[slug]` case study; next-project links work
- [ ] Contact form: validation errors (422), success state, honeypot discard — and the inquiry appears in `/admin/inquiries`
- [ ] Admin dashboard: log in, edit a project/service/setting, see the change live on the site within ~60s
- [ ] No horizontal overflow at 320px / 768px / 1024px / 1440px / 1920px
- [ ] All concept work, placeholders, and demo states are clearly labeled
- [ ] Replace placeholder email, socials, portrait, and testimonials with real content
- [ ] Rotate the Supabase database password and remove any secrets from shared files/history
