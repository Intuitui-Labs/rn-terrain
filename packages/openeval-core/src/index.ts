export type OfferCategory = 'build' | 'hosting' | 'data' | 'ai' | 'design' | 'learning' | 'testing' | 'collaboration';
export type Goal = 'web_app' | 'mobile_app' | 'ai_data' | 'learning' | 'launching';
export type Freshness = 'fresh' | 'aging' | 'stale';

export type OfferAvailability = 'active' | 'limited' | 'paused' | 'winding_down' | 'expired' | 'unknown';
export type Requirement = 'student_verification' | 'age_18_plus' | 'new_account' | 'payment_method' | 'regional' | 'provider_approval';
export interface Evidence { source: string; url: string; verifiedAt: string; confidence: 'high' | 'medium' | 'low'; kind?: 'official' | 'community' | 'observed'; note?: string; }
export interface OfferState { availability: OfferAvailability; validFrom?: string; validUntil?: string; requirements: Requirement[]; limits: string[]; exclusions: string[]; practicalNotes: string[]; lastChecked: string; confidence: 'high' | 'medium' | 'low' | 'unknown'; evidence: Evidence[]; }
export interface AtlasOffer { id: string; name: string; provider: string; category: OfferCategory; description: string; keywords: string[]; capabilities: string[]; goals: Goal[]; setupEffort: 1 | 2 | 3; values: Partial<Record<Goal, number>>; state: OfferState; prerequisites?: string[]; limitations?: string[]; }
export interface UserProfile { goals: Goal[]; weights: { capability: number; simplicity: number; learning: number; launch: number }; }
export interface Recommendation { offer: AtlasOffer; score: number; tier: 'start_here' | 'useful_next' | 'explore_later' | 'not_relevant'; reasons: string[]; warnings: string[]; }
export interface EvaluationResult { catalogueVersion: string; evaluatorVersion: string; recommendations: Recommendation[]; profile: UserProfile; generatedAt: string; }

export const CATALOGUE_VERSION = '2026-08-29';

export function evaluateOffers(offers: AtlasOffer[], profile: UserProfile, now = new Date()): EvaluationResult {
  const maxWeight = Math.max(1, profile.weights.capability + profile.weights.simplicity + profile.weights.learning + profile.weights.launch);
  const recommendations = offers.map((offer): Recommendation => {
    const goalFit = profile.goals.length ? profile.goals.reduce((sum, goal) => sum + (offer.values[goal] ?? 0), 0) / profile.goals.length : 0;
    const capability = goalFit * profile.weights.capability;
    const simplicity = (4 - offer.setupEffort) * profile.weights.simplicity;
    const learning = (offer.category === 'learning' ? 4 : offer.category === 'build' ? 2 : 1) * profile.weights.learning;
    const launch = (offer.goals.includes('launching') ? 4 : 1) * profile.weights.launch;
    const realityPenalty = offer.state.availability === 'active' ? 0 : offer.state.availability === 'limited' ? 8 : offer.state.availability === 'unknown' ? 12 : 25;
    const score = Math.max(0, Math.round(((capability + simplicity + learning + launch) / (maxWeight * 4)) * 100) - realityPenalty);
    const relevant = profile.goals.some((goal) => offer.goals.includes(goal));
    const reasons = [
      relevant ? `Fits your ${profile.goals.join(' and ').replaceAll('_', ' ')} path.` : 'Not closely matched to the selected goals.',
      offer.setupEffort === 1 ? 'Low setup effort.' : offer.setupEffort === 3 ? 'Requires more setup and context.' : 'Moderate setup effort.',
      `Practical status: ${offer.state.availability.replace('_', ' ')}; checked ${offer.state.lastChecked}.`,
    ];
    const warnings = [...offer.state.practicalNotes];
    if (offer.state.exclusions.length) warnings.push(`Restrictions: ${offer.state.exclusions.join('; ')}`);
    if (offer.state.requirements.length) warnings.push(`Requirements: ${offer.state.requirements.join(', ').replaceAll('_', ' ')}`);
    if (offer.state.confidence !== 'high') warnings.push(`Availability confidence is ${offer.state.confidence}; verify before depending on it.`);
    const tier = !relevant ? 'not_relevant' : score >= 70 ? 'start_here' : score >= 50 ? 'useful_next' : 'explore_later';
    return { offer, score, tier, reasons, warnings };
  }).sort((a, b) => b.score - a.score || a.offer.name.localeCompare(b.offer.name));
  return { catalogueVersion: CATALOGUE_VERSION, evaluatorVersion: '0.1.0', recommendations, profile, generatedAt: now.toISOString() };
}

export function encodeShareState(profile: UserProfile): string { return encodeURIComponent(JSON.stringify(profile)); }
export function decodeShareState(value: string): UserProfile | null { try { const parsed = JSON.parse(decodeURIComponent(value)); if (!Array.isArray(parsed.goals) || !parsed.weights) return null; return parsed as UserProfile; } catch { return null; } }

export * from './ingestion';
