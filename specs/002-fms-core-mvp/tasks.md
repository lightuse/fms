---
description: "Task list for FMS Core MVP implementation"
---

# Tasks: FMS Core MVP

**Input**: `specs/002-fms-core-mvp/spec.md`  
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
