# odyssey

Learning journey state machine. Orchestrates the full student saga from `JOURNEY_INITIATED` to `JOURNEY_COMPLETED` using Kafka as the backbone.

Named after the epic journey — because a student's learning path is never a straight line.

---

## Responsibilities

- Start and advance student learning journeys
- Consume and produce all saga events internally via Kafka
- Persist the full event history in Postgres
- Expose journey state via HTTP (REST + SSE)
- Absorb and store failed Kafka messages via the Harkonnen DLQ consumer

---

## Stack

| Layer | Technology |
|-------|-----------|
| Runtime | Node.js 24 + TypeScript |
| HTTP | Fastify (`@enxoval/http`) |
| Database | PostgreSQL 16 + TypeORM (`@enxoval/db`) |
| Messaging | Kafka 3.7 (`@enxoval/messaging`) |
| Auth | JWT Bearer (`@enxoval/auth`) |
| Logging | Pino structured JSON (`@enxoval/observability`) |
| Validation | `createSchema` + `asyncFn` (`@enxoval/types`) |

---

## HTTP API

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| `GET` | `/health` | — | Health check |
| `GET` | `/docs` | — | API reference |
| `POST` | `/journeys` | Bearer JWT | Start a new journey for a student |
| `GET` | `/journeys` | Bearer JWT | List all journeys |
| `GET` | `/journeys/by-student/:studentId` | Bearer JWT | Get journey by student ID |
| `POST` | `/journeys/republish` | Bearer JWT | Reactivate stuck journeys by republishing their last event |
| `GET` | `/journeys/:journeyId/stream` | — | SSE stream of real-time journey updates |
| `GET` | `/harkonnen` | Bearer JWT | List all DLQ messages |
| `POST` | `/harkonnen/reprocess` | Bearer JWT | Reprocess a single DLQ message with optional payload override |
| `POST` | `/harkonnen/reprocess-all` | Bearer JWT | Reprocess all pending DLQ messages for a topic |
| `POST` | `/harkonnen/dismiss` | Bearer JWT | Dismiss a DLQ message (mark as acknowledged) |

### POST /journeys

```bash
curl -X POST http://localhost:3001/journeys \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <token>' \
  -d '{ "studentId": "uuid-here" }'
```

The `studentId` is an opaque UUID from `persona`. Odyssey never knows student details.

### GET /journeys/:journeyId/stream

Server-Sent Events endpoint. Emits journey state changes as they happen.

```bash
curl -N http://localhost:3001/journeys/uuid-here/stream
```

Each event is a JSON object with the current journey state.

### POST /harkonnen/reprocess

```bash
curl -X POST http://localhost:3001/harkonnen/reprocess \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <token>' \
  -d '{ "id": "msg-uuid", "payload": "{\"journeyId\":\"uuid\"}" }'
```

The `payload` is republished to the original Kafka topic. You can edit it before reprocessing to fix malformed data.

---

## Event-Driven Architecture

### Saga Flow

Odyssey runs a fully internal saga. Each Kafka consumer advances the journey to the next state and publishes the next event.

```
POST /journeys
  │
  └─► publish journeyInitiated
          │
          ├── consume journeyInitiated     → store event → publish diagnosticTriggered
          ├── consume diagnosticTriggered  → store event → publish diagnosticCompleted
          ├── consume diagnosticCompleted  → store event → publish analysisStarted
          ├── consume analysisStarted      → store event → publish analysisFinished
          ├── consume analysisFinished     → store event → publish curriculumGenerated
          ├── consume curriculumGenerated  → store event → publish contentDispatched
          ├── consume contentDispatched    → store event → publish studentEngagementReceived
          ├── consume studentEngagementReceived → store event → publish progressMilestoneReached
          └── consume progressMilestoneReached  → store event → publish journeyCompleted
```

All topics are internal to odyssey. No external service produces or consumes them.

### Kafka Topics

| Topic | Group ID | Direction |
|-------|----------|-----------|
| `journey-initiated` | `student-journey-journeyInitiated` | consumed |
| `diagnostic-triggered` | `student-journey-diagnosticTriggered` | consumed |
| `diagnostic-completed` | `student-journey-diagnosticCompleted` | consumed |
| `analysis-started` | `student-journey-analysisStarted` | consumed |
| `analysis-finished` | `student-journey-analysisFinished` | consumed |
| `curriculum-generated` | `student-journey-curriculumGenerated` | consumed |
| `content-dispatched` | `student-journey-contentDispatched` | consumed |
| `student-engagement-received` | `student-journey-studentEngagementReceived` | consumed |
| `progress-milestone-reached` | `student-journey-progressMilestoneReached` | consumed |
| `student-journey-dlq` | `odyssey-harkonnen-dlq` | consumed (DLQ) |

All topics are also **produced** internally as part of the saga progression.

---

## Resilience — Harkonnen DLQ

When any saga consumer fails 3 times (via `@enxoval/messaging` retry policy), the message is sent to `student-journey-dlq`.

A dedicated consumer group (`odyssey-harkonnen-dlq`) reads from this topic with `fromBeginning: true` and persists every failed message in the `harkonnen_messages` table.

```
saga consumer (any step)
  fails × 3
  └─► publish to student-journey-dlq
          │
          └─► harkonnen consumer
                  └─► INSERT harkonnen_messages (status: pending)
```

**Reprocess flow:**
1. Operator edits the payload in the DLQ UI if needed
2. Calls `POST /harkonnen/reprocess` — odyssey republishes to the original topic
3. The saga consumer picks it up and retries
4. Message status updated to `reprocessed`

The DLQ consumer uses a **direct `kafka.consumer()`** call (not the `subscribe()` helper) to avoid creating a DLQ-of-DLQ loop.

---

## Database Schema

| Table | Description |
|-------|-------------|
| `journeys` | Root journey record (studentId, currentStep, status) |
| `journey_initiated` | Event: journey started |
| `diagnostic_triggered` | Event: diagnostic triggered |
| `diagnostic_completed` | Event: diagnostic completed |
| `analysis_started` | Event: analysis started |
| `analysis_finished` | Event: analysis finished |
| `curriculum_generated` | Event: curriculum generated |
| `content_dispatched` | Event: content dispatched |
| `student_engagement_received` | Event: student engaged |
| `progress_milestone_reached` | Event: milestone reached |
| `harkonnen_messages` | DLQ: failed Kafka messages pending reprocess |

Migrations are located in `src/db/migrations/` and run automatically on startup.

---

## Observability

Odyssey uses structured JSON logging via Pino. Every HTTP request emits two log lines:

```json
{ "level": "info", "service": "odyssey", "cid": "abc123:0", "method": "POST", "url": "/journeys", "msg": "http-server: request received" }
{ "level": "info", "service": "odyssey", "cid": "abc123:0", "method": "POST", "url": "/journeys", "status": 201, "durationMs": 42, "msg": "http-server: response sent" }
```

Kafka consumer events are logged with `topic`, `name`, and `eventId` fields. DLQ ingestion is logged with `msg: "harkonnen: DLQ message received"`.

Logs are collected by Promtail and indexed in Loki with the `service="odyssey"` label. All dashboards in Grafana query using `{service="odyssey"}`.

---

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
| `JWT_SECRET` | Secret shared across all services |

---

## Running Locally

```bash
cp .env.example .env
npm install
npm run migration:run
npm run dev
```

Or with Docker (standalone):

```bash
docker-compose up
```

---

## Scripts

```bash
npm run dev              # start with hot reload
npm run build            # compile TypeScript
npm test                 # run all tests (Vitest)
npm run lint             # check formatting + lint
npm run lint-fix         # auto-fix
npm run migration:run    # apply pending migrations
npm run migration:revert # revert last migration
```
