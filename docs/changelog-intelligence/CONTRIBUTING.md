---
title: "Contributing to Changelog Intelligence"
status: "active"
created: 2026-09-26
updated: 2026-09-26
author: "Antigravity"
tags: [changelog-intelligence, contributing, protocol, seeding, tcdi, exhaustive-audit]
description: "Guidelines and protocol for adding packages, maintaining atomic feature shards, and executing exhaustive rolling changelog audits."
---

# Contributing to Changelog Intelligence

> **Layer A Knowledge Model Protocol**: This directory holds structured changelog intelligence across React Native ecosystem packages.
> **Required Reading**: [`docs/architecture/exhaustive-dependency-audit-specification.md`](../architecture/exhaustive-dependency-audit-specification.md) — The 4-dimension technical standard for deep audits.

---

## 📂 Architecture Layout

```
c:\projects\rn-terrain\docs\changelog-intelligence/
├── schemas/
│   ├── package-features.schema.json      # Atomic feature coordinate schema
│   └── entry.schema.json                 # Narrative deep-dive entry schema
├── data/
│   ├── packages/                         # Sharded package feature definitions (O(1) scale)
│   │   ├── react-native-reanimated.json
│   │   ├── expo-router.json
│   │   ├── react-native-gesture-handler.json
│   │   ├── react-native-mmkv.json
│   │   ├── react-native-worklets.json
│   │   └── nativewind.json
│   └── COMPACTED-TOMBSTONES.json         # Decayed legacy milestones
├── engine/
│   ├── project-kernel.mjs                # Dynamic 5-state sliding projection engine
│   └── scanner.mjs                       # Repository audit scanner
├── entries/                              # Curated deep-dive incident narratives
└── agent-views/                          # High-level agent synthesis
    ├── CAPABILITY-CATALOG.md             # The Opportunistic Lens (Bounties)
    ├── DANGER-ZONES.md                   # The Defensive Shield (Lethal Traps)
    └── PREFLIGHT-CONTEXT.md              # Compact prompt injection cards
```

---

## 📝 How to Add or Audit a Package (The Exhaustive Standard)

To prevent shallow audits, every contribution must follow the [Exhaustive Audit Specification](../architecture/exhaustive-dependency-audit-specification.md):

1. **Create/Update Package Shard**:
   - Location: `data/packages/<package-name>.json`
   - Must validate against `schemas/package-features.schema.json`.
   - Must identify **15 to 30 granular feature coordinates** covering:
     - Threading & Runtime (JSI, Mutexes, Memory).
     - Cross-Dependency Collisions (Gesture arbitration, route groups).
     - Silent Behavioral Breaks (Navigation semantics, animation cancellation).
     - The "Dev Dance" (Community workarounds, monkey-patches, and removal criteria).
2. **Define Dual-Lens Rules**:
   - For breaking changes: specify `banned_import`, `banned_call`, and `code_smell`.
   - For new capabilities: specify `replaces_custom_code` and `benefit`.
3. **Verify with Dynamic Projection**:
   ```bash
   node docs/changelog-intelligence/engine/project-kernel.mjs <package-name> <version>
   ```
4. **Run Live Repository Scan**:
   ```bash
   node docs/changelog-intelligence/engine/scanner.mjs
   ```
