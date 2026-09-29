# Jay Real Estate

Luxury Dubai property website (ready and off-plan) with a built-in lead engine and admin area.

- **Public site:** home, properties with URL filters, property and project pages, mortgage calculator, sell-your-property valuation, about, contact, floating WhatsApp and callback buttons.
- **Lead engine:** every form saves a scored lead (0–100, HOT / WARM / COLD) with honeypot and IP rate limiting.
- **Admin:** dashboard with charts, drag-and-drop pipeline, leads table with CSV export, lead profiles with notes, viewings and deals, agent leaderboard, property and project CRUD. Agents see only their own leads.
- **No email:** notifications are in-app only (the bell in the admin header).

## Stack

Next.js 15 (App Router) · TypeScript · Tailwind CSS v4 · Drizzle ORM · Neon Postgres (`neon-http`) · Auth.js v5 · framer-motion · recharts · Vercel

## Quick start

```bash
npm install
cp .env.example .env.local      # fill in AUTH_SECRET at minimum
npm run dev
```

Open http://localhost:3000. Without a `DATABASE_URL` the app runs on an embedded Postgres (PGlite) in `./.pglite`, migrates itself and seeds demo data on first request. Delete the folder to reset.

Demo logins (seed data):

| Role  | Email                            | Password    |
| ----- | -------------------------------- | ----------- |
| Admin | `admin@jayrealestate.example`    | `Admin123!` |
| Agent | `layla@jayrealestate.example`    | `Agent123!` |
| Agent | `omar@jayrealestate.example`     | `Agent123!` |
| Agent | `sofia@jayrealestate.example`    | `Agent123!` |

## Environment variables

Copy `.env.example` to `.env.local`. These are the only variables the app reads:

| Variable       | Required   | Purpose                                                                 |
| -------------- | ---------- | ----------------------------------------------------------------------- |
| `DATABASE_URL` | Production | Neon Postgres connection string. Leave unset locally to use PGlite.     |
| `AUTH_SECRET`  | Yes        | Auth.js session secret. Generate with `npx auth secret` or `openssl rand -base64 32`. |
| `ADMIN_EMAIL`  | Optional   | Default `--email` for `npm run admin:create`.                           |

## Database

```bash
npm run db:generate   # write SQL migrations to ./drizzle after editing src/db/schema.ts
npm run db:push       # create / update tables in Neon from the schema
npm run db:seed       # truncate and load demo data (developers, projects, properties, users, leads, viewings, deals)
npm run db:studio     # open Drizzle Studio
```

`db:seed` and `admin:create` work against whichever database `.env.local` points to. When using PGlite locally, stop the dev server first (single-process file lock).

## Create an admin user

```bash
npm run admin:create -- --email you@example.com --password "a strong password" --name "Your Name"
```

Creates the user with the `admin` role, or resets the password and promotes an existing user with that email.

## Scripts

| Script                 | Description                          |
| ---------------------- | ------------------------------------ |
| `npm run dev`          | Development server                   |
| `npm run build`        | Production build (lint + type check) |
| `npm run start`        | Serve the production build           |
| `npm run lint`         | ESLint                               |
| `npm run db:*`         | See Database above                   |
| `npm run admin:create` | Create or reset an admin user        |

## Deploy to Vercel

1. **Create the database.** In Neon, create a project and copy the pooled connection string.
2. **Create the tables and seed.** Locally, put the Neon URL in `.env.local`, then:
   ```bash
   npm run db:push
   npm run db:seed                       # optional demo data
   npm run admin:create -- --email you@example.com --password "..." --name "You"
   ```
3. **Push to GitHub** (see below) and import the repository in Vercel. Framework preset: Next.js. No build overrides are needed.
4. **Add environment variables** in Vercel → Project → Settings → Environment Variables (Production and Preview):
   - `DATABASE_URL` – the Neon connection string
   - `AUTH_SECRET` – a fresh random secret (do not reuse your local one)
   - `ADMIN_EMAIL` – optional
5. **Deploy.** Then set the canonical URL in `src/lib/site.ts` (`siteConfig.url`) to your Vercel domain or custom domain and redeploy so the sitemap, robots and Open Graph tags carry the right host.
6. **Sign in** at `https://<your-domain>/admin/login`.

Notes:
- The public site is statically generated and revalidated by admin actions; the admin area is fully dynamic.
- Rate limiting is per serverless instance (in-memory). It is a first line of defence, not a hard guarantee.
- `/admin` and `/api` are excluded from search engines via `robots.txt` and `noindex` metadata.

## Project structure

```
src/
  app/(public)/        marketing pages, loading / error / not-found
  app/admin/           login + (dashboard) group protected by middleware
  app/actions/         server actions (leads, admin, auth)
  components/          ui, layout, sections, forms, admin
  db/                  schema, client (Neon or PGlite), seed data
  lib/                 queries, admin-queries, validations, scoring, rate-limit, site config
scripts/               seed.ts, create-admin.ts
drizzle/               generated SQL migrations
```

See `CLAUDE.md` for the design system and coding conventions.
