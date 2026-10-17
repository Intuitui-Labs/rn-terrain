import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { cli } from '../src/cli.js';
import { consola } from 'consola';

describe('rn-terrain CLI Linter & Sovereign N-1 Flag Commands', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rn-cli-linter-test-'));
  });

  afterEach(() => {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {}
    vi.restoreAllMocks();
  });

  it('runs "rn-terrain lint" and catches severed APIs in project files', async () => {
    const testFile = path.join(tempDir, 'TestHazard.tsx');
    fs.writeFileSync(
      testFile,
      `
      import { findNodeHandle } from 'react-native';
      export function Broken() {
        findNodeHandle(null);
      }
      `
    );

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await cli.parse(['node', 'rn-terrain', 'lint', testFile, '--format', 'json'], { run: true });

    expect(logSpy).toHaveBeenCalled();
    const output = logSpy.mock.calls.map((c) => c[0]).join('\n');
    expect(output).toContain('findNodeHandle');
    expect(output).toContain('FABRIC_NEW_ARCH');
  });

  it('runs "rn-terrain lint:rules" and outputs ESLint integration guidance', async () => {
    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});

    await cli.parse(['node', 'rn-terrain', 'lint:rules'], { run: true });

    expect(logSpy).toHaveBeenCalled();
    const output = logSpy.mock.calls.map((c) => c[0]).join('\n');
    expect(output).toContain('eslint.config.js');
    expect(output).toContain('RnTerrainLinter.createEslintRule()');
  });

  it('runs "rn-terrain diff:flags" with synthetic fixtures and outputs severed APIs', async () => {
    const cacheDir = path.join(tempDir, 'cache');
    const nMinusOneDir = path.join(cacheDir, 'react-native-reanimated@2.14.0');
    fs.mkdirSync(nMinusOneDir, { recursive: true });
    fs.writeFileSync(
      path.join(nMinusOneDir, 'package.json'),
      JSON.stringify({ name: 'react-native-reanimated', version: '2.14.0', types: 'index.d.ts' })
    );
    fs.writeFileSync(
      path.join(nMinusOneDir, 'index.d.ts'),
      `
/**
 * @deprecated Use Gesture.Pan() instead.
 */
export function useAnimatedGestureHandler(): any;
`
    );

    const nDir = path.join(cacheDir, 'react-native-reanimated@3.16.0');
    fs.mkdirSync(nDir, { recursive: true });
    fs.writeFileSync(
      path.join(nDir, 'package.json'),
      JSON.stringify({ name: 'react-native-reanimated', version: '3.16.0', types: 'index.d.ts' })
    );
    fs.writeFileSync(path.join(nDir, 'index.d.ts'), `export const interpolate: any;`);

    const logSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    const errSpy = vi.spyOn(consola, 'error');

    await cli.parse([
      'node',
      'rn-terrain',
      'diff:flags',
      'react-native-reanimated',
      '2.14.0',
      '3.16.0',
      '--cache-dir',
      cacheDir,
    ], { run: true });

    // Allow async CAC action to resolve
    await new Promise((r) => setTimeout(r, 100));

    expect(logSpy).toHaveBeenCalled();
    const output = logSpy.mock.calls.map((c) => c[0]).join('\n');
    expect(output).toContain('SOVEREIGN N-1 DECLARATION DIFF REPORT');
    expect(output).toContain('useAnimatedGestureHandler');
    expect(output).toContain('Gesture.Pan()');
  });
});
