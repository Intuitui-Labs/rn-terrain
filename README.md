# React Native Terrain (`rn-terrain`)

[![CI](https://github.com/intuitui-labs/rn-terrain/actions/workflows/ci.yml/badge.svg)](https://github.com/intuitui-labs/rn-terrain/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Vitest 5](https://img.shields.io/badge/tested%20with-Vitest%205-729B1B.svg?style=flat-square)](https://vitest.dev/)
[![pnpm 12](https://img.shields.io/badge/pnpm-12.11.2-orange.svg?style=flat-square)](https://pnpm.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> **The live intelligence, architectural safety, and vitality layer for the React Native ecosystem.**  
> Answers what to adopt, what is breaking on New Architecture, grounds AI coding agents on modern APIs (blocking legacy Major-N hallucinations), and audits sovereign Rust tooling.

---

## 📦 Packages in this Monorepo

All packages are authored in TypeScript with strict mode, full subpath exports, and tree-shaking support (`"sideEffects": false`).

| Package | Version | Description | Install |
| :--- | :--- | :--- | :--- |
| **[`@intuitui-labs/rn-terrain-core`](./packages/core)** | `0.1.0` | Vitality engine, canonical SQLite schema, compass, affordance, and capability resolver | `pnpm add @intuitui-labs/rn-terrain-core` |
| **[`@intuitui-labs/rn-terrain-cli`](./packages/cli)** | `0.1.0` | Terminal radar & compass tool (`rn-terrain`, `rn-eval`) | `npx @intuitui-labs/rn-terrain-cli` |
| **[`@intuitui-labs/rn-terrain-mcp`](./packages/mcp)** | `0.1.0` | Model Context Protocol server for AI coding agents | `npx @intuitui-labs/rn-terrain-mcp` |
| **[`@intuitui-labs/rn-terrain-scanner`](./packages/scanner)** | `0.1.0` | Tree-sitter & AST diff pre-flight guardrail (`@ast-grep/napi`) | `pnpm add @intuitui-labs/rn-terrain-scanner` |
| **[`@intuitui-labs/openeval`](./packages/openeval-core)** | `0.1.0` | Deconstructible 6-dimension evaluation engine | `pnpm add @intuitui-labs/openeval` |
| **[`@intuitui-labs/rn-terrain-vscode`](./packages/vscode)** | `0.1.0` | VS Code extension providing in-editor vitality badges | VS Code Marketplace |
| **[`github-atlas`](./apps/github-atlas)** | `0.1.0` | Next.js 16 live explorer web application | Internal app |

---

## 🚀 Quickstart

### 1. Terminal CLI Commands
Run commands directly via `npx`:

```bash
# 🩺 TCDI React Native Stack Doctor: Dynamic New Arch & gesture audit parameterized by stack
npx @intuitui-labs/rn-terrain-cli doctor:stack --rn "^0.88.0" --arch new-arch

# 🦀 Rust Tooling Doctor: Audit sovereign shiny tools (rg, fd, sd, bat, eza, delta, oxlint, biome)
npx @intuitui-labs/rn-terrain-cli doctor

# 🩺 React Doctor Companion: Component-level hook, a11y, and web render checks
npx @intuitui-labs/rn-terrain-cli doctor:react

# 🧭 Pre-flight Agent Compass: Ground modern APIs before coding (e.g. Reanimated v4 vs v2)
npx @intuitui-labs/rn-terrain-cli compass react-native-reanimated

# 🔍 Ground directly on physical node_modules (.d.ts symbols and README snippets)
npx @intuitui-labs/rn-terrain-cli affordance react-native-reanimated

# 🎯 Granular Capability Resolver: Find grounded packages for specific primitives
npx @intuitui-labs/rn-terrain-cli capability:resolve gesture.pan_recognition

# 📊 6-Dimension OpenEval: Deconstructible score with verifiable rationale
npx @intuitui-labs/rn-terrain-cli openeval react-native-reanimated

# ⚡ Scan project dependencies and React Native 1.0 readiness
npx @intuitui-labs/rn-terrain-cli scan
npx @intuitui-labs/rn-terrain-cli v1-check
```

### 2. For AI Coding Agents (Claude Desktop, Cursor, Antigravity)
Add `@intuitui-labs/rn-terrain-mcp` to your MCP configuration (`claude_desktop_config.json` or agent settings):

```json
{
  "mcpServers": {
    "rn-terrain": {
      "command": "npx",
      "args": ["-y", "@intuitui-labs/rn-terrain-mcp"]
    }
  }
}
```

The MCP server provides **Tri-Capability Architecture (v1.30.1)**:
- **Tools**: `tcdi_compass`, `tcdi_affordance`, `tcdi_doctor_stack`, `tcdi_doctor_rust_tools`, `tcdi_agent_views`, `tcdi_mcp_compass`.
- **Resources**: `terrain://agent-views/danger-zones`, `terrain://agent-views/current-state`, `terrain://radar/records`.
- **Prompts**: `preflight_grounding`, `migration_pathfinder`, `doctor_elevate`.

### 3. Tree-Shakable Subpath Usage in TypeScript
```typescript
import { calculateVitalityScore } from '@intuitui-labs/rn-terrain-core/scoring';
import { NodeModulesAffordanceEngine } from '@intuitui-labs/rn-terrain-core';
import { evaluatePackage } from '@intuitui-labs/openeval';
```

---

## 🛠️ Development & Quality Gates

This monorepo is powered by **pnpm 12.11.2** and **Vitest 5**:

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

