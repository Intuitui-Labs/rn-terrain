import { describe, it, expect } from 'vitest';
import { JsdocReplacementExtractor } from '../src/compass/jsdoc-replacement-extractor.js';

describe('JsdocReplacementExtractor (Swift-Style JSDoc Replacement Extractor)', () => {
  const extractor = new JsdocReplacementExtractor();

  it('extracts replacement symbol from @link annotation', () => {
    const dtsSnippet = `
/**
 * @deprecated Use {@link Gesture.Pan} from 'react-native-gesture-handler' instead.
 */
export function usePanGesture(): any;
`;
    const rules = extractor.extractRulesFromSource(dtsSnippet, { packageName: 'react-native-gesture-handler' });
    expect(rules.length).toBe(1);
    expect(rules[0].symbol).toBe('usePanGesture');
    expect(rules[0].replacement).toBe('Gesture.Pan');
    expect(rules[0].severity).toBe('soft');
  });

  it('classifies terminal deprecation with "removed in" as hard severed severity', () => {
    const dtsSnippet = `
/**
 * Interpolate values on worklets.
 * @deprecated Use \`interpolate()\` instead. Removed in Reanimated 3.
 */
export declare const interpolateNode: (...args: any[]) => any;
`;
    const rules = extractor.extractRulesFromSource(dtsSnippet, { packageName: 'react-native-reanimated' });
    expect(rules.length).toBe(1);
    expect(rules[0].symbol).toBe('interpolateNode');
    expect(rules[0].replacement).toBe('interpolate()');
    expect(rules[0].severity).toBe('hard');
  });

  it('extracts package alternative from "Import from ..."', () => {
    const dtsSnippet = `
/**
 * Persistent key-value storage.
 * @deprecated AsyncStorage has been removed from react-native core.
 * Import from '@react-native-async-storage/async-storage' instead.
 */
export declare const AsyncStorage: any;
`;
    const rules = extractor.extractRulesFromSource(dtsSnippet, { packageName: 'react-native' });
    expect(rules.length).toBe(1);
    expect(rules[0].symbol).toBe('AsyncStorage');
    expect(rules[0].replacement).toBe("Import from '@react-native-async-storage/async-storage'");
    expect(rules[0].severity).toBe('hard');
  });

  it('skips declarations without @deprecated tag', () => {
    const dtsSnippet = `
/**
 * Modern declarative pan gesture builder.
 */
export function Pan(): any;
`;
    const rules = extractor.extractRulesFromSource(dtsSnippet, { packageName: 'react-native-gesture-handler' });
    expect(rules.length).toBe(0);
  });
});
