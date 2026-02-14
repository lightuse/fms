# Security Requirements Quality Checklist

**Purpose**: Ensure security requirements are complete, testable, and consistent. Audience: Reviewer. Depth: Standard.

## Requirement Completeness
- [ ] CHK-S001 - Are authentication requirements specified for all protected resources? [Completeness]
- [ ] CHK-S002 - Are authorization roles and mappings for Dispatcher/Firefighter/Admin defined and enforced? [Completeness]
- [ ] CHK-S003 - Are sensitive data handling requirements (encryption, PII minimization) documented? [Completeness]

## Requirement Clarity
- [ ] CHK-S004 - Are failure modes for auth (expired token, insufficient scope) documented with error codes? [Clarity]
- [ ] CHK-S005 - Are key lifecycle and rotation requirements defined for secrets and signing keys? [Clarity]

## Requirement Consistency
- [ ] CHK-S006 - Are authentication and authorization requirements consistent across API and socket channels? [Consistency]
- [ ] CHK-S007 - Are data protection requirements aligned with storage and backup policies? [Consistency]

## Measurability & Tests
- [ ] CHK-S008 - Are automated tests defined for role-based access control and privilege separation? [Measurability]
- [ ] CHK-S009 - Is there a threat model or list of high-impact threats mapping to requirements? [Measurability]

## Edge Cases & Dependencies
- [ ] CHK-S010 - Are third-party identity provider assumptions (Keycloak) and fallback behaviors documented? [Dependency]
- [ ] CHK-S011 - Are breach/incident response requirements defined (logging, notifications, rotation)? [Edge Case]

## Traceability
- [ ] CHK-S012 - Does each security requirement reference a spec section or task ID? [Traceability]
