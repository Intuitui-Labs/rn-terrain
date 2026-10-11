/**
 * @file scanner/index.ts
 * Subpath export for @intuitui-labs/rn-terrain/scanner.
 *
 * Exposes AST analysis, Tree-sitter polyglot matching, and Agent Guardrail.
 */

export {
  scan,
  walkProject,
  accumulateSignals,
  loadCorpus,
  getCorpusPackages,
  extractVersionRanges,
  compareSemver,
  formatReport,
  AgentGuardrail,
  type GuardrailCheckOptions,
  type GuardrailVerdict,
  TreeSitterCodeMatcher,
  TreeSitterCodeMatcher as TreeSitterMatcher,
  type PatternFinding,
} from '@intuitui-labs/rn-terrain-scanner';

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
} from '@intuitui-labs/rn-terrain-scanner';
