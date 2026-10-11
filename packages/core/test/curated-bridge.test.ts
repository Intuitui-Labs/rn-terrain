import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CanonicalDatabase } from '../src/db/sqlite-client.js';
import { CuratedKnowledgeBridge } from '../src/ingestion/curated-bridge.js';
import fs from 'node:fs';
import path from 'node:path';

describe('CuratedKnowledgeBridge', () => {
  const testDbPath = path.resolve(__dirname, 'curated-test.db');
  const tempTestDir = path.resolve(__dirname, 'temp-curated-vault');
  let db: CanonicalDatabase;

  beforeEach(() => {
    if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
    if (fs.existsSync(tempTestDir)) fs.rmSync(tempTestDir, { recursive: true, force: true });

    db = new CanonicalDatabase(testDbPath);
    fs.mkdirSync(tempTestDir, { recursive: true });
  });

  afterEach(() => {
    db.close();
    if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
    if (fs.existsSync(tempTestDir)) fs.rmSync(tempTestDir, { recursive: true, force: true });
  });

  it('ingests mock dependency-annotations.yaml with sacred pins and global tools', () => {
    const mockYamlPath = path.join(tempTestDir, 'dependency-annotations.yaml');
    const mockYaml = `
metadata:
  updated: 2026-10-05

global_tools:
  pnpm:
    category: runtime
    purpose: "Workspace package manager (v12)"
    notes: "mise-managed"
  dagger:
    category: ci
    purpose: "CI/CD pipelines"

dependency_entries:
  react:
    category: native
    purpose: "UI runtime"
    sacred: "19.3.0"
  react-native-reanimated:
    category: animation
    purpose: "Animation engine"
    sacred: "4.7.1"
  react-native-worklets:
    category: animation
    purpose: "Worklets thread runtime"
    sacred: "0.13.0"
`;
    fs.writeFileSync(mockYamlPath, mockYaml);

    const bridge = new CuratedKnowledgeBridge(db, tempTestDir);
    const stats = bridge.ingestDependencyAnnotations(mockYamlPath);

    expect(stats.globalTools).toBe(2);
    expect(stats.dependencies).toBe(3);
    expect(stats.sacredPins).toBe(3);

    const pnpmTool = db.getDevTool('pnpm');
    expect(pnpmTool?.category).toBe('RUNTIME');
    expect(pnpmTool?.primary_advantage).toBe('Workspace package manager (v12)');

    const reanimated = db.getPackage('react-native-reanimated');
    expect(reanimated?.tier).toBe('CORE');
    const versions = db.getVersions('react-native-reanimated');
    expect(versions[0]?.version).toBe('4.7.1');
  });

  it('ingests mock technology radar records and synthesizes agent views', () => {
    const radarDir = path.join(tempTestDir, 'radar');
    fs.mkdirSync(radarDir, { recursive: true });

    const mockRadarJson = {
      id: 'react-native-uniffi-bridge',
      subject: 'React Native UniFFI bridge',
      verdict: 'ASSESS',
      confidence: 'medium',
      category: 'native',
      use_case: 'Expose Rust to RN',
      problem: 'Evaluate Rust native bridge',
    };
    fs.writeFileSync(path.join(radarDir, 'react-native-uniffi-bridge.json'), JSON.stringify(mockRadarJson));

    const bridge = new CuratedKnowledgeBridge(db, tempTestDir);
    const count = bridge.ingestRadarRecords(radarDir);
    expect(count).toBe(1);

    const records = db.getAllRadarRecords();
    expect(records.length).toBe(1);
    expect(records[0]?.id).toBe('react-native-uniffi-bridge');
    expect(records[0]?.verdict).toBe('ASSESS');

    const viewsDir = path.join(tempTestDir, 'views');
    const views = bridge.synthesizeAgentViews(viewsDir);

    expect(fs.existsSync(views.dangerZones)).toBe(true);
    expect(fs.existsSync(views.currentState)).toBe(true);

    const dzContent = fs.readFileSync(views.dangerZones, 'utf-8');
    expect(dzContent).toContain('useAnimatedGestureHandler');
    expect(dzContent).toContain('react-native-worklets');

    const csContent = fs.readFileSync(views.currentState, 'utf-8');
    expect(csContent).toContain('Sacred Mobile Platform Spine');
  });

  it('connects to external knowledge vault when available', () => {
    const vaultDir = process.env.TERRAIN_VAULT_PATH || 'docs/vault';
    if (fs.existsSync(path.join(vaultDir, 'docs/stack-map/landscape/dependency-annotations.yaml'))) {
      const bridge = new CuratedKnowledgeBridge(db, vaultDir);
      const stats = bridge.runFullIngestion(path.join(tempTestDir, 'live-views'));

      expect(stats.globalToolsCount).toBeGreaterThan(0);
      expect(stats.dependencyEntriesCount).toBeGreaterThan(10);
      expect(stats.sacredPinsCount).toBeGreaterThan(5);
      expect(stats.radarRecordsCount).toBeGreaterThan(0);
      expect(fs.existsSync(stats.dangerZonesPath!)).toBe(true);
      expect(fs.existsSync(stats.currentStatePath!)).toBe(true);
    }
  });
});
