# Implementation Plan: FMS Core MVP

**Branch**: `002-fms-core-mvp` | **Date**: 2026-02-11 | **Spec**: [spec.md](specs/002-fms-core-mvp/spec.md)
**Input**: Feature specification from `/specs/002-fms-core-mvp/spec.md`

## Summary

Deliver the Core MVP for the Integrated Fire Management System (FMS):
implement the end-to-end incident workflow (receive report → dispatch units →
field status updates) for a single tenant in an independently testable slice.
Primary deliverables: incident creation, candidate unit search (spatial), atomic
dispatch assignment, real-time notifications and status synchronization.

## Technical Context

**Language/Version**: Node.js + NestJS (recommended in project docs)  
**Primary Dependencies**: PostgreSQL (+ PostGIS), Redis (pub/sub/cache), Keycloak (auth), Socket.io (realtime)  
**Storage**: PostgreSQL with PostGIS extensions  
**Testing**: Unit tests (Jest), integration tests using ephemeral DB fixtures, E2E scenarios (CI)  
**Target Platform**: Linux server (Docker containers)  
**Project Type**: Web application (backend API + mobile client integration)  
**Performance Goals**: p95 dispatch propagation < 5s under test fixture; SC-002 target.  
**Constraints**: Multi-tenant separation (RLS or schema), observable audits, CI gating for tests.

## Constitution Check

This plan references and adheres to the project Constitution: [ .specify/memory/constitution.md ](.specify/memory/constitution.md). Gate conditions: spec-first, test-first, and integration coverage for safety-critical flows.

## Project Structure

Selected structure (matches repository):

backend/
├── src/
│   ├── modules/
│   │   ├── incidents/
│   │   ├── units/
│   │   └── auth/
│   └── main.ts
└── tests/

Mobile client (integration): `mobile/` (external Flutter client; integration tests simulate mobile actions).

**Structure Decision**: Use existing `backend/` for API and tests; create `specs/002-fms-core-mvp/` artifacts for planning and acceptance fixtures.

## Complexity Tracking

No constitution violations expected. If integration tests require ephemeral Keycloak or PostGIS, justify in the plan and prefer lightweight test doubles for early CI.
