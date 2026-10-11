---
name: rn-entry
description: |
  REACT NATIVE ROUTER: High-salience entrypoint for mobile application engineering.
  Classifies tasks (animations, gestures, navigation, storage, New Architecture Fabric/TurboModules),
  triggers preflight grounding to cut state receipts, and routes to specialized rn-terrain capabilities.
  Activate whenever writing, editing, or auditing React Native code.
---

# React Native Task Router (`rn-entry`)

> **PURPOSE**: This router classifies your incoming task, identifies required canonical libraries, runs pre-flight grounding to cut an active receipt in `.agents/state/receipt.json`, and guides code generation toward non-severed modern APIs.

---

## 🚦 Task Classification & Routing Matrix

Before writing or editing code, classify the user request and query the corresponding Outside Referent:

| Task Domain | Canonical Modern Package | Mandatory Pre-Flight Action | Key Grounding Rules |
| :--- | :--- | :--- | :--- |
| **Complex Animations** | `react-native-reanimated` (v4.x) | `tcdi_compass(package_name: "react-native-reanimated")` | Must co-install `react-native-worklets@^0.13.0`. Banned: `useAnimatedGestureHandler`. |
| **Touch & Gestures** | `react-native-gesture-handler` (v3.x) | `tcdi_compass(package_name: "react-native-gesture-handler")` | Use `<GestureDetector gesture={Gesture.Pan()}>`. Banned: legacy `<PanGestureHandler>`. |
| **Fast Key-Value Storage** | `react-native-mmkv` (v4.x) | `tcdi_compass(package_name: "react-native-mmkv")` | Use synchronous Nitro module instance: `const storage = new MMKV()`. Banned: async await. |
| **2D Graphics & Canvas** | `@shopify/react-native-skia` | `tcdi_compass(package_name: "@shopify/react-native-skia")` | Verified against Skia C++ JNI bridge. Enforce exact version pin. |
| **New Arch Verification** | React Native Core (0.76–0.88+) | `tcdi_doctor_stack(code_snippet: "...")` | Verifies Fabric component hooks and absence of legacy Bridge calls. |
| **Dependency Manifest** | Workspace `package.json` | `tcdi_doctor_deps(project_dir: ".")` | Audits native module surfaces, peer ABI collisions, and floating ranges. |

---

## 🧭 The 3-Step Execution Recipe

When executing any React Native feature:

1. **Step 1: Ground & Cut Receipt**
   Call `tcdi_compass(package_name: "<pkg>")` or run `npx @intuitui-labs/rn-terrain compass <pkg>`.
   *Effect*: Generates the grounded modern API prompt and cuts `.agents/state/receipt.json`.

2. **Step 2: Inspect Physical Affordances**
   If the package is locally installed, call `tcdi_affordance(package_name: "<pkg>")` to inspect real `.d.ts` symbols on disk.

3. **Step 3: Emit Code & Verify AST**
   Write your component using the canonical symbols. The `.agents/gate.mjs` PreToolUse hook will verify your active receipt and allow the write.
