import fs from 'node:fs';
import path from 'node:path';
import semver from 'semver';
import { supabase, isSupabaseConfigured } from './db.js';
import { EmbeddedCatalogAdapter } from './db/embedded-catalog.js';
import {
  RepoDirectorySyncer,
  type RepoPackageDirectoryInfo,
  type RepoDirectoryCache,
} from './ingestion/repo-directory-syncer.js';
import { calculateVitalityScore } from './scoring/index.js';
import type {
  DeveloperContext,
  EcosystemTopology,
  ProjectAudit,
  VitalityCardFull,
  Warning,
} from './types/index.js';

const embeddedCatalog = new EmbeddedCatalogAdapter();

function findDirectoryCache(startDir: string): RepoDirectoryCache | null {
  let curr = path.resolve(startDir);
  for (let i = 0; i < 5; i++) {
    const candidate = path.join(curr, '.agents', 'state', 'directory-cache.json');
    if (fs.existsSync(candidate)) {
      try {
        const raw = fs.readFileSync(candidate, 'utf8');
        return JSON.parse(raw) as RepoDirectoryCache;
      } catch {
        return null;
      }
    }
    const parent = path.dirname(curr);
    if (parent === curr) break;
    curr = parent;
  }
  return null;
}

function mapDirectoryInfoToCard(
  info: RepoPackageDirectoryInfo,
  currentVersion?: string,
): VitalityCardFull {
  const isNewArch = info.supportsNewArchitecture;
  const isUnmaintained = info.unmaintained;
  const rawScore = info.score && info.score > 0 ? info.score : (isNewArch ? 85 : 65);

  let v1Status: 'READY' | 'ADAPTING' | 'AT_RISK' | 'INCOMPATIBLE' = 'READY';
  let v1Score = 85;
  if (isUnmaintained) {
    v1Status = 'INCOMPATIBLE';
    v1Score = 15;
  } else if (isNewArch) {
    v1Status = 'READY';
    v1Score = 92;
  } else {
    v1Status = 'ADAPTING';
    v1Score = 60;
  }

  let radarStatus: 'ADOPT' | 'TRIAL' | 'ASSESS' | 'HOLD' = 'ADOPT';
  if (isUnmaintained) {
    radarStatus = 'HOLD';
  } else if (v1Status === 'READY' && rawScore >= 75) {
    radarStatus = 'ADOPT';
  } else if (v1Status === 'READY' || rawScore >= 60) {
    radarStatus = 'TRIAL';
  } else {
    radarStatus = 'ASSESS';
  }

  const warnings: Warning[] = [];
  if (isUnmaintained) {
    warnings.push({
      severity: 'critical',
      code: 'UNMAINTAINED',
      message: `${info.packageName} is marked unmaintained in the React Native Directory.`,
    });
  }
  if (!isNewArch) {
    warnings.push({
      severity: 'warning',
      code: 'NEW_ARCH_UNVERIFIED',
      message: 'Does not explicitly support React Native New Architecture (Fabric)',
    });
  }

  const vendor = info.packageName.startsWith('@shopify/')
    ? 'shopify'
    : info.packageName.startsWith('@react-navigation/')
      ? 'software-mansion'
      : info.packageName.startsWith('@expo/') || info.packageName === 'expo'
        ? 'expo'
        : info.packageName.includes('software-mansion') ||
            info.packageName.includes('reanimated') ||
            info.packageName.includes('gesture-handler') ||
            info.packageName.includes('screens')
          ? 'software-mansion'
          : info.packageName.startsWith('@react-native/') || info.packageName === 'react-native'
            ? 'meta'
            : 'community';

  const partialCard: Partial<VitalityCardFull> = {
    package_name: info.packageName,
    display_name: info.packageName,
    category: info.category || 'community-library',
    vendor,
    topology_layer: 'L3',
    use_case_tags: [],

    compatibility: {
      ios: true,
      android: true,
      web: false,
      expo_go: info.isExpoCompatible,
      windows: false,
      macos: false,
      new_architecture: isNewArch ? 'native_jsi' : 'unsupported',
      hermes_v1: true,
      expo_config_plugin: info.isExpoCompatible,
    },

    architecture: {
      has_native_code: true,
      jsi_binding: isNewArch ? 'turbomodule' : 'unknown',
      nitro_powered: info.packageName.includes('nitro'),
      wasm_compiled: false,
      wasm_size_bytes: 0,
      bundle_increment_bytes: 0,
      dependency_fan_out: 0,
      thread_safety: 'safe',
      build_time_impact: 'medium',
    },

    version: {
      current: currentVersion || info.version || '0.0.0',
      latest: info.version || '0.0.0',
      lag: { major: 0, minor: 0, patch: 0 },
      safety_band: 'safe',
      days_since_release: 30,
      changelog_url: undefined,
    },

    v1_readiness: {
      status: v1Status,
      score: v1Score,
      legacy_arch_code: !isNewArch,
      stable_js_api_compliant: true,
      breaking_change_risk: isUnmaintained ? 'high' : 'low',
      migration_notes: isUnmaintained
        ? 'Package unmaintained; consider actively maintained alternatives'
        : undefined,
      vendor_maintained: vendor !== 'community',
    },

    deprecation: {
      npm_explicit: isUnmaintained,
      npm_message: isUnmaintained ? 'Marked unmaintained in React Native Directory' : undefined,
      api_level: false,
      ecosystem_level: isUnmaintained,
      platform_level: false,
      silent: isUnmaintained,
    },

    warnings,
    alternatives: [],
    known_conflicts: [],
    common_companions: [],
    links: {
      npm: `https://www.npmjs.com/package/${info.packageName}`,
      github: info.githubUrl,
      rn_directory: `https://reactnative.directory/detail/${info.packageName}`,
    },
    recent_events: [],
    last_updated: new Date().toISOString(),
    data_freshness: 'fresh',
  };

  const scoreBreakdown = calculateVitalityScore(partialCard);
  partialCard.vitality_score =
    rawScore > 0 ? Math.round((scoreBreakdown.total + rawScore) / 2) : scoreBreakdown.total;
  partialCard.score_breakdown = scoreBreakdown;
  partialCard.radar_status = radarStatus;

  return partialCard as VitalityCardFull;
}

function inspectLocalPackage(packageName: string, rootDir: string): VitalityCardFull | null {
  let curr = path.resolve(rootDir);
  for (let i = 0; i < 4; i++) {
    const pkgPath = path.join(curr, 'node_modules', packageName, 'package.json');
    if (fs.existsSync(pkgPath)) {
      try {
        const pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        const pkgDir = path.dirname(pkgPath);
        const hasNativeDir =
          fs.existsSync(path.join(pkgDir, 'android')) || fs.existsSync(path.join(pkgDir, 'ios'));
        const isRn = Boolean(
          pkgJson.keywords?.includes('react-native') ||
            pkgJson.peerDependencies?.['react-native'] ||
            pkgJson.dependencies?.['react-native'] ||
            pkgJson.codegenConfig ||
            packageName.includes('react-native') ||
            packageName.startsWith('@react-native') ||
            packageName.startsWith('@expo') ||
            hasNativeDir,
        );

        const hasNative =
          isRn &&
          (hasNativeDir ||
            Boolean(pkgJson.codegenConfig) ||
            Boolean(pkgJson.turbomodule) ||
            Boolean(pkgJson.nitro));
        const supportsNewArch =
          !hasNative ||
          Boolean(pkgJson.codegenConfig || pkgJson.turbomodule || pkgJson.nitro);

        const info: RepoPackageDirectoryInfo = {
          packageName,
          version: pkgJson.version || '0.0.0',
          supportsNewArchitecture: supportsNewArch,
          isExpoCompatible: !hasNative || Boolean(pkgJson.expo),
          unmaintained: false,
          category: isRn ? 'community-library' : 'javascript-library',
          githubUrl:
            typeof pkgJson.repository === 'string'
              ? pkgJson.repository
              : pkgJson.repository?.url,
          score: supportsNewArch ? 80 : 60,
        };

        const card = mapDirectoryInfoToCard(info);
        if (!hasNative) {
          card.architecture.has_native_code = false;
          card.compatibility.new_architecture = 'not_applicable';
          card.compatibility.expo_go = true;
          card.compatibility.web = true;
        }
        return card;
      } catch {
        return null;
      }
    }
    const parent = path.dirname(curr);
    if (parent === curr) break;
    curr = parent;
  }
  return null;
}

// Helper to map DB row to canonical VitalityCard structure
function mapRowToCard(row: any): VitalityCardFull {
  const partialCard: Partial<VitalityCardFull> = {
    package_name: row.package_name,
    display_name: row.display_name || row.package_name,
    category: row.category,
    vendor: row.vendor,
    topology_layer: row.topology_layer || 'L3',
    use_case_tags: row.use_case_tags || [],

    // Platform compatibility
    compatibility: {
      ios: row.ios_support ?? false,
      android: row.android_support ?? false,
      web: row.web_support ?? false,
      expo_go: row.expo_go_compatible ?? false,
      windows: row.windows_support ?? false,
      macos: row.macos_support ?? false,
      new_architecture: row.new_architecture_status || 'unknown',
      hermes_v1: row.hermes_v1_compatible ?? null,
      expo_config_plugin: row.expo_config_plugin ?? false,
    },

    // Architecture & metrics
    architecture: {
      has_native_code: row.has_native_code ?? false,
      jsi_binding: row.jsi_binding_type || 'unknown',
      nitro_powered: row.nitro_modules_powered ?? false,
      wasm_compiled: row.wasm_compiled ?? false,
      wasm_size_bytes: row.wasm_size_bytes ?? 0,
      bundle_increment_bytes: row.bundle_increment_bytes ?? 0,
      dependency_fan_out: row.dependency_fan_out ?? 0,
      thread_safety: row.thread_safety || 'unknown',
      build_time_impact: row.build_time_impact || 'unknown',
    },

    // Version details
    version: {
      current: row.current_stable_version || '0.0.0',
      latest: row.latest_version || '0.0.0',
      lag: {
        major: row.version_lag_major ?? 0,
        minor: row.version_lag_minor ?? 0,
        patch: row.version_lag_patch ?? 0,
      },
      safety_band: row.update_safety_band || 'unknown',
      days_since_release: row.days_since_last_release || 30,
      changelog_url: row.changelog_url || undefined,
    },

    // V1 readiness
    v1_readiness: (() => {
      const dbStatus = row.v1_readiness || 'UNKNOWN';
      let status = dbStatus;
      let score = row.v1_readiness_score ?? 0;

      if (dbStatus === 'UNKNOWN') {
        if (row.new_architecture_status === 'native_jsi') {
          status = 'READY';
          score = 90;
        } else if (row.new_architecture_status === 'unsupported') {
          status = 'INCOMPATIBLE';
          score = 10;
        } else if ((row.downloads_weekly_npm ?? 0) > 50000) {
          status = 'READY';
          score = 80;
        } else {
          status = 'ADAPTING';
          score = 50;
        }
      }

      return {
        status: status as any,
        score,
        legacy_arch_code: row.legacy_arch_code_present ?? false,
        stable_js_api_compliant: row.stable_js_api_compliant ?? null,
        breaking_change_risk: row.breaking_change_risk_v1 || 'unknown',
        migration_notes: row.v1_migration_notes || undefined,
        vendor_maintained: row.vendor && row.vendor !== 'independent',
      };
    })(),

    // Deprecation
    deprecation: {
      npm_explicit: row.npm_deprecated ?? false,
      npm_message: row.npm_deprecated_message || undefined,
      api_level: row.has_api_deprecations ?? false,
      ecosystem_level: row.ecosystem_deprecated ?? false,
      platform_level: false,
      silent: (row.days_since_last_release ?? 0) > 180,
    },

    warnings: [],
    alternatives: [],
    known_conflicts: [],
    common_companions: [],
    links: {
      npm: `https://www.npmjs.com/package/${row.package_name}`,
      github: row.github_url || undefined,
      rn_directory: row.last_synced_rn_dir
        ? `https://reactnative.directory/detail/${row.package_name}`
        : undefined,
      changelog: row.changelog_url || undefined,
    },
    recent_events: [],
    last_updated: row.updated_at || new Date().toISOString(),
    data_freshness: 'fresh',
  };

  // Generate score breakdown
  const scoreBreakdown = calculateVitalityScore(partialCard);
  partialCard.vitality_score = scoreBreakdown.total;
  partialCard.score_breakdown = scoreBreakdown;

  // Determine standard warnings based on signals
  const warnings: Warning[] = [];
  if (partialCard.deprecation?.npm_explicit) {
    warnings.push({
      severity: 'critical',
      code: 'NPM_DEPRECATED',
      message: `NPM package is officially deprecated: ${row.npm_deprecated_message || 'Deprecated'}`,
    });
  }
  if (partialCard.deprecation?.silent) {
    warnings.push({
      severity: 'warning',
      code: 'SILENT_DECAY',
      message: 'No releases in over 180 days — potential silent decay',
    });
  }
  if (partialCard.architecture?.thread_safety === 'js_thread_blocks') {
    warnings.push({
      severity: 'warning',
      code: 'JS_THREAD_BLOCKING',
      message: 'Synchronous execution blocks the primary JavaScript thread',
    });
  }
  if (partialCard.compatibility?.new_architecture === 'unsupported') {
    warnings.push({
      severity: 'critical',
      code: 'NEW_ARCH_UNSUPPORTED',
      message: 'Does not support the React Native New Architecture (will fail post-0.84)',
    });
  }
  partialCard.warnings = warnings;

  // Set radar status based on score threshold if not set
  if (row.radar_status === 'ASSESS' || !row.radar_status) {
    if (partialCard.vitality_score >= 80) partialCard.radar_status = 'ADOPT';
    else if (partialCard.vitality_score >= 60) partialCard.radar_status = 'TRIAL';
    else if (partialCard.vitality_score >= 40) partialCard.radar_status = 'ASSESS';
    else partialCard.radar_status = 'HOLD';
  } else {
    partialCard.radar_status = row.radar_status;
  }

  // Capability Card (Layer 3)
  if (row.layer_completeness >= 3) {
    partialCard.capability = {
      package_name: row.package_name,
      primary_purpose: row.primary_purpose || 'N/A',
      key_capabilities: row.key_capabilities || [],
      known_limitations: row.known_limitations || [],
      performance_profile: {
        summary: 'Direct JSI binding performance profile',
        benchmarks: [],
        thread_model: (row.thread_model || 'unknown') as any,
        wasm_thread_model: (row.wasm_thread_model || 'unknown') as any,
        wasm_worklets_required: row.wasm_worklets_required ?? false,
        wasm_worklets_min_version: row.wasm_worklets_min_version || undefined,
      },
      context_requirements: {
        new_arch_required: row.new_architecture_status === 'native_jsi',
        expo_go_compatible: row.expo_go_compatible ?? false,
        expo_managed_compatible: true,
        bare_rn_compatible: true,
        requires_dev_build: !(row.expo_go_compatible ?? false),
        requires_native_build: row.has_native_code ?? false,
      },
      compatibility_matrix: row.compatibility_matrix || {
        animation: [],
        navigation: [],
        state: [],
        storage: [],
        ai_ml: [],
        camera: [],
        testing: [],
        build: [],
      },
      last_verified: row.updated_at,
      confidence: 'medium',
      sources: [row.github_url || 'NPM registry'],
    };
  }

  return partialCard as VitalityCardFull;
}

// Fetch a single package's card across multi-tiered hydration:
// Tier 1: Cloud Supabase (if explicitly configured)
// Tier 2: Sovereign Repo Directory Cache (.agents/state/directory-cache.json)
// Tier 3: Pre-bundled Embedded Catalog Adapter
// Tier 4: Local node_modules inspection
export async function getVitalityCard(
  packageName: string,
  _context?: DeveloperContext,
  projectRoot?: string,
  cachedDirectory?: RepoDirectoryCache | null,
): Promise<VitalityCardFull | null> {
  // Tier 1: Cloud Supabase (only when credentials explicitly configured)
  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('package_name', packageName)
        .single();

      if (!error && data) return mapRowToCard(data);
    } catch {}
  }

  // Tier 2: Sovereign Directory Cache
  const root = projectRoot || process.cwd();
  const cache = cachedDirectory !== undefined ? cachedDirectory : findDirectoryCache(root);
  if (cache && cache.packages && cache.packages[packageName]) {
    return mapDirectoryInfoToCard(cache.packages[packageName]);
  }

  // Tier 3: Pre-bundled Embedded Catalog Adapter
  const embeddedPkg = embeddedCatalog.getPackage(packageName);
  if (embeddedPkg) {
    const versions = embeddedCatalog.getPackageVersions(packageName);
    const latestVer = versions.length > 0 ? versions[versions.length - 1] : null;
    const supportsNewArch = latestVer ? Boolean(latestVer.supports_new_arch) : true;
    return mapDirectoryInfoToCard({
      packageName: embeddedPkg.id,
      version: latestVer?.version || '1.0.0',
      supportsNewArchitecture: supportsNewArch,
      isExpoCompatible: true,
      unmaintained: false,
      category: embeddedPkg.category,
      githubUrl: embeddedPkg.repository_url || undefined,
      score: supportsNewArch ? 90 : 70,
    });
  }

  // Tier 4: Local node_modules inspection
  const localCard = inspectLocalPackage(packageName, root);
  if (localCard) {
    return localCard;
  }

  return null;
}

// Fetch recommended alternatives
export async function getAlternatives(
  packageName: string,
  maxResults: number = 5,
): Promise<VitalityCardFull[]> {
  const sourceCard = await getVitalityCard(packageName);
  if (!sourceCard) return [];

  if (isSupabaseConfigured()) {
    try {
      const { data, error } = await supabase
        .from('packages')
        .select('*')
        .eq('category', sourceCard.category)
        .neq('package_name', packageName)
        .order('vitality_score', { ascending: false })
        .limit(maxResults);

      if (!error && data) return data.map(mapRowToCard);
    } catch {}
  }

  // Fallback to embedded catalog packages with same category
  const embeddedMatches = embeddedCatalog
    .listPackages({ category: sourceCard.category })
    .filter((p) => p.id !== packageName)
    .slice(0, maxResults);

  return embeddedMatches.map((p) => {
    const versions = embeddedCatalog.getPackageVersions(p.id);
    const latestVer = versions.length > 0 ? versions[versions.length - 1] : null;
    return mapDirectoryInfoToCard({
      packageName: p.id,
      version: latestVer?.version || '1.0.0',
      supportsNewArchitecture: latestVer ? Boolean(latestVer.supports_new_arch) : true,
      isExpoCompatible: true,
      unmaintained: false,
      category: p.category,
      score: 85,
    });
  });
}

export function calculateVersionLag(current: string, latest: string) {
  const cleanCurrent = semver.coerce(current);
  const cleanLatest = semver.coerce(latest);

  if (!cleanCurrent || !cleanLatest) {
    return { lag: { major: 0, minor: 0, patch: 0 }, safety_band: 'unknown' as const };
  }

  const major = Math.max(0, cleanLatest.major - cleanCurrent.major);
  const minor = major > 0 ? cleanLatest.minor : Math.max(0, cleanLatest.minor - cleanCurrent.minor);
  const patch =
    major > 0 || minor > 0
      ? cleanLatest.patch
      : Math.max(0, cleanLatest.patch - cleanCurrent.patch);

  let safety_band: 'safe' | 'caution' | 'breaking' | 'unknown' = 'safe';
  if (major > 0) safety_band = 'breaking';
  else if (minor > 0) safety_band = 'caution';

  return { lag: { major, minor, patch }, safety_band };
}

// Scan dependencies in package.json
export async function scanProject(
  packageJsonPath: string,
  options: { offline?: boolean } = {},
): Promise<ProjectAudit> {
  if (options.offline) {
    process.env.RN_TERRAIN_OFFLINE = 'true';
  }
  const resolvedPkgPath = path.resolve(packageJsonPath);
  let pkgJson: any = {};
  try {
    const raw = fs.readFileSync(resolvedPkgPath, 'utf8');
    pkgJson = JSON.parse(raw);
  } catch (_e) {
    throw new Error(`Failed to read package.json at ${packageJsonPath}`);
  }

  const projectRoot = path.dirname(resolvedPkgPath);

  // Auto-sync directory cache if not present for sovereign offline grounding
  let activeCache = findDirectoryCache(projectRoot);
  if (!activeCache) {
    try {
      const syncer = new RepoDirectorySyncer();
      await syncer.syncRepo(projectRoot, { offline: options.offline });
      activeCache = findDirectoryCache(projectRoot);
    } catch {}
  }

  const dependencies = {
    ...pkgJson.dependencies,
    ...pkgJson.devDependencies,
  };

  const packageNames = Object.keys(dependencies);

  const cards: VitalityCardFull[] = (
    await Promise.all(
      packageNames.map(async (name) => {
        const card = await getVitalityCard(name, undefined, projectRoot, activeCache);
        if (!card) return null;

        const localRange = dependencies[name] || '*';
        const latest = card.version.latest || card.version.current;
        const { lag, safety_band } = calculateVersionLag(localRange, latest);

        card.version.current = localRange;
        card.version.lag = lag;
        card.version.safety_band = safety_band;
        return card;
      }),
    )
  ).filter((c): c is VitalityCardFull => c !== null);

  const summary = {
    adopt: cards.filter((c) => c.radar_status === 'ADOPT').length,
    trial: cards.filter((c) => c.radar_status === 'TRIAL').length,
    assess: cards.filter((c) => c.radar_status === 'ASSESS').length,
    hold: cards.filter((c) => c.radar_status === 'HOLD').length,
    unknown: packageNames.length - cards.length,
  };

  return {
    scanned_at: new Date().toISOString(),
    package_json_path: packageJsonPath,
    total_packages: packageNames.length,
    summary,
    v1_ready_count: cards.filter((c) => c.v1_readiness.status === 'READY').length,
    v1_at_risk_count: cards.filter(
      (c) => c.v1_readiness.status === 'AT_RISK' || c.v1_readiness.status === 'INCOMPATIBLE',
    ).length,
    packages: cards,
    critical_warnings: cards.flatMap((c) => c.warnings).filter((w) => w.severity === 'critical'),
    ecosystem_news: [],
    migration_suggestions: [],
  };
}

// Get the macro view of ecosystem topology
export async function getEcosystemTopology(category?: string): Promise<EcosystemTopology> {
  if (!isSupabaseConfigured()) {
    const allEmbedded = embeddedCatalog.listPackages(category ? { category } : undefined);
    const cards = allEmbedded.map((p) => {
      const versions = embeddedCatalog.getPackageVersions(p.id);
      const latestVer = versions.length > 0 ? versions[versions.length - 1] : null;
      return mapDirectoryInfoToCard({
        packageName: p.id,
        version: latestVer?.version || '1.0.0',
        supportsNewArchitecture: latestVer ? Boolean(latestVer.supports_new_arch) : true,
        isExpoCompatible: true,
        unmaintained: false,
        category: p.category,
        score: 85,
      });
    });

    const total = cards.length;
    const getPct = (count: number) => (total > 0 ? Math.round((count / total) * 100) : 0);

    return {
      total_packages_tracked: total,
      by_layer: { L2: 0, L3: total, L4: 0 },
      by_radar: {
        ADOPT: cards.filter((c) => c.radar_status === 'ADOPT').length,
        TRIAL: cards.filter((c) => c.radar_status === 'TRIAL').length,
        ASSESS: cards.filter((c) => c.radar_status === 'ASSESS').length,
        HOLD: cards.filter((c) => c.radar_status === 'HOLD').length,
      },
      new_arch_adoption_pct: getPct(
        cards.filter((c) => c.compatibility.new_architecture === 'native_jsi').length,
      ),
      expo_compatible_pct: getPct(
        cards.filter((c) => c.compatibility.expo_go || c.compatibility.expo_config_plugin).length,
      ),
      hermes_v1_ready_pct: getPct(cards.filter((c) => c.compatibility.hermes_v1 === true).length),
      v1_ready_pct: getPct(cards.filter((c) => c.v1_readiness.status === 'READY').length),
      actively_maintained_pct: getPct(cards.filter((c) => !c.deprecation.silent).length),
      by_category: [],
      ecosystem_health_trend: 'stable',
      last_updated: new Date().toISOString(),
    };
  }
  let query = supabase.from('packages').select('*');
  if (category) {
    query = query.eq('category', category);
  }

  const { data, error } = await query;
  if (error || !data) {
    return {
      total_packages_tracked: 0,
      by_layer: { L2: 0, L3: 0, L4: 0 },
      by_radar: { ADOPT: 0, TRIAL: 0, ASSESS: 0, HOLD: 0 },
      new_arch_adoption_pct: 0,
      expo_compatible_pct: 0,
      hermes_v1_ready_pct: 0,
      v1_ready_pct: 0,
      actively_maintained_pct: 0,
      by_category: [],
      ecosystem_health_trend: 'stable',
      last_updated: new Date().toISOString(),
    };
  }

  const cards = data.map(mapRowToCard);
  const total = cards.length;

  const getPct = (count: number) => (total > 0 ? Math.round((count / total) * 100) : 0);

  return {
    total_packages_tracked: total,
    by_layer: {
      L2: cards.filter((c) => c.topology_layer === 'L2').length,
      L3: cards.filter((c) => c.topology_layer === 'L3').length,
      L4: cards.filter((c) => c.topology_layer === 'L4').length,
    },
    by_radar: {
      ADOPT: cards.filter((c) => c.radar_status === 'ADOPT').length,
      TRIAL: cards.filter((c) => c.radar_status === 'TRIAL').length,
      ASSESS: cards.filter((c) => c.radar_status === 'ASSESS').length,
      HOLD: cards.filter((c) => c.radar_status === 'HOLD').length,
    },
    new_arch_adoption_pct: getPct(
      cards.filter((c) => c.compatibility.new_architecture === 'native_jsi').length,
    ),
    expo_compatible_pct: getPct(
      cards.filter((c) => c.compatibility.expo_go || c.compatibility.expo_config_plugin).length,
    ),
    hermes_v1_ready_pct: getPct(cards.filter((c) => c.compatibility.hermes_v1 === true).length),
    v1_ready_pct: getPct(cards.filter((c) => c.v1_readiness.status === 'READY').length),
    actively_maintained_pct: getPct(cards.filter((c) => !c.deprecation.silent).length),
    by_category: [],
    ecosystem_health_trend: 'stable',
    last_updated: new Date().toISOString(),
  };
}

