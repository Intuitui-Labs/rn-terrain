import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { SovereignVersionDiffer } from '../src/compass/sovereign-version-differ.js';

describe('SovereignVersionDiffer (Local N-1 Declaration Differ & Severed Extractor)', () => {
  let tempDir: string;
  let differ: SovereignVersionDiffer;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sovereign-differ-test-'));
    differ = new SovereignVersionDiffer(tempDir);
  });

  afterEach(() => {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {}
  });

  it('extracts exported symbols and metadata from .d.ts content', () => {
    const dts = `
/**
 * Legacy gesture handler hook.
 * @deprecated Use \`Gesture.Pan()\` instead. Removed in modern versions.
 */
export function useAnimatedGestureHandler(): any;

export const useSharedValue: (init: any) => any;
export class AnimatedView {}
export type SharedValue<T> = { value: T };
`;

    const symbols = differ.extractSymbolsFromDts(dts, 'react-native-reanimated');
    expect(symbols.size).toBe(4);
    expect(symbols.has('useAnimatedGestureHandler')).toBe(true);
    expect(symbols.get('useAnimatedGestureHandler')?.deprecated).toBe(true);
    expect(symbols.get('useAnimatedGestureHandler')?.replacement).toBe('Gesture.Pan()');
    expect(symbols.get('useSharedValue')?.deprecated).toBe(false);
  });

  it('diffs synthetic N-1 and N directory fixtures and extracts severed rules', async () => {
    // 1. Create synthetic fixture for N-1 (v2.14.0)
    const nMinusOneDir = path.join(tempDir, 'cache', 'react-native-reanimated@2.14.0');
    fs.mkdirSync(nMinusOneDir, { recursive: true });
    fs.writeFileSync(
      path.join(nMinusOneDir, 'package.json'),
      JSON.stringify({ name: 'react-native-reanimated', version: '2.14.0', types: 'index.d.ts' })
    );
    fs.writeFileSync(
      path.join(nMinusOneDir, 'index.d.ts'),
      `
/**
 * @deprecated Use \`Gesture.Pan()\` with GestureDetector. Removed in v3.
 */
export function useAnimatedGestureHandler(): any;

/**
 * @deprecated Use \`interpolate()\` instead.
 */
export const interpolateNode: (...args: any[]) => any;

export const useSharedValue: (val: any) => any;
`
    );

    // 2. Create synthetic fixture for N (v3.16.0)
    const nDir = path.join(tempDir, 'cache', 'react-native-reanimated@3.16.0');
    fs.mkdirSync(nDir, { recursive: true });
    fs.writeFileSync(
      path.join(nDir, 'package.json'),
      JSON.stringify({ name: 'react-native-reanimated', version: '3.16.0', types: 'index.d.ts' })
    );
    fs.writeFileSync(
      path.join(nDir, 'index.d.ts'),
      `
export const useSharedValue: (val: any) => any;
export const interpolate: (...args: any[]) => any;
`
    );

    // 3. Diff N-1 vs N using local cache
    const report = await differ.diffVersions({
      packageName: 'react-native-reanimated',
      fromVersion: '2.14.0',
      toVersion: '3.16.0',
      projectRoot: tempDir,
      cacheDir: path.join(tempDir, 'cache'),
    });

    expect(report.severedSymbolsCount).toBe(2);
    expect(report.severedRules.map((r) => r.symbol)).toContain('useAnimatedGestureHandler');
    expect(report.severedRules.map((r) => r.symbol)).toContain('interpolateNode');

    const gestureRule = report.severedRules.find((r) => r.symbol === 'useAnimatedGestureHandler');
    expect(gestureRule?.replacement).toBe('Gesture.Pan()');
    expect(gestureRule?.severity).toBe('hard');
  });

  it('persists and reloads extracted rules in project .agents/rules/ directory', () => {
    const rules = [
      {
        id: 'test-rule-1',
        package: 'test-pkg',
        symbol: 'legacyHook',
        type: 'call' as const,
        severity: 'hard' as const,
        replacement: 'modernHook()',
        message: 'legacyHook was severed',
      },
    ];

    const savedPath = differ.syncRulesToProject(rules, tempDir);
    expect(fs.existsSync(savedPath)).toBe(true);

    const loaded = SovereignVersionDiffer.loadProjectSeveredRules(tempDir);
    expect(loaded.length).toBe(1);
    expect(loaded[0].symbol).toBe('legacyHook');
  });

  it('gracefully handles packages without N-1 (initial release or untracked) using single-version reflection', async () => {
    vi.spyOn(SovereignVersionDiffer, 'inferPredecessorVersion').mockReturnValue(null);

    const pkgDir = path.join(tempDir, 'node_modules', 'brand-new-pkg');
    fs.mkdirSync(pkgDir, { recursive: true });
    fs.writeFileSync(
      path.join(pkgDir, 'package.json'),
      JSON.stringify({ name: 'brand-new-pkg', version: '1.0.0', types: 'index.d.ts' })
    );
    fs.writeFileSync(
      path.join(pkgDir, 'index.d.ts'),
      `
/**
 * @deprecated Experimental API. Use modern alternative instead.
 */
export function earlyExperimental(): void;

export function safeStable(): void;
`
    );

    const report = await differ.diffVersions({
      packageName: 'brand-new-pkg',
      toVersion: 'installed',
      projectRoot: tempDir,
      cacheDir: path.join(tempDir, 'cache'),
    });

    expect(report.fromVersion).toContain('initial release');
    expect(report.severedSymbolsCount).toBe(0);
    expect(report.newlyDeprecatedCount).toBe(1);
    expect(report.newlyDeprecatedRules[0]?.symbol).toBe('earlyExperimental');
    expect(report.source).toBe('single-version-reflection');
  });
});
