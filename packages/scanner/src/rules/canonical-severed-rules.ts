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
  template?: string;
  severity?: 'hard' | 'soft';
}

export const CANONICAL_SEVERED_RULES: SeveredRule[] = [
  // ── 0. Soft Advisory Rules (Java-Style Two-Tier Severity) ─────────────────────
  {
    id: 'rn-core-alert-advisory',
    package: 'react-native',
    symbol: 'Alert.alert',
    type: 'call',
    severity: 'soft',
    replacement: 'Custom Modal or modern dialog component',
    message: "'Alert.alert' has platform visual inconsistencies. Custom modal recommended."
  },
  // ── 1. Reanimated Severed APIs ───────────────────────────────────────────────
  {
    id: 'reanimated-v2-gesture-handler-import',
    package: 'react-native-reanimated',
    symbol: 'useAnimatedGestureHandler',
    type: 'import',
    replacement: "Gesture.Pan().onUpdate(...) from 'react-native-gesture-handler' with <GestureDetector>",
    message: "'useAnimatedGestureHandler' was removed/deprecated in Reanimated v3/v4 worklets. Use modern 'Gesture.Pan()' instead.",
    minBreakingVersion: '3.0.0'
  },
  {
    id: 'reanimated-v2-gesture-handler',
    package: 'react-native-reanimated',
    symbol: 'useAnimatedGestureHandler',
    type: 'call',
    replacement: "Gesture.Pan().onUpdate(...) from 'react-native-gesture-handler' with <GestureDetector>",
    message: "'useAnimatedGestureHandler' was removed/deprecated in Reanimated v3/v4 worklets. Use modern 'Gesture.Pan()' instead.",
    minBreakingVersion: '3.0.0',
    template: `import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const panGesture = Gesture.Pan()
  .onStart(() => {
    'worklet';
  })
  .onUpdate((event) => {
    'worklet';
    // translationX, translationY
  })
  .onEnd(() => {
    'worklet';
  });

// JSX:
<GestureDetector gesture={panGesture}>
  <Animated.View style={animatedStyle} />
</GestureDetector>`
  },
  {
    id: 'reanimated-v1-interpolate-node-import',
    package: 'react-native-reanimated',
    symbol: 'interpolateNode',
    type: 'import',
    replacement: "'interpolate()' from 'react-native-reanimated'",
    message: "'interpolateNode' is a legacy Reanimated v1 API removed in modern versions. Use 'interpolate()' instead.",
    minBreakingVersion: '2.0.0'
  },
  {
    id: 'reanimated-v1-interpolate-node',
    package: 'react-native-reanimated',
    symbol: 'interpolateNode',
    type: 'call',
    replacement: "'interpolate()' from 'react-native-reanimated'",
    message: "'interpolateNode' is a legacy Reanimated v1 API removed in modern versions. Use 'interpolate()' instead.",
    minBreakingVersion: '2.0.0',
    template: `import { interpolate, Extrapolation } from 'react-native-reanimated';

const output = interpolate(
  progress.value,
  [0, 1],
  [0, 100],
  Extrapolation.CLAMP
);`
  },
  {
    id: 'reanimated-v1-transition',
    package: 'react-native-reanimated',
    symbol: 'Transition',
    type: 'import',
    replacement: 'Layout Animations (FadeIn, SlideIn, LinearTransition)',
    message: "'Transition' from Reanimated v1 was removed. Use modern declarative layout transitions.",
    minBreakingVersion: '2.0.0',
    template: `import Animated, { FadeIn, SlideInRight, LinearTransition } from 'react-native-reanimated';

<Animated.View
  entering={FadeIn}
  exiting={SlideInRight}
  layout={LinearTransition}
/>`
  },
  {
    id: 'reanimated-v1-animated-value',
    package: 'react-native-reanimated',
    symbol: 'Value',
    type: 'import',
    replacement: "'useSharedValue()' from 'react-native-reanimated'",
    message: "Reanimated v1 'Value' nodes are obsolete in the New Architecture worklet runtime. Use 'useSharedValue()'.",
    minBreakingVersion: '2.0.0',
    template: `import { useSharedValue } from 'react-native-reanimated';

const progress = useSharedValue(0);`
  },

  // ── 2. Gesture Handler Severed APIs ─────────────────────────────────────────
  {
    id: 'rngh-v1-use-pan-gesture-import',
    package: 'react-native-gesture-handler',
    symbol: 'usePanGesture',
    type: 'import',
    replacement: "'Gesture.Pan()' with <GestureDetector>",
    message: "'usePanGesture' was removed in RNGH 2.0. Use 'Gesture.Pan()' with <GestureDetector>.",
    minBreakingVersion: '2.0.0'
  },
  {
    id: 'rngh-v1-use-pan-gesture',
    package: 'react-native-gesture-handler',
    symbol: 'usePanGesture',
    type: 'call',
    replacement: "'Gesture.Pan()' with <GestureDetector>",
    message: "'usePanGesture' was removed in RNGH 2.0. Use 'Gesture.Pan()' with <GestureDetector>.",
    minBreakingVersion: '2.0.0',
    template: `import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const panGesture = Gesture.Pan()
  .onUpdate((event) => {
    'worklet';
  });

<GestureDetector gesture={panGesture}>
  <Animated.View style={animatedStyle} />
</GestureDetector>`
  },
  {
    id: 'rngh-v1-pan-gesture-handler-import',
    package: 'react-native-gesture-handler',
    symbol: 'PanGestureHandler',
    type: 'import',
    replacement: "'GestureDetector' and 'Gesture.Pan()'",
    message: "Legacy component '<PanGestureHandler>' is deprecated in RNGH v2/v3. Migrate to '<GestureDetector gesture={Gesture.Pan()}>'.",
    minBreakingVersion: '2.0.0',
    template: `import { Gesture, GestureDetector } from 'react-native-gesture-handler';

const panGesture = Gesture.Pan()
  .onUpdate((event) => {
    'worklet';
  });

<GestureDetector gesture={panGesture}>
  <Animated.View style={animatedStyle} />
</GestureDetector>`
  },

  // ── 3. React Native Core Severed / Extracted Modules (RN 0.60 - 0.76+) ──────
  {
    id: 'rn-core-async-storage-removed',
    package: 'react-native',
    symbol: 'AsyncStorage',
    type: 'import',
    replacement: "Import from '@react-native-async-storage/async-storage'",
    message: "AsyncStorage was removed from 'react-native' core in RN 0.60+. Import from '@react-native-async-storage/async-storage'.",
    minBreakingVersion: '0.60.0',
    template: `// Option A: Community AsyncStorage
import AsyncStorage from '@react-native-async-storage/async-storage';
await AsyncStorage.setItem('key', value);
const item = await AsyncStorage.getItem('key');

// Option B: High-Performance MMKV (Recommended for New Architecture)
import { MMKV } from 'react-native-mmkv';
const storage = new MMKV();
storage.set('key', value);
const item = storage.getString('key');`
  },
  {
    id: 'rn-core-view-prop-types-removed',
    package: 'react-native',
    symbol: 'ViewPropTypes',
    type: 'import',
    replacement: "'ViewProps' TypeScript type or 'deprecated-react-native-prop-types'",
    message: "'ViewPropTypes' was removed from 'react-native' core in RN 0.71+. Use TypeScript 'ViewProps' instead.",
    minBreakingVersion: '0.71.0',
    template: `import type { ViewProps } from 'react-native';

interface ComponentProps extends ViewProps {
  customProperty?: string;
}`
  },
  {
    id: 'rn-find-node-handle-severed',
    package: 'react-native',
    symbol: 'findNodeHandle',
    type: 'call',
    replacement: "'useAnimatedRef' from 'react-native-reanimated' or native component ref",
    message: "'findNodeHandle' is severed and removed in React Native New Architecture (Fabric). Use direct refs or 'useAnimatedRef'.",
    minBreakingVersion: '0.76.0',
    template: `import { useAnimatedRef, measure } from 'react-native-reanimated';

const aRef = useAnimatedRef();
// Inside worklet or handler:
// const measurement = measure(aRef);`
  },
  {
    id: 'rn-find-node-handle-import',
    package: 'react-native',
    symbol: 'findNodeHandle',
    type: 'import',
    replacement: "'useAnimatedRef' from 'react-native-reanimated' or native component ref",
    message: "'findNodeHandle' is severed and removed in React Native New Architecture (Fabric). Use direct refs.",
    minBreakingVersion: '0.76.0'
  },
  {
    id: 'rn-uimanager-measure-severed',
    package: 'react-native',
    symbol: 'measureInWindow',
    type: 'member',
    memberObject: 'UIManager',
    memberProperty: 'measureInWindow',
    replacement: "Call '.measureInWindow()' directly on the component ref",
    message: "'UIManager.measureInWindow' is synchronous legacy bridge method removed in Fabric. Call '.measureInWindow()' on the ref.",
    minBreakingVersion: '0.76.0',
    template: `ref.current?.measureInWindow((x, y, width, height) => {
  // coordinates
});`
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
    minBreakingVersion: '0.70.0',
    template: `import { useEffect } from 'react';
import { BackHandler } from 'react-native';

useEffect(() => {
  const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
    return true; // prevent default action
  });
  return () => subscription.remove();
}, []);`
  },
  {
    id: 'rn-core-safe-area-view-deprecated',
    package: 'react-native',
    symbol: 'SafeAreaView',
    type: 'import',
    replacement: "Import 'SafeAreaView' from 'react-native-safe-area-context'",
    message: "'SafeAreaView' from 'react-native' core does not support Edge-to-Edge on Android 15 / Fabric. Use 'react-native-safe-area-context'.",
    minBreakingVersion: '0.76.0',
    template: `import { SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaView style={{ flex: 1 }}>
  {/* Content */}
</SafeAreaView>`
  },
  {
    id: 'rn-core-clipboard-removed',
    package: 'react-native',
    symbol: 'Clipboard',
    type: 'import',
    replacement: "Import from '@react-native-clipboard/clipboard'",
    message: "'Clipboard' was extracted from 'react-native' core in RN 0.60+. Use '@react-native-clipboard/clipboard'.",
    minBreakingVersion: '0.60.0',
    template: `import Clipboard from '@react-native-clipboard/clipboard';

Clipboard.setString('Hello World');
const text = await Clipboard.getString();`
  },
  {
    id: 'rn-core-netinfo-removed',
    package: 'react-native',
    symbol: 'NetInfo',
    type: 'import',
    replacement: "Import from '@react-native-community/netinfo'",
    message: "'NetInfo' was extracted from 'react-native' core in RN 0.60+. Use '@react-native-community/netinfo'.",
    minBreakingVersion: '0.60.0',
    template: `import NetInfo from '@react-native-community/netinfo';

const state = await NetInfo.fetch();
const isConnected = state.isConnected;`
  },
  {
    id: 'rn-core-picker-removed',
    package: 'react-native',
    symbol: 'Picker',
    type: 'import',
    replacement: "Import from '@react-native-picker/picker'",
    message: "'Picker' was extracted from 'react-native' core. Use '@react-native-picker/picker'.",
    minBreakingVersion: '0.60.0',
    template: `import { Picker } from '@react-native-picker/picker';

<Picker selectedValue={selectedValue} onValueChange={(itemValue) => setSelectedValue(itemValue)}>
  <Picker.Item label="Option 1" value="opt1" />
</Picker>`
  },
  {
    id: 'rn-core-slider-removed',
    package: 'react-native',
    symbol: 'Slider',
    type: 'import',
    replacement: "Import from '@react-native-community/slider'",
    message: "'Slider' was extracted from 'react-native' core. Use '@react-native-community/slider'.",
    minBreakingVersion: '0.60.0',
    template: `import Slider from '@react-native-community/slider';

<Slider
  minimumValue={0}
  maximumValue={100}
  value={value}
  onValueChange={setValue}
/>`
  },
  {
    id: 'rn-core-checkbox-removed',
    package: 'react-native',
    symbol: 'CheckBox',
    type: 'import',
    replacement: "Import from '@react-native-community/checkbox'",
    message: "'CheckBox' was extracted from 'react-native' core. Use '@react-native-community/checkbox'.",
    minBreakingVersion: '0.60.0',
    template: `import CheckBox from '@react-native-community/checkbox';

<CheckBox
  disabled={false}
  value={toggleCheckBox}
  onValueChange={(newValue) => setToggleCheckBox(newValue)}
/>`
  },
  {
    id: 'rn-core-masked-view-removed',
    package: 'react-native',
    symbol: 'MaskedViewIOS',
    type: 'import',
    replacement: "Import from '@react-native-masked-view/masked-view'",
    message: "'MaskedViewIOS' was extracted from 'react-native' core. Use '@react-native-masked-view/masked-view'.",
    minBreakingVersion: '0.60.0',
    template: `import MaskedView from '@react-native-masked-view/masked-view';

<MaskedView maskElement={<MaskElement />}>
  <TargetElement />
</MaskedView>`
  },
  {
    id: 'rn-core-progress-view-removed',
    package: 'react-native',
    symbol: 'ProgressViewIOS',
    type: 'import',
    replacement: "Import from '@react-native-community/progress-view'",
    message: "'ProgressViewIOS' was extracted from 'react-native' core. Use '@react-native-community/progress-view'.",
    minBreakingVersion: '0.60.0',
    template: `import { ProgressView } from '@react-native-community/progress-view';

<ProgressView progress={0.5} />`
  },
  {
    id: 'rn-core-segmented-control-removed',
    package: 'react-native',
    symbol: 'SegmentedControlIOS',
    type: 'import',
    replacement: "Import from '@react-native-segmented-control/segmented-control'",
    message: "'SegmentedControlIOS' was extracted from 'react-native' core. Use '@react-native-segmented-control/segmented-control'.",
    minBreakingVersion: '0.60.0',
    template: `import SegmentedControl from '@react-native-segmented-control/segmented-control';

<SegmentedControl
  values={['One', 'Two']}
  selectedIndex={selectedIndex}
  onChange={(event) => setSelectedIndex(event.nativeEvent.selectedSegmentIndex)}
/>`
  },
  {
    id: 'rn-core-date-picker-ios-removed',
    package: 'react-native',
    symbol: 'DatePickerIOS',
    type: 'import',
    replacement: "Import from '@react-native-community/datetimepicker'",
    message: "'DatePickerIOS' was extracted from 'react-native' core. Use '@react-native-community/datetimepicker'.",
    minBreakingVersion: '0.60.0',
    template: `import DateTimePicker from '@react-native-community/datetimepicker';

<DateTimePicker value={date} mode="date" onChange={onChange} />`
  },
  {
    id: 'rn-core-date-picker-android-removed',
    package: 'react-native',
    symbol: 'DatePickerAndroid',
    type: 'import',
    replacement: "Import from '@react-native-community/datetimepicker'",
    message: "'DatePickerAndroid' was extracted from 'react-native' core. Use '@react-native-community/datetimepicker'.",
    minBreakingVersion: '0.60.0',
    template: `import DateTimePicker from '@react-native-community/datetimepicker';

<DateTimePicker value={date} mode="date" onChange={onChange} />`
  },
  {
    id: 'rn-core-push-notification-removed',
    package: 'react-native',
    symbol: 'PushNotificationIOS',
    type: 'import',
    replacement: "Import from '@react-native-community/push-notification-ios'",
    message: "'PushNotificationIOS' was extracted from 'react-native' core. Use '@react-native-community/push-notification-ios'.",
    minBreakingVersion: '0.60.0',
    template: `import PushNotificationIOS from '@react-native-community/push-notification-ios';

PushNotificationIOS.requestPermissions();`
  },
  {
    id: 'rn-core-status-bar-ios-removed',
    package: 'react-native',
    symbol: 'StatusBarIOS',
    type: 'import',
    replacement: "'StatusBar' from 'react-native'",
    message: "'StatusBarIOS' was removed. Use unified 'StatusBar' from 'react-native'.",
    minBreakingVersion: '0.60.0',
    template: `import { StatusBar } from 'react-native';

<StatusBar barStyle="dark-content" />`
  },
  {
    id: 'rn-core-alert-ios-removed',
    package: 'react-native',
    symbol: 'AlertIOS',
    type: 'import',
    replacement: "'Alert.alert()' from 'react-native'",
    message: "'AlertIOS' was removed. Use 'Alert.alert()' from 'react-native'.",
    minBreakingVersion: '0.60.0',
    template: `import { Alert } from 'react-native';

Alert.alert('Title', 'Message', [{ text: 'OK' }]);`
  }
];
