// Test fixture for RNGH AST rules verification
import React from 'react';
import { View, Text, Modal, ScrollView as CoreScrollView, Pressable as RNGHPressable } from 'react-native';
import { GestureDetector, Gesture, GestureHandlerRootView } from 'react-native-gesture-handler';
import { ReanimatedSwipeable } from 'react-native-gesture-handler/ReanimatedSwipeable';
import BottomSheet from '@gorhom/bottom-sheet';
export default function App() {
  const pan = Gesture.Pan();
  return <View style={{
    flex: 1
  }}>
      {/* 1. Legacy Handler */}
      <GestureDetector gesture={Gesture.Pan()}>
        <View />
      </GestureDetector>

      {/* 2. Modal without GestureHandlerRootView */}
      <Modal visible={true}><GestureHandlerRootView style={{
        flex: 1
      }}>
        <View>
          <Text>Modal content</Text>
        </View>
      </GestureHandlerRootView></Modal>

      {/* 3. Core ScrollView inside GestureDetector */}
      <GestureDetector gesture={pan}>
        <CoreScrollView>
          <Text>Scroll item</Text>
        </CoreScrollView>
      </GestureDetector>

      {/* 4. Pressable from RNGH */}
      <RNGHPressable>
        <Text>Press me</Text>
      </RNGHPressable>

      {/* 5. BottomSheet + ReanimatedSwipeable collision */}
      <BottomSheet snapPoints={['50%']}>
        <ReanimatedSwipeable>
          <Text>Swipe</Text>
        </ReanimatedSwipeable>
      </BottomSheet>
    </View>;
}