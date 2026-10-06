---
title: "TCDI System State & Strategic Roadmap"
subtitle: "What we built, what we proved, what we have not built yet, and why it matters"
status: "active"
created: 2026-09-26
updated: 2026-09-26
author: "Naveen"
scribe: "Antigravity"
tags: [tcdi, system-state, roadmap, architecture, dependency-intelligence]
---

# TCDI System State & Strategic Roadmap

> **This document** is the honest senior-architect debrief of the rn-terrain TCDI
> system: what was proven, what the real gaps are, what the 2026 tooling landscape
> looks like, and what needs to be built next for this to matter in daily practice.

---

## 1. Why This Work Matters

### 1.1 The Problem We Solved — The Context Rot Crisis

In 2026, AI coding agents assist with the majority of React Native development. But
these agents suffer from a structural failure mode: their training data has a cutoff,
and the React Native ecosystem moves faster than any retraining cycle.

The result is **Context Rot** — a class of errors where:

- An agent confidently suggests `reanimated/plugin` in `babel.config.js`, silently
  breaking all animations (Reanimated 4 requires `worklets/plugin`)
- An agent recommends `react-native-gesture-handler@3.0.0` with `gorhom/bottom-sheet`
  on Fabric, not knowing this causes a Yoga SIGABRT still open as of 2026-09
- An agent suggests Expo SDK 58's preview pins (`reanimated@4.6.0` + `worklets@0.12.2`
  + `rn@0.88.0-rc.1`) without knowing this is a **known-broke** peer combination —
  `4.6.x` only supports RN up to `0.87`
- An agent suggests "just upgrade to the latest" without knowing `4.1→4.2` silently
  dropped React Native `0.78` support

**No existing tool addresses this:**

| Tool | What it does | The gap |
|---|---|---|
| `@rnx-kit/align-deps` | Aligns deps to RN version known-good set | No signal history, no dev dance |
| `npx expo-doctor` | Validates Expo deps vs SDK | Expo-only, no collision graph |
| `@react-native/compatibility-check` | Native Module API boundary check | No community signal corpus |
| RN Upgrade Helper | Visual native file diff | No signal corpus, no fix |
| Semgrep Supply Chain | Reachability dep scanning | Generic, not RN-specific |

None of them have the **temporal forensic ledger**. None can answer:
> "What was the compat state of react-native-worklets on 2026-08-11,
> and what were the known broken combinations involving that version?"

That is what TCDI does.

### 1.2 Why Reverse-Chronological, Not Accumulator

The core architectural choice — Present to Past — is epistemologically correct:

- **Most relevant information is most recent.** A dev on RN 0.87.1 cares about the
  `4.7→4.6` transition, not the `3.0→3.1` transition from 2023.
- **Drift is visible immediately.** Starting from the present, you see what is live
  and affecting production apps today.
- **RC/Preview context is honest.** In-flight `0.88.0-rc.2` and `58.0.0-preview.6`
  are noted at the top (pre-stable), then stable history unfolds backward.
- **The full arc of a bug is only comprehensible from the present.** The "exiting
  animation" bug born in `3.17.0`, still open for 19 months, closed `2026-09-22` —
  you understand its arc only by starting from the closed state.

### 1.3 The Unique Compound Value

TCDI is the only system that simultaneously provides:

1. **Atomic Feature Coordinates** — every capability in strongly typed JSON shards
2. **6-State Operational Kernel** — O(1) state projection at any version
3. **Reverse-Chronological Audit Ledger** — 306 versions across 9 packages with kernel
   snapshots, release cards, active signals, peer deps per version
4. **Verified Signal Corpus** — 68 GitHub-sourced landmines with born_at, fixed_in,
   dev_dance, decommission_at
5. **Cross-Dependency Collision Graph** — 32 GOOD/BROKE combo records with evidence URLs
6. **Idempotent Ingestion Pipeline** — re-runs without duplication, dry-run mode

This combination is a **temporal dependency knowledge graph** — the first of its
kind for the React Native ecosystem.

---

## 2. Honest System Inventory (2026-09-26)

### 2.1 What Is Built and Solid

| Component | Location | State |
|---|---|---|
| 6-state shard schema | `schemas/package-features.schema.json` | Solid |
| 11 package shards (68 signals) | `data/packages/*.json` | Solid |
| 32 compat combo records | `data/compat/combos.json` | Solid |
| O(1) kernel projection engine | `engine/project-kernel.mjs` | Solid |
| Static code smell scanner | `engine/scanner.mjs` | Level 0 only |
| Chronos archive ingestor | `scripts/ingest-chronos-signals.mjs` | Solid |
| Chronology generator | `scripts/generate-chronologies.mjs` | Solid |
| 9 reverse-chrono ledgers (306 versions) | `chronology/*.md` | Solid (derived views) |

### 2.2 Critical Gaps

**GAP 1 — No Runtime Check Command**
A dev debugging a SIGABRT does not open a 235KB markdown file. They need:
  node engine/project-kernel.mjs --check
  # reads package.json, projects all installed packages,
  # surfaces BROKEN signals + BROKE combos in seconds

**GAP 2 — Combos Graph Not Queryable**
combos.json is a flat array. Agents cannot ask efficiently:
"Find all BROKE combos involving my installed reanimated@4.6.0."
Need: queryCombo(pkgA, versionA, pkgB, versionB) -> GOOD/BROKE + evidence.

**GAP 3 — No CI Exit-Code Gate**
rnx-align-deps --ci, Semgrep, OX Security all exit 1 on known-bad deps.
TCDI has no --exit-code mode that blocks merges.

**GAP 4 — Scanner Is Level 0 Only (regex, not AST)**
Does not catch: correct-but-deprecated API calls, custom code duplicating a new
native capability, peer drift that compiles successfully but crashes at runtime.

**GAP 5 — Chronology Files Have No Staleness Tracking**
9 markdown files are derived views. No staleness indicator when shards update.

---

## 3. 2026 Tooling Landscape

The industry has moved toward:
- Graph-based dep models (Neo4j, SQLite, Kuzu) not flat JSON
- Multi-hop reasoning: reanimated@4.7 forces worklets@0.13 forces RN>=0.86
- AI agent-first query APIs: queryContext(pkg, version) called during code generation
- CI hard gates: exit 1 on known vulnerable/incompatible combinations

TCDI's architecture is correct and ahead in the temporal forensic dimension.
The weakness is no query surface for the corpus at coding/debugging time.

### Our Structural Differentiator

  Other tools              TCDI
  ------------------       -----------------------------------------------
  "CVE in this version"    "API regressed at 4.5.0, fixed at 4.5.4,
  "Peer range wrong"        dev dance: debounce back-navigation,
                            decommission at: 4.5.4"

  Point-in-time scan       Temporal arc: born_at to fixed_at + evidence
  No signal corpus         68 verified GitHub signals with heat scores
  No collision graph       32 GOOD/BROKE combos with source URLs
  No dev dance             Explicit workaround + removal version

---

## 4. P0-P5 Improvement Roadmap

### P0 — Live Check Command (1 day) [BUILDING NOW]
  node engine/project-kernel.mjs --check [path/to/package.json]
Reads live installed deps, surfaces BROKEN signals + BROKE combos.
Turns TCDI from reference system to daily-use tool.

### P1 — Combo Query Function (2 hours)
  queryCombo('reanimated', '4.6.0', 'react-native', '0.88.0')
  -> { status: 'BROKE', evidence: '...', source_url: '...' }

### P2 — CI Exit-Code Gate (2 hours, after P1)
  node engine/project-kernel.mjs --check --exit-code
  # exits 1 if CRITICAL/HIGH BROKEN signal or BROKE combo active

### P3 — Chronology Staleness Tracker (1 hour)
  generate-chronologies.mjs --check-stale
  # exits 1 if any shard modified more recently than its chronology

### P4 — Semantic Version Graph / SQLite (1 week, transformative)
Replace flat combos.json with better-sqlite3. Expose as MCP tool
tcdi_query(prompt) for AI agent semantic search over the graph.

### P5 — AST-Level Code Smell Detection (2 weeks)
Upgrade scanner from regex to @babel/parser / ts-morph.
Detect deprecated-but-correct API calls, opportunity debt, peer drift.

---

## 5. The /learn Rule and Skill

### Rule: TCDI Audit Protocol

When auditing or modifying React Native dependencies:
1. Cross-reference combos.json for BROKE records before any version bump
2. JSON shards in data/packages/*.json are truth; chronology markdown are views
3. Signal IDs (chronos_s1 etc.) are stable keys — cite them in PRs and issues
4. Unexplained crash: run signalsActiveAt(pkg, version) before touching code
5. Temporal audit vector is always Present to Past; never skip a minor or patch
6. BROKEN with no fixed version = still-open landmine; treat as active risk

### Skill: tcdi-audit (workflow cheatsheet)

Live check (P0, once built):
  node engine/project-kernel.mjs --check

Combo query (today, with jq):
  jq '.combos[] | select(.status == "BROKE")' data/compat/combos.json

Add new signal:
  Edit data/packages/<pkg>.json, add chronos_sN feature key

Regenerate chronology after shard update:
  node scripts/generate-chronologies.mjs --pkg <name> --force

Debug workflow:
  crash -> signalsActiveAt(pkg, version) -> dev dance -> check decommission_at

---

## 6. Cross-References

- [TCDI Architecture Spec](./temporal-convolutional-dependency-intelligence.md)
- [Exhaustive Audit Specification](./exhaustive-dependency-audit-specification.md)
- [Prior Art and Lineage](./dependency-intelligence-prior-art-and-lineage.md)
- [docs/INDEX.md](../INDEX.md)
