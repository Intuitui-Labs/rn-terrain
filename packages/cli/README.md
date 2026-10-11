# @intuitui-labs/rn-terrain-cli

[![npm version](https://img.shields.io/npm/v/@intuitui-labs/rn-terrain-cli.svg?style=flat-square)](https://www.npmjs.com/package/@intuitui-labs/rn-terrain-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)

> **The definitive CLI toolchain for React Native architectural health, New Architecture compatibility, pre-flight AI agent grounding, and native dependency doctoring.**
>
> 💡 **Notice**: `@intuitui-labs/rn-terrain-cli` is now maintained as a backwards-compatible forwarding facade. All new features and unified binaries are published in the consolidated flagship package **[`@intuitui-labs/rn-terrain`](https://www.npmjs.com/package/@intuitui-labs/rn-terrain)** (`npx @intuitui-labs/rn-terrain`).

---

## ⚡ Quickstart

No permanent installation required—execute directly via `npx`:

```bash
# 🩺 Run the unified multi-diagnostic across your workspace
npx -y @intuitui-labs/rn-terrain-cli doctor:all .

# 🛡️ Audit native dependencies, floating ranges, and local pins
npx -y @intuitui-labs/rn-terrain-cli doctor:deps .

# 🧭 Pre-flight Agent Compass: Ground APIs before writing code
npx -y @intuitui-labs/rn-terrain-cli compass react-native-reanimated 3.16.0

# 🦀 Rust Tooling Doctor: Check high-performance developer tools
npx -y @intuitui-labs/rn-terrain-cli doctor
```

Alternatively, install globally or into your monorepo devDependencies:

```bash
pnpm add -D @intuitui-labs/rn-terrain-cli
# or
npm install -g @intuitui-labs/rn-terrain-cli
```

---

## 📋 Comprehensive Command Matrix

### 1. Diagnostic Suite (`doctor:*`)

| Command | Description | Key Options |
| :--- | :--- | :--- |
| `doctor:all [projectDir]` | **Unified Ecosystem Scorecard**: Combines Rust Tooling, Native Dependencies, Expo SDK, and New Architecture into a single executive score (0–100). | None |
| `doctor:deps [projectDir]` | **Generalized Dependency Doctor**: Inspects compiled native binary surfaces (`codegenConfig`, podspecs), flags hazardous floating ranges (`^`), checks peer ABI matrix, and enforces local pins. | `--preset <preset>`, `--config <path>` |
| `doctor:stack [targetPath]` | **TCDI Stack Doctor**: Tree-sitter AST scan auditing code against New Architecture hooks, Worklets, gesture handlers, and dialect drift. | `--rn <ver>`, `--arch <arch>`, `--reanimated <ver>` |
| `doctor:expo [projectDir]` | **Expo Doctor Bridge**: Inspects Expo SDK alignment, managed module compliance, and configuration drift. | None |
| `doctor` | **Rust Tooling Doctor**: Audits sovereign native tools (`rg`, `fd`, `sd`, `bat`, `oxlint`, `biome`) and provides taste-of-the-best nudges and install recipes. | None |
| `doctor:react [args...]` | **React Doctor Companion**: Bridges to React Doctor for component-level hook, accessibility (a11y), and web render checks. | Arbitrary pass-through flags |

### 2. Pre-Flight Agent Grounding (`compass`, `affordance`, `capability`)

| Command | Description | Key Options |
| :--- | :--- | :--- |
| `compass <pkg> [version]` | **Pre-flight Agent Compass**: Returns canonical modern APIs, forbidden severed APIs (with codemod hints), peer collisions, and an LLM grounding prompt. | `--json` |
| `affordance <pkg> [cwd]` | **Physical Node Affordance**: Inspects actual installed TypeScript definitions (`.d.ts`), exports, and code graphs in `node_modules`. | None |
| `capability:resolve <id>` | **Capability Resolver**: Resolves an architectural capability (e.g. `gesture.pan_recognition`, `storage.fast_kv`) to recommended packages and introduced versions. | None |
| `capability:inspect <pkg>` | **Capability Inspector**: Inspects all granular capabilities unlocked by a package and version. | None |
| `capability:list` | **Capability Registry**: Lists all supported mobile, monorepo, and agent capabilities. | None |

### 3. Evaluation & Migration Pathfinder (`openeval`, `jump`, `gate`)

| Command | Description | Key Options |
| :--- | :--- | :--- |
| `openeval <pkg> [version]` | **6-Dimension OpenEval**: Evaluates a library across Architecture, Grounding, Hygiene, Velocity, Dialect, and Footprint with deconstructed scores. | `--profile <default\|strict_new_arch\|enterprise>`, `--json` |
| `jump <pkg> <from> <to>` | **Migration Pathfinder**: Calculates breaking API delta, severed symbols, and step-by-step upgrade plan between two versions. | None |
| `gate <pkg> <version> [snippet]` | **Policy Gate**: Evaluates a code diff against calibrated policy thresholds to permit or block migration changes. | None |
| `v1-check [package-json]` | **RN 1.0 Readiness**: Evaluates project readiness for React Native 1.0 architecture. | None |
| `scan [package-json]` | **Manifest Scanner**: Fast legacy-fence scan of project dependencies. | `--json`, `--full` |
| `sync <pkg>` | **Hexagonal Sync**: Synchronizes a package from RN Directory, GitHub, npm, and Bundlephobia into the local cache. | None |

---

## ⚙️ Configuration & "Local Shape" (`.terrainrc` / `terrain.config.json`)

RN-Terrain adapts to your organization's specific stack dialect. Drop a `.terrainrc` or `terrain.config.json` in your project root:

```json
{
  "$schema": "https://terrain.intuitui.org/schema.json",
  "preset": "standard",
  "strictNativeFloating": true,
  "rules": {
    "disallowFloatingNativeRanges": "warn",
    "enforcePeerMatrixAlignment": "error",
    "enforceNewArchitectureCompatibility": "warn",
    "sacredPins": "warn"
  },
  "aliases": {
    "@myorg/reanimated-fork": "react-native-reanimated"
  },
  "localPins": {
    "@company/crypto-native": {
      "recommendedRange": ">=2.0.0 <3.0.0",
      "reason": "Internal security requirement: JNI session manager v2",
      "severity": "error"
    }
  },
  "ignore": [
    "react-native-mock-runtime"
  ]
}
```

### Presets
- **`standard`**: Recommended for bare React Native projects. Flags floating native carets, verifies peer ABI alignment, enforces New Architecture readiness for RN >= 0.76.
- **`expo`**: Recommended for Expo managed projects. Automatically relaxes bare RN carets for packages managed by Expo's SDK lockstep (`bundledNativeModules.json`).
- **`enterprise`**: Strict zero-tolerance mode. All native floating ranges, peer mismatches, and pin violations exit with `error`.
- **`loose`**: Permissive mode; emits advisory warnings only.

---

## 🤖 CI/CD Quality Gate Example

Add RN-Terrain to your GitHub Actions workflow to prevent ABI breaks before merging:

```yaml
name: Ecosystem Quality Gate

on: [push, pull_request]

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - name: Run RN-Terrain Ecosystem Doctor
        run: npx -y @intuitui-labs/rn-terrain-cli doctor:all .
```

---

## 📄 License

MIT © [Intuitui Labs](https://github.com/Intuitui-Labs)
