# Task breakdown generated from `plan.md` (sprints W3..W8) - 2026-02-10

 Phase: Sprint-level tasks (derived from Implementation Plan)

 Phase Setup / Foundational

- [ ] T030 [P] Create web map integration scaffold in frontend (`frontend/components/map/`)

- [ ] T031 [P] Add geocoding service integration and manual-pin UI docs (`specs/001-fms-core/quickstart/geocoding.md`)

- [ ] T032 [P] Apply PostGIS schema changes and seed initial Stations/Units (`specs/001-fms-core/db/0002_create_core_tables.sql`)

 Sprint W4 — 指令ロジック & 空間検索

- [ ] T033 [US3] Implement proximity search API (radius N km) in backend (`backend/src/services/geosearch_service.ts`)

- [ ] T034 [US1] Implement incident creation API and basic frontend form (`backend/src/controllers/incidents_controller.ts`, `frontend/pages/incidents/new.tsx`)

- [ ] T035 [US1] Implement dispatch issuance transaction and concurrency guard (`backend/src/services/dispatch_service.ts`)

 Sprint W5 — リアルタイム通信 & 通知基盤

- [ ] T036 [P] Implement Socket.IO server integration in backend (`backend/src/services/realtime/socket_service.ts`)

- [ ] T037 [P] Add Redis Pub/Sub integration and verification tests (`specs/001-fms-core/tests/redis_pubsub_check.md`)

- [ ] T038 [P] Implement notification abstraction for FCM integration (`backend/src/services/notifications/*`)

 Sprint W6 — モバイル 基本連携

- [ ] T039 [US2] Add Flutter mobile stub for receiving dispatch and updating status (`specs/001-fms-core/quickstart/mobile_stub/`)

- [ ] T040 [US2] Implement GPS ping endpoint and persistence (`backend/src/controllers/units_controller.ts`)

- [ ] T041 [US2] Implement offline queue sync strategy document and sample (`specs/001-fms-core/quickstart/mobile_offline.md`)

 Sprint W7 — 動態管理と UI 反映

- [ ] T042 [P] Implement map-side unit movement smoothing and UI updates (`frontend/components/map/unit_marker.tsx`)

- [ ] T043 [US1] Add timeline/logging for status transitions (`backend/src/services/timeline_service.ts`, `frontend/components/timeline/`)

- [ ] T044 [P] Create E2E scenario definitions for 通報→指令→出動→現着→鎮火 (`specs/001-fms-core/tests/e2e/`)

 Sprint W8 — 統合テストとデプロイ準備

- [ ] T045 [P] Run integration & basic load verification (k6) and document results (`specs/001-fms-core/tests/k6/`)

- [ ] T046 [P] Create docker-compose and deployment docs for local/dev (`devops/docker-compose.yml`, `specs/001-fms-core/operations/deploy.md`)

 Cross-cutting

- [ ] T047 [P] Finalize RLS policy templates and add runbooks (`specs/001-fms-core/db/0003_rls_policies_and_helpers.sql`)

- [ ] T048 [P] Configure Keycloak realm/roles and record test users (`specs/001-fms-core/ops/keycloak/README.md`)

- [ ] T049 [P] Create seed data scripts for stations/units/users (`specs/001-fms-core/db/0004_seed_sample_data.sql`)

 Notes:

- Task IDs continue from existing `tasks.md` (which lists through T029). These sprint tasks are granular items intended to be converted into issues and assigned to milestones W3..W8.

- Each task includes a suggested file path to keep changes discoverable.
