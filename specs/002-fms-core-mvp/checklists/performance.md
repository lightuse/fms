# Performance Requirements Quality Checklist

**Purpose**: Validate that performance requirements are specified, measurable, and testable. Audience: Reviewer. Depth: Standard.

## Completeness
- [ ] CHK-P001 - Are performance targets (p95, throughput) defined for critical user journeys? [Completeness]
- [ ] CHK-P002 - Are degradation requirements defined for high-load scenarios (graceful degradation)? [Completeness]

## Clarity
- [ ] CHK-P003 - Are load-test scenarios and fixture descriptions specified (user counts, request patterns)? [Clarity]
- [ ] CHK-P004 - Are acceptable Service Level thresholds defined and tied to test harnesses? [Clarity]

## Consistency
- [ ] CHK-P005 - Are performance requirements consistent across plan, spec, and CI jobs? [Consistency]

## Measurability
- [ ] CHK-P006 - Are k6 or equivalent scripts provided and referenced in the repo for each target? [Measurability]
- [ ] CHK-P007 - Is CI configured to run smoke performance tests or provide a path to run them manually? [Measurability]

## Edge Cases
- [ ] CHK-P008 - Are performance expectations under partial failure (DB slowdowns, network loss) defined? [Edge Case]

## Traceability
- [ ] CHK-P009 - Do performance items reference spec sections or tasks (e.g., SC-002)? [Traceability]
