# Jay Real Estate

Luxury Dubai property sales website (ready and off-plan). Fictional brand: **Jay Real Estate**. Never use a real developer's name, logo, or marketing copy.

## Stack

- **Framework:** Next.js 15 (App Router, TypeScript, `src/` directory, `@/*` alias)
- **Styling:** Tailwind CSS v4 (CSS-first config in `src/app/globals.css` via `@theme`), `framer-motion`, `lucide-react`
- **Database:** Neon Postgres via `@neondatabase/serverless` + Drizzle ORM (`drizzle-kit` for migrations)
- **Auth:** Auth.js v5 (`next-auth@beta`) Credentials provider + `bcryptjs`; `src/auth.ts` (full) and `src/auth.config.ts` (edge-safe, used by middleware)
- **Notifications:** in-app only (admin bell). **No email notifications.** Do not add an email provider.
- **Forms/validation:** `react-hook-form` + `zod` (`@hookform/resolvers`)
- **Charts:** `recharts` (mortgage calculator, admin dashboard)
- **Hosting:** Vercel

Env vars live in `.env.local` (git-ignored). See `.env.example` for `DATABASE_URL`, `AUTH_SECRET`, `ADMIN_EMAIL`.

## Currency

All prices are **AED**. Display as `From AED 2,450,000` using `formatAED()` in `src/lib/utils.ts`. Store amounts as integers in the DB.

## Project structure

```
src/
  app/                 routes (App Router), layout.tsx wires Header + Footer + FloatingContact
    actions/leads.ts   server action for every public lead form (placeholder: validates, no persistence yet)
    properties/        /properties (URL-param filters) and /properties/[slug]
    projects/          /projects and /projects/[slug]
    mortgage-calculator, sell-your-property, about, contact
  components/
    ui/                Button, Container, SectionLabel, SectionTitle, AnimatedSection, Logo, PropertyCard, ProjectCard, PageHero
    layout/            Header, Footer, FloatingContact (WhatsApp + callback modal)
    forms/             LeadForm (react-hook-form + zod, honeypot), fields.tsx (Input/Select/Textarea)
    sections/          page sections (Hero, SearchBar, FeaturedProperties, FeaturedProjects, WhyInvest, Communities,
                       RegisterInterest, PropertyFilters, Gallery, MortgageCalculator)
  db/
    schema.ts          Drizzle schema + enums + relations (developers, projects, properties, leads, lead_notes, viewings, deals, users)
    index.ts           getDb() over @neondatabase/serverless neon-http driver; hasDatabase()
    seed-data.ts       fixture dataset shared by the seed script and the no-database fallback
  lib/
    queries.ts         server-only data access for the public site
    validations.ts     zod schemas (leadSchema is shared by client forms and the server action)
    utils.ts           cn, formatAED, formatAEDShort, formatDate, formatNumber, titleCase
    site.ts            nav, contact details, WhatsApp number
scripts/seed.ts        npm run db:seed
drizzle.config.ts      drizzle-kit config (reads .env.local)
```

## Admin & lead engine

- Routes live under `src/app/admin/(dashboard)/` (layout requires a session) and `src/app/admin/login`. `src/middleware.ts` protects `/admin/*` with the edge-safe `auth.config.ts`.
- Roles: `admin` sees everything and manages properties/projects; `agent` sees only leads, viewings and deals assigned to them (`leadScope()` in `src/lib/admin-queries.ts` must be applied to every lead query).
- Lead capture: `submitLead` in `src/app/actions/leads.ts` validates with `leadSchema`, rate limits 5 per IP per 10 minutes (`src/lib/rate-limit.ts`, in-memory), scores with `src/lib/scoring.ts` and inserts. Public forms show "Thank you. A Jay Real Estate advisor will contact you within 24 hours."
- Scoring (0–100, recomputed on every update via `rescore()` in `src/app/actions/admin.ts`): cash +25 / mortgage +15; immediate +20 / 1–3 months +15 / 3–6 months +5; budget +15 (+10 if max ≥ AED 2M); phone +10; linked listing +10; source valuation/callback/mortgage_calc +10. Badges HOT ≥70, WARM 40–69, COLD <40.
- Notifications are in-app only: the bell counts leads with `viewed_at IS NULL`; opening a lead sets it. Admin pages auto-refresh every 60s (`AutoRefresh`).
- Closing a deal (`createDeal`) inserts the deal, sets stage `won` and marks the property `sold`. Commission defaults to 2%.
- Admin UI primitives live in `src/components/admin/ui.tsx`; keep the same tokens (white panels, hairline `line` borders, serif numbers, `.label` captions).
- Create an admin with `npm run admin:create -- --email you@example.com --password "..." --name "Name"`.

## Database workflow

- `npm run db:push` creates/updates tables in Neon from `src/db/schema.ts`. `npm run db:generate` writes SQL migrations to `drizzle/`.
- `npm run db:seed` truncates and reloads the fixture dataset (5 developers, 6 projects, 26 properties, 4 users, 40 leads, viewings, deals). Seed logins: `admin@jayrealestate.example` / `Admin123!`, agents `layla|omar|sofia@jayrealestate.example` / `Agent123!`. Stop the dev server before seeding PGlite (single-process file lock).
- `npm run db:studio` opens Drizzle Studio.
- **Local database:** when `DATABASE_URL` is unset, `getDb()` runs embedded Postgres via PGlite in `./.pglite` (git-ignored), applies `./drizzle` migrations and seeds the fixture data on first boot. Delete the folder to reset. With `DATABASE_URL` set, the same code talks to Neon over `neon-http`. Avoid `db.transaction()` (unsupported on neon-http).
- After changing `src/db/schema.ts` run `npm run db:generate` so the local PGlite migration stays in sync (and `npm run db:push` for Neon).

## Leads and forms

- All public forms render `LeadForm` with a `source` (`form | property_page | project_page | brochure | mortgage_calc | valuation | callback`) and a subset of optional fields. The single `leadSchema` in `src/lib/validations.ts` validates on the client and again in the `submitLead` server action.
- Every form carries a visually hidden `website` honeypot; a filled honeypot returns a fake success and is dropped.
- `submitLead` is a placeholder: it validates and returns a success state. Persisting to `leads` and notifying the team are still to be wired. **No email notifications: never add email sending.**
- Mortgage calculator fee defaults are editable estimates and must remain labelled as estimates.

## Design system — ALWAYS FOLLOW THE DESIGN SYSTEM

Premium Dubai developer aesthetic: luxury, minimal, calm, lots of white space, full-bleed cinematic imagery.

### Colors (Tailwind tokens)

| Token       | Hex       | Use                                                            |
| ----------- | --------- | -------------------------------------------------------------- |
| `white`     | `#FFFFFF` | Page background                                                |
| `offwhite`  | `#F7F5F2` | Alternate section background, image placeholders               |
| `charcoal`  | `#1A1A1A` | Text, dark buttons, footer background                          |
| `warmgray`  | `#6B6B6B` | Secondary text                                                 |
| `gold`      | `#B8975A` | **Sparingly**: thin lines, hover states, small labels          |
| `line`      | `#E6E2DC` | Hairline borders                                               |

Do not introduce new colours. Gold is an accent, never a large fill (buttons may hover to gold).

### Typography (via `next/font/google`)

- **Headings:** Cormorant Garamond, weight 300, very large, `tracking-[0.02em]`, `leading-[1.05]`. Use `SectionTitle`.
- **Body/UI:** Inter, weight 300 for body, 400 for labels/buttons.
- **Labels:** small uppercase Inter, `tracking-[0.3em]` (`.label` utility). Place above section titles: e.g. `DISCOVER`, `OFF-PLAN PROJECTS`. Use `SectionLabel`.

### Logo

`<Logo variant="light" | "dark" />` — "JAY" wordmark in Cormorant Garamond light with wide letter-spacing, thin gold line, then "REAL ESTATE" in small uppercase Inter with very wide letter-spacing. Light = white (over imagery), dark = charcoal (on white).

### Components

- **Buttons:** square corners, 1px border, uppercase small text, `tracking-[0.25em]`; hover fills charcoal or gold. Use `Button` with variants `dark | light | gold | outline-dark | outline-light`.
- **Header:** fixed, transparent over hero with white logo; turns solid white with dark logo + subtle shadow on scroll. Nav: Properties, Off-Plan, Mortgage Calculator, Sell, Contact + "Register Interest" button. Mobile hamburger opens full-screen menu.
- **Hero:** full-screen image (Unsplash), dark gradient overlay, huge serif headline, short subtext, two buttons.
- **Property cards:** tall 3:4 image with slow zoom on hover, thin gold line, serif project name, community + `From AED X` in small caps.
- **Sections:** wrap content in `AnimatedSection` (gentle fade + slide-up on scroll). Use `py-section` / `py-section-lg` spacing and `Container` for width.
- **Footer:** charcoal background, light logo, multi-column links, newsletter field, social icons, `© Jay Real Estate. All rights reserved.`

### Principles

- Mobile-first, fully responsive, fast (use `next/image`, `priority` only on the hero).
- Generous whitespace; avoid heavy shadows, rounded corners, gradients on UI (only on image overlays).
- Motion is slow and subtle: 0.6–1.2s durations, easing `cubic-bezier(0.22, 1, 0.36, 1)`.
- Copy tone: calm, confident, understated. No exclamation marks.

## Conventions

- Server Components by default; add `"use client"` only where hooks/motion are required.
- Validate every form with a shared `zod` schema used on both client and server action.
- Images from `images.unsplash.com` are allowed in `next.config.ts` `remotePatterns`.
- Run `npm run lint` and `npx tsc --noEmit` before committing.
