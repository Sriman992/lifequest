# Nook — a cozy life-RPG task tracker

Turn real tasks into a late-night study room. Complete tasks to earn Focus
(XP), Embers (currency), attribute growth, and streaks — then spend Embers in
the Nook to fill your room with a lamp, plants, a cat, posters.

## Tech stack

- **Frontend/Backend:** Next.js 14 (App Router, TypeScript) — API routes act
  as the backend, so this is one deployable app.
- **Database:** SQLite via Prisma in development (zero setup). Swap one line
  to Postgres for production (see below).
- **Auth:** NextAuth (credentials provider), passwords hashed with bcrypt,
  JWT sessions.
- **Styling/animation:** Tailwind CSS + Framer Motion.

## Why this satisfies "no cheating"

Every stat change (XP, level, Embers, attributes, streaks) is computed
**inside the API route**, from data already stored in the database (the
task's own `difficulty`), never from anything the client sends. A user can
only ever query or mutate rows where `userId` matches their own session — see
`getServerSession` + the `userId` filter in every route under `src/app/api/`.
Opening dev tools and editing client state does nothing; the server
recomputes everything on the next request.

## Local setup

```bash
git clone <your-repo-url>
cd lifequest
cp .env.example .env      # then edit NEXTAUTH_SECRET (see below)
npm install
npx prisma migrate dev --name init   # creates dev.db and the schema
npm run dev
```

Open http://localhost:3000.

Generate a real secret instead of the placeholder:

```bash
openssl rand -base64 32
```

## Environment variables

See `.env.example`. You need:

- `DATABASE_URL` — SQLite by default (`file:./dev.db`); swap to a Postgres
  connection string for production.
- `NEXTAUTH_SECRET` — random 32-byte string, used to sign session tokens.
- `NEXTAUTH_URL` — your app's base URL (`http://localhost:3000` locally, your
  deployed URL in production).

## Deploying (Vercel + a free Postgres DB)

SQLite's file won't persist on serverless hosts, so for the live deployment
switch to Postgres:

1. Create a free Postgres database — [Supabase](https://supabase.com) or
   [Neon](https://neon.tech) both work and take under 2 minutes.
2. In `prisma/schema.prisma`, change:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
3. Push the schema to that database: `npx prisma db push`.
4. Push your repo to GitHub.
5. Import the repo on [Vercel](https://vercel.com/new).
6. Add the three environment variables from `.env.example` in the Vercel
   project settings (use your real Postgres URL, a freshly generated
   `NEXTAUTH_SECRET`, and `NEXTAUTH_URL` set to the Vercel deployment URL).
7. Deploy. Prisma's client regenerates automatically via `postinstall`.

## Project structure

```
prisma/schema.prisma        User, Task, InventoryItem models
src/lib/xp.ts                Non-linear leveling curve, level titles, rewards
src/lib/streak.ts            Streak calculation (UTC calendar days)
src/lib/shop.ts              Static shop catalog (the economy)
src/lib/auth.ts              NextAuth config
src/app/api/                 All backend routes (auth, tasks, shop)
src/app/(pages)              Landing, login, register, dashboard
src/components/              UI: room scene, XP bar, task list, shop, etc.
```

## Core features checklist (mapped to the brief)

- [x] **Auth & security** — signup/login via NextAuth credentials + bcrypt;
      every API route checks the session and scopes queries to that user's id.
- [x] **DB schema & CRUD** — `User`, `Task`, `InventoryItem` in
      `prisma/schema.prisma`; full create/read/update/delete on tasks.
- [x] **Non-linear leveling** — `xpToReachLevel()` in `src/lib/xp.ts`
      (`50 * level^1.6`-based curve; each level costs more than the last).
- [x] **Streaks** — `src/lib/streak.ts`, tracked in `User.currentStreak` /
      `longestStreak`, updated on task completion.
- [x] **Attributes** — 5 stats (Focus, Vitality, Discipline, Creativity,
      Calm); each task is tagged with one and grows it on completion.
- [x] **Economy** — Embers earned per task, spent in the Nook on room items.
- [x] **Responsive & accessible** — two-pane layout collapses to one column
      on mobile; every control is a real `<button>`/`<input>`/`<select>` with
      labels, visible focus states, and `aria-live` toasts for async
      feedback.
- [x] **Optimistic UI + loading states** — tasks appear/complete instantly
      client-side and roll back if the server rejects them; skeleton screens
      on initial load.
- [x] **Error handling** — failed requests show a toast and revert local
      state rather than crashing; a dropped connection on load shows a retry
      screen instead of a blank page.
