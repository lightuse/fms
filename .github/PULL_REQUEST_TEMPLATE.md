# Pull Request Template

Please ensure the following before requesting review:

- [ ] PR references the related spec: `specs/<feature>/spec.md`
- [ ] Tests added or updated where applicable
- [ ] Database migrations included with this PR (if DB changes)
- [ ] CI passes (unit + integration when applicable)

## API checklist
(Reviewers: complete the items below for API-related changes)

- [ ] CHK001 - All endpoints required by the spec are present in OpenAPI and implemented [specs/.../contracts/openapi.yaml]
- [ ] CHK002 - Request/response schemas are defined and documented
- [ ] CHK003 - Error responses and status codes are specified for failure modes
- [ ] CHK008 - Authorization requirements documented and consistent with roles
- [ ] CHK011 - Acceptance criteria are measurable and have test coverage

---

Add a short description of the change and link to the feature spec.