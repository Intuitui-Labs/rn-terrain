---
title: "RN Terrain — Changelog Intelligence System Plan v1.0"
status: "superseded"
created: 2026-09-26
updated: 2026-09-26
author: "Naveen"
scribe: "Antigravity"
tags: [changelog-intelligence, planning, adr, knowledge-graph]
superseded_by: "decisions/2026-09-26-changelog-intelligence-system-plan-v2.md"
---

> [!WARNING]
> **This document is SUPERSEDED.** See the active plan: [v2.0](./2026-09-26-changelog-intelligence-system-plan-v2.md)
> V1 is preserved as a point-in-time record per docs-sop. Do not act on its contents.

> [!NOTE]
> This is v1, preserved as a point-in-time ADR. See [v2 plan](./2026-09-26-changelog-intelligence-system-plan-v2.md) for the current version.
> **Superseded because:** version start points were uninvestigated, storage was pure-docs (will rot), priority ordering was not failure-mode grounded, and the real app versions were not consulted.

# RN Terrain — Changelog Intelligence System Plan v1.0
## Exhaustive Rolling Audit Plan

---

## Core Problem Statement

Agents default to training-data knowledge. Packages move faster than training cutoffs. The gap between what an agent *thinks* an API looks like vs what it *actually* looks like right now is where production bugs live. This system closes that gap permanently.

---

## PART ONE — DEPENDENCY TAXONOMY

### Tier Classification

#### TIER 0 — THE RUNTIME SUBSTRATE
| Package | Why it's Tier 0 |
|---|---|
| **React Native** (meta/react-native) | The entire stack. Every package is compiled against it |
| **Hermes** | JS engine. WASM support, static Hermes, performance profile |
| **Metro** | Bundler. Transformation pipeline, resolver algorithm |

#### TIER 1 — FOUNDATIONAL FRAMEWORK LAYER
| Package | Vendor | Why Foundational | Cascade Risk |
|---|---|---|---|
| **expo** (SDK) | Expo | Managed workflow backbone | CRITICAL |
| **expo-router** | Expo | File-based navigation | HIGH |
| **react-navigation** | Callstack | Navigation backbone for bare workflow | HIGH |
| **react-native-gesture-handler** | SWM | Required by navigation AND reanimated | HIGH |
| **react-native-reanimated** | SWM | Animation engine | CRITICAL |
| **react-native-screens** | SWM | Native screen implementation | MEDIUM |

#### TIER 2 — INFRASTRUCTURE LAYER
| Package | Vendor | Key Risk Vector |
|---|---|---|
| **react-native-mmkv** | mrousavy | JSI binding model changed |
| **react-native-worklets-core** | SWM | Emergent dep — now explicit |
| **nitro-modules** | mrousavy | Schema-first, codegen patterns |
| **@react-native-async-storage** | RN Community | Track deprecation signals |

#### TIER 3 — UX LAYER
| Package | Key Change Vectors |
|---|---|
| **react-native-bottom-tabs** | Platform behavior quirks per version |
| **@shopify/flash-list** | API evolved significantly |
| **react-native-skia** | Canvas API, image handling, shader API |
| **expo-image** | Replaced older patterns |
| **react-native-safe-area-context** | Insets API, provider setup |
| **@gorhom/bottom-sheet** | Reanimated dependency coupling |

---

## PART TWO — THE KNOWLEDGE GRAPH SCHEMA

### Primary Node: `ChangelogEntry`

```typescript
interface ChangelogEntry {
  id: string
  package: string
  version_from: string
  version_to: string
  date_released: string
  date_discovered: string
  impact_type: ImpactType
  impact_scope: ImpactScope
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW"
  affects_expo_managed: boolean
  affects_bare_workflow: boolean
  new_arch_relevant: boolean
  title: string
  description: string
  api_before: string
  api_after: string
  workaround_exists: boolean
  workaround_description?: string
  workaround_code?: string
  workaround_works_until?: string
  fixed_in_version?: string
  fixed_date?: string
  cascade_deps: string[]
  requires_peer_dep_update: boolean
  peer_dep_changes?: PeerDepChange[]
  changelog_url: string
  github_issue_url?: string
  github_pr_url?: string
  community_thread_urls: string[]
  fix_commit_url?: string
  agent_confidence: "HIGH" | "MEDIUM" | "LOW"
  last_verified: string
  needs_verification: boolean
}
```

---

## PART THREE — DOCUMENT STRUCTURE (v1 Proposal)

```
rn-terrain/docs/changelog-intelligence/
├── INDEX.md
├── QUERY-GUIDE.md
├── packages/
│   ├── react-native/
│   ├── expo-sdk/
│   ├── expo-router/
│   ├── react-native-reanimated/
│   ├── react-native-gesture-handler/
│   ├── react-native-mmkv/
│   ├── react-native-worklets-core/
│   ├── react-navigation/
│   └── ...
├── cross-dep/
├── timelines/
├── by-impact-type/
├── by-scope/
├── recurring-patterns/
└── agent-context/
    ├── CURRENT-STATE.md
    ├── DANGER-ZONES.md
    ├── VERSION-MATRIX.md
    └── MIGRATION-QUICK-REF.md
```

---

## PART FOUR — PHASED EXECUTION PLAN (v1)

### Phase 0 — Foundation Setup
### Phase 1 — Tier 0 Exhaustive Audit (RN core, Hermes, Metro)
### Phase 2 — Tier 1 Exhaustive Audit (Expo SDK, Expo Router, Reanimated, RNGH, React Navigation)
### Phase 3 — Tier 2 Audit (MMKV, Worklets Core, Nitro Modules)
### Phase 4 — Cross-Dep & Cascade Graph
### Phase 5 — Agent Context Optimization
### Phase 6 — Recurring Patterns
### Phase 7 — Automation Integration

---

## PART FIVE — PRIORITY ORDER (v1)

```
Priority 1: react-native (core), react-native-reanimated, expo (SDK)
Priority 2: expo-router, react-native-gesture-handler, react-native-mmkv
Priority 3: react-navigation, react-native-worklets-core, react-native-screens
Priority 4: nitro-modules, react-native-bottom-tabs, react-native-skia
Priority 5: @shopify/flash-list, react-native-safe-area-context, @gorhom/bottom-sheet
Priority 6: lottie-react-native, react-native-svg, react-native-fast-io
```

---

## KEY OPEN QUESTIONS AT V1 (addressed in v2)

1. **Historical depth**: Where to start? v1 proposed RN 0.71, Reanimated v2. Needs verification.
2. **Storage approach**: Pure markdown docs may fail — vector/nodes alternative not explored.
3. **Priority ordering**: Not grounded in dev-critical vs UX-critical thinking.
4. **Self-critique**: Plan not stress-tested for failure modes.
5. **Cascade ordering**: RNGH and Expo Router should be much higher priority given coupling.

*Preserved as v1. See v2 for all resolutions.*
