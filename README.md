# React Native Terrain (`rn-terrain`)

[![CI](https://github.com/intuitui-labs/rn-terrain/actions/workflows/ci.yml/badge.svg)](https://github.com/intuitui-labs/rn-terrain/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Vitest 5](https://img.shields.io/badge/tested%20with-Vitest%205-729B1B.svg?style=flat-square)](https://vitest.dev/)
[![pnpm 12](https://img.shields.io/badge/pnpm-12.4.2-orange.svg?style=flat-square)](https://pnpm.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> **The live intelligence, architectural safety, and vitality layer for the React Native ecosystem.**  
> Answers what to adopt, what is breaking on New Architecture, and whether packages are decaying.

---

## 📦 Packages in this Monorepo

All packages are authored in TypeScript with strict mode, full subpath exports, and tree-shaking support (`"sideEffects": false`).

| Package | Version | Description | Install |
| :--- | :--- | :--- | :--- |
| **[`@intuitui-labs/rn-terrain-core`](./packages/core)** | `0.1.0` | Vitality engine, telemetry algorithms, and database queries | `pnpm add @intuitui-labs/rn-terrain-core` |
| **[`@intuitui-labs/rn-terrain-cli`](./packages/cli)** | `0.1.0` | Terminal radar tool (`rn-terrain`, `rn-eval`) | `npx @intuitui-labs/rn-terrain-cli` |
| **[`@intuitui-labs/rn-terrain-mcp`](./packages/mcp)** | `0.1.0` | Model Context Protocol server for AI coding agents | `npx @intuitui-labs/rn-terrain-mcp` |
| **[`@intuitui-labs/openeval`](./packages/openeval-core)** | `0.1.0` | Evaluation engine for developer ecosystems | `pnpm add @intuitui-labs/openeval` |
| **[`@intuitui-labs/rn-terrain-vscode`](./packages/vscode)** | `0.1.0` | VS Code extension providing in-editor vitality badges | VS Code Marketplace |
| **[`github-atlas`](./apps/github-atlas)** | `0.1.0` | Next.js 16 live explorer web application | Internal app |

---

## 🚀 Quickstart

### Using the CLI
Run package checks directly without installing:
```bash
# Evaluate package vitality
npx @intuitui-labs/rn-terrain-cli react-native-reanimated

# Scan project dependencies
npx @intuitui-labs/rn-terrain-cli scan

# Check React Native 1.0 / New Arch readiness
npx @intuitui-labs/rn-terrain-cli v1-check
```

### Tree-Shakable Subpath Usage in TypeScript
```typescript
import { calculateVitalityScore } from '@intuitui-labs/rn-terrain-core/scoring';
import { evaluateOffers } from '@intuitui-labs/openeval';
```

---

## 🛠️ Development & Quality Gates

This monorepo is powered by **pnpm 12.4.2** and **Vitest 5**:

```bash
# Install workspace dependencies via pnpm catalogs
pnpm install

# Run strict TypeScript verification across all packages
pnpm run check-types

# Run test suites with v8 coverage
pnpm run test:coverage

# Compile production distributions (zero emit errors)
pnpm run build
```

---

## 📚 Documentation
- [Publishing Runbook (`docs/publishing.md`)](./docs/publishing.md)
- [Testing Architecture & G0/G1 Claims (`docs/testing.md`)](./docs/testing.md)
- [Badges & Metrics Specification (`docs/badges-and-metrics.md`)](./docs/badges-and-metrics.md)
- [Architecture Blueprint v2 (`docs/architecture/rn-terrain-blueprint-v2.md`)](./docs/architecture/rn-terrain-blueprint-v2.md)

---

## 📄 License
MIT © Intuitui Labs & Neev Foundation.

