# Green Balance – Klima & Wirtschaft im Gleichgewicht?

An interactive German civic data platform exploring the real trade-offs between climate protection and economic interests in Germany.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 8080)
- `pnpm --filter @workspace/green-balance run dev` — run the frontend (port 25780)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- Frontend: React + Vite + Wouter + Recharts + Framer Motion + Tailwind CSS (dark theme)
- API: Express 5
- DB: PostgreSQL + Drizzle ORM (polls persistence only; all other data is hardcoded)
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `lib/api-spec/openapi.yaml` — OpenAPI contract (source of truth)
- `lib/db/src/schema/polls.ts` — DB schema for polls and poll options
- `artifacts/api-server/src/routes/` — API route handlers (dashboard, conflicts, states, polls, debate, simulator)
- `artifacts/green-balance/src/pages/` — Frontend pages (home, dashboard, konflikt-atlas, bundeslaender, meinungen, debatte, simulator)
- `artifacts/green-balance/src/components/layout.tsx` — Shared sidebar layout

## Architecture decisions

- Most data (CO₂ stats, energy data, Bundesländer, conflict topics) is hardcoded in route handlers as realistic German reference data — no DB needed for read-only data
- Polls are the only DB-backed entity since vote counts need to persist across requests
- AI debate uses curated perspective text per role × topic — no LLM API required for first build
- Simulator uses deterministic formulas to calculate energy mix effects in real-time
- Dark theme enforced globally via `document.documentElement.classList.add("dark")` in App.tsx

## Product

7-page interactive German climate/economy platform:
1. **Übersicht** — hero landing with live headline stats
2. **Dashboard** — Recharts visualizations: CO₂ trend, energy mix, jobs in green vs. traditional
3. **Konflikt-Atlas** — 8 climate vs. economy conflict topics with scores and impact analysis
4. **Bundesländer** — 16 German states comparison with CO₂, renewables, jobs, electricity price
5. **Meinungen** — 4 live opinion polls with real-time vote counts
6. **Debatte** — Role-based perspective generator (Unternehmer, Arbeitnehmer, Umweltaktivist, Politiker)
7. **Simulator** — FairEnergy interactive sliders: wind/solar/coal/nuclear mix + CO₂ tax → real-time results

## User preferences

_Populate as you build — explicit user instructions worth remembering across sessions._

## Gotchas

- Always run `pnpm --filter @workspace/api-spec run codegen` after changing `lib/api-spec/openapi.yaml`
- After codegen, run `pnpm run typecheck:libs` before artifact typechecks
- The `poll_options` table has no unique constraint — re-running seed will duplicate options

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
