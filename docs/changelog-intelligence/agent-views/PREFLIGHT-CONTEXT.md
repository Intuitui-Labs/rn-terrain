---
title: "Agent Pre-flight Context Card"
status: "active"
created: 2026-09-26
updated: 2026-09-26
author: "Antigravity"
tags: [changelog-intelligence, preflight, prompt-injection, context-hook]
description: "Ultra-compact prompt header for AI coding agents working in this repository to prevent temporal API displacement."
---

# Agent Pre-flight Context Card

> **Usage**: Inject this markdown block into agent system prompts or `@context` references before code generation.

```markdown
<!-- BEGIN DEPENDENCY INTELLIGENCE PRE-FLIGHT CONTEXT -->
ENVIRONMENT TARGET (Sep 2026 State):
- React Native: 0.86.2 (New Architecture / Fabric / TurboModules STRICT)
- Reanimated: 4.6.0 | Worklets: 0.12.2 | Gesture Handler: 3.3.0
- Expo Router: SDK 57 (Preparing SDK 58) | MMKV: 4.3.2 (NitroModules)
- NativeWind: 5.0.0-rc.0 (Tailwind CSS v4 CSS-first)

MANDATORY CODING INVARIANTS:
1. REANIMATED / WORKLETS:
   - Babel plugin is ALWAYS 'react-native-worklets/plugin', NEVER 'react-native-reanimated/plugin'.
   - Avoid 'as any' on useAnimatedStyle transforms; type each transform tuple property strictly.
   - For auto-hiding overlays, prefer Reanimated 4.6 onCSSTransitionEnd over JS setTimeout.
2. GESTURES:
   - NEVER use <PanGestureHandler> or <TapGestureHandler>; use GestureDetector + Gesture.Pan() or usePanGesture().
3. STORAGE:
   - Always instantiate via createMMKV({ id: '...', compareBeforeSet: true, recoveryStrategy: 'recover-or-recreate' }).
   - NEVER call new MMKV(); use .remove(key), NEVER .delete(key).
4. NAVIGATION:
   - NEVER import from '@react-navigation/native' in route files; import { useRouter, useLocalSearchParams } from 'expo-router'.
   - In tab layouts, avoid <Tabs initialRouteName="...">; export const unstable_settings = { initialRouteName: '...' }.
5. STYLING:
   - NEVER create or modify tailwind.config.js; declare colors/radii in global.css using @theme { --color-*: ... }.
   - Metro uses withNativewind (lowercase 'w'); Babel has NO nativewind/babel plugin.
<!-- END DEPENDENCY INTELLIGENCE PRE-FLIGHT CONTEXT -->
```
