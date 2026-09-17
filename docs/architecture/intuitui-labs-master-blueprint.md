---
title: "Intuitui Labs Ecosystem Master Architecture Blueprint"
status: "active"
created: 2026-09-17
updated: 2026-09-17
author: "Naveen"
scribe: "Antigravity"
tags: [architecture, ecosystem, blueprint, intuitui-labs]
---

# Intuitui Labs Ecosystem: Master Architecture Blueprint

This document represents the consolidated, permanent reference for all packages, web applications, and documentation standards in the **Intuitui Labs** ecosystem.

---

## 🏛️ The Architecture of Intuitui Labs

```
                               ┌──────────────────────────────────────────────┐
                               │                 INTUITUI LABS                │
                               │          "Brevity, Clarity, Levity"          │
                               │          Flagship: intuitui-web              │
                               └──────────────────────┬───────────────────────┘
                                                      │
         ┌─────────────────────────┬──────────────────┴───────────────┬─────────────────────────┐
         │                         │                                  │                         │
         ▼                         ▼                                  ▼                         ▼
┌──────────────────┐      ┌──────────────────┐              ┌──────────────────┐      ┌──────────────────┐
│   React Native   │      │    Evaluation    │              │  UI Foundations  │      │   Datasets &     │
│    Intelligence  │      │     Platform     │              │   & Publishing   │      │     Engines      │
├──────────────────┤      ├──────────────────┤              ├──────────────────┤      ├──────────────────┤
│ rn-terrain-core  │      │ @intuitui-labs/  │              │ @intuitui-labs/  │      │ @intuitui-labs/  │
│ rn-terrain-cli   │      │ openeval         │              │ a11y-gate        │      │ form-builder     │
│ rn-terrain-mcp   │      │                  │              │ @intuitui-labs/  │      │ @intuitui-labs/  │
│ rn-terrain-vscode│      │                  │              │ editorial        │      │ lk-edu-geo       │
│                  │      │                  │              │ @intuitui-labs/  │      │                  │
│                  │      │                  │              │ trube-art        │      │                  │
└──────────────────┘      └──────────────────┘              └──────────────────┘      └──────────────────┘
```

---

## 🌐 1. The Flagship Portal: `intuitui-web`
- **Location**: `C:\projects\intuitui-web`
- **Tech Stack**: Astro 7, Svelte 5, Tailwind 4, Vitest 5.
- **Role**: The public face of Intuitui Labs, hosting the interactive `/a11y` lab, philosophy essays, and package documentation.
- **Core Governance Documents** (in `intuitui-web/docs/`):
  - **`Core/intuitui-labs.md`**: Mission manifesto and vision.
  - **`Core/intuitui-brand-foundation.md`**: Brand personality, visual mark, and communication voice.
  - **`architecture/accessibility-gates.md`**: Quantitative mathematical gate definitions (APCA 0.98G, WCAG 2.2 AAA).
  - **`architecture/vitest-v5-capabilities-sop.md`**: 15 Vitest 5 performance standards (`fsModuleCache`, `sharedViteServer`).

---

## 📦 2. All 6 Standalone Packages in `c:\projects\packages`

Every package in `c:\projects\packages` has now been elevated to the **`@intuitui-labs`** scope, configured with `"sideEffects": false`, subpath export maps, Vitest 5 test suites, and GitHub Actions with npm provenance:

| Package | Version | Directory | Subpath Exports | Core Role |
| :--- | :--- | :--- | :--- | :--- |
| **`@intuitui-labs/a11y-gate`** | `0.2.0` | `a11y-gate` | `.`, `./web`, `./mobile`, `./wcag3`, `./contrast`, `./cvd`, `./spatial`, `./motion`, `./audit`, `./tokens` | APCA 0.98G contrast, CVD cone simulation, fluid typography clamp, motion springs. |
| **`@intuitui-labs/editorial`** | `0.1.1` | `editorial` | `.`, `./schema`, `./controller`, `./cli`, `./provenance` | Provider-neutral headless publishing ledger, multi-format ingestion, distribution schemas. |
| **`@intuitui-labs/openeval`** | `0.1.0` | `openeval` | `.`, `./ingestion` | Standalone transparent evaluation and multi-attribute recommendation engine (*Conceptual Topology*). |
| **`@intuitui-labs/form-builder`** | `0.1.0` | `form-builder-engine` | `.`, `./core`, `./ports`, `./schema`, `./validation`, `./hydration`, `./analytics`, `./codegen` | Headless schema-driven form validation, hydration, and execution engine on TanStack Form + Zod. |
| **`@intuitui-labs/lk-edu-geo`** | `1.0.1` | `lk-edu-geo` | `.`, `./data/*` | Sri Lanka education zones, divisions, schools, districts, and GN divisions open dataset & validator. |
| **`@intuitui-labs/trube-art`** | `0.1.1` | `trube-art` | `.`, `./*` | Living light surfaces and generative shaders for React Native & Skia (Nitro modules). |

---

## 🚀 3. The React Native Terrain Monorepo (`rn-terrain`)
- **Location**: `C:\projects\rn-terrain`
- **Toolchain**: `pnpm@12.4.2` with centralized dependency catalogs.
- **Packages**:
  - **`@intuitui-labs/rn-terrain-core`**: Vitality engine, New Arch compatibility matrix, SQLite/Supabase queries.
  - **`@intuitui-labs/rn-terrain-cli`**: Terminal radar tool (`rn-terrain` / `rn-eval`, Chalk v6 ESM).
  - **`@intuitui-labs/rn-terrain-mcp`**: AI agent Model Context Protocol server.
  - **`@intuitui-labs/rn-terrain-vscode`**: In-editor `package.json` hover extension.
  - **`github-atlas`**: Web explorer dashboard (Next.js 16 Turbopack).

---

## 🔒 4. Universal Documentation Standard (Present in ALL Repos)

Every repository contains three standardized, verified runbooks:
1. **`docs/publishing.md`**: Preflight verification checklist (`check-types` ➔ `test:coverage` ➔ `build`), 2FA/TOTP handling, and GitHub Actions automated publish with **`--provenance`**.
2. **`docs/testing.md`**: Vitest 5 architecture (`fsModuleCache: true`, `sharedViteServer: true`), v8 coverage engine, and Test-Claim Protocol (G0 pure contracts, G1 boundaries).
3. **`docs/badges-and-metrics.md`**: Shields.io badge templates for npm releases, TypeScript 7.0.2, Vitest 5, and MIT license.
