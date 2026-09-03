# Revenue Rescue AI

Revenue Rescue AI is a fintech operations dashboard that turns failed payments into recovered revenue with explainable AI recommendations and smart recovery actions.

## Run & Operate

- `pnpm --filter @workspace/api-server run dev` — run the API server (port 5000)
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required env: `DATABASE_URL` — Postgres connection string

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/revenue-rescue-ai` — React + Vite dashboard and routed product screens.
- `artifacts/api-server/src/routes/revenue.ts` — demo API state, simulation flow, recovery actions, analytics, and agent status.
- `lib/api-spec/openapi.yaml` — source of truth for generated API clients and response validation.
- `lib/db/src/schema/revenue.ts` — Drizzle schema for recovery operations data.
- `ml/` — synthetic dataset generator and XGBoost baseline model scripts.

## Architecture decisions

- The first build uses an in-memory API state layer so the demo can show live recovery transitions without external payment or messaging credentials.
- API contracts are OpenAPI-first and generated hooks are used by the frontend for every server interaction.
- Sensitive recovery actions stay approval-gated in the UI and API model.
- PostgreSQL/Drizzle tables are defined and seeded as the persistence upgrade path for production.

## Product

- Overview dashboard with revenue metrics, recovery momentum, strategy performance, recent activity, and high-risk cases.
- Recovery case ledger and detail view with score, probability, agent reasoning, timeline, and outcomes.
- Live AI agent workflow, payments ledger, customer intelligence, analytics, and merchant settings screens.
- Demo mode simulates a failed payment, creates a case, and transitions it to a recovered outcome.

## User preferences

No additional preferences recorded.

## Gotchas

- Run `pnpm --filter @workspace/api-spec run codegen` after changing the OpenAPI contract.
- The dashboard depends on the API workflow being available at `/api`.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
