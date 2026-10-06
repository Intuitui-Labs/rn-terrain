/**
 * @file types.ts
 * Canonical type surface for @intuitui-labs/rn-terrain-scanner.
 *
 * Architecture note:
 *   The scanner's fundamental model is a VERSION RANGE accumulator, not an
 *   event-driven "jump" detector.
 *
 *   For each package, git history yields (v_start, v_current).
 *   The TCDI corpus is then filtered to every entry where:
 *     v_start ≤ entry.version_to ≤ v_current
 *
 *   Every signal in that continuous range is accumulated — not just the
 *   commits where versions changed. The codebase is path-dependent on the
 *   full temporal continuum between those two anchors.
 */

// ─── Version Range ────────────────────────────────────────────────────────────

/** The two anchor points extracted from git history for one package. */
export interface VersionRange {
  /** Oldest version ever installed, from git log. */
  v_start: string;
  /** Currently installed version, from package.json. */
  v_current: string;
}

/** Map of package name → its VersionRange. */
export type ProjectVersionRanges = Record<string, VersionRange>;

// ─── Corpus Entries ───────────────────────────────────────────────────────────

/** Impact classification matching INDEX.json `impact_type` values. */
export type ImpactType =
  | 'BREAKING_API_CHANGE'
  | 'SILENT_BEHAVIORAL_BREAK'
  | 'DEPRECATION_WARNING'
  | 'NEW_CAPABILITY'
  | 'BUG_FIX'
  | 'BUILD_PIPELINE_CHANGE'
  | 'SETUP_CHANGE'
  | 'MAINTENANCE';

export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

/** A single entry from the TCDI corpus (INDEX.json `entries` object). */
export interface CorpusEntry {
  id: string;
  package: string;
  version_to: string;
  date_released: string;
  impact_type: ImpactType;
  severity: Severity;
  code_smell_signatures?: AstMatcher[];
  capabilities_unlocked?: string[];
  file: string;
}

// ─── AST Matchers ─────────────────────────────────────────────────────────────

/**
 * Structured AST matcher — maps a corpus signal to something the AST walker
 * can detect precisely in source code.
 *
 * Using a discriminated union keeps each matcher variant focused and avoids
 * regex-only approximations.
 */
export type AstMatcher =
  | { type: 'JSXIdentifier';    name: string;  severity?: Severity }
  | { type: 'ImportSpecifier';  name: string;  from?: string; severity?: Severity }
  | { type: 'JSXAttribute';     name: string;  severity?: Severity }
  | { type: 'CallExpression';   callee: string; severity?: Severity }
  | { type: 'MemberExpression'; object: string; property: string; severity?: Severity }
  | { type: 'Regex';            pattern: string; flags?: string; severity?: Severity };

// ─── Lifecycle States & Horizons ──────────────────────────────────────────────

/** The 5 primary lifecycle states an API symbol can occupy. */
export type ApiLifecycleState =
  | 'UNSUPPORTED_REMOVED' // Lethal: permanently severed in or before target version
  | 'BROKEN_DEFECTIVE'    // Active regression: upstream defect/bug in target version
  | 'DEPRECATED'          // Decaying: executes, but scheduled for removal or emits warning
  | 'FUNCTIONAL_STABLE'   // Healthy baseline: canonical supported production API
  | 'NEW_CAPABILITY';     // Contextual opportunity: introduced within adoption horizon

/** Strategy for bounding the adoption horizon for "New Capabilities". */
export type AdoptionHorizonStrategy =
  | 'current-major'       // Floor = Major.0.0 of target version
  | 'last-n-minors'       // Floor = Major.(Minor - N).0 of target version
  | 'from-project-start'  // Floor = v_start (first commit in git history)
  | 'explicit';           // Floor = user-specified semver string

export interface HorizonConfig {
  strategy?: AdoptionHorizonStrategy;
  /** Value for 'last-n-minors' (e.g. 1) or 'explicit' (e.g. '3.1.0') */
  value?: number | string;
}

export interface WorkspaceScanConfig {
  enabled?: boolean;
  /** Explicit package names to include (e.g. ['@repo/ui', '@repo/core']) */
  packages?: string[];
  /** Custom directory paths */
  customDirs?: string[];
}

// ─── Accumulated Signals ──────────────────────────────────────────────────────

/** A signal emitted by the Legacy Fence — something that should not exist. */
export interface LegacySignal {
  entryId: string;
  package: string;
  lifecycleState: ApiLifecycleState;
  /** The version at which this signal becomes active (e.g. REMOVED in 3.0.0). */
  activeFrom: string;
  impactType: ImpactType;
  severity: Severity;
  title: string;
  matchers: AstMatcher[];
  chronologyFile: string;
  repairAdvice?: string;
}

/** A signal emitted by the Capabilities Radar — something that should be used. */
export interface CapabilitySignal {
  entryId: string;
  package: string;
  lifecycleState: ApiLifecycleState;
  /** The version at which this capability became available. */
  availableSince: string;
  title: string;
  capabilitiesUnlocked: string[];
  chronologyFile: string;
}

/** The full accumulated signal set for one project, keyed by package. */
export interface AccumulatedSignals {
  /** version range this accumulation covers */
  range: VersionRange;
  /** Resolved capability adoption horizon floor */
  horizonFloor?: string;
  /** All REMOVED / DEPRECATED / BREAKING signals in [v_start, v_current] */
  legacySignals: LegacySignal[];
  /** All NEW / CAPABILITY signals within [horizonFloor, v_current] */
  capabilitySignals: CapabilitySignal[];
}

export type ProjectSignals = Record<string, AccumulatedSignals>;

// ─── AST Walker Results ───────────────────────────────────────────────────────

/** A concrete match found in the source AST for a Legacy signal. */
export interface FenceFinding {
  signal: LegacySignal;
  file: string;
  line: number;
  column: number;
  /** Exact source text at the matched node. */
  excerpt: string;
  repairAdvice?: string;
}

/** A capability that was available but found nowhere in source. */
export interface RadarFinding {
  signal: CapabilitySignal;
  /** Files where usage COULD have been adopted (imported the package). */
  relatedFiles: string[];
}

// ─── Final Scan Result ────────────────────────────────────────────────────────

export interface ScanSummary {
  totalFenceFindings: number;
  totalRadarFindings: number;
  unsupportedRemoved: number;
  brokenDefective: number;
  deprecated: number;
  critical: number;
  high: number;
  medium: number;
  low: number;
  packagesScanned: number;
  filesWalked: number;
}

export interface ScanResult {
  projectCwd: string;
  scannedAt: string;
  versionRanges: ProjectVersionRanges;
  fenceFindings: FenceFinding[];
  radarFindings: RadarFinding[];
  summary: ScanSummary;
}

// ─── Public API Options ───────────────────────────────────────────────────────

export type ScanMode = 'fence' | 'radar' | 'all';
export type OutputFormat = 'text' | 'json';

/**
 * User-configurable version range bounds.
 * Accepts either `from`/`to` or `v_start`/`v_current`.
 */
export interface ConfigurableVersionRange {
  from?: string;
  to?: string;
  v_start?: string;
  v_current?: string;
}

export interface ScanOptions {
  /** Root directory of the target RN project. Defaults to process.cwd(). */
  cwd?: string;
  /** Which scanner to run. Default: 'all'. */
  mode?: ScanMode;
  /** Subdirectory under cwd to walk for source files. Default: 'src'. */
  srcDir?: string;
  /** Path to the rn-terrain corpus INDEX.json. Auto-resolved if not set. */
  corpusIndexPath?: string;
  /**
   * When true (default), extracts v_start from git history.
   * When false, uses the installed version as both v_start and v_current
   * (single-point analysis, no historical accumulation).
   */
  useGitHistory?: boolean;
  /**
   * Optional package filter (only scan these specific package names).
   */
  packages?: string[];
  /**
   * User-configured start version anchor (from / v_start).
   * Overrides git history extraction.
   */
  from?: string;
  /**
   * User-configured end version anchor (to / v_current).
   * Overrides package.json installed version.
   */
  to?: string;
  /**
   * Specific per-package version range configuration.
   * Allows setting custom start/end versions for individual packages.
   * e.g. { 'react-native-gesture-handler': { from: '2.14.0', to: '2.24.0' } }
   */
  packageRanges?: Record<string, ConfigurableVersionRange>;
  /**
   * Adoption Horizon configuration for new capabilities.
   * Governs which version threshold counts as "new" relative to the project.
   */
  horizon?: HorizonConfig;
  /**
   * Monorepo workspace configuration.
   */
  workspace?: WorkspaceScanConfig;
}


