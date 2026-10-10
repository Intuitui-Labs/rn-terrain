import { describe, it, expect } from 'vitest';
import { evaluatePackage, normalizeWeights, WEIGHT_PROFILES } from '../src/index.js';

describe('Deconstructible OpenEval Package Engine', () => {
  it('normalizes partial weights to sum to 1.0', () => {
    const custom = normalizeWeights({
      compatibility: 0.5,
      apiModernity: 0.5
    });

    const sum =
      custom.health +
      custom.compatibility +
      custom.apiModernity +
      custom.architectureDrift +
      custom.substrateRigor +
      custom.maintenanceCadence;

    expect(Math.abs(sum - 1.0)).toBeLessThan(0.0001);
  });

  it('evaluates healthy modern package with ADOPT tier', () => {
    const res = evaluatePackage({
      packageId: 'react-native-gesture-handler',
      version: '2.16.0',
      openIssuesRatio: 0.1,
      commitCadenceDays: 10,
      hasNativeCrashReports: false,
      knownComboCollisions: 0,
      severedSymbolsRatio: 0.0,
      modernApiRatio: 1.0,
      supportsNewArchitecture: true,
      strictTypescript: true,
      hasCodemod: true
    });

    expect(res.overallScore).toBeGreaterThanOrEqual(8.5);
    expect(res.recommendationTier).toBe('ADOPT');
    expect(res.deconstructedBreakdown).toHaveLength(6);
    expect(res.dimensionScores.architectureDrift).toBe(9.5);
  });

  it('demotes package with native crashes to HOLD tier', () => {
    const res = evaluatePackage({
      packageId: 'abandoned-native-lib',
      version: '0.4.0',
      openIssuesRatio: 0.9,
      commitCadenceDays: 400,
      hasNativeCrashReports: true,
      knownComboCollisions: 4,
      severedSymbolsRatio: 0.8,
      supportsNewArchitecture: false
    });

    expect(res.overallScore).toBeLessThan(5.0);
    expect(res.recommendationTier).toBe('HOLD');
  });
});
