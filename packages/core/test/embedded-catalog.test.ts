import { describe, it, expect } from 'vitest';
import { EmbeddedCatalogAdapter } from '../src/db/embedded-catalog.js';

describe('EmbeddedCatalogAdapter (Hexagonal In-Memory Port)', () => {
  it('instantiates cleanly with zero native C++ or SQLite dependencies', () => {
    const catalog = new EmbeddedCatalogAdapter();
    expect(catalog).toBeDefined();

    const packages = catalog.listPackages();
    expect(packages.length).toBeGreaterThanOrEqual(5);

    const reanimated = catalog.getPackage('react-native-reanimated');
    expect(reanimated).toBeDefined();
    expect(reanimated?.vendor).toBe('software-mansion');
  });

  it('resolves severed API symbols in modern React Native New Architecture', () => {
    const catalog = new EmbeddedCatalogAdapter();
    const severed = catalog.getSeveredSymbols('react-native');
    expect(severed.length).toBeGreaterThan(0);

    const findNodeHandle = severed.find((s) => s.symbol_identifier === 'findNodeHandle');
    expect(findNodeHandle).toBeDefined();
    expect(findNodeHandle?.status).toBe('UNSUPPORTED_REMOVED');
    expect(findNodeHandle?.replacement_package).toBe('react-native-reanimated');
  });

  it('resolves technology radar records and dev tools instantly', () => {
    const catalog = new EmbeddedCatalogAdapter();
    const radar = catalog.getRadarRecords();
    expect(radar.length).toBeGreaterThanOrEqual(2);

    const uniffi = catalog.getRadarRecord('react-native-uniffi-bridge');
    expect(uniffi).toBeDefined();
    expect(uniffi?.verdict).toBe('ADOPT');

    const devTools = catalog.listDevTools();
    expect(devTools.some((t) => t.id === 'pnpm')).toBe(true);
  });
});
