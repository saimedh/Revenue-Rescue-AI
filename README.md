# Revenue Rescue AI

Revenue Rescue AI is a hackathon-ready fintech operations dashboard that turns failed payments into recovered revenue. It combines payment failure analysis, customer intelligence, recovery probability scoring, smart retry recommendations, human approval controls, and live recovery analytics in one command center.

## Product flow

`Payment failed → AI analyzes → AI decides → AI acts → Revenue recovered`

The demo mode creates a realistic failed payment, runs it through the recovery workflow, updates the activity feed and metrics, and simulates a successful smart retry after a short delay.

## Architecture

- `artifacts/revenue-rescue-ai` — React + Vite dashboard with Wouter routing, Tailwind CSS, shadcn/ui primitives, Recharts, and generated API hooks.
- `artifacts/api-server` — Express modular monolith serving the `/api` contract and a stateful in-memory demo data layer.
- `lib/api-spec/openapi.yaml` — source-of-truth API contract.
- `lib/api-client-react` / `lib/api-zod` — generated React Query clients, TypeScript types, and Zod response schemas.
- `lib/db/src/schema/revenue.ts` — PostgreSQL/Drizzle schema for users, merchants, customers, payments, recovery cases, agent actions, outcomes, approvals, and audit logs.
- `ml` — 5,000-record synthetic dataset generator and XGBoost baseline training/prediction helpers.

The demo server intentionally keeps the active simulation state in memory so a presentation can show the full flow without external payment, email, Redis, or AI credentials. The database schema and model scripts provide the production upgrade path.

## Run locally

```bash
pnpm install
pnpm --filter @workspace/api-spec run codegen
pnpm --filter @workspace/db run push
pnpm --filter @workspace/api-server run dev
```

The app is normally started through the managed web and API workflows so the dashboard can use the shared `/api` route.

## Demo

1. Open the Overview page.
2. Select **Simulate failed payment**.
3. Watch the new recovery case enter the activity feed and the AI workflow.
4. Open the case to review its recovery score, reasoning, timeline, and recommended action.
5. Sensitive cases expose approve/reject controls; normal cases can be executed directly.

## ML baseline

```bash
python ml/generate_dataset.py
python ml/train.py
python ml/predict.py --amount 50000 --failure-reason insufficient_funds --payment-method upi
```

The generator creates `ml/data/synthetic_payments.csv` with 5,000 realistic payment events. `train.py` trains an XGBoost classifier and writes a JSON model plus validation metadata to `ml/models/`.

## API

- `GET /api/dashboard/metrics`
- `GET /api/dashboard/activity`
- `GET /api/dashboard/strategies`
- `GET /api/payments`
- `POST /api/payments/simulate-failure`
- `GET /api/customers`
- `GET /api/recoveries`
- `GET /api/recoveries/:id`
- `POST /api/recoveries/:id/analyze`
- `POST /api/recoveries/:id/approve`
- `POST /api/recoveries/:id/reject`
- `POST /api/recoveries/:id/execute`
- `GET /api/analytics`
- `GET /api/agents/status`

## Environment

The managed workflows provide `PORT` and `BASE_PATH`. The database schema uses the provisioned PostgreSQL `DATABASE_URL` when Drizzle commands are run. No raw card numbers, CVV, payment credentials, or API keys are stored.