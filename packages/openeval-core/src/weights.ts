/**
 * @file weights.ts
 * Reconfigurable weight profiles for the 6-dimension Deconstructible OpenEval Framework.
 */

export interface OpenEvalWeights {
  health: number;             // Maintenance, issue resolution, supply-chain
  compatibility: number;      // Multi-package combos, peer deps, RN versions
  apiModernity: number;       // Adoption of modern APIs vs deprecated/severed
  architectureDrift: number;  // Fabric / TurboModules alignment
  substrateRigor: number;     // Strict TS types, tests, C++ memory safety
  maintenanceCadence: number; // Release regularity, maintainer responsiveness
}

export const DEFAULT_WEIGHTS: OpenEvalWeights = {
  health: 0.15,
  compatibility: 0.25,
  apiModernity: 0.20,
  architectureDrift: 0.15,
  substrateRigor: 0.15,
  maintenanceCadence: 0.10
};

export const HIGH_SECURITY_WEIGHTS: OpenEvalWeights = {
  health: 0.25,
  compatibility: 0.30,
  apiModernity: 0.10,
  architectureDrift: 0.10,
  substrateRigor: 0.20,
  maintenanceCadence: 0.05
};

export const BLEEDING_EDGE_WEIGHTS: OpenEvalWeights = {
  health: 0.10,
  compatibility: 0.15,
  apiModernity: 0.35,
  architectureDrift: 0.25,
  substrateRigor: 0.10,
  maintenanceCadence: 0.05
};

export const LONG_TERM_SUPPORT_WEIGHTS: OpenEvalWeights = {
  health: 0.20,
  compatibility: 0.35,
  apiModernity: 0.10,
  architectureDrift: 0.10,
  substrateRigor: 0.15,
  maintenanceCadence: 0.10
};

export type WeightProfileName = 'default' | 'high_security' | 'bleeding_edge' | 'lts';

export const WEIGHT_PROFILES: Record<WeightProfileName, OpenEvalWeights> = {
  default: DEFAULT_WEIGHTS,
  high_security: HIGH_SECURITY_WEIGHTS,
  bleeding_edge: BLEEDING_EDGE_WEIGHTS,
  lts: LONG_TERM_SUPPORT_WEIGHTS
};

export function normalizeWeights(weights: Partial<OpenEvalWeights>): OpenEvalWeights {
  const merged: OpenEvalWeights = { ...DEFAULT_WEIGHTS, ...weights };
  const sum =
    merged.health +
    merged.compatibility +
    merged.apiModernity +
    merged.architectureDrift +
    merged.substrateRigor +
    merged.maintenanceCadence;

  if (sum === 0) return DEFAULT_WEIGHTS;

  return {
    health: merged.health / sum,
    compatibility: merged.compatibility / sum,
    apiModernity: merged.apiModernity / sum,
    architectureDrift: merged.architectureDrift / sum,
    substrateRigor: merged.substrateRigor / sum,
    maintenanceCadence: merged.maintenanceCadence / sum
  };
}
