import { describe, it, expect } from 'vitest';
import {
  ChangeStreamBenchmarkRunner
} from '../../src/benchmark/change-stream-runner.js';
import {
  CANONICAL_CHANGE_STREAM_FIXTURES
} from '../../src/benchmark/change-stream-fixtures.js';

describe('Change-Stream Benchmark: Vibe-Coded vs rn-terrain Grounded', () => {
  const runner = new ChangeStreamBenchmarkRunner();

  it('contains exactly 20 canonical real-world breaking migration scenarios', () => {
    expect(CANONICAL_CHANGE_STREAM_FIXTURES.length).toBe(20);
  });

  it('runs full benchmark and proves 100% deflection of severed symbols in Cohort B', () => {
    const scorecard = runner.runFullBenchmark();

    // Cohort A (Vibe-Coded / Ungrounded baseline)
    expect(scorecard.cohortA.severedSymbolLeakRate).toBe(100);
    expect(scorecard.cohortA.firstPassCrashRate).toBe(100);
    expect(scorecard.cohortA.groundedPassRate).toBe(0);

    // Cohort B (rn-terrain Grounded Agent)
    expect(scorecard.cohortB.severedSymbolLeakRate).toBe(0);
    expect(scorecard.cohortB.firstPassCrashRate).toBe(0);
    expect(scorecard.cohortB.groundedPassRate).toBe(100);
    expect(scorecard.cohortB.canonicalRemediationAccuracy).toBe(100);
  }, 20000);

  it('validates critical Reanimated 4 Fabric requirement in MIG-001', () => {
    const fixture = CANONICAL_CHANGE_STREAM_FIXTURES.find(
      (f) => f.id === 'MIG-001-REANIMATED-GESTURE-HANDLER'
    )!;
    const result = runner.evaluateFixture(fixture);

    expect(result.cohortA.outcome).toBe('CRASH_RUNTIME');
    expect(result.cohortB.outcome).toBe('SAFE_GROUNDED');
    expect(result.cohortB.architectureVerdict).toBe('NEW_ARCHITECTURE_FABRIC_READY');
  });

  it('validates Fabric findNodeHandle severance in MIG-005', () => {
    const fixture = CANONICAL_CHANGE_STREAM_FIXTURES.find(
      (f) => f.id === 'MIG-005-RN-FIND-NODE-HANDLE'
    )!;
    const result = runner.evaluateFixture(fixture);

    expect(result.cohortB.blockedByGate).toBe(true);
    expect(result.cohortB.outcome).toBe('SAFE_GROUNDED');
  });
});
