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
export * from './immune-system.js';
export * from './hermes-sentry.js';
export * from './codemod-engine.js';
export * from './hermes-bytecode-verifier.js';
export * from './yoga-layout-prover.js';
export * from './honeypot-engine.js';
export * from './nitro-auditor.js';
export * from './native-surface-profiler.js';
export * from './physical-native-inspector.js';
export * from './integrative-seams-engine.js';
export * from './rn-terrain-linter.js';
export * from './topological-substrate-profiler.js';
export * from './ecosystem-stack-classifier.js';

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
