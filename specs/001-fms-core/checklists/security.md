# Security Requirements Quality Checklist — FMS Core

Purpose: セキュリティ領域（認証・認可・RLS・データ保護・脅威）に関する要件の品質を評価するチェックリスト。
Created: 2026-02-10
Audience: PR レビュアー / セキュリティレビュアー

Requirement Completeness

- [ ] CHK001 - Are authentication and authorization requirements specified for every protected resource/endpoint (who can do what)? [Completeness, Spec §Dependencies, contracts/openapi.yaml]

- [ ] CHK002 - Are tenant-isolation requirements documented end-to-end (JWT claim name, middleware contract, DB RLS policy references)? [Completeness, Spec §Assumptions, DB §0003]

Requirement Clarity

- [ ] CHK003 - Are the exact JWT validation rules specified (issuer, audience, signing algorithm, token expiry handling, required claims)? [Clarity, Spec §Auth]

- [ ] CHK004 - Are roles and their permissions enumerated and mapped to API actions and DB roles (e.g., `fms_admin` vs `dispatcher`)? [Clarity, Spec §Key Entities, Tasks T026]

Requirement Consistency

- [ ] CHK005 - Are access control rules consistent between OpenAPI contract, backend middleware, and DB RLS policies (no mismatched allow/deny)? [Consistency, contracts/openapi.yaml, DB §0003]

- [ ] CHK006 - Is session/credential handling consistent across transport layers (WS vs HTTP vs FCM)? [Consistency]

Acceptance Criteria Quality

- [ ] CHK007 - Are acceptance checks defined for security-sensitive flows (e.g., tenant-mismatch attempts return 403, not 500) and linked to tests? [Measurability, specs/001-fms-core/db/run_rls_tests.sh]

- [ ] CHK008 - Are threat model mitigations described for high-risk areas (RLS bypass, privilege escalation, mass-notification abuse)? [Acceptance Criteria, Spec §Security]

Scenario & Edge Case Coverage

- [ ] CHK009 - Are failure scenarios documented (expired token, revoked token, missing tenant claim, DB RLS misconfiguration) and expected API responses specified? [Coverage, contracts/openapi.yaml]

- [ ] CHK010 - Is data-at-rest protection specified for sensitive PII fields (encryption, masking) and are retention/erase policies defined? [Edge Case, Spec §Dependencies]

Non-Functional Security Requirements

- [ ] CHK011 - Are transport security requirements explicit (TLS required, allowed cipher suites if applicable)? [NFR, Spec §Dependencies]

- [ ] CHK012 - Are logging/audit requirements specified (audit trail for dispatch/assignment changes including tenant_id, user_id, request id)? [NFR, Monitoring]

Dependencies & Assumptions

- [ ] CHK013 - Are external identity provider expectations documented (Keycloak realm config, role mapping, JWKS endpoint availability)? [Dependency, Spec §Dependencies]

- [ ] CHK014 - Are operational assumptions about secrets management and key rotation defined (where private keys live, rotation windows)? [Assumption, Ops]

Ambiguities & Conflicts

- [ ] CHK015 - Are any ambiguous security terms ("secure", "protected") quantified with exact technical controls? [Ambiguity]

- [ ] CHK016 - Do any requirements conflict with RLS or DB constraints (e.g., admin access vs tenant scoping)? If yes, is the resolution documented? [Conflict, DB §0003]

Checklist usage notes

- Each checklist item should reference a spec section or be marked `[Gap]` when missing.
- Reviewers should attach PR comments and link to failing items when marking a checklist entry as not satisfied.
