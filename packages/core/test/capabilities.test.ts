import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { CanonicalDatabase } from '../src/db/sqlite-client.js';
import { CapabilityResolver } from '../src/capabilities/capability-resolver.js';
import { RustToolingDoctor } from '../src/capabilities/doctor.js';
import fs from 'node:fs';
import path from 'node:path';

describe('Granular Capabilities Engine & Rust Tooling Doctor', () => {
  const testDbPath = path.resolve(__dirname, 'capabilities-test.db');
  let db: CanonicalDatabase;

  beforeEach(() => {
    if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
    db = new CanonicalDatabase(testDbPath);
  });

  afterEach(() => {
    db.close();
    if (fs.existsSync(testDbPath)) fs.unlinkSync(testDbPath);
  });

  it('seeds canonical capabilities and resolves gesture.pan_recognition', () => {
    const resolver = new CapabilityResolver(db);
    const res = resolver.resolveCapability('gesture.pan_recognition');

    expect(res).toBeDefined();
    expect(res?.capabilityId).toBe('gesture.pan_recognition');
    expect(res?.category).toBe('GESTURE');
    expect(res?.fabricNativeRequired).toBe(true);
    expect(res?.recommendedPackage?.packageId).toBe('react-native-gesture-handler');
    expect(res?.recommendedPackage?.versionIntroduced).toBe('2.0.0');
    expect(res?.recommendedPackage?.performanceProfile).toBe('UI_THREAD_NATIVE');
  });

  it('inspects capabilities unlocked by pnpm 12.11.0', () => {
    const resolver = new CapabilityResolver(db);
    const manifest = resolver.inspectPackageCapabilities('pnpm', '12.11.0');

    expect(manifest.packageId).toBe('pnpm');
    expect(manifest.capabilitiesCount).toBeGreaterThanOrEqual(4);

    const rustWorkspaceCap = manifest.capabilities.find((c) => c.id === 'monorepo.polyglot_rust_workspace');
    expect(rustWorkspaceCap).toBeDefined();
    expect(rustWorkspaceCap?.isNewInThisVersion).toBe(true);

    const skillsCap = manifest.capabilities.find((c) => c.id === 'agent.skills_protocol');
    expect(skillsCap).toBeDefined();
    expect(skillsCap?.isNewInThisVersion).toBe(true);
  });

  it('runs RustToolingDoctor and identifies active shiny tools and nudges', () => {
    const doctor = new RustToolingDoctor();
    const report = doctor.runDiagnostic();

    expect(report.totalTools).toBeGreaterThanOrEqual(7);
    expect(report.installedCount).toBeGreaterThanOrEqual(0);

    const rgCheck = report.tools.find((t) => t.id === 'rg');
    expect(rgCheck).toBeDefined();
    expect(typeof rgCheck?.installed).toBe('boolean');
  });
});
