import { describe, it, expect } from 'vitest';
import path from 'node:path';
import fs from 'node:fs';
import { walkProject } from '../src/ast-walker.js';
import type { LegacySignal } from '../src/types.js';

describe('Scanner Bundled Corpus & AST Scope Immunity', () => {
  it('bundles INDEX.json inside packages/scanner/corpus', () => {
    const corpusPath = path.resolve(__dirname, '../corpus/INDEX.json');
    expect(fs.existsSync(corpusPath)).toBe(true);

    const content = JSON.parse(fs.readFileSync(corpusPath, 'utf-8'));
    expect(content.version).toBeDefined();
    expect(content.packages).toBeDefined();
    expect(content.packages['react-native']).toBeDefined();
  });

  it('prevents false-positive fence findings on local functions when package is not imported', async () => {
    const tempDir = path.resolve(__dirname, 'temp-scope-test');
    if (!fs.existsSync(tempDir)) fs.mkdirSync(tempDir, { recursive: true });

    // File 1: calls a local interpolate() without importing react-native-reanimated
    const file1 = path.join(tempDir, 'math-utils.ts');
    fs.writeFileSync(
      file1,
      `
      export function interpolate(a: number, b: number) {
        return a + b;
      }
      const val = interpolate(10, 20);
      `,
      'utf-8'
    );

    const reanimatedSignal: LegacySignal = {
      id: 'reanimated-interpolate-node-signal',
      package: 'react-native-reanimated',
      versionTo: '4.0.0',
      dateReleased: '2026-01-01',
      impactType: 'SEVERED',
      severity: 'CRITICAL',
      matchers: [
        {
          type: 'CallExpression',
          callee: 'interpolate',
        },
      ],
      description: 'Legacy node interpolation removed',
      replacementHint: 'Use modern worklet interpolate',
    };

    const findings = await walkProject({
      srcDir: tempDir,
      baseCwd: tempDir,
      projectSignals: {
        'react-native-reanimated': {
          legacySignals: [reanimatedSignal],
          capabilitySignals: [],
        },
      },
    });

    // Should NOT flag the local interpolate function since react-native-reanimated is never imported in the file!
    expect(findings.fenceFindings).toHaveLength(0);

    // File 2: explicitly imports react-native-reanimated
    const file2 = path.join(tempDir, 'animated-view.tsx');
    fs.writeFileSync(
      file2,
      `
      import { interpolate } from 'react-native-reanimated';
      const result = interpolate(10, 20);
      `,
      'utf-8'
    );

    const findingsWithImport = await walkProject({
      srcDir: tempDir,
      baseCwd: tempDir,
      projectSignals: {
        'react-native-reanimated': {
          legacySignals: [reanimatedSignal],
          capabilitySignals: [],
        },
      },
    });

    // Now it should detect the usage in animated-view.tsx
    expect(findingsWithImport.fenceFindings.length).toBeGreaterThanOrEqual(1);
    expect(findingsWithImport.fenceFindings.some((f) => f.file.includes('animated-view'))).toBe(true);

    // Cleanup
    fs.rmSync(tempDir, { recursive: true, force: true });
  });
});
