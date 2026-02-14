# Requirements Quality Checklist — FMS Core

Purpose: 要件の品質（完全性・明確性・一貫性・測定性・カバレッジ）を評価するためのチェックリスト。
Created: 2026-02-10
Audience: PR レビュアー

Requirement Completeness
	- Expected: each FR maps to at least one task in `tasks.md` and at least one automated test or manual acceptance step.
	- Expected: spec states JWT claim name used for tenant (recommended: `tenant_id`), and middleware contract is documented (example: `SELECT fms_set_current_tenant('<tenant-uuid>')` or `SET LOCAL fms.current_tenant = '<uuid>'`).
	- Expected: each external dependency lists at minimum: purpose, optional/required, failure mode, and acceptable fallback (e.g., Nominatim failure -> manual pin UI).

Requirement Clarity
	- Expected (example for POST /api/incidents): request body must include: `tenant_id` (uuid), `type` (string), `severity` (enum: Low/Medium/High), `location` (GeoJSON Point or null), `location_text` (string), `notes` (string, optional). Response: 201 Created with JSON `{ "id": "<uuid>" }` or 200 OK with resource. Error responses: 400 for validation, 401 for auth, 403 for tenant mismatch, 500 for server errors.
	 - Expected (example for POST /api/incidents): request body must include: `type` (string), `severity` (enum: Low/Medium/High), `location` (GeoJSON Point or null), `location_text` (string), `notes` (string, optional). Tenant MUST be derived from a validated JWT `tenant_id` claim (do not accept `tenant_id` in request bodies). Response: 201 Created with JSON `{ "id": "<uuid>" }` or 200 OK with resource. Error responses: 400 for validation, 401 for auth, 403 for tenant mismatch, 500 for server errors.
	- Expected: define `units.status` allowed values: `['Available','Assigned','En Route','On Scene','Contained']`. Define allowed transitions (e.g., Available -> Assigned -> En Route -> On Scene -> Contained). Document who may trigger each transition (backend/dispatcher/mobile client).
	- Expected: replace vague terms with metrics, e.g., "即時更新" → "通常ネットワーク下でUI更新が p50 < 1s, p95 < 5s". Document where these will be measured (k6 / integration tests).

Requirement Consistency
	- Expected: canonical list of states defined in spec must match `0002_create_core_tables.sql` and OpenAPI enum definitions.
	- Expected: middleware contract specifies JWT claim name (e.g., `tenant_id`) and a code snippet is present showing `SELECT fms_set_current_tenant('<tenant-uuid>')` usage.

Acceptance Criteria Quality
	- Expected: each SC includes the test harness (k6, integration environment), environment variables and baseline (number of clients, dataset size), and pass/fail thresholds.
	- Expected: link to `specs/001-fms-core/tests/k6/dispatch_load_test.js` and state the acceptance thresholds used in the script (e.g., `http_req_failed rate < 1%`, `http_req_duration p95 < 500ms`).

Scenario Coverage
	- Expected: include sequence diagrams or step lists for normal flow, dispatcher cancel, mobile offline then reconnect, and failed dispatch.
	- Expected: define retry policy (e.g., exponential backoff), data merge rules (client-side queued updates applied in chronological order), and conflict resolution (server authoritative for assignment timestamps).
	- Expected: specify that dispatch assignment is done inside a DB transaction using SELECT ... FOR UPDATE or explicit unique constraint and that the earliest committed transaction wins; include test to simulate concurrent requests.

Edge Case Coverage
	- Expected: API accepts `location_text` and optional `location` null; UI must allow manual pin placement and send coordinates; document error codes and UX messaging.
	- Expected: list recoverable vs non-recoverable failures, provide default retry intervals, and state when to show degraded UI (e.g., "リアルタイム更新に障害があります").

Non-Functional Requirements
	- Expected: document baseline environment (local dev, staging VM specs), test dataset size (number of units/incidents), and link to k6 scenarios used to measure.
	- Expected: require TLS for all external endpoints, JWT validation details (issuer, audience, required claims), and storage rules for PII (encryption at rest if applicable).
	- Expected: document backup frequency, migration window procedure, and rollback plan; recommend using logical backups (pg_dump) before applying migrations in prod.

Dependencies & Assumptions
	- Expected: mark each external service as `Validated` or `Needs validation` and record the validation owner.
	- Expected: each FR has at least one task ID and one test file referenced in the checklist comment.

Ambiguities & Conflicts
	- Expected: conflicts are recorded with owner and chosen resolution (e.g., prefer transactional consistency over eventual UI updates for assignment).
	- Expected: data types (GeoJSON point vs text) and validation regex/lengths are specified for each field.

Implementation Constraints (requirements-level checks)
	- Expected: list of suggested libraries must be annotated as `Suggested` not `Required` unless required for compliance.

Checklist usage notes

File generated: 2026-02-10
# Specification Quality Checklist: 統合火災管理システム (FMS) — Core ワークフロー

**Purpose**: Validate specification completeness and quality before proceeding to planning
**Created**: 2026-02-09
**Feature**: ../spec.md

## Content Quality

- [x] No implementation details (languages, frameworks, APIs)
- [x] Focused on user value and business needs
- [x] Written for non-technical stakeholders
- [x] All mandatory sections completed

## Requirement Completeness

- [x] No [NEEDS CLARIFICATION] markers remain
- [x] Requirements are testable and unambiguous
- [x] Success criteria are measurable
- [x] Success criteria are technology-agnostic (no implementation details)
- [x] All acceptance scenarios are defined
- [x] Edge cases are identified
- [x] Scope is clearly bounded
- [x] Dependencies and assumptions identified

## Feature Readiness

- [x] All functional requirements have clear acceptance criteria
- [x] User scenarios cover primary flows
- [x] Feature meets measurable outcomes defined in Success Criteria
- [x] No implementation details leak into specification

## Notes

- The spec was created from the provided overall project description and prioritizes the core end-to-end dispatch workflow as an MVP. If you want an alternative multitenancy approach (schema separation vs row-level security), state preference in `/speckit.clarify`.
