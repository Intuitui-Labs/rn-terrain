/**
 * @file canonical-schema.ts
 * Master Relational Bitemporal SQLite DDL & TypeScript Types for the RN-Terrain Platform.
 *
 * Implements the 8 canonical tables:
 *   1. packages
 *   2. package_versions (bitemporal: valid_from_epoch, valid_to_epoch)
 *   3. api_symbols (5-state lifecycle: FUNCTIONAL_STABLE, DEPRECATED, UNSUPPORTED_REMOVED, BROKEN_DEFECTIVE, NEW_CAPABILITY)
 *   4. compatibility_combos
 *   5. compatibility_matrix
 *   6. eval_scores (OpenEval 6 dimensions + grounded citations)
 *   7. decision_actions (Choice, Score, Predicate inference logs from Clef/MS-Decision-1/Jev)
 *   8. dev_tools_ecosystem (pnpm, bun, hermes, metro, etc.)
 */

export const MASTER_DDL = `
-- 1. Package Catalog
CREATE TABLE IF NOT EXISTS packages (
  id TEXT PRIMARY KEY,                       -- e.g. 'react-native-gesture-handler'
  vendor TEXT,                               -- e.g. 'software-mansion'
  category TEXT NOT NULL,                    -- e.g. 'gesture-system', 'animation', 'navigation'
  tier TEXT DEFAULT 'COMMUNITY',             -- 'CORE', 'TIER_1', 'COMMUNITY', 'INCUBATING'
  repository_url TEXT,
  documentation_url TEXT,
  created_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

-- 2. Package Versions (Bitemporal)
CREATE TABLE IF NOT EXISTS package_versions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  package_id TEXT NOT NULL,
  version TEXT NOT NULL,                     -- e.g. '2.16.0'
  valid_from_epoch INTEGER NOT NULL,         -- Valid-time release timestamp
  valid_to_epoch INTEGER,                    -- Valid-time deprecation/superseded timestamp (NULL = active)
  system_tx_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now')), -- System-time insertion transaction
  react_native_min TEXT,                     -- Minimum compatible RN version (e.g. '0.74.0')
  react_native_max TEXT,                     -- Maximum compatible RN version
  supports_new_arch INTEGER NOT NULL DEFAULT 1, -- 0 = Old Arch only, 1 = Fabric/TurboModules
  tarball_url TEXT,
  FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
  UNIQUE (package_id, version)
);

CREATE INDEX IF NOT EXISTS idx_versions_package_epoch 
  ON package_versions(package_id, valid_from_epoch, valid_to_epoch);

-- 3. Granular API Symbols & Lifecycle
CREATE TABLE IF NOT EXISTS api_symbols (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  package_id TEXT NOT NULL,
  version TEXT NOT NULL,
  symbol_identifier TEXT NOT NULL,           -- e.g. 'usePanGesture', 'Gesture.Pan()'
  symbol_type TEXT NOT NULL,                 -- 'HOOK', 'COMPONENT', 'FUNCTION', 'TYPE', 'PROP'
  status TEXT NOT NULL,                      -- 'NEW_CAPABILITY', 'FUNCTIONAL_STABLE', 'DEPRECATED', 'UNSUPPORTED_REMOVED', 'BROKEN_DEFECTIVE'
  replacement_symbol TEXT,                   -- e.g. 'Gesture.Pan()'
  replacement_package TEXT,                  -- In case API moved to another package
  codemod_available INTEGER DEFAULT 0,
  codemod_rule_id TEXT,                      -- ast-grep rule identifier
  documentation_anchor TEXT,
  valid_from_epoch INTEGER NOT NULL,
  valid_to_epoch INTEGER,
  FOREIGN KEY (package_id, version) REFERENCES package_versions(package_id, version) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_symbols_lookup 
  ON api_symbols(package_id, version, symbol_identifier);
CREATE INDEX IF NOT EXISTS idx_symbols_status 
  ON api_symbols(package_id, status);

-- 4. Multi-Package Compatibility Combos
CREATE TABLE IF NOT EXISTS compatibility_combos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  combo_key TEXT NOT NULL UNIQUE,            -- e.g. 'rngh:reanimated:rn'
  package_a TEXT NOT NULL,
  package_b TEXT NOT NULL,
  category TEXT NOT NULL                     -- 'NATIVE_BINARY', 'FABRIC_VIEW', 'WORKLET_RUNTIME', 'PEER_DEP'
);

-- 5. Compatibility Matrix Slices
CREATE TABLE IF NOT EXISTS compatibility_matrix (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  combo_id INTEGER NOT NULL,
  version_a_range TEXT NOT NULL,             -- Semver range e.g. '^2.16.0'
  version_b_range TEXT NOT NULL,             -- Semver range e.g. '^3.16.0'
  status TEXT NOT NULL,                      -- 'COMPATIBLE', 'WARNING_PEER', 'BREAKING_COLLISION', 'BROKEN_NATIVE'
  collision_severity INTEGER DEFAULT 0,      -- 0 (safe) to 10 (hard SIGSEGV crash)
  title TEXT,
  what_broke TEXT,
  forces_or_breaks TEXT,
  mitigation_strategy TEXT,
  fixed_in_version TEXT,
  valid_from_epoch INTEGER NOT NULL,
  valid_to_epoch INTEGER,
  FOREIGN KEY (combo_id) REFERENCES compatibility_combos(id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_matrix_lookup 
  ON compatibility_matrix(combo_id, status);

-- 6. OpenEval Dimension Scores
CREATE TABLE IF NOT EXISTS eval_scores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  package_id TEXT NOT NULL,
  version TEXT NOT NULL,
  eval_run_epoch INTEGER NOT NULL DEFAULT (strftime('%s', 'now')),
  overall_score REAL NOT NULL,               -- 0.0 to 10.0
  health_score REAL NOT NULL,
  compatibility_score REAL NOT NULL,
  api_modernity_score REAL NOT NULL,
  arch_drift_score REAL NOT NULL,
  substrate_rigor_score REAL NOT NULL,
  maintenance_cadence_score REAL NOT NULL,
  weight_profile_used TEXT NOT NULL DEFAULT 'default',
  grounded_citations_json TEXT,              -- JSON array of factual citations
  FOREIGN KEY (package_id, version) REFERENCES package_versions(package_id, version) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS idx_eval_scores_pkg 
  ON eval_scores(package_id, version);

-- 7. Decision Actions & Inferences
CREATE TABLE IF NOT EXISTS decision_actions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  entity_type TEXT NOT NULL,                 -- 'PACKAGE', 'SYMBOL', 'COMBO', 'DIFF'
  entity_id TEXT NOT NULL,
  query_type TEXT NOT NULL,                  -- 'CHOICE', 'SCORE', 'PREDICATE'
  decision_primitive TEXT NOT NULL,          -- e.g. 'AUTO_EXECUTE', 'HUMAN_TRIAGE', 'QUARANTINE_HOLD'
  confidence_score REAL NOT NULL,            -- Calibrated probability (0.0 to 1.0)
  brier_loss REAL,
  engine_used TEXT NOT NULL,                 -- 'clef-flash', 'microsoft-decision-1', 'openai-decisions', 'jev', 'local-gguf'
  rationale_summary TEXT,
  evaluated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);

CREATE INDEX IF NOT EXISTS idx_decision_entity 
  ON decision_actions(entity_type, entity_id);

-- 8. Developer Ecosystem & Dev Tools
CREATE TABLE IF NOT EXISTS dev_tools_ecosystem (
  id TEXT PRIMARY KEY,                       -- 'pnpm', 'bun', 'hermes', 'metro', 'nitro-modules'
  category TEXT NOT NULL,                    -- 'PACKAGE_MANAGER', 'JS_ENGINE', 'BUNDLER', 'BUILD_TOOL'
  status TEXT NOT NULL,                      -- 'RECOMMENDED', 'EVALUATING', 'SPECIALIZED', 'LEGACY'
  primary_advantage TEXT,
  rn_compatibility_notes TEXT,
  docs_url TEXT
);

-- 9. Granular Capabilities Registry
CREATE TABLE IF NOT EXISTS granular_capabilities (
  id TEXT PRIMARY KEY,                       -- e.g. 'gesture.pan_recognition', 'storage.synchronous_kv', 'monorepo.polyglot_rust_build', 'agent.skills_protocol'
  name TEXT NOT NULL,
  category TEXT NOT NULL,                    -- 'GESTURE', 'ANIMATION', 'STORAGE', 'NETWORKING', 'MONOREPO', 'AGENT_TOOLING', 'RUST_COMPUTE'
  description TEXT,
  level TEXT NOT NULL DEFAULT 'PRIMITIVE',   -- 'PRIMITIVE', 'COMPOSED', 'ARCHITECTURAL'
  fabric_native_required INTEGER NOT NULL DEFAULT 0,
  alternative_capabilities TEXT              -- JSON array of alternate capability IDs
);

-- 10. Package & Tool Capabilities Mapping (Bitemporal)
CREATE TABLE IF NOT EXISTS package_capabilities (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  package_id TEXT NOT NULL,
  version_introduced TEXT NOT NULL,
  version_deprecated TEXT,
  version_severed TEXT,
  capability_id TEXT NOT NULL,
  quality_tier TEXT NOT NULL DEFAULT 'CANONICAL', -- 'CANONICAL', 'INCUBATING', 'LEGACY_BRIDGED'
  performance_profile TEXT,                  -- 'UI_THREAD_NATIVE', 'JS_THREAD_ASYNC', 'WORKLET_NATIVE'
  caveats TEXT,
  FOREIGN KEY (package_id) REFERENCES packages(id) ON DELETE CASCADE,
  FOREIGN KEY (capability_id) REFERENCES granular_capabilities(id) ON DELETE CASCADE,
  UNIQUE (package_id, capability_id, version_introduced)
);

CREATE INDEX IF NOT EXISTS idx_pkg_capabilities_lookup 
  ON package_capabilities(capability_id, package_id);

-- 11. Technology Radar Decisions & Assessments
CREATE TABLE IF NOT EXISTS technology_radar (
  id TEXT PRIMARY KEY,                       -- e.g. 'react-native-uniffi-bridge', 'legendapp-state'
  subject TEXT NOT NULL,
  subject_type TEXT NOT NULL DEFAULT 'package',
  verdict TEXT NOT NULL,                     -- 'ADOPT', 'TRIAL', 'ASSESS', 'HOLD'
  confidence TEXT,                           -- 'high', 'medium', 'low'
  category TEXT,
  use_case TEXT,
  problem TEXT,
  decision TEXT,
  revisit_when TEXT,
  metadata_json TEXT,                        -- JSON object with compatibility, risks, alternatives
  updated_at INTEGER NOT NULL DEFAULT (strftime('%s', 'now'))
);
`;


export type SymbolLifecycleStatus =
  | 'NEW_CAPABILITY'
  | 'FUNCTIONAL_STABLE'
  | 'DEPRECATED'
  | 'UNSUPPORTED_REMOVED'
  | 'BROKEN_DEFECTIVE';

export interface PackageRecord {
  id: string;
  vendor: string | null;
  category: string;
  tier: 'CORE' | 'TIER_1' | 'COMMUNITY' | 'INCUBATING';
  repository_url: string | null;
  documentation_url: string | null;
  created_at: number;
}

export interface PackageVersionRecord {
  id?: number;
  package_id: string;
  version: string;
  valid_from_epoch: number;
  valid_to_epoch: number | null;
  system_tx_at?: number;
  react_native_min: string | null;
  react_native_max: string | null;
  supports_new_arch: number;
  tarball_url: string | null;
}

export interface ApiSymbolRecord {
  id?: number;
  package_id: string;
  version: string;
  symbol_identifier: string;
  symbol_type: 'HOOK' | 'COMPONENT' | 'FUNCTION' | 'TYPE' | 'PROP';
  status: SymbolLifecycleStatus;
  replacement_symbol: string | null;
  replacement_package: string | null;
  codemod_available: number;
  codemod_rule_id: string | null;
  documentation_anchor: string | null;
  valid_from_epoch: number;
  valid_to_epoch: number | null;
}

export interface CompatibilityComboRecord {
  id?: number;
  combo_key: string;
  package_a: string;
  package_b: string;
  category: 'NATIVE_BINARY' | 'FABRIC_VIEW' | 'WORKLET_RUNTIME' | 'PEER_DEP';
}

export interface CompatibilityMatrixRecord {
  id?: number;
  combo_id: number;
  version_a_range: string;
  version_b_range: string;
  status: 'COMPATIBLE' | 'WARNING_PEER' | 'BREAKING_COLLISION' | 'BROKEN_NATIVE';
  collision_severity: number;
  title: string | null;
  what_broke: string | null;
  forces_or_breaks: string | null;
  mitigation_strategy: string | null;
  fixed_in_version: string | null;
  valid_from_epoch: number;
  valid_to_epoch: number | null;
}

export interface EvalScoreRecord {
  id?: number;
  package_id: string;
  version: string;
  eval_run_epoch?: number;
  overall_score: number;
  health_score: number;
  compatibility_score: number;
  api_modernity_score: number;
  arch_drift_score: number;
  substrate_rigor_score: number;
  maintenance_cadence_score: number;
  weight_profile_used: string;
  grounded_citations_json: string;
}

export interface DecisionActionRecord {
  id?: number;
  entity_type: 'PACKAGE' | 'SYMBOL' | 'COMBO' | 'DIFF';
  entity_id: string;
  query_type: 'CHOICE' | 'SCORE' | 'PREDICATE';
  decision_primitive: string;
  confidence_score: number;
  brier_loss: number | null;
  engine_used: string;
  rationale_summary: string | null;
  evaluated_at?: number;
}

export interface DevToolRecord {
  id: string;
  category: 'PACKAGE_MANAGER' | 'JS_ENGINE' | 'BUNDLER' | 'BUILD_TOOL' | 'CLI_TOOL' | 'RUST_SHINY_TOOL' | 'AGENT_PROTOCOL';
  status: 'RECOMMENDED' | 'EVALUATING' | 'SPECIALIZED' | 'LEGACY';
  primary_advantage: string | null;
  rn_compatibility_notes: string | null;
  docs_url: string | null;
}

export interface GranularCapabilityRecord {
  id: string;
  name: string;
  category: 'GESTURE' | 'ANIMATION' | 'STORAGE' | 'NETWORKING' | 'MONOREPO' | 'AGENT_TOOLING' | 'RUST_COMPUTE' | 'UI_COMPONENT';
  description: string | null;
  level: 'PRIMITIVE' | 'COMPOSED' | 'ARCHITECTURAL';
  fabric_native_required: number; // 0 or 1
  alternative_capabilities?: string | null; // JSON array
}

export interface PackageCapabilityRecord {
  id?: number;
  package_id: string;
  version_introduced: string;
  version_deprecated?: string | null;
  version_severed?: string | null;
  capability_id: string;
  quality_tier: 'CANONICAL' | 'INCUBATING' | 'LEGACY_BRIDGED';
  performance_profile?: 'UI_THREAD_NATIVE' | 'JS_THREAD_ASYNC' | 'WORKLET_NATIVE' | null;
  caveats?: string | null;
}

export interface TechnologyRadarRecord {
  id: string;
  subject: string;
  subject_type: string;
  verdict: 'ADOPT' | 'TRIAL' | 'ASSESS' | 'HOLD';
  confidence: 'high' | 'medium' | 'low';
  category: string | null;
  use_case?: string | null;
  problem?: string | null;
  decision?: string | null;
  revisit_when?: string | null;
  metadata_json?: string | null;
  updated_at?: number;
}

