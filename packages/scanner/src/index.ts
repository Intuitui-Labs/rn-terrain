/**
 * @file index.ts
 * Public API surface for @intuitui-labs/rn-terrain-scanner.
 */

export { scan } from './scan.js';
export { extractVersionRanges, compareSemver } from './git-drift.js';
export { accumulateSignals, loadCorpus, getCorpusPackages } from './accumulator.js';
export { walkProject } from './ast-walker.js';
export { formatReport } from './reporter.js';
export * from './tree-sitter-matcher.js';
export * from './agent-guardrail.js';
export * from './rules/canonical-severed-rules.js';
export * from './ast-scoped-parser.js';
export * from './polyglot-bridge.js';
export * from './tcdi-doctor.js';
export * from './dependency-doctor.js';
export * from './expo-doctor-bridge.js';
export * from './config-loader.js';
export * from './native-surface.js';

export type {
  ScanOptions,
  ScanResult,
  ScanSummary,
  ScanMode,
  OutputFormat,
  ConfigurableVersionRange,
  ApiLifecycleState,
  AdoptionHorizonStrategy,
  HorizonConfig,
  WorkspaceScanConfig,
  ProjectVersionRanges,
  VersionRange,
  ProjectSignals,
  AccumulatedSignals,
  LegacySignal,
  CapabilitySignal,
  FenceFinding,
  RadarFinding,
  AstMatcher,
  CorpusEntry,
  ImpactType,
  Severity,
} from './types.js';
