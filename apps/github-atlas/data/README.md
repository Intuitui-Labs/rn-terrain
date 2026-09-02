# Atlas data boundaries

Atlas deliberately keeps three kinds of data separate:

1. **Source evidence** is collected into `.atlas-cache/snapshots/` and is never silently replaced.
2. **Candidate facts and change events** are append-only review material in `.atlas-cache/facts.jsonl` and `.atlas-cache/changes.jsonl`.
3. **Published recommendations** come from the curated catalogue in `offers.ts`. A human or explicit release process must review evidence before changing it.

This local layout is compatible with the planned Supabase migration: object storage can hold raw snapshots, while Postgres can hold source metadata, extracted facts, change events, and catalogue releases. The evaluator should only consume a published catalogue, never live scraped pages.

The current catalogue is intentionally small and curated. Adding more sources is cheap; trusting them automatically is not. Each new source should have an owner, authority classification, fetch cadence, and review rule in `data/sources.ts` before it is used to alter an offer.

`official-pack-inventory-2026-08-29.json` is the dated first-party inventory capture. It records the names currently published by GitHub, while `offers.ts` remains the smaller normalized recommendation seed. This separation lets us expand coverage incrementally without confusing “listed by GitHub” with “terms independently verified.”
