import { describe, it, expect } from 'vitest';
import { HermesSentry } from '../src/hermes-sentry.js';

describe('HermesSentry Post-Run Verification', () => {
  it('validates standard modern React Native TypeScript code cleanly', () => {
    const code = `
      import React from 'react';
      import { View, Text } from 'react-native';

      export const SafeHeader = () => {
        return (
          <View>
            <Text>Header</Text>
          </View>
        );
      };
    `;

    const res = HermesSentry.verify(code, 'Component.tsx');
    expect(res.valid).toBe(true);
    expect(res.diagnostics.length).toBe(0);
    expect(res.durationMs).toBeGreaterThanOrEqual(0);
  });

  it('rejects forbidden Hermes strict constructs like with statements', () => {
    const code = `
      function testWith(obj: any) {
        with (obj) {
          console.log(value);
        }
      }
    `;

    const res = HermesSentry.verify(code, 'test.ts');
    expect(res.valid).toBe(false);
    expect(res.diagnostics.some(d => d.rule === 'hermes-no-with')).toBe(true);
  });

  it('rejects reserved keywords in strict variable declarations', () => {
    const code = `
      const interface = 'forbidden';
    `;

    const res = HermesSentry.verify(code, 'bad.js');
    expect(res.valid).toBe(false);
    expect(res.diagnostics.some(d => d.rule === 'hermes-strict-reserved-word')).toBe(true);
  });

  it('rejects duplicate function parameter names in strict mode', () => {
    const code = `
      function duplicateParams(a, a) {
        return a;
      }
    `;

    const res = HermesSentry.verify(code, 'dup.js');
    expect(res.valid).toBe(false);
    expect(res.diagnostics.some(d => d.rule === 'hermes-no-duplicate-params')).toBe(true);
  });

  it('reports syntax parse errors directly to diagnostics', () => {
    const brokenCode = `
      const a = (
    `;

    const res = HermesSentry.verify(brokenCode, 'broken.ts');
    expect(res.valid).toBe(false);
    expect(res.diagnostics.some(d => d.rule === 'hermes-strict-syntax')).toBe(true);
  });
});
