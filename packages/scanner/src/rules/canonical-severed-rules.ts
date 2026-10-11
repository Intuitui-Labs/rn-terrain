/**
 * @file canonical-severed-rules.ts
 * Comprehensive Registry of Severed and Deprecated APIs across the React Native Ecosystem.
 *
 * Covers React Native 0.60 -> 0.88+, Reanimated v1-v4, RNGH v1-v3, Nitro, and Community extractions.
 */

export interface SeveredRule {
  id: string;
  package: string;
  symbol: string;
  type: 'import' | 'call' | 'member';
  replacement: string;
  message: string;
  minBreakingVersion?: string;
  memberObject?: string;
  memberProperty?: string;
}

export const CANONICAL_SEVERED_RULES: SeveredRule[] = [
  // ── 1. Reanimated Severed APIs ───────────────────────────────────────────────
  {
    id: 'reanimated-v2-gesture-handler',
    package: 'react-native-reanimated',
    symbol: 'useAnimatedGestureHandler',
    type: 'call',
    replacement: "Gesture.Pan().onUpdate(...) from 'react-native-gesture-handler' with <GestureDetector>",
    message: "'useAnimatedGestureHandler' was removed/deprecated in Reanimated v3/v4 worklets. Use modern 'Gesture.Pan()' instead.",
    minBreakingVersion: '3.0.0'
  },
  {
    id: 'reanimated-v1-interpolate-node',
    package: 'react-native-reanimated',
    symbol: 'interpolateNode',
    type: 'call',
    replacement: "'interpolate()' from 'react-native-reanimated'",
    message: "'interpolateNode' is a legacy Reanimated v1 API removed in modern versions. Use 'interpolate()' instead.",
    minBreakingVersion: '2.0.0'
  },
  {
    id: 'reanimated-v1-transition',
    package: 'react-native-reanimated',
    symbol: 'Transition',
    type: 'import',
    replacement: 'Layout Animations (FadeIn, SlideIn, LinearTransition)',
    message: "'Transition' from Reanimated v1 was removed. Use modern declarative layout transitions.",
    minBreakingVersion: '2.0.0'
  },
  {
    id: 'reanimated-v1-animated-value',
    package: 'react-native-reanimated',
    symbol: 'Value',
    type: 'import',
    replacement: "'useSharedValue()' from 'react-native-reanimated'",
    message: "Reanimated v1 'Value' nodes are obsolete in the New Architecture worklet runtime. Use 'useSharedValue()'.",
    minBreakingVersion: '2.0.0'
  },

  // ── 2. Gesture Handler Severed APIs ─────────────────────────────────────────
  {
    id: 'rngh-v1-use-pan-gesture',
    package: 'react-native-gesture-handler',
    symbol: 'usePanGesture',
    type: 'call',
    replacement: "'Gesture.Pan()' with <GestureDetector>",
    message: "'usePanGesture' was removed in RNGH 2.0. Use 'Gesture.Pan()' with <GestureDetector>.",
    minBreakingVersion: '2.0.0'
  },
  {
    id: 'rngh-v1-pan-gesture-handler-import',
    package: 'react-native-gesture-handler',
    symbol: 'PanGestureHandler',
    type: 'import',
    replacement: "'GestureDetector' and 'Gesture.Pan()'",
    message: "Legacy component '<PanGestureHandler>' is deprecated in RNGH v2/v3. Migrate to '<GestureDetector gesture={Gesture.Pan()}>'.",
    minBreakingVersion: '2.0.0'
  },

  // ── 3. React Native Core Severed / Extracted Modules (RN 0.60 - 0.76+) ──────
  {
    id: 'rn-core-async-storage-removed',
    package: 'react-native',
    symbol: 'AsyncStorage',
    type: 'import',
    replacement: "Import from '@react-native-async-storage/async-storage'",
    message: "AsyncStorage was removed from 'react-native' core in RN 0.60+. Import from '@react-native-async-storage/async-storage'.",
    minBreakingVersion: '0.60.0'
  },
  {
    id: 'rn-core-view-prop-types-removed',
    package: 'react-native',
    symbol: 'ViewPropTypes',
    type: 'import',
    replacement: "'ViewProps' TypeScript type or 'deprecated-react-native-prop-types'",
    message: "'ViewPropTypes' was removed from 'react-native' core in RN 0.71+. Use TypeScript 'ViewProps' instead.",
    minBreakingVersion: '0.71.0'
  },
  {
    id: 'rn-core-back-handler-remove-listener',
    package: 'react-native',
    symbol: 'removeEventListener',
    type: 'member',
    memberObject: 'BackHandler',
    memberProperty: 'removeEventListener',
    replacement: "Call '.remove()' on the subscription returned by 'BackHandler.addEventListener'",
    message: "'BackHandler.removeEventListener' is deprecated and removed in modern RN. Call '.remove()' on the returned subscription.",
    minBreakingVersion: '0.70.0'
  },
  {
    id: 'rn-core-safe-area-view-deprecated',
    package: 'react-native',
    symbol: 'SafeAreaView',
    type: 'import',
    replacement: "Import 'SafeAreaView' from 'react-native-safe-area-context'",
    message: "'SafeAreaView' from 'react-native' core does not support Edge-to-Edge on Android 15 / Fabric. Use 'react-native-safe-area-context'.",
    minBreakingVersion: '0.76.0'
  },
  {
    id: 'rn-core-clipboard-removed',
    package: 'react-native',
    symbol: 'Clipboard',
    type: 'import',
    replacement: "Import from '@react-native-clipboard/clipboard'",
    message: "'Clipboard' was extracted from 'react-native' core in RN 0.60+. Use '@react-native-clipboard/clipboard'.",
    minBreakingVersion: '0.60.0'
  },
  {
    id: 'rn-core-netinfo-removed',
    package: 'react-native',
    symbol: 'NetInfo',
    type: 'import',
    replacement: "Import from '@react-native-community/netinfo'",
    message: "'NetInfo' was extracted from 'react-native' core in RN 0.60+. Use '@react-native-community/netinfo'.",
    minBreakingVersion: '0.60.0'
  },
  {
    id: 'rn-core-picker-removed',
    package: 'react-native',
    symbol: 'Picker',
    type: 'import',
    replacement: "Import from '@react-native-picker/picker'",
    message: "'Picker' was extracted from 'react-native' core. Use '@react-native-picker/picker'.",
    minBreakingVersion: '0.60.0'
  },
  {
    id: 'rn-core-slider-removed',
    package: 'react-native',
    symbol: 'Slider',
    type: 'import',
    replacement: "Import from '@react-native-community/slider'",
    message: "'Slider' was extracted from 'react-native' core. Use '@react-native-community/slider'.",
    minBreakingVersion: '0.60.0'
  },
  {
    id: 'rn-core-checkbox-removed',
    package: 'react-native',
    symbol: 'CheckBox',
    type: 'import',
    replacement: "Import from '@react-native-community/checkbox'",
    message: "'CheckBox' was extracted from 'react-native' core. Use '@react-native-community/checkbox'.",
    minBreakingVersion: '0.60.0'
  },
  {
    id: 'rn-core-masked-view-removed',
    package: 'react-native',
    symbol: 'MaskedViewIOS',
    type: 'import',
    replacement: "Import from '@react-native-masked-view/masked-view'",
    message: "'MaskedViewIOS' was extracted from 'react-native' core. Use '@react-native-masked-view/masked-view'.",
    minBreakingVersion: '0.60.0'
  },
  {
    id: 'rn-core-progress-view-removed',
    package: 'react-native',
    symbol: 'ProgressViewIOS',
    type: 'import',
    replacement: "Import from '@react-native-community/progress-view'",
    message: "'ProgressViewIOS' was extracted from 'react-native' core. Use '@react-native-community/progress-view'.",
    minBreakingVersion: '0.60.0'
  },
  {
    id: 'rn-core-segmented-control-removed',
    package: 'react-native',
    symbol: 'SegmentedControlIOS',
    type: 'import',
    replacement: "Import from '@react-native-segmented-control/segmented-control'",
    message: "'SegmentedControlIOS' was extracted from 'react-native' core. Use '@react-native-segmented-control/segmented-control'.",
    minBreakingVersion: '0.60.0'
  },
  {
    id: 'rn-core-date-picker-ios-removed',
    package: 'react-native',
    symbol: 'DatePickerIOS',
    type: 'import',
    replacement: "Import from '@react-native-community/datetimepicker'",
    message: "'DatePickerIOS' was extracted from 'react-native' core. Use '@react-native-community/datetimepicker'.",
    minBreakingVersion: '0.60.0'
  },
  {
    id: 'rn-core-date-picker-android-removed',
    package: 'react-native',
    symbol: 'DatePickerAndroid',
    type: 'import',
    replacement: "Import from '@react-native-community/datetimepicker'",
    message: "'DatePickerAndroid' was extracted from 'react-native' core. Use '@react-native-community/datetimepicker'.",
    minBreakingVersion: '0.60.0'
  },
  {
    id: 'rn-core-push-notification-removed',
    package: 'react-native',
    symbol: 'PushNotificationIOS',
    type: 'import',
    replacement: "Import from '@react-native-community/push-notification-ios'",
    message: "'PushNotificationIOS' was extracted from 'react-native' core. Use '@react-native-community/push-notification-ios'.",
    minBreakingVersion: '0.60.0'
  },
  {
    id: 'rn-core-status-bar-ios-removed',
    package: 'react-native',
    symbol: 'StatusBarIOS',
    type: 'import',
    replacement: "'StatusBar' from 'react-native'",
    message: "'StatusBarIOS' was removed. Use unified 'StatusBar' from 'react-native'.",
    minBreakingVersion: '0.60.0'
  },
  {
    id: 'rn-core-alert-ios-removed',
    package: 'react-native',
    symbol: 'AlertIOS',
    type: 'import',
    replacement: "'Alert.alert()' from 'react-native'",
    message: "'AlertIOS' was removed. Use 'Alert.alert()' from 'react-native'.",
    minBreakingVersion: '0.60.0'
  }
];
