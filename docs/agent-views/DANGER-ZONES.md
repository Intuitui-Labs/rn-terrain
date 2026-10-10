# 🚨 AGENT DANGER ZONES: Severed APIs & Banned Patterns
*Auto-synthesized by rn-terrain CuratedKnowledgeBridge from C:\x knowledge vault*
*Last updated: 2026-10-10T13:23:31.370Z*

> **CRITICAL FOR AI CODING AGENTS**:
> Probabilistic next-token prediction causes LLMs to generate outdated 2021–2023 APIs.
> Generating any symbol listed below **will cause a fatal compiler error or native crash**.

---

## 1. `react-native-reanimated` (Target: v4.x / Sacred: 4.7.1)
| ❌ Severed / Banned Symbol | Status | ✅ Canonical Modern Replacement | Root Cause |
| :--- | :--- | :--- | :--- |
| `useAnimatedGestureHandler` | **REMOVED** | `GestureDetector` + `Gesture.Pan()` from RNGH v2 | Decoupled from RNGH; legacy handler deleted. |
| `worklet` directive without `react-native-worklets` | **CRASH** | Must install `react-native-worklets` runtime package | Worklet runtime decoupled from Reanimated in v4. |
| `runOnJS` without worklet runtime | **CRASH** | Worklets thread dispatcher | Inline worklet execution refactored in v4. |

---

## 2. `react-native-gesture-handler` (Target: v3.x / Sacred: 3.3.0)
| ❌ Severed / Banned Symbol | Status | ✅ Canonical Modern Replacement | Root Cause |
| :--- | :--- | :--- | :--- |
| `PanGestureHandler` component | **DEPRECATED** | `<GestureDetector gesture={Gesture.Pan()}>` | Legacy wrapper components bypass New Architecture Fabric state. |
| `TapGestureHandler` component | **DEPRECATED** | `<GestureDetector gesture={Gesture.Tap()}>` | Replaced by fluent Gesture API. |
| `onGestureEvent` prop passing | **REMOVED** | Fluent builder: `Gesture.Pan().onUpdate(...)` | Direct event prop binding replaced by worklet callbacks. |

---

## 3. `react-native-mmkv` (Target: v4.x / Sacred: 4.3.2)
| ❌ Severed / Banned Symbol | Status | ✅ Canonical Modern Replacement | Root Cause |
| :--- | :--- | :--- | :--- |
| Legacy JSI manual bindings | **REMOVED** | Nitro Modules (`react-native-nitro-modules`) | MMKV v4 rewritten on top of Nitro Modules for zero-overhead bridge. |
| Async storage polyfill mode | **BANNED** | Synchronous `storage.getString(key)` | MMKV is strictly synchronous; do not await calls. |

---

## 4. React Native New Architecture (Target: 0.88.0-rc.3 / Fabric)
| ❌ Severed / Banned Symbol | Status | ✅ Canonical Modern Replacement | Root Cause |
| :--- | :--- | :--- | :--- |
| `NativeModules.CustomModule` | **DEPRECATED** | `TurboModuleRegistry.getEnforcing(...)` | Legacy asynchronous JSON bridge eliminated. |
| `findNodeHandle` / `UIManager` | **REMOVED** | Direct ref measurement or Fabric native state | Native view hierarchy disconnected from legacy JS IDs. |
