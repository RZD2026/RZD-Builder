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
| 1 | 🟡 MEDIUM | `services/reviewWriteService.js`, `services/airtableAdapter.js` | 609, 379-459 | The adapter now requires an active PlanStore operation and verifies its action, target, and payload. It does not independently repeat the central writer's fresh match preflight; an internal caller holding a real active permit could therefore bypass that additional freshness check, though it cannot fabricate PlanStore authorization. | 7/10 |

No confirmed exploitable vulnerability was identified in the new service basis within the reviewed scope.

## Evidence of protections in code

- `createPlan` generates Plan-IDs from 32 random bytes and hashes the token before storage (`services/productionMutationPlanService.js`).
- PlanStore claims are conditional transactions; the schema also limits the database to one executing plan (`services/sqlitePlanStore.js:746`, `services/planStoreMigrations/001_initial.sql:29`).
- `confirmAndAuthorize` rebuilds the plan and compares operation descriptors and fingerprint before claiming (`services/productionMutationPlanService.js`).
- Canonicalization rejects non-JSON values and binds the canonical document and payload hashes (`services/productionMutationPlanCanonicalizer.js:35`).
- Construction fails closed when actor resolution, authorization, or confirmation-verification dependencies are missing (`assertTrustedContext` in `services/productionMutationPlanService.js`).
- Permits are held in a per-instance `WeakMap`, reject serialization, and enforce operation order (`confirmAndAuthorize` and `recordOperationStart` in `services/productionMutationPlanService.js`).
- Unknown and interrupted outcomes stop further operation starts; no automatic retry/reset path was identified (`recordOperationResult` in `services/productionMutationPlanService.js`; `services/sqlitePlanStore.js:1025`).
- The service persists hashes, targets, and source descriptors rather than full operation payloads; the test suite includes a payload-persistence assertion (`services/productionMutationPlanService.js`; `scripts/testProductionMutationPlanService.js`).

## Test evidence versus runtime verification

The test source includes checks for intent validation, payload non-persistence,
atomic claims across service instances, permit replay/order, expiry, unknown
outcomes, adapter authorization, and selected writer disconnection
(`scripts/testProductionMutationPlanService.js`).
Tests were not executed as part of this read-only security review, so those
assertions were test-source evidence only at review time.

## Phase 1 implementation status

The central live `upsertReview` CREATE/UPDATE path now requires a PlanService,
opaque permit, and operation ID. It checks the current action and target,
compares the canonicalized payload with the claimed operation before the
adapter call, records mismatches as failed, records provider errors as unknown
without retry, and finalizes successful operations. Dry-run remains permit-free.
The mapped UPDATE plan now omits the default review status under the same
condition as the live writer.

The focused PlanStore service, adapter authorization, review policy, review
preflight, and review service/entity scripts were executed after this change
and passed. They use mocks/test fixtures; no Airtable writes were made. The
adapter tests cover missing/fabricated authorization, exact active CREATE and
UPDATE operations, payload mismatch, and non-review table writes. The tests do
not establish that a production actor/confirmation context exists. Until
trusted production context is available, callers without a valid permit
remain blocked.

## Not established by this review

- The production actor resolver, authorization policy, and confirmation
  verifier are injected dependencies. Their identity assurance and binding of
  confirmation to actor, Plan-ID, and fingerprint cannot be assessed here.
- Direct Axios use and mutations outside review `createRecord`/`updateRecord`
  remain outside this adapter gate. Mobile and CLI callers still lack a
  server-side trusted permit context and are blocked at the central writer.
- Mobile attachment handling downstream of the plan builder was not assessed;
  no writer is connected to this service basis.

`docs/PLANSTORE.md` records that no production actor resolver or reliable mobile
confirmation source has been established.

## Conclusion

The central review writer now fails closed without PlanStore authorization,
but the integration is not yet a production-ready authorization flow. Establish
trusted actor/confirmation dependencies and gate or restrict every direct
adapter and other production mutation route before enabling production writes.

## A007 follow-up — 2026-11-09

The internal-caller fresh-preflight finding above is addressed in
`services/airtableAdapter.js`. After validating the active operation, the
adapter reloads review records and requires CREATE to have no current match or
UPDATE to have exactly one current match with the authorized record ID. Read
failures and changed or ambiguous matches block the provider write. The
central writer preflight remains in place.

Focused local tests passed:

- `node scripts/testProductionMutationPlanService.js`
- `node scripts/testReviewWriteService.js`
- `node scripts/testReviewWriteServiceEntities.js`
- `node scripts/testMappedReviewWritePreflight.js`

No external or live writes were performed. The recheck is not atomic with the
provider write, so a concurrent change after the adapter read remains a
residual race. Trusted production actor/confirmation context is still absent;
this follow-up does not authorize or enable production writes.

## Historical P0 reconciliation

The following statuses come from the read-only code review reported on
2026-11-09. They were not retested or re-reviewed during this documentation
synchronization.

| ID | Historical priority | Review status | Current interpretation |
|---|---|---|---|
| SYNC-01 | P0 | Confirmed open | Update counters can increment before execution. This affects summary accuracy; it was not identified as a security vulnerability. The historical severity has not been reassessed. |
| SYNC-03 | P0 | Resolved in the central sync/review-write path only | Central dry-run checks avoid those provider writes. A universal dry-run barrier across all direct mutation paths remains unproven. |
| TEST-01 | P0 | Insufficient evidence | The package test script is a placeholder and standalone scripts exist; current end-to-end test-runner status was not established by this document-only task. |
| MCP-02 | P0/P3 | Insufficient evidence | The choices handler calls the update route directly; end-to-end behavior and dry-run coverage were not established. |
| CHOICE-01 | P0/P3 | Historical / reassess | The direct choices PATCH remains in code; API compatibility cannot be established from the review evidence. |
| MOBILE-01.2 | P0 | Historical / open under A006 | Offline phone storage is not implemented in the recorded status; A006 is P1 in the active backlog. |
| MOBILE-01.3 | P0 | Historical / open under A006 | A reachable secure endpoint, authentication, and separate submission storage remain unconfirmed. |
| MOBILE-01.4 | P0 | Historical / open under A006 | Recovery and durable idempotent sync remain open in the recorded mobile analysis. |
| MOBILE-01.5 | P0 | Historical / open under A006 | A server-side approval gate and roles remain unimplemented in the recorded status. |
| Provision review checks | P0 | Historical / insufficient current evidence | The older appendix marks mapping-status and record/field validation as P0; this documentation-only task did not revalidate that route. |

`MASTER-WERKDOSSIER` version 4 retains these historical P0/P3 labels, while
`BACKLOG.md` says there are no confirmed active P0 tasks and lists A006 as P1.
This is a remaining documentation-priority discrepancy, not evidence that all
historical items are fixed or that each is a current critical vulnerability.
Reconcile the legacy labels against current code and severity under A002,
A006, and NONDOC-06/NONDOC-07 before changing their active priority.
