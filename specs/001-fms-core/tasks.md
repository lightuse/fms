## Tasks for Feature: 統合火災管理システム (FMS) — Core

Phase ordering:
- Phase 1: Setup
- Phase 2: Foundational
- Phase 3+: User stories (P1→P2→P3)
- Final Phase: Polish & cross-cutting

Phase 1 — Setup
- [ ] T001 [P] Initialize feature branch, ensure `specs/001-fms-core` exists and contains spec.md, plan.md, db/ (specs/001-fms-core)
- [ ] T002 [P] Add DB README with run instructions (`specs/001-fms-core/db/README.md`)
- [ ] T003 [P] Add SQL migrations to `specs/001-fms-core/db/` and verify idempotence (`0001_*.sql`, `0002_*.sql`, `0003_*.sql`)
- [ ] T004 [P] Add migration runner integration placeholder in repo docs (add `migrations/README.md`) to describe how to run SQL files (repo root)

Phase 2 — Foundational (blocking prerequisites)
- [ ] T005 [P] Add DB README and tenant-context docs (`specs/001-fms-core/db/README.md`) — includes instructions to set `fms.current_tenant` and middleware contract (JWT claim mapping)
- [ ] T006 [P] Implement simple migration runner scaffold (script) that applies `specs/001-fms-core/db/*.sql` in order and exits non-zero on failure (`scripts/run-migrations.sh`)
- [ ] T007 [P] Add dev seed plan file for automated RLS test data (`specs/001-fms-core/db/0004_seed_sample_data.sql`)
- [ ] T008 [P] Add integration-test checklist for RLS validation and postgis queries (`specs/001-fms-core/tests/rls_integration_checklist.md`)

Phase 3 — [US1] 通報→指令→出動（Priority: P1）
Goal: 司令室でインシデントを作成し、車両を選択して指令を発行、モバイルで指令受信とステータス更新が反映される。
Independent test criteria: API endpoints for create-incident, list-candidate-units, create-dispatch; end-to-end flow from incident creation → dispatch → unit status change.

- [ ] T009 [US1] Define API contract for incident creation and dispatch (`specs/001-fms-core/contracts/openapi.yaml`)
- [ ] T010 [P] [US1] Implement Incident model and repository in backend (`backend/src/models/incident.*`)
- [ ] T011 [P] [US1] Implement Units model and repository in backend (`backend/src/models/unit.*`)
- [ ] T012 [US1] Implement endpoint: POST /incidents to create incident and run candidate search (`backend/src/controllers/incidents_controller.*`)
- [ ] T013 [US1] Implement endpoint: POST /incidents/{id}/dispatch to create DispatchEvent and publish notification (`backend/src/controllers/dispatch_controller.*`)
- [ ] T014 [P] [US1] Implement WebSocket/Socket.IO notification for dispatch events (`backend/src/services/realtime/`) — server-side publish and sample client subscribe
- [ ] T015 [US1] Implement DispatchEvent persistence and transactional assignment to avoid double-assignment (`backend/src/services/dispatch_service.*`)
- [ ] T016 [US1] Add backend integration test that simulates incident creation → dispatch → verifies DispatchEvent and unit status (`specs/001-fms-core/tests/us1_integration_test.md`)

Phase 4 — [US2] モバイルでのステータス更新とGPS共有（Priority: P2）
Goal: モバイルが指令受信、ステータス更新、定期GPS送信を行い、司令室で表示される。
Independent test criteria: Mobile client can receive dispatch payloads and POST GPS pings; backend reflects unit position and status in real-time.

- [ ] T017 [US2] Define mobile API contracts for dispatch notifications and GPS pings (`specs/001-fms-core/contracts/openapi.yaml`)
- [ ] T018 [P] [US2] Implement endpoint: POST /units/{id}/ping to persist GPS pings (`backend/src/controllers/units_controller.*`)
- [ ] T019 [P] [US2] Implement unit status update endpoint or socket message handler for status transitions (`backend/src/controllers/units_status.*`)
- [ ] T020 [US2] Add sample mobile client stub that subscribes to dispatch events and sends pings (`specs/001-fms-core/quickstart/mobile_stub/README.md`)
- [ ] T021 [US2] Add integration test for GPS pings → map update workflow (`specs/001-fms-core/tests/us2_integration_test.md`)

## Tasks: 統合火災管理システム (FMS) — Core

Phase ordering:
- Phase 1: Setup
- Phase 2: Foundational (blocking)
- Phase 3+: User stories (P1 → P2 → P3)
- Final Phase: Polish & cross-cutting

---

## Phase 1: Setup (shared infra)

- [ ] T001 [P] Initialize feature branch and confirm `specs/001-fms-core/` contains `spec.md`, `plan.md`, `db/` (`specs/001-fms-core`)
- [ ] T002 [P] Add or update DB README with run instructions (`specs/001-fms-core/db/README.md`)
- [ ] T003 [P] Verify SQL migrations exist and are idempotent in `specs/001-fms-core/db/` (0001..0005)
- [ ] T004 [P] Add migration runner script and docs (`scripts/run-migrations.sh`, `migrations/README.md`)
- [ ] T005 [P] Verify local dev compose brings up PostGIS, Redis, Keycloak (`devops/docker-compose.yml`)

---

## Phase 2: Foundational (blocking prerequisites)

- [ ] T006 [P] Validate and finalize RLS helpers and policies (`specs/001-fms-core/db/0003_rls_policies_and_helpers.sql`)
- [ ] T006 [P] Validate and finalize RLS helpers and policies (`specs/001-fms-core/db/0003_rls_policies_and_helpers.sql`)
 - [ ] T006a [P] Add migration `0006_add_incident_properties.sql` to add `properties jsonb` to `incidents` if needed (`specs/001-fms-core/db/0006_add_incident_properties.sql`)
- [ ] T007 [P] Ensure seed/sample data for RLS tests exists (`specs/001-fms-core/db/0004_seed_sample_data.sql`)
- [ ] T008 [P] Add CI workflow to run migrations + RLS tests on PRs (`.github/workflows/db-and-tests.yml`)
- [ ] T009 [P] Implement tenant middleware to set DB session tenant from JWT (`backend/src/middleware/tenant.middleware.ts`)
- [ ] T010 [P] Configure TypeORM / DB connection and entity registration (`backend/src/app.module.ts`)
- [ ] T011 [P] Add basic error handling, logging, and config management (`backend/src/main.ts`, `backend/src/config/*`)

---

## Phase 3: User Story 1 - 通報→指令→出動 (Priority: P1) 🎯 MVP

Goal: 司令室でインシデントを作成し、候補車両を提示して指令を発行、モバイルで指令受信とステータス更新が反映されること。
Independent test: Create incident → list candidate units → create dispatch → verify dispatch persisted and unit status updated.

- [ ] T012 [US1] Finalize API contract for incident + dispatch endpoints (`specs/001-fms-core/contracts/openapi.yaml`)
- [ ] T013 [P] [US1] Create `Incident` entity matching DB schema (`backend/src/incidents/incident.entity.ts`)
- [ ] T014 [P] [US1] Create `Unit` entity matching DB schema (`backend/src/units/unit.entity.ts`)
- [ ] T015 [US1] Implement `IncidentsService` (create/list) (`backend/src/incidents/incidents.service.ts`)
- [ ] T016 [US1] Implement `IncidentsController` POST /incidents and GET /incidents (`backend/src/incidents/incidents.controller.ts`)
- [ ] T017 [US1] Implement Dispatch creation endpoint POST /incidents/{id}/dispatch and `Dispatch` persistence (`backend/src/dispatch/dispatch.controller.ts`, `backend/src/dispatch/dispatch.service.ts`)
- [ ] T018 [P] [US1] Implement transactional assignment logic to prevent double-assignment (`backend/src/services/dispatch_service.*`)
- [ ] T019 [US1] Add integration test for US1 flow (`specs/001-fms-core/tests/us1_integration_test.md`)

---

## Phase 4: User Story 2 - モバイルでのステータス更新とGPS共有 (Priority: P2)

Goal: モバイルが指令を受け取りステータス更新し、定期GPSを送信して司令室で反映されること。
Independent test: Mobile client receives dispatch, posts GPS pings, and backend reflects unit position/status.

- [ ] T020 [US2] Finalize mobile-related API contracts for pings and status (`specs/001-fms-core/contracts/openapi.yaml`)
- [ ] T021 [P] [US2] Implement endpoint: POST /units/{id}/ping to persist GPS pings (`backend/src/units/units.controller.ts`, `backend/src/units/units.service.ts`)
- [ ] T022 [P] [US2] Implement unit status update handlers (HTTP + WebSocket) (`backend/src/units/status.handler.ts`, `backend/src/services/realtime/*`)
- [ ] T023 [US2] Add mobile stub and quickstart for testing pings and dispatch reception (`specs/001-fms-core/quickstart/mobile_stub/README.md`)
- [ ] T024 [US2] Add integration test for GPS ping → map update workflow (`specs/001-fms-core/tests/us2_integration_test.md`)

---

## Phase 5: User Story 3 - 地理空間検索 (Priority: P3)

Goal: 指定半径内の「利用可能」な車両を検索して候補を提示すること。
Independent test: Seeded unit positions produce expected candidate list ordered by distance.

- [ ] T025 [US3] Implement geospatial search service using PostGIS (ST_DWithin/ST_Distance) (`backend/src/services/geosearch.service.ts`)
- [ ] T026 [P] [US3] Ensure GIST indexes and DB performance optimizations are present (`specs/001-fms-core/db/0002_create_core_tables.sql`)
- [ ] T027 [US3] Add availability filter and sorting tie-breaker to search (`backend/src/services/geosearch.service.ts`)
- [ ] T028 [US3] Add automated geosearch test that seeds positions and validates results (`specs/001-fms-core/tests/us3_geosearch_test.md`)

---

## Final Phase: Polish & Cross-cutting Concerns

- [ ] T029 [P] Add authentication integration docs and confirm tenant propagation behavior (`specs/001-fms-core/db/README.md`, `backend/src/middleware/tenant.middleware.ts`)
- [ ] T030 [P] Add CI job and integrate k6 smoke tests for critical flows (`.github/workflows/db-and-tests.yml`, `specs/001-fms-core/tests/k6/`)
 - [ ] T030 [P] Add CI job and integrate k6 smoke tests for critical flows (`.github/workflows/db-and-tests.yml`, `specs/001-fms-core/tests/k6/`)
 - [ ] T030a [P] Create k6 performance smoke scenario(s) for SC-002/SC-003 with thresholds (p95 < 5s, error rate < 1%) (`specs/001-fms-core/tests/k6/incident_perf_smoke.js`)
 - [ ] T030b [P] Add Prometheus metrics exposition and Grafana dashboard template to monitor request latency and dispatch time (`specs/001-fms-core/operations/observability.md`)
- [ ] T031 [P] Add monitoring/observability checklist and runbook (`specs/001-fms-core/operations/observability.md`)
- [ ] T032 [P] Document migration/rollback policy and add `0000_readme_migration_policy.md` (`specs/001-fms-core/db/`)
- [ ] T033 [P] Update quickstart and developer docs (`specs/001-fms-core/quickstart.md`, `backend/README.md`)

---

## Dependencies & Execution Order

- Phase 1 (Setup) can run immediately and contains parallelizable tasks ([P]).
- Phase 2 (Foundational) must complete before user story implementation begins.
- User stories (Phase 3+) can be worked in parallel after foundational completion; MVP focuses on US1 first.

---

## Summary

- Path to generated file: `specs/001-fms-core/tasks.md`
- Total tasks: 33
- Tasks per story: US1:8, US2:5, US3:4, Setup/Foundational/Cross-cutting:16
- Parallel opportunities: T001,T002,T003,T004,T005,T006,T007,T008,T009,T010,T013,T014,T018,T021,T022,T026,T030,T031,T033
- Independent test criteria included for each story (see sections above). MVP suggestion: complete Phase 1 + Phase 2 + US1 (T001..T019) as the MVP scope.

Generated: 2026-02-10


