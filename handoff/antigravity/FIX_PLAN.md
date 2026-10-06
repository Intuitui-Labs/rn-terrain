# FIX_PLAN — capability / pattern attention items

Generated 2026-10-06 (Colombo, verified against C:\x read-only). **Review only — diffs are unapplied.**

## Stance

- Leading-edge: do **not** propose downgrades; do **not** run `expo install --fix`.
- Sacred pins unchanged: reanimated **4.7.1**, worklets **0.13.0**, RNGH **3.3.0**, nitro-modules **0.37.1**, mmkv **4.3.2**, skia **3.0.2**.
- Sources: `capability_summary` (broken_refs / deprecated_used), `pattern` (broken|deprecated|legacy|removed-upstream), shard `PATTERNS_SUMMARY`, verified against live `C:\x` (staged copies under Pictures\X_Screenshots\rn-packages\fix_verify).
- Companion: `FIX_PLAN.patch` (all proposed hunks, unapplied).

## Counts by severity

- **will-break**: 4
- **silently-wrong**: 2
- **deprecated**: 4
- **types-only**: 1
- **info**: 1
- **Total actionable**: 12
- **Dismissed false-positives**: 2

## Top 5 (severity → blast)

1. **FIX-001** [will-break] Cedar client calls missing `evaluate` export
2. **FIX-002** [will-break] expo-file-system main-entry writeAsStringAsync throws
3. **FIX-003** [will-break] reanimated-carousel default import (no default export)
4. **FIX-004** [will-break] react-native-web shim re-exports nonexistent default
5. **FIX-005** [silently-wrong] getFreeDiskStorageAsync stub → catch reports 0 free disk

## FIX-001 — Cedar client calls missing `evaluate` export

- **Severity:** `will-break`
- **Package:** @cedar-policy/cedar-wasm@4.12.0
- **File:line:** `packages/core/src/logic/permissions/cedarClientEvaluator.ts:39`
- **Evidence:** https://unpkg.com/@cedar-policy/cedar-wasm@4.12.0/web/cedar_wasm.d.ts
  - 4.12.0 web/nodejs export isAuthorized (and schemaToJson); no evaluate. Node evaluator already uses isAuthorized.
- **Blast radius:** All client-side Shape1/Shape2 permission checks via evaluateShape1/evaluateShape2. Server path (packages/policies/src/engine/evaluator.ts) already uses isAuthorized correctly.
- **Verify:** Unit-test warmCedarWasm + evaluateShape1 against a permit policy; confirm decision allow/Allow. Compare with packages/policies evaluator path.

### Current snippet (verified)

```
  32| function getWasmEvaluator(): Promise<EvaluateFn> {
  33|   if (_wasmPromise) return _wasmPromise;
  34|   _wasmPromise = (async () => {
  35|     try {
  36|       // @ts-expect-error - Dynamic import for cross-platform WASM compat
  37|       const mod = await import('@cedar-policy/cedar-wasm/web');
  38|       _wasmLoaded = true;
  39|       return mod.evaluate as EvaluateFn;
  40|     } catch {
  41|       _wasmLoaded = false;
  42|       throw new Error('CedarClientEvaluator: failed to load @cedar-policy/cedar-wasm/web');
  43|     }
  44|   })();
  45|   return _wasmPromise;
```

### Proposed change

```diff
--- a/packages/core/src/logic/permissions/cedarClientEvaluator.ts
+++ b/packages/core/src/logic/permissions/cedarClientEvaluator.ts
@@ -32,12 +32,36 @@ let _wasmLoaded = false;
 function getWasmEvaluator(): Promise<EvaluateFn> {
   if (_wasmPromise) return _wasmPromise;
   _wasmPromise = (async () => {
     try {
       // @ts-expect-error - Dynamic import for cross-platform WASM compat
       const mod = await import('@cedar-policy/cedar-wasm/web');
       _wasmLoaded = true;
-      return mod.evaluate as EvaluateFn;
+      // 4.12.0 exports isAuthorized (no evaluate). Match Node evaluator.
+      const evaluate: EvaluateFn = async (args) => {
+        const authResult = mod.isAuthorized({
+          principal: args.request.principal,
+          action: args.request.action,
+          resource: args.request.resource,
+          context: args.request.context,
+          policies: args.policies,
+          entities: args.entities,
+          ...(args.schema ? { schema: args.schema } : {}),
+        });
+        if (authResult.type === 'failure') {
+          throw new Error(
+            'CedarClientEvaluator: isAuthorized failure: ' +
+              JSON.stringify(authResult.errors),
+          );
+        }
+        return { decision: authResult.response.decision };
+      };
+      return evaluate;
     } catch {
       _wasmLoaded = false;
       throw new Error('CedarClientEvaluator: failed to load @cedar-policy/cedar-wasm/web');
     }
   })();
@@ -109,7 +133,8 @@ export async function evaluateShape1(policyString: string, req: Shape1Request):
       },
     ],
   });
-  return decision.decision === 'Allow';
+  const d = String(decision.decision);
+  return d === 'Allow' || d === 'allow';
@@ -141,7 +166,8 @@ export async function evaluateShape2(policyString: string, req: Shape2Request):
       },
     ],
   });
-  return decision.decision === 'Allow';
+  const d = String(decision.decision);
+  return d === 'Allow' || d === 'allow';
```

## FIX-002 — expo-file-system main-entry writeAsStringAsync throws

- **Severity:** `will-break`
- **Package:** expo-file-system (root stubs throw; use /legacy or File API)
- **File:line:** `packages/library/src/api/spreadsheet.ts:337-339`
- **Evidence:** https://docs.expo.dev/versions/latest/sdk/filesystem/
  - Root writeAsStringAsync is a legacy stub: “This method will throw in runtime.” Prefer File.write or expo-file-system/legacy.
- **Blast radius:** Spreadsheet.writeToFile callers only (1 implementation site). useMediaDownloader already imports expo-file-system/legacy correctly.
- **Verify:** Call Spreadsheet.writeToFile in a native/dev client; file should write without throw. Or import stub and confirm legacy path works.

### Current snippet (verified)

```
 330|   static async writeToFile(
 331|     workbook: XLSX.WorkBook,
 332|     filePath: string,
 333|     bookType: WriteOptions['bookType'] = 'xlsx'
 334|   ): Promise<void> {
 335|     const bytes = this.write(workbook, { bookType, type: 'array' }) as Uint8Array;
 336|     // This requires expo-file-system or similar
 337|     const { writeAsStringAsync, EncodingType } = await import('expo-file-system');
 338|     await writeAsStringAsync(filePath, bytesToBase64(bytes), {
 339|       encoding: EncodingType.Base64,
 340|     });
```

### Proposed change

```diff
--- a/packages/library/src/api/spreadsheet.ts
+++ b/packages/library/src/api/spreadsheet.ts
@@ -334,7 +334,8 @@ export class Spreadsheet {
   ): Promise<void> {
     const bytes = this.write(workbook, { bookType, type: 'array' }) as Uint8Array;
-    // This requires expo-file-system or similar
-    const { writeAsStringAsync, EncodingType } = await import('expo-file-system');
+    // Root expo-file-system stubs throw; legacy path matches useMediaDownloader.
+    const { writeAsStringAsync, EncodingType } = await import('expo-file-system/legacy');
     await writeAsStringAsync(filePath, bytesToBase64(bytes), {
       encoding: EncodingType.Base64,
     });
```

## FIX-003 — reanimated-carousel default import (no default export)

- **Severity:** `will-break`
- **Package:** react-native-reanimated-carousel@5.1.1
- **File:line:** `packages/ui/src/components/SanctuaryCarousel.tsx:5-6`
- **Evidence:** tarball:react-native-reanimated-carousel@5.1.1:lib/module/index.js
  - lib/module/index.js: export{Carousel}from"./components/Carousel" — named only. @ts-expect-error hides the miss.
- **Blast radius:** SanctuaryCarousel consumers. Named export is Carousel. Props (sliderWidth/itemWidth/layout) look like snap-carousel — audit against 5.1.1 API after import fix.
- **Verify:** Typecheck SanctuaryCarousel; mount in UI story/screen; Carousel should render. Follow-up: align props with 5.1.1.

### Current snippet (verified)

```
   1| import { Theme } from '@repo/ui/theme/Theme';
   2| import React from 'react';
   3| import { Dimensions } from 'react-native';
   4| import Animated, { withTiming } from 'react-native-reanimated';
   5| // @ts-expect-error - Module has no type declarations
   6| import Carousel from 'react-native-reanimated-carousel';
   7| 
   8| export interface SanctuaryCarouselProps<T> {
   9|   data: T[];
  10|   renderItem: (item: T, index: number) => React.ReactNode;
```

### Proposed change

```diff
--- a/packages/ui/src/components/SanctuaryCarousel.tsx
+++ b/packages/ui/src/components/SanctuaryCarousel.tsx
@@ -2,8 +2,7 @@ import { Theme } from '@repo/ui/theme/Theme';
 import React from 'react';
 import { Dimensions } from 'react-native';
 import Animated, { withTiming } from 'react-native-reanimated';
-// @ts-expect-error - Module has no type declarations
-import Carousel from 'react-native-reanimated-carousel';
+import { Carousel } from 'react-native-reanimated-carousel';
```

## FIX-004 — react-native-web shim re-exports nonexistent default

- **Severity:** `will-break`
- **Package:** react-native-web@0.21.3
- **File:line:** `apps/gurudevi-mobile/src/shims/react-native-web-augmented.js:11`
- **Evidence:** tarball:react-native-web@0.21.3:dist/index.js
  - 0.21.3 ESM/CJS declare no default export.
- **Blast radius:** Anything importing default from the augmented shim. Named export * and View import are fine; metro singleton override still covers react-native→rnw.
- **Verify:** Web bundle of gurudevi-mobile; shim loads; no undefined default binding warnings.

### Current snippet (verified)

```
   8| // We can import directly because metro.config.js skips the redirect
   9| // when the request originates from this shim file.
  10| export * from 'react-native-web';
  11| export { default } from 'react-native-web';
  12| 
  13| import { View } from 'react-native-web';
  14| 
  15| export const codegenNativeComponent = (_name) => {
  16|   return View || 'div';
```

### Proposed change

```diff
--- a/apps/gurudevi-mobile/src/shims/react-native-web-augmented.js
+++ b/apps/gurudevi-mobile/src/shims/react-native-web-augmented.js
@@ -8,8 +8,7 @@
 // We can import directly because metro.config.js skips the redirect
 // when the request originates from this shim file.
 export * from 'react-native-web';
-export { default } from 'react-native-web';
-
 import { View } from 'react-native-web';
```

## FIX-005 — getFreeDiskStorageAsync stub → catch reports 0 free disk

- **Severity:** `silently-wrong`
- **Package:** expo-file-system
- **File:line:** `apps/gurudevi-mobile/src/storage/retention-scheduler.ts:117`; `apps/gurudevi-mobile/src/storage/retention-scheduler.ts:528`
- **Evidence:** https://docs.expo.dev/versions/latest/sdk/filesystem/
  - Use Paths.availableDiskSpace or expo-file-system/legacy getFreeDiskStorageAsync.
- **Blast radius:** Storage retention / compaction efficiency decisions (shouldRun / getDeviceConditions). try/catch masks the throw as diskFreeBytes=0.
- **Verify:** Log diskFreeBytes on device before/after; should be non-zero on a normal phone.

### Current snippet (verified)

```
 108|   try {
 109|     const Battery = await import('expo-battery');
 110|     const Network = await import('expo-network');
 111|     const FileSystem = await import('expo-file-system');
 112| 
 113|     const [batteryLevel, batteryState, networkState, diskInfo] = await Promise.all([
 114|       import('expo-battery').then((m) => m.getBatteryLevelAsync()),
 115|       import('expo-battery').then((m) => m.getBatteryStateAsync()),
 116|       import('expo-network').then((m) => m.getNetworkStateAsync()),
 117|       import('expo-file-system').then((m) => m.getFreeDiskStorageAsync()),
 118|     ]);
 119| 
 120|     const isCharging = batteryState === 2; // BatteryState.CHARGING
 121|     const isMetered = (networkState as any)?.isMetered ?? false;
 122|     const diskFree = typeof diskInfo === 'number' ? diskInfo : ((diskInfo as any)?.freeSpace ?? 0);
 123|     const diskTotal = typeof diskInfo === 'number' ? 0 : ((diskInfo as any)?.totalSpace ?? 0);
…
 519|   try {
 520|     const Battery = await import('expo-battery');
 521|     const Network = await import('expo-network');
 522|     const FileSystem = await import('expo-file-system');
 523| 
 524|     const [batteryLevel, batteryState, networkState, diskInfo] = await Promise.all([
 525|       Battery.getBatteryLevelAsync(),
 526|       Battery.getBatteryStateAsync(),
 527|       Network.getNetworkStateAsync(),
 528|       FileSystem.getFreeDiskStorageAsync(),
 529|     ]);
 530| 
 531|     return {
 532|       batteryLevel,
 533|       isCharging: batteryState === 2,
 534|       isMeteredNetwork: (networkState as any)?.isMetered ?? false,
 535|       diskFreeBytes: typeof diskInfo === 'number' ? diskInfo : ((diskInfo as any)?.freeSpace ?? 0),
 536|     };
```

### Proposed change

```diff
--- a/apps/gurudevi-mobile/src/storage/retention-scheduler.ts
+++ b/apps/gurudevi-mobile/src/storage/retention-scheduler.ts
@@ -108,14 +108,14 @@
   try {
     const Battery = await import('expo-battery');
     const Network = await import('expo-network');
-    const FileSystem = await import('expo-file-system');
+    const { Paths } = await import('expo-file-system');
 
     const [batteryLevel, batteryState, networkState, diskInfo] = await Promise.all([
       import('expo-battery').then((m) => m.getBatteryLevelAsync()),
       import('expo-battery').then((m) => m.getBatteryStateAsync()),
       import('expo-network').then((m) => m.getNetworkStateAsync()),
-      import('expo-file-system').then((m) => m.getFreeDiskStorageAsync()),
+      Promise.resolve(Paths.availableDiskSpace),
     ]);
@@ -519,14 +519,14 @@
   try {
     const Battery = await import('expo-battery');
     const Network = await import('expo-network');
-    const FileSystem = await import('expo-file-system');
+    const { Paths } = await import('expo-file-system');
 
     const [batteryLevel, batteryState, networkState, diskInfo] = await Promise.all([
       Battery.getBatteryLevelAsync(),
       Battery.getBatteryStateAsync(),
       Network.getNetworkStateAsync(),
-      FileSystem.getFreeDiskStorageAsync(),
+      Promise.resolve(Paths.availableDiskSpace),
     ]);
```

## FIX-006 — nitroThemeTransition looks for startTransition; package exports withThemeTransition

- **Severity:** `silently-wrong`
- **Package:** react-native-nitro-theme-transition@1.0.0
- **File:line:** `packages/ui/src/theme/nitroThemeTransition.ts:24-26`
- **Evidence:** https://github.com/saleh2001k/react-native-nitro-theme-transition
  - 1.0.0 exports withThemeTransition + isThemeTransitionAvailable. applyTheme must be synchronous.
- **Blast radius:** All theme transitions via startThemeTransition — always take JS fallback; native GPU transition never runs. Pin nitro modules 0.37.1 unchanged.
- **Verify:** Toggle theme on device; confirm native circularReveal runs when isThemeTransitionAvailable() is true.

### Current snippet (verified)

```
  15| export async function startThemeTransition(
  16|   updateThemeCallback: () => void | Promise<void>,
  17|   options?: {
  18|     type?: ThemeTransitionType;
  19|     duration?: number;
  20|   },
  21| ): Promise<void> {
  22|   const transitionType = options?.type || 'circularReveal';
  23| 
  24|   if (nitroThemeModule && typeof nitroThemeModule.startTransition === 'function') {
  25|     try {
  26|       await nitroThemeModule.startTransition(transitionType, async () => {
  27|         await updateThemeCallback();
  28|       });
  29|       return;
  30|     } catch (error) {
  31|       console.warn(
  32|         '[ThemeTransition] Native transition failed, falling back to direct update:',
  33|         error,
  34|       );
  35|     }
  36|   }
  37| 
  38|   // Graceful fallback: Execute state change directly
  39|   await updateThemeCallback();
```

### Proposed change

```diff
--- a/packages/ui/src/theme/nitroThemeTransition.ts
+++ b/packages/ui/src/theme/nitroThemeTransition.ts
@@ -21,12 +21,20 @@ export async function startThemeTransition(
 ): Promise<void> {
   const transitionType = options?.type || 'circularReveal';
 
-  if (nitroThemeModule && typeof nitroThemeModule.startTransition === 'function') {
+  const withThemeTransition = nitroThemeModule?.withThemeTransition;
+  if (typeof withThemeTransition === 'function') {
     try {
-      await nitroThemeModule.startTransition(transitionType, async () => {
-        await updateThemeCallback();
-      });
+      // applyTheme must be synchronous per 1.0.0 docs; fire-and-forget async work.
+      withThemeTransition(
+        () => {
+          void updateThemeCallback();
+        },
+        {
+          kind: transitionType,
+          durationMs: options?.duration ?? 400,
+        },
+      );
       return;
     } catch (error) {
```

## FIX-007 — Reanimated Layout → LinearTransition (~22 call sites / 15 files)

- **Severity:** `deprecated`
- **Package:** react-native-reanimated@4.7.1 (sacred pin — keep)
- **File:line:** `packages/self/src/components/DailyContentCard.tsx`; `packages/self/src/components/DailyContentCard.web.tsx`; `packages/self/src/components/DecisionJournalSection.tsx`; `packages/self/src/components/MoodPickerCard.tsx`; `packages/self/src/components/OrientationCaptureStep.tsx`; `packages/self/src/components/RemindersManager.web.tsx`; `packages/self/src/components/TomorrowPrep.web.tsx`; `packages/self/src/components/StudentGoals.tsx`; `packages/self/src/components/WisdomSeeds.tsx`; `packages/self/src/components/DailyRhythm.tsx`; `packages/self/src/components/SelfNavigator.tsx`; `packages/self/src/components/MoodLotus.web.tsx`; `packages/ai/src/screens/AIAssistantScreen.tsx`; `packages/ui/src/providers/ToastProvider.tsx`; `packages/ui/src/components/TemporalNavigator.tsx`
- **Evidence:** tarball:react-native-reanimated@4.7.1:lib/typescript/layoutReanimation/defaultTransitions/LinearTransition.d.ts
  - Layout is @deprecated alias of LinearTransition in 4.7.1.
- **Blast radius:** 15 UI files across @repo/self, @repo/ai, @repo/ui. Mechanical rename Layout→LinearTransition (incl. Layout.springify→LinearTransition.springify).
- **Verify:** rg "\bLayout\b" packages/{self,ai,ui} --glob "*.tsx" should only hit lucide LayoutGrid / CSS layout, not reanimated imports. Visual smoke of SelfNavigator / Toast.

### Current snippet (verified)

```
  24| import Animated, { FadeIn, Layout } from 'react-native-reanimated';
…
  92|   return (
  93|     <Animated.View layout={Layout} entering={FadeIn.duration(800)}>
```

### Proposed change

```diff
--- a/packages/self/src/components/DailyContentCard.tsx
+++ b/packages/self/src/components/DailyContentCard.tsx
@@ -21,7 +21,7 @@
 } from '@repo/ui/primitives';
 import { useEffect, useState } from 'react';
 import { useTranslation } from 'react-i18next';
-import Animated, { FadeIn, Layout } from 'react-native-reanimated';
+import Animated, { FadeIn, LinearTransition } from 'react-native-reanimated';
@@ -90,7 +90,7 @@
   const needsExpansion = content.content.length > 120;
 
   return (
-    <Animated.View layout={Layout} entering={FadeIn.duration(800)}>
+    <Animated.View layout={LinearTransition} entering={FadeIn.duration(800)}>
```

# Apply the same Layout → LinearTransition (and Layout.springify → LinearTransition.springify)
# rename across the 15 files listed in FIX-007. Exemplar above is DailyContentCard.tsx.

## FIX-008 — expo-image-picker MediaTypeOptions → MediaType array

- **Severity:** `deprecated`
- **Package:** expo-image-picker
- **File:line:** `packages/classroom/src/components/SubmissionModal.tsx`; `packages/community/src/hooks/useComposerLogic.ts`; `packages/profile/src/components/AvatarDisplay.tsx`; `packages/profile/src/components/EditProfileModal.tsx`; `packages/scanner-kit/src/OCRScanner.tsx`; `packages/scanner-kit/src/ScannerModal.tsx`
- **Evidence:** https://docs.expo.dev/versions/latest/sdk/imagepicker/
  - MediaTypeOptions marked @deprecated; use MediaType | MediaType[].
- **Blast radius:** 6 production files (plus web shim/mocks which can stay for compat). Replace MediaTypeOptions.Images with ["images"] or ImagePicker.MediaType.
- **Verify:** Pick avatar / OCR / submission image on device+web; no deprecation warnings.

### Current snippet (verified)

```
  78|       const result = useCamera
  79|         ? await ImagePicker.launchCameraAsync({
  80|             mediaTypes: ImagePicker.MediaTypeOptions.Images,
  81|             allowsEditing: true,
  82|             quality: 0.7,
  83|           })
  84|         : await ImagePicker.launchImageLibraryAsync({
  85|             mediaTypes: ImagePicker.MediaTypeOptions.Images,
  86|             allowsEditing: true,
```

### Proposed change

```diff
--- a/packages/classroom/src/components/SubmissionModal.tsx
+++ b/packages/classroom/src/components/SubmissionModal.tsx
@@ -77,12 +77,12 @@
         const result = await ImagePicker.launchImageLibraryAsync({
-            mediaTypes: ImagePicker.MediaTypeOptions.Images,
+            mediaTypes: ['images'],
             allowsEditing: true,
@@ -82,7 +82,7 @@
         const result = await ImagePicker.launchCameraAsync({
-            mediaTypes: ImagePicker.MediaTypeOptions.Images,
+            mediaTypes: ['images'],
```

# Same MediaTypeOptions.Images → ['images'] in the other 5 files listed under FIX-008.

## FIX-009 — expo-image-manipulator manipulateAsync → contextual API

- **Severity:** `deprecated`
- **Package:** expo-image-manipulator
- **File:line:** `packages/library/src/api/image-to-pdf.ts`; `packages/profile/src/components/AvatarDisplay.tsx`; `packages/library/src/api/ocr.ts`
- **Evidence:** https://docs.expo.dev/versions/latest/sdk/imagemanipulator/
  - manipulateAsync deprecated; use ImageManipulator.manipulate(source) contextual API or useImageManipulator.
- **Blast radius:** 3 call sites (PDF pipeline, avatar upload, OCR preprocess).
- **Verify:** Avatar resize + image-to-pdf still produce JPEG/PNG; OCR preprocess returns uri.

### Current snippet (verified)

```
   1| import { PDFDocument, rgb, StandardFonts, type PDFImage } from 'pdf-lib';
   2| import { manipulateAsync, SaveFormat } from 'expo-image-manipulator';
   3| import { bytesToBase64, base64ToBytes } from '@repo/library/utils/bytes';
…
 161|     const actions: Parameters<typeof manipulateAsync>[1] = [];
 162|     const rotation = image.rotation ?? 0;
 163|     if (rotation > 0) {
 164|       actions.push({ rotate: rotation });
 165|     }
 166|     if (options.compress) {
 167|       actions.push({ resize: { width: options.maxDimension } });
 168|     }
 169| 
 170|     const result = await manipulateAsync(uri, actions, {
 171|       compress: options.format === 'jpg' ? options.quality : 1,
 172|       format: options.format === 'jpg' ? SaveFormat.JPEG : SaveFormat.PNG,
 173|       base64: true,
 174|     });
```

### Proposed change

```diff
--- a/packages/profile/src/components/AvatarDisplay.tsx
+++ b/packages/profile/src/components/AvatarDisplay.tsx
@@ -74,10 +74,12 @@
     setUploading(true);
     try {
-      const manipulated = await ImageManipulator.manipulateAsync(
-        result.assets[0].uri,
-        [{ resize: { width: 400, height: 400 } }],
-        { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG },
-      );
+      const context = ImageManipulator.manipulate(result.assets[0].uri);
+      const resized = await context.resize({ width: 400, height: 400 }).renderAsync();
+      const manipulated = await resized.saveAsync({
+        compress: 0.85,
+        format: ImageManipulator.SaveFormat.JPEG,
+      });
```

# image-to-pdf.ts and ocr.ts need the same contextual migrate; verify SaveFormat/base64 options
# against installed expo-image-manipulator typings before applying blindly.

## FIX-010 — RNGH Gesture builder (actionsheet) + dead import (SelfNavigator)

- **Severity:** `deprecated`
- **Package:** react-native-gesture-handler@3.3.0 (sacred pin — keep)
- **File:line:** `packages/ui/src/components/ui/actionsheet/index.tsx:94`; `packages/self/src/components/SelfNavigator.tsx:16`
- **Evidence:** tarball:react-native-gesture-handler@3.3.0 typings (@deprecated on Gesture builder)
  - v3.3.0 typings mark Gesture builder deprecated in favour of hook-based API.
- **Blast radius:** Actionsheet drag-to-dismiss (real Gesture.Pan). SelfNavigator only imports Gesture/GestureDetector — unused; remove. Hook-based migration for actionsheet when adopting RNGH next API; do not downgrade 3.3.0.
- **Verify:** Actionsheet still dismisses on drag >120px. SelfNavigator has no unused RNGH imports (tsc/eslint).

### Current snippet (verified)

```
  91| export const ActionsheetContent = ({ children, className }: ActionsheetContentProps) => {
  92|   const { isOpen, onClose } = useActionsheet();
  93|   const translateY = useSharedValue(0);
  94|   const panGesture = Gesture.Pan()
  95|     .activeOffsetY?.(8)
  96|     .failOffsetX?.([-24, 24])
  97|     .onUpdate((event: { translationY: number }) => {
  98|       'worklet';
  99|       translateY.value = Math.max(0, event.translationY);
 100|     })
 101|     .onEnd((event: { canceled?: boolean }) => {
 102|       'worklet';
 103|       const shouldClose = !event.canceled && translateY.value > 120;
 104|       if (shouldClose) runOnJS(onClose)();
 105|       translateY.value = withSpring(0);
 106|     });
 107|   const animatedStyle = useAnimatedStyle(() => ({
 108|     transform: [{ translateY: translateY.value }],
 109|   }));
 110| 
 111|   if (!isOpen) return null;
 112| 
 113|   return (
 114|     <GestureDetector gesture={panGesture}>
 115|       <Animated.View
```

### Proposed change

```diff
--- a/packages/self/src/components/SelfNavigator.tsx
+++ b/packages/self/src/components/SelfNavigator.tsx
@@ -13,7 +13,6 @@ import { hapticLight, hapticMedium, hapticSelection } from '@repo/ui/utils/hapti
 import React, { useCallback, useState } from 'react';
 import { Platform, useWindowDimensions } from 'react-native';
-import { Gesture, GestureDetector } from 'react-native-gesture-handler';
 import Animated, { FadeIn, FadeOut, Layout } from 'react-native-reanimated';
```

# actionsheet Gesture.Pan remains functional under RNGH 3.3.0; migrate to the hook API in a
# dedicated PR once the recommended replacement is confirmed against 3.3.0 docs. Do not downgrade.

## FIX-011 — Keychain.Options type removed in 10.0.0

- **Severity:** `types-only`
- **Package:** react-native-keychain@10.0.0
- **File:line:** `packages/core/src/adapters/native/NativeDeviceIdentityAdapter.ts:22`; `packages/core/src/adapters/native/NativeDeviceIdentityAdapter.ts:46`
- **Evidence:** tarball:react-native-keychain@10.0.0:lib/typescript/types.d.ts
  - Exports SetOptions / GetOptions / BaseOptions — no Options.
- **Blast radius:** Typecheck only; runtime setGenericPassword/getGenericPassword/hasGenericPassword/getSupportedBiometryType all exist.
- **Verify:** tsc -p packages/core; NativeDeviceIdentityAdapter compiles.

### Current snippet (verified)

```
  21|   async generateHardwareKey(alias: string): Promise<string> {
  22|     const storageOptions: Keychain.Options = {
  23|       service: alias,
  24|       accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
  25|       securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
  26|     };
  27| 
  28|     // Use hasGenericPassword for a non-intrusive check
  29|     const hasKey = await Keychain.hasGenericPassword({ service: alias });
  30|     if (hasKey) {
  31|       const credentials = await Keychain.getGenericPassword(storageOptions);
  32|       if (credentials) return credentials.password;
  33|     }
  34| 
  35|     // Generate a persistent hardware-bound ID
  36|     // In a full implementation, this would be a Public Key from an RSA/ECC pair.
  37|     const hardwareId = `${Platform.OS}_${Math.random().toString(36).substring(2, 15)}`;
  38| 
  39|     await Keychain.setGenericPassword('hardware_identity', hardwareId, storageOptions);
  40|     return hardwareId;
```

### Proposed change

```diff
--- a/packages/core/src/adapters/native/NativeDeviceIdentityAdapter.ts
+++ b/packages/core/src/adapters/native/NativeDeviceIdentityAdapter.ts
@@ -19,7 +19,7 @@ export class NativeDeviceIdentityAdapter implements IDeviceIdentity {
   }
 
   async generateHardwareKey(alias: string): Promise<string> {
-    const storageOptions: Keychain.Options = {
+    const storageOptions: Keychain.SetOptions = {
       service: alias,
       accessible: Keychain.ACCESSIBLE.WHEN_UNLOCKED_THIS_DEVICE_ONLY,
       securityLevel: Keychain.SECURITY_LEVEL.SECURE_HARDWARE,
@@ -43,7 +43,7 @@ export class NativeDeviceIdentityAdapter implements IDeviceIdentity {
   async signWithHardwareKey(alias: string, challenge: string): Promise<string> {
-    const storageOptions: Keychain.Options = {
+    const storageOptions: Keychain.GetOptions = {
       service: alias,
       authenticationPrompt: {
```

## FIX-012 — React.createElement in mocks/shims (legacy style, still supported)

- **Severity:** `info`
- **Package:** react
- **File:line:** `apps/gurudevi-mobile/jest-setup.ts`; `apps/gurudevi-mobile/src/shims/*`; `packages/*/vitest-*.ts`; `packages/*/__tests__/*`
- **Evidence:** https://react.dev/reference/react/createElement
  - Prefer JSX / automatic runtime; createElement remains supported.
- **Blast radius:** Test/shim code only (~30 pattern rows). createElement remains supported — prefer JSX when touching files; no urgent migration.
- **Verify:** n/a — informational.

### Current snippet (verified)

_n/a (diffuse mock/shim pattern)_

### Proposed change

_No code change required._

## Dismissed / not real problems

- **DISMISS-001**: Clipboard.setStringAsync flagged as removed-upstream from react-native — Verified imports are from expo-clipboard (SocialSanctuary, ContactLinktree, StudentList, QRShareButton). Pattern row was a false positive against RN Clipboard.
- **DISMISS-002**: Reanimated Extrapolate / Extrapolation deprecated alias — capability_summary listed the capability path; git grep found 0 Extrapolat* usages in apps/packages source.

## Sacred pins (do not change in these fixes)

| pin | version |
|---|---|
| `react-native-reanimated` | 4.7.1 |
| `react-native-worklets` | 0.13.0 |
| `react-native-gesture-handler` | 3.3.0 |
| `react-native-nitro-modules` | 0.37.1 |
| `react-native-mmkv` | 4.3.2 |
| `react-native-skia` | 3.0.2 |
