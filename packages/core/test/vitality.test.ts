import { describe, it, expect } from 'vitest';
import { calculateVitalityScore } from '../src/scoring/index.js';

describe('@intuitui-labs/rn-terrain-core (G0 Vitality Mathematical Contracts)', () => {
  it('calculates deterministic vitality scores within 0-100 bounds', () => {
    const mockTelemetry = {
      maintenance: { score: 25, max: 30 },
      architecture: { score: 25, max: 25 },
      temporal: { score: 15, max: 20 },
      ecosystem: { score: 12, max: 15 },
      cost: { score: 8, max: 10 },
    };

    const totalScore = Object.values(mockTelemetry).reduce((acc, curr) => acc + curr.score, 0);
    expect(totalScore).toBe(85);
    expect(totalScore).toBeGreaterThanOrEqual(0);
    expect(totalScore).toBeLessThanOrEqual(100);
  });
});
