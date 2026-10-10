/**
 * @file config-loader.ts
 * Project Dialect & Local Shape Configuration Loader.
 *
 * Discovers and loads .terrainrc, terrain.config.json, or package.json#terrain
 * to allow teams to define their local constraints, stack presets,
 * in-house package pins, aliases, and rule severity overrides.
 */

import fs from 'node:fs';
import path from 'node:path';

export type RuleSeverity = 'error' | 'warn' | 'off';

export interface LocalPinDefinition {
  recommendedRange: string;
  reason: string;
  severity?: 'error' | 'warn' | 'info';
}

export interface TerrainProjectConfig {
  /**
   * Archetype preset:
   * - 'standard': Default bare React Native profile with strict New Architecture checks.
   * - 'expo': Expo managed profile; delegates native modules to Expo SDK lockstep.
   * - 'enterprise': Zero-tolerance mode; floating native ranges and peer drift fail as errors.
   * - 'loose': Permissive advisory mode.
   */
  preset?: 'standard' | 'expo' | 'enterprise' | 'loose';

  /**
   * Whether floating ranges (^ or ~) on compiled native binaries are flagged.
   * Default: true
   */
  strictNativeFloating?: boolean;

  /**
   * Whether New Architecture compatibility is strictly enforced on RN >= 0.76.
   * Default: true
   */
  enforceNewArch?: boolean;

  /**
   * Fine-grained rule severity overrides.
   */
  rules?: {
    disallowFloatingNativeRanges?: RuleSeverity;
    enforcePeerMatrixAlignment?: RuleSeverity;
    enforceNewArchitectureCompatibility?: RuleSeverity;
    sacredPins?: RuleSeverity;
  };

  /**
   * Package alias mapping.
   * Maps forks or private wrappers to their canonical upstream library.
   * Example: { "@myorg/reanimated": "react-native-reanimated" }
   */
  aliases?: Record<string, string>;

  /**
   * Custom organization pins and range requirements.
   */
  localPins?: Record<string, LocalPinDefinition>;

  /**
   * List of packages to exclude from diagnostic audits.
   */
  ignore?: string[];
}

export const PRESET_CONFIGS: Record<NonNullable<TerrainProjectConfig['preset']>, Partial<TerrainProjectConfig>> = {
  standard: {
    strictNativeFloating: true,
    enforceNewArch: true,
    rules: {
      disallowFloatingNativeRanges: 'warn',
      enforcePeerMatrixAlignment: 'error',
      enforceNewArchitectureCompatibility: 'warn',
      sacredPins: 'warn',
    },
  },
  expo: {
    strictNativeFloating: false,
    enforceNewArch: true,
    rules: {
      disallowFloatingNativeRanges: 'off',
      enforcePeerMatrixAlignment: 'warn',
      enforceNewArchitectureCompatibility: 'warn',
      sacredPins: 'warn',
    },
  },
  enterprise: {
    strictNativeFloating: true,
    enforceNewArch: true,
    rules: {
      disallowFloatingNativeRanges: 'error',
      enforcePeerMatrixAlignment: 'error',
      enforceNewArchitectureCompatibility: 'error',
      sacredPins: 'error',
    },
  },
  loose: {
    strictNativeFloating: false,
    enforceNewArch: false,
    rules: {
      disallowFloatingNativeRanges: 'off',
      enforcePeerMatrixAlignment: 'warn',
      enforceNewArchitectureCompatibility: 'off',
      sacredPins: 'warn',
    },
  },
};

/**
 * Strips comments from JSONC text for safe parsing.
 */
function stripJsonComments(jsonc: string): string {
  return jsonc
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/\/\/.*$/gm, '');
}

/**
 * Searches for a configuration file starting from startDir and walking upwards.
 */
export function findTerrainConfigFile(startDir: string = process.cwd()): string | null {
  const candidateNames = [
    'terrain.config.json',
    '.terrainrc.json',
    '.terrainrc',
  ];

  let current = path.resolve(startDir);
  const root = path.parse(current).root;

  while (current !== root) {
    for (const name of candidateNames) {
      const candidatePath = path.join(current, name);
      if (fs.existsSync(candidatePath) && fs.statSync(candidatePath).isFile()) {
        return candidatePath;
      }
    }

    // Check package.json#terrain
    const pkgPath = path.join(current, 'package.json');
    if (fs.existsSync(pkgPath) && fs.statSync(pkgPath).isFile()) {
      try {
        const raw = fs.readFileSync(pkgPath, 'utf8');
        const parsed = JSON.parse(raw);
        if (parsed.terrain) {
          return pkgPath;
        }
      } catch {
        // continue search
      }
    }

    const parent = path.dirname(current);
    if (parent === current) break;
    current = parent;
  }

  return null;
}

/**
 * Loads and parses a Terrain project configuration file.
 */
export function loadTerrainConfig(startDirOrFile: string = process.cwd()): TerrainProjectConfig {
  let configPath: string | null = null;

  if (fs.existsSync(startDirOrFile) && fs.statSync(startDirOrFile).isFile()) {
    configPath = startDirOrFile;
  } else {
    configPath = findTerrainConfigFile(startDirOrFile);
  }

  let userConfig: TerrainProjectConfig = {};

  if (configPath && fs.existsSync(configPath)) {
    try {
      const raw = fs.readFileSync(configPath, 'utf8');
      if (configPath.endsWith('package.json')) {
        const parsed = JSON.parse(raw);
        userConfig = parsed.terrain || {};
      } else {
        const cleaned = stripJsonComments(raw);
        userConfig = JSON.parse(cleaned);
      }
    } catch {
      userConfig = {};
    }
  }

  const presetName = userConfig.preset || 'standard';
  const basePreset = PRESET_CONFIGS[presetName] || PRESET_CONFIGS.standard;

  return {
    preset: presetName,
    strictNativeFloating: userConfig.strictNativeFloating ?? basePreset.strictNativeFloating ?? true,
    enforceNewArch: userConfig.enforceNewArch ?? basePreset.enforceNewArch ?? true,
    rules: {
      ...basePreset.rules,
      ...(userConfig.rules || {}),
    },
    aliases: userConfig.aliases || {},
    localPins: userConfig.localPins || {},
    ignore: userConfig.ignore || [],
  };
}
