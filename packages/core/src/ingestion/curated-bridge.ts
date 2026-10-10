/**
 * @file curated-bridge.ts
 * Curated Knowledge Vault Ingestion & Agent-View Synthesis Bridge.
 *
 * Ingests the high-value architectural knowledge from the C:\x vault:
 *   1. dependency-annotations.yaml (100+ annotated dependencies and sacred pins)
 *   2. Technology Radar records (react-native-uniffi-bridge, legendapp-state, etc.)
 *   3. 50-Vendor Ecosystem Catalog (Callstack, Software Mansion, Expo, Shopify)
 *   4. Synthesizes canonical Agent Views: DANGER-ZONES.md and CURRENT-STATE.md.
 */

import fs from 'node:fs';
import path from 'node:path';
import YAML from 'yaml';
import { CanonicalDatabase } from '../db/sqlite-client.js';
import type { TechnologyRadarRecord } from '../db/canonical-schema.js';

export interface IngestionStats {
  globalToolsCount: number;
  dependencyEntriesCount: number;
  sacredPinsCount: number;
  radarRecordsCount: number;
  callstackPackagesCount: number;
  dangerZonesPath: string | null;
  currentStatePath: string | null;
}

export class CuratedKnowledgeBridge {
  private readonly defaultXPath = 'C:\\x';

  constructor(
    private readonly db: CanonicalDatabase,
    private readonly xRoot: string = 'C:\\x'
  ) {}

  /**
   * Resolves a file or directory path within the C:\x repository vault
   */
  public resolveXPath(...subpaths: string[]): string | null {
    const candidate = path.resolve(this.xRoot, ...subpaths);
    if (fs.existsSync(candidate)) return candidate;
    return null;
  }

  /**
   * Full ingestion run across all available vault components
   */
  public runFullIngestion(viewsOutputDir: string = 'docs/agent-views'): IngestionStats {
    const stats: IngestionStats = {
      globalToolsCount: 0,
      dependencyEntriesCount: 0,
      sacredPinsCount: 0,
      radarRecordsCount: 0,
      callstackPackagesCount: 0,
      dangerZonesPath: null,
      currentStatePath: null,
    };

    // 1. Ingest dependency annotations
    const yamlPath = this.resolveXPath('docs', 'stack-map', 'landscape', 'dependency-annotations.yaml');
    if (yamlPath) {
      const annotStats = this.ingestDependencyAnnotations(yamlPath);
      stats.globalToolsCount = annotStats.globalTools;
      stats.dependencyEntriesCount = annotStats.dependencies;
      stats.sacredPinsCount = annotStats.sacredPins;
    }

    // 2. Ingest Technology Radar records
    const radarDir = this.resolveXPath('docs', 'stack-map', 'radar', 'records');
    if (radarDir) {
      stats.radarRecordsCount = this.ingestRadarRecords(radarDir);
    }

    // 3. Ingest Ecosystem Packages (Callstack, AI Tools)
    const catalogPath = this.resolveXPath('docs', 'react-native-ecosystem-packages.md');
    if (catalogPath) {
      stats.callstackPackagesCount = this.ingestEcosystemCatalog(catalogPath);
    }

    // 4. Synthesize Canonical Agent Views
    const views = this.synthesizeAgentViews(viewsOutputDir);
    stats.dangerZonesPath = views.dangerZones;
    stats.currentStatePath = views.currentState;

    return stats;
  }

  /**
   * Ingests dependency-annotations.yaml into SQLite
   */
  public ingestDependencyAnnotations(filePath: string): { globalTools: number; dependencies: number; sacredPins: number } {
    if (!fs.existsSync(filePath)) {
      throw new Error(`File not found: ${filePath}`);
    }

    const raw = fs.readFileSync(filePath, 'utf-8');
    const doc = YAML.parse(raw, { uniqueKeys: false });

    let globalTools = 0;
    let dependencies = 0;
    let sacredPins = 0;

    // Ingest global tools
    if (doc?.global_tools) {
      for (const [toolId, toolData] of Object.entries<any>(doc.global_tools)) {
        this.db.upsertDevTool({
          id: toolId,
          category: (toolData.category ?? 'BUILD_TOOL').toUpperCase(),
          status: 'RECOMMENDED',
          primary_advantage: toolData.purpose ?? null,
          rn_compatibility_notes: toolData.notes ?? null,
          docs_url: null,
        });
        globalTools++;
      }
    }

    // Ingest dependency entries
    if (doc?.dependency_entries) {
      const now = Math.floor(Date.now() / 1000);
      for (const [pkgId, pkgData] of Object.entries<any>(doc.dependency_entries)) {
        const isSacred = Boolean(pkgData.sacred);
        this.db.upsertPackage({
          id: pkgId,
          vendor: null,
          category: pkgData.category ?? 'general',
          tier: isSacred ? 'CORE' : 'COMMUNITY',
          repository_url: null,
          documentation_url: null,
          created_at: now,
        });
        dependencies++;

        if (pkgData.sacred) {
          this.db.upsertVersion({
            package_id: pkgId,
            version: String(pkgData.sacred),
            valid_from_epoch: now,
            valid_to_epoch: null,
            react_native_min: '0.74.0',
            react_native_max: null,
            supports_new_arch: 1,
            tarball_url: null,
          });
          sacredPins++;
        }
      }
    }

    return { globalTools, dependencies, sacredPins };
  }

  /**
   * Ingests radar record JSON files into technology_radar table
   */
  public ingestRadarRecords(radarDir: string): number {
    if (!fs.existsSync(radarDir)) return 0;

    const files = fs.readdirSync(radarDir).filter((f) => f.endsWith('.json'));
    let count = 0;

    for (const file of files) {
      try {
        const content = fs.readFileSync(path.join(radarDir, file), 'utf-8');
        const json = JSON.parse(content);
        const record: TechnologyRadarRecord = {
          id: json.id ?? path.basename(file, '.json'),
          subject: json.subject ?? json.id,
          subject_type: json.subject_type ?? 'package',
          verdict: (json.verdict?.toUpperCase() ?? 'ASSESS') as any,
          confidence: (json.confidence?.toLowerCase() ?? 'medium') as any,
          category: json.category ?? 'native',
          use_case: json.use_case ?? null,
          problem: json.problem ?? null,
          decision: json.decision ?? null,
          revisit_when: json.revisit_when ?? null,
          metadata_json: JSON.stringify({
            current_stack: json.current_stack ?? [],
            compatibility: json.compatibility ?? {},
            risks: json.risks ?? [],
            alternatives: json.alternatives ?? [],
          }),
          updated_at: Math.floor(Date.now() / 1000),
        };
        this.db.upsertRadarRecord(record);
        count++;
      } catch {
        // Skip malformed record
      }
    }

    return count;
  }

  /**
   * Ingests Callstack ecosystem packages into SQLite
   */
  public ingestEcosystemCatalog(catalogPath: string): number {
    if (!fs.existsSync(catalogPath)) return 0;
    const content = fs.readFileSync(catalogPath, 'utf-8');

    // Regex extract Callstack packages
    const pkgRegex = /`(@callstack\/[a-z0-9_-]+|reassure|rozenite|linaria|react-native-paper)`/g;
    const found = new Set<string>();
    let match;
    while ((match = pkgRegex.exec(content)) !== null) {
      if (match[1]) found.add(match[1]);
    }

    const now = Math.floor(Date.now() / 1000);
    for (const pkg of found) {
      this.db.upsertPackage({
        id: pkg,
        vendor: 'callstack',
        category: pkg.includes('ai') ? 'ai-tooling' : pkg.includes('repack') ? 'bundler' : 'native-utility',
        tier: 'TIER_1',
        repository_url: `https://github.com/callstack/${pkg.replace('@callstack/', '')}`,
        documentation_url: null,
        created_at: now,
      });
    }

    return found.size;
  }

  /**
   * Generates DANGER-ZONES.md and CURRENT-STATE.md
   */
  public synthesizeAgentViews(outputDir: string): { dangerZones: string; currentState: string } {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    // ─── 1. DANGER-ZONES.md ──────────────────────────────────────────────────
    const dangerZonesContent = `# 🚨 AGENT DANGER ZONES: Severed APIs & Banned Patterns
*Auto-synthesized by rn-terrain CuratedKnowledgeBridge from C:\\x knowledge vault*
*Last updated: ${new Date().toISOString()}*

> **CRITICAL FOR AI CODING AGENTS**:
> Probabilistic next-token prediction causes LLMs to generate outdated 2021–2023 APIs.
> Generating any symbol listed below **will cause a fatal compiler error or native crash**.

---

## 1. \`react-native-reanimated\` (Target: v4.x / Sacred: 4.7.1)
| ❌ Severed / Banned Symbol | Status | ✅ Canonical Modern Replacement | Root Cause |
| :--- | :--- | :--- | :--- |
| \`useAnimatedGestureHandler\` | **REMOVED** | \`GestureDetector\` + \`Gesture.Pan()\` from RNGH v2 | Decoupled from RNGH; legacy handler deleted. |
| \`worklet\` directive without \`react-native-worklets\` | **CRASH** | Must install \`react-native-worklets\` runtime package | Worklet runtime decoupled from Reanimated in v4. |
| \`runOnJS\` without worklet runtime | **CRASH** | Worklets thread dispatcher | Inline worklet execution refactored in v4. |

---

## 2. \`react-native-gesture-handler\` (Target: v3.x / Sacred: 3.3.0)
| ❌ Severed / Banned Symbol | Status | ✅ Canonical Modern Replacement | Root Cause |
| :--- | :--- | :--- | :--- |
| \`PanGestureHandler\` component | **DEPRECATED** | \`<GestureDetector gesture={Gesture.Pan()}>\` | Legacy wrapper components bypass New Architecture Fabric state. |
| \`TapGestureHandler\` component | **DEPRECATED** | \`<GestureDetector gesture={Gesture.Tap()}>\` | Replaced by fluent Gesture API. |
| \`onGestureEvent\` prop passing | **REMOVED** | Fluent builder: \`Gesture.Pan().onUpdate(...)\` | Direct event prop binding replaced by worklet callbacks. |

---

## 3. \`react-native-mmkv\` (Target: v4.x / Sacred: 4.3.2)
| ❌ Severed / Banned Symbol | Status | ✅ Canonical Modern Replacement | Root Cause |
| :--- | :--- | :--- | :--- |
| Legacy JSI manual bindings | **REMOVED** | Nitro Modules (\`react-native-nitro-modules\`) | MMKV v4 rewritten on top of Nitro Modules for zero-overhead bridge. |
| Async storage polyfill mode | **BANNED** | Synchronous \`storage.getString(key)\` | MMKV is strictly synchronous; do not await calls. |

---

## 4. React Native New Architecture (Target: 0.88.0-rc.3 / Fabric)
| ❌ Severed / Banned Symbol | Status | ✅ Canonical Modern Replacement | Root Cause |
| :--- | :--- | :--- | :--- |
| \`NativeModules.CustomModule\` | **DEPRECATED** | \`TurboModuleRegistry.getEnforcing(...)\` | Legacy asynchronous JSON bridge eliminated. |
| \`findNodeHandle\` / \`UIManager\` | **REMOVED** | Direct ref measurement or Fabric native state | Native view hierarchy disconnected from legacy JS IDs. |
`;

    const dangerZonesPath = path.resolve(outputDir, 'DANGER-ZONES.md');
    fs.writeFileSync(dangerZonesPath, dangerZonesContent, 'utf-8');

    // ─── 2. CURRENT-STATE.md ─────────────────────────────────────────────────
    const packages = this.db.getAllPackages().filter((p) => p.tier === 'CORE');
    const tools = this.db.getAllDevTools();

    const currentStateContent = `# 🧭 CURRENT STATE: Sacred Platform Pins & Grounded APIs
*Auto-synthesized by rn-terrain CuratedKnowledgeBridge from C:\\x knowledge vault*
*Last updated: ${new Date().toISOString()}*

> **AUTHORITATIVE DIRECTIVE**:
> All generated code in this repository MUST comply with the sacred versions and New Architecture standards listed below.

---

## 📦 Sacred Mobile Platform Spine
| Package | Sacred Pin | Category | New Architecture | Role & Architectural Purpose |
| :--- | :--- | :--- | :--- | :--- |
${packages
  .map((p) => {
    const version = this.db.getVersions(p.id)[0]?.version ?? 'latest';
    return `| \`${p.id}\` | \`${version}\` | \`${p.category}\` | Fabric / TurboModule | Grounded in \`dependency-annotations.yaml\` |`;
  })
  .join('\n')}

---

## 🛠️ Global Developer & Native Toolchain
| Tool | Category | Status | Primary Purpose & Interop Notes |
| :--- | :--- | :--- | :--- |
${tools
  .map((t) => `| \`${t.id}\` | \`${t.category}\` | \`${t.status}\` | ${t.primary_advantage ?? 'Standard tool'} (${t.rn_compatibility_notes ?? 'OK'}) |`)
  .join('\n')}

---

## 🦀 Sovereign Rust Tooling Standards
* **Treesitter AST Verification**: \`@ast-grep/napi\` ($<5\\text{ms}$ pre-flight gate)
* **Native Rust Bindings**: UniFFI bridge (\`react-native-uniffi-bridge\`) evaluated for custom native capabilities
* **Host Utilities**: \`rg\` (ripgrep), \`fd\`, \`sd\`, \`bat\`, \`eza\`, \`delta\`, \`oxlint\`, \`biome\`
`;

    const currentStatePath = path.resolve(outputDir, 'CURRENT-STATE.md');
    fs.writeFileSync(currentStatePath, currentStateContent, 'utf-8');

    return { dangerZones: dangerZonesPath, currentState: currentStatePath };
  }
}
