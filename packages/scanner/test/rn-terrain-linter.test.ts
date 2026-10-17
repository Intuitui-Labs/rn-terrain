import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { RnTerrainLinter } from '../src/rn-terrain-linter.js';

describe('RnTerrainLinter (Unified Real-Time Linter & ESLint Rule Provider)', () => {
  let tempDir: string;
  let linter: RnTerrainLinter;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rn-linter-test-'));
    linter = new RnTerrainLinter({ projectDir: tempDir });
  });

  afterEach(() => {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {}
  });

  it('detects severed APIs and cross-package integrative hazards in source code', () => {
    const code = `
      import { findNodeHandle } from 'react-native';
      import { useAnimatedGestureHandler } from 'react-native-reanimated';

      export function InteractiveCard() {
        const [count, setCount] = React.useState(0);
        const gesture = useAnimatedGestureHandler({
          onActive: () => {
            'worklet';
            setCount(count + 1); // Thread Handshake Hazard: Mutating outer JS closure from worklet without runOnJS
          },
        });

        const handle = findNodeHandle(this);
      }
    `;

    const findings = linter.lintSource(code, 'InteractiveCard.tsx');

    expect(findings.length).toBeGreaterThanOrEqual(2);

    // Finding 1: Fabric findNodeHandle or Severed useAnimatedGestureHandler
    const severedOrFabric = findings.find((f) => f.ruleId.includes('find-node-handle') || f.ruleId.includes('gesture-handler'));
    expect(severedOrFabric).toBeDefined();

    // Finding 2: Cross-Package Thread Handshake (worklet mutating closure without runOnJS)
    const threadHazard = findings.find((f) => f.ruleId === 'seam/worklet-unbridged-js-mutation');
    expect(threadHazard).toBeDefined();
    expect(threadHazard?.category).toBe('THREAD_HANDSHAKE');
    expect(threadHazard?.remediationAdvice).toContain('runOnJS');
  });

  it('scans a project directory and computes overall health score', () => {
    // Clean file
    fs.writeFileSync(
      path.join(tempDir, 'CleanView.tsx'),
      `
      import React from 'react';
      import { View, Text } from 'react-native';
      export function CleanView() {
        return <View><Text>Safe</Text></View>;
      }
      `
    );

    // Defective file
    fs.writeFileSync(
      path.join(tempDir, 'DefectiveView.tsx'),
      `
      import { findNodeHandle } from 'react-native';
      export function DefectiveView() {
        findNodeHandle(null);
      }
      `
    );

    const report = linter.lintProject(tempDir);

    expect(report.filesScanned).toBe(2);
    expect(report.filesWithIssues).toBe(1);
    expect(report.errorsCount).toBeGreaterThanOrEqual(1);
    expect(report.healthScore).toBeLessThan(100);

    const formatted = RnTerrainLinter.formatTerminalReport(report);
    expect(formatted).toContain('DefectiveView.tsx');
    expect(formatted).toContain('errors');
  });

  it('creates an ESLint rule object compatible with ESLint plugin architecture', () => {
    const rule = RnTerrainLinter.createEslintRule();
    expect(rule.meta).toBeDefined();
    expect(rule.meta.type).toBe('problem');
    expect(typeof rule.create).toBe('function');
  });

  it('supports targeted file list for sub-50ms execution', () => {
    const cleanFile = path.join(tempDir, 'CleanOnly.tsx');
    fs.writeFileSync(cleanFile, "import React from 'react'; export const X = () => null;");

    const report = linter.lintProject(tempDir, { files: [cleanFile] });
    expect(report.filesScanned).toBe(1);
    expect(report.errorsCount).toBe(0);
    expect(report.telemetry?.discoveryTool).toContain('git-staged');
  });

  it('handles stagedOnly gracefully when no files are staged', () => {
    const report = linter.lintProject(tempDir, { stagedOnly: true });
    expect(report.filesScanned).toBe(0);
    expect(report.errorsCount).toBe(0);
    expect(report.healthScore).toBe(100);
  });
});

