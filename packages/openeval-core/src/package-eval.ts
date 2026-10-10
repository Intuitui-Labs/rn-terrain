/**
 * @file package-eval.ts
 * Deconstructible 6-Dimension OpenEval Engine for Ecosystem Packages.
 */

import {
  type OpenEvalWeights,
  type WeightProfileName,
  WEIGHT_PROFILES,
  normalizeWeights
} from './weights.js';

export interface PackageRawMetrics {
  packageId: string;
  version: string;
  openIssuesRatio?: number;           // 0.0 (all closed) to 1.0 (all open)
  commitCadenceDays?: number;         // Days since last release / commit
  hasNativeCrashReports?: boolean;    // SIGSEGV / ABI collision reports
  knownComboCollisions?: number;      // Count of conflicting package combos
  severedSymbolsRatio?: number;       // Ratio of removed/broken exported symbols
  modernApiRatio?: number;            // Ratio of modern vs deprecated symbols
  supportsNewArchitecture?: boolean;  // Fabric & TurboModules support
  strictTypescript?: boolean;         // Types shipped with full strict mode
  hasCodemod?: boolean;               // Automated ast-grep codemod available
  citations?: Array<{ source: string; claim: string; url?: string }>;
}

export interface DimensionBreakdown {
  dimension: keyof OpenEvalWeights;
  score: number;                      // 0.0 to 10.0
  weight: number;                     // 0.0 to 1.0
  contribution: number;               // score * weight
  rationale: string;
}

export interface PackageEvaluationResult {
  packageId: string;
  version: string;
  overallScore: number;               // 0.0 to 10.0
  dimensionScores: Record<keyof OpenEvalWeights, number>;
  weightsUsed: OpenEvalWeights;
  profileUsed: string;
  deconstructedBreakdown: DimensionBreakdown[];
  groundedCitations: Array<{ source: string; claim: string; url?: string }>;
  recommendationTier: 'ADOPT' | 'TRIAL' | 'ASSESS' | 'HOLD';
}

export function evaluatePackage(
  metrics: PackageRawMetrics,
  profile: WeightProfileName = 'default',
  customWeights?: Partial<OpenEvalWeights>
): PackageEvaluationResult {
  const weights = customWeights ? normalizeWeights(customWeights) : (WEIGHT_PROFILES[profile] ?? WEIGHT_PROFILES.default);

  // 1. Health (0 - 10)
  const openRatio = metrics.openIssuesRatio ?? 0.2;
  const healthScore = Math.max(0, Math.min(10, 10 - openRatio * 6));
  const healthRationale = `Open issue ratio is ${(openRatio * 100).toFixed(0)}%, yielding maintenance score of ${healthScore.toFixed(1)}/10.`;

  // 2. Compatibility (0 - 10)
  let compatScore = 9.5;
  if (metrics.hasNativeCrashReports) compatScore -= 4.5;
  compatScore -= (metrics.knownComboCollisions ?? 0) * 1.5;
  compatScore = Math.max(0, Math.min(10, compatScore));
  const compatRationale = metrics.hasNativeCrashReports
    ? `Penalized for native crash reports and ${metrics.knownComboCollisions ?? 0} combo collisions.`
    : `High stability with ${metrics.knownComboCollisions ?? 0} known collision points.`;

  // 3. API Modernity (0 - 10)
  const severedPenalty = (metrics.severedSymbolsRatio ?? 0) * 5.0;
  const modernBonus = (metrics.modernApiRatio ?? 0.8) * 5.0;
  const apiModernityScore = Math.max(0, Math.min(10, 5.0 + modernBonus - severedPenalty));
  const apiRationale = `Modern API coverage ${(metrics.modernApiRatio ?? 0.8) * 100}% with ${(metrics.severedSymbolsRatio ?? 0) * 100}% severed/deprecated APIs.`;

  // 4. Architecture Drift (0 - 10)
  const archDriftScore = metrics.supportsNewArchitecture ? 9.5 : 4.0;
  const archRationale = metrics.supportsNewArchitecture
    ? 'Fully aligned with React Native New Architecture (Fabric & TurboModules).'
    : 'Lacks native New Architecture bridge; operates in legacy interop mode.';

  // 5. Substrate Rigor (0 - 10)
  let substrateScore = 6.0;
  if (metrics.strictTypescript) substrateScore += 2.5;
  if (metrics.hasCodemod) substrateScore += 1.5;
  substrateScore = Math.max(0, Math.min(10, substrateScore));
  const substrateRationale = `TypeScript rigor: ${metrics.strictTypescript ? 'Strict' : 'Standard'}, Codemod tooling: ${metrics.hasCodemod ? 'Available' : 'None'}.`;

  // 6. Maintenance Cadence (0 - 10)
  const cadenceDays = metrics.commitCadenceDays ?? 30;
  const cadenceScore = cadenceDays <= 14 ? 9.8 : cadenceDays <= 60 ? 8.0 : cadenceDays <= 180 ? 5.5 : 2.0;
  const cadenceRationale = `Last active ${cadenceDays} days ago.`;

  const dimensionScores: Record<keyof OpenEvalWeights, number> = {
    health: healthScore,
    compatibility: compatScore,
    apiModernity: apiModernityScore,
    architectureDrift: archDriftScore,
    substrateRigor: substrateScore,
    maintenanceCadence: cadenceScore
  };

  const deconstructedBreakdown: DimensionBreakdown[] = [
    {
      dimension: 'health',
      score: healthScore,
      weight: weights.health,
      contribution: healthScore * weights.health,
      rationale: healthRationale
    },
    {
      dimension: 'compatibility',
      score: compatScore,
      weight: weights.compatibility,
      contribution: compatScore * weights.compatibility,
      rationale: compatRationale
    },
    {
      dimension: 'apiModernity',
      score: apiModernityScore,
      weight: weights.apiModernity,
      contribution: apiModernityScore * weights.apiModernity,
      rationale: apiRationale
    },
    {
      dimension: 'architectureDrift',
      score: archDriftScore,
      weight: weights.architectureDrift,
      contribution: archDriftScore * weights.architectureDrift,
      rationale: archRationale
    },
    {
      dimension: 'substrateRigor',
      score: substrateScore,
      weight: weights.substrateRigor,
      contribution: substrateScore * weights.substrateRigor,
      rationale: substrateRationale
    },
    {
      dimension: 'maintenanceCadence',
      score: cadenceScore,
      weight: weights.maintenanceCadence,
      contribution: cadenceScore * weights.maintenanceCadence,
      rationale: cadenceRationale
    }
  ];

  const overallScore = Math.round(
    deconstructedBreakdown.reduce((sum, item) => sum + item.contribution, 0) * 10
  ) / 10;

  let recommendationTier: 'ADOPT' | 'TRIAL' | 'ASSESS' | 'HOLD';
  if (overallScore >= 8.0 && compatScore >= 7.0) {
    recommendationTier = 'ADOPT';
  } else if (overallScore >= 6.5) {
    recommendationTier = 'TRIAL';
  } else if (overallScore >= 5.0) {
    recommendationTier = 'ASSESS';
  } else {
    recommendationTier = 'HOLD';
  }

  return {
    packageId: metrics.packageId,
    version: metrics.version,
    overallScore,
    dimensionScores,
    weightsUsed: weights,
    profileUsed: profile,
    deconstructedBreakdown,
    groundedCitations: metrics.citations ?? [],
    recommendationTier
  };
}
