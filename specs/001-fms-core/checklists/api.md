# API Requirements Quality Checklist — FMS Core

Purpose: API ドメインに関する要件の品質（完全性・明確性・一貫性・測定性・カバレッジ）を評価するチェックリスト。
Created: 2026-02-10
Audience: PR レビュアー

Requirement Completeness
- [ ] CHK001 - Are all public API endpoints required by the spec listed in `contracts/openapi.yaml` and mapped to FRs? [Completeness, Spec §Functional Requirements, contracts/openapi.yaml]
  - Trace: each endpoint should reference the FR id(s) or be marked `[Gap]` if missing.
- [ ] CHK002 - Are error responses and error codes specified for each endpoint (validation, auth, rate limit, server error)? [Completeness, contracts/openapi.yaml]
  - Trace: error schema and HTTP status mapping must be present for every operation.

Requirement Clarity
- [ ] CHK003 - Are required/optional fields for each request/response explicitly typed and constrained (formats, enums, max lengths)? [Clarity, contracts/openapi.yaml]
  - Gap if request bodies contain untyped or vaguely described fields (e.g., "notes: text").
- [ ] CHK004 - Is authentication and tenant propagation behavior for each endpoint described (which claim/header is required, tenant validation rules)? [Clarity, Spec §Assumptions, DB §0003]
  - Expected: JWT claim name (`tenant_id`) and middleware action documented for protected endpoints.

Requirement Consistency
- [ ] CHK005 - Do parameter names and types match between the OpenAPI contract, backend models, and DB schema (e.g., `tenant_id`, `location`, `location_text`)? [Consistency, contracts/openapi.yaml, specs/001-fms-core/db/0002_create_core_tables.sql]
- [ ] CHK006 - Are status codes used consistently across endpoints for the same class of errors (e.g., 403 for tenant mismatch, 401 for unauthenticated)? [Consistency, contracts/openapi.yaml]

Acceptance Criteria Quality
- [ ] CHK007 - For critical API flows (incident creation, dispatch issuance, unit status update), are acceptance criteria measurable and linked to tests (integration or k6)? [Measurability, Spec §Success Criteria, specs/001-fms-core/tests/k6]
  - Trace: link to specific test files or test IDs; mark `[Gap]` if none.
- [ ] CHK008 - Are rate-limit, timeout, and retry expectations documented for client and server interactions where relevant? [Acceptance Criteria, Spec §Dependencies]

Scenario Coverage
- [ ] CHK009 - Are primary, alternate, exception, and recovery API flows documented (normal, validation failure, auth failure, partial success)? [Coverage, Spec §User Story 1]
- [ ] CHK010 - Is behavior defined for partial writes or multi-step operations (e.g., dispatch creation + notification) including rollback semantics? [Coverage, Spec §FR-003]

Edge Case Coverage
- [ ] CHK011 - Is input boundary behavior specified for geospatial fields (null location, invalid GeoJSON, precision)? [Edge Case, contracts/openapi.yaml, DB §0002]
- [ ] CHK012 - Are idempotency expectations defined for retryable endpoints (e.g., create-dispatch should be idempotent or have conflict semantics)? [Edge Case, Spec §FR-003]

Non-Functional Requirements (API-specific)
- [ ] CHK013 - Are API performance targets specified for critical endpoints and tied to test scenarios (p95 latency thresholds, acceptable error rates)? [Performance, Spec §SC-002, tests/k6]
- [ ] CHK014 - Are security requirements for APIs defined (TLS required, JWT issuer/audience, sensitive fields masking/encryption)? [Security, Spec §Dependencies]

Dependencies & Assumptions
- [ ] CHK015 - Are external dependency contracts documented for API integrations (Nominatim geocoding, FCM, Keycloak) including expected response formats and failure modes? [Dependency, Spec §Dependencies]
- [ ] CHK016 - Is the assumption about tenant propagation via JWT explicitly recorded and traceable to middleware tasks (T026) and DB RLS helpers (`0003_rls_policies_and_helpers.sql`)? [Assumption, Spec §Assumptions, Tasks T026]

Ambiguities & Conflicts
- [ ] CHK017 - Are any ambiguous terms in API descriptions ("fast", "immediate") quantified or flagged as `[Ambiguity]`? [Ambiguity, contracts/openapi.yaml]
- [ ] CHK018 - Do any contract elements conflict with DB constraints (e.g., allowed enum values vs DB enum)? If yes, are conflicts resolved and documented? [Conflict, contracts/openapi.yaml, DB §0002]

Checklist usage notes
- New file created: each run creates a new checklist file; reviewers should reference spec sections and PR files when marking items.
