# PlanStore

The local PlanStore persists plan fingerprints and operation state. The service
does not execute provider writes. This document describes the PlanStore and
the Media Schema Preview; it does not claim that existing review-write or
adapter routes are gated by this store.

On Windows, the default database is
`%LOCALAPPDATA%\RZD Builder\planstore.sqlite`. `RZD_PLANSTORE_PATH` can select
another absolute path inside the per-user RZD Builder app-data directory.
Windows UNC paths and paths inside the repository are rejected. POSIX
network-mounted filesystems are not detected, so use only a local disk. On
macOS, the default is under `~/Library/Application Support/RZD Builder/`.

The SQLite backend uses WAL mode, full synchronous durability, foreign keys,
and a five-second busy timeout. Schema changes are applied from the numbered
SQL files in `services/planStoreMigrations/`. Plans store only a hash of the
Plan-ID, the plan fingerprint, operation targets, and payload hashes; callers
must not put credentials or other secrets in metadata or targets.

Claims are one-time, conditional status transitions. An interrupted or
uncertain operation is recorded as unknown/interrupted and is never reset for
automatic retry. A claimed plan remains active until explicitly finalized.

The Media Schema Preview injects its dedicated builder into
`ProductionMutationPlanService`. The general review/mobile builder is loaded
only when no builder is injected; its planning and live-write behavior are
outside this preview's security boundary.

The `airtable-media-schema` builder is a separate, preview-only intent for
metadata analysis of `Media`, `Media-versies`, and `WordPress-koppelingen`.
It reads only Airtable schema metadata, compares field types and the explicitly
modeled link relationships, and includes the complete current configuration
for fields in those three tables. Existing fields outside its declared
comparison scope are reported as preserved; it does not read records or
attachments. `Originele versie` and `Actieve versie` are suggested as
single-record links while their existing linked tables and inverse fields are
retained.

The media-schema preview uses `schema-change` operations under the distinct
`airtable-schema` system. The production plan service accepts those operations
only for the exact media-schema intent, labels its preview `preview-only`, and
rejects confirmation before issuing a permit or claiming the stored plan.
These operations are not Airtable record `create`/`update` operations and must
not be routed through the normal record-write adapter. A future executor must
be a separate, explicit schema execution boundary with its own authorization;
that route is not implemented.

`Trefwoorden` and `RZD-categorie` currently have empty choice lists. Since no
authoritative RZD taxonomy source is defined in this repository or the
metadata, the builder does not invent or propose choice values. The location
and usage of local UUIDs, existing RZD ID values, and the `Koppeling-ID` format
are also reported as open decisions; the builder never generates IDs.

The media-schema integration test uses a mock trusted context and
`createTemporaryTestPlanStore`, which creates a unique SQLite database under
the operating-system temporary directory on Windows, macOS, and Linux. Its
resolved database path is checked to remain within that unique directory; the
factory supplies platform-specific app-data options without using the
production home directory. The store is registered by private object identity.
Closing it closes SQLite and removes the directory, including database sidecar
files; cleanup errors are surfaced and can be retried.

Before builder normalization, the service classifies the original
`airtable-media-schema` intent and requires a registered temporary test store.
It rejects schema-intent type changes and any operation other than
`airtable-schema` / `schema-change` before initializing a store or saving a
plan. The `previewOnly` builder flag is not trusted. Schema plans cannot be
confirmed, claimed, or issued an execution permit. Preview-only status is not
production authorization.

This preview path does not read records or attachments and does not call
Airtable record or schema write methods. This commit does not add a production
trusted-context provider, schema executor, or authorization gate for existing
review-write and adapter routes. Test/mock trusted contexts are not production
authorization.

Run the isolated local tests with:

```powershell
node scripts/testPlanStore.js
node scripts/testAirtableMediaSchemaPlanBuilder.js
```
