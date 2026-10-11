import { describe, it, expect } from 'vitest';
import { StatisticalEngine, runStatisticalBenchmark } from '../../src/benchmark/statistical-ttest.js';

describe('StatisticalEngine & Empirical Hypothesis Testing', () => {
  it('computes mean, variance, and standard deviation correctly', () => {
    const data = [2, 4, 4, 4, 5, 5, 7, 9];
    const mean = StatisticalEngine.mean(data);
    expect(mean).toBe(5);

    const variance = StatisticalEngine.variance(data, mean);
    expect(variance).toBeCloseTo(4.571, 3);

    const std = StatisticalEngine.stdDev(data, mean);
    expect(std).toBeCloseTo(2.138, 3);
  });

  it('computes paired t-test between identical samples with zero difference', () => {
    const sample = [1, 2, 3, 4, 5];
    const res = StatisticalEngine.pairedTTest(sample, sample);
    expect(res.tStatistic).toBe(0);
    expect(res.meanDifference).toBe(0);
    expect(res.isStatisticallySignificant).toBe(false);
  });

  it('detects extreme statistical significance when intervention is effective', () => {
    // Cohort A (3-4 turns) vs Cohort C (1 turn)
    const baseline = [4, 4, 3, 5, 4, 3, 4, 5, 4, 3];
    const grounded = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1];

    const res = StatisticalEngine.pairedTTest(baseline, grounded);
    expect(res.tStatistic).toBeGreaterThan(10);
    expect(res.pValue).toBeLessThan(0.001);
    expect(res.isExtremelySignificant).toBe(true);
    expect(res.cohensD).toBeGreaterThan(2.0); // massive effect size
  });

  it('runs full statistical benchmark across all 3 cohorts and generates markdown report', () => {
    const benchmark = runStatisticalBenchmark(20);
    expect(benchmark.turnTestAC.isExtremelySignificant).toBe(true);
    expect(benchmark.severedTestAC.isExtremelySignificant).toBe(true);
    expect(benchmark.markdownReport).toContain('Empirical Evaluation: Statistical Hypothesis t-Test Report');
    expect(benchmark.markdownReport).toContain('Reject H0');
  });
});
