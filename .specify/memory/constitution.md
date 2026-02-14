<!--
Sync Impact Report
- Version change: template (unversioned) → 1.0.0
- Modified principles:
	- [PRINCIPLE_1_NAME] -> I. Modular, Domain-First Design
	- [PRINCIPLE_2_NAME] -> II. Contract-First APIs
	- [PRINCIPLE_3_NAME] -> III. Test-First (NON-NEGOTIABLE)
	- [PRINCIPLE_4_NAME] -> IV. Integration & Safety-Critical Testing
	- [PRINCIPLE_5_NAME] -> V. Observability, Versioning, Simplicity
- Added sections: Operational Constraints, Development Workflow
- Removed sections: none
- Templates checked:
	- .specify/templates/plan-template.md ✅ updated/compatible
	- .specify/templates/spec-template.md ✅ updated/compatible
	- .specify/templates/tasks-template.md ✅ updated/compatible
	- .specify/templates/commands/ ⚠ pending (no commands directory found; validate command references)
- Follow-up TODOs:
	- TODO(RATIFICATION_DATE): original ratification date not found; please supply ISO date (YYYY-MM-DD).
-->

# 統合火災管理システム (FMS) Constitution

## Core Principles

### I. Modular, Domain-First Design
All code MUST be organized as clear domain modules (NestJS Modules for backend).
Each module MUST be self-contained, expose a minimal public API, include its own
tests (unit + integration as applicable), and have an explicit migration or
deprecation path before breaking changes. Rationale: reduces coupling and
enables independent delivery and testing of dispatch, mobile, and GIS features.

### II. Contract-First APIs
All external-facing and internal service APIs MUST be defined in OpenAPI or
equivalent contract artifacts before implementation. Contracts MUST include
request/response schemas, error responses, and example payloads. Backward
compatible changes MUST follow semantic versioning rules in Governance. Rationale:
ensures interoperability between frontend, mobile, and backend services.

### III. Test-First (NON-NEGOTIABLE)
New behavior MUST have automated tests written before implementation. Tests
MUST include unit tests for business logic, integration tests for DB and
external dependencies (PostGIS, Redis, Keycloak), and E2E scenarios for critical
dispatch workflows. CI MUST block merges on failing tests. Rationale: this is a
safety-critical system where regressions have high operational cost.

### IV. Integration & Safety-Critical Testing
Integration tests and scenario-driven E2E tests MUST cover safety-critical
paths: incident creation, dispatching units, GPS/location updates, and RLS/multi-tenant
access controls. These tests MUST run in CI against reproducible fixtures or
ephemeral environments. Rationale: ensures system correctness under realistic
interactions.

### V. Observability, Versioning, Simplicity
Structured logging, request tracing, and metrics collection (MUST) are required
for all services. The project MUST use semantic versioning (MAJOR.MINOR.PATCH)
for public APIs and coordinate breaking changes via documented migration plans.
Favor simple, auditable implementations over premature optimization (KISS).

## Operational Constraints

The project MUST adhere to the following operational requirements:

- **Technology stack**: Node.js (NestJS) backend, PostgreSQL + PostGIS, Redis,
	Keycloak for identity, Docker-based deployment pipelines.
- **Multi-tenant data separation**: Use schema separation or row-level security
	(RLS) as specified in `/specs/*/db/` migration scripts. Tenant context MUST be
	passed and validated by middleware on every request.
- **Security & Compliance**: All security-sensitive events MUST be logged. Use
	Keycloak roles for RBAC and enforce least privilege in APIs and DB policies.
- **Performance targets**: Define p95 latency and throughput goals per feature
	in the associated plan; monitoring alerts MUST be configured for breaches.

## Development Workflow

- **Spec-first**: Features begin with a `spec.md` under `/specs/...` that
	captures prioritized user stories and independent acceptance tests.
- **PR requirements**: Every PR MUST reference the related spec, include
	tests, and pass CI checks (lint, unit, integration where applicable).
- **Reviews**: At least one maintainer review is REQUIRED for non-trivial
	changes; breaking or cross-cutting changes require two approvers and a
	migration plan.
- **Release process**: Releases MUST follow semantic versioning. CHANGELOG
	entries are required for MINOR or MAJOR releases.

## Governance

Amendments, versioning, and compliance rules:

- **Amendments**: Changes to this constitution MUST be made via a documented
	pull request that explains the rationale, impact analysis, and a migration
	plan if breaking. Amendments require approval by at least two maintainers
	(or one maintainer + one stakeholder for minor wording changes).
- **Versioning policy**:
	- **MAJOR**: Backward-incompatible governance or principle removals/redefinitions.
	- **MINOR**: Addition of a new principle/section or material expansion of
		guidance that affects workflows.
	- **PATCH**: Clarifications, wording fixes, typos, or non-semantic refinements.
	The PR MUST set the intended version bump and explain the reasoning.
- **Compliance reviews**: At least one compliance review SHOULD occur annually
	or on every MAJOR governance change; automated constitution checks (see
	`.specify/templates/plan-template.md` Constitution Check) MUST be run before
	Phase 0 approval for new features.

**Version**: 1.0.0 | **Ratified**: TODO(RATIFICATION_DATE): "Original ratification date unknown — please supply YYYY-MM-DD" | **Last Amended**: 2026-02-11
