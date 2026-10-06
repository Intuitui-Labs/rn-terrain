# Dependency Intelligence — Layer A: Knowledge Model
## Universal Architecture — Role Taxonomy, Entry Schema, Seeding Protocol

> **Layer**: A (Knowledge Model) of a two-layer system.
> **Read first**: [`dependency-intelligence-master.md`](../../../x/docs/architecture/dependency-intelligence-master.md) — the highest-level integration document.
> **Dynamic Engine & Anti-Bloat Architecture**: [`temporal-convolutional-dependency-intelligence.md`](temporal-convolutional-dependency-intelligence.md) — The 5-state sliding temporal kernel & CanIUse BCD projection model.
> **Layer B** (Persistence + Access): [`dependency-intelligence-graph.md`](../../../x/docs/architecture/dependency-intelligence-graph.md) — Supabase schema, evidence policy, MCP tools.
>
> This document owns: role taxonomy, tier algorithm, entry schema, impact type vocabulary, seeding protocol, horizon system, and agent-view synthesis.
> It does NOT own: database schema, evidence review lifecycle, MCP tool contracts, or operational cadence (those are Layer B).
>
> **Design principle**: This layer has no hardcoded package names.
> It has roles, rules, and protocols — any package maps into them.
> A package that doesn't exist today will slot in cleanly tomorrow.

---

> **Design principle**: This system has no hardcoded package names.
> It has roles, rules, and protocols — and any package maps into them.
> A package that doesn't exist today will slot in cleanly tomorrow.

---

## PART ONE — THE ONTOLOGY (what things ARE)

### 1.1 The Six Node Types

Keep it lean — 6 node types, not 25. Every entity in the system is one of these.

```
┌─────────────────────────────────────────────────────────────────┐
│                    KNOWLEDGE GRAPH NODES                        │
├────────────────┬────────────────────────────────────────────────┤
│ PackageNode    │ Any tracked npm package. The primary entity.   │
│ VersionNode    │ A specific published version of a package.      │
│ EntryNode      │ A single changelog event (break, dep, fix...). │
│ RoleNode       │ A functional category (Navigation, Storage...). │
│ VendorNode     │ A company/org (Expo, SWM, Meta, Independent).  │
│ HorizonNode    │ A future package/pattern not yet released.      │
└────────────────┴────────────────────────────────────────────────┘
```

### 1.2 The Twelve Relationship Types

```
PackageNode ──[HAS_VERSION]──────► VersionNode
PackageNode ──[PLAYS_ROLE]───────► RoleNode
PackageNode ──[BACKED_BY]────────► VendorNode
PackageNode ──[SUPERSEDES]───────► PackageNode      (X replaced Y)
PackageNode ──[SUPERSEDED_BY]────► PackageNode      (X was replaced by Y)
PackageNode ──[CONFLICTS_WITH]───► PackageNode      (known incompatibility)
PackageNode ──[COMPOSES_WITH]────► PackageNode      (works well together)

VersionNode ──[HAS_ENTRY]────────► EntryNode
VersionNode ──[REQUIRES_PEER]────► VersionNode      (peer dep constraint)
VersionNode ──[CASCADES_TO]──────► PackageNode[]    (breaking here → breaks there)

EntryNode ──[WORKAROUND_FOR]─────► EntryNode        (workaround → original issue)
EntryNode ──[FIXED_BY]───────────► VersionNode      (bug → fix version)
```

That's it. 6 node types, 12 relationship types. The entire RN ecosystem maps into this.

---

## PART TWO — THE ROLE TAXONOMY (what packages DO)

This is the heart of generalizability. Instead of tracking packages by name, we track them by **functional role**. Any package — past, present, or future — maps to exactly one primary role and optionally a secondary role.

### The Twelve Roles

```
ROLE 1  — RUNTIME_SUBSTRATE
  What:   The ground beneath everything. Changes cascade to all packages.
  Now:    react-native, hermes, metro
  Future: Any new JS engine, any new bundler

ROLE 2  — NAVIGATION
  What:   Screen routing, deep linking, history management
  Now:    expo-router, react-navigation/*
  Future: Any successor navigation framework for RN

ROLE 3  — ANIMATION
  What:   Declarative and imperative animation APIs, layout transitions
  Now:    react-native-reanimated, react-native-worklets
  Future: Any CSS-in-RN animation system, any physics engine

ROLE 4  — GESTURE
  What:   Touch input, gesture recognition, haptics
  Now:    react-native-gesture-handler
  Future: Any unified gesture API, any native input abstraction

ROLE 5  — NATIVE_BRIDGE
  What:   How JS talks to native. The interop framework.
  Now:    react-native-nitro-modules, expo-modules-core
  Future: Any next-gen JSI abstraction, any WASM-native bridge

ROLE 6  — STORAGE
  What:   Data persistence — key-value, relational, document
  Now:    react-native-mmkv, op-sqlite, @react-native-async-storage
  Future: Any new persistence library

ROLE 7  — STYLING
  What:   Visual appearance system — classes, themes, tokens
  Now:    nativewind, react-native-css, StyleSheet
  Future: Any CSS-in-JS for RN, any design token system

ROLE 8  — UI_PRIMITIVES
  What:   Low-level layout, safe areas, screen containers
  Now:    react-native-screens, react-native-safe-area-context
  Future: Any platform layout primitive

ROLE 9  — UI_COMPONENTS
  What:   Reusable component libraries — lists, modals, overlays
  Now:    flash-list, react-native-skia, bottom-sheet, svg, lottie
  Future: Any component library that wraps native UI

ROLE 10 — STATE
  What:   Application state management and side-effect orchestration
  Now:    zustand, xstate, jotai, redux-toolkit
  Future: Any new state primitive, React compiler-based state

ROLE 11 — PLATFORM_SERVICES
  What:   Device/OS capabilities — camera, location, notifications
  Now:    expo-camera, expo-location, expo-notifications, react-native-maps
  Future: Any OS API wrapper, any hardware abstraction

ROLE 12 — OBSERVABILITY
  What:   Error tracking, analytics, performance monitoring
  Now:    @sentry/react-native, posthog-react-native
  Future: Any RN-specific monitoring SDK, any AI-native telemetry
```

### Role Assignment Rules

When a new package appears, assign its role using these questions in order:

```
Q1: Does it change how JS calls native code?             → NATIVE_BRIDGE
Q2: Does it affect how the app renders everything?       → RUNTIME_SUBSTRATE
Q3: Does it manage screen routing / URL handling?        → NAVIGATION
Q4: Does it produce animations or transitions?           → ANIMATION
Q5: Does it interpret touch / gestures?                  → GESTURE
Q6: Does it persist data to device storage?              → STORAGE
Q7: Does it control visual appearance / theming?         → STYLING
Q8: Does it provide scroll, layout, or area primitives?  → UI_PRIMITIVES
Q9: Does it provide reusable UI components?              → UI_COMPONENTS
Q10: Does it manage app-level state or side effects?     → STATE
Q11: Does it expose a device/OS capability?              → PLATFORM_SERVICES
Q12: Does it track errors, events, or performance?       → OBSERVABILITY
```

**A package with two answers** gets a primary role (the first Yes) and a secondary role.
Example: `react-native-worklets` — primary `ANIMATION` (powers Reanimated), secondary `NATIVE_BRIDGE` (creates a separate JS thread via JSI).

---

## PART THREE — THE TIER ALGORITHM (derived, not assigned)

> V1 and V2 mistakes: Tier was assigned by human judgment ("this feels foundational").
> The correct approach: Tier is **computed** from three measurable signals.

### Tier Formula

```
TIER_SCORE = (Cascade × 0.4) + (SurfaceArea × 0.35) + (Velocity × 0.25)
```

Where:

| Signal | Definition | Measurement |
|---|---|---|
| **Cascade** | How many packages break when this one changes | Count of `CASCADES_TO` edges in graph |
| **SurfaceArea** | How much of a typical codebase touches this package | % of files with imports (from real app scan) |
| **Velocity** | How fast does this package's API surface change | Breaking entries per year in changelog |

| Score Range | Tier | Meaning |
|---|---|---|
| 0.75–1.00 | **TIER 0** | Runtime substrate — cascade to everything |
| 0.55–0.74 | **TIER 1** | Foundational — cascade to significant surface area |
| 0.35–0.54 | **TIER 2** | Infrastructure — important but bounded cascade |
| 0.15–0.34 | **TIER 3** | Capability — self-contained, limited cascade |
| 0.00–0.14 | **TIER 4** | Utility — minimal cascade, stable API |

### Why This Matters for Future Packages

When a new package appears (Nitro Modules replacement, a new AI inference SDK, whatever), you:
1. Register it in the Package Registry with its role
2. Run the tier algorithm based on its cascade relationships
3. It automatically gets the right audit priority

No human needs to decide "is this Tier 1 or Tier 2?"

---

## PART FOUR — THE PACKAGE REGISTRY

### What it is

The registry is the **canonical ledger of tracked packages**. It does not contain changelog data. It is the index that makes everything else traversable.

### Schema: `registry.json`

```jsonc
{
  "$schema": "./registry.schema.json",
  "version": "1.0.0",
  "updated": "2026-09-26",
  "packages": {
    "react-native-reanimated": {
      // Identity
      "npm": "react-native-reanimated",
      "display": "React Native Reanimated",
      "github": "software-mansion/react-native-reanimated",
      "changelog_url": "https://github.com/software-mansion/react-native-reanimated/blob/main/CHANGELOG.md",

      // Classification (the only fixed fields)
      "primary_role": "ANIMATION",
      "secondary_role": "NATIVE_BRIDGE",
      "vendor": "software-mansion",

      // Audit coverage
      "audit_start_version": "3.0.0",      // current major - 1 rule
      "audit_start_rationale": "v3 was first Fabric-supporting release",
      "audit_end_version": "current",

      // Computed (updated by sync)
      "tier": 1,
      "tier_score": 0.71,
      "current_version": "4.6.0",
      "latest_version": "4.6.0",
      "entry_count": 0,                    // populated by generate-graph
      "last_audited": null,
      "audit_status": "PENDING"            // PENDING | IN_PROGRESS | COMPLETE | STALE
    },

    // Future package registration (doesn't exist yet, but tracked)
    "react-native-wgpu": {
      "npm": "react-native-wgpu",
      "display": "React Native WebGPU",
      "github": "callstack/react-native-webgpu",
      "changelog_url": null,               // not published yet
      "primary_role": "UI_COMPONENTS",
      "secondary_role": "NATIVE_BRIDGE",
      "vendor": "callstack",
      "audit_start_version": "0.1.0",      // from creation
      "audit_start_rationale": "new package, track from inception",
      "audit_end_version": "current",
      "tier": null,                        // computed when first entries exist
      "tier_score": null,
      "current_version": "0.5.x",
      "entry_count": 0,
      "audit_status": "HORIZON"            // not yet active — tracked but not seeded
    }
  },

  "vendors": {
    "software-mansion": {
      "display": "Software Mansion",
      "packages": ["react-native-reanimated", "react-native-gesture-handler",
                   "react-native-screens", "react-native-worklets"],
      "signal_urls": {
        "blog": "https://blog.swmansion.com",
        "github": "https://github.com/software-mansion",
        "rss": "https://blog.swmansion.com/feed"
      }
    },
    "expo": {
      "display": "Expo",
      "packages": ["expo", "expo-router", "expo-modules-core"],
      "signal_urls": {
        "changelog": "https://expo.dev/changelog",
        "blog": "https://expo.dev/blog",
        "github": "https://github.com/expo"
      }
    },
    "meta": {
      "display": "Meta / React Native Core",
      "packages": ["react-native"],
      "signal_urls": {
        "blog": "https://reactnative.dev/blog",
        "releases": "https://github.com/facebook/react-native/releases"
      }
    },
    "callstack": {},
    "mrousavy": {},
    "shopify": {},
    "independent": {}
  },

  "roles": {
    "RUNTIME_SUBSTRATE": { "description": "...", "cascade_weight": 1.0 },
    "NAVIGATION": { "description": "...", "cascade_weight": 0.8 },
    "ANIMATION": { "description": "...", "cascade_weight": 0.7 },
    "GESTURE": { "description": "...", "cascade_weight": 0.65 },
    "NATIVE_BRIDGE": { "description": "...", "cascade_weight": 0.75 },
    "STORAGE": { "description": "...", "cascade_weight": 0.5 },
    "STYLING": { "description": "...", "cascade_weight": 0.6 },
    "UI_PRIMITIVES": { "description": "...", "cascade_weight": 0.55 },
    "UI_COMPONENTS": { "description": "...", "cascade_weight": 0.35 },
    "STATE": { "description": "...", "cascade_weight": 0.4 },
    "PLATFORM_SERVICES": { "description": "...", "cascade_weight": 0.3 },
    "OBSERVABILITY": { "description": "...", "cascade_weight": 0.2 }
  }
}
```

---

## PART FIVE — THE ENTRY SCHEMA (universal, package-agnostic)

Every single changelog event — for any package, now or future — uses this schema. No package-specific fields. The schema is the protocol.

### Schema: `entry.schema.json`

```jsonc
{
  // ── IDENTITY (required) ──────────────────────────────────────
  "id": "string",
  // Format: {package-slug}_{versionTo}_{impactType-short}_{slug}
  // Example: "reanimated_4.0.0_breaking_babel-plugin-path"

  "package": "string",
  // Must match a key in registry.json

  "version_to": "string | 'current'",
  // The version where this change appears. Semver string.

  "date_released": "ISO-8601 date | null",
  // Null if not yet released (horizon entries)

  "impact_type": "ImpactType",
  // See taxonomy in Section 6

  "severity": "'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW'",

  // ── SCOPE (required at least one true) ──────────────────────
  "scope": {
    "code": false,       // must change .tsx/.ts source files
    "config": false,     // metro.config, babel.config, app.json, tsconfig
    "native": false,     // ios/ or android/ directory, podfile, gradle
    "build": false,      // EAS, Fastlane, CI/CD pipeline
    "peer_dep": false,   // package.json peer dependency version
    "runtime": false     // only visible at runtime, not compile time
  },

  // ── CONTEXT (strongly recommended) ──────────────────────────
  "version_from": "string | null",
  // Null means "any version before version_to"

  "api_pattern_before": "string | null",
  // The code pattern that was correct before this version.
  // This is what an agent trained before this date might generate.

  "api_pattern_after": "string | null",
  // The correct pattern from this version onwards.

  // ── WORKFLOW CONTEXT ─────────────────────────────────────────
  "affects_expo_managed": true,
  "affects_bare_workflow": true,
  "new_arch_required": false,
  // Was new architecture required for this change to apply?

  // ── CASCADE ──────────────────────────────────────────────────
  "cascade_deps": [],
  // npm package names that break when this package has this change.
  // This is what builds the CASCADES_TO edges in the graph.

  // ── WORKAROUND CHAIN ─────────────────────────────────────────
  "workaround_exists": false,
  "workaround_code": null,
  "workaround_works_until": null,
  // Version when the workaround stops working (or the fix landed)
  "fixed_in_version": null,
  "fixed_date": null,

  // ── EVIDENCE ─────────────────────────────────────────────────
  "changelog_url": "string | null",
  "github_issue_url": "string | null",
  "github_pr_url": "string | null",
  "migration_guide_url": "string | null",
  "community_thread_urls": [],
  // Reddit, Discord, StackOverflow, GitHub Discussions

  // ── EPISTEMICS ───────────────────────────────────────────────
  "agent_confidence": "'HIGH' | 'MEDIUM' | 'LOW'",
  // HIGH   = from official changelog or migration guide
  // MEDIUM = from GitHub issue or PR discussion
  // LOW    = from community thread, Reddit, Discord only

  "needs_verification": false,
  // Flag for human review

  "last_verified": "ISO-8601 date | null",
  "captured_by": "'human' | 'agent'",
  "captured_date": "ISO-8601 date"
}
```

### Impact Type Taxonomy (canonical, extensible)

```
BREAKING_API_CHANGE       API surface changed — code must change to compile
SILENT_BEHAVIORAL_BREAK   Same API, different behavior — most dangerous
DEPRECATION_WARNING       Works now, officially deprecated
REMOVAL                   Was deprecated, now gone entirely
PEER_DEP_BREAK            Version constraint on a peer dep changed
SETUP_CHANGE              Install, config, provider, babel, native setup changed
TYPE_SYSTEM_CHANGE        TypeScript types changed (compiles differently)
BUILD_PIPELINE_CHANGE     Metro, Babel, EAS, Codegen configuration changed
NATIVE_LAYER_CHANGE       Requires pod install / gradle sync to take effect
NEW_CAPABILITY            New API or feature available (positive signal)
PERFORMANCE_CHANGE        Same API, measurably different performance profile
WORKAROUND                Community-discovered fix for a known broken state
BUG_FIX                   Correct behavior restored after a regression
HORIZON_SIGNAL            Announced but not yet released (future signal)
```

**Adding new impact types**: If a type of change emerges that doesn't fit, add it here with a clear definition. The schema is versioned — new types are additive (non-breaking). Removing or renaming types requires a schema major version bump.

---

## PART SIX — THE SEEDING PROTOCOL

This is how you onboard any package — whether it's existed for 10 years or was published last week. Six deterministic steps. No guesswork.

### The Six-Step Protocol

```
STEP 1: REGISTER
  Add entry to registry.json with:
    - npm name, github, changelog URL
    - primary_role (use role assignment rules from Part 2)
    - vendor
    - audit_start_version (current major - 1, or full history if new)
    - audit_start_rationale (why this start point)
    - audit_status: "IN_PROGRESS"

STEP 2: CALIBRATE (set the start point)
  Apply the start-point decision tree:
  
  IF package has major < 2:
    → Start from v0.1 (full history — it's young enough)
  
  IF package has major ≥ 2:
    → Check: did the previous major have a defining architectural shift?
      YES → Start from that major's first release
      NO  → Start from (current major - 1).0.0
  
  IF package has "major-like minors" (breaking changes in a minor):
    → Note these explicitly in registry.json as major_like_minors[]

STEP 3: CHANGELOG ARCHAEOLOGY
  Sources to check in priority order:
  
  Priority 1 (official, highest confidence):
    - CHANGELOG.md in repo root
    - GitHub Releases page
    - Official migration guide (MIGRATION.md)
    - Maintainer blog post announcing the version
  
  Priority 2 (community-validated):
    - GitHub issues labeled "breaking-change", "migration", "v{N}"
    - GitHub Discussions tagged with version
    - Official Discord channels
  
  Priority 3 (signal triangulation):
    - Reddit r/reactnative search: "{package} {version}"
    - Stack Overflow: [react-native] {package} {version}
    - Twitter/X search: "{package} breaking" date-bounded
  
  For each entry found: create an entry file using the schema.
  Flag entries where api_pattern_before / api_pattern_after is unknown.

STEP 4: CASCADE MAPPING
  For each entry found: ask "which other packages break because of this?"
  
  Method:
    - Search: github.com/{package-that-might-break}/CHANGELOG.md for references to this package
    - Search: "after upgrading {breaking-package}" in that package's issues
    - Check: does this package appear in cascade_deps of other packages' entries?
  
  Add cascade_deps[] to every entry where downstream packages are affected.
  This builds the CASCADES_TO graph edges.

STEP 5: GENERATE GRAPH CONTRIBUTION
  Run generate-graph.ts with --package flag.
  This adds the new package's nodes, version nodes, and entry nodes
  to graph/INDEX.json without touching existing packages.

STEP 6: SYNTHESIZE AGENT VIEWS
  For each new entry with severity CRITICAL or HIGH:
    - Add entry to agent-views/DANGER-ZONES.md if api_pattern_before exists
    - Update agent-views/CURRENT-STATE.md for this package
    - Update agent-views/VERSION-MATRIX.md if peer dep changed
  
  For each new entry with impact_type NEW_CAPABILITY:
    - Add to agent-views/CURRENT-STATE.md capabilities section
  
  Update registry.json: audit_status → "COMPLETE", last_audited → today
```

### Time estimates per package tier

| Tier | Packages | Seeding Time |
|---|---|---|
| 0 (RUNTIME_SUBSTRATE) | 2–3 | 4–6 hours per package |
| 1 (FOUNDATIONAL) | 4–6 | 2–4 hours per package |
| 2 (INFRASTRUCTURE) | 6–10 | 1–2 hours per package |
| 3 (CAPABILITY) | 10–20 | 30–60 min per package |
| 4 (UTILITY) | 20+ | 15–30 min per package |

---

## PART SEVEN — THE GRAPH INDEX SCHEMA

The graph index is the machine-generated JSON that makes the whole system traversable without opening individual files. It is rebuilt from Layer 1 entries whenever an entry changes.

### Schema: `graph/INDEX.json`

```jsonc
{
  "meta": {
    "version": "1.0.0",
    "generated": "ISO-8601 timestamp",
    "entry_count": 247,
    "package_count": 34,
    "schema_version": "1.0.0"
  },

  "packages": {
    "react-native-reanimated": {
      "npm": "react-native-reanimated",
      "tier": 1,
      "tier_score": 0.71,
      "primary_role": "ANIMATION",
      "vendor": "software-mansion",
      "current_version": "4.6.0",
      "audit_start_version": "3.0.0",
      "audit_status": "COMPLETE",
      "last_audited": "2026-09-26",

      // Version index — each version that has entries
      "versions": {
        "3.0.0": { "date": "2023-02-27", "entry_count": 3, "has_breaking": true },
        "3.3.0": { "date": "2023-XX-XX", "entry_count": 1, "has_breaking": true, "major_like": true },
        "4.0.0": { "date": "2025-07-XX", "entry_count": 5, "has_breaking": true },
        "4.6.0": { "date": "2026-XX-XX", "entry_count": 1, "has_breaking": false }
      },

      // Entry index — all entries for this package
      "entries": [
        {
          "id": "reanimated_4.0.0_setup_babel-plugin-rename",
          "file": "entries/react-native-reanimated/reanimated-v4-babel-plugin-rename.md",
          "version_to": "4.0.0",
          "impact_type": "SETUP_CHANGE",
          "severity": "HIGH",
          "scope": ["config"],
          "api_pattern_before": "require('react-native-reanimated/plugin')",
          "api_pattern_after": "require('react-native-worklets/plugin')",
          "cascade_deps": ["react-native-worklets"],
          "date": "2025-07-XX"
        }
      ],

      // Relationship edges
      "cascades_to": ["@gorhom/bottom-sheet", "react-native-reanimated-carousel"],
      "requires_peers": {
        "react-native-worklets": ">=0.10.0"
      },
      "composes_with": ["react-native-gesture-handler", "react-native-skia"],
      "conflicts_with": [],
      "superseded_by": null,
      "supersedes": null
    }
  },

  // Traversal indexes — these enable O(1) queries without scanning all packages

  "by_role": {
    "ANIMATION": ["react-native-reanimated", "lottie-react-native"],
    "NAVIGATION": ["expo-router", "react-navigation"],
    "GESTURE": ["react-native-gesture-handler"],
    "STORAGE": ["react-native-mmkv", "op-sqlite", "@react-native-async-storage"],
    "NATIVE_BRIDGE": ["react-native-nitro-modules", "expo-modules-core"],
    "STYLING": ["nativewind", "react-native-css"],
    "UI_PRIMITIVES": ["react-native-screens", "react-native-safe-area-context"],
    "UI_COMPONENTS": ["@shopify/flash-list", "@shopify/react-native-skia"],
    "STATE": ["zustand", "xstate"],
    "PLATFORM_SERVICES": ["expo-camera", "expo-location"],
    "OBSERVABILITY": ["@sentry/react-native", "posthog-react-native"],
    "RUNTIME_SUBSTRATE": ["react-native", "hermes", "metro"]
  },

  "by_impact_type": {
    "BREAKING_API_CHANGE": [
      { "package": "react-native-mmkv", "entry_id": "mmkv_4.0.0_breaking_factory-fn", "severity": "HIGH" }
    ],
    "SILENT_BEHAVIORAL_BREAK": [
      { "package": "expo-router", "entry_id": "er_4.0.0_silent_navigate-always-push", "severity": "CRITICAL" }
    ],
    "DEPRECATION_WARNING": [],
    "REMOVAL": []
  },

  "by_severity": {
    "CRITICAL": [],
    "HIGH": [],
    "MEDIUM": [],
    "LOW": []
  },

  "by_vendor": {
    "software-mansion": ["react-native-reanimated", "react-native-gesture-handler"],
    "expo": ["expo", "expo-router", "expo-modules-core"],
    "meta": ["react-native"],
    "mrousavy": ["react-native-mmkv", "react-native-nitro-modules"],
    "callstack": [],
    "shopify": ["@shopify/flash-list", "@shopify/react-native-skia"],
    "independent": []
  },

  // Timeline index — entries organized by date
  "timeline": [
    {
      "date": "2023-02-27",
      "entries": [
        { "package": "react-native-reanimated", "entry_id": "...", "severity": "HIGH" }
      ]
    }
  ],

  // Cascade map — for any package, what breaks downstream
  "cascade_map": {
    "react-native-reanimated": {
      "direct": ["@gorhom/bottom-sheet", "react-native-reanimated-carousel"],
      "transitive": []
    },
    "react-native-gesture-handler": {
      "direct": ["react-native-reanimated", "react-navigation"],
      "transitive": ["@gorhom/bottom-sheet"]
    }
  },

  // Version compatibility matrix — blessed combinations
  "compat_matrix": {
    "entries": [
      {
        "label": "RN 0.86 / Expo SDK 57 — current (Sep 2026)",
        "runtime": { "react-native": "0.86.x", "react": "19.2.x", "expo": "57.x" },
        "navigation": { "expo-router": "~57.0.x" },
        "animation": { "react-native-reanimated": "4.x", "react-native-worklets": "0.12.x" },
        "gesture": { "react-native-gesture-handler": "3.x" },
        "storage": { "react-native-mmkv": "4.x", "react-native-nitro-modules": "0.37.x" },
        "status": "VERIFIED"
      }
    ]
  }
}
```

---

## PART EIGHT — AGENT-VIEW GENERATION PROTOCOL

The three agent-view files are not written once and forgotten. They have a defined update protocol.

### `CURRENT-STATE.md` — update trigger and format

**Trigger**: Any entry with `impact_type = BREAKING_API_CHANGE | REMOVAL | NEW_CAPABILITY` added.

**Format per package**:
```markdown
## {package} @ {current_version}

**Role**: {primary_role}  
**Tier**: {tier}  
**Audit coverage**: {audit_start_version} → {current_version}  
**Last audited**: {date}  

### Current Correct Patterns

{api_pattern_after from each HIGH/CRITICAL entry, newest first}

### What's New Since Previous Major

{NEW_CAPABILITY entries for current major}

### Peer Dep Requirements (current major)

{REQUIRES_PEERS from graph index}
```

### `DANGER-ZONES.md` — update trigger and format

**Trigger**: Any entry with `api_pattern_before != null` AND `severity = CRITICAL | HIGH`.

**Format per entry**:
```markdown
## {package} — {entry_id}

**Since**: v{version_to}  
**Severity**: {severity}  
**Type**: {impact_type}  

### ❌ DO NOT GENERATE THIS

```{code: api_pattern_before}```

### ✅ CORRECT PATTERN

```{code: api_pattern_after}```

**Why**: {one-line reason from entry description}  
**Source**: [{changelog_url}]
```

### `VERSION-MATRIX.md` — update trigger

**Trigger**: Any entry with `scope.peer_dep = true` OR a new compat_matrix entry added to INDEX.json.

### `MIGRATION-QUICK-REF.md` — update trigger

**Trigger**: Any entry where `api_pattern_before` AND `api_pattern_after` are both non-null.
Auto-append in format: `{api_pattern_before}` → `{api_pattern_after}` ({package} v{version_to})

---

## PART NINE — THE HORIZON SYSTEM (future packages)

The system tracks packages that don't exist yet. This is what makes it genuinely future-proof.

### Horizon Entry Types

```
HORIZON_CANDIDATE   — Announced but not released
HORIZON_PATTERN     — A code pattern that will likely need a package solution
HORIZON_MIGRATION   — A package that will likely be replaced by something better
```

### Example: tracking the future

```jsonc
// In registry.json
"expo-ml": {
  "npm": "expo-ml",
  "display": "Expo ML (hypothetical)",
  "github": null,
  "primary_role": "PLATFORM_SERVICES",
  "secondary_role": "NATIVE_BRIDGE",
  "vendor": "expo",
  "audit_start_version": "0.1.0",
  "audit_status": "HORIZON",
  "horizon_type": "HORIZON_CANDIDATE",
  "horizon_signal": "Expo blog post: 'ML capabilities coming in SDK 59'",
  "horizon_signal_url": "https://expo.dev/blog/...",
  "horizon_signal_date": "2026-09-XX"
}
```

```markdown
// In entries/expo-ml/horizon-candidate.md
---
id: "expo-ml_horizon_candidate"
package: "expo-ml"
version_to: null
date_released: null
impact_type: "HORIZON_SIGNAL"
severity: "MEDIUM"
---

## Signal
Expo announced on-device ML capabilities targeting SDK 59.
Expected: TensorFlow Lite integration via Nitro Modules.

## What to Watch
- Will it wrap TensorFlow Lite directly or abstract it?
- Peer dep on react-native-nitro-modules expected
- Potential conflicts with any existing on-device ML packages

## Seeding Protocol Trigger
When first RC published: move audit_status from HORIZON → IN_PROGRESS.
Run full seeding protocol from v0.1.0.
```

### Pattern Tracking (before packages exist)

```markdown
// In entries/_patterns/rsc-in-rn-pattern.md
---
id: "_pattern_rsc-in-rn"
package: "_pattern"          // special: tracks a paradigm, not a package
version_to: null
impact_type: "HORIZON_SIGNAL"
severity: "HIGH"
---

## Pattern: React Server Components in React Native

As of 2026, RSC in RN is enabled via expo-router SDK 56+.
This pattern affects how data-fetching code is structured app-wide.

### What Agents Must Know
- `'use server'` directive for server-side functions
- `'use client'` only when state/effects/device APIs needed
- Default: server component for data-heavy or secure ops
- NOT compatible with: direct device API calls in server components

### Which Packages Implement This
- expo-router SDK 56+ (primary implementation)
- @expo/server (server runtime adapter)

### Agent Danger Zone
An agent trained pre-SDK-56 will generate client component patterns
for everything. Server components are now the default mental model.
```

---

## PART TEN — THE GENERATE-GRAPH SCRIPT DESIGN

```typescript
// graph/generate-graph.ts
// Reads all Layer 1 entry files, compiles INDEX.json

interface GraphGeneratorOptions {
  entriesDir: string       // path to entries/
  registryPath: string     // path to registry.json
  outputPath: string       // path to write INDEX.json
  packageFilter?: string   // optional: regenerate for one package only
  dryRun?: boolean         // validate without writing
}

// The pipeline:
// 1. Read registry.json → get all tracked packages
// 2. For each package: scan entries/{package}/*.md
// 3. Parse YAML frontmatter → extract all entry fields
// 4. Build PackageNode with all VersionNodes and EntryNodes
// 5. Build cascade edges from cascade_deps[] across all entries
// 6. Build traversal indexes (by_role, by_impact_type, by_severity, etc.)
// 7. Build timeline from date fields across all entries
// 8. Compute tier_score from cascade count + (estimated) surface area
// 9. Build compat_matrix from PEER_DEP_BREAK entries + known-good combinations
// 10. Write INDEX.json
// 11. Write MIGRATION-QUICK-REF.md from entries with api_pattern_before + after
// 12. Log: new entries added, entries changed, packages added

// Validation:
// - Every entry must reference a package in registry.json
// - cascade_deps must reference registered packages
// - id must be unique across all entries
// - version_to must be valid semver or "current"
```

---

## PART ELEVEN — SCALABILITY PROPERTIES

### The system handles 1 package or 1000 packages identically

| Property | How |
|---|---|
| **Queryable** | INDEX.json indexes by role, impact, severity, vendor, timeline, cascade |
| **Traversable** | 12 relationship types in graph enable any traversal direction |
| **Monotonic** | Entries are append-only. No entry is ever deleted. |
| **Self-describing** | registry.json contains audit status — any agent knows what's covered |
| **Composable** | Each package's entries are in their own directory — parallel seeding works |
| **Schema-versioned** | Both registry.json and entry.schema.json are versioned — breaking changes are explicit |
| **Future-safe** | HORIZON entries exist before packages do |

### What "future deps" means concretely

The ecosystem in 2026–2028 will likely produce:
- AI inference SDKs for on-device models (Nitro-powered, new role patterns)
- WebGPU / WGPU wrappers for native GPU access (`react-native-wgpu` emerging now)
- RSC-native data-fetching primitives (server-first patterns)
- New state primitives aligned with React Compiler
- Next-gen native module frameworks after Nitro

Every one of these:
1. Gets a role assignment (existing roles or a new role added to the taxonomy)
2. Gets a registry entry on first announcement
3. Gets a HORIZON entry immediately
4. Gets full seeding when first RC appears
5. Computes tier automatically from cascade relationships

The taxonomy is **open-closed**: closed for existing roles (stable), open for new roles (extensible via appending).

---

## PART TWELVE — THE MINIMAL FILE SET TO START (Phase 0)

Everything starts from these files. Nothing else is needed to be immediately useful.

```
changelog-intelligence/
│
├── registry.json                      ← The package ledger (Tier 0+1+2 packages seeded)
├── registry.schema.json               ← JSON Schema for registry.json
├── entry.schema.json                  ← JSON Schema for all entry files
├── CONTRIBUTING.md                    ← The seeding protocol (Parts 2, 3, 6 above)
│
├── entries/
│   └── .gitkeep                       ← empty, ready for Phase 1
│
├── graph/
│   ├── INDEX.json                     ← empty skeleton, ready for first generate
│   └── generate-graph.ts              ← the script (stub with full interface)
│
└── agent-views/
    ├── CURRENT-STATE.md               ← stub with first 5 packages
    ├── DANGER-ZONES.md                ← first 8 entries (highest ROI)
    ├── VERSION-MATRIX.md              ← compat table skeleton
    └── MIGRATION-QUICK-REF.md        ← empty, populated by generate-graph
```

This is a **running system from day one**. Even with 0 entries, `registry.json` gives you the tracked package list and roles. Even with 5 DANGER-ZONES entries, you prevent the most common agent errors. The system has value before it's complete.

---

## CALIBRATION EXAMPLE (gurudevi-mobile stack, Sep 2026)

The following is not the system — it's an example of what the system's agent-views would show for one specific project at one moment in time. The system is not this table. The system produces this table for any project.

| Package | Installed | Role | Tier | Seeding Priority | Agent Risk |
|---|---|---|---|---|---|
| react-native | 0.86.2 | RUNTIME_SUBSTRATE | 0 | P2 | MEDIUM (0.86 stable) |
| expo | ~57.0.24 | RUNTIME_SUBSTRATE | 0 | P2 | MEDIUM |
| expo-router | ~57.0.22 | NAVIGATION | 1 | **P1** | **CRITICAL** (SDK 56 import break) |
| react-native-reanimated | 4.6.0 | ANIMATION | 1 | **P1** | **CRITICAL** (v3→v4 patterns) |
| react-native-gesture-handler | 3.3.0 | GESTURE | 1 | **P1** | **HIGH** (v1/v2 API dead) |
| react-native-mmkv | 4.3.2 | STORAGE | 2 | P2 | **HIGH** (new MMKV() gone) |
| react-native-worklets | 0.12.2 | ANIMATION | 2 | P2 | **HIGH** (agents unaware it exists) |
| react-native-nitro-modules | 0.37.1 | NATIVE_BRIDGE | 2 | P3 | MEDIUM |
| nativewind | 5.0.0-rc.0 | STYLING | 2 | P2 | **HIGH** (v5 RC, v4 patterns wrong) |
| zod | 4.5.4 | STATE | 3 | P3 | MEDIUM (v3 types mostly ok) |
| @shopify/react-native-skia | 2.11.2 | UI_COMPONENTS | 3 | P4 | LOW |
| @shopify/flash-list | 2.0.2 | UI_COMPONENTS | 3 | P4 | LOW |
| @swmansion/bottom-sheet | ^0.14.1 | UI_COMPONENTS | 3 | P4 | LOW |
| zustand | ^5.0.15 | STATE | 3 | P5 | LOW |
| xstate | ^5.32.6 | STATE | 3 | P5 | LOW |

The system that produces this table works for **any project** with **any dep list**.
Register the packages, run the seeding protocol, generate the graph.

---

*Universal Architecture v1.0 — Protocol-first, package-agnostic, future-proof.*
*Saved to: rn-terrain/docs/architecture/ per docs-sop*
*This document defines the protocol. The registry.json defines the scope. Entries define the data.*
