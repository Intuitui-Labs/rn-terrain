import { describe, it, expect } from 'vitest';
import { IntegrativeSeamsEngine } from '../src/integrative-seams-engine.js';

describe('IntegrativeSeamsEngine & Cross-Package Interaction Guardrails', () => {
  it('detects unbridged setState inside worklet functions and gesture callbacks (Seam 1)', () => {
    const engine = new IntegrativeSeamsEngine();

    const badCode = `
      import { Gesture } from 'react-native-gesture-handler';

      export function DragCard() {
        const [active, setActive] = useState(false);

        const pan = Gesture.Pan()
          .onStart(() => {
            'worklet';
            setActive(true); // Unbridged JS mutation in worklet!
          })
          .onUpdate((event) => {
            'worklet';
            // valid worklet math
          });

        return null;
      }
    `;

    const report = engine.diagnoseSource(badCode, 'DragCard.tsx');

    expect(report.hasViolations).toBe(true);
    expect(report.errorsCount).toBe(1);

    const seam = report.findings[0]!;
    expect(seam.ruleId).toBe('seam/worklet-unbridged-js-mutation');
    expect(seam.seamType).toBe('THREAD_HANDSHAKE');
    expect(seam.severity).toBe('error');
    expect(seam.remediationAdvice).toContain('runOnJS');
    expect(seam.autoFixSnippet).toBe('runOnJS(setActive)(true)');
  });

  it('passes cleanly when setState inside worklet is properly bridged with runOnJS (Seam 1)', () => {
    const engine = new IntegrativeSeamsEngine();

    const goodCode = `
      import { Gesture } from 'react-native-gesture-handler';
      import { runOnJS } from 'react-native-reanimated';

      export function DragCard() {
        const [active, setActive] = useState(false);

        const pan = Gesture.Pan()
          .onStart(() => {
            'worklet';
            runOnJS(setActive)(true); // Correctly bridged across threads!
          });

        return null;
      }
    `;

    const report = engine.diagnoseSource(goodCode, 'DragCard.tsx');
    expect(report.findings.filter((f) => f.ruleId === 'seam/worklet-unbridged-js-mutation')).toHaveLength(0);
  });

  it('detects Pan gesture nested inside ScrollView without activeOffsets or simultaneous coordination (Seam 3)', () => {
    const engine = new IntegrativeSeamsEngine();

    const uncoordinatedGestureCode = `
      import { Gesture, GestureDetector } from 'react-native-gesture-handler';
      import { ScrollView } from 'react-native';

      export function Feed() {
        const pan = Gesture.Pan()
          .onUpdate(() => {
            'worklet';
          });

        return (
          <ScrollView>
            <GestureDetector gesture={pan}>
              <Animated.View />
            </GestureDetector>
          </ScrollView>
        );
      }
    `;

    const report = engine.diagnoseSource(uncoordinatedGestureCode, 'Feed.tsx');
    expect(report.findings.some((f) => f.ruleId === 'seam/gesture-scroll-deadlock')).toBe(true);
  });

  it('detects synchronous JSI calls in functional component render paths (Seam 4)', () => {
    const engine = new IntegrativeSeamsEngine();

    const renderBlockingCode = `
      import { MMKV } from 'react-native-mmkv';

      const storage = new MMKV();

      export function UserHeader() {
        // Synchronous JSI call executed directly on every render pass!
        const username = storage.getString('user_name');

        return <Text>{username}</Text>;
      }
    `;

    const report = engine.diagnoseSource(renderBlockingCode, 'UserHeader.tsx');
    expect(report.findings.some((f) => f.ruleId === 'seam/turbomodule-render-blocking-jsi')).toBe(true);
  });
});
