import { describe, it, expect } from 'vitest';
import { YogaLayoutProver } from '../src/yoga-layout-prover.js';

describe('YogaLayoutProver', () => {
  const prover = new YogaLayoutProver();

  it('rejects ScrollView without flex or explicit height', () => {
    const code = `
      export const Feed = () => (
        <View style={{ padding: 16 }}>
          <ScrollView>
            <Text>Item 1</Text>
          </ScrollView>
        </View>
      );
    `;
    const res = prover.diagnoseLayout(code);
    expect(res.valid).toBe(false);
    expect(res.violations[0].ruleId).toBe('layout/scrollview-collapsed-zero-height');
  });

  it('allows ScrollView with flex: 1 style', () => {
    const code = `
      export const Feed = () => (
        <View style={{ flex: 1 }}>
          <ScrollView style={{ flex: 1 }}>
            <Text>Item 1</Text>
          </ScrollView>
        </View>
      );
    `;
    const res = prover.diagnoseLayout(code);
    expect(res.valid).toBe(true);
  });

  it('warns on subminimal touch targets < 44pt', () => {
    const code = `
      export const MiniBtn = () => (
        <TouchableOpacity style={{ width: 20, height: 20 }}>
          <Text>+</Text>
        </TouchableOpacity>
      );
    `;
    const res = prover.diagnoseLayout(code);
    expect(res.violations.some((v) => v.ruleId === 'layout/touch-target-subminimal')).toBe(true);
  });

  it('rejects extreme negative coordinates', () => {
    const code = `
      export const Hidden = () => (
        <View style={{ position: 'absolute', top: -9999 }}>
          <Text>Gone</Text>
        </View>
      );
    `;
    const res = prover.diagnoseLayout(code);
    expect(res.valid).toBe(false);
    expect(res.violations[0].ruleId).toBe('layout/offscreen-unbounded-coordinate');
  });

  it('honors @rn-terrain-ignore-file escape hatch', () => {
    const code = `
      // @rn-terrain-ignore-file
      export const Raw = () => (
        <ScrollView>
          <Text>Ignored</Text>
        </ScrollView>
      );
    `;
    const res = prover.diagnoseLayout(code);
    expect(res.valid).toBe(true);
  });
});
