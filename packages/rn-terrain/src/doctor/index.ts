/**
 * @file doctor/index.ts
 * Subpath export for @intuitui-labs/rn-terrain/doctor.
 *
 * Provides the unified multi-diagnostic suite:
 *  - Generalized Dependency Doctor (Native surface detection & peer matrix algebra)
 *  - Project Dialect & Local Shape Config Loader (.terrainrc / terrain.config.json)
 *  - TCDI Stack Doctor (AST dialect scan)
 *  - Expo Doctor Bridge
 *  - Sovereign Rust Tooling Doctor
 */

export {
  TcdiDependencyDoctor,
  SACRED_NATIVE_PINS,
  type SacredPinRule,
  type DependencyIssue,
  type DependencyAuditReport,
  type DependencyDoctorOptions,
} from '@intuitui-labs/rn-terrain-scanner';

export {
  detectNativeSurface,
  type NativeSurfaceInfo,
} from '@intuitui-labs/rn-terrain-scanner';

export {
  loadTerrainConfig,
  findTerrainConfigFile,
  PRESET_CONFIGS,
  type TerrainProjectConfig,
  type LocalPinDefinition,
  type RuleSeverity,
} from '@intuitui-labs/rn-terrain-scanner';

export {
  TcdiStackDoctor,
  type TcdiDoctorFinding,
  type TcdiDoctorReport,
  type TargetStackConfig,
} from '@intuitui-labs/rn-terrain-scanner';

export {
  ExpoDoctorBridge,
  type ExpoDoctorResult,
} from '@intuitui-labs/rn-terrain-scanner';

export {
  RustToolingDoctor,
  type DoctorReport,
  type RustToolCheck,
} from '@intuitui-labs/rn-terrain-core';
