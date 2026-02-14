# Master Task List — FMS Core (T001..T049)

This file consolidates the feature tasks from `tasks.md` and the sprint-level breakdown `tasks_sprint_breakdown.md` into a single checklist for planning and issue creation.

Phase ordering:

- Phase 1: Setup
- Phase 2: Foundational
- Phase 3+: User stories (P1→P2→P3)
- Final Phase: Polish & cross-cutting

## Phase 1 — Setup

- [ ] T001 [P] Initialize feature branch, ensure `specs/001-fms-core` exists and contains spec.md, plan.md, db/ (`specs/001-fms-core`)
- [ ] T002 [P] Add DB README with run instructions (`specs/001-fms-core/db/README.md`)
- [ ] T003 [P] Add SQL migrations to `specs/001-fms-core/db/` and verify idempotence (`0001_*.sql`, `0002_*.sql`, `0003_*.sql`)
- [ ] T004 [P] Add migration runner integration placeholder in repo docs (add `migrations/README.md`) to describe how to run SQL files (repo root)

## Phase 2 — Foundational (blocking prerequisites)

- [ ] T005 [P] Add DB README and tenant-context docs (`specs/001-fms-core/db/README.md`) — includes instructions to set `fms.current_tenant` and middleware contract (JWT claim mapping)
- [ ] T006 [P] Implement simple migration runner scaffold (script) that applies `specs/001-fms-core/db/*.sql` in order and exits non-zero on failure (`scripts/run-migrations.sh`)
- [ ] T007 [P] Add dev seed plan file for automated RLS test data (`specs/001-fms-core/db/0004_seed_sample_data.sql`)
- [ ] T008 [P] Add integration-test checklist for RLS validation and postgis queries (`specs/001-fms-core/tests/rls_integration_checklist.md`)

## Phase 3 — [US1] 通報→指令→出動（Priority: P1）

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

## Phase 4 — [US2] モバイルでのステータス更新とGPS共有（Priority: P2）

Goal: モバイルが指令受信、ステータス更新、定期GPS送信を行い、司令室で表示される。

Independent test criteria: Mobile client can receive dispatch payloads and POST GPS pings; backend reflects unit position and status in real-time.

- [ ] T017 [US2] Define mobile API contracts for dispatch notifications and GPS pings (`specs/001-fms-core/contracts/openapi.yaml`)
- [ ] T018 [P] [US2] Implement endpoint: POST /units/{id}/ping to persist GPS pings (`backend/src/controllers/units_controller.*`)
- [ ] T019 [P] [US2] Implement unit status update endpoint or socket message handler for status transitions (`backend/src/controllers/units_status.*`)
- [ ] T020 [US2] Add sample mobile client stub that subscribes to dispatch events and sends pings (`specs/001-fms-core/quickstart/mobile_stub/README.md`)
- [ ] T021 [US2] Add integration test for GPS pings → map update workflow (`specs/001-fms-core/tests/us2_integration_test.md`)

## Phase 5 — [US3] 地理空間検索（Priority: P3）

Goal: 指定半径内の利用可能車両を検索して提示する。

Independent test criteria: Given seeded unit positions, the candidate search returns correct units sorted by distance.

- [ ] T022 [US3] Implement geospatial search query in repository using PostGIS ST_DWithin/ST_Distance (`backend/src/services/geosearch_service.*`)
- [ ] T023 [P] [US3] Add index and query optimizations for proximity search (validate `GIST` indexes present) (`specs/001-fms-core/db/0002_create_core_tables.sql`)
- [ ] T024 [US3] Add unit-level availability filter and tie-breaker sorting in search (`backend/src/services/geosearch_service.*`)
- [ ] T025 [US3] Add automated test that seeds positions and verifies candidate results (`specs/001-fms-core/tests/us3_geosearch_test.md`)

## Final Phase — Polish & Cross-cutting concerns

- [ ] T026 [P] Add authentication integration details and middleware to set `fms.current_tenant` from JWT claims (`backend/src/middleware/tenant_context.*`)
- [ ] T027 [P] Add CI job to run DB migrations and RLS integration tests on PRs (e.g., `.github/workflows/db-migrations.yml`)
- [ ] T028 [P] Add monitoring/observability checklist for real-time notifications and dispatch success rates (`specs/001-fms-core/operations/observability.md`)
- [ ] T029 [P] Cleanup: document rollback/down migrations and add `0000_readme_migration_policy.md` in `specs/001-fms-core/db/`

## Sprint-level tasks (derived from Implementation Plan) — T030..T049

- [ ] T030 [P] Create web map integration scaffold in frontend (`frontend/components/map/`)
- [ ] T031 [P] Add geocoding service integration and manual-pin UI docs (`specs/001-fms-core/quickstart/geocoding.md`)
- [ ] T032 [P] Apply PostGIS schema changes and seed initial Stations/Units (`specs/001-fms-core/db/0002_create_core_tables.sql`)

- [ ] T033 [US3] Implement proximity search API (radius N km) in backend (`backend/src/services/geosearch_service.ts`)
- [ ] T034 [US1] Implement incident creation API and basic frontend form (`backend/src/controllers/incidents_controller.ts`, `frontend/pages/incidents/new.tsx`)
- [ ] T035 [US1] Implement dispatch issuance transaction and concurrency guard (`backend/src/services/dispatch_service.ts`)

- [ ] T036 [P] Implement Socket.IO server integration in backend (`backend/src/services/realtime/socket_service.ts`)
- [ ] T037 [P] Add Redis Pub/Sub integration and verification tests (`specs/001-fms-core/tests/redis_pubsub_check.md`)
- [ ] T038 [P] Implement notification abstraction for FCM integration (`backend/src/services/notifications/*`)

<<<<<<< HEAD
- [ ] T039 [US2] Add Flutter mobile stub for receiving dispatch and updating status (`specs/001-fms-core/quickstart/mobile_stub/`)
=======
- [ ] T039 [US2] Add React Native mobile stub for receiving dispatch and updating status (`specs/001-fms-core/quickstart/mobile_stub/`)
>>>>>>> origin/001-create-frontend
- [ ] T040 [US2] Implement GPS ping endpoint and persistence (`backend/src/controllers/units_controller.ts`)
- [ ] T041 [US2] Implement offline queue sync strategy document and sample (`specs/001-fms-core/quickstart/mobile_offline.md`)

- [ ] T042 [P] Implement map-side unit movement smoothing and UI updates (`frontend/components/map/unit_marker.tsx`)
- [ ] T043 [US1] Add timeline/logging for status transitions (`backend/src/services/timeline_service.ts`, `frontend/components/timeline/`)
- [ ] T044 [P] Create E2E scenario definitions for 通報→指令→出動→現着→鎮火 (`specs/001-fms-core/tests/e2e/`)

- [ ] T045 [P] Run integration & basic load verification (k6) and document results (`specs/001-fms-core/tests/k6/`)
- [ ] T046 [P] Create docker-compose and deployment docs for local/dev (`devops/docker-compose.yml`, `specs/001-fms-core/operations/deploy.md`)

- [ ] T047 [P] Finalize RLS policy templates and add runbooks (`specs/001-fms-core/db/0003_rls_policies_and_helpers.sql`)
- [ ] T048 [P] Configure Keycloak realm/roles and record test users (`specs/001-fms-core/ops/keycloak/README.md`)
- [ ] T049 [P] Create seed data scripts for stations/units/users (`specs/001-fms-core/db/0004_seed_sample_data.sql`)

## Summary

- Total tasks: 49 (T001..T049)
- US1 tasks: ~11 (T009,T010,T011,T012,T013,T014,T015,T016,T034,T035,T043)
- US2 tasks: ~8 (T017,T018,T019,T020,T021,T039,T040,T041)
- US3 tasks: ~6 (T022,T023,T024,T025,T033)

## Next steps

1. Convert master tasks into GitHub Issues (use `scripts/create_issues_from_tasks.sh --dry-run` to preview)
2. Assign owners and milestones (W3..W8) and start implementing MVP (US1)
3. Track progress and move completed checklist items to done in PRs
