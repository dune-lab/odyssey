# odyssey

Learning journey state machine service. Manages the full saga from `JOURNEY_INITIATED` to `JOURNEY_COMPLETED`.

Named after the epic journey — because a student's learning path is never a straight line.

## Stack

- Node.js 24 + TypeScript
- Fastify (via `@enxoval/http`)
- PostgreSQL + TypeORM (via `@enxoval/db`)
- Kafka (via `@enxoval/messaging`)
- JWT auth middleware (via `@enxoval/auth`)

## How to Run

```bash
cp .env.example .env
npm install
npm run migration:run
npm run dev
```

Or with Docker (from `platform/`):

```bash
docker-compose up odyssey
```

Default port: **3001**

## Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/health` | — | Health check |
| `GET` | `/docs` | — | API reference |
| `POST` | `/journeys` | Bearer JWT | Start a new journey for a student |
| `GET` | `/journeys` | Bearer JWT | List all journeys |
| `GET` | `/journeys/by-student/:studentId` | Bearer JWT | Get journey by student ID |
| `POST` | `/journeys/republish` | Bearer JWT | Reactivate stuck journeys |

## Examples

### POST /journeys

```bash
curl -X POST http://localhost:3001/journeys \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <token>' \
  -d '{ "studentId": "uuid-here" }'
```

The `studentId` comes from `persona`. Odyssey stores it as an opaque UUID — no knowledge of student details.

### GET /journeys/by-student/:studentId

```bash
curl http://localhost:3001/journeys/by-student/uuid-here \
  -H 'Authorization: Bearer <token>'
```

Returns `404` if no journey exists for that student.

## Saga Flow

```
JOURNEY_INITIATED
  → DIAGNOSTIC_TRIGGERED
  → DIAGNOSTIC_COMPLETED
  → ANALYSIS_STARTED
  → ANALYSIS_FINISHED
  → CURRICULUM_GENERATED
  → CONTENT_DISPATCHED
  → STUDENT_ENGAGEMENT_RECEIVED
  → PROGRESS_MILESTONE_REACHED
  → JOURNEY_COMPLETED
```

Each step is driven by a Kafka event consumed internally. The saga is fully autonomous once started.

## Events

| Topic (consumed) | Trigger |
|-----------------|---------|
| `journeyInitiated` | Published by `POST /journeys` |
| `diagnosticTriggered` | Published internally on each step |
| `diagnosticCompleted` | ... |
| `analysisStarted` | ... |
| `analysisFinished` | ... |
| `curriculumGenerated` | ... |
| `contentDispatched` | ... |
| `studentEngagementReceived` | ... |
| `progressMilestoneReached` | ... |

All topics are produced and consumed internally by odyssey.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PORT` | HTTP port (default: `3001`) |
| `HOST` | Bind address (default: `0.0.0.0`) |
| `DB_HOST` | Postgres host |
| `DB_PORT` | Postgres port |
| `DB_USER` | Postgres user |
| `DB_PASSWORD` | Postgres password |
| `DB_NAME` | Postgres database name |
| `KAFKA_BROKER` | Kafka broker address |
| `JWT_SECRET` | Secret used to validate incoming tokens |

## Scripts

```bash
npm run dev                # dev server with hot reload
npm run build              # compile TypeScript
npm test                   # run all tests
npm run lint               # check formatting and lint
npm run migration:run      # apply migrations
npm run migration:revert   # revert last migration
```
