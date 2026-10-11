/**
 * @file change-stream-fixtures.ts
 * 20 Canonical React Native Ecosystem Breaking Migration Scenarios.
 *
 * Sourced from real-world platform shifts across Fabric New Architecture,
 * Reanimated 4, RNGH 3, Nitro Modules, and modern toolchains.
 */

export interface ChangeStreamFixture {
  id: string;
  category: 'animation' | 'gesture' | 'core-rn' | 'storage' | 'native-wasm' | 'tooling';
  packageName: string;
  fromVersion: string;
  toVersion: string;
  description: string;
  severedSymbols: string[];
  canonicalReplacements: string[];
  legacySnippet: string;
  groundedSnippet: string;
  rootCause: string;
  architectureVerdict: 'NEW_ARCHITECTURE_FABRIC_READY' | 'LEGACY_INTEROP' | 'UNKNOWN';
}

export const CANONICAL_CHANGE_STREAM_FIXTURES: ChangeStreamFixture[] = [
  {
    id: 'MIG-001-REANIMATED-GESTURE-HANDLER',
    category: 'animation',
    packageName: 'react-native-reanimated',
    fromVersion: '2.17.0',
    toVersion: '4.7.1',
    description: 'useAnimatedGestureHandler removed in Reanimated 4',
    severedSymbols: ['useAnimatedGestureHandler'],
    canonicalReplacements: ['Gesture.Pan().onUpdate(...)', 'GestureDetector'],
    legacySnippet: `
import { useAnimatedGestureHandler } from 'react-native-reanimated';
const handler = useAnimatedGestureHandler({
  onActive: (event) => {
    'worklet';
    translateY.value = event.translationY;
  }
});
`,
    groundedSnippet: `
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
const pan = Gesture.Pan().onUpdate((event) => {
  'worklet';
  translateY.value = event.translationY;
});
`,
    rootCause: 'Reanimated 4 decouples gesture handling entirely to RNGH fluent Gestures',
    architectureVerdict: 'NEW_ARCHITECTURE_FABRIC_READY'
  },
  {
    id: 'MIG-002-REANIMATED-INTERPOLATE-NODE',
    category: 'animation',
    packageName: 'react-native-reanimated',
    fromVersion: '1.13.0',
    toVersion: '4.7.1',
    description: 'interpolateNode legacy operator removed',
    severedSymbols: ['interpolateNode'],
    canonicalReplacements: ['interpolate'],
    legacySnippet: `
import Animated, { interpolateNode } from 'react-native-reanimated';
const opacity = interpolateNode(progress, { inputRange: [0, 1], outputRange: [0, 1] });
`,
    groundedSnippet: `
import { interpolate } from 'react-native-reanimated';
const opacity = interpolate(progress.value, [0, 1], [0, 1]);
`,
    rootCause: 'Reanimated 1 node-based execution deleted in modern worklet runtimes',
    architectureVerdict: 'NEW_ARCHITECTURE_FABRIC_READY'
  },
  {
    id: 'MIG-003-REANIMATED-WORKLETS-RUNTIME',
    category: 'animation',
    packageName: 'react-native-reanimated',
    fromVersion: '3.16.0',
    toVersion: '4.7.1',
    description: 'Worklet runtime decoupled into react-native-worklets package',
    severedSymbols: ['worklet-runtime-internal'],
    canonicalReplacements: ['react-native-worklets'],
    legacySnippet: `
import Animated from 'react-native-reanimated';
// Expecting built-in monolithic worklet runtime
`,
    groundedSnippet: `
import Animated from 'react-native-reanimated';
import 'react-native-worklets';
`,
    rootCause: 'Reanimated 4 extracted the core worklet execution context into react-native-worklets',
    architectureVerdict: 'NEW_ARCHITECTURE_FABRIC_READY'
  },
  {
    id: 'MIG-004-REANIMATED-RUN-ON-JS',
    category: 'animation',
    packageName: 'react-native-reanimated',
    fromVersion: '2.14.0',
    toVersion: '4.7.1',
    description: 'Unenforced runOnJS closures without thread dispatching',
    severedSymbols: ['rawJsiCallback'],
    canonicalReplacements: ['runOnJS(callback)()'],
    legacySnippet: `
function onEnd() {
  'worklet';
  onComplete();
}
`,
    groundedSnippet: `
import { runOnJS } from 'react-native-reanimated';
function onEnd() {
  'worklet';
  runOnJS(onComplete)();
}
`,
    rootCause: 'Cross-thread execution from worklet thread to JS thread requires explicit runOnJS dispatcher',
    architectureVerdict: 'NEW_ARCHITECTURE_FABRIC_READY'
  },
  {
    id: 'MIG-005-RN-FIND-NODE-HANDLE',
    category: 'core-rn',
    packageName: 'react-native',
    fromVersion: '0.74.0',
    toVersion: '0.76.0',
    legacySnippet: `
import { findNodeHandle } from 'react-native';
const node = findNodeHandle(ref.current);
`,
    groundedSnippet: `
ref.current?.measure((x, y, width, height, pageX, pageY) => {});
`,
    severedSymbols: ['findNodeHandle'],
    canonicalReplacements: ['hostComponent.measure', 'useAnimatedRef'],
    description: 'findNodeHandle removed in React Native New Architecture Fabric',
    rootCause: 'Fabric eliminates legacy integer tag system for direct C++ ShadowNode representations',
    architectureVerdict: 'NEW_ARCHITECTURE_FABRIC_READY'
  },
  {
    id: 'MIG-006-RN-UIMANAGER-MEASURE',
    category: 'core-rn',
    packageName: 'react-native',
    fromVersion: '0.74.0',
    toVersion: '0.76.0',
    legacySnippet: `
import { UIManager } from 'react-native';
UIManager.measureInWindow(node, (x, y, w, h) => {});
`,
    groundedSnippet: `
ref.current?.measureInWindow((x, y, w, h) => {});
`,
    severedSymbols: ['UIManager.measureInWindow', 'UIManager'],
    canonicalReplacements: ['hostComponent.measureInWindow'],
    description: 'UIManager direct reflection calls severed in Fabric',
    rootCause: 'UIManager bridge commands do not route to synchronous Fabric layout passes',
    architectureVerdict: 'NEW_ARCHITECTURE_FABRIC_READY'
  },
  {
    id: 'MIG-007-RN-NATIVEMODULES-ASYNC',
    category: 'core-rn',
    packageName: 'react-native',
    fromVersion: '0.74.0',
    toVersion: '0.76.0',
    legacySnippet: `
import { NativeModules } from 'react-native';
const { MyCustomModule } = NativeModules;
MyCustomModule.doAction();
`,
    groundedSnippet: `
import { TurboModuleRegistry } from 'react-native';
const MyCustomModule = TurboModuleRegistry.getEnforcing('MyCustomModule');
MyCustomModule.doAction();
`,
    severedSymbols: ['NativeModules.CustomModule'],
    canonicalReplacements: ['TurboModuleRegistry.getEnforcing(...)'],
    description: 'Legacy NativeModules asynchronous JSON bridge deprecated in favor of TurboModules',
    rootCause: 'Legacy bridge is disabled by default in RN 0.76+ New Architecture',
    architectureVerdict: 'NEW_ARCHITECTURE_FABRIC_READY'
  },
  {
    id: 'MIG-008-RNGH-PAN-WRAPPER',
    category: 'gesture',
    packageName: 'react-native-gesture-handler',
    fromVersion: '1.10.0',
    toVersion: '3.3.0',
    legacySnippet: `
import { PanGestureHandler } from 'react-native-gesture-handler';
<PanGestureHandler onGestureEvent={onGestureEvent}>
  <Animated.View />
</PanGestureHandler>
`,
    groundedSnippet: `
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
<GestureDetector gesture={Gesture.Pan().onUpdate(...)}>
  <Animated.View />
</GestureDetector>
`,
    severedSymbols: ['PanGestureHandler'],
    canonicalReplacements: ['<GestureDetector gesture={Gesture.Pan()}>'],
    description: 'Legacy PanGestureHandler component deprecated/severed',
    rootCause: 'Wrapper components create unnecessary native views and bypass Fabric gesture tree',
    architectureVerdict: 'NEW_ARCHITECTURE_FABRIC_READY'
  },
  {
    id: 'MIG-009-RNGH-TAP-WRAPPER',
    category: 'gesture',
    packageName: 'react-native-gesture-handler',
    fromVersion: '1.10.0',
    toVersion: '3.3.0',
    legacySnippet: `
import { TapGestureHandler } from 'react-native-gesture-handler';
<TapGestureHandler onHandlerStateChange={onStateChange}>
  <View />
</TapGestureHandler>
`,
    groundedSnippet: `
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
<GestureDetector gesture={Gesture.Tap().onEnd(...)}>
  <View />
</GestureDetector>
`,
    severedSymbols: ['TapGestureHandler'],
    canonicalReplacements: ['<GestureDetector gesture={Gesture.Tap()}>'],
    description: 'Legacy TapGestureHandler component replaced by Gesture.Tap()',
    rootCause: 'Unified Gesture API replaces disparate handler classes',
    architectureVerdict: 'NEW_ARCHITECTURE_FABRIC_READY'
  },
  {
    id: 'MIG-010-RNGH-ON-GESTURE-EVENT',
    category: 'gesture',
    packageName: 'react-native-gesture-handler',
    fromVersion: '1.10.0',
    toVersion: '3.3.0',
    legacySnippet: `
const onGestureEvent = Animated.event([{ nativeEvent: { translationX: dragX } }], { useNativeDriver: true });
`,
    groundedSnippet: `
const pan = Gesture.Pan().onUpdate((e) => { dragX.value = e.translationX; });
`,
    severedSymbols: ['onGestureEvent'],
    canonicalReplacements: ['Gesture.Pan().onUpdate(...)'],
    description: 'Animated.event prop piping severed for gesture handlers',
    rootCause: 'Gesture updates run directly inside C++ worklets without JS event bridge',
    architectureVerdict: 'NEW_ARCHITECTURE_FABRIC_READY'
  },
  {
    id: 'MIG-011-RNGH-USE-PAN-GESTURE',
    category: 'gesture',
    packageName: 'react-native-gesture-handler',
    fromVersion: '1.10.0',
    toVersion: '3.3.0',
    legacySnippet: `
import { usePanGesture } from 'react-native-gesture-handler';
const gesture = usePanGesture();
`,
    groundedSnippet: `
import { Gesture } from 'react-native-gesture-handler';
const gesture = Gesture.Pan();
`,
    severedSymbols: ['usePanGesture'],
    canonicalReplacements: ['Gesture.Pan()'],
    description: 'usePanGesture hook removed in RNGH v2/v3',
    rootCause: 'Fluent Gesture builder replaced experimental hook',
    architectureVerdict: 'NEW_ARCHITECTURE_FABRIC_READY'
  },
  {
    id: 'MIG-012-MMKV-NITRO-BINDINGS',
    category: 'storage',
    packageName: 'react-native-mmkv',
    fromVersion: '2.12.0',
    toVersion: '4.3.2',
    legacySnippet: `
import { MMKV } from 'react-native-mmkv';
// Legacy direct manual JSI binding
`,
    groundedSnippet: `
import { MMKV } from 'react-native-mmkv';
// Built on react-native-nitro-modules for high-speed C++ interop
`,
    severedSymbols: ['manual-jsi-binding'],
    canonicalReplacements: ['react-native-nitro-modules'],
    description: 'MMKV v4 rewritten on top of Nitro Modules',
    rootCause: 'Manual C++ JSI bindings refactored to declarative Nitro TurboModule infrastructure',
    architectureVerdict: 'NEW_ARCHITECTURE_FABRIC_READY'
  },
  {
    id: 'MIG-013-MMKV-ASYNC-POLYFILL',
    category: 'storage',
    packageName: 'react-native-mmkv',
    fromVersion: '2.12.0',
    toVersion: '4.3.2',
    legacySnippet: `
const val = await storage.getString('key');
`,
    groundedSnippet: `
const val = storage.getString('key');
`,
    severedSymbols: ['async-await-storage'],
    canonicalReplacements: ['synchronous storage.getString(key)'],
    description: 'Awaiting synchronous MMKV storage calls causes unnecessary microtasks',
    rootCause: 'MMKV is strictly synchronous; async wrappers degrade memory-mapped performance',
    architectureVerdict: 'NEW_ARCHITECTURE_FABRIC_READY'
  },
  {
    id: 'MIG-014-KEYCHAIN-OPTIONS-TYPE',
    category: 'tooling',
    packageName: 'react-native-keychain',
    fromVersion: '9.0.0',
    toVersion: '10.0.0',
    legacySnippet: `
import * as Keychain from 'react-native-keychain';
const options: Keychain.Options = { service: 'my_app' };
`,
    groundedSnippet: `
import * as Keychain from 'react-native-keychain';
const options: Keychain.SetOptions = { service: 'my_app' };
`,
    severedSymbols: ['Keychain.Options'],
    canonicalReplacements: ['Keychain.SetOptions', 'Keychain.GetOptions'],
    description: 'Keychain.Options union type removed in 10.0.0; replaced by specific SetOptions/GetOptions',
    rootCause: 'Type definition refactoring disambiguated read vs write native flags',
    architectureVerdict: 'NEW_ARCHITECTURE_FABRIC_READY'
  },
  {
    id: 'MIG-015-CEDAR-EVALUATE-EXPORT',
    category: 'native-wasm',
    packageName: '@cedar-policy/cedar-wasm',
    fromVersion: '4.10.0',
    toVersion: '4.12.0',
    legacySnippet: `
import { evaluate } from '@cedar-policy/cedar-wasm/web';
evaluate(policy, entity);
`,
    groundedSnippet: `
import { isAuthorized } from '@cedar-policy/cedar-wasm/web';
isAuthorized({ policies, principal, action, resource, context });
`,
    severedSymbols: ['evaluate'],
    canonicalReplacements: ['isAuthorized(...)'],
    description: 'Cedar WASM 4.12.0 removed evaluate export in favor of isAuthorized',
    rootCause: 'WASM binding aligned with Rust core engine isAuthorized naming',
    architectureVerdict: 'NEW_ARCHITECTURE_FABRIC_READY'
  },
  {
    id: 'MIG-016-EXPO-FILE-SYSTEM-WRITE',
    category: 'tooling',
    packageName: 'expo-file-system',
    fromVersion: '16.0.0',
    toVersion: '18.0.0',
    legacySnippet: `
import * as FileSystem from 'expo-file-system';
await FileSystem.writeAsStringAsync(path, content);
`,
    groundedSnippet: `
import { File, Paths } from 'expo-file-system/next';
const file = new File(Paths.document, 'file.txt');
await file.write(content);
`,
    severedSymbols: ['legacy-writeAsStringAsync-defaults'],
    canonicalReplacements: ['expo-file-system/next File API'],
    description: 'Legacy synchronous/top-level write functions transitioned to modern File/Paths API',
    rootCause: 'Android Scoped Storage and iOS Sandbox modernization',
    architectureVerdict: 'NEW_ARCHITECTURE_FABRIC_READY'
  },
  {
    id: 'MIG-017-REANIMATED-CAROUSEL-IMPORT',
    category: 'animation',
    packageName: 'react-native-reanimated-carousel',
    fromVersion: '3.5.0',
    toVersion: '4.0.0',
    legacySnippet: `
import Carousel from 'react-native-reanimated-carousel';
`,
    groundedSnippet: `
import { Carousel } from 'react-native-reanimated-carousel';
`,
    severedSymbols: ['default-carousel-export'],
    canonicalReplacements: ['named export: { Carousel }'],
    description: 'Default export removed in modern ESM build of reanimated-carousel',
    rootCause: 'Dual-package hazard mitigation and strict ESM compliance',
    architectureVerdict: 'NEW_ARCHITECTURE_FABRIC_READY'
  },
  {
    id: 'MIG-018-RN-WEB-SHIM-DEFAULT',
    category: 'core-rn',
    packageName: 'react-native-web',
    fromVersion: '0.19.0',
    toVersion: '0.20.0',
    legacySnippet: `
import ReactNative from 'react-native-web';
const { View } = ReactNative;
`,
    groundedSnippet: `
import { View } from 'react-native-web';
`,
    severedSymbols: ['default-react-native-web-export'],
    canonicalReplacements: ['named imports: { View, Text }'],
    description: 'Default export removed in modern react-native-web tree-shaking builds',
    rootCause: 'ESM tree-shaking optimization eliminated monolithic namespace export',
    architectureVerdict: 'NEW_ARCHITECTURE_FABRIC_READY'
  },
  {
    id: 'MIG-019-CLIPBOARD-CORE-SEVERED',
    category: 'core-rn',
    packageName: 'react-native',
    fromVersion: '0.68.0',
    toVersion: '0.76.0',
    legacySnippet: `
import { Clipboard } from 'react-native';
Clipboard.setString('text');
`,
    groundedSnippet: `
import * as Clipboard from 'expo-clipboard';
// or @react-native-clipboard/clipboard
Clipboard.setStringAsync('text');
`,
    severedSymbols: ['Clipboard.setString', 'Clipboard'],
    canonicalReplacements: ['expo-clipboard / @react-native-clipboard/clipboard'],
    description: 'Clipboard removed from react-native core (Lean Core initiative)',
    rootCause: 'Extracted to dedicated community package to reduce native binary footprint',
    architectureVerdict: 'NEW_ARCHITECTURE_FABRIC_READY'
  },
  {
    id: 'MIG-020-REACT-CREATE-ELEMENT-DIFFUSE',
    category: 'core-rn',
    packageName: 'react',
    fromVersion: '18.2.0',
    toVersion: '19.3.0',
    legacySnippet: `
import React from 'react';
const element = React.createElement('div', null, 'Hello');
`,
    groundedSnippet: `
const element = <div>Hello</div>; // JSX automatic runtime
`,
    severedSymbols: ['React.createElement-diffuse'],
    canonicalReplacements: ['JSX automatic runtime transform'],
    description: 'Manual React.createElement discouraged in React 19 compiler workflows',
    rootCause: 'React Compiler (Forget) optimizes automatic JSX transforms directly into memory allocations',
    architectureVerdict: 'NEW_ARCHITECTURE_FABRIC_READY'
  }
];
