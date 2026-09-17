# Badges & Metrics Specification

This document details the badge URLs and telemetry metrics for the **`@intuitui-labs/rn-terrain`** monorepo packages.

---

## 1. Shields.io Package Badges

### Core Engine (`@intuitui-labs/rn-terrain-core`)
- **Version**: `https://img.shields.io/npm/v/@intuitui-labs/rn-terrain-core?style=flat-square&color=blue`
- **License**: `https://img.shields.io/badge/license-MIT-green?style=flat-square`
- **TypeScript**: `https://img.shields.io/badge/TypeScript-7.0.2-blue?style=flat-square`
- **Test Engine**: `https://img.shields.io/badge/tests-Vitest%205-purple?style=flat-square`

### Terminal Radar CLI (`@intuitui-labs/rn-terrain-cli`)
- **Version**: `https://img.shields.io/npm/v/@intuitui-labs/rn-terrain-cli?style=flat-square&color=blue`
- **Executable**: `https://img.shields.io/badge/bin-rn--terrain-orange?style=flat-square`

### AI Agent MCP Server (`@intuitui-labs/rn-terrain-mcp`)
- **Version**: `https://img.shields.io/npm/v/@intuitui-labs/rn-terrain-mcp?style=flat-square&color=blue`
- **Protocol**: `https://img.shields.io/badge/MCP-Standard%20v1-green?style=flat-square`

---

## 2. Monorepo Quality Gate Status

| Package | TypeScript Floor | Test Engine | Subpath Exports | SideEffects |
| :--- | :--- | :--- | :--- | :--- |
| `rn-terrain-core` | `strict: true` | Vitest 5 (v8) | Granular (`./scoring`, `./types`, etc.) | `false` |
| `rn-terrain-cli` | `strict: true` | tsx / Vitest 5 | Root + bin | `false` |
| `rn-terrain-mcp` | `strict: true` | Vitest 5 | Root + bin | `false` |
| `openeval` | `strict: true` | Vitest 5 (v8) | Root + `./ingestion` | `false` |

