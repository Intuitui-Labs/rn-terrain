import { describe, it, expect } from 'vitest';
import { ScopedAstParser } from '../src/ast-scoped-parser.js';

describe('ScopedAstParser Escape Hatches, Templates & Lenient Parsing', () => {
  const parser = new ScopedAstParser();

  it('bypasses entire file when // @rn-terrain-ignore-file is present', () => {
    const code = `
      // @rn-terrain-ignore-file
      import React from 'react';
      import { AsyncStorage } from 'react-native';

      const handler = useAnimatedGestureHandler({});
    `;
    const violations = parser.parseAndScan(code);
    expect(violations.length).toBe(0);
  });

  it('bypasses entire file when block comment /* @rn-terrain-ignore-file */ is present', () => {
    const code = `
      /* @rn-terrain-ignore-file: third-party vendored legacy code */
      import { AsyncStorage } from 'react-native';
    `;
    const violations = parser.parseAndScan(code);
    expect(violations.length).toBe(0);
  });

  it('allows line when preceded by // @rn-terrain-ignore', () => {
    const code = `
      import React from 'react';
      // @rn-terrain-ignore
      const handler = useAnimatedGestureHandler({});
    `;
    const violations = parser.parseAndScan(code);
    expect(violations.length).toBe(0);
  });

  it('allows line when preceded by // @rn-terrain-ignore-next-line', () => {
    const code = `
      import React from 'react';
      // @rn-terrain-ignore-next-line
      const handler = useAnimatedGestureHandler({});
    `;
    const violations = parser.parseAndScan(code);
    expect(violations.length).toBe(0);
  });

  it('allows line with trailing comment // @rn-terrain-ignore', () => {
    const code = `
      import React from 'react';
      const handler = useAnimatedGestureHandler({}); // @rn-terrain-ignore
    `;
    const violations = parser.parseAndScan(code);
    expect(violations.length).toBe(0);
  });

  it('allows ignore comment with descriptive reason: // @rn-terrain-ignore: legacy-screen-ticket-402', () => {
    const code = `
      import React from 'react';
      // @rn-terrain-ignore: legacy-screen-ticket-402
      const handler = useAnimatedGestureHandler({});
    `;
    const violations = parser.parseAndScan(code);
    expect(violations.length).toBe(0);
  });

  it('filters specifically targeted rule and retains unrelated violations on other lines', () => {
    const code = `
      import React from 'react';
      // @rn-terrain-ignore reanimated-v2-gesture-handler
      const handler = useAnimatedGestureHandler({});

      import { AsyncStorage } from 'react-native';
    `;
    const violations = parser.parseAndScan(code);
    expect(violations.length).toBe(1);
    expect(violations[0].symbol).toBe('AsyncStorage');
  });

  it('does NOT filter violation if directive targets a different rule', () => {
    const code = `
      import React from 'react';
      // @rn-terrain-ignore rn-core-async-storage-removed
      const handler = useAnimatedGestureHandler({});
    `;
    const violations = parser.parseAndScan(code);
    expect(violations.length).toBe(1);
    expect(violations[0].symbol).toBe('useAnimatedGestureHandler');
  });

  it('parses brownfield files with Flow pragma and Flow type annotations without syntax crashing', () => {
    const flowCode = `
      // @flow
      import React from 'react';
      import { View } from 'react-native';

      type Props = {
        title: ?string,
        count: ?number
      };

      const handler = useAnimatedGestureHandler({});
    `;
    const violations = parser.parseAndScan(flowCode);
    expect(violations.length).toBe(1);
    expect(violations[0].symbol).toBe('useAnimatedGestureHandler');
  });

  it('attaches canonical drop-in replacement templates to violations', () => {
    const code = `
      import { AsyncStorage, ViewPropTypes } from 'react-native';
      const h = useAnimatedGestureHandler({});
    `;
    const violations = parser.parseAndScan(code);
    expect(violations.length).toBe(3);

    for (const v of violations) {
      expect(v.template).toBeDefined();
      expect(typeof v.template).toBe('string');
      expect(v.template!.length).toBeGreaterThan(10);
    }

    const reanimatedV = violations.find(v => v.symbol === 'useAnimatedGestureHandler');
    expect(reanimatedV?.template).toContain('Gesture.Pan()');
    expect(reanimatedV?.template).toContain('<GestureDetector');

    const storageV = violations.find(v => v.symbol === 'AsyncStorage');
    expect(storageV?.template).toContain('@react-native-async-storage/async-storage');
  });
});
