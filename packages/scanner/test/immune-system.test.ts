import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { ImmuneSystem } from '../src/immune-system.js';

describe('ImmuneSystem & Clonal Selection Engine', () => {
  let tempDir: string;
  let ledgerPath: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'ais-test-'));
    ledgerPath = path.join(tempDir, 'immune-memory.json');
  });

  afterEach(() => {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {}
  });

  it('registers an antibody when an antigen is detected', () => {
    const ais = new ImmuneSystem(ledgerPath);
    const ab = ais.registerAntibody({
      callee: 'useAnimatedGestureHandler',
      sourcePackage: 'react-native-reanimated',
      replacement: 'Gesture.Pan()',
      message: 'useAnimatedGestureHandler is severed in v3',
      severity: 'hard'
    });

    expect(ab.hash).toBeDefined();
    expect(ab.strikeCount).toBe(1);
    expect(ab.callee).toBe('useAnimatedGestureHandler');
    expect(fs.existsSync(ledgerPath)).toBe(true);
  });

  it('performs O(1) deflection lookup and increments strike count', () => {
    const ais = new ImmuneSystem(ledgerPath);
    ais.registerAntibody({
      callee: 'useAnimatedGestureHandler',
      sourcePackage: 'react-native-reanimated',
      replacement: 'Gesture.Pan()',
      message: 'severed'
    });

    const match = ais.checkImmunity('useAnimatedGestureHandler', undefined, 'react-native-reanimated');
    expect(match).not.toBeNull();
    expect(match?.strikeCount).toBe(2);

    const nonMatch = ais.checkImmunity('useSharedValue', undefined, 'react-native-reanimated');
    expect(nonMatch).toBeNull();
  });

  it('differentiates member object calls via antibody hash', () => {
    const ais = new ImmuneSystem(ledgerPath);
    ais.registerAntibody({
      callee: 'alert',
      object: 'Alert',
      sourcePackage: 'react-native',
      message: 'Advisory alert deprecation',
      severity: 'soft'
    });

    const match = ais.checkImmunity('alert', 'Alert', 'react-native');
    expect(match).not.toBeNull();
    expect(match?.object).toBe('Alert');
    expect(match?.severity).toBe('soft');

    const wrongObj = ais.checkImmunity('alert', 'CustomAlert', 'react-native');
    expect(wrongObj).toBeNull();
  });

  it('purges expired antibodies when requested', () => {
    const ais = new ImmuneSystem(ledgerPath);
    ais.registerAntibody({
      callee: 'oldApi',
      sourcePackage: 'test-pkg',
      message: 'test'
    });

    expect(ais.listAntibodies().length).toBe(1);
    ais.purge();
    expect(ais.listAntibodies().length).toBe(0);
  });
});
