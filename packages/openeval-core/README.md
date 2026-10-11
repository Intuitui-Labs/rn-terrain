# @intuitui-labs/openeval

[![npm version](https://img.shields.io/npm/v/@intuitui-labs/openeval.svg?style=flat-square)](https://www.npmjs.com/package/@intuitui-labs/openeval)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0.2-blue.svg?style=flat-square)](https://www.typescriptlang.org/)

> **Transparent, participatory, 6-dimension evaluation framework for software libraries and ecosystem catalog intelligence.**  
> Delivers deconstructible scores with verifiable rationales across Architecture, Grounding, Hygiene, Velocity, Dialect, and Footprint.

---

## 🧭 The 6 Dimensions of OpenEval

Unlike opaque star counts or black-box rankings, OpenEval decomposes software fitness into 6 verifiable dimensions:

| Dimension | Weight | What it Measures | Verifiable Signals |
| :--- | :---: | :--- | :--- |
| **1. Architecture** | 25% | **New Architecture & Platform Alignment** | Fabric / TurboModules readiness, Nitro Modules, C++ JNI health |
| **2. Grounding** | 20% | **API Severance & AI Safety** | Absence of severed APIs, canonical symbol modernness, codemods |
| **3. Hygiene** | 20% | **Supply Chain & Version Discipline** | Strict native pins, peer range alignment, license compatibility |
| **4. Velocity** | 15% | **Vitality & Ecosystem Momentum** | 30-day commit activity, release cadence, issue resolution speed |
| **5. Dialect** | 10% | **Modern Code Idioms** | TypeScript types, ESM support, modern hook usage over HOCs |
| **6. Footprint** | 10% | **Bundle Size & Binary Overhead** | Gzipped bundle size, native binary complexity, memory profile |

---

## 📦 Installation

```bash
pnpm add @intuitui-labs/openeval
# or
npm install @intuitui-labs/openeval
```

---

## 🚀 Programmatic Quickstart

### 1. Evaluate a Library

```typescript
import { evaluatePackage } from '@intuitui-labs/openeval';

const result = await evaluatePackage('react-native-reanimated', '4.7.1', {
  profile: 'strict_new_arch'
});

console.log(`Composite Score: ${result.score}/100 [${result.verdict}]`);
// => Composite Score: 96/100 [ADOPT]

console.log('Dimension Breakdown:');
for (const [dim, details] of Object.entries(result.dimensions)) {
  console.log(`  • ${dim}: ${details.score}/100 — ${details.rationale}`);
}

console.log('Recommendations:', result.recommendations);
```

### 2. Custom Evaluation Profiles

OpenEval supports calibrating dimension weights to reflect organizational priorities:

```typescript
import { createEvaluator } from '@intuitui-labs/openeval';

const enterpriseEvaluator = createEvaluator({
  profile: 'enterprise',
  weights: {
    architecture: 0.35,
    hygiene: 0.30,
    grounding: 0.15,
    velocity: 0.10,
    dialect: 0.05,
    footprint: 0.05,
  },
  thresholds: {
    adopt: 85,
    trial: 70,
    assess: 50,
  }
});

const report = await enterpriseEvaluator.evaluate('react-native-mmkv');
```

---

## 📊 Verdict Categories

Every evaluation yields an actionable verdict:

- **🟢 ADOPT (80–100)**: Canonical modern standard. Zero severed APIs, New Architecture native, strict version hygiene.
- **🟡 TRIAL (65–79)**: Promising modern candidate or transitioning library with minor caveats or floating peer dependencies.
- **🟠 ASSESS (50–64)**: Viable for specific niche use cases but exhibits legacy dialect drift or architectural debt.
- **🔴 HOLD (<50)**: Severe architectural obsolescence, unmaintained codebase, or critical severed API violations.

---

## 🛠️ Subpath Exports

| Export | Description |
| :--- | :--- |
| `@intuitui-labs/openeval` | Core evaluator, composite scoring algorithms, and verdict profiles |
| `@intuitui-labs/openeval/ingestion` | Ingestion adapters for npm, GitHub, Bundlephobia, and catalog sources |

---

## 📄 License

MIT © [Intuitui Labs](https://github.com/intuitui-labs)
