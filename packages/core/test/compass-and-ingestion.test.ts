import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CanonicalDatabase } from '../src/db/sqlite-client.js';
import { generateAgentCompass } from '../src/compass/agent-compass.js';
import { HexagonalIngestionPipeline } from '../src/ingestion/pipeline.js';
import { DatabaseSinkAdapter } from '../src/ingestion/adapters.js';
import type {
  IRnDirectoryPort,
  IGitHubPort,
  INpmRegistryPort,
  IBundlephobiaPort
} from '../src/ingestion/ports.js';
import fs from 'node:fs';
import path from 'node:path';

describe('Pre-Flight Agent Compass & Hexagonal Ingestion Pipeline', () => {
  const testDbPath = path.resolve(__dirname, 'compass-test.db');
  let db: CanonicalDatabase;

  beforeEach(() => {
    if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
    db = new CanonicalDatabase(testDbPath);
  });

  afterEach(() => {
    db.close();
    if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
  });

  it('generates grounded PreFlightManifest with whitelisted and forbidden APIs', () => {
    db.upsertPackage({
      id: 'react-native-reanimated',
      vendor: 'software-mansion',
      category: 'animation-engine',
      tier: 'TIER_1',
      repository_url: 'https://github.com/software-mansion/react-native-reanimated',
      documentation_url: 'https://docs.swmansion.com',
      created_at: 1714521600
    });

    db.upsertVersion({
      package_id: 'react-native-reanimated',
      version: '3.10.0',
      valid_from_epoch: 1714521600,
      valid_to_epoch: null,
      react_native_min: '0.74.0',
      react_native_max: null,
      supports_new_arch: 1,
      tarball_url: null
    });

    db.upsertSymbol({
      package_id: 'react-native-reanimated',
      version: '3.10.0',
      symbol_identifier: 'useAnimatedGestureHandler',
      symbol_type: 'HOOK',
      status: 'UNSUPPORTED_REMOVED',
      replacement_symbol: 'Gesture.Pan().onUpdate()',
      replacement_package: 'react-native-gesture-handler',
      codemod_available: 1,
      codemod_rule_id: 'reanimated-v2-to-v3',
      documentation_anchor: '#useAnimatedGestureHandler',
      valid_from_epoch: 1714521600,
      valid_to_epoch: null
    });

    db.upsertSymbol({
      package_id: 'react-native-reanimated',
      version: '3.10.0',
      symbol_identifier: 'useAnimatedStyle',
      symbol_type: 'HOOK',
      status: 'FUNCTIONAL_STABLE',
      replacement_symbol: null,
      replacement_package: null,
      codemod_available: 0,
      codemod_rule_id: null,
      documentation_anchor: '#useAnimatedStyle',
      valid_from_epoch: 1714521600,
      valid_to_epoch: null
    });

    const manifest = generateAgentCompass('react-native-reanimated', '3.10.0', db);

    expect(manifest.package).toBe('react-native-reanimated');
    expect(manifest.version).toBe('3.10.0');
    expect(manifest.architecture).toBe('NEW_ARCHITECTURE_FABRIC_READY');
    expect(manifest.bannedSeveredSymbols).toHaveLength(1);
    expect(manifest.bannedSeveredSymbols[0]?.identifier).toBe('useAnimatedGestureHandler');
    expect(manifest.bannedSeveredSymbols[0]?.replacement).toBe('Gesture.Pan().onUpdate()');
    expect(manifest.allowedModernSymbols).toContain('useAnimatedStyle');
    expect(manifest.preflightInstruction).toContain('FORBIDDEN: \'useAnimatedGestureHandler\'');
  });

  it('runs hexagonal ingestion pipeline with mocked source ports into database sink', async () => {
    const mockRnDirectory: IRnDirectoryPort = {
      fetchDirectoryCatalog: async () => [
        {
          name: 'mock-pkg',
          npmPkg: 'mock-pkg',
          githubUrl: 'https://github.com/mock/mock-pkg',
          supportsNewArchitecture: true,
          isExpoCompatible: true,
          category: 'mock-category'
        }
      ]
    };

    const mockGitHub: IGitHubPort = {
      fetchRepoTelemetry: async (_owner, _repo) => ({
        owner: 'mock',
        repo: 'mock-pkg',
        stargazersCount: 1200,
        openIssuesCount: 12,
        closedIssuesCount: 340,
        lastCommitEpoch: 1727784000,
        releasesCount: 15
      })
    };

    const mockNpm: INpmRegistryPort = {
      fetchMetadata: async (pkg) => ({
        name: pkg,
        latestVersion: '2.0.0',
        versions: ['1.0.0', '1.1.0', '2.0.0'],
        releaseEpochs: {
          '1.0.0': 1700000000,
          '1.1.0': 1710000000,
          '2.0.0': 1720000000
        },
        peerDependencies: { 'react-native': '>=0.74.0' },
        tarballUrl: 'https://registry.npmjs.org/mock-pkg/-/mock-pkg-2.0.0.tgz'
      })
    };

    const mockBundlephobia: IBundlephobiaPort = {
      fetchSize: async (pkg, version) => ({
        packageName: pkg,
        version,
        rawSize: 102400,
        gzipSize: 25600,
        dependencyCount: 3,
        hasSideEffects: false
      })
    };

    const sink = new DatabaseSinkAdapter(db);
    const pipeline = new HexagonalIngestionPipeline(
      mockRnDirectory,
      mockGitHub,
      mockNpm,
      mockBundlephobia,
      sink
    );

    const result = await pipeline.ingestPackage('mock-pkg', db);

    expect(result.packageName).toBe('mock-pkg');
    expect(result.latestVersion).toBe('2.0.0');
    expect(result.supportsNewArchitecture).toBe(true);
    expect(result.bundleGzipBytes).toBe(25600);
    expect(result.githubStars).toBe(1200);

    // Verify written to database sink
    const versions = db.getVersions('mock-pkg');
    expect(versions).toHaveLength(1);
    expect(versions[0]?.version).toBe('2.0.0');
    expect(versions[0]?.supports_new_arch).toBe(1);
  });

  it('falls back to physical node_modules affordances for unseeded packages', () => {
    // 'yaml' is an unseeded package installed physically in core dependencies
    const manifest = generateAgentCompass('yaml', 'latest', db);

    expect(manifest.package).toBe('yaml');
    expect(manifest.version).not.toBe('unknown');
    expect(manifest.allowedModernSymbols.length).toBeGreaterThan(0);
    expect(manifest.preflightInstruction).toContain('CANONICAL MODERN APIS:');
  });

  it('returns clean unknown briefing for unseeded and non-installed packages without crashing', () => {
    const manifest = generateAgentCompass('non-existent-package-xyz', '1.0.0', db);

    expect(manifest.package).toBe('non-existent-package-xyz');
    expect(manifest.architecture).toBe('UNKNOWN');
    expect(manifest.bannedSeveredSymbols).toHaveLength(0);
    expect(manifest.allowedModernSymbols).toHaveLength(0);
  });
});
