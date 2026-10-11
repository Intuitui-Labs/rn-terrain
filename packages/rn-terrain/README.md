# @intuitui-labs/rn-terrain

[![CI](https://github.com/intuitui-labs/rn-terrain/actions/workflows/ci.yml/badge.svg)](https://github.com/intuitui-labs/rn-terrain/actions/workflows/ci.yml)
[![Version](https://img.shields.io/npm/v/@intuitui-labs/rn-terrain.svg?style=flat-square)](https://www.npmjs.com/package/@intuitui-labs/rn-terrain)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-blue.svg?style=flat-square)](https://www.typescriptlang.org/)
[![Vitest 5](https://img.shields.io/badge/tested%20with-Vitest%205-729B1B.svg?style=flat-square)](https://vitest.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> **The Unified Architectural Intelligence, Dependency Doctor, and Vitality Platform for React Native.**  
> Consolidates Core vitality engines, Tree-sitter AST scanning, Generalized Native Surface diagnosis, 6-Dimension OpenEval, and the Model Context Protocol (MCP) server into a single zero-dependency, tree-shakable package.

---

## ⚡ Why @intuitui-labs/rn-terrain?

Historically, React Native tooling required piecing together multiple disparate packages for manifest auditing, AST scanning, capability resolution, and agent integrations. **`@intuitui-labs/rn-terrain`** consolidates the entire platform into **one unified flagship package** with:

1. **Dual-Binary Entrypoints**:
   - `rn-terrain`: Full interactive CLI for developer diagnostics, migration paths, and tech radar.
   - `rn-terrain-mcp`: Production stdio Model Context Protocol (MCP) server for Claude Desktop, Cursor, and autonomous AI coding agents.
2. **Zero Bloat with Tree-Shakable Subpath Exports**:
   - `@intuitui-labs/rn-terrain`: Core database, capability resolver, affordance engine, and agent compass.
   - `@intuitui-labs/rn-terrain/doctor`: Generalized Dependency Doctor, Native Surface detector, and Rust Tooling Doctor.
   - `@intuitui-labs/rn-terrain/scanner`: Tree-sitter AST & polyglot matcher, Agent Guardrail.
   - `@intuitui-labs/rn-terrain/openeval`: Deconstructible 6-dimension evaluation framework and scoring profiles.
   - `@intuitui-labs/rn-terrain/mcp`: Programmatic MCP server constructor and stdio runner.
   - `@intuitui-labs/rn-terrain/cli`: Programmatic CAC CLI command runner.
3. **Generalized Native Surface Detection & Local Shape**:
   - Detects compiled native boundaries automatically via `codegenConfig`, `ios/*.podspec`, `android/build.gradle`, and C++ / JNI without hardcoding package names.
   - Allows projects and enterprises to declare their own **Local Shape** via `.terrainrc` or `terrain.config.json` with presets (`standard`, `expo`, `enterprise`, `loose`), custom aliases, pins, and custom rules.

---

## 🚀 Quickstart

### 1. Terminal CLI Usage via npx

Run without installing:

```bash
# 🩺 Unified multi-diagnostic check across entire project
npx @intuitui-labs/rn-terrain doctor:all .

# 🛡️ Audit native dependencies against floating ranges, ABI matrix & local pins
npx @intuitui-labs/rn-terrain doctor:deps .

# 🧭 Pre-flight Agent Compass: Ground modern APIs before coding (e.g. Reanimated v4 vs v2)
npx @intuitui-labs/rn-terrain compass react-native-reanimated

# 🦀 Rust Tooling Doctor: Audit high-performance developer tools (rg, fd, bat, oxlint)
npx @intuitui-labs/rn-terrain doctor

# 🎯 Granular Capability Resolver: Find grounded packages for specific primitives
npx @intuitui-labs/rn-terrain capability:resolve gesture.pan_recognition

# 🔍 Ground directly on physical node_modules (.d.ts symbols and README snippets)
npx @intuitui-labs/rn-terrain affordance react-native-reanimated

# 📊 6-Dimension OpenEval: Deconstructible score with verifiable rationale
npx @intuitui-labs/rn-terrain openeval react-native-reanimated
```

### 2. Connect to AI Coding Agents (MCP)

Add `@intuitui-labs/rn-terrain` directly to your MCP client configuration (`claude_desktop_config.json`, Cursor, Antigravity, or VS Code):

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

Or invoke the dedicated binary alias:

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

The MCP server provides:
- **Tools**: `tcdi_compass`, `tcdi_doctor_all`, `tcdi_doctor_deps`, `tcdi_doctor_stack`, `tcdi_doctor_rust_tools`, `tcdi_resolve_capability`, `tcdi_inspect_capabilities`, `tcdi_affordance`, `tcdi_agent_views`, `tcdi_mcp_compass`.
- **Resources**: `terrain://agent-views/danger-zones`, `terrain://agent-views/current-state`, `terrain://radar/records`.
- **Prompts**: `preflight_grounding`, `migration_pathfinder`, `doctor_elevate`.

---

## 🛠️ Programmatic Subpath Exports

Import only the modules you need for minimal bundle impact:

### Diagnostic Suite (`/doctor`)
```typescript
import {
  TcdiDependencyDoctor,
  detectNativeSurface,
  loadTerrainConfig,
  SACRED_NATIVE_PINS,
  RustToolingDoctor,
  ExpoDoctorBridge
} from '@intuitui-labs/rn-terrain/doctor';

const doctor = new TcdiDependencyDoctor({ configPath: process.cwd() });
const report = doctor.auditManifest('./package.json');
console.log('Manifest healthy:', report.isHealthy);
```

### AST & Code Scanner (`/scanner`)
```typescript
import {
  scan,
  AgentGuardrail,
  TreeSitterCodeMatcher
} from '@intuitui-labs/rn-terrain/scanner';

const matcher = new TreeSitterCodeMatcher();
const guardrail = new AgentGuardrail();
```

### 6-Dimension Evaluation Framework (`/openeval`)
```typescript
import {
  evaluatePackage,
  WEIGHT_PROFILES,
  DEFAULT_WEIGHTS
} from '@intuitui-labs/rn-terrain/openeval';

const evalResult = evaluatePackage('react-native-reanimated', '3.16.1', {
  profile: 'high_security'
});
console.log('Score:', evalResult.compositeScore);
```

### Core APIs (`@intuitui-labs/rn-terrain`)
```typescript
import {
  generateAgentCompass,
  NodeModulesAffordanceEngine,
  CapabilityResolver,
  CanonicalDatabase
} from '@intuitui-labs/rn-terrain';

const db = new CanonicalDatabase();
const resolver = new CapabilityResolver(db);
const cap = resolver.resolveCapability('animation.worklet_runtime');
```

---

## ⚙️ Configuration & Local Shape

Customize RN-Terrain for your repository by adding `.terrainrc`, `terrain.config.json`, or a `"terrain"` field in `package.json`:

```json
{
  "preset": "standard",
  "aliases": {
    "my-org-reanimated-fork": "react-native-reanimated",
    "@acme/skia-wrapper": "@shopify/react-native-skia"
  },
  "localPins": {
    "my-internal-native-sdk": {
      "exact": "2.4.1",
      "reason": "Internal C++ Turbomodule aligned with proprietary mobile shell"
    }
  },
  "rules": {
    "disallowFloatingNativeRanges": true,
    "requireNewArchitectureSupport": true
  },
  "ignore": ["react-native-flipper"]
}
```

### Available Presets
- `standard` (Default): Strict enforcement of exact pins on native modules with compiled bridges/JNI.
- `expo`: Optimized for Expo managed workflows; defers version alignment to `npx expo-doctor` and SDK manifests.
- `enterprise`: Maximum rigidity; enforces exact pins on all native modules and disallows wildcard/caret ranges.
- `loose`: Relaxed advisory mode for rapid prototyping and greenfield experiments.

---

## 🔄 Backwards Compatibility

Existing scripts and agent configurations using legacy package names continue to work transparently:
- `npx @intuitui-labs/rn-terrain-cli` -> Forwards directly to `@intuitui-labs/rn-terrain/cli`
- `npx @intuitui-labs/rn-terrain-mcp` -> Forwards directly to `@intuitui-labs/rn-terrain/mcp`

---

## 📄 License

MIT © [Intuitui Labs](https://github.com/intuitui-labs)
