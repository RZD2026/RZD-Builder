# ProductionMutationPlanService Security Review

Review date: 2026-11-08

## Scope and method

Read-only review of the ProductionMutationPlanService, canonicalizer, Airtable
review plan builder, review write service, service test source, PLANSTORE
documentation, and the PlanStore implementation/schema as needed. No tests,
Git commands, external services, production APIs, or production mutations were
used during the review.

## Findings

| # | Severity | File | Lines | Vulnerability | Confidence |
|---|----------|------|-------|---------------|------------|
| 1 | 🟡 MEDIUM | `services/reviewWriteService.js` | 511 | The existing `upsertReview` write path remains callable outside the new service. If an existing route invokes it, that write can bypass the new Plan-ID claim. The service is not connected to production writers, and external route reachability was not established in this review; this is an integration-boundary risk, not a confirmed external exploit. | 8/10 |

No confirmed exploitable vulnerability was identified in the new service basis within the reviewed scope.

## Evidence of protections in code

- The service generates Plan-IDs from 32 random bytes and hashes the token before storage (`services/productionMutationPlanService.js:583`, `services/productionMutationPlanService.js:587`).
- PlanStore claims are conditional transactions; the schema also limits the database to one executing plan (`services/sqlitePlanStore.js:746`, `services/planStoreMigrations/001_initial.sql:29`).
- Confirmation rebuilds the plan and compares operation descriptors and fingerprint before claiming (`services/productionMutationPlanService.js:429`).
- Canonicalization rejects non-JSON values and binds the canonical document and payload hashes (`services/productionMutationPlanCanonicalizer.js:35`).
- Construction fails closed when actor resolution, authorization, or confirmation-verification dependencies are missing (`services/productionMutationPlanService.js:111`).
- Permits are held in a per-instance `WeakMap`, reject serialization, and enforce operation order (`services/productionMutationPlanService.js:750`, `services/productionMutationPlanService.js:871`).
- Unknown and interrupted outcomes stop further operation starts; no automatic retry/reset path was identified (`services/productionMutationPlanService.js:977`, `services/sqlitePlanStore.js:1025`).
- The service persists hashes, targets, and source descriptors rather than full operation payloads (`services/productionMutationPlanService.js:590`). The test source includes a payload-persistence assertion (`scripts/testProductionMutationPlanService.js:565`).

## Test evidence versus runtime verification

The test source includes checks for intent validation, payload non-persistence,
atomic claims across service instances, permit replay/order, expiry, unknown
outcomes, and selected writer disconnection (`scripts/testProductionMutationPlanService.js:1155`).
Tests were not executed as part of this read-only security review, so those
assertions are test-source evidence only, not runtime verification for this
review.

## Not established by this review

- The production actor resolver, authorization policy, and confirmation
  verifier are injected dependencies. Their identity assurance and binding of
  confirmation to actor, Plan-ID, and fingerprint cannot be assessed here.
- Every existing route and writer was not traced for reachability. The direct
  write API remains outside the service until those routes are integrated or
  otherwise restricted.
- Mobile attachment handling downstream of the plan builder was not assessed;
  no writer is connected to this service basis.

`docs/PLANSTORE.md` records that no production actor resolver or reliable mobile
confirmation source has been established (`docs/PLANSTORE.md:34`).

## Conclusion

Suitable for continued isolated development and testing. Not yet established
as safe for production writes. Before production integration, implement and
review trusted actor/confirmation dependencies and verify that every
production mutation route is gated by the central service.
