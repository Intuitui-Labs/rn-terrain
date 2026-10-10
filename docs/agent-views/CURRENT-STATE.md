# 🧭 CURRENT STATE: Sacred Platform Pins & Grounded APIs
*Auto-synthesized by rn-terrain CuratedKnowledgeBridge from C:\x knowledge vault*
*Last updated: 2026-10-10T13:23:31.372Z*

> **AUTHORITATIVE DIRECTIVE**:
> All generated code in this repository MUST comply with the sacred versions and New Architecture standards listed below.

---

## 📦 Sacred Mobile Platform Spine
| Package | Sacred Pin | Category | New Architecture | Role & Architectural Purpose |
| :--- | :--- | :--- | :--- | :--- |
| `@shopify/react-native-skia` | `3.0.2` | `graphics` | Fabric / TurboModule | Grounded in `dependency-annotations.yaml` |
| `react-native-gesture-handler` | `3.3.0` | `ui-kit` | Fabric / TurboModule | Grounded in `dependency-annotations.yaml` |
| `react-native-mmkv` | `4.3.2` | `storage` | Fabric / TurboModule | Grounded in `dependency-annotations.yaml` |
| `react-native-nitro-modules` | `0.37.1` | `native` | Fabric / TurboModule | Grounded in `dependency-annotations.yaml` |
| `react-native-reanimated` | `4.7.1` | `animation` | Fabric / TurboModule | Grounded in `dependency-annotations.yaml` |
| `react-native-skia` | `3.0.2` | `graphics` | Fabric / TurboModule | Grounded in `dependency-annotations.yaml` |
| `react-native-worklets` | `0.13.0` | `animation` | Fabric / TurboModule | Grounded in `dependency-annotations.yaml` |
| `typescript` | `7.0.2` | `tooling` | Fabric / TurboModule | Grounded in `dependency-annotations.yaml` |

---

## 🛠️ Global Developer & Native Toolchain
| Tool | Category | Status | Primary Purpose & Interop Notes |
| :--- | :--- | :--- | :--- |
| `metro` | `BUNDLER` | `RECOMMENDED` | Specialized React Native JS packager with fast delta bundling and HMR. (Core foundation of React Native; native symlink support enabled in modern versions.) |
| `dagger` | `CI` | `RECOMMENDED` | CI/CD pipelines (dagger.ts SDK) (Node SDK is npm (@dagger.io/dagger); dagger CLI installed separately.) |
| `promptfoo` | `EVAL` | `RECOMMENDED` | LLM evaluation suites (promptfooconfig.yaml) (Run via npx/pnpm dlx.) |
| `hermes` | `JS_ENGINE` | `RECOMMENDED` | Ahead-of-Time (AOT) bytecode compilation, low memory footprint, instant TTI on mobile. (Default engine for React Native 0.70+ and New Architecture (Fabric).) |
| `eas-cli` | `MOBILE` | `RECOMMENDED` | EAS build/submit for the mobile app (.easrc) (Expo application services CLI.) |
| `expo-cli` | `MOBILE` | `RECOMMENDED` | expo prebuild / start / doctor workflows (NEVER run `expo install --fix` in this repo (see AGENTS.md).) |
| `gradle` | `MOBILE` | `RECOMMENDED` | Android builds (AGP, Kotlin) (android/ is generated — edit only via app.json config plugins.) |
| `xcode` | `MOBILE` | `RECOMMENDED` | iOS builds / cocoapods (ios/ is generated — edit only via app.json config plugins.) |
| `rust` | `NATIVE` | `RECOMMENDED` | Inline native module spike (spike-rust-inline) (Experimental path for new-arch native code.) |
| `bun` | `RUNTIME` | `RECOMMENDED` | Script runner / bundle experiments (mise-managed 1.3.14; not the primary toolchain.) |
| `node` | `RUNTIME` | `RECOMMENDED` | JS runtime for the whole monorepo (mise-managed 24.15.0; engines pin >=22.23 <23.) |
| `pnpm` | `RUNTIME` | `RECOMMENDED` | Workspace package manager (v11) (mise-managed; preinstall guard enforces pnpm; lockfile committed.) |
| `delta` | `RUST_SHINY_TOOL` | `RECOMMENDED` | Syntax-highlighted git diff pager with inline word-level diffing in Rust. (Critical for human review of multi-package agent codemods and migrations.) |
| `fd` | `RUST_SHINY_TOOL` | `RECOMMENDED` | Instant directory tree navigation and filename pattern matching in Rust. (10x faster than native find/dir in deeply nested node_modules / android build directories.) |
| `oxlint` | `RUST_SHINY_TOOL` | `RECOMMENDED` | 50-100x faster than ESLint; written in Rust (Oxc toolchain). (Ideal for pre-commit hooks and agent guardrails in React Native codebases.) |
| `rg` | `RUST_SHINY_TOOL` | `RECOMMENDED` | Hyper-fast Rust-based regex search respecting .gitignore (ripgrep). (Sub-50ms search across million-line mobile monorepos.) |

---

## 🦀 Sovereign Rust Tooling Standards
* **Treesitter AST Verification**: `@ast-grep/napi` ($<5\text{ms}$ pre-flight gate)
* **Native Rust Bindings**: UniFFI bridge (`react-native-uniffi-bridge`) evaluated for custom native capabilities
* **Host Utilities**: `rg` (ripgrep), `fd`, `sd`, `bat`, `eza`, `delta`, `oxlint`, `biome`
