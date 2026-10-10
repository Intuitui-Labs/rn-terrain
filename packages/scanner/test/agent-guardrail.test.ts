import { describe, it, expect } from 'vitest';
import { AgentGuardrail, TreeSitterCodeMatcher } from '../src/index.js';

describe('Tree-sitter Pattern Matcher & Agent Pre-Flight Guardrail', () => {
  const guard = new AgentGuardrail();

  it('blocks severed Major-1 API (usePanGesture) with remediation prompt', () => {
    const verdict = guard.verify({
      packageName: 'react-native-gesture-handler',
      targetVersion: '2.16.0',
      codeSnippet: `
        import React from 'react';
        export function SwipeBox() {
          const pan = usePanGesture();
          return null;
        }
      `
    });

    expect(verdict.allowed).toBe(false);
    expect(verdict.status).toBe('BLOCKED_SEVERED_API');
    expect(verdict.severedViolations).toHaveLength(1);
    expect(verdict.severedViolations[0]?.matchedText).toBe('usePanGesture()');
    expect(verdict.severedViolations[0]?.replacement).toBe('Gesture.Pan()');
    expect(verdict.remediationPrompt).toContain('Gesture.Pan()');
    expect(verdict.latencyMs).toBeLessThan(100);
  });

  it('passes modern API (Gesture.Pan()) cleanly', () => {
    const verdict = guard.verify({
      packageName: 'react-native-gesture-handler',
      targetVersion: '2.16.0',
      codeSnippet: `
        import React from 'react';
        import { Gesture } from 'react-native-gesture-handler';
        export function ModernBox() {
          const pan = Gesture.Pan();
          return null;
        }
      `
    });

    expect(verdict.allowed).toBe(true);
    expect(verdict.status).toBe('PASSED');
    expect(verdict.severedViolations).toHaveLength(0);
  });
});
