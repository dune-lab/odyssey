# odyssey

Learning journey state machine service. Manages the full saga from `JOURNEY_INITIATED` to `JOURNEY_COMPLETED`.

## Stack

- Node.js 24 + TypeScript
- Fastify (via `@enxoval/http`)
- PostgreSQL + TypeORM (via `@enxoval/db`)
- Kafka (via `@enxoval/messaging`)

## How to Run

```bash
cp .env.example .env
npm install
npm run migration:run
npm run dev
```

Or with Docker:

```bash
docker-compose up
```

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/docs` | API reference |
| `POST` | `/journeys` | Start a new journey |
| `GET` | `/journeys` | List journeys with events |
| `POST` | `/journeys/republish` | Reactivate stuck journeys |

## POST /journeys

```bash
curl -X POST http://localhost:3001/journeys \
  -H 'Content-Type: application/json' \
  -d '{ "studentId": "uuid-here" }'
```

The `studentId` comes from `persona`. Odyssey stores it as an opaque UUID — no knowledge of student details.

## Saga Flow

```
JOURNEY_INITIATED → DIAGNOSTIC_TRIGGERED → DIAGNOSTIC_COMPLETED
→ ANALYSIS_STARTED → ANALYSIS_FINISHED → CURRICULUM_GENERATED
→ CONTENT_DISPATCHED → STUDENT_ENGAGEMENT_RECEIVED
→ PROGRESS_MILESTONE_REACHED → JOURNEY_COMPLETED
```

Each step is driven by a Kafka event. The saga is fully autonomous once started.

## Scripts

```bash
npm run dev          # dev server with hot reload
npm run build        # compile TypeScript
npm test             # run all tests
npm run lint         # check formatting and lint
npm run migration:run      # apply migrations
npm run migration:revert   # revert last migration
```
