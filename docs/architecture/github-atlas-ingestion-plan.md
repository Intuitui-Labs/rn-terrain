# GitHub Atlas Data Ingestion Plan

## Purpose

Atlas must distinguish advertised offer data from practical reality. Collection therefore produces evidence and reviewable change proposals; it never silently edits the published catalogue.

## Hexagonal boundary

```text
External world
  ├── HTTP adapter
  ├── Firecrawl adapter
  ├── RSS adapter
  ├── provider/API adapter
  └── manual evidence adapter
          ↓ ports
OpenEval+ ingestion core
  ├── source definitions
  ├── immutable snapshots and hashes
  ├── conservative fact extraction
  ├── append-only fact and change ledgers
  ├── change events
  └── confidence/review policy
          ↓
Published Atlas catalogue
```

The core depends on `SourceFetcher`, `FactExtractor`, and `SnapshotStore` ports. Adapters depend on the ports; the evaluator depends only on the published catalogue.

## Collection stages

1. Discover official and provider source URLs.
2. Fetch a source through an adapter.
3. Store a timestamped content hash and response status.
4. Extract only explicit candidate facts such as duration, credit, limits, and availability language.
5. Compare against the previous snapshot.
6. Emit `new`, `changed`, `unchanged`, `removed`, or `error` events.
7. Mark extracted facts for review when they would change an offer state.
8. Publish only after review or a narrowly defined trusted rule.

## Firecrawl policy

Firecrawl is an optional adapter for JavaScript-heavy pages, structured extraction, crawling, and change tracking. It is not the source of truth or the decision-maker. If unavailable, ordinary HTTP or manual review remains possible.

Use deterministic extraction for dates, amounts, durations, URLs, and explicit restriction phrases. Use AI extraction only to propose facts, always preserving source text, URL, timestamp, and review status.

## Schedule

- official catalogue: weekly;
- provider offer and terms pages: weekly;
- critical status pages: daily;
- community/RSS evidence: daily or weekly depending on volume.

The first implementation is local and review-only:

```bash
pnpm atlas:collect
```

It prints a JSON report, appends immutable `changes.jsonl` and `facts.jsonl` ledgers, stores immutable snapshots under `.atlas-cache/snapshots/` with a `latest/` pointer, and does not mutate the published offer catalogue. The local file ports mirror the future Supabase tables so the adapter can be replaced without changing domain logic.

Local data layers:

- `.atlas-cache/snapshots/`: raw fetched page bodies, retained by source and content hash;
- `.atlas-cache/latest/`: convenience pointers used for comparison, safe to rebuild from snapshots;
- `.atlas-cache/facts.jsonl`: explicit candidate facts, each tied to a source URL and review flag;
- `.atlas-cache/changes.jsonl`: collection events and hashes;
- `apps/github-atlas/data/offers.ts`: curated, versioned seed catalogue only; collection never edits it automatically.

The Supabase migration at `packages/openeval-core/supabase/migrations/20260829000000_openeval_ingestion.sql` defines the future durable store for sources, snapshots, extracted facts, reviewable change events, and catalogue releases. Raw page bodies belong in object storage; Postgres stores metadata and structured claims.

## Is a database required now?

No. For the current single-user, review-only experiment, the append-only local files are simpler and preserve the important invariants. A database becomes worthwhile when multiple collectors or users need shared review queues, scheduled jobs need durable coordination, or the catalogue must be served remotely. At that point, the existing ports and migration provide the seam: move snapshots to object storage, copy facts and events into Postgres, and keep the evaluator reading a published catalogue release.

The local cache is therefore a deliberate first persistence adapter, not disposable demo state.

The first complete inventory pass is recorded at `apps/github-atlas/data/official-pack-inventory-2026-08-29.json`. It is intentionally separate from normalized offer records: catalogue membership can be collected in one pass, while provider terms, eligibility, expiry, regional restrictions, and redemption behavior require source-specific verification.

## Integrity rules

- Preserve old snapshots; never overwrite history as the only record.
- Keep official, provider, and community evidence distinct.
- Conflicting evidence lowers confidence instead of being averaged away.
- A changed page creates a candidate change, not an automatic status transition.
- Any recommendation affected by uncertainty must show a warning.
- “Unknown” is a valid result.
