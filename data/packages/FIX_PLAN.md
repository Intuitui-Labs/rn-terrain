# RN Terrain: FIX_PLAN (review only)

_Generated 2026-10-06 (Asia/Colombo) from the RN Terrain index (`rn_packages.db`, 387 external deps). Every item was re-checked against the live code in `C:\x` with `rg` and against the **installed** package versions (tarball `.d.ts`, README and native sources)._

> **Nothing has been applied.** `C:\x` was only read: no edits, no commits, no `expo install --fix`, and no `.env` or KEY_LOCATION files opened. The pins stay as they are (RN 0.88.0-rc.3, Expo ~58, reanimated 4.7.1, worklets 0.13.0, RNGH 3.3.0, nitro 0.37.1, mmkv 4.3.2, skia 3.0.2). Nothing is downgraded.

## Summary

| Severity | Count | Meaning |
|---|---|---|
| will-break | 4 | Throws or fails at runtime the first time the code path runs |
| silently-wrong | 4 | Runs, but does the wrong thing with no error |
| deprecated | 8 | Works today; the installed version marks it `@deprecated` |
| types-only | 2 | Type declarations are wrong; no runtime effect |
| info | 4 | Worth knowing; change optional or none |
| **total** | **22** | |

Items are ordered by severity, then by blast radius (widest first). The `ID` matches the per-item block in `FIX_PLAN.patch`.

| # | ID | Severity | Primary location | Blast radius (short) |
|---|---|---|---|---|
| 1 | [W1-cedar](#1-w1-cedar) | will-break | `packages/core/src/logic/permissions/cedarClientEvaluator.ts:37-39` | 1 source file + 2 test files to change |
| 2 | [W2-retention-disk](#2-w2-retention-disk) | will-break | `apps/gurudevi-mobile/src/storage/retention-scheduler.ts:111-118` | 1 file, 2 call sites |
| 3 | [W3-spreadsheet-write](#3-w3-spreadsheet-write) | will-break | `packages/library/src/api/spreadsheet.ts:337-340` | 1 file, 1 call site |
| 4 | [W4-carousel](#4-w4-carousel) | will-break | `packages/ui/src/components/SanctuaryCarousel.tsx:5-6` | 1 file |
| 5 | [S4-stale-peer-ranges](#5-s4-stale-peer-ranges) | silently-wrong | `packages/ui/package.json:927,930` | 4 manifests: @repo/ui, @repo/library, @repo/graphics, @repo/scanner-kit |
| 6 | [S2-background-task-result](#6-s2-background-task-result) | silently-wrong | `packages/core/src/native/runtimeAdapter.ts:153-163` | 1 file |
| 7 | [S1-nitro-theme](#7-s1-nitro-theme) | silently-wrong | `packages/ui/src/theme/nitroThemeTransition.ts:24-36` | 1 file, 1 caller (`ThemeProvider.setThemeMode`, packages/ui/src/context/ThemeProvider.tsx:93-94) |
| 8 | [S3-rnw-augmented-default](#8-s3-rnw-augmented-default) | silently-wrong | `apps/gurudevi-mobile/src/shims/react-native-web-augmented.js:11` | 1 line |
| 9 | [D1-reanimated-Layout](#9-d1-reanimated-layout) | deprecated | `packages/self/src/components/MoodLotus.web.tsx:26,187,231,271` | 15 files, 22 call sites (the index said about 13 and missed `MoodLotus.web.tsx`), plus 4 test mocks or shims updated to export `LinearTransition`. |
| 10 | [D3-worklets-runOnJS](#10-d3-worklets-runonjs) | deprecated | `packages/ui/src/components/LotusPetalFAB.tsx:27,262,281,293` | 6 files, 10 call sites, plus the `react-native-worklets` mock in packages/ui/vitest-setup.ts. |
| 11 | [D2-image-picker-MediaTypeOptions](#11-d2-image-picker-mediatypeoptions) | deprecated | `packages/scanner-kit/src/OCRScanner.tsx:100,115` | 6 files, 8 call sites |
| 12 | [D4-image-manipulator](#12-d4-image-manipulator) | deprecated | `packages/library/src/api/image-to-pdf.ts:2,161-174` | 3 files, 3 call sites, plus the web shim (adds a named `ImageManipulator` export so web keeps working). |
| 13 | [D5-notifications-shouldShowAlert](#13-d5-notifications-shouldshowalert) | deprecated | `apps/gurudevi-mobile/src/providers/PushNotificationProvider.tsx:24` | 2 files, 2 call sites |
| 14 | [D6-rngh-Gesture-builder](#14-d6-rngh-gesture-builder) | deprecated | `packages/ui/src/components/ui/actionsheet/index.tsx:11,94-106` | 2 files: 1 live builder (the action sheet's drag-to-dismiss) and 1 unused import (SelfNavigator imports `Gesture` and `GestureDetector` but uses neither). |
| 15 | [D7-rn-ImageBackground](#15-d7-rn-imagebackground) | deprecated | `packages/ui/src/components/ui/image-background/index.tsx:3-12` | 1 wrapper file |
| 16 | [D8-reanimated-Extrapolate](#16-d8-reanimated-extrapolate) | deprecated | `packages/ui/src/archive/LotusPetalFAB.complex.tsx:21,290,293` | 1 archived file, 2 call sites |
| 17 | [T2-stale-ambient-stubs](#17-t2-stale-ambient-stubs) | types-only | `packages/core/src/types/external-modules.d.ts:1-23` | 3 files (2 blocks each, and 1 whole file) |
| 18 | [T1-keychain-options](#18-t1-keychain-options) | types-only | `packages/core/src/adapters/native/NativeDeviceIdentityAdapter.ts:22,46` | 1 file, 2 annotations |
| 19 | [I1-react-createElement](#19-i1-react-createelement) | info | `apps/gurudevi-mobile/jest-setup.ts` | 22 files, 57 calls (PC rg) |
| 20 | [I2-fs-legacy-subpath](#20-i2-fs-legacy-subpath) | info | `packages/library/src/hooks/useLoadedBytes.ts:46-49` | 3 files |
| 21 | [I3-phantom-deps](#21-i3-phantom-deps) | info | `packages/ui/src/theme/nitroThemeTransition.ts:6` | 2 manifests |
| 22 | [I4-carousel-expo58](#22-i4-carousel-expo58) | info | `packages/ui/package.json:900` | 1 dependency (the W4 consumer only). |

## How to use FIX_PLAN.patch

`FIX_PLAN.patch` is the combined diff of all items (59 files, +298/−349). Paths are relative to the repo root (`a/` and `b/` prefixes). It was checked with `git apply --check` against a byte-exact snapshot of the current files. To try it **on a throwaway branch**:

```powershell
cd C:\x
git switch -c review/fix-plan
git apply --check C:\projects\rn-terrain\data\packages\FIX_PLAN.patch   # dry run
git apply C:\projects\rn-terrain\data\packages\FIX_PLAN.patch
pnpm install --lockfile-only      # S4 + I3 change package.json peers
```

To cherry-pick only some items, copy the item's diff block below into a file and `git apply` it. Order dependencies:
- **D6 depends on D3**: its hunk context contains the `scheduleOnRN` line.
- **S2 and T2 belong together**: once the stubs are gone, the real types catch the old enum names.
- **S4 and I3 both edit `packages/ui/package.json`** (peerDependencies). Apply them in that order.
- **D2 and D4 both edit `packages/profile/src/components/AvatarDisplay.tsx`**. Apply D2 first.
- **D1 and D6 both edit `SelfNavigator.tsx`**, and **D3 and D6 both edit `actionsheet/index.tsx`**. Apply in plan order (D1 → D3 → D6).
- Diffs I2 and I3 are optional.

---

## 1. W1-cedar

**@cedar-policy/cedar-wasm: client evaluator calls `mod.evaluate`, which 4.12.0 does not export**

- **Severity:** `will-break`
- **Location(s):**
  - `packages/core/src/logic/permissions/cedarClientEvaluator.ts:37-39` (load), :112 and :144 (`=== 'Allow'`)
  - `packages/core/src/logic/permissions/__tests__/cedarClientEvaluator.test.ts:9-13` (mocks the non-existent `evaluate`)
  - `packages/core/src/logic/permissions/__tests__/localEvaluator.test.ts:35-40` (same mock pattern)
- **Blast radius:** 1 source file + 2 test files to change. 4 runtime call sites depend on it: `cedarAuthorization.adapter.ts` (evaluateShape1, evaluateShape2), `localEvaluator.ts:111`, `localEvaluator.native.ts:55`. Every offline/client-side permission check goes through it.

**Current code**

```ts
      // @ts-expect-error - Dynamic import for cross-platform WASM compat
      const mod = await import('@cedar-policy/cedar-wasm/web');
      _wasmLoaded = true;
      return mod.evaluate as EvaluateFn;
...
  return decision.decision === 'Allow';
```

**What goes wrong and why this fix**

`mod.evaluate` is `undefined`, so `evaluate({...})` throws `TypeError: evaluate is not a function` on the first check. There are 2 more problems behind it. The `web` build needs its default export (`__wbg_init`) awaited before any call. And 4.12 returns `decision: "allow" | "deny"` in lower case, so even a renamed call would always deny when compared with `'Allow'`. The unit tests mock `evaluate`, which hid all 3 problems. The fix uses `isAuthorized` with the same call shape as the Node path in `packages/policies/src/engine/evaluator.ts:199-226`, which already works.

**Evidence (installed version)**

- tarball `@cedar-policy/cedar-wasm@4.12.0` `web/cedar_wasm.d.ts:336` `export function isAuthorized(call: AuthorizationCall): AuthorizationAnswer;`. No `evaluate` anywhere in the file.
- `web/cedar_wasm.d.ts:481` `export default function __wbg_init(...)`. `web/cedar_wasm.js:521` loads `cedar_wasm_bg.wasm` relative to `import.meta.url`.
- `web/cedar_wasm.d.ts:210` `export type Decision = "allow" | "deny";` and `:198` `AuthorizationAnswer = {type:"failure",...} | {type:"success"; response: Response, ...}`. `:104` `staticPolicies?: StaticPolicySet` (inside `PolicySet`).
- README (same tarball), section "Alternate loading strategies": the `web` sub-package must be initialised first.
- Box type-check against the installed packages: `Property 'evaluate' does not exist on type 'typeof import(".../cedar-wasm/web/cedar_wasm")'` (TS2339). The proposed `await mod.default()` + `mod.isAuthorized({... policies:{staticPolicies}})` passes `tsc --strict`.

**Proposed change**

```diff
diff --git a/packages/core/src/logic/permissions/__tests__/cedarClientEvaluator.test.ts b/packages/core/src/logic/permissions/__tests__/cedarClientEvaluator.test.ts
index 293cb1e..ae90ed8 100644
--- a/packages/core/src/logic/permissions/__tests__/cedarClientEvaluator.test.ts
+++ b/packages/core/src/logic/permissions/__tests__/cedarClientEvaluator.test.ts
@@ -6,10 +6,16 @@ import {
   isCedarWasmLoaded,
 } from '../cedarClientEvaluator';
 
-const mockEvaluate = vi.fn();
+const mockIsAuthorized = vi.fn();
+const cedarAnswer = (decision: 'allow' | 'deny') => ({
+  type: 'success',
+  response: { decision, diagnostics: { reason: [], errors: [] } },
+  warnings: [],
+});
 
 vi.mock('@cedar-policy/cedar-wasm/web', () => ({
-  evaluate: (...args: unknown[]) => mockEvaluate(...args),
+  default: vi.fn(async () => undefined),
+  isAuthorized: (...args: unknown[]) => mockIsAuthorized(...args),
 }));
 
 describe('cedarClientEvaluator', () => {
@@ -35,7 +41,7 @@ describe('cedarClientEvaluator', () => {
 
   describe('evaluateShape1', () => {
     it('returns true when WASM returns Allow', async () => {
-      mockEvaluate.mockResolvedValue({ decision: 'Allow' });
+      mockIsAuthorized.mockReturnValue(cedarAnswer('allow'));
 
       const result = await evaluateShape1(basePolicy, {
         user: baseUser,
@@ -47,7 +53,7 @@ describe('cedarClientEvaluator', () => {
     });
 
     it('returns false when WASM returns Deny', async () => {
-      mockEvaluate.mockResolvedValue({ decision: 'Deny' });
+      mockIsAuthorized.mockReturnValue(cedarAnswer('deny'));
 
       const result = await evaluateShape1(basePolicy, {
         user: baseUser,
@@ -59,7 +65,7 @@ describe('cedarClientEvaluator', () => {
     });
 
     it('passes correct request shape to WASM evaluator', async () => {
-      mockEvaluate.mockResolvedValue({ decision: 'Allow' });
+      mockIsAuthorized.mockReturnValue(cedarAnswer('allow'));
 
       await evaluateShape1(basePolicy, {
         user: baseUser,
@@ -67,20 +73,18 @@ describe('cedarClientEvaluator', () => {
         resourceType: 'School',
       });
 
-      expect(mockEvaluate).toHaveBeenCalledWith(
+      expect(mockIsAuthorized).toHaveBeenCalledWith(
         expect.objectContaining({
-          policies: basePolicy,
-          request: expect.objectContaining({
-            principal: { type: 'User', id: 'user-1' },
-            action: { type: 'Action', id: 'update' },
-            resource: { type: 'School', id: '__cedar_shape1_check__' },
-          }),
+          policies: { staticPolicies: basePolicy },
+          principal: { type: 'User', id: 'user-1' },
+          action: { type: 'Action', id: 'update' },
+          resource: { type: 'School', id: '__cedar_shape1_check__' },
         }),
       );
     });
 
     it('passes user attributes as entity', async () => {
-      mockEvaluate.mockResolvedValue({ decision: 'Allow' });
+      mockIsAuthorized.mockReturnValue(cedarAnswer('allow'));
 
       await evaluateShape1(basePolicy, {
         user: baseUser,
@@ -88,7 +92,7 @@ describe('cedarClientEvaluator', () => {
         resourceType: 'Classroom',
       });
 
-      expect(mockEvaluate).toHaveBeenCalledWith(
+      expect(mockIsAuthorized).toHaveBeenCalledWith(
         expect.objectContaining({
           entities: expect.arrayContaining([
             expect.objectContaining({
@@ -107,7 +111,7 @@ describe('cedarClientEvaluator', () => {
 
   describe('evaluateShape2', () => {
     it('returns true when WASM returns Allow for instance-level check', async () => {
-      mockEvaluate.mockResolvedValue({ decision: 'Allow' });
+      mockIsAuthorized.mockReturnValue(cedarAnswer('allow'));
 
       const result = await evaluateShape2(basePolicy, {
         user: baseUser,
@@ -121,7 +125,7 @@ describe('cedarClientEvaluator', () => {
     });
 
     it('passes resource id and attributes correctly', async () => {
-      mockEvaluate.mockResolvedValue({ decision: 'Allow' });
+      mockIsAuthorized.mockReturnValue(cedarAnswer('allow'));
 
       await evaluateShape2(basePolicy, {
         user: baseUser,
@@ -131,11 +135,9 @@ describe('cedarClientEvaluator', () => {
         resourceAttrs: { teacher_id: 'user-1', school_id: 'school-1' },
       });
 
-      expect(mockEvaluate).toHaveBeenCalledWith(
+      expect(mockIsAuthorized).toHaveBeenCalledWith(
         expect.objectContaining({
-          request: expect.objectContaining({
-            resource: { type: 'Classroom', id: 'classroom-42' },
-          }),
+          resource: { type: 'Classroom', id: 'classroom-42' },
           entities: expect.arrayContaining([
             expect.objectContaining({
               uid: { type: 'Classroom', id: 'classroom-42' },
@@ -153,7 +155,7 @@ describe('cedarClientEvaluator', () => {
     });
 
     it('returns true after successful evaluation', async () => {
-      mockEvaluate.mockResolvedValue({ decision: 'Allow' });
+      mockIsAuthorized.mockReturnValue(cedarAnswer('allow'));
       await evaluateShape1(basePolicy, {
         user: baseUser,
         action: 'read',
diff --git a/packages/core/src/logic/permissions/__tests__/localEvaluator.test.ts b/packages/core/src/logic/permissions/__tests__/localEvaluator.test.ts
index 1fd88f5..a5cc1e3 100644
--- a/packages/core/src/logic/permissions/__tests__/localEvaluator.test.ts
+++ b/packages/core/src/logic/permissions/__tests__/localEvaluator.test.ts
@@ -32,9 +32,15 @@ vi.mock('../../../api/deviceTrust', () => ({
 }));
 
 // Mock the dynamic WebAssembly package
-const mockEvaluate = vi.fn();
+const mockIsAuthorized = vi.fn();
+const cedarAnswer = (decision: 'allow' | 'deny') => ({
+  type: 'success',
+  response: { decision, diagnostics: { reason: [], errors: [] } },
+  warnings: [],
+});
 vi.mock('@cedar-policy/cedar-wasm/web', () => ({
-  evaluate: (...args: any[]) => mockEvaluate(...args),
+  default: vi.fn(async () => undefined),
+  isAuthorized: (...args: any[]) => mockIsAuthorized(...args),
 }));
 
 describe('localEvaluator (WASM PDP)', { tags: ['wasm', 'security'] }, () => {
@@ -144,7 +150,7 @@ describe('localEvaluator (WASM PDP)', { tags: ['wasm', 'security'] }, () => {
       mockDrizzle.query.classrooms.findFirst.mockResolvedValueOnce({
         schoolId: 'school-123',
       });
-      mockEvaluate.mockResolvedValueOnce({ decision: 'Allow' });
+      mockIsAuthorized.mockReturnValueOnce(cedarAnswer('allow'));
 
       const isAllowed = await checkLocalPermission({
         action: 'read',
@@ -154,14 +160,12 @@ describe('localEvaluator (WASM PDP)', { tags: ['wasm', 'security'] }, () => {
       });
 
       expect(isAllowed).toBe(true);
-      expect(mockEvaluate).toHaveBeenCalledWith(
+      expect(mockIsAuthorized).toHaveBeenCalledWith(
         expect.objectContaining({
-          policies: 'permit(principal, action, resource);',
-          request: expect.objectContaining({
-            principal: { type: 'User', id: 'user-123' },
-            action: { type: 'Action', id: 'read' },
-            resource: { type: 'Classroom', id: 'class-1' },
-          }),
+          policies: { staticPolicies: 'permit(principal, action, resource);' },
+          principal: { type: 'User', id: 'user-123' },
+          action: { type: 'Action', id: 'read' },
+          resource: { type: 'Classroom', id: 'class-1' },
         }),
       );
     });
@@ -173,7 +177,7 @@ describe('localEvaluator (WASM PDP)', { tags: ['wasm', 'security'] }, () => {
       mockDrizzle.query.classrooms.findFirst.mockResolvedValueOnce({
         schoolId: 'school-123',
       });
-      mockEvaluate.mockResolvedValueOnce({ decision: 'Deny' });
+      mockIsAuthorized.mockReturnValueOnce(cedarAnswer('deny'));
 
       const isAllowed = await checkLocalPermission({
         action: 'read',
@@ -189,7 +193,9 @@ describe('localEvaluator (WASM PDP)', { tags: ['wasm', 'security'] }, () => {
       mockDrizzle.select.mockReturnValueOnce({
         from: vi.fn().mockResolvedValueOnce([{ content: 'permit(principal, action, resource);' }]),
       });
-      mockEvaluate.mockRejectedValueOnce(new Error('WASM compilation error'));
+      mockIsAuthorized.mockImplementationOnce(() => {
+        throw new Error('WASM compilation error');
+      });
 
       const isAllowed = await checkLocalPermission({
         action: 'read',
diff --git a/packages/core/src/logic/permissions/cedarClientEvaluator.ts b/packages/core/src/logic/permissions/cedarClientEvaluator.ts
index 293fe7b..4715b09 100644
--- a/packages/core/src/logic/permissions/cedarClientEvaluator.ts
+++ b/packages/core/src/logic/permissions/cedarClientEvaluator.ts
@@ -22,10 +22,32 @@ type EvaluateFn = (args: {
   entities: Array<{
     uid: { type: string; id: string };
     attrs: Record<string, unknown>;
-    parents: string[];
+    parents: Array<{ type: string; id: string }>;
   }>;
 }) => Promise<{ decision: string }>;
 
+/**
+ * Subset of @cedar-policy/cedar-wasm@4.12.0 `web/cedar_wasm.d.ts` that this file uses.
+ * The web target must be initialised (default export `__wbg_init`) before any call.
+ */
+type CedarWebModule = {
+  default: (moduleOrPath?: unknown) => Promise<unknown>;
+  isAuthorized: (call: {
+    principal: { type: string; id: string };
+    action: { type: string; id: string };
+    resource: { type: string; id: string };
+    context: Record<string, unknown>;
+    policies: { staticPolicies: string };
+    entities: Array<{
+      uid: { type: string; id: string };
+      attrs: Record<string, unknown>;
+      parents: Array<{ type: string; id: string }>;
+    }>;
+  }) =>
+    | { type: 'success'; response: { decision: 'allow' | 'deny' }; warnings: unknown[] }
+    | { type: 'failure'; errors: unknown[]; warnings: unknown[] };
+};
+
 let _wasmPromise: Promise<EvaluateFn> | null = null;
 let _wasmLoaded = false;
 
@@ -34,9 +56,25 @@ function getWasmEvaluator(): Promise<EvaluateFn> {
   _wasmPromise = (async () => {
     try {
       // @ts-expect-error - Dynamic import for cross-platform WASM compat
-      const mod = await import('@cedar-policy/cedar-wasm/web');
+      const mod = (await import('@cedar-policy/cedar-wasm/web')) as unknown as CedarWebModule;
+      // The `web` build exports no `evaluate`; it needs an explicit init, then `isAuthorized`.
+      await mod.default();
       _wasmLoaded = true;
-      return mod.evaluate as EvaluateFn;
+      const evaluate: EvaluateFn = async ({ policies, request, entities }) => {
+        const answer = await mod.isAuthorized({
+          principal: request.principal,
+          action: request.action,
+          resource: request.resource,
+          context: request.context,
+          policies: { staticPolicies: policies },
+          entities,
+        });
+        if (answer.type === 'failure') {
+          throw new Error(`CedarClientEvaluator: authorization failed (${answer.errors.length} errors)`);
+        }
+        return { decision: answer.response.decision };
+      };
+      return evaluate;
     } catch {
       _wasmLoaded = false;
       throw new Error('CedarClientEvaluator: failed to load @cedar-policy/cedar-wasm/web');
@@ -109,7 +147,7 @@ export async function evaluateShape1(policyString: string, req: Shape1Request):
       },
     ],
   });
-  return decision.decision === 'Allow';
+  return decision.decision === 'allow';
 }
 
 /**
@@ -141,7 +179,7 @@ export async function evaluateShape2(policyString: string, req: Shape2Request):
       },
     ],
   });
-  return decision.decision === 'Allow';
+  return decision.decision === 'allow';
 }
 
 /**
```

**Verification**

- `pnpm --dir packages/core exec vitest run src/logic/permissions` (the updated mocks now match the real export names)
- Web: open a screen gated by an offline permission and confirm in the console that `isCedarWasmLoaded()` is `true` and allow/deny follow policy.
- Native (Hermes): check whether `WebAssembly` exists at runtime. If it doesn't, the loader still throws (fail-closed) and `localEvaluator.native.ts` needs a server fallback. That was out of scope for a code-only review.

---

## 2. W2-retention-disk

**expo-file-system: `getFreeDiskStorageAsync()` from the root entry throws, so storage compaction never runs**

- **Severity:** `will-break`
- **Location(s):**
  - `apps/gurudevi-mobile/src/storage/retention-scheduler.ts:111-118` (shouldRunCompaction)
  - `apps/gurudevi-mobile/src/storage/retention-scheduler.ts:522-529` (collectDeviceContextForMetrics)
- **Blast radius:** 1 file, 2 call sites. Affects every run of the storage-eviction job (`runStorageEviction` → `shouldRunCompaction` / `collectDeviceContextForMetrics`).

**Current code**

```ts
      import('expo-file-system').then((m) => m.getFreeDiskStorageAsync()),
...
      FileSystem.getFreeDiskStorageAsync(),
```

**What goes wrong and why this fix**

In SDK 58 the root `expo-file-system` legacy names are stubs that throw. The throw is caught (lines 215-226), so nothing crashes, but `shouldRunCompaction()` always returns `allowed:false, reason:'unknown_device_state'`. VACUUM and optimize never run, and the metrics always report `diskFreeBytes: 0` (with battery 1 and charging false).

**Evidence (installed version)**

- tarball `expo-file-system@58.0.5` `build/legacyWarnings.js:58-59` `export async function getFreeDiskStorageAsync() { throw errorOnLegacyMethodUse('getFreeDiskStorageAsync'); }`
- `build/legacyWarnings.d.ts:43` `@deprecated Use \`Paths.availableDiskSpace\` or import this method from \`expo-file-system/legacy\`. This method will throw in runtime.`
- `build/Paths.d.ts:21,25` `static get totalDiskSpace(): number;` and `static get availableDiskSpace(): number;` (synchronous getters)
- Index: capability_summary.deprecated_used for expo-file-system ("Root legacy stubs (throw at runtime)")

**Proposed change**

```diff
diff --git a/apps/gurudevi-mobile/src/storage/retention-scheduler.ts b/apps/gurudevi-mobile/src/storage/retention-scheduler.ts
index 1ea62ed..cf48fb1 100644
--- a/apps/gurudevi-mobile/src/storage/retention-scheduler.ts
+++ b/apps/gurudevi-mobile/src/storage/retention-scheduler.ts
@@ -108,14 +108,15 @@ async function shouldRunCompaction(): Promise<{
   try {
     const Battery = await import('expo-battery');
     const Network = await import('expo-network');
-    const FileSystem = await import('expo-file-system');
+    const { Paths } = await import('expo-file-system');
 
-    const [batteryLevel, batteryState, networkState, diskInfo] = await Promise.all([
+    const [batteryLevel, batteryState, networkState] = await Promise.all([
       import('expo-battery').then((m) => m.getBatteryLevelAsync()),
       import('expo-battery').then((m) => m.getBatteryStateAsync()),
       import('expo-network').then((m) => m.getNetworkStateAsync()),
-      import('expo-file-system').then((m) => m.getFreeDiskStorageAsync()),
     ]);
+    // expo-file-system 58: root getFreeDiskStorageAsync() is a stub that throws; Paths getters are sync.
+    const diskInfo = { freeSpace: Paths.availableDiskSpace, totalSpace: Paths.totalDiskSpace };
 
     const isCharging = batteryState === 2; // BatteryState.CHARGING
     const isMetered = (networkState as any)?.isMetered ?? false;
@@ -519,14 +520,14 @@ async function collectDeviceContextForMetrics(): Promise<{
   try {
     const Battery = await import('expo-battery');
     const Network = await import('expo-network');
-    const FileSystem = await import('expo-file-system');
+    const { Paths } = await import('expo-file-system');
 
-    const [batteryLevel, batteryState, networkState, diskInfo] = await Promise.all([
+    const [batteryLevel, batteryState, networkState] = await Promise.all([
       Battery.getBatteryLevelAsync(),
       Battery.getBatteryStateAsync(),
       Network.getNetworkStateAsync(),
-      FileSystem.getFreeDiskStorageAsync(),
     ]);
+    const diskInfo = Paths.availableDiskSpace;
 
     return {
       batteryLevel,
```

**Verification**

- On a device build, trigger `forceCompaction()` and confirm the log no longer says `Skipped: unknown_device_state` and that `deviceContext.diskFreeBytes > 0`.
- `pnpm --dir apps/gurudevi-mobile exec tsc --noEmit`

---

## 3. W3-spreadsheet-write

**expo-file-system: `SpreadsheetService.writeToFile` uses the throwing root `writeAsStringAsync` and `EncodingType`**

- **Severity:** `will-break`
- **Location(s):**
  - `packages/library/src/api/spreadsheet.ts:337-340`
- **Blast radius:** 1 file, 1 call site. No callers of `writeToFile` were found in apps/ or packages/, so it's dormant today but throws on first use.

**Current code**

```ts
    const { writeAsStringAsync, EncodingType } = await import('expo-file-system');
    await writeAsStringAsync(filePath, bytesToBase64(bytes), {
      encoding: EncodingType.Base64,
    });
```

**What goes wrong and why this fix**

Same stub problem as W2. The new `File#write` accepts `Uint8Array` directly, so the base64 round-trip goes away too.

**Evidence (installed version)**

- `expo-file-system@58.0.5` `build/legacyWarnings.js:23-24` (`writeAsStringAsync` → `throw errorOnLegacyMethodUse`)
- `build/internal/NativeFileSystem.types.d.ts:155` `write(content: string | Uint8Array | ArrayBuffer, options?: FileWriteOptions): Promise<void>;`
- `ios/FileSystemFile.swift:122-127` writes with `data.write(to: url)`, which creates the file if it's missing
- Box type-check: `await new File(uri).write(bytes)` passes `tsc --strict` against 58.0.5.

**Proposed change**

```diff
diff --git a/packages/library/src/api/spreadsheet.ts b/packages/library/src/api/spreadsheet.ts
index bc0d398..a5b4d45 100644
--- a/packages/library/src/api/spreadsheet.ts
+++ b/packages/library/src/api/spreadsheet.ts
@@ -333,11 +333,9 @@ export class SpreadsheetAPI {
     bookType: WriteOptions['bookType'] = 'xlsx'
   ): Promise<void> {
     const bytes = this.write(workbook, { bookType, type: 'array' }) as Uint8Array;
-    // This requires expo-file-system or similar
-    const { writeAsStringAsync, EncodingType } = await import('expo-file-system');
-    await writeAsStringAsync(filePath, bytesToBase64(bytes), {
-      encoding: EncodingType.Base64,
-    });
+    // expo-file-system 58: the root writeAsStringAsync() is a stub that throws; use the File API.
+    const { File } = await import('expo-file-system');
+    await new File(filePath).write(bytes);
   }
 
   /**
```

**Verification**

- `pnpm --dir packages/library exec tsc --noEmit`
- Call `SpreadsheetService.writeToFile(wb, Paths.cache.uri + 'x.xlsx')` on a device and open the file.

---

## 4. W4-carousel

**react-native-reanimated-carousel 5.1.1: default import of a named-only export, plus v4 props (and `layout` with `itemAnimation`, which v5 rejects by throwing)**

- **Severity:** `will-break`
- **Location(s):**
  - `packages/ui/src/components/SanctuaryCarousel.tsx:5-6` (import under `@ts-expect-error`)
  - `packages/ui/src/components/SanctuaryCarousel.tsx:40-74` (props)
- **Blast radius:** 1 file. `SanctuaryCarousel` is re-exported from `packages/ui/src/components/index.ts:138-139`, but no app or package renders it today (rg). So it's dormant, and breaks on first render.

**Current code**

```ts
// @ts-expect-error - Module has no type declarations
import Carousel from 'react-native-reanimated-carousel';
...
      itemWidth={itemWidth}
      sliderWidth={screenWidth}
      horizontal
      autoPlay={false}
      snapEnabled
      layout={{ type: 'horizontal-stack', ... }}
      itemAnimation={parallax ? ({ progress }) => ({ opacity: withTiming(...) ... }) : undefined}
```

**What goes wrong and why this fix**

1. `Carousel` is `undefined`, so React throws "Element type is invalid". The `@ts-expect-error` comment is wrong: 5.1.1 ships types, and the directive hides the real TS2613.
2. Once the import is fixed, `itemWidth`, `sliderWidth`, `horizontal`, `showsHorizontalScrollIndicator`, `autoPlay` and `snapEnabled` are not v5 props. v5 uses `itemSize`, `style`, `orientation`, `autoplay` and `snapMode`.
3. With the default `parallax = true`, both `layout` and `itemAnimation` are set, and v5 throws `layout and itemAnimation are mutually exclusive`.
4. v5 calls `itemAnimation(relativeProgress, index)` inside `useAnimatedStyle`. It receives a number, not `{progress}`, so it must be a `'worklet'` and must not call `withTiming`.

Design choice to review: in the proposal, `parallax` uses `itemAnimation`, and `parallax={false}` keeps the original `horizontal-stack` layout.

**Evidence (installed version)**

- tarball `react-native-reanimated-carousel@5.1.1` `lib/module/index.js`: `export{Carousel}from"./components/Carousel";export{Pagination}...` (no default). `package.json` `exports["."]["react-native"] = ./src/index.tsx`, which also has named exports only.
- `src/public-types.ts` `CarouselProps` (data, renderItem, keyExtractor, itemSize, orientation, autoplay, snapMode, style, ... `& CarouselLayoutSelection` where `layout` and `itemAnimation` are exclusive). `CarouselItemAnimation = (relativeProgress: number, index: number) => ViewStyle`.
- `src/hooks/useInitProps.ts:137-141` `throw new Error("... \`layout\` and \`itemAnimation\` are mutually exclusive.")`. `src/components/ItemLayout.tsx:149` calls it inside `useAnimatedStyle`.
- Box type-check: the current import gives TS2613 `has no default export. Did you mean to use 'import { Carousel } ...'`. The proposed JSX passes `tsc --strict`.
- Docs: https://rn-carousel.dev/migration-v5

**Proposed change**

```diff
diff --git a/packages/ui/src/components/SanctuaryCarousel.tsx b/packages/ui/src/components/SanctuaryCarousel.tsx
index 1ef6390..5a442d3 100644
--- a/packages/ui/src/components/SanctuaryCarousel.tsx
+++ b/packages/ui/src/components/SanctuaryCarousel.tsx
@@ -1,9 +1,8 @@
 import { Theme } from '@repo/ui/theme/Theme';
 import React from 'react';
 import { Dimensions } from 'react-native';
-import Animated, { withTiming } from 'react-native-reanimated';
-// @ts-expect-error - Module has no type declarations
-import Carousel from 'react-native-reanimated-carousel';
+import Animated from 'react-native-reanimated';
+import { Carousel } from 'react-native-reanimated-carousel';
 
 export interface SanctuaryCarouselProps<T> {
   data: T[];
@@ -39,38 +38,28 @@ export function SanctuaryCarousel<T>({
   return (
     <Carousel
       data={data}
-      renderItem={({ item, index }: { item: T; index: number }) => (
-        <React.Fragment key={keyExtractor(item, index)}>
-          <Animated.View
-            style={{ width: itemWidth, marginRight: index < data.length - 1 ? gap : 0 }}
-          >
-            {renderItem(item, index)}
-          </Animated.View>
-        </React.Fragment>
-      )}
       keyExtractor={keyExtractor}
-      itemWidth={itemWidth}
-      sliderWidth={screenWidth}
-      horizontal
-      showsHorizontalScrollIndicator={false}
+      renderItem={({ item, index }) => (
+        <Animated.View style={{ width: itemWidth }}>{renderItem(item, index)}</Animated.View>
+      )}
+      // v5: container size comes from `style`; `itemSize` is the page distance (card + gap).
+      style={{ width: screenWidth }}
+      itemSize={itemWidth + gap}
       contentContainerStyle={{ paddingHorizontal }}
+      orientation="horizontal"
       loop={false}
-      autoPlay={false}
-      snapEnabled
-      layout={{
-        type: 'horizontal-stack',
-        visibleCount,
-        spacing: gap,
-        scaleStep: 0.04,
-      }}
-      itemAnimation={
-        parallax
-          ? ({ progress }: { progress: number }) => ({
-              opacity: withTiming(1 - Math.abs(progress) * 0.3),
-              transform: [{ scale: withTiming(1 - Math.abs(progress) * 0.08) }],
-            })
-          : undefined
-      }
+      autoplay={false}
+      snapMode="page"
+      // v5: `layout` and `itemAnimation` are mutually exclusive (useInitProps throws if both are set).
+      {...(parallax
+        ? {
+            itemAnimation: (relativeProgress: number) => {
+              'worklet';
+              const p = Math.abs(relativeProgress);
+              return { opacity: 1 - p * 0.3, transform: [{ scale: 1 - p * 0.08 }] };
+            },
+          }
+        : { layout: { type: 'horizontal-stack' as const, visibleCount, spacing: gap, scaleStep: 0.04 } })}
     />
   );
 }
```

**Verification**

- `pnpm --dir packages/ui exec tsc --noEmit` (now type-checked, because the ts-expect-error is gone)
- Render `<SanctuaryCarousel data={[...]} .../>` in a scratch screen with parallax on and off.

---

## 5. S4-stale-peer-ranges

**Workspace peer ranges still say React Native 0.86 / React 19.2.x while the app runs 0.88.0-rc.3 / 19.3.0**

- **Severity:** `silently-wrong`
- **Location(s):**
  - `packages/ui/package.json:927,930`
  - `packages/library/package.json:180,182`
  - `packages/graphics/package.json:81-82`
  - `packages/scanner-kit/package.json:46-47`
- **Blast radius:** 4 manifests: @repo/ui, @repo/library, @repo/graphics, @repo/scanner-kit. Every pnpm install reports unmet peers for them, and `strict-peer-dependencies` would fail the install.

**Current code**

```ts
    "react": "19.2.3",            // ui, library, graphics   (scanner-kit: "19.2.8")
    "react-native": "~0.86.0",    // ui, library, graphics   (scanner-kit: "0.86.3")
```

**What goes wrong and why this fix**

These packages say they support only RN 0.86.x, but their only RN consumer (gurudevi-mobile) runs `0.88.0-rc.3` and `react 19.3.0`. Every other workspace package uses `*`. This is a widening, not a downgrade. `>=0.88.0-rc.3` matches the rc and every later GA under semver prerelease rules. `react >=19.2.3` keeps gurudevi-web (react 19.2.3) valid if it consumes these packages.

**Evidence (installed version)**

- `apps/gurudevi-mobile/package.json`: `react-native: 0.88.0-rc.3`, `react: 19.3.0` (PC read). The index package_version.local_resolved shows the same.
- Per-workspace scan on the PC: admin, ai, analytics, classroom, community, core, form-builder, people, profile, self and workforce all declare `*`. Only these 4 are pinned to 0.86.

**Proposed change**

```diff
diff --git a/packages/graphics/package.json b/packages/graphics/package.json
index 68dec04..493b530 100644
--- a/packages/graphics/package.json
+++ b/packages/graphics/package.json
@@ -78,8 +78,8 @@
     "@supabase/supabase-js": "*",
     "@tanstack/react-query": "*",
     "expo": "~58.0.3",
-    "react": "19.2.3",
-    "react-native": "~0.86.0",
+    "react": ">=19.2.3",
+    "react-native": ">=0.88.0-rc.3",
     "react-native-gesture-handler": ">=3.2.1",
     "react-native-maps": ">=1.29.0",
     "react-native-svg": ">=15.15.4"
diff --git a/packages/library/package.json b/packages/library/package.json
index dc38b04..1fd15ae 100644
--- a/packages/library/package.json
+++ b/packages/library/package.json
@@ -177,9 +177,9 @@
     "expo-sharing": "~58.0.14",
     "expo-sqlite": "~58.0.9",
     "expo-video": "~58.0.6",
-    "react": "19.2.3",
+    "react": ">=19.2.3",
     "react-i18next": "*",
-    "react-native": "~0.86.0",
+    "react-native": ">=0.88.0-rc.3",
     "react-native-gesture-handler": ">=3.2.1",
     "react-native-linear-gradient": ">=2.8.3",
     "react-native-reanimated": "^4.6.0",
diff --git a/packages/scanner-kit/package.json b/packages/scanner-kit/package.json
index c64554a..1228a22 100644
--- a/packages/scanner-kit/package.json
+++ b/packages/scanner-kit/package.json
@@ -43,8 +43,8 @@
     "jpeg-js": "*",
     "jsqr": "*",
     "qrcode": "*",
-    "react": "19.2.8",
-    "react-native": "0.86.3",
+    "react": ">=19.2.3",
+    "react-native": ">=0.88.0-rc.3",
     "react-native-svg": "15.15.5"
   },
   "devDependencies": {
diff --git a/packages/ui/package.json b/packages/ui/package.json
index eb90db4..ecd1e19 100644
--- a/packages/ui/package.json
+++ b/packages/ui/package.json
@@ -924,10 +924,10 @@
     "expo-sharing": ">=58.0.14",
     "expo-web-browser": ">=58.0.5",
     "i18next": "*",
-    "react": "19.2.3",
+    "react": ">=19.2.3",
     "react-dom": "*",
     "react-i18next": "*",
-    "react-native": "~0.86.0",
+    "react-native": ">=0.88.0-rc.3",
     "react-native-enriched-markdown": "^1.0.1",
     "react-native-keyboard-controller": "1.22.4",
     "react-native-safe-area-context": ">=5.10.0",
```

**Verification**

- `pnpm install --lockfile-only` then `pnpm why react-native`: no unmet-peer warnings for these 4 packages.
- (pnpm-lock.yaml changes, so commit it together with this.)

---

## 6. S2-background-task-result

**expo-background-task 58: runtime adapter maps to `BackgroundTaskResult.NewData/NoData` and `Status.Denied`, which don't exist**

- **Severity:** `silently-wrong`
- **Location(s):**
  - `packages/core/src/native/runtimeAdapter.ts:153-163` (result mapping)
  - `packages/core/src/native/runtimeAdapter.ts:176-177` (Denied case)
  - `packages/core/src/native/runtimeAdapter.ts:183-184` (trigger signature)
- **Blast radius:** 1 file. Affects the 2 registered background tasks (`BACKGROUND_SYNC_TASK` in `apps/gurudevi-mobile/src/lib/backgroundSync.ts`, `STORAGE_EVICTION_TASK` in `storageEvictionTask.ts`) through `coreRuntime.backgroundTask`.

**Current code**

```ts
        case BackgroundTaskResult.NewData:
          return BackgroundTask.BackgroundTaskResult.NewData;   // undefined at runtime
        case BackgroundTaskResult.NoData:
          return BackgroundTask.BackgroundTaskResult.NoData;    // undefined at runtime
...
      case BackgroundTask.BackgroundTaskStatus.Denied:          // undefined at runtime
```

**What goes wrong and why this fix**

Every successful run hands `undefined` to the OS. On iOS, `BackgroundTaskConsumer.normalizeTaskResult` turns non-Int values into `.noData`, so a run that did sync work is reported as "no data", which feeds iOS's scheduling heuristics. Android ignores the value. The type checker never caught this because 3 hand-written ambient stubs (see T2) declare the old SDK-52 enums.

**Evidence (installed version)**

- tarball `expo-background-task@58.0.10` `build/BackgroundTask.types.d.ts`: `enum BackgroundTaskStatus { Restricted = 1, Available = 2 }`, `enum BackgroundTaskResult { Success = 1, Failed = 2 }`
- `build/BackgroundTask.d.ts:51` `triggerTaskWorkerForTestingAsync(): Promise<boolean>` (no task-name parameter)
- `ios/BackgroundTaskConsumer.swift:16-17` (`guard let result = result as? Int else { return UIBackgroundFetchResult.noData.rawValue }`)
- Box type-check: `BackgroundTaskResult.NewData` gives TS2339 and `BackgroundTaskStatus.Denied` gives TS2339.

**Proposed change**

```diff
diff --git a/packages/core/src/native/runtimeAdapter.ts b/packages/core/src/native/runtimeAdapter.ts
index 8d35181..66511a7 100644
--- a/packages/core/src/native/runtimeAdapter.ts
+++ b/packages/core/src/native/runtimeAdapter.ts
@@ -151,16 +151,11 @@ export const nativeBackgroundTaskProvider: BackgroundTaskProvider = {
   defineTask: (name: string, task: () => Promise<BackgroundTaskResult>) => {
     TaskManager.defineTask(name, async () => {
       const result = await task();
-      switch (result) {
-        case BackgroundTaskResult.NewData:
-          return BackgroundTask.BackgroundTaskResult.NewData;
-        case BackgroundTaskResult.NoData:
-          return BackgroundTask.BackgroundTaskResult.NoData;
-        case BackgroundTaskResult.Failed:
-          return BackgroundTask.BackgroundTaskResult.Failed;
-        default:
-          return BackgroundTask.BackgroundTaskResult.NoData;
-      }
+      // expo-background-task 58 only has Success (1) and Failed (2); NewData/NoData do not exist
+      // at runtime, so the old mapping handed `undefined` to the OS for every non-failed run.
+      return result === BackgroundTaskResult.Failed
+        ? BackgroundTask.BackgroundTaskResult.Failed
+        : BackgroundTask.BackgroundTaskResult.Success;
     });
   },
   registerTaskAsync: (name: string, options?: BackgroundTaskOptions) =>
@@ -173,15 +168,15 @@ export const nativeBackgroundTaskProvider: BackgroundTaskProvider = {
         return BackgroundTaskStatus.Available;
       case BackgroundTask.BackgroundTaskStatus.Restricted:
         return BackgroundTaskStatus.Restricted;
-      case BackgroundTask.BackgroundTaskStatus.Denied:
-        return BackgroundTaskStatus.Denied;
       default:
         return BackgroundTaskStatus.Denied;
     }
   },
   isTaskRegisteredAsync: (name: string) => TaskManager.isTaskRegisteredAsync(name),
-  triggerTaskWorkerForTestingAsync: (name: string) =>
-    BackgroundTask.triggerTaskWorkerForTestingAsync(name),
+  // 58 signature: triggerTaskWorkerForTestingAsync(): Promise<boolean> (no task name).
+  triggerTaskWorkerForTestingAsync: async (_name: string) => {
+    await BackgroundTask.triggerTaskWorkerForTestingAsync();
+  },
 };
 
 export const nativeAssetProvider = {
```

**Verification**

- Apply together with T2, then `pnpm --dir packages/core exec tsc --noEmit` (the real expo types are now in force).
- iOS dev build: run `triggerBackgroundSyncForTesting()` and check the Xcode log for `newData` instead of `noData`.

---

## 7. S1-nitro-theme

**react-native-nitro-theme-transition 1.0.0: code feature-detects `startTransition`, but the library exports `withThemeTransition`**

- **Severity:** `silently-wrong`
- **Location(s):**
  - `packages/ui/src/theme/nitroThemeTransition.ts:24-36`
- **Blast radius:** 1 file, 1 caller (`ThemeProvider.setThemeMode`, packages/ui/src/context/ThemeProvider.tsx:93-94). Every native theme switch takes the no-animation fallback.

**Current code**

```ts
  if (nitroThemeModule && typeof nitroThemeModule.startTransition === 'function') {
    try {
      await nitroThemeModule.startTransition(transitionType, async () => {
        await updateThemeCallback();
      });
```

**What goes wrong and why this fix**

The check is always false, so the native GPU transition never runs (an instant swap instead). 3 of the local `ThemeTransitionType` names also differ from the library's kinds (`inverseCircularReveal`→`circularRevealInverse`, `wipe`→`slide`, `pixelize`→`pixlated`), so the proposal maps them. The library requires a **synchronous** `applyTheme` and runs it exactly once, even without the native module. `ThemeProvider`'s `applyChange` is already synchronous. Its README notes that React-state-driven themes may need a higher `settleFrames`, so tune that on device.

**Evidence (installed version)**

- tarball `react-native-nitro-theme-transition@1.0.0` `lib/typescript/module/index.d.ts:128` `export declare function withThemeTransition(applyTheme: () => void, config?: ThemeTransitionConfig): void;`, `:115` `isThemeTransitionAvailable()`, `:108` `THEME_TRANSITION_KINDS = ["fade","circularReveal","circularRevealInverse","iris","slide",...,"pixlated",...]`. No `startTransition`.
- README:44 (`// must be synchronous`), README:72 ("`applyTheme` runs **exactly once** in every path"), README:140 (§ settleFrames)
- Box type-check: `startTransition` gives TS2339. `withThemeTransition(fn, {kind:'circularRevealInverse'|'slide'|'pixlated'})` passes.

**Proposed change**

```diff
diff --git a/packages/ui/src/theme/nitroThemeTransition.ts b/packages/ui/src/theme/nitroThemeTransition.ts
index 8f62036..46ddfca 100644
--- a/packages/ui/src/theme/nitroThemeTransition.ts
+++ b/packages/ui/src/theme/nitroThemeTransition.ts
@@ -8,6 +8,16 @@ try {
   // Graceful fallback if native Nitro Theme module is missing or on web
 }
 
+/**
+ * Local names that differ from react-native-nitro-theme-transition@1.0.0 `ThemeTransitionKind`
+ * (lib/typescript/module/index.d.ts, THEME_TRANSITION_KINDS).
+ */
+const KIND_ALIASES: Partial<Record<ThemeTransitionType, string>> = {
+  inverseCircularReveal: 'circularRevealInverse',
+  wipe: 'slide',
+  pixelize: 'pixlated',
+};
+
 /**
  * Starts a GPU-driven theme transition using Nitro Modules when available,
  * falling back gracefully on unsupported platforms or web.
@@ -21,17 +31,28 @@ export async function startThemeTransition(
 ): Promise<void> {
   const transitionType = options?.type || 'circularReveal';
 
-  if (nitroThemeModule && typeof nitroThemeModule.startTransition === 'function') {
+  // 1.0.0 API: withThemeTransition(applyTheme, config). applyTheme MUST be synchronous and the
+  // library runs it exactly once (even when the native module is missing), so no fallback call here.
+  if (nitroThemeModule && typeof nitroThemeModule.withThemeTransition === 'function') {
+    let applied = false;
     try {
-      await nitroThemeModule.startTransition(transitionType, async () => {
-        await updateThemeCallback();
-      });
+      nitroThemeModule.withThemeTransition(
+        () => {
+          applied = true;
+          void updateThemeCallback();
+        },
+        {
+          kind: KIND_ALIASES[transitionType] ?? transitionType,
+          durationMs: options?.duration,
+        },
+      );
       return;
     } catch (error) {
       console.warn(
         '[ThemeTransition] Native transition failed, falling back to direct update:',
         error,
       );
+      if (applied) return;
     }
   }
 
```

**Verification**

- On a dev-client build (prebuild needed, since it's native), toggle the theme and confirm the circular reveal plays.
- `pnpm --dir packages/ui exec tsc --noEmit`

---

## 8. S3-rnw-augmented-default

**react-native-web 0.21.3: `export { default } from 'react-native-web'` re-exports a default that doesn't exist**

- **Severity:** `silently-wrong`
- **Location(s):**
  - `apps/gurudevi-mobile/src/shims/react-native-web-augmented.js:11`
- **Blast radius:** 1 line. 0 importers: nothing in apps/ or packages/ references `react-native-web-augmented` (rg), because metro.config.js:211 maps `react-native` straight to `node_modules/react-native-web`. Dormant. Under strict ESM linking this line is a SyntaxError if the shim is ever wired in.

**Current code**

```ts
export * from 'react-native-web';
export { default } from 'react-native-web';
```

**What goes wrong and why this fix**

Remove the dangling re-export. Optionally delete the orphaned shim file, which isn't in this patch.

**Evidence (installed version)**

- tarball `react-native-web@0.21.3` `package.json` (`main: dist/cjs/index.js`, `module: dist/index.js`). `rg 'export default' dist/index.js` finds nothing, and the file only has named re-exports.

**Proposed change**

```diff
diff --git a/apps/gurudevi-mobile/src/shims/react-native-web-augmented.js b/apps/gurudevi-mobile/src/shims/react-native-web-augmented.js
index d59a34c..361d46f 100644
--- a/apps/gurudevi-mobile/src/shims/react-native-web-augmented.js
+++ b/apps/gurudevi-mobile/src/shims/react-native-web-augmented.js
@@ -8,7 +8,8 @@
 // We can import directly because metro.config.js skips the redirect
 // when the request originates from this shim file.
 export * from 'react-native-web';
-export { default } from 'react-native-web';
+// react-native-web 0.21.3 has no default export (dist/index.js, dist/cjs/index.js), so
+// `export { default } from 'react-native-web'` bound nothing. Removed.
 
 import { View } from 'react-native-web';
 
```

**Verification**

- `rg -n "react-native-web-augmented" apps packages` → still 0 hits.
- `pnpm --dir apps/gurudevi-mobile exec expo export -p web` builds.

---

## 9. D1-reanimated-Layout

**Reanimated 4.7.1: `Layout` is a deprecated alias, use `LinearTransition`**

- **Severity:** `deprecated`
- **Location(s):**
  - `packages/self/src/components/MoodLotus.web.tsx:26,187,231,271`
  - `packages/self/src/components/TomorrowPrep.web.tsx:28,180,230`
  - `packages/self/src/components/StudentGoals.tsx:28,184,220`
  - `packages/self/src/components/SelfNavigator.tsx:17,238,266`
  - `packages/self/src/components/RemindersManager.web.tsx:30,151,214`
  - `packages/self/src/components/OrientationCaptureStep.tsx:37,245,264`
  - `packages/self/src/components/WisdomSeeds.tsx:28,175`
  - `packages/self/src/components/MoodPickerCard.tsx:24,83`
  - `packages/self/src/components/DecisionJournalSection.tsx:26,68`
  - `packages/self/src/components/DailyRhythm.tsx:55,252`
  - `packages/self/src/components/DailyContentCard.tsx:24,93`
  - `packages/self/src/components/DailyContentCard.web.tsx:13,51`
  - `packages/ui/src/components/TemporalNavigator.tsx:6,56`
  - `packages/ai/src/screens/AIAssistantScreen.tsx:19,53`
  - `packages/ui/src/providers/ToastProvider.tsx:20,132`
  - `mocks:` packages/ui/vitest-reanimated-mock.ts:49, apps/gurudevi-mobile/vitest-reanimated-mock.ts:35, apps/gurudevi-mobile/__mocks__/react-native-reanimated.js:51, packages/ui/src/shims/native-web-stub.ts:98
- **Blast radius:** 15 files, 22 call sites (the index said about 13 and missed `MoodLotus.web.tsx`), plus 4 test mocks or shims updated to export `LinearTransition`.

**Current code**

```ts
import Animated, { FadeIn, Layout } from 'react-native-reanimated';
<Animated.View layout={Layout} entering={FadeIn.duration(800)}>
layout={reducedMotion ? undefined : Layout.springify()}
```

**What goes wrong and why this fix**

This is a pure rename (`Layout` is `typeof LinearTransition`), with no behaviour change. The mocks keep `Layout` and add `LinearTransition`, so tests in both states still resolve.

**Evidence (installed version)**

- tarball `react-native-reanimated@4.7.1` `lib/typescript/layoutReanimation/defaultTransitions/LinearTransition.d.ts:18-19` `/** @deprecated Please use {@link LinearTransition} instead. */ export declare const Layout: typeof LinearTransition;`
- Box type-check: `layout={LinearTransition}` and `LinearTransition.springify()` pass `tsc --strict` against 4.7.1.
- Docs: https://docs.swmansion.com/react-native-reanimated/docs/layout-animations/layout-transitions

**Proposed change**

```diff
diff --git a/apps/gurudevi-mobile/__mocks__/react-native-reanimated.js b/apps/gurudevi-mobile/__mocks__/react-native-reanimated.js
index d174516..22e7e14 100644
--- a/apps/gurudevi-mobile/__mocks__/react-native-reanimated.js
+++ b/apps/gurudevi-mobile/__mocks__/react-native-reanimated.js
@@ -49,6 +49,7 @@ const Reanimated = {
   SlideInDown: { duration: jest.fn() },
   ZoomIn: { duration: jest.fn() },
   Layout: { duration: jest.fn() },
+  LinearTransition: { duration: jest.fn(), springify: jest.fn() },
   cancelAnimation: jest.fn(),
   default: {},
 };
diff --git a/apps/gurudevi-mobile/vitest-reanimated-mock.ts b/apps/gurudevi-mobile/vitest-reanimated-mock.ts
index fa4f9b6..6b18bad 100644
--- a/apps/gurudevi-mobile/vitest-reanimated-mock.ts
+++ b/apps/gurudevi-mobile/vitest-reanimated-mock.ts
@@ -33,6 +33,7 @@ export const SlideOutLeft = {};
 export const ZoomIn = {};
 export const ZoomOut = {};
 export const Layout = {};
+export const LinearTransition = {};
 
 const Animated = {
   View: 'Animated.View',
diff --git a/packages/ai/src/screens/AIAssistantScreen.tsx b/packages/ai/src/screens/AIAssistantScreen.tsx
index a9bf273..7f3a9da 100644
--- a/packages/ai/src/screens/AIAssistantScreen.tsx
+++ b/packages/ai/src/screens/AIAssistantScreen.tsx
@@ -16,7 +16,7 @@ import { useEffect } from 'react';
 import { Platform, StyleSheet } from 'react-native';
 import Animated, {
   FadeInUp,
-  Layout,
+  LinearTransition,
   useAnimatedStyle,
   useSharedValue,
   withRepeat,
@@ -50,7 +50,7 @@ export default function AIAssistantScreen() {
   const renderMessage = ({ item }: { item: Message }) => {
     const isUser = item.role === 'user';
     return (
-      <Animated.View entering={FadeInUp.springify().damping(15)} layout={Layout.springify()}>
+      <Animated.View entering={FadeInUp.springify().damping(15)} layout={LinearTransition.springify()}>
         <MessageBubble
           content={item.content}
           variant={isUser ? 'user' : 'assistant'}
diff --git a/packages/self/src/components/DailyContentCard.tsx b/packages/self/src/components/DailyContentCard.tsx
index d30d131..420d6ec 100644
--- a/packages/self/src/components/DailyContentCard.tsx
+++ b/packages/self/src/components/DailyContentCard.tsx
@@ -21,7 +21,7 @@ import {
 } from '@repo/ui/primitives';
 import { useEffect, useState } from 'react';
 import { useTranslation } from 'react-i18next';
-import Animated, { FadeIn, Layout } from 'react-native-reanimated';
+import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';
 
 interface DailyContentCardProps {
   type: 'motivation' | 'did_you_know';
@@ -90,7 +90,7 @@ export default function DailyContentCard({ type }: DailyContentCardProps) {
   const needsExpansion = content.content.length > 120;
 
   return (
-    <Animated.View layout={Layout} entering={FadeIn.duration(800)}>
+    <Animated.View layout={LinearTransition} entering={FadeIn.duration(800)}>
       <Pressable
         onPress={() => needsExpansion && setExpanded(!expanded)}
         accessibilityRole={needsExpansion ? 'button' : undefined}
diff --git a/packages/self/src/components/DailyContentCard.web.tsx b/packages/self/src/components/DailyContentCard.web.tsx
index eec1816..88d8a9a 100644
--- a/packages/self/src/components/DailyContentCard.web.tsx
+++ b/packages/self/src/components/DailyContentCard.web.tsx
@@ -10,7 +10,7 @@ import { BrandPulse } from '@repo/ui/components/BrandPulse';
 import { Lightbulb, Sparkles, User } from '@repo/ui/icons';
 import { Box, HStack, Icon, Pressable, Text, VStack } from '@repo/ui/primitives';
 import { useEffect, useState } from 'react';
-import Animated, { FadeIn, Layout } from 'react-native-reanimated';
+import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';
 
 interface DailyContentCardProps {
   type: 'motivation' | 'did_you_know';
@@ -48,7 +48,7 @@ export default function DailyContentCard({ type }: DailyContentCardProps) {
   if (!content) return null;
 
   return (
-    <Animated.View layout={Layout} entering={FadeIn.duration(800)}>
+    <Animated.View layout={LinearTransition} entering={FadeIn.duration(800)}>
       <Pressable
         onPress={() => setExpanded((v) => !v)}
         className={`p-xl bg-white/5 rounded-2xl border-l-4 border-y border-r border-white/5 transition-all active:scale-[0.99] ${borderClass}`}
diff --git a/packages/self/src/components/DailyRhythm.tsx b/packages/self/src/components/DailyRhythm.tsx
index 318fb03..b7309ad 100644
--- a/packages/self/src/components/DailyRhythm.tsx
+++ b/packages/self/src/components/DailyRhythm.tsx
@@ -52,7 +52,7 @@ import {
 import { useToast } from '@repo/ui/providers';
 import { useEffect, useState } from 'react';
 import { useTranslation } from 'react-i18next';
-import Animated, { FadeInDown, FadeInRight, Layout } from 'react-native-reanimated';
+import Animated, { FadeInDown, FadeInRight, LinearTransition } from 'react-native-reanimated';
 
 const DAYS = [
   { id: 1, label: 'M' },
@@ -249,7 +249,7 @@ function DailyRhythmContent() {
                 <Animated.View
                   key={period.id}
                   entering={FadeInRight.delay(index * 100)}
-                  layout={Layout}
+                  layout={LinearTransition}
                 >
                   <Pressable
                     onLongPress={() => {
diff --git a/packages/self/src/components/DecisionJournalSection.tsx b/packages/self/src/components/DecisionJournalSection.tsx
index 95c8208..03200ba 100644
--- a/packages/self/src/components/DecisionJournalSection.tsx
+++ b/packages/self/src/components/DecisionJournalSection.tsx
@@ -23,7 +23,7 @@ import {
 } from '@repo/ui/primitives';
 import { hapticLight } from '@repo/ui/utils/haptics';
 import { useState } from 'react';
-import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';
+import Animated, { FadeIn, FadeInDown, LinearTransition } from 'react-native-reanimated';
 
 interface DecisionJournalSectionProps {
   userId: string | null;
@@ -65,7 +65,7 @@ export default function DecisionJournalSection({ userId }: DecisionJournalSectio
 
   return (
     <VStack className="flex-1 gap-6">
-      <Animated.View layout={Layout} entering={FadeIn.duration(800)}>
+      <Animated.View layout={LinearTransition} entering={FadeIn.duration(800)}>
         <Box className="bg-white/5 rounded-3xl border border-white/10 p-xl shadow-sm">
           <VStack className="gap-lg">
             <Box className="bg-white/5 rounded-2xl border border-white/5 p-4 min-h-[120px]">
diff --git a/packages/self/src/components/MoodLotus.web.tsx b/packages/self/src/components/MoodLotus.web.tsx
index c7b96b8..7bf5501 100644
--- a/packages/self/src/components/MoodLotus.web.tsx
+++ b/packages/self/src/components/MoodLotus.web.tsx
@@ -23,7 +23,7 @@ import {
   VStack,
 } from '@repo/ui/primitives';
 import { useEffect, useRef, useState } from 'react';
-import { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';
+import { FadeIn, FadeInDown, LinearTransition } from 'react-native-reanimated';
 
 interface MoodLotusProps {
   userId?: string;
@@ -184,7 +184,7 @@ export default function MoodLotus({ userId, onMoodChange, variant = 'summary' }:
               />
             )}
 
-            <AnimatedView layout={Layout} entering={FadeIn.duration(600)}>
+            <AnimatedView layout={LinearTransition} entering={FadeIn.duration(600)}>
               <Text
                 className={`${isDetail ? 'text-[140px]' : 'text-[100px]'} select-none transition-transform duration-500 hover:scale-110 drop-shadow-2xl`}
               >
@@ -228,7 +228,7 @@ export default function MoodLotus({ userId, onMoodChange, variant = 'summary' }:
 
             {/* Intention Log */}
             {selected !== null && (
-              <AnimatedView entering={FadeInDown} layout={Layout} className="gap-4">
+              <AnimatedView entering={FadeInDown} layout={LinearTransition} className="gap-4">
                 <VStack className="gap-1.5">
                   <Text className="text-[10px] uppercase font-black tracking-widest text-mistGray/40 pl-1">
                     Resonance Note
@@ -268,7 +268,7 @@ export default function MoodLotus({ userId, onMoodChange, variant = 'summary' }:
 
           {/* Dynamic Paced Breathing (Web Optimized) */}
           {(showBreath || isDetail) && (
-            <AnimatedView entering={FadeInDown} layout={Layout}>
+            <AnimatedView entering={FadeInDown} layout={LinearTransition}>
               <Box className="p-8 bg-skyBlue/5 rounded-[32px] border border-skyBlue/10 items-center justify-center shadow-xl">
                 <VStack className="items-center gap-6 w-full">
                   <HStack className="items-center gap-2 px-3 py-1 bg-skyBlue/10 rounded-full border border-skyBlue/20">
diff --git a/packages/self/src/components/MoodPickerCard.tsx b/packages/self/src/components/MoodPickerCard.tsx
index 2fad59e..9ae0d16 100644
--- a/packages/self/src/components/MoodPickerCard.tsx
+++ b/packages/self/src/components/MoodPickerCard.tsx
@@ -21,7 +21,7 @@ import {
 } from '@repo/ui/primitives';
 import { formatDistanceToNow } from 'date-fns';
 import { useMemo, useState } from 'react';
-import Animated, { FadeIn, FadeInUp, Layout } from 'react-native-reanimated';
+import Animated, { FadeIn, FadeInUp, LinearTransition } from 'react-native-reanimated';
 
 interface MoodPickerCardProps {
   isOpen: boolean;
@@ -80,7 +80,7 @@ export function MoodPickerCard({
   };
 
   return (
-    <Animated.View layout={Layout} entering={FadeIn.duration(800)}>
+    <Animated.View layout={LinearTransition} entering={FadeIn.duration(800)}>
       <Box className={`p-xl rounded-3xl border ${bgClass} shadow-sm overflow-hidden`}>
         <VStack className="gap-lg">
           {/* Header */}
diff --git a/packages/self/src/components/OrientationCaptureStep.tsx b/packages/self/src/components/OrientationCaptureStep.tsx
index e47a0a1..651bec5 100644
--- a/packages/self/src/components/OrientationCaptureStep.tsx
+++ b/packages/self/src/components/OrientationCaptureStep.tsx
@@ -34,7 +34,7 @@ import {
 import { hapticLight, hapticSuccess } from '@repo/ui/utils/haptics';
 import type React from 'react';
 import { useCallback, useState } from 'react';
-import Animated, { FadeIn, FadeInRight, Layout } from 'react-native-reanimated';
+import Animated, { FadeIn, FadeInRight, LinearTransition } from 'react-native-reanimated';
 
 type OrientationSeeds = {
   depth_breadth: number;
@@ -242,7 +242,7 @@ export const OrientationCaptureStep = ({
         showsVerticalScrollIndicator={false}
       >
         {/* Header */}
-        <Animated.View layout={Layout} entering={FadeIn.duration(600)}>
+        <Animated.View layout={LinearTransition} entering={FadeIn.duration(600)}>
           <VStack className="gap-2 mb-10">
             <Text className="text-sanctuarySaffron text-[10px] font-black uppercase tracking-[0.3em]">
               Sequence {questionIndex + 1} of {QUESTIONS.length}
@@ -261,7 +261,7 @@ export const OrientationCaptureStep = ({
           {question.options.map((opt, i) => {
             const isSelected = selected === i;
             return (
-              <Animated.View key={opt.label} entering={FadeInRight.delay(i * 100)} layout={Layout}>
+              <Animated.View key={opt.label} entering={FadeInRight.delay(i * 100)} layout={LinearTransition}>
                 <Pressable
                   onPress={() => handleSelect(i)}
                   accessibilityRole="button"
diff --git a/packages/self/src/components/RemindersManager.web.tsx b/packages/self/src/components/RemindersManager.web.tsx
index a5e7ba7..d883662 100644
--- a/packages/self/src/components/RemindersManager.web.tsx
+++ b/packages/self/src/components/RemindersManager.web.tsx
@@ -27,7 +27,7 @@ import {
   VStack,
 } from '@repo/ui/primitives';
 import { useCallback, useEffect, useState } from 'react';
-import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
+import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
 
 type Reminder = ReminderRecord;
 
@@ -148,7 +148,7 @@ export default function RemindersManager({ userId }: RemindersManagerProps) {
       </HStack>
 
       {showForm && (
-        <Animated.View entering={FadeInDown} layout={Layout}>
+        <Animated.View entering={FadeInDown} layout={LinearTransition}>
           <VStack className="gap-4 p-6 bg-shroud border border-white/10 rounded-[24px] shadow-xl">
             <VStack className="gap-1.5">
               <Text className="text-[10px] uppercase font-black tracking-widest text-mistGray/50 pl-1">
@@ -211,7 +211,7 @@ export default function RemindersManager({ userId }: RemindersManagerProps) {
       ) : (
         <VStack className="gap-3">
           {reminders.map((r, idx) => (
-            <Animated.View key={r.id} entering={FadeInDown.delay(idx * 50)} layout={Layout}>
+            <Animated.View key={r.id} entering={FadeInDown.delay(idx * 50)} layout={LinearTransition}>
               <HStack
                 className={`items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-[20px] transition-all opacity-100 ${!r.is_active ? 'opacity-40 grayscale' : ''}`}
               >
diff --git a/packages/self/src/components/SelfNavigator.tsx b/packages/self/src/components/SelfNavigator.tsx
index f25d229..dff7ca7 100644
--- a/packages/self/src/components/SelfNavigator.tsx
+++ b/packages/self/src/components/SelfNavigator.tsx
@@ -14,7 +14,7 @@ import { hapticLight, hapticMedium, hapticSelection } from '@repo/ui/utils/hapti
 import React, { useCallback, useState } from 'react';
 import { Platform, useWindowDimensions } from 'react-native';
 import { Gesture, GestureDetector } from 'react-native-gesture-handler';
-import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
+import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
 
 export interface SelfNavigatorProps {
   features: (SelfViewFeature & { domainColor?: string })[];
@@ -235,7 +235,7 @@ export function SelfNavigator({
       </HStack>
 
       <Animated.View
-        layout={reducedMotion ? undefined : Layout.springify()}
+        layout={reducedMotion ? undefined : LinearTransition.springify()}
         entering={reducedMotion ? undefined : FadeIn.duration(220)}
         exiting={reducedMotion ? undefined : FadeOut.duration(180)}
       >
@@ -263,7 +263,7 @@ export function SelfNavigator({
             {features.map((feature) => (
               <Animated.View
                 key={feature.id}
-                layout={reducedMotion ? undefined : Layout.springify()}
+                layout={reducedMotion ? undefined : LinearTransition.springify()}
                 entering={reducedMotion ? undefined : FadeIn.delay(20).duration(200)}
                 style={
                   {
diff --git a/packages/self/src/components/StudentGoals.tsx b/packages/self/src/components/StudentGoals.tsx
index 141060d..ab87e37 100644
--- a/packages/self/src/components/StudentGoals.tsx
+++ b/packages/self/src/components/StudentGoals.tsx
@@ -25,7 +25,7 @@ import {
 import { hapticLight, hapticSuccess } from '@repo/ui/utils/haptics';
 import { useState } from 'react';
 import { useTranslation } from 'react-i18next';
-import { FadeInRight, FadeInUp, Layout } from 'react-native-reanimated';
+import { FadeInRight, FadeInUp, LinearTransition } from 'react-native-reanimated';
 
 interface StudentGoalsProps {
   userId: string;
@@ -181,7 +181,7 @@ export default function StudentGoals({ userId }: StudentGoalsProps) {
 
         {/* Add Goal Input */}
         {showAddGoal && (
-          <AnimatedView entering={FadeInUp} layout={Layout.springify()}>
+          <AnimatedView entering={FadeInUp} layout={LinearTransition.springify()}>
             <Box className="p-lg bg-white/5 rounded-3xl border border-white/10 mb-4 shadow-xl">
               <VStack className="gap-lg">
                 <Box className="bg-obsidian rounded-2xl border border-white/10 p-2 h-16 justify-center">
@@ -217,7 +217,7 @@ export default function StudentGoals({ userId }: StudentGoalsProps) {
             <AnimatedView
               key={goal.id}
               entering={FadeInRight.delay(index * 100)}
-              layout={Layout.springify()}
+              layout={LinearTransition.springify()}
             >
               <Box className="p-lg bg-white/5 rounded-3xl border border-white/5 shadow-sm">
                 <VStack className="gap-5">
diff --git a/packages/self/src/components/TomorrowPrep.web.tsx b/packages/self/src/components/TomorrowPrep.web.tsx
index 7db17ef..171092a 100644
--- a/packages/self/src/components/TomorrowPrep.web.tsx
+++ b/packages/self/src/components/TomorrowPrep.web.tsx
@@ -25,7 +25,7 @@ import {
 } from '@repo/ui/primitives';
 import { confirmAction } from '@repo/ui/utils/dialogs';
 import { useEffect, useState } from 'react';
-import Animated, { FadeInDown, Layout } from 'react-native-reanimated';
+import Animated, { FadeInDown, LinearTransition } from 'react-native-reanimated';
 
 interface TomorrowPrepProps {
   userId?: string;
@@ -177,7 +177,7 @@ export default function TomorrowPrep({ userId }: TomorrowPrepProps) {
 
       {/* Quick Draft Form */}
       {showForm && (
-        <Animated.View entering={FadeInDown} layout={Layout}>
+        <Animated.View entering={FadeInDown} layout={LinearTransition}>
           <HStack className="gap-3 p-4 bg-shroud border border-white/10 rounded-[24px] shadow-2xl">
             <Input className="flex-1 bg-white/5 border-white/10 rounded-xl h-12">
               <InputField
@@ -227,7 +227,7 @@ export default function TomorrowPrep({ userId }: TomorrowPrepProps) {
       ) : (
         <VStack className="gap-2.5">
           {tomorrowItems.map((item, idx) => (
-            <Animated.View key={item.id} entering={FadeInDown.delay(idx * 50)} layout={Layout}>
+            <Animated.View key={item.id} entering={FadeInDown.delay(idx * 50)} layout={LinearTransition}>
               <HStack
                 className={`items-center gap-4 p-4 bg-white/5 border border-white/5 rounded-[22px] transition-all ${item.is_completed ? 'opacity-40' : 'opacity-100'}`}
               >
diff --git a/packages/self/src/components/WisdomSeeds.tsx b/packages/self/src/components/WisdomSeeds.tsx
index 681d732..d6cd1be 100644
--- a/packages/self/src/components/WisdomSeeds.tsx
+++ b/packages/self/src/components/WisdomSeeds.tsx
@@ -25,7 +25,7 @@ import {
 import { useRouter } from 'expo-router';
 import { useState } from 'react';
 import { useTranslation } from 'react-i18next';
-import Animated, { FadeIn, FadeInDown, Layout } from 'react-native-reanimated';
+import Animated, { FadeIn, FadeInDown, LinearTransition } from 'react-native-reanimated';
 
 interface WisdomSeedsProps {
   userId?: string;
@@ -172,7 +172,7 @@ export default function WisdomSeeds({ userId }: WisdomSeedsProps) {
             </Box>
           ) : (
             notes.map((note, index) => (
-              <Animated.View key={note.id} entering={FadeIn.delay(index * 100)} layout={Layout}>
+              <Animated.View key={note.id} entering={FadeIn.delay(index * 100)} layout={LinearTransition}>
                 <Pressable
                   onPress={() =>
                     router.push({ pathname: '/self/wisdom/[id]', params: { id: note.id } })
diff --git a/packages/ui/src/components/TemporalNavigator.tsx b/packages/ui/src/components/TemporalNavigator.tsx
index c953aa0..ad6f4b7 100644
--- a/packages/ui/src/components/TemporalNavigator.tsx
+++ b/packages/ui/src/components/TemporalNavigator.tsx
@@ -3,7 +3,7 @@ import { Calendar, ChevronLeft, ChevronRight, RotateCcw } from '@repo/ui/icons';
 import { Box, HStack, Pressable, Text } from '@repo/ui/primitives';
 import { useState } from 'react';
 import { Platform } from 'react-native';
-import Animated, { FadeIn, Layout } from 'react-native-reanimated';
+import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';
 
 /**
  * TemporalNavigator
@@ -53,7 +53,7 @@ export const TemporalNavigator = () => {
 
   return (
     <Animated.View
-      layout={Layout}
+      layout={LinearTransition}
       entering={FadeIn}
       className="flex-row items-center justify-between bg-phase-surface/10 mx-4 my-2 py-2.5 px-3 rounded-xl border border-white/5 shadow-sm"
     >
diff --git a/packages/ui/src/providers/ToastProvider.tsx b/packages/ui/src/providers/ToastProvider.tsx
index 31770e0..1cbb61a 100644
--- a/packages/ui/src/providers/ToastProvider.tsx
+++ b/packages/ui/src/providers/ToastProvider.tsx
@@ -17,7 +17,7 @@ import { Platform, Pressable, View } from 'react-native';
 import Animated, {
   FadeInUp,
   FadeOutUp,
-  Layout,
+  LinearTransition,
   useAnimatedStyle,
   withSpring,
 } from 'react-native-reanimated';
@@ -129,7 +129,7 @@ function StackedToastItem({
       : ({
           entering: isReduceMotionEnabled ? undefined : FadeInUp,
           exiting: isReduceMotionEnabled ? undefined : FadeOutUp,
-          layout: isReduceMotionEnabled ? undefined : Layout.springify(),
+          layout: isReduceMotionEnabled ? undefined : LinearTransition.springify(),
           className: 'w-full',
           style: [{ pointerEvents: 'auto' }, animatedStyle] as any,
         } as const);
diff --git a/packages/ui/src/shims/native-web-stub.ts b/packages/ui/src/shims/native-web-stub.ts
index 7329214..d00e44c 100644
--- a/packages/ui/src/shims/native-web-stub.ts
+++ b/packages/ui/src/shims/native-web-stub.ts
@@ -96,6 +96,7 @@ export const ZoomOut = {};
 export const BounceIn = {};
 export const BounceOut = {};
 export const Layout = {};
+export const LinearTransition = {};
 
 // ==========================================
 // 2. expo-modules-core stub
diff --git a/packages/ui/vitest-reanimated-mock.ts b/packages/ui/vitest-reanimated-mock.ts
index e89b5a6..2b36508 100644
--- a/packages/ui/vitest-reanimated-mock.ts
+++ b/packages/ui/vitest-reanimated-mock.ts
@@ -47,6 +47,7 @@ export const SlideOutDown = animation;
 export const ZoomIn = animation;
 export const ZoomOut = animation;
 export const Layout = animation;
+export const LinearTransition = animation;
 export const Easing = {
   linear: (value: number) => value,
   ease: (value: number) => value,
```

**Verification**

- `rg -n "\bLayout\b" packages/self packages/ui/src packages/ai -g '*.tsx' | rg reanimated` → 0
- `tsc --noEmit` in packages/self, packages/ui and packages/ai
- Smoke-test the Self tab list re-ordering animations.

---

## 10. D3-worklets-runOnJS

**react-native-worklets 0.13.0: `runOnJS` is deprecated, use `scheduleOnRN` (not flagged by the index)**

- **Severity:** `deprecated`
- **Location(s):**
  - `packages/ui/src/components/LotusPetalFAB.tsx:27,262,281,293`
  - `packages/ui/src/components/workspace/DraggableCanvasSurface.tsx:19,72,73,93`
  - `packages/ui/src/components/AchievementUnlockOverlay.tsx:11,44`
  - `packages/ui/src/components/SanctuaryToast.tsx:18,69`
  - `packages/ui/src/components/TemporalScrubber.tsx:7,46`
  - `packages/ui/src/components/ui/actionsheet/index.tsx:19,104`
  - `packages/ui/vitest-setup.ts:44-50` (mock)
- **Blast radius:** 6 files, 10 call sites, plus the `react-native-worklets` mock in packages/ui/vitest-setup.ts.

**Current code**

```ts
import { runOnJS } from 'react-native-worklets';
runOnJS(onDragEnd)(id, { x: translateX.value, y: translateY.value });
```

**What goes wrong and why this fix**

Mechanical change: `runOnJS(fn)(...args)` becomes `scheduleOnRN(fn, ...args)`. The index pattern table marked these `current` because it checked Reanimated's re-export list, not the worklets typings. The architecture test `workspace-drag-modern-api.test.ts:40` only forbids importing `runOnJS` from reanimated, so it stays green.

**Evidence (installed version)**

- tarball `react-native-worklets@0.13.0` `lib/typescript/threads.native.d.ts:102` `/** @deprecated Use \`scheduleOnRN\` instead. */` (runOnJS). `:87` `export declare function scheduleOnRN<Args, R>(fun: ..., ...args: Args): void;`
- `react-native-reanimated@4.7.1` `lib/typescript/workletFunctions.d.ts:38` `export declare const runOnJS: typeof runOnJSFromWorklets` (the same deprecated function, re-exported)
- Box type-check of `scheduleOnRN(onClose)` and `scheduleOnRN(onDragEnd, id, {x,y})` passes.
- Docs: https://docs.swmansion.com/react-native-worklets/docs/threading/scheduleOnRN/

**Proposed change**

```diff
diff --git a/packages/ui/src/components/AchievementUnlockOverlay.tsx b/packages/ui/src/components/AchievementUnlockOverlay.tsx
index 1710c00..3373ed6 100644
--- a/packages/ui/src/components/AchievementUnlockOverlay.tsx
+++ b/packages/ui/src/components/AchievementUnlockOverlay.tsx
@@ -8,7 +8,7 @@ import Animated, {
   withSpring,
   withTiming,
 } from 'react-native-reanimated';
-import { runOnJS } from 'react-native-worklets';
+import { scheduleOnRN } from 'react-native-worklets';
 
 const { width } = Dimensions.get('window');
 
@@ -41,7 +41,7 @@ export default function AchievementUnlockOverlay({
     scale.value = withTiming(0.8, { duration: 300 });
     translateY.value = withTiming(-HIDDEN_Y_OFFSET, { duration: 400 }, (finished) => {
       if (finished) {
-        runOnJS(onHide)();
+        scheduleOnRN(onHide);
       }
     });
   }, [opacity, scale, translateY, onHide]);
diff --git a/packages/ui/src/components/LotusPetalFAB.tsx b/packages/ui/src/components/LotusPetalFAB.tsx
index cfa9dd5..de5e85c 100644
--- a/packages/ui/src/components/LotusPetalFAB.tsx
+++ b/packages/ui/src/components/LotusPetalFAB.tsx
@@ -24,7 +24,7 @@ import Animated, {
   withSpring,
   withTiming,
 } from 'react-native-reanimated';
-import { runOnJS } from 'react-native-worklets';
+import { scheduleOnRN } from 'react-native-worklets';
 
 // ============================================================================
 // TYPES
@@ -259,7 +259,7 @@ export const LotusPetalFAB: FC<LotusPetalFABProps> = memo(
         dragStartX.value = positionX.value;
         dragStartY.value = positionY.value;
         pressScale.value = withSpring(1.1);
-        runOnJS(hapticLight)();
+        scheduleOnRN(hapticLight);
       },
       onUpdate: (event) => {
         'worklet';
@@ -278,7 +278,7 @@ export const LotusPetalFAB: FC<LotusPetalFABProps> = memo(
         'worklet';
         pressScale.value = withSpring(1);
         if (!event.canceled) {
-          runOnJS(persistWebPosition)(positionX.value, positionY.value);
+          scheduleOnRN(persistWebPosition, positionX.value, positionY.value);
         }
         positionX.value = withSpring(positionX.value, { damping: 15 });
         positionY.value = withSpring(positionY.value, { damping: 15 });
@@ -290,7 +290,7 @@ export const LotusPetalFAB: FC<LotusPetalFABProps> = memo(
       maxDistance: FAB_DRAG_THRESHOLD,
       onActivate: () => {
         'worklet';
-        runOnJS(handlePress)();
+        scheduleOnRN(handlePress);
       },
     });
 
diff --git a/packages/ui/src/components/SanctuaryToast.tsx b/packages/ui/src/components/SanctuaryToast.tsx
index 5a13691..b00c5f6 100644
--- a/packages/ui/src/components/SanctuaryToast.tsx
+++ b/packages/ui/src/components/SanctuaryToast.tsx
@@ -15,7 +15,7 @@ import Animated, {
   withTiming,
 } from 'react-native-reanimated';
 import { SafeAreaInsetsContext } from 'react-native-safe-area-context';
-import { runOnJS } from 'react-native-worklets';
+import { scheduleOnRN } from 'react-native-worklets';
 
 export type ToastType = 'success' | 'error' | 'info' | 'warning';
 
@@ -66,7 +66,7 @@ export default function SanctuaryToast({
       ? -HIDDEN_Y_OFFSET
       : withTiming(-HIDDEN_Y_OFFSET, {}, (finished) => {
           if (finished && visible) {
-            runOnJS(onHide)();
+            scheduleOnRN(onHide);
           }
         });
     if (isReduceMotionEnabled && visible) onHide();
diff --git a/packages/ui/src/components/TemporalScrubber.tsx b/packages/ui/src/components/TemporalScrubber.tsx
index 4be0fe0..d689554 100644
--- a/packages/ui/src/components/TemporalScrubber.tsx
+++ b/packages/ui/src/components/TemporalScrubber.tsx
@@ -4,7 +4,7 @@ import React from 'react';
 import { useWindowDimensions } from 'react-native';
 import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
 import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
-import { runOnJS } from 'react-native-worklets';
+import { scheduleOnRN } from 'react-native-worklets';
 
 /**
  * TemporalScrubber
@@ -43,7 +43,7 @@ export const TemporalScrubber: React.FC = () => {
     onDeactivate: (event) => {
       'worklet';
       if (!event.canceled && Math.abs(pan.value) > 50) {
-        runOnJS(commitSwipe)(pan.value);
+        scheduleOnRN(commitSwipe, pan.value);
       }
       pan.value = withSpring(0);
     },
diff --git a/packages/ui/src/components/ui/actionsheet/index.tsx b/packages/ui/src/components/ui/actionsheet/index.tsx
index 6a2d7c3..318505a 100644
--- a/packages/ui/src/components/ui/actionsheet/index.tsx
+++ b/packages/ui/src/components/ui/actionsheet/index.tsx
@@ -16,7 +16,7 @@ import Animated, {
   useSharedValue,
   withSpring,
 } from 'react-native-reanimated';
-import { runOnJS } from 'react-native-worklets';
+import { scheduleOnRN } from 'react-native-worklets';
 
 /**
  * Actionsheet Component
@@ -101,7 +101,7 @@ export const ActionsheetContent = ({ children, className }: ActionsheetContentPr
     .onEnd((event: { canceled?: boolean }) => {
       'worklet';
       const shouldClose = !event.canceled && translateY.value > 120;
-      if (shouldClose) runOnJS(onClose)();
+      if (shouldClose) scheduleOnRN(onClose);
       translateY.value = withSpring(0);
     });
   const animatedStyle = useAnimatedStyle(() => ({
diff --git a/packages/ui/src/components/workspace/DraggableCanvasSurface.tsx b/packages/ui/src/components/workspace/DraggableCanvasSurface.tsx
index 9c9a762..2f05d4e 100644
--- a/packages/ui/src/components/workspace/DraggableCanvasSurface.tsx
+++ b/packages/ui/src/components/workspace/DraggableCanvasSurface.tsx
@@ -16,7 +16,7 @@ import Animated, {
   withSpring,
   withTiming,
 } from 'react-native-reanimated';
-import { runOnJS } from 'react-native-worklets';
+import { scheduleOnRN } from 'react-native-worklets';
 import { resolveDragTranslation } from './reorder';
 
 interface DraggableCanvasSurfaceProps {
@@ -69,8 +69,8 @@ export const DraggableCanvasSurface: React.FC<DraggableCanvasSurfaceProps> = ({
       zIndex.value = 100;
       shadowOpacity.value = withTiming(0.25, { duration: 150 });
       shadowRadius.value = withTiming(16, { duration: 150 });
-      runOnJS(hapticMedium)();
-      if (onDragStart) runOnJS(onDragStart)();
+      scheduleOnRN(hapticMedium);
+      if (onDragStart) scheduleOnRN(onDragStart);
     },
   });
 
@@ -90,7 +90,7 @@ export const DraggableCanvasSurface: React.FC<DraggableCanvasSurfaceProps> = ({
       if (!isDragging.value) return;
 
       if (!event.canceled && onDragEnd) {
-        runOnJS(onDragEnd)(id, { x: translateX.value, y: translateY.value });
+        scheduleOnRN(onDragEnd, id, { x: translateX.value, y: translateY.value });
       }
 
       // Snap back animation
diff --git a/packages/ui/vitest-setup.ts b/packages/ui/vitest-setup.ts
index ecbd7c1..36d977d 100644
--- a/packages/ui/vitest-setup.ts
+++ b/packages/ui/vitest-setup.ts
@@ -47,6 +47,7 @@ vi.mock('react-native-worklets', () => ({
     createRunInJSFn: (factory: unknown) => factory,
     createRunInContextFn: (factory: unknown) => factory,
   },
+  scheduleOnRN: (fn: (...args: unknown[]) => unknown, ...args: unknown[]) => fn(...args),
 }));
 
 vi.mock('react-native-skia', () => ({}));
```

**Verification**

- `pnpm --dir packages/ui exec vitest run`
- Drag a canvas card, swipe the TemporalScrubber, and dismiss a toast and an action sheet on device: their JS callbacks still fire.

---

## 11. D2-image-picker-MediaTypeOptions

**expo-image-picker 58: `MediaTypeOptions` is deprecated, pass `mediaTypes: ['images']`**

- **Severity:** `deprecated`
- **Location(s):**
  - `packages/scanner-kit/src/OCRScanner.tsx:100,115`
  - `packages/classroom/src/components/SubmissionModal.tsx:80,85`
  - `packages/scanner-kit/src/ScannerModal.tsx:111`
  - `packages/profile/src/components/EditProfileModal.tsx:145`
  - `packages/profile/src/components/AvatarDisplay.tsx:68`
  - `packages/community/src/hooks/useComposerLogic.ts:22`
- **Blast radius:** 6 files, 8 call sites. The web shim and the jest mock keep exporting `MediaTypeOptions`, which is harmless, so they're left unchanged.

**Current code**

```ts
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
```

**What goes wrong and why this fix**

Same meaning. `apps/gurudevi-mobile/app/(tabs)/library/tools/index.tsx:31,45` already uses `['images']`.

**Evidence (installed version)**

- tarball `expo-image-picker@58.0.10` `build/ImagePicker.types.d.ts:18-21` `@deprecated To set media types available in the image picker use an array of MediaType instead.` `export declare enum MediaTypeOptions`
- `:48` `export type MediaType = 'images' | 'videos' | 'livePhotos';`. `:420` `mediaTypes?: MediaType | MediaType[] | MediaTypeOptions;`
- Box type-check: `{ mediaTypes: ['images'] }` as `ImagePickerOptions` passes.

**Proposed change**

```diff
diff --git a/packages/classroom/src/components/SubmissionModal.tsx b/packages/classroom/src/components/SubmissionModal.tsx
index 8c460aa..d64cfbe 100644
--- a/packages/classroom/src/components/SubmissionModal.tsx
+++ b/packages/classroom/src/components/SubmissionModal.tsx
@@ -77,12 +77,12 @@ export default function SubmissionModal({
 
       const result = useCamera
         ? await ImagePicker.launchCameraAsync({
-            mediaTypes: ImagePicker.MediaTypeOptions.Images,
+            mediaTypes: ['images'],
             allowsEditing: true,
             quality: 0.7,
           })
         : await ImagePicker.launchImageLibraryAsync({
-            mediaTypes: ImagePicker.MediaTypeOptions.Images,
+            mediaTypes: ['images'],
             allowsEditing: true,
             quality: 0.7,
           });
diff --git a/packages/community/src/hooks/useComposerLogic.ts b/packages/community/src/hooks/useComposerLogic.ts
index 2cf93a1..0108853 100644
--- a/packages/community/src/hooks/useComposerLogic.ts
+++ b/packages/community/src/hooks/useComposerLogic.ts
@@ -19,7 +19,7 @@ export function useComposerLogic(groupId: string, onClose: () => void) {
 
   const pickImage = useCallback(async () => {
     const result = await ImagePicker.launchImageLibraryAsync({
-      mediaTypes: ImagePicker.MediaTypeOptions.Images,
+      mediaTypes: ['images'],
       allowsEditing: true,
       aspect: [4, 3],
       quality: 0.8,
diff --git a/packages/profile/src/components/AvatarDisplay.tsx b/packages/profile/src/components/AvatarDisplay.tsx
index f96c065..d39abd2 100644
--- a/packages/profile/src/components/AvatarDisplay.tsx
+++ b/packages/profile/src/components/AvatarDisplay.tsx
@@ -65,7 +65,7 @@ export function AvatarDisplay({
     }
 
     const result = await ImagePicker.launchImageLibraryAsync({
-      mediaTypes: ImagePicker.MediaTypeOptions.Images,
+      mediaTypes: ['images'],
       allowsEditing: true,
       aspect: [1, 1],
       quality: 0.9,
diff --git a/packages/profile/src/components/EditProfileModal.tsx b/packages/profile/src/components/EditProfileModal.tsx
index 7bccd7f..3c16c89 100644
--- a/packages/profile/src/components/EditProfileModal.tsx
+++ b/packages/profile/src/components/EditProfileModal.tsx
@@ -142,7 +142,7 @@ export default function EditProfileModal({
   const handlePickImage = async () => {
     try {
       const result = await ImagePicker.launchImageLibraryAsync({
-        mediaTypes: ImagePicker.MediaTypeOptions.Images,
+        mediaTypes: ['images'],
         allowsEditing: true,
         aspect: [1, 1],
         quality: 0.5,
diff --git a/packages/scanner-kit/src/OCRScanner.tsx b/packages/scanner-kit/src/OCRScanner.tsx
index aa23f13..5c838cf 100644
--- a/packages/scanner-kit/src/OCRScanner.tsx
+++ b/packages/scanner-kit/src/OCRScanner.tsx
@@ -97,7 +97,7 @@ export default function OCRScanner({
     if (!hasPermission) return;
 
     const result = await ImagePicker.launchCameraAsync({
-      mediaTypes: ImagePicker.MediaTypeOptions.Images,
+      mediaTypes: ['images'],
       allowsEditing: false,
       quality: 1,
     });
@@ -112,7 +112,7 @@ export default function OCRScanner({
   // Pick image from gallery
   const handlePickImage = async () => {
     const result = await ImagePicker.launchImageLibraryAsync({
-      mediaTypes: ImagePicker.MediaTypeOptions.Images,
+      mediaTypes: ['images'],
       allowsEditing: false,
       quality: 1,
     });
diff --git a/packages/scanner-kit/src/ScannerModal.tsx b/packages/scanner-kit/src/ScannerModal.tsx
index 81a24bf..fd8ceb8 100644
--- a/packages/scanner-kit/src/ScannerModal.tsx
+++ b/packages/scanner-kit/src/ScannerModal.tsx
@@ -108,7 +108,7 @@ export default function ScannerModal({
     setGalleryError(null);
     try {
       const result = await ImagePicker.launchImageLibraryAsync({
-        mediaTypes: ImagePicker.MediaTypeOptions.Images,
+        mediaTypes: ['images'],
         allowsEditing: true, // let user crop to QR area
         quality: 1,
       });
```

**Verification**

- `rg -n "MediaTypeOptions" packages -g '!**/__mocks__/**'` → 0
- Pick an avatar, a submission photo and a scanner image on device.

---

## 12. D4-image-manipulator

**expo-image-manipulator 58: `manipulateAsync` is deprecated, use `ImageManipulator.manipulate(...).renderAsync().saveAsync()`**

- **Severity:** `deprecated`
- **Location(s):**
  - `packages/library/src/api/image-to-pdf.ts:2,161-174`
  - `packages/profile/src/components/AvatarDisplay.tsx:77-81`
  - `packages/library/src/api/ocr.ts:550-572`
  - `apps/gurudevi-mobile/src/shims/expo-image-manipulator-web.js:19-27` (shim)
- **Blast radius:** 3 files, 3 call sites, plus the web shim (adds a named `ImageManipulator` export so web keeps working).

**Current code**

```ts
    const result = await manipulateAsync(uri, actions, {
      compress: ..., format: ..., base64: true,
    });
```

**What goes wrong and why this fix**

Behaviour is unchanged: the same rotate/resize steps, and the same compress, format and base64 save options. The contexts are released explicitly (they're native SharedObjects).

**Evidence (installed version)**

- tarball `expo-image-manipulator@58.0.12` `build/ImageManipulator.d.ts:15` `@deprecated It has been replaced by the new, contextual and object-oriented API. Use ImageManipulator.manipulate or useImageManipulator instead.`
- `build/ImageManipulator.types.d.ts:136` `manipulate(source, options?): ImageManipulatorContext`. `build/ImageManipulatorContext.d.ts` `resize/rotate/... : ImageManipulatorContext`, `renderAsync(): Promise<ImageRef>`. `build/ImageRef.d.ts:19` `saveAsync(options?: SaveOptions)` with `{base64, compress, format}`.
- Box type-check of all 3 rewritten call shapes passes.

**Proposed change**

```diff
diff --git a/apps/gurudevi-mobile/src/shims/expo-image-manipulator-web.js b/apps/gurudevi-mobile/src/shims/expo-image-manipulator-web.js
index 321a4f1..99b2fd1 100644
--- a/apps/gurudevi-mobile/src/shims/expo-image-manipulator-web.js
+++ b/apps/gurudevi-mobile/src/shims/expo-image-manipulator-web.js
@@ -19,6 +19,7 @@ const ImageManipulator = {
 module.exports = bridge('expo-image-manipulator', {
   __esModule: true,
   default: { manipulate: ImageManipulator.manipulate },
+  ImageManipulator,
   manipulateAsync: async (uri) => ({ uri, width: 0, height: 0 }),
   useImageManipulator: () => ({ manipulate: ImageManipulator.manipulate }),
   SaveFormat: { JPEG: 'jpeg', PNG: 'png', WEBP: 'webp' },
diff --git a/packages/library/src/api/image-to-pdf.ts b/packages/library/src/api/image-to-pdf.ts
index 6ca1d10..4534081 100644
--- a/packages/library/src/api/image-to-pdf.ts
+++ b/packages/library/src/api/image-to-pdf.ts
@@ -1,5 +1,5 @@
 import { PDFDocument, rgb, StandardFonts, type PDFImage } from 'pdf-lib';
-import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
+import { ImageManipulator, SaveFormat } from 'expo-image-manipulator';
 import { bytesToBase64, base64ToBytes } from '@repo/library/utils/bytes';
 
 export interface ImageToPDFOptions {
@@ -158,20 +158,23 @@ export class ImageToPDFAPI {
       uri = `file://${uri}`;
     }
 
-    const actions: Parameters<typeof manipulateAsync>[1] = [];
+    const context = ImageManipulator.manipulate(uri);
     const rotation = image.rotation ?? 0;
     if (rotation > 0) {
-      actions.push({ rotate: rotation });
+      context.rotate(rotation);
     }
     if (options.compress) {
-      actions.push({ resize: { width: options.maxDimension } });
+      context.resize({ width: options.maxDimension });
     }
 
-    const result = await manipulateAsync(uri, actions, {
+    const rendered = await context.renderAsync();
+    const result = await rendered.saveAsync({
       compress: options.format === 'jpg' ? options.quality : 1,
       format: options.format === 'jpg' ? SaveFormat.JPEG : SaveFormat.PNG,
       base64: true,
     });
+    context.release();
+    rendered.release();
     if (!result.base64) {
       throw new Error('Image processing returned no base64 output');
     }
diff --git a/packages/library/src/api/ocr.ts b/packages/library/src/api/ocr.ts
index 5e0c73b..ee071cb 100644
--- a/packages/library/src/api/ocr.ts
+++ b/packages/library/src/api/ocr.ts
@@ -548,28 +548,18 @@ export const ocrUtils = {
   ): Promise<string> {
     try {
       const ImageManipulator = await import('expo-image-manipulator').catch(() => null);
-      if (!ImageManipulator || !ImageManipulator.manipulateAsync) return imageUri;
-      const actions: unknown[] = [];
+      if (!ImageManipulator?.ImageManipulator?.manipulate) return imageUri;
       // contrast via brightness/contrast not directly exposed — use resize + compress as proxy for denoise
-      if (options.contrast !== undefined || options.denoise) {
-        // Slight resize to denoise + compress
-        actions.push({ resize: { width: 1800 } });
-      }
-      if (actions.length === 0) return imageUri;
-      const result = await (
-        ImageManipulator as unknown as {
-          manipulateAsync: (
-            uri: string,
-            actions: unknown[],
-            opts: unknown,
-          ) => Promise<{ uri: string }>;
-        }
-      ).manipulateAsync(imageUri, actions as never, {
+      if (options.contrast === undefined && !options.denoise) return imageUri;
+      // Slight resize to denoise + compress
+      const context = ImageManipulator.ImageManipulator.manipulate(imageUri).resize({ width: 1800 });
+      const rendered = await context.renderAsync();
+      const result = await rendered.saveAsync({
         compress: 0.9,
-        format:
-          (ImageManipulator as unknown as { SaveFormat: { JPEG: string } }).SaveFormat?.JPEG ??
-          'jpeg',
+        format: ImageManipulator.SaveFormat.JPEG,
       });
+      context.release();
+      rendered.release();
       return result.uri ?? imageUri;
     } catch {
       return imageUri;
diff --git a/packages/profile/src/components/AvatarDisplay.tsx b/packages/profile/src/components/AvatarDisplay.tsx
index d39abd2..987f9a0 100644
--- a/packages/profile/src/components/AvatarDisplay.tsx
+++ b/packages/profile/src/components/AvatarDisplay.tsx
@@ -74,11 +74,17 @@ export function AvatarDisplay({
 
     setUploading(true);
     try {
-      const manipulated = await ImageManipulator.manipulateAsync(
-        result.assets[0].uri,
-        [{ resize: { width: 400, height: 400 } }],
-        { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG },
-      );
+      const context = ImageManipulator.ImageManipulator.manipulate(result.assets[0].uri).resize({
+        width: 400,
+        height: 400,
+      });
+      const rendered = await context.renderAsync();
+      const manipulated = await rendered.saveAsync({
+        compress: 0.85,
+        format: ImageManipulator.SaveFormat.JPEG,
+      });
+      context.release();
+      rendered.release();
 
       const cachePath = getCachePath(userId);
       if (File && cachePath) {
```

**Verification**

- Image → PDF export (library), avatar upload (profile), and OCR preprocessing on device.
- Web: the avatar picker still returns a URI through the shim.

---

## 13. D5-notifications-shouldShowAlert

**expo-notifications 58.1: `shouldShowAlert` is deprecated (the banner/list keys are already set)**

- **Severity:** `deprecated`
- **Location(s):**
  - `apps/gurudevi-mobile/src/providers/PushNotificationProvider.tsx:24`
  - `packages/self/src/components/RemindersManager.tsx:109` (the `as any` cast at :115 is no longer needed and is removed)
- **Blast radius:** 2 files, 2 call sites. Each foreground notification currently prints a deprecation `console.warn`.

**Current code**

```ts
      handleNotification: async () => ({
        shouldShowAlert: true,
        ...
        shouldShowBanner: true,
        shouldShowList: true,
```

**What goes wrong and why this fix**

Both handlers already pass `shouldShowBanner` and `shouldShowList`, so removing the deprecated key changes nothing visible and silences the warning.

**Evidence (installed version)**

- tarball `expo-notifications@58.1.0` `build/Notifications.types.d.ts` `shouldShowAlert` `@deprecated instead, specify \`shouldShowBanner\` and / or \`shouldShowList\``
- `build/NotificationsHandler.js:84-85` `if (behavior.shouldShowAlert) console.warn('[expo-notifications]: \`shouldShowAlert\` is deprecated...')`
- Not flagged by the index. Found by matching every `@deprecated` symbol in the installed .d.ts files against the code.

**Proposed change**

```diff
diff --git a/apps/gurudevi-mobile/src/providers/PushNotificationProvider.tsx b/apps/gurudevi-mobile/src/providers/PushNotificationProvider.tsx
index ea3460f..94a0919 100644
--- a/apps/gurudevi-mobile/src/providers/PushNotificationProvider.tsx
+++ b/apps/gurudevi-mobile/src/providers/PushNotificationProvider.tsx
@@ -21,7 +21,6 @@ import { isQRDeepLink, normalizeAcceptedInternalRoute } from '@/lib/deepLinks/ur
 if (Platform.OS !== 'web') {
   Notifications.setNotificationHandler({
     handleNotification: async () => ({
-      shouldShowAlert: true,
       shouldPlaySound: true,
       shouldSetBadge: true,
       shouldShowBanner: true,
diff --git a/packages/self/src/components/RemindersManager.tsx b/packages/self/src/components/RemindersManager.tsx
index 65e52b8..bb9ff6f 100644
--- a/packages/self/src/components/RemindersManager.tsx
+++ b/packages/self/src/components/RemindersManager.tsx
@@ -106,13 +106,12 @@ if (Platform.OS !== 'web') {
   try {
     Notifications.setNotificationHandler({
       handleNotification: async () => ({
-        shouldShowAlert: true,
         shouldPlaySound: false,
         shouldSetBadge: false,
         shouldShowBanner: true,
         shouldShowList: true,
       }),
-    } as any);
+    });
   } catch {
     // Notification handler setup failed, ignore gracefully
   }
```

**Verification**

- Receive a push in the foreground: the banner still shows and Metro logs no deprecation warning.

---

## 14. D6-rngh-Gesture-builder

**RNGH 3.3.0: v2 `Gesture` builder is deprecated, use the hook API (`usePanGesture`)**

- **Severity:** `deprecated`
- **Location(s):**
  - `packages/ui/src/components/ui/actionsheet/index.tsx:11,94-106`
  - `packages/self/src/components/SelfNavigator.tsx:16`
- **Blast radius:** 2 files: 1 live builder (the action sheet's drag-to-dismiss) and 1 unused import (SelfNavigator imports `Gesture` and `GestureDetector` but uses neither).

**Current code**

```ts
  const panGesture = Gesture.Pan()
    .activeOffsetY?.(8)
    .failOffsetX?.([-24, 24])
    .onUpdate(...)
    .onEnd((event: { canceled?: boolean }) => { ... });
```

**What goes wrong and why this fix**

This matches the pattern already used in `TemporalScrubber.tsx:36-49`, `LotusPetalFAB.tsx` and `DraggableCanvasSurface.tsx`. `onEnd` maps to `onDeactivate` (with `event.canceled`). The hook is called before the early `return null`, so the rules of hooks hold. Depends on D3, because the hunk context includes `scheduleOnRN`.

**Evidence (installed version)**

- tarball `react-native-gesture-handler@3.3.0` `lib/typescript/handlers/gestures/gestureObjects.d.ts:14` `@deprecated \`Gesture\` builder API is deprecated and will be removed...` and `:32` `Gesture.Pan() is deprecated ... use usePanGesture instead`
- `lib/typescript/v3/hooks/gestures/pan/usePanGesture.d.ts`, `v3/types/ConfigTypes.d.ts:11-12` (`onUpdate`, `onDeactivate`), `v3/types/EventTypes.d.ts` `GestureEndEvent = { canceled: boolean } & ...`
- Box type-check of the proposed `usePanGesture({...})` passes.

**Proposed change**

```diff
diff --git a/packages/self/src/components/SelfNavigator.tsx b/packages/self/src/components/SelfNavigator.tsx
index dff7ca7..b237035 100644
--- a/packages/self/src/components/SelfNavigator.tsx
+++ b/packages/self/src/components/SelfNavigator.tsx
@@ -13,7 +13,6 @@ import { tokens } from '@repo/ui/tokens';
 import { hapticLight, hapticMedium, hapticSelection } from '@repo/ui/utils/haptics';
 import React, { useCallback, useState } from 'react';
 import { Platform, useWindowDimensions } from 'react-native';
-import { Gesture, GestureDetector } from 'react-native-gesture-handler';
 import Animated, { FadeIn, FadeOut, LinearTransition } from 'react-native-reanimated';
 
 export interface SelfNavigatorProps {
diff --git a/packages/ui/src/components/ui/actionsheet/index.tsx b/packages/ui/src/components/ui/actionsheet/index.tsx
index 318505a..b1fbb4e 100644
--- a/packages/ui/src/components/ui/actionsheet/index.tsx
+++ b/packages/ui/src/components/ui/actionsheet/index.tsx
@@ -8,7 +8,7 @@ import { cn } from '@repo/ui/utils/classNames';
 import type React from 'react';
 import { createContext, useContext, useEffect, useMemo, useState } from 'react';
 import { type ViewProps } from 'react-native';
-import { Gesture, GestureDetector } from 'react-native-gesture-handler';
+import { GestureDetector, usePanGesture } from 'react-native-gesture-handler';
 import Animated, {
   SlideInDown,
   SlideOutDown,
@@ -91,19 +91,20 @@ export interface ActionsheetContentProps {
 export const ActionsheetContent = ({ children, className }: ActionsheetContentProps) => {
   const { isOpen, onClose } = useActionsheet();
   const translateY = useSharedValue(0);
-  const panGesture = Gesture.Pan()
-    .activeOffsetY?.(8)
-    .failOffsetX?.([-24, 24])
-    .onUpdate((event: { translationY: number }) => {
+  const panGesture = usePanGesture({
+    activeOffsetY: 8,
+    failOffsetX: [-24, 24],
+    onUpdate: (event) => {
       'worklet';
       translateY.value = Math.max(0, event.translationY);
-    })
-    .onEnd((event: { canceled?: boolean }) => {
+    },
+    onDeactivate: (event) => {
       'worklet';
       const shouldClose = !event.canceled && translateY.value > 120;
       if (shouldClose) scheduleOnRN(onClose);
       translateY.value = withSpring(0);
-    });
+    },
+  });
   const animatedStyle = useAnimatedStyle(() => ({
     transform: [{ translateY: translateY.value }],
   }));
```

**Verification**

- Open any Actionsheet and drag down past 120 px: it closes, and a short drag springs back.

---

## 15. D7-rn-ImageBackground

**React Native 0.88: `ImageBackground` is deprecated, use a View with an absolutely positioned Image**

- **Severity:** `deprecated`
- **Location(s):**
  - `packages/ui/src/components/ui/image-background/index.tsx:3-12`
- **Blast radius:** 1 wrapper file. 2 consumer files go through `@repo/ui/primitives` (`packages/library/src/components/LibraryThumbnailCard.tsx`, `packages/library/src/screens/LibraryScreen.tsx`). The public props stay the same.

**Current code**

```ts
import { type ImageBackgroundProps, ImageBackground as RNImageBackground } from 'react-native';
const StyledImageBackground = styled(RNImageBackground as React.ComponentType<any>);
```

**What goes wrong and why this fix**

The wrapper is re-implemented the way RN recommends, so callers don't change. The ref now points at the container `View`. Neither consumer passes a ref (check before merging).

**Evidence (installed version)**

- `react-native@0.88.0-rc.3` `types_generated/Libraries/Image/ImageBackground.d.ts:44-48` "ImageBackground is deprecated and will be removed in a future release. Use a `View` with an absolutely positioned `Image` instead. @deprecated"
- Box type-check against RN 0.88.0-rc.3 types: the proposed `forwardRef<React.ComponentRef<typeof View>, ImageBackgroundProps & {className?}>` passes. A plain `forwardRef<View,...>` does **not**, because View is a function component in 0.88.

**Proposed change**

```diff
diff --git a/packages/ui/src/components/ui/image-background/index.tsx b/packages/ui/src/components/ui/image-background/index.tsx
index a9c5614..a77e558 100644
--- a/packages/ui/src/components/ui/image-background/index.tsx
+++ b/packages/ui/src/components/ui/image-background/index.tsx
@@ -1,14 +1,32 @@
 import { styled } from 'nativewind';
 import React from 'react';
-import { type ImageBackgroundProps, ImageBackground as RNImageBackground } from 'react-native';
+import { Image, type ImageBackgroundProps, StyleSheet, View } from 'react-native';
 
-const StyledImageBackground = styled(RNImageBackground as React.ComponentType<any>);
+// RN 0.88 marks ImageBackground @deprecated ("Use a `View` with an absolutely positioned `Image`
+// instead", types_generated/Libraries/Image/ImageBackground.d.ts). Same public props, built from
+// the recommended primitives.
+const StyledView = styled(View as React.ComponentType<any>);
 
 export const ImageBackground = React.forwardRef<
-  RNImageBackground,
+  React.ComponentRef<typeof View>,
   ImageBackgroundProps & { className?: string }
->(({ className, ...props }, ref) => (
-  <StyledImageBackground {...props} ref={ref} className={className} />
-));
+>(
+  ({ className, children, style, imageStyle, imageRef, importantForAccessibility, ...imageProps }, ref) => (
+    <StyledView
+      ref={ref}
+      className={className}
+      style={style}
+      importantForAccessibility={importantForAccessibility}
+    >
+      <Image
+        {...imageProps}
+        ref={imageRef}
+        importantForAccessibility={importantForAccessibility}
+        style={[StyleSheet.absoluteFill, imageStyle]}
+      />
+      {children}
+    </StyledView>
+  ),
+);
 
 ImageBackground.displayName = 'ImageBackground';
```

**Verification**

- Library grid and Library screen header images render the same (compare screenshots before and after).

---

## 16. D8-reanimated-Extrapolate

**Reanimated 4.7.1: `Extrapolate` is deprecated, use `Extrapolation`**

- **Severity:** `deprecated`
- **Location(s):**
  - `packages/ui/src/archive/LotusPetalFAB.complex.tsx:21,290,293`
- **Blast radius:** 1 archived file, 2 call sites. `packages/ui/src/archive/` isn't imported anywhere (rg).

**Current code**

```ts
interpolate(scrollY.value, [0, 100], [0, 100], Extrapolate.CLAMP)
```

**What goes wrong and why this fix**

A rename that keeps the archive compiling once the alias is removed. Deleting the archive is the other option.

**Evidence (installed version)**

- `react-native-reanimated@4.7.1` `lib/typescript/interpolateColor.d.ts:2-3` `/** @deprecated Please use Extrapolation instead */ export declare const Extrapolate: typeof Extrapolation;`

**Proposed change**

```diff
diff --git a/packages/ui/src/archive/LotusPetalFAB.complex.tsx b/packages/ui/src/archive/LotusPetalFAB.complex.tsx
index 56d24fe..092ba1a 100644
--- a/packages/ui/src/archive/LotusPetalFAB.complex.tsx
+++ b/packages/ui/src/archive/LotusPetalFAB.complex.tsx
@@ -18,7 +18,7 @@ import { type FC, useCallback, useEffect, useMemo, useRef, useState } from 'reac
 import { Dimensions, Image, PanResponder, StyleSheet } from 'react-native';
 import Animated, {
   Easing,
-  Extrapolate,
+  Extrapolation,
   interpolate,
   type SharedValue,
   useAnimatedStyle,
@@ -287,10 +287,10 @@ const LotusPetalFAB: FC<LotusPetalFABProps> = ({
     return {
       transform: [
         {
-          translateY: interpolate(scrollY.value, [0, 100], [0, 100], Extrapolate.CLAMP),
+          translateY: interpolate(scrollY.value, [0, 100], [0, 100], Extrapolation.CLAMP),
         },
       ],
-      opacity: interpolate(scrollY.value, [0, 50, 100], [1, 0.5, 0], Extrapolate.CLAMP),
+      opacity: interpolate(scrollY.value, [0, 50, 100], [1, 0.5, 0], Extrapolation.CLAMP),
     };
   });
 
```

**Verification**

- `pnpm --dir packages/ui exec tsc --noEmit`

---

## 17. T2-stale-ambient-stubs

**Hand-written ambient stubs for expo-background-task and expo-task-manager hide the real SDK 58 types**

- **Severity:** `types-only`
- **Location(s):**
  - `packages/core/src/types/external-modules.d.ts:1-23` (referenced by runtimeAdapter.ts:1 `/// <reference path=...>`)
  - `apps/gurudevi-mobile/src/types/expo-background-task.d.ts:1-30` (whole file)
  - `packages/types-shim/index.d.ts:62-93`
- **Blast radius:** 3 files (2 blocks each, and 1 whole file). They're the reason S2 type-checks today.

**Current code**

```ts
declare module 'expo-background-task' {
  export enum BackgroundTaskResult { NewData = 1, NoData = 2, Failed = 3 }
  export enum BackgroundTaskStatus { Available = 1, Restricted = 2, Denied = 3 }
```

**What goes wrong and why this fix**

Both packages ship their own .d.ts at the installed versions (58.0.10 and 58.0.11), and these stubs describe the pre-SDK-53 API. Delete them so `tsc` sees the truth. The `react-native-gesture-handler` block in types-shim (`Gesture: any`, ...) masks RNGH types in the same way. It's a follow-up and isn't in this patch.

**Evidence (installed version)**

- `expo-background-task@58.0.10` `build/BackgroundTask.types.d.ts` (see S2). `expo-task-manager@58.0.11` `build/TaskManager.d.ts:85` `defineTask<T>(taskName, taskExecutor: TaskManagerTaskExecutor<T>)`

**Proposed change**

```diff
diff --git a/apps/gurudevi-mobile/src/types/expo-background-task.d.ts b/apps/gurudevi-mobile/src/types/expo-background-task.d.ts
deleted file mode 100644
index ac4c5c6..0000000
--- a/apps/gurudevi-mobile/src/types/expo-background-task.d.ts
+++ /dev/null
@@ -1,30 +0,0 @@
-declare module 'expo-task-manager' {
-  export function defineTask(taskName: string, task: (...args: any[]) => any): void;
-  export function isTaskRegisteredAsync(taskName: string): Promise<boolean>;
-}
-
-declare module 'expo-background-task' {
-  export const BackgroundTaskResult: {
-    NewData: number;
-    NoData: number;
-    Failed: number;
-  };
-  export const BackgroundTaskStatus: {
-    Available: number;
-    Denied: number;
-    Restricted: number;
-  };
-  export type BackgroundTaskOptions = {
-    minimumInterval?: number;
-    stopOnTerminate?: boolean;
-    startOnBoot?: boolean;
-  };
-
-  export function getStatusAsync(): Promise<number>;
-  export function registerTaskAsync(
-    taskName: string,
-    options?: BackgroundTaskOptions,
-  ): Promise<void>;
-  export function unregisterTaskAsync(taskName: string): Promise<void>;
-  export function triggerTaskWorkerForTestingAsync(taskName: string): Promise<void>;
-}
diff --git a/packages/core/src/types/external-modules.d.ts b/packages/core/src/types/external-modules.d.ts
index c4d5363..b3feca5 100644
--- a/packages/core/src/types/external-modules.d.ts
+++ b/packages/core/src/types/external-modules.d.ts
@@ -1,27 +1,3 @@
-declare module 'expo-background-task' {
-  export enum BackgroundTaskResult {
-    NewData = 1,
-    NoData = 2,
-    Failed = 3,
-  }
-
-  export enum BackgroundTaskStatus {
-    Available = 1,
-    Restricted = 2,
-    Denied = 3,
-  }
-
-  export function registerTaskAsync(name: string, options?: Record<string, unknown>): Promise<void>;
-  export function unregisterTaskAsync(name: string): Promise<void>;
-  export function getStatusAsync(): Promise<BackgroundTaskStatus>;
-  export function triggerTaskWorkerForTestingAsync(name: string): Promise<void>;
-}
-
-declare module 'expo-task-manager' {
-  export function defineTask(name: string, task: () => Promise<number> | number): void;
-  export function isTaskRegisteredAsync(name: string): Promise<boolean>;
-}
-
 declare module 'expo-font' {
   export function loadAsync(assets: Record<string, unknown> | unknown[]): Promise<void>;
 }
diff --git a/packages/types-shim/index.d.ts b/packages/types-shim/index.d.ts
index af8daa8..de370e3 100644
--- a/packages/types-shim/index.d.ts
+++ b/packages/types-shim/index.d.ts
@@ -59,35 +59,4 @@ declare module 'react-native-gesture-handler' {
   export const State: any;
 }
 
-declare module 'expo-task-manager' {
-  export function defineTask(taskName: string, task: (...args: any[]) => any): void;
-  export function isTaskRegisteredAsync(taskName: string): Promise<boolean>;
-}
-
-declare module 'expo-background-task' {
-  export const BackgroundTaskResult: {
-    NewData: number;
-    NoData: number;
-    Failed: number;
-  };
-  export const BackgroundTaskStatus: {
-    Available: number;
-    Denied: number;
-    Restricted: number;
-  };
-  export type BackgroundTaskOptions = {
-    minimumInterval?: number;
-    stopOnTerminate?: boolean;
-    startOnBoot?: boolean;
-  };
-
-  export function getStatusAsync(): Promise<number>;
-  export function registerTaskAsync(
-    taskName: string,
-    options?: BackgroundTaskOptions,
-  ): Promise<void>;
-  export function unregisterTaskAsync(taskName: string): Promise<void>;
-  export function triggerTaskWorkerForTestingAsync(taskName: string): Promise<void>;
-}
-
 export {};
```

**Verification**

- Apply with S2. `tsc --noEmit` in packages/core and apps/gurudevi-mobile should be clean. Any new error is a real API mismatch.

---

## 18. T1-keychain-options

**react-native-keychain 10.0.0: `Keychain.Options` doesn't exist (an ambient stub hides it)**

- **Severity:** `types-only`
- **Location(s):**
  - `packages/core/src/adapters/native/NativeDeviceIdentityAdapter.ts:22,46`
  - `packages/core/src/types/external-modules.d.ts:29-63`
- **Blast radius:** 1 file, 2 annotations. The stub block in packages/core/src/types/external-modules.d.ts:29-63 is also removed. Runtime calls are unaffected.

**Current code**

```ts
    const storageOptions: Keychain.Options = {
```

**What goes wrong and why this fix**

10.0.0 splits the options into `SetOptions`, `GetOptions` and `BaseOptions`. The first object is used for get and set, so it takes the intersection. The second is get-only.

**Evidence (installed version)**

- tarball `react-native-keychain@10.0.0` `lib/typescript/types.d.ts:21` `BaseOptions`, `:37` `SetOptions`, `:64` `GetOptions`. No `Options`. `lib/typescript/index.d.ts:17,35,49` setGenericPassword(…SetOptions), getGenericPassword(GetOptions), hasGenericPassword(BaseOptions)
- Box type-check: `Keychain.Options` gives TS2694 `has no exported member 'Options'`. The proposed annotations and all 4 calls pass.

**Proposed change**

```diff
diff --git a/packages/core/src/adapters/native/NativeDeviceIdentityAdapter.ts b/packages/core/src/adapters/native/NativeDeviceIdentityAdapter.ts
index 23f3004..b491863 100644
--- a/packages/core/src/adapters/native/NativeDeviceIdentityAdapter.ts
+++ b/packages/core/src/adapters/native/NativeDeviceIdentityAdapter.ts
@@ -19,7 +19,7 @@ export class NativeDeviceIdentityAdapter implements IDeviceIdentity {
   }
 
   async generateHardwareKey(alias: string): Promise<string> {
-    const storageOptions: Keychain.Options = {
+    const storageOptions: Keychain.SetOptions & Keychain.GetOptions = {
       service: alias,
       accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
       securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
@@ -43,7 +43,7 @@ export class NativeDeviceIdentityAdapter implements IDeviceIdentity {
   async signWithHardwareKey(alias: string, challenge: string): Promise<string> {
     // This requires a native module that supports ECC/RSA signing (like react-native-keychain's key-pair support)
     // For now, we perform a hardware-bound 'Fetch' of the ID to prove access.
-    const storageOptions: Keychain.Options = {
+    const storageOptions: Keychain.GetOptions = {
       service: alias,
       authenticationPrompt: {
         title: 'Authorize Sanctuary',
diff --git a/packages/core/src/types/external-modules.d.ts b/packages/core/src/types/external-modules.d.ts
index 86d867c..c4d5363 100644
--- a/packages/core/src/types/external-modules.d.ts
+++ b/packages/core/src/types/external-modules.d.ts
@@ -25,39 +25,3 @@ declare module 'expo-task-manager' {
 declare module 'expo-font' {
   export function loadAsync(assets: Record<string, unknown> | unknown[]): Promise<void>;
 }
-
-declare module 'react-native-keychain' {
-  export interface Options {
-    service?: string;
-    accessible?: string;
-    securityLevel?: string;
-    authenticationPrompt?: {
-      title?: string;
-      subtitle?: string;
-    };
-    accessControl?: string;
-  }
-
-  export const ACCESSIBLE: {
-    WHEN_UNLOCKED_THIS_DEVICE_ONLY: string;
-  };
-
-  export const SECURITY_LEVEL: {
-    SECURE_HARDWARE: string;
-  };
-
-  export const ACCESS_CONTROL: {
-    BIOMETRY_CURRENT_SET: string;
-  };
-
-  export function getSupportedBiometryType(): Promise<string | null>;
-  export function hasGenericPassword(options?: Options): Promise<boolean>;
-  export function getGenericPassword(
-    options?: Options,
-  ): Promise<{ username: string; password: string } | false>;
-  export function setGenericPassword(
-    username: string,
-    password: string,
-    options?: Options,
-  ): Promise<boolean>;
-}
```

**Verification**

- `pnpm --dir packages/core exec tsc --noEmit`

---

## 19. I1-react-createElement

**Legacy `React.createElement(...)` calls (mostly in tests, mocks and web shims)**

- **Severity:** `info`
- **Location(s):**
  - `apps/gurudevi-mobile/jest-setup.ts` (most)
  - `apps/gurudevi-mobile/__mocks__/*`
  - `apps/gurudevi-mobile/src/shims/{reanimated-web,skia-web}.js`
  - `packages/ui/{vitest-*.ts,__mocks__/lucide-icons.js,src/components/EmptyState.tsx}`
  - `packages/form-builder/src/services.ts`
  - `packages/admin/test-shims/*`
- **Blast radius:** 22 files, 57 calls (PC rg). The index lists 30 pattern variants.

**Current code**

```ts
React.createElement(View, { testID }, children)
```

**What goes wrong and why this fix**

createElement is still fully supported in React 19.3. Plain .js shims and mocks often can't use JSX. No change is proposed.

**Evidence (installed version)**

- https://react.dev/reference/react/createElement (index pattern rows, version_checked 19.3.0)

**Proposed change**

_No code change proposed._

**Verification**

- None needed.

---

## 20. I2-fs-legacy-subpath

**`expo-file-system/legacy` subpath is still used (works, but isn't the current API)**

- **Severity:** `info`
- **Location(s):**
  - `packages/library/src/hooks/useLoadedBytes.ts:46-49`
  - `packages/core/src/hooks/useMediaDownloader.ts:84,128` (and :190 createDownloadResumable, left as is)
  - `packages/self/src/components/VoiceJournaling.tsx:22,180-226`
- **Blast radius:** 3 files. The optional diff migrates 2 of them (useLoadedBytes, the useMediaDownloader index write). VoiceJournaling.tsx (documentDirectory, makeDirectoryAsync, copyAsync, readAsStringAsync) and the `createDownloadResumable` progress download are left on legacy.

**Current code**

```ts
const FileSystem = await import('expo-file-system/legacy');
```

**What goes wrong and why this fix**

`/legacy` is still exported and not marked deprecated in 58.0.5, so this is optional. Check `File#bytes()` with Android `content://` URIs before switching useLoadedBytes.

**Evidence (installed version)**

- `expo-file-system@58.0.5` `package.json` exports `./legacy`. `build/legacy/*.d.ts` have no deprecation on functions. `build/internal/NativeFileSystem.types.d.ts:145` `bytes(): Promise<Uint8Array>`, `:155` `write(...)`

**Proposed change**

```diff
diff --git a/packages/core/src/hooks/useMediaDownloader.ts b/packages/core/src/hooks/useMediaDownloader.ts
index 97c4cfe..2f104ff 100644
--- a/packages/core/src/hooks/useMediaDownloader.ts
+++ b/packages/core/src/hooks/useMediaDownloader.ts
@@ -81,7 +81,6 @@ export function useMediaDownloader({ resourceId, url, mimeType }: UseMediaDownlo
   const updateLRU = useCallback(async (fileName: string) => {
     try {
       const { Paths, File } = await import('expo-file-system');
-      const { writeAsStringAsync } = await import('expo-file-system/legacy');
       const indexFile = new File(Paths.cache, 'gurudevi_cache_index.json');
       let index: CacheIndex = {};
       if (indexFile.exists) {
@@ -125,7 +124,7 @@ export function useMediaDownloader({ resourceId, url, mimeType }: UseMediaDownlo
       } catch {
         // Disk capacity check failed; proceed without eviction
       }
-      await writeAsStringAsync(indexFile.uri, JSON.stringify(index));
+      await indexFile.write(JSON.stringify(index));
     } catch (error) {
       console.warn('[MediaDownloader] Cache index update failed', error);
     }
diff --git a/packages/library/src/hooks/useLoadedBytes.ts b/packages/library/src/hooks/useLoadedBytes.ts
index fccc59c..1d747e1 100644
--- a/packages/library/src/hooks/useLoadedBytes.ts
+++ b/packages/library/src/hooks/useLoadedBytes.ts
@@ -43,11 +43,8 @@ export function useLoadedBytes(params: Record<string, string | string[] | undefi
           const buffer = await response.arrayBuffer();
           setBytes(new Uint8Array(buffer));
         } else {
-          const FileSystem = await import('expo-file-system/legacy');
-          const base64Payload = await FileSystem.readAsStringAsync(uri, {
-            encoding: FileSystem.EncodingType.Base64,
-          });
-          setBytes(base64ToBytes(base64Payload));
+          const { File } = await import('expo-file-system');
+          setBytes(await new File(uri).bytes());
         }
       }
     } catch (e: unknown) {
```

**Verification**

- Open a PDF and a CSV from a local URI. Download media twice and confirm the cache index JSON updates.

---

## 21. I3-phantom-deps

**Undeclared (phantom) dependencies: @repo/ui → nitro-theme-transition, @repo/core → cedar-wasm**

- **Severity:** `info`
- **Location(s):**
  - `packages/ui/src/theme/nitroThemeTransition.ts:6` (`require('react-native-nitro-theme-transition')`); packages/ui/package.json has no entry
  - `packages/core/src/logic/permissions/cedarClientEvaluator.ts:37` (`import('@cedar-policy/cedar-wasm/web')`); packages/core/package.json has no entry (only @repo/policies declares `^4.12.0`)
- **Blast radius:** 2 manifests. The code works only because pnpm hoists the packages from gurudevi-mobile and @repo/policies.

**Current code**

```ts
(no manifest entry)
```

**What goes wrong and why this fix**

Declare them as peers at the installed versions. If you'd rather core own cedar-wasm, use `dependencies` instead. Run `pnpm install --lockfile-only` afterwards.

**Evidence (installed version)**

- Index: package_version shows cedar-wasm only under `@repo/policies` and nitro-theme-transition only under `gurudevi-mobile`.

**Proposed change**

```diff
diff --git a/packages/core/package.json b/packages/core/package.json
index ddfbdcc..c64e49b 100644
--- a/packages/core/package.json
+++ b/packages/core/package.json
@@ -377,6 +377,7 @@
     "test:ui": "node ../../scripts/run-and-report.mjs --cmd \"vitest --ui\" --name \"packages_core-test_ui\" --evidence-level G1"
   },
   "peerDependencies": {
+    "@cedar-policy/cedar-wasm": "^4.12.0",
     "@react-native-async-storage/async-storage": "2.2.0",
     "@react-native-community/netinfo": ">=12.0.1",
     "@sentry/react-native": "*",
diff --git a/packages/ui/package.json b/packages/ui/package.json
index ecd1e19..5620c77 100644
--- a/packages/ui/package.json
+++ b/packages/ui/package.json
@@ -930,6 +930,7 @@
     "react-native": ">=0.88.0-rc.3",
     "react-native-enriched-markdown": "^1.0.1",
     "react-native-keyboard-controller": "1.22.4",
+    "react-native-nitro-theme-transition": "1.0.0",
     "react-native-safe-area-context": ">=5.10.0",
     "react-native-webview": ">=13.16.0",
     "react-native-worklets": ">=0.13.0",
```

**Verification**

- `pnpm install --lockfile-only`, then `tsc --noEmit` in packages/ui and packages/core.

---

## 22. I4-carousel-expo58

**react-native-reanimated-carousel 5.1.1 lists Expo SDK 54–57 as validated. 58 isn't in its matrix yet**

- **Severity:** `info`
- **Location(s):**
  - `packages/ui/package.json:900` (`^5.1.1`; the mobile app declares the same range)
- **Blast radius:** 1 dependency (the W4 consumer only).

**Current code**

```ts
"react-native-reanimated-carousel": "^5.1.1"
```

**What goes wrong and why this fix**

All other ranges in its table are satisfied by the pins (RN 0.80+, Reanimated ≥4.1.0, RNGH ≥2.9.0 <4.0.0 → 3.3.0 OK, Worklets ≥0.5.0). No action, consistent with the leading-edge stance. Re-check when the carousel adds SDK 58.

**Evidence (installed version)**

- tarball README.md:84 (§ Version compatibility): `v5 | 54–57 validated | 0.80+ | 4.1.0+ | >=2.9.0 <4.0.0 | 0.5.0+`

**Proposed change**

_No code change proposed._

**Verification**

- None needed.

---

## Appendix A: how the evidence was produced

- **Location check:** every file:line above came from `rg` on the PC (scoped to `apps/` and `packages/`) and from a byte-exact read-only snapshot of those files on the box. Nothing in `C:\x` was written.
- **Type-check harness (box):** a scratch project with the exact installed versions (cedar-wasm 4.12.0, expo-file-system 58.0.5, expo-background-task 58.0.10, expo-task-manager 58.0.11, expo-image-picker 58.0.10, expo-image-manipulator 58.0.12, expo-notifications 58.1.0, react-native 0.88.0-rc.3, keychain 10.0.0, RNGH 3.3.0, worklets 0.13.0, reanimated 4.7.1, carousel 5.1.1, nitro-theme-transition 1.0.0).
  - The proposed call shapes compile under `tsc --strict`.
  - A negative file containing the current patterns fails with the expected errors: TS2613 (carousel default import); TS2339 (`evaluate`, `startTransition`, `BackgroundTaskResult.NewData`, `BackgroundTaskStatus.Denied`); TS2694 (`Keychain.Options`).
- **Syntax check:** every file the patch touches parses with 0 errors after the patch (TypeScript `createSourceFile`).
- **Patch check:** `git apply --check FIX_PLAN.patch` is clean against the snapshot. Run it again on `C:\x` before applying, in case files changed since 2026-10-06.
- **Deprecation sweep:** every `@deprecated` symbol in the installed `.d.ts` of the deps was matched against imports in the code. That sweep found D3, D5, D6 and D7, which the index's pattern table had missed.

## Appendix B: corrections to the RN Terrain index (not counted as items)

| Index claim | Finding |
|---|---|
| `react-native` `Clipboard.setStringAsync`: removed upstream (ContactLinktree.tsx:17/197, SocialSanctuary.tsx:15/93/99) | False positive. Both files `import * as Clipboard from 'expo-clipboard'`, which is the current API. Relabel these rows `current`. |
| zod `nativeEnum`: deprecated | 0 call sites in apps/ or packages/. Nothing to fix. |
| `@supabase/ssr` deprecated cookie overload | False positive. The flagged overload isn't what the code calls; checked in the index review pass. |
| astro `z` import: deprecated | Already imported from `astro/zod`. |
| reanimated `Layout`: ~13 sites | 22 sites in 15 files (`MoodLotus.web.tsx` was missing). See D1. |
| worklets `runOnJS`: current | Deprecated in 0.13.0. See D3. |
| `ImageBackground`, `shouldShowAlert`, background-task enums, stale peer ranges | Not in the index. See D7, D5, S2 and S4. |
| 45 dependencies with no import found | Listed in `/workspace/rn-packages/capabilities/shard_devunused/UNUSED_VERDICTS.md` as review candidates. Out of scope for this plan; removing deps needs a separate decision. |

## Appendix C: follow-ups noticed but not in the patch

- `packages/types-shim/index.d.ts` also declares `react-native-gesture-handler` (`Gesture: any`, ...) and `react-native-gifted-charts` as ambient `any` modules. These mask real types the same way T2's stubs did.
- `apps/gurudevi-mobile/src/shims/react-native-web-augmented.js` has no importers and could be deleted (S3).
- `packages/ui/src/archive/` isn't imported anywhere and could be deleted instead of applying D8.
- Hermes and WebAssembly: decide what the native permission fallback should be (W1).
- The carousel README contains a line telling AI agents to read a migration doc and upgrade. It was treated as data and not acted on.
