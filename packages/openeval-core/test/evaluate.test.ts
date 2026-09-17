import { describe, it, expect } from 'vitest';
import { decodeShareState, encodeShareState, evaluateOffers, type AtlasOffer, type UserProfile } from '../src/index.js';

const offer = (id: string, goals: AtlasOffer['goals']): AtlasOffer => ({
  id,
  name: id,
  provider: 'Test',
  category: 'build',
  description: id,
  keywords: [],
  capabilities: [],
  goals,
  setupEffort: 1,
  values: Object.fromEntries(goals.map((goal) => [goal, 5])),
  state: {
    availability: 'active',
    requirements: [],
    limits: [],
    exclusions: [],
    practicalNotes: [],
    lastChecked: '2026-08-29',
    confidence: 'high',
    evidence: [{ source: 'test', url: 'https://example.com', verifiedAt: '2026-08-29', confidence: 'high' }],
  },
});

const profile: UserProfile = {
  goals: ['web_app'],
  weights: { capability: 4, simplicity: 3, learning: 2, launch: 3 },
};

describe('@intuitui-labs/openeval (G0 Pure Mathematical & Contract Tests)', () => {
  it('evaluation ranks goal-fit offers above unrelated offers', () => {
    const result = evaluateOffers(
      [offer('unrelated', ['learning']), offer('builder', ['web_app'])],
      profile,
      new Date('2026-08-29T00:00:00Z'),
    );
    expect(result.recommendations[0]?.offer.id).toBe('builder');
    expect(result.recommendations[1]?.tier).toBe('not_relevant');
  });

  it('share state round-trips deterministically', () => {
    expect(decodeShareState(encodeShareState(profile))).toEqual(profile);
    expect(decodeShareState('invalid')).toBeNull();
  });
});

