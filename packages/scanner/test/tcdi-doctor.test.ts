import { describe, it, expect } from 'vitest';
import { TcdiStackDoctor } from '../src/tcdi-doctor.js';

describe('TcdiStackDoctor - Temporal Pattern Diagnostic Engine', () => {
  it('penalizes New Architecture violations as fatal errors on Modern Stack (RN 0.88 + Reanimated 4)', () => {
    const doctor = new TcdiStackDoctor({
      targetStack: {
        reactNative: '^0.88.0',
        architecture: 'new-arch',
        reanimated: '^4.7.1',
      },
    });

    const code = `
      import { findNodeHandle } from 'react-native';
      import { useAnimatedGestureHandler } from 'react-native-reanimated';

      export function MyComponent() {
        const handler = useAnimatedGestureHandler({
          onStart: () => {},
        });

        const measure = () => {
          const handle = findNodeHandle(this);
        };
      }
    `;

    const report = doctor.diagnoseSnippet(code, 'src/MyComponent.tsx');

    expect(report.totalFindings).toBe(2);
    expect(report.errorsCount).toBe(2);
    expect(report.warningsCount).toBe(0);

    const findNodeHandleFinding = report.findings.find((f) => f.ruleId === 'rn/fabric-no-find-node-handle');
    expect(findNodeHandleFinding).toBeDefined();
    expect(findNodeHandleFinding?.severity).toBe('error');
    expect(findNodeHandleFinding?.temporalNote).toContain('FATAL on Fabric');

    const gestureFinding = report.findings.find((f) => f.ruleId === 'rn/reanimated-v2-gesture-handler');
    expect(gestureFinding).toBeDefined();
    expect(gestureFinding?.severity).toBe('error');
    expect(gestureFinding?.temporalNote).toContain('SEVERED in Reanimated v4');

    expect(report.healthScore).toBeLessThan(80);
  });

  it('downgrades New Architecture violations to warnings on Legacy Paper Stack (RN 0.74 + Reanimated 3)', () => {
    const doctor = new TcdiStackDoctor({
      targetStack: {
        reactNative: '0.74.2',
        architecture: 'paper',
        reanimated: '^3.16.0',
      },
    });

    const code = `
      import { findNodeHandle } from 'react-native';
      import { useAnimatedGestureHandler } from 'react-native-reanimated';

      export function LegacyComponent() {
        const handler = useAnimatedGestureHandler({
          onStart: () => {},
        });
        const handle = findNodeHandle(this);
      }
    `;

    const report = doctor.diagnoseSnippet(code, 'src/LegacyComponent.tsx');

    expect(report.totalFindings).toBe(2);
    expect(report.errorsCount).toBe(0);
    expect(report.warningsCount).toBe(2);

    const findNodeHandleFinding = report.findings.find((f) => f.ruleId === 'rn/fabric-no-find-node-handle');
    expect(findNodeHandleFinding?.severity).toBe('warn');
    expect(findNodeHandleFinding?.temporalNote).toContain('DEPRECATED on Paper');

    const gestureFinding = report.findings.find((f) => f.ruleId === 'rn/reanimated-v2-gesture-handler');
    expect(gestureFinding?.severity).toBe('warn');
    expect(gestureFinding?.temporalNote).toContain('DEPRECATED in Reanimated v3');

    expect(report.status).toBe('HEALTHY');
  });

  it('scores clean modern React Native code with 100 SOLID health', () => {
    const doctor = new TcdiStackDoctor({
      targetStack: {
        reactNative: '^0.88.0',
        architecture: 'new-arch',
        reanimated: '^4.7.1',
      },
    });

    const code = `
      import React, { useRef } from 'react';
      import { View, Pressable } from 'react-native';
      import { Gesture, GestureDetector } from 'react-native-gesture-handler';

      export function ModernComponent() {
        const pan = Gesture.Pan().onUpdate(() => {});
        return (
          <GestureDetector gesture={pan}>
            <Pressable>
              <View />
            </Pressable>
          </GestureDetector>
        );
      }
    `;

    const report = doctor.diagnoseSnippet(code, 'src/ModernComponent.tsx');

    expect(report.totalFindings).toBe(0);
    expect(report.errorsCount).toBe(0);
    expect(report.warningsCount).toBe(0);
    expect(report.healthScore).toBe(100);
    expect(report.status).toBe('SOLID');
  });

  it('prevents false positives when a symbol is imported from a non-culprit package (provenance isolation)', () => {
    const doctor = new TcdiStackDoctor();
    doctor.loadSeveredRules([
      {
        id: 'expo-router-useStore-severed',
        package: 'expo-router',
        symbol: 'useStore',
        type: 'call',
        replacement: 'Use Zustand or React Context directly',
        message: "'useStore' was severed in expo-router",
        severity: 'hard',
      },
    ]);

    // File imports useStore from @repo/core and also imports expo-router
    const code = `
      import { useStore } from '@repo/core/logic';
      import { useRouter, useLocalSearchParams } from 'expo-router';

      export function Screen() {
        const router = useRouter();
        const user = useStore((s) => s.user);
        return null;
      }
    `;

    const report = doctor.diagnoseSnippet(code, 'src/Screen.tsx');
    expect(report.totalFindings).toBe(0);
    expect(report.errorsCount).toBe(0);
  });
});
