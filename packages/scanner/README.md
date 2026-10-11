# @intuitui-labs/rn-terrain-scanner

[![npm version](https://img.shields.io/npm/v/@intuitui-labs/rn-terrain-scanner.svg?style=flat-square)](https://www.npmjs.com/package/@intuitui-labs/rn-terrain-scanner)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-blue.svg?style=flat-square)](https://www.typescriptlang.org/)

> **AST-based legacy fence, generalized native surface doctor, and capabilities scanner for React Native projects.**  
> Powered by TCDI temporal intelligence—accumulates signals across your project's version history, guards against severed APIs, and audits native dependency health.

---

## ⚡ What it Does

- 🔍 **Tree-Sitter & Polyglot AST Scanning**: Pinpoints severed and deprecated APIs in source code (e.g. `useAnimatedGestureHandler`, `findNodeHandle`, `UIManager.measureInWindow`).
- 🛡️ **Generalized Native Surface Detection**: Automatically discovers compiled native boundaries by inspecting `codegenConfig`, `ios/*.podspec`, `android/build.gradle`, and C++/JNI sources—without relying on static hardcoded lists.
- 🩺 **Dependency Doctor**: Audits `package.json` for hazardous floating ranges (`^`, `~`) on native modules, enforces peer ABI alignment, and verifies sacred pins.
- ⚙️ **"Local Shape" Adaptation (`.terrainrc`)**: Respects repository-specific configurations, internal forks, custom aliases, and enterprise policies.
- 🚦 **Agent Guardrail & Diff Gate**: Validates proposed code diffs before AI agents commit changes to prevent runtime crashes.
- 📲 **Expo Doctor Bridge**: Evaluates Expo SDK compliance, managed module versions, and configuration drift.

---

## 📦 Installation

```bash
pnpm add -D @intuitui-labs/rn-terrain-scanner
# or
npm install --save-dev @intuitui-labs/rn-terrain-scanner
```

---

## 🚀 Programmatic Quickstart

### 1. Run Dependency Doctor on a Project

```typescript
import { DependencyDoctor } from '@intuitui-labs/rn-terrain-scanner';

const doctor = new DependencyDoctor(process.cwd(), {
  preset: 'standard',
  disallowFloatingNativeRanges: true
});

const report = await doctor.runDoctor();

console.log('Project Health Score:', report.healthScore);
console.log('Native Packages Found:', report.nativePackages.map((p) => p.name));
console.log('Violations:', report.violations);
```

### 2. Guard Agent Diff / AST Snippet

```typescript
import { AgentGuardrail } from '@intuitui-labs/rn-terrain-scanner';

const guardrail = new AgentGuardrail();

const snippet = `
import { useAnimatedGestureHandler } from 'react-native-reanimated';

const handler = useAnimatedGestureHandler({
  onActive: (event) => {}
});
`;

const result = guardrail.validateSnippet('react-native-reanimated', '4.7.1', snippet);

if (!result.passed) {
  console.error('Diff Rejected:', result.severedViolations);
  // => [{ identifier: 'useAnimatedGestureHandler', replacement: 'Gesture.Pan().onUpdate(...)' }]
}
```

### 3. Generalized Native Surface Detection

```typescript
import { NativeSurfaceDoctor } from '@intuitui-labs/rn-terrain-scanner';

const detector = new NativeSurfaceDoctor();
const surfaces = await detector.detectNativeSurfaces(process.cwd());

for (const s of surfaces) {
  console.log(`Package: ${s.name}`);
  console.log(`  Has Podspec: ${s.hasPodspec}`);
  console.log(`  Has CodegenConfig: ${s.hasCodegenConfig}`);
  console.log(`  Has Android Build: ${s.hasAndroidGradle}`);
}
```

---

## ⚙️ Configuration (`.terrainrc` / `terrain.config.json`)

Customize scanner behavior for your team's stack:

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
    "react-native-reanimated": {
      "exact": "4.7.1",
      "reason": "Sacred pin: Fabric-only animations"
    }
  }
}
```

---

## 🛠️ Subpath Exports

| Export | Description |
| :--- | :--- |
| `@intuitui-labs/rn-terrain-scanner` | Core scanner, DependencyDoctor, NativeSurfaceDoctor, and AgentGuardrail |
| `@intuitui-labs/rn-terrain-scanner/git-drift` | Git history drift analyzer and version progression accumulator |
| `@intuitui-labs/rn-terrain-scanner/accumulator` | Temporal signal accumulator between $v_{start}$ and $v_{current}$ |
| `@intuitui-labs/rn-terrain-scanner/ast-walker` | Tree-sitter AST traversal and pattern matching routines |
| `@intuitui-labs/rn-terrain-scanner/reporter` | Diagnostic report formatters (JSON, Markdown, CLI) |

---

## 📄 License

MIT © [Intuitui Labs](https://github.com/intuitui-labs)
