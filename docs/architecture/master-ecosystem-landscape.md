---
title: "Intuitui Labs Master Ecosystem Landscape & Package Topology"
status: "active"
created: 2026-09-17
updated: 2026-09-17
author: "Naveen"
scribe: "Antigravity"
tags: [landscape, packages, topology, intuitui-labs]
---

# Intuitui Labs Master Ecosystem Landscape & Package Topology

This document establishes the official taxonomy, repository locations, npm package scopes, and documentation standards across the **Intuitui Labs** ecosystem.

---

## 🏛️ The Four Strategic Pillars

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                       INTUITUI LABS ECOSYSTEM                                          │
├──────────────────────────┬─────────────────────────────┬───────────────────────────────┬───────────────┤
│ Pillar 1: RN Ecosystem   │ Pillar 2: Decision Engine   │ Pillar 3: Design & Publishing │ Pillar 4:     │
│ Intelligence             │ (OpenEval Platform)         │ Infrastructure                │ Applications  │
├──────────────────────────┼─────────────────────────────┼───────────────────────────────┼───────────────┤
│ • rn-terrain-core        │ • @intuitui-labs/openeval   │ • @intuitui-labs/a11y-gate    │ • github-atlas│
│ • rn-terrain-cli         │ • Pure decision math        │ • @intuitui-labs/editorial    │ • form-builder│
│ • rn-terrain-mcp         │ • Traceable provenance      │ • @intuitui-labs/trube-art    │ • lk-edu-geo  │
│ • rn-terrain-vscode      │ • Goal-weighted algorithms  │                               │               │
└──────────────────────────┴─────────────────────────────┴───────────────────────────────┴───────────────┘
```

---

## 📂 Pillar Breakdown & Local Storage Matrix

### Pillar 1: React Native Ecosystem Intelligence (`rn-terrain`)
- **Local Path**: `C:\projects\rn-terrain`
- **Repository**: Monorepo (`pnpm@12.4.2` with centralized catalogs)
- **Target GitHub**: `https://github.com/intuitui-labs/rn-terrain` (or `NeevSK/rn-terrain`)
- **Packages**:
  - **`@intuitui-labs/rn-terrain-core`** (`0.1.0`): Vitality algorithms, New Architecture compatibility matrix, Lindy longevity, and telemetry queries. Subpath exports: `.`, `./db`, `./queries`, `./radar`, `./scoring`, `./sync-daily`, `./types`.
  - **`@intuitui-labs/rn-terrain-cli`** (`0.1.0`): Terminal radar CLI tool (`rn-terrain` & `rn-eval` binaries, Chalk v6 ESM native).
  - **`@intuitui-labs/rn-terrain-mcp`** (`0.1.0`): Model Context Protocol server for AI coding agents (Claude, Cursor, Antigravity).
  - **`@intuitui-labs/rn-terrain-vscode`** (`0.1.0`): In-editor `package.json` hover extension.

---

### Pillar 2: OpenEval Platform (`openeval`) — *Now Standalone!*
- **Local Path**: `C:\projects\packages\openeval`
- **Repository**: **Standalone Dedicated Git Repository**
- **Target GitHub**: `https://github.com/intuitui-labs/openeval`
- **Identity**: Transparent, participatory evaluation, trade-off analysis, and recommendation framework. Grounded in *Conceptual Topology* (Neev, University of Moratuwa).
- **Package**: **`@intuitui-labs/openeval`** (`0.1.0`)
- **Exports**:
  - `.`: Decision and recommendation engine (`evaluateOffers`, `encodeShareState`, `decodeShareState`, user profile weighting).
  - `./ingestion`: Multi-source data ingestion pipelines (`collectSource`, `HttpSourceFetcher`, `FileSnapshotStore`, `FileChangeLog`).

---

### Pillar 3: Design Systems, Accessibility & Publishing
Dedicated, high-craft packages under `c:\projects\packages\`:

1. **`@intuitui-labs/a11y-gate`** (`C:\projects\packages\a11y-gate`):
   - **Capabilities**: APCA 0.98G lightness contrast, CVD cone matrix simulation, fluid typography clamp, motion ergonomics.
   - **Status**: Published on npm (`0.2.0`).

2. **`@intuitui-labs/editorial`** (`C:\projects\packages\editorial`):
   - **Capabilities**: Provider-neutral headless publishing ledger, multi-format ingestion (.md, .txt, .json), Git provenance.
   - **Status**: Published on npm (`0.1.1`).

3. **`@intuitui-labs/trube-art`** (`C:\projects\packages\trube-art`):
   - **Capabilities**: Living light surfaces and generative shaders for React Native & Skia (Nitro modules).

---

### Pillar 4: Domain Applications & Showcases
- **`github-atlas`** (`C:\projects\rn-terrain\apps\github-atlas`): Student Developer Pack decision explorer web app (Next.js 16 with Turbopack). Consumes `@intuitui-labs/openeval`.
- **`form-builder-engine`** (`C:\projects\packages\form-builder-engine`): Headless JSON-schema form runner.
- **`lk-edu-geo`** (`C:\projects\packages\lk-edu-geo`): Geospatial education boundary dataset.
