import { describe, it, expect } from 'vitest';
import { HermesBytecodeVerifier } from '../src/hermes-bytecode-verifier.js';

describe('HermesBytecodeVerifier', () => {
  const verifier = new HermesBytecodeVerifier();

  it('allows valid clean JavaScript code', () => {
    const code = `
      function calculateSum(a, b) {
        'use strict';
        return a + b;
      }
      const result = calculateSum(10, 20);
    `;
    const res = verifier.verifyCode(code, 'math.js');
    expect(res.valid).toBe(true);
  });

  it('rejects direct eval calls under Hermes strict mode', () => {
    const code = `
      function executeDynamic(str) {
        return eval(str);
      }
    `;
    const res = verifier.verifyCode(code, 'eval.js');
    expect(res.valid).toBe(false);
    expect(res.error).toContain("Direct 'eval()' is forbidden");
  });

  it('rejects unshareable window/document captures in worklet closures', () => {
    const code = `
      const panGesture = () => {
        'worklet';
        const title = window.document.title;
        return title;
      };
    `;
    const res = verifier.verifyCode(code, 'worklet.js');
    expect(res.valid).toBe(false);
    expect(res.error).toContain('Captured unshareable host object');
  });

  it('rejects with statements under Hermes strict mode', () => {
    const code = `
      function testWith(obj) {
        with (obj) {
          return a;
        }
      }
    `;
    const res = verifier.verifyCode(code, 'with.js');
    expect(res.valid).toBe(false);
    expect(res.error).toContain("'with' statement is forbidden");
  });

  it('rejects duplicate keys in object literals under Hermes strict mode', () => {
    const code = `
      const obj = {
        name: 'Alpha',
        name: 'Beta',
      };
    `;
    const res = verifier.verifyCode(code, 'duplicateKey.js');
    expect(res.valid).toBe(false);
    expect(res.error).toContain("Duplicate key 'name'");
  });

  it('allows clean worklet closures with local variables', () => {
    const code = `
      const workletFn = (event) => {
        'worklet';
        const x = event.translationX;
        const y = event.translationY;
        return x + y;
      };
    `;
    const res = verifier.verifyCode(code, 'cleanWorklet.js');
    expect(res.valid).toBe(true);
  });
});
