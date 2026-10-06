---
title: "Temporal Convolutional Dependency Intelligence (TCDI)"
subtitle: "The Scalable, Zero-Bloat Universal Compatibility & Capability Engine for React Native"
status: "active"
created: 2026-09-26
updated: 2026-09-26
author: "Naveen"
scribe: "Antigravity"
tags: [architecture, dependency-intelligence, temporal-kernel, sliding-window, caniuse-for-rn, anti-bloat]
description: "Universal architecture inspired by MDN Browser Compatibility Data and sliding-window convolutional kernels to provide scalable, queryable dependency and capability intelligence without documentation rot or token bloat."
supersedes: null
related_docs:
  - "architecture/changelog-intelligence-universal-architecture.md"
  - "decisions/2026-09-26-changelog-intelligence-system-plan-v2.md"
---

# Temporal Convolutional Dependency Intelligence (TCDI)
## The Universal Compatibility & Capability Engine for the React Native Ecosystem

> **Executive Core**: How do you track breaking changes, deprecated APIs, transitional debt, and newly unlocked capabilities across **thousands of npm packages over a multi-year horizon** without collapsing under documentation maintenance rot or bloating AI agent context windows?
>
> **The Paradigm**: Treat dependency intelligence not as a static accumulator of changelog essays, but as **Atomic Feature Coordinates projected through a 5-State Sliding Temporal Kernel** (the "CanIUse / MDN Browser Compatibility Data" of the React Native ecosystem).

---

## 1. The Scaling Problem & The Failure of Accumulator Models

Most changelog or dependency audit systems fail at scale because they operate as **narrative accumulators**:

```
THE ACCUMULATOR TRAP (Why traditional docs collapse):
[2021 Releases] ──► [2022 Releases] ──► [2023 Releases] ──► [2024 Releases] ──► [2026 Releases]
       │                    │                    │                    │                   │
   500 files            800 files           1,200 files          1,800 files         2,500 files
   (95% obsolete)       (95% obsolete)       (95% obsolete)       (stale noise)       (unmaintained)
```

### The Three Critical Failure Modes at Scale:
1. **The Wikipedia Maintenance Trap**:
   - In a production ecosystem with 100+ dependencies, writing human or agent markdown essays for every release requires continuous manual upkeep. Within 6 months, documentation inevitably falls behind actual npm releases.
2. **Context Window Token Bloat**:
   - Dumping historical changelogs into an AI agent's prompt burns thousands of tokens on irrelevant past migrations (e.g. React Native 0.64 bridge migrations that no modern app cares about).
3. **The Regex Brittleness Fallacy**:
   - Hardcoding custom regex scanners against entire source trees creates high false-positive rates when encountering modern TypeScript AST indirection, wrappers, and Prettier formatting.

---

## 2. The Solution: The 6-State Sliding Operational Kernel

Inspired by Convolutional Neural Networks (where a fixed-aperture filter slides across time/space to extract local features without carrying the entire raw tensor in memory), TCDI models every package and feature within a **bounded 6-state operational aperture**:

```
◄─── REVERSE CHRONOLOGICAL STRIDE (PRESENT ➔ PAST) ────────────────────────────────────────────────────────────
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌─────────┐     ┌──────────────┐
│   REMOVED    │ ◄── │  DEPRECATED  │ ◄── │    BROKEN    │ ◄── │  FUNCTIONAL  │ ◄── │   NEW   │ ◄── │ EXPERIMENTAL │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘     └─────────┘     └──────────────┘
  [Tombstone]         [Grace Window]       [Defective]          [Current Gold]       [Adopt Now]       [Horizon]
 Dead in Target     Will break in next   Regressed / Crash     Verified Stable       Just landed      In beta / RFC
```

### Why `BROKEN` is the Operational Game-Changer
Browser engines (MDN / CanIUse) only track theoretical capability (`supported`, `deprecated`, `removed`) because browsers rarely ship broken syntax to production. In the React Native dependency ecosystem, releases routinely ship where an API is officially supported in the docs, but **completely broken in production** (e.g., C++ `SIGSEGV` in `handleRawEvent` during rapid unmount, odd-length SVG crashes on Android Canvas, or 120Hz commit latch freezes).

Every time an API enters `BROKEN`:
1. It immediately binds to an active **Dev Dance** entry (the monkey-patch, `patch-package`, or debounce shim required to survive).
2. It generates a **Code Smell signature** (detects who is using the defective API without the workaround).
3. When an upstream patch resolves it, `BROKEN` $\longrightarrow$ `FUNCTIONAL`, and the Dev Dance enters **DECOMMISSIONED** status.

### Why Present-to-Past (Reverse Chronological) is the Foundational Analytical Vector
Walking backwards from the present day reveals far more than coming from past to present:
1. **Unmasking Active Scars**: When auditing a production codebase today, engineers see bizarre defensive wrappers, `transform: [...] as any` casts, and manual unmount timers. Moving backward peels the onion layer by layer, exposing the exact historical release where the bug occurred and verifying if the workaround is now toxic dead weight.
2. **Immediate Actionability**: An engineer or agent working on an app today needs to know what breaks *right now* in their installed version, not how developers migrated away from React Native 0.60 six years ago.
3. **Continuous Decommissioning**: Backward analysis directly identifies which community monkey-patches have expired and can be deleted immediately.

---

## 3. Dynamic Projection Engine: Zero Storage & Token Bloat

The fundamental breakthrough of TCDI is that **the sliding window is NOT a static file—it is a real-time mathematical projection function**:

$$\mathcal{P}(\text{Package}, V_{\text{target}}) \longrightarrow \text{Kernel}\big[ \text{REMOVED}, \text{DEPRECATED}, \text{BROKEN}, \text{FUNCTIONAL}, \text{NEW}, \text{EXPERIMENTAL} \big]$$

```
                                [INPUT QUERY]
              Package: "react-native-reanimated"  |  Target Version: "4.5.1"
                                      │
                                      ▼
                    ┌──────────────────────────────────┐
                    │   DYNAMIC PROJECTION ENGINE      │
                    │   Evaluates atomic feature       │
                    │   inflection points in O(1)      │
                    └──────────────────────────────────┘
                                      │
                                      ▼
                        [COMPACT PROJECTION OUTPUT]
  ┌────────────────────────────────────────────────────────────────────────┐
  │ REMOVED      │ PlainStyle internal export, Old Arch Bridge             │
  │ DEPRECATED   │ [None active in 4.5.1]                                  │
  │ BROKEN       │ Null InstanceHandle SIGSEGV, REANodesManager reparenting│
  │ FUNCTIONAL   │ react-native-worklets 0.12.x, FlashList recycling       │
  │ NEW          │ SharedTransitionBoundary, W3C-strict transform tuples   │
  │ EXPERIMENTAL │ Native CSS animation callbacks, contrastColor() worklet │
  └────────────────────────────────────────────────────────────────────────┘
```

### Why This Architecture Scales Infinitely:
- **Constant $O(1)$ Agent Prompt Cost**: Regardless of whether a package has 10 years of history, the projected context payload for an agent is always **under 60 tokens per package**.
- **Zero Redundancy**: Feature milestones are defined once. You never write duplicate entries across minors or patches.
- **Isolated Package Shards**: Each package is an independent JSON file in `data/packages/<name>.json`. Adding a package is $O(1)$ with zero merge conflicts.

---

## 4. Atomic Feature Coordinate Schema

Packages are merely namespace containers; real compatibility and architectural churn occurs at the **granular feature coordinate** level (`package:feature`).

### Canonical Shard Specification (`data/packages/<package-name>.json`)

```jsonc
{
  "$schema": "../../schemas/package-features.schema.json",
  "package": "react-native-reanimated",
  "vendor": "software-mansion",
  "category": "ANIMATION",
  "features": {
    "worklets_standalone_extraction": {
      "display": "Standalone react-native-worklets runtime & Babel plugin",
      "transition_milestones": {
        "experimental": null,
        "added": "4.0.0",
        "deprecated": null,
        "removed": null
      },
      "rules": {
        "banned_import": "react-native-reanimated/plugin",
        "required_import": "react-native-worklets/plugin",
        "required_peer": "react-native-worklets"
      },
      "code_smell": "plugins:.*react-native-reanimated/plugin"
    },
    "css_animation_callbacks": {
      "display": "Native CSS Animation & Transition Callbacks",
      "transition_milestones": {
        "experimental": "4.5.0",
        "added": "4.6.0",
        "deprecated": null,
        "removed": null
      },
      "rules": {
        "replaces_custom_code": "JavaScript setTimeout timers coordinating auto-hide / dismissal lifecycles",
        "benefit": "Flicker-free, native UI thread dismissal without JS timer drift"
      },
      "code_smell": "setTimeout\\(.*performHide"
    },
    "contrast_color_worklet": {
      "display": "Native contrastColor() WCAG calculation worklet",
      "transition_milestones": {
        "experimental": null,
        "added": "4.6.0",
        "deprecated": null,
        "removed": null
      },
      "rules": {
        "replaces_custom_code": "Custom sRGB luminance math and color helper packages",
        "benefit": "Zero-dependency, UI-thread accessible contrast evaluation"
      }
    },
    "plain_style_export": {
      "display": "Internal PlainStyle export",
      "transition_milestones": {
        "experimental": null,
        "added": "1.0.0",
        "deprecated": "4.4.0",
        "removed": "4.5.0"
      },
      "rules": {
        "banned_import": "PlainStyle",
        "replacement": "StyleProp<ViewStyle> or AnimatedStyle<ViewStyle>"
      }
    }
  }
}
```

---

## 5. The Dual-Lens Philosophy: Defensive Shield & Opportunistic Bounty

Most dependency systems only tell developers what is broken (**The Defensive Shield**). TCDI treats **The Opportunistic Bounty** as an equal first-class citizen:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       THE DUAL-LENS AUDIT SYSTEM                            │
├──────────────────────────────────────┬──────────────────────────────────────┤
│ 🛡️ THE DEFENSIVE SHIELD              │ 💎 THE OPPORTUNISTIC BOUNTY          │
│ "What will break if I write it?"     │ "What custom code can I delete?"     │
├──────────────────────────────────────┼──────────────────────────────────────┤
│ • Banned imports & dead constructors │ • Native primitives replacing JS     │
│ • Deprecated layout wrappers         │ • Built-in disk recovery strategies  │
│ • Removed bridge modules             │ • Native contrast & color worklets   │
│ • Fatal peer dependency mismatches   │ • Zero-overhead CSS custom tokens    │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

---

## 6. Real-World Consumption Modes

### Mode 1: On-Demand Package Query (CLI / Developer)
Any developer or script can query an arbitrary package at any target version without cloning or parsing the entire monorepo:
```bash
npx @rn-terrain/intel query react-native-mmkv --version 4.3.2
```
*Output*:
```
[react-native-mmkv @ 4.3.2]
  🚫 REMOVED:     new MMKV() -> use createMMKV()
  🚫 REMOVED:     storage.delete() -> use storage.remove()
  ⚠️ DEPRECATED:  storage.byteSize property access
  ✅ FUNCTIONAL:  createMMKV({ compareBeforeSet: true })
  💎 OPPORTUNITY: recoveryStrategy: 'recover-or-recreate' (Auto disk recovery)
  💎 OPPORTUNITY: checkContentChanged() (Reactive multi-process cache sync)
```

### Mode 2: Full Repository Dynamic Projection Audit
Evaluates an entire application's `package.json` against the codebase:
```bash
npx @rn-terrain/intel audit ./package.json --src ./src
```
- Reads every dependency and resolved version.
- Projects the 5-state kernel for each installed version.
- Executes targeted AST/pattern checks for only the active `REMOVED`, `DEPRECATED`, and `NEW` features of those exact versions.
- Generates an actionable 4-level audit report in under 5 seconds.

### Mode 3: Autonomous Agent Pre-flight Context Hook
When an AI agent is assigned a task touching specific dependencies, an IDE hook or MCP tool injects an ultra-compact context card:
```markdown
<!-- INJECTED AGENT CONTRACT: [expo-router: 57.0.22, reanimated: 4.6.0] -->
STRICT CONSTRAINTS:
- NEVER import from '@react-navigation/native'; use 'expo-router'.
- Reanimated Babel plugin is 'react-native-worklets/plugin', NEVER 'react-native-reanimated/plugin'.
- Avoid 'as any' on transform arrays; use strictly typed CSS transform tuples.
- Prefer onCSSTransitionEnd over JS setTimeout for auto-hide overlays.
```

---

## 7. Scalability & Longevity Comparison

| Dimension | Accumulator / Markdown Wikis | TCDI Architecture |
|---|---|---|
| **Data Structure** | Sprawling narrative markdown files | Sharded Atomic Feature JSON (`data/packages/*.json`) |
| **Token Cost per Query** | Thousands of tokens of raw history | **$\sim 50$ tokens** projected dynamically on the fly |
| **Maintenance Burden** | High (manual authoring of release notes) | Low (records only inflection points: added/deprecated/removed) |
| **Package Scalability** | Degrades after 15–20 packages | Scales cleanly to **10,000+ packages** (isolated shards) |
| **Time Scalability** | Obsolete notes accumulate indefinitely | Decays older versions into 1-line Compacted Tombstones |
| **Dual-Lens Support** | Only warns about breaks | Identifies **both** breaking traps and code-deletion bounties |

---

## 8. Directory Layout in `rn-terrain`

```
c:\projects\rn-terrain\docs\changelog-intelligence/
├── schemas/
│   ├── package-features.schema.json      # Schema for individual package shards
│   └── entry.schema.json                 # Schema for historical deep-dive entries
├── data/
│   ├── packages/                         # Sharded package feature definitions
│   │   ├── react-native-reanimated.json
│   │   ├── react-native-gesture-handler.json
│   │   ├── react-native-mmkv.json
│   │   ├── expo-router.json
│   │   ├── nativewind.json
│   │   └── react-native-worklets.json
│   └── COMPACTED-TOMBSTONES.json         # Decayed historical milestones (pre-New Arch)
├── engine/
│   ├── project-kernel.mjs                # Dynamic projection function P(package, version)
│   └── scanner.mjs                       # AST & pattern audit runner
└── agent-views/
    ├── CAPABILITY-CATALOG.md             # The Opportunistic Lens (Bounties)
    ├── DANGER-ZONES.md                   # The Defensive Shield (Lethal Traps)
    └── PREFLIGHT-CONTEXT.md              # Compact prompt injection cards
```

---

## Conclusion
TCDI transforms dependency management from a passive, rotting graveyard of past changelogs into an **active, lightweight, and queryable intelligence engine**. By combining atomic feature coordinates with dynamic sliding-window projections, it guarantees that developers and AI coding agents build modern, crash-free, and high-performance React Native applications at any scale.
