/**
 * @file openeval/index.ts
 * Subpath export for @intuitui-labs/rn-terrain/openeval.
 *
 * Exposes the deconstructible 6-dimension evaluation framework and scoring profiles.
 */

export {
  evaluatePackage,
  DEFAULT_WEIGHTS,
  DEFAULT_WEIGHTS as DEFAULT_WEIGHT_PROFILE,
  WEIGHT_PROFILES,
  normalizeWeights,
  type PackageRawMetrics,
  type DimensionBreakdown,
  type PackageEvaluationResult,
  type OpenEvalWeights,
  type WeightProfileName,
  evaluateOffers,
  type AtlasOffer,
  type UserProfile,
  type Recommendation,
  type EvaluationResult,
} from '@intuitui-labs/openeval';
