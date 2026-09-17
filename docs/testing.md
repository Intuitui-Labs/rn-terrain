# Testing Architecture & Evidence Specification

> **Workspace:** `@intuitui-labs/rn-terrain`  
> **Test Engine:** Vitest 5.0+  
> **Coverage Provider:** `@vitest/coverage-v8`  
> **Evidence Levels:** G0 Contract/Math & G1 Boundary/Simulation  

---

## 1. Evidence Level Classification

Per the platform's **Test-Claim Protocol**, tests across the `rn-terrain` monorepo are classified across deterministic mathematical and evaluation tiers:

### Level G0: Pure Mathematical & Evaluation Contracts
- **Engine**: Vitest 5.0+ running on Node.js 22/24+
- **Suites**:
  - `packages/core/test/vitality.test.ts` (Deterministic score bounds, telemetry weights, prior normalization)
  - `packages/openeval-core/test/evaluate.test.ts` (Goal-fit ranking logic, deterministic share-state codecs)
- **Assertions prove**:
  - Vitality scores strictly bound between $0$ and $100$.
  - Evaluation ranking algorithms prioritize goal-aligned offerings before irrelevant libraries.
  - Share state serialization is round-trip lossless and rejects malformed inputs.
- **What is not proven**:
  - Live Supabase database network latency or remote connection timeouts.
  - Live GitHub API rate limits.

---

## 2. Advanced Vitest 5 Capabilities Employed

| Capability | Configuration | Benefit |
| :--- | :--- | :--- |
| **T2 `fsModuleCache`** | `test.fsModuleCache: true` in `vitest.config.ts` | ASTs cached on disk; warm runs execute in $<300\text{ms}$. |
| **V11 `sharedViteServer`** | `test.sharedViteServer: true` in `vitest.config.ts` | Shared Vite transform pipeline across all monorepo packages. |
| **V8 Coverage Engine** | `@vitest/coverage-v8` | Native C++ branch, statement, and line coverage mapping. |

---

## 3. Running Test Suites

```bash
# Standard test run across all packages
pnpm test

# Test run with v8 branch coverage
pnpm run test:coverage
```
