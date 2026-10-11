# React Native Terrain (`rn-terrain`)

[![CI](https://github.com/intuitui-labs/rn-terrain/actions/workflows/ci.yml/badge.svg)](https://github.com/intuitui-labs/rn-terrain/actions/workflows/ci.yml)
[![Version](https://img.shields.io/npm/v/@intuitui-labs/rn-terrain.svg?style=flat-square)](https://www.npmjs.com/package/@intuitui-labs/rn-terrain)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Vitest 5](https://img.shields.io/badge/tested%20with-Vitest%205-729B1B.svg?style=flat-square)](https://vitest.dev/)
[![pnpm 12](https://img.shields.io/badge/pnpm-12.11.2-orange.svg?style=flat-square)](https://pnpm.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> **The live intelligence, architectural safety, and vitality layer for the React Native ecosystem.**  
> Answers what to adopt, what is breaking on New Architecture, grounds AI coding agents on modern APIs (blocking legacy Major-N hallucinations), audits native surfaces against peer ABI collisions, and scores sovereign Rust developer tooling.

---

## 🌟 Flagship Package: `@intuitui-labs/rn-terrain`

All capabilities are consolidated into a single zero-dependency, tree-shakable flagship package **`@intuitui-labs/rn-terrain`** (v`0.4.0`):

```bash
# Install the flagship package
pnpm add @intuitui-labs/rn-terrain
```

### 📦 Monorepo Workspace Structure

| Package | Version | Role | Description |
| :--- | :--- | :--- | :--- |
| **[`@intuitui-labs/rn-terrain`](./packages/rn-terrain)** | `0.4.0` | **Flagship (All-in-One)** | Consolidated dual-binary CLI (`rn-terrain`, `rn-terrain-mcp`) and tree-shakable subpaths (`/doctor`, `/scanner`, `/openeval`, `/mcp`, `/cli`) |
| **[`@intuitui-labs/rn-terrain-core`](./packages/core)** | `0.4.0` | Substrate Core | SQLite database, canonical catalogs, capability resolver, affordance engine |
| **[`@intuitui-labs/rn-terrain-scanner`](./packages/scanner)** | `0.4.0` | Analysis Substrate | Tree-sitter polyglot engine (`@ast-grep/napi`), Generalized Native Surface Doctor, Agent Guardrail |
| **[`@intuitui-labs/openeval`](./packages/openeval-core)** | `0.4.0` | Evaluation Engine | Deconstructible 6-dimension evaluation framework & weight profiles |
| **[`@intuitui-labs/rn-terrain-cli`](./packages/cli)** | `0.4.0` | Compatibility Facade | Backwards-compatibility forwarding wrapper to `@intuitui-labs/rn-terrain/cli` |
| **[`@intuitui-labs/rn-terrain-mcp`](./packages/mcp)** | `0.4.0` | Compatibility Facade | Backwards-compatibility forwarding wrapper to `@intuitui-labs/rn-terrain/mcp` |
| **[`@intuitui-labs/rn-terrain-vscode`](./packages/vscode)** | `0.4.0` | IDE Extension | VS Code extension providing in-editor vitality badges |
| **[`github-atlas`](./apps/github-atlas)** | `0.4.0` | Web Application | Next.js 16 live ecosystem visualizer |

---

## 🚀 Quickstart

### 1. Terminal CLI Commands
Run commands directly via `npx` with zero installation:

```bash
# 🩺 Unified Multi-Diagnostic: Runs Native Doctor, Expo SDK, and Rust Tooling in one pass
npx @intuitui-labs/rn-terrain doctor:all .

# 🛡️ Generalized Dependency Doctor: Audits compiled native surfaces, peer ABI matrix & local shape
npx @intuitui-labs/rn-terrain doctor:deps .

# 🧭 Pre-flight Agent Compass: Ground modern APIs before coding (e.g. Reanimated v4 vs v2)
npx @intuitui-labs/rn-terrain compass react-native-reanimated

# 🦀 Rust Tooling Doctor: Audit sovereign shiny tools (rg, fd, bat, oxlint, biome)
npx @intuitui-labs/rn-terrain doctor

# 🩺 React Doctor Companion: Component-level hook, a11y, and web render checks
npx @intuitui-labs/rn-terrain doctor:react

# 🔍 Ground directly on physical node_modules (.d.ts symbols and README snippets)
npx @intuitui-labs/rn-terrain affordance react-native-reanimated

# 🎯 Granular Capability Resolver: Find grounded packages for specific primitives
npx @intuitui-labs/rn-terrain capability:resolve gesture.pan_recognition

# 📊 6-Dimension OpenEval: Deconstructible score with verifiable rationale
npx @intuitui-labs/rn-terrain openeval react-native-reanimated

# ⚡ Scan project dependencies and React Native 1.0 readiness
npx @intuitui-labs/rn-terrain scan
npx @intuitui-labs/rn-terrain v1-check
```

### 2. For AI Coding Agents (Claude Desktop, Cursor, Antigravity)
Add `@intuitui-labs/rn-terrain` to your MCP configuration (`claude_desktop_config.json` or agent settings):

```json
{
  "mcpServers": {
    "rn-terrain": {
      "command": "npx",
      "args": ["-y", "@intuitui-labs/rn-terrain", "mcp"]
    }
  }
}
```

Or run the dedicated MCP binary alias:

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

The MCP server exposes:
- **Tools**: `tcdi_compass`, `tcdi_doctor_all`, `tcdi_doctor_deps`, `tcdi_doctor_stack`, `tcdi_doctor_rust_tools`, `tcdi_doctor_expo`, `tcdi_resolve_capability`, `tcdi_inspect_capabilities`, `tcdi_affordance`, `tcdi_agent_views`, `tcdi_mcp_compass`.
- **Resources**: `terrain://agent-views/danger-zones`, `terrain://agent-views/current-state`, `terrain://radar/records`.
- **Prompts**: `preflight_grounding`, `migration_pathfinder`, `doctor_elevate`.

### 3. Tree-Shakable Subpath Usage in TypeScript
Import directly without loading unnecessary modules:

```typescript
// 1. Diagnostic Suite
import { TcdiDependencyDoctor, detectNativeSurface } from '@intuitui-labs/rn-terrain/doctor';

// 2. Tree-sitter Polyglot & AST Scanner
import { scan, AgentGuardrail, TreeSitterCodeMatcher } from '@intuitui-labs/rn-terrain/scanner';

// 3. 6-Dimension Evaluation Framework
import { evaluatePackage, WEIGHT_PROFILES } from '@intuitui-labs/rn-terrain/openeval';

// 4. Core Substrate APIs
import { generateAgentCompass, CapabilityResolver, CanonicalDatabase } from '@intuitui-labs/rn-terrain';
```

---

## ⚙️ Local Shape & Repository Configuration

RN-Terrain automatically generalizes native surface detection (`codegenConfig`, `ios/*.podspec`, `android/build.gradle`, JNI/C++) without requiring hardcoded package names.

You can configure your repository's local policy shape via `.terrainrc` or `terrain.config.json`:

```json
{
  "preset": "standard",
  "aliases": {
    "@enterprise/reanimated-fork": "react-native-reanimated"
  },
  "localPins": {
    "@enterprise/security-native": {
      "exact": "2.1.0",
      "reason": "Internal native biometrics container"
    }
  },
  "rules": {
    "disallowFloatingNativeRanges": true
  }
}
```

Read the full concept guide: **[`docs/concepts/terrain-configuration-and-local-shape.md`](./docs/concepts/terrain-configuration-and-local-shape.md)**.

---

## 🛠️ Development & Quality Gates

This monorepo is powered by **pnpm 12.11.2** and **Vitest 5**:

```bash
# Install workspace dependencies via pnpm catalogs
pnpm install

# Run strict TypeScript verification across all packages
pnpm run check-types

# Run test suites (54 tests across 18 test suites)
pnpm test

# Compile production distributions (zero emit errors)
pnpm run build
```

---

## 📚 Documentation
- [Terrain Configuration & Local Shape (`docs/concepts/terrain-configuration-and-local-shape.md`)](./docs/concepts/terrain-configuration-and-local-shape.md)
- [Publishing Runbook (`docs/publishing.md`)](./docs/publishing.md)
- [Testing Architecture & G0/G1 Claims (`docs/testing.md`)](./docs/testing.md)
- [Badges & Metrics Specification (`docs/badges-and-metrics.md`)](./docs/badges-and-metrics.md)
- [Architecture Blueprint v2 (`docs/architecture/rn-terrain-blueprint-v2.md`)](./docs/architecture/rn-terrain-blueprint-v2.md)

---

## 📄 License
MIT © Intuitui Labs & Neev Foundation.
