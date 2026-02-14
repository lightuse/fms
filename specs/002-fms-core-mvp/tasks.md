---
<<<<<<< HEAD
description: "Task list for FMS Core MVP implementation"
=======
---

# Tasks: FMS Core MVP

---
description: "Detailed task checklist for FMS Core MVP implementation"
>>>>>>> origin/001-create-frontend
---

# Tasks: FMS Core MVP

**Input**: `specs/002-fms-core-mvp/spec.md`  
<<<<<<< HEAD
**Prerequisites**: `plan.md`, `spec.md`

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 Initialize backend test environment (`backend/`) and CI job skeleton
- [ ] T002 [P] Add PostGIS-enabled local test DB fixture script (`scripts/setup_test_db.sh`)
- [ ] T003 [P] Add linting, formatting, and basic CI steps (lint, unit)

## Phase 2: Foundational (Blocking Prerequisites)

- [ ] T004 Setup tenant middleware (`backend/src/middleware/tenant.middleware.ts`) and tests
- [ ] T005 [P] Create core entities (TypeORM/Prisma models) `Incident`, `Unit`, `DispatchEvent` (`backend/src/modules/*/entities`)
- [ ] T006 [P] Implement auth stub for local testing (Keycloak test double)
- [ ] T007 Setup DB migrations for PostGIS (`backend/db/migrations/0001_postgis.sql`)

## Phase 3: User Story 1 - Dispatcher (Priority: P1)

**Goal**: Dispatcher can create incident and assign units atomically.

- [ ] T010 [US1] Create `POST /incidents` endpoint and validations (`backend/src/modules/incidents/incidents.controller.ts`)
- [ ] T011 [US1] Implement candidate unit search using PostGIS (`backend/src/modules/units/units.service.ts`)
- [ ] T012 [US1] Implement atomic assignment service (transactional) and audit logging (`backend/src/modules/incidents/incidents.service.ts`)
- [ ] T013 [US1] Add unit/integration tests: create incident → assign unit → verify DB state (`backend/tests/integration/test_dispatch_flow.spec.ts`)

## Phase 4: User Story 2 - Mobile (Priority: P2)

**Goal**: Mobile client receives notification and updates status + GPS.

- [ ] T020 [US2] Add Socket.io integration hooks and assignment notification flow (`backend/src/modules/socket/`)
- [ ] T021 [US2] Implement endpoint for unit status updates and GPS pings (`POST /units/:id/status`, `POST /units/:id/ping`)
- [ ] T022 [US2] Integration test: simulate assignment → simulate mobile status update → verify dispatcher view updated

## Phase 5: User Story 3 - Map & Search (Priority: P3)

**Goal**: Map-based visualization and radius search for available units.

- [ ] T030 [US3] Implement `GET /units/nearby?lat=&lon=&radius=` (spatial API)
- [ ] T031 [US3] Add unit location update propagation to map view (Socket events)
- [ ] T032 [US3] Add tests for spatial search accuracy with fixture data (5km test scenario)

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T040 Documentation: update `docs/` with quickstart and deployment notes for feature
- [ ] T041 [P] Add E2E scenario tests for full flow (create incident → dispatch → mobile updates)
- [ ] T042 Release checklist and CHANGELOG entry for feature branch

## Dependencies & Execution Order

- Setup tasks must complete before Foundational tasks.  
- Foundational tasks block all user stories.  
- User stories can be implemented in parallel after Foundational is complete.
=======
**Prerequisites**: `specs/002-fms-core-mvp/plan.md`, `specs/002-fms-core-mvp/spec.md`

## Phase 1: Setup (Shared Infrastructure)

- [ ] T001 [P] Create backend environment example file at `backend/.env.example` with `DATABASE_URL`, `PORT`, and `FMS_TENANT_DEFAULT` entries
- [ ] T002 [P] Add Docker Compose for local Postgres+PostGIS at `docker/docker-compose.postgres.yml` (service name `fms-postgres`)
- [ ] T003 [P] Verify CI workflow exists and add `lint` + `test` steps in `.github/workflows/ci.yml` (file: `.github/workflows/ci.yml`)
- [ ] T004 [P] Ensure `scripts/setup_test_db.sh` is executable and documented (`scripts/setup_test_db.sh`, `docs/run-integration.md`)

## Phase 2: Foundational (Blocking Prerequisites)

- [ ] T005 Setup tenant middleware and integration tests in `backend/src/middleware/tenant.middleware.ts` and `backend/tests/unit/tenant.middleware.spec.ts`
- [ ] T006 [P] Add test auth stub for local testing (`backend/src/auth/test-auth-stub.ts`) and wire into dev bootstrap (`backend/src/main.ts` when NODE_ENV=test)
- [ ] T007 [P] Add DB migrations for PostGIS, units, dispatch tables (`backend/db/migrations/0001_enable_postgis.sql`, `backend/db/migrations/0002_create_units_and_dispatch.sql`)
- [ ] T008 [P] Add TypeORM/DB pool readiness check and config sample (`backend/src/db.ts`, `backend/.env.example`)
- [ ] T009 [P] Create seed script for minimal fixture data (one tenant, 3 units) at `scripts/seed_sample_data.sh`

## Phase 2.1: Tenant Safety (RLS)

- [ ] T045 [P][MUST] Add RLS migration to `backend/db/migrations/` implementing row-level security for tenant separation and example policies (`backend/db/migrations/0003_enable_rls_tenants.sql`).
- [ ] T046 [P][MUST] Add integration test `backend/tests/integration/tenant_isolation.spec.ts` asserting tenant A cannot read/write tenant B data; gate CI on this test.

## Phase 3: User Story 1 - Dispatcher (Priority: P1)

Goal: Dispatcher can create an Incident and assign Units atomically. This is the MVP slice.

- [ ] T010 [US1] Implement `POST /incidents` endpoint with validation DTO at `backend/src/incidents/incidents.controller.ts` and `backend/src/incidents/dto/create-incident.dto.ts`
- [ ] T011 [US1] Implement incident persistence with geometry handling in `backend/src/incidents/incidents.service.ts` (use ST_SetSRID/ST_Point)
- [ ] T012 [US1] Implement spatial candidate search `UnitsService.findNearby` at `backend/src/units/units.service.ts` (uses PostGIS ST_DWithin)
- [ ] T013 [US1] Implement transactional assignment `IncidentsService.assignUnits(incidentId, unitIds, actorId)` in `backend/src/incidents/incidents.service.ts` and expose `POST /incidents/:id/assign` in controller
- [ ] T014 [US1] Add audit event writes to `dispatch_events` table when assignments occur (implemented in `IncidentsService.assignUnits`)
- [ ] T015 [US1] Add unit/integration tests for create→assign→DB verification at `backend/tests/integration/test_dispatch_flow.spec.ts` (CI toggles DB availability)
- [ ] T016 [US1] Add API contract test (OpenAPI-backed) for `POST /incidents` and `POST /incidents/:id/assign` in `specs/002-fms-core-mvp/contracts/` (optional: tests/contract)

## Phase 4: User Story 2 - Mobile (Priority: P2)

Goal: Mobile client receives assignment notifications and can update status and GPS pings.

- [ ] T020 [US2] Add Socket.io server integration point and namespace for units in `backend/src/socket/` (server + event handlers)
- [ ] T021 [US2] Emit `assignment` events on successful assignment in `IncidentsService.assignUnits` (code location: `backend/src/incidents/incidents.service.ts`)
- [ ] T022 [US2] Implement endpoints to accept status updates and GPS pings: `POST /units/:id/status` and `POST /units/:id/ping` at `backend/src/units/units.controller.ts`
 - [ ] T023 [US2] Persist GPS pings to `dispatch_events` or `gps_pings` table and update `units.last_known` geometry (`backend/db/migrations/0004_add_gps_pings.sql`)
- [ ] T024 [US2] Integration test: simulate assignment → simulate mobile status update → assert dispatcher state updated (`backend/tests/integration/test_mobile_sync.spec.ts`)

## Phase 5: User Story 3 - Map & Search (Priority: P3)

Goal: Dispatcher map shows incidents and live unit positions; can search within radius.

- [ ] T030 [US3] Implement `GET /units/nearby?lat=&lon=&radius=` in `backend/src/units/units.controller.ts` (already scaffolded at `units/nearby`)
- [ ] T031 [US3] Add map-facing endpoint `GET /incidents` to return incidents with GeoJSON at `backend/src/incidents/incidents.controller.ts`
- [ ] T032 [US3] Implement server-side socket propagation of `unit_location` events for map updates (`backend/src/socket/`)
- [ ] T033 [US3] Add spatial search accuracy tests with fixture data in `backend/tests/integration/test_spatial_search.spec.ts` (use N=5km case)

## Phase 6: Polish & Cross-Cutting Concerns

- [ ] T040 Documentation: update `docs/quickstart.md` and `docs/run-integration.md` with commands and sample responses (`docs/quickstart.md`, `docs/run-integration.md`)
- [ ] T041 [P] Add E2E scenario tests (headless) that orchestrate API + socket flows (`tests/e2e/dispatch_flow_e2e.ts`)
- [ ] T042 Security: add RBAC checks for dispatcher vs firefighter in controllers (`backend/src/auth/guards/*`)
- [ ] T043 Observability: add structured logging and metrics (request id, timing) in `backend/src/main.ts` and services
- [ ] T044 Release: add CHANGELOG entry and merge checklist to `specs/002-fms-core-mvp/tasks.md` (this file)

## Phase 6.1: Missing Migrations, Events, CI

- [ ] T047 [M] Add migration `0004_add_gps_pings.sql` to `backend/db/migrations/` to persist GPS pings and update `units.last_known_location`.
- [ ] T048 [M] Define realtime event contract (events.yaml or extend `openapi.yaml`) and add integration contract tests for assignment events (ack semantics).
- [ ] T049 [M] Update `specs/002-fms-core-mvp/plan.md` testing section to reflect `vitest`, and update `.github/workflows/ci.yml` to run `vitest` and integration jobs (conditionally on DB availability).
- [ ] T050 [L] Add performance/load task to run `specs/*/tests/k6/*.js` in CI or as an optional pipeline and document measurement harness for SC-002/SC-003.

## Dependencies & Execution Order

- Phase 1 → Phase 2 (foundational) must complete before user stories begin.  
- Within a user story: tests (where included) are written first (contract/integration), then models/entities, then services, then controllers/endpoints, then integration/E2E.  
- Tasks marked `[P]` can be executed in parallel by different developers.

## Parallel Execution Examples

- `T001`, `T002`, `T003`, `T004` (Phase 1) are parallelizable and can be done together.  
- After foundational tasks `T005`–`T009` complete, `US1` tasks `T010`–`T016` can be implemented by one developer while `US2` (`T020`–`T024`) is implemented by another.

## Implementation strategy (MVP first)

1. Complete Phase 1 + Phase 2.  
2. Implement **User Story 1** (T010–T016) only, validate via integration tests and demo — this is the MVP.  
3. Add User Story 2 (mobile sync) and User Story 3 (map/search).  
4. Add E2E tests and polish cross-cutting concerns.

>>>>>>> origin/001-create-frontend
