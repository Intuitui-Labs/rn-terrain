---
title: "Agent Danger Zones — Lethal Patterns & Anti-Patterns"
status: "active"
created: 2026-09-26
updated: 2026-09-26
author: "Antigravity"
tags: [changelog-intelligence, danger-zones, anti-patterns, agent-guidelines]
description: "Hard behavioral constraints and pattern lookup table preventing AI agents from generating outdated or breaking React Native code."
---

# Agent Danger Zones (Lethal Anti-Patterns)

> **Purpose**: This document contains patterns that AI coding agents commonly hallucinate or generate based on pre-2025 training data. In modern React Native (RN 0.86+, Reanimated 4.x, RNGH 3.x, MMKV 4.x, NativeWind 5.x, Expo SDK 57/58), **generating these patterns causes immediate build failures or subtle runtime bugs**.

---

## 🚫 The 10 Most Critical Anti-Patterns

### 1. Reanimated Babel Plugin Path
- ❌ **Lethal Pattern**:
  ```javascript
  // babel.config.js
  plugins: ['react-native-reanimated/plugin']
  ```
- ✅ **Required Modern Pattern**:
  ```javascript
  // babel.config.js
  plugins: ['react-native-worklets/plugin']
  ```
- **Why**: Reanimated 4 extracted its worklet runtime into `react-native-worklets`. The plugin no longer exists in Reanimated.

---

### 2. Worklets Package Name
- ❌ **Lethal Pattern**:
  ```typescript
  import { Worklets } from 'react-native-worklets-core';
  ```
- ✅ **Required Modern Pattern**:
  ```typescript
  import { createWorkletRuntime } from 'react-native-worklets';
  ```
- **Why**: `react-native-worklets-core` was an external prototype; the canonical Software Mansion package for Reanimated 4 is `react-native-worklets`.

---

### 3. Gesture Handler Legacy Components
- ❌ **Lethal Pattern**:
  ```tsx
  import { PanGestureHandler, TapGestureHandler } from 'react-native-gesture-handler';

  <PanGestureHandler onGestureEvent={handler}>
    <View />
  </PanGestureHandler>
  ```
- ✅ **Required Modern Pattern**:
  ```tsx
  import { GestureDetector, Gesture } from 'react-native-gesture-handler';

  const pan = Gesture.Pan().onUpdate((e) => {
    'worklet';
    console.log(e.translationX);
  });

  <GestureDetector gesture={pan}>
    <Animated.View />
  </GestureDetector>
  ```
  *(Or use Gesture Handler 3.x hooks: `usePanGesture`, `useTapGesture`)*
- **Why**: Legacy component handlers are dead in RNGH 3.x under the New Architecture.

---

### 4. Expo Router Navigation Imports
- ❌ **Lethal Pattern**:
  ```tsx
  import { useNavigation, useRoute } from '@react-navigation/native';
  ```
- ✅ **Required Modern Pattern**:
  ```tsx
  import { useNavigation, useRouter, useLocalSearchParams } from 'expo-router';
  ```
- **Why**: Expo Router (SDK 56/57+) forked its navigation internals. Directly importing from `@react-navigation/*` causes state desynchronization and crashes deep linking.

---

### 5. Expo Router SDK 58 Layout Wrapper
- ❌ **Lethal Pattern**:
  ```tsx
  import { withLayoutContext } from 'expo-router';
  export const CustomTabs = withLayoutContext(Navigator);
  ```
- ✅ **Required Modern Pattern**:
  ```tsx
  import { integrateWithRouter } from 'expo-router';
  export const CustomTabs = integrateWithRouter(Navigator);
  ```
- **Why**: `withLayoutContext` is deprecated in SDK 58 beta in favor of `integrateWithRouter`.

---

### 6. MMKV Instantiation
- ❌ **Lethal Pattern**:
  ```typescript
  import { MMKV } from 'react-native-mmkv';
  const storage = new MMKV();
  ```
- ✅ **Required Modern Pattern**:
  ```typescript
  import { createMMKV } from 'react-native-mmkv';
  const storage = createMMKV({ id: 'app-storage' });
  ```
- **Why**: `new MMKV()` class constructor was removed in v4. Use factory function `createMMKV()`.

---

### 7. MMKV Key Deletion
- ❌ **Lethal Pattern**:
  ```typescript
  storage.delete('auth_token');
  ```
- ✅ **Required Modern Pattern**:
  ```typescript
  storage.remove('auth_token');
  ```
- **Why**: `.delete()` was renamed to `.remove()` in MMKV v4.

---

### 8. MMKV Peer Dependency
- ❌ **Lethal Pattern**:
  Installing only `react-native-mmkv`:
  ```bash
  npm install react-native-mmkv
  ```
- ✅ **Required Modern Pattern**:
  Must ensure `react-native-nitro-modules` is installed:
  ```bash
  npm install react-native-mmkv react-native-nitro-modules
  ```
- **Why**: MMKV v4 is powered by Nitro Modules. iOS pod install and Android CMake will fail without it.

---

### 9. NativeWind v5 Babel Plugin
- ❌ **Lethal Pattern**:
  ```javascript
  // babel.config.js
  plugins: ['nativewind/babel']
  ```
- ✅ **Required Modern Pattern**:
  Remove `nativewind/babel` from `babel.config.js` completely. NativeWind v5 has zero Babel dependencies.
- **Why**: v5 is a CSS-first runtime powered by `react-native-css`. Adding the Babel plugin throws module resolution errors.

---

### 10. NativeWind v5 / Tailwind v4 Configuration
- ❌ **Lethal Pattern**:
  Creating or modifying `tailwind.config.js` for colors/fonts.
- ✅ **Required Modern Pattern**:
  Define tokens in `global.css` using `@theme`:
  ```css
  @import "tailwindcss";

  @theme {
    --color-brand-primary: #3b82f6;
  }
  ```
- **Why**: NativeWind v5 moves all configuration from JS to pure CSS directives.
