import fs from 'node:fs';
import path from 'node:path';
import type { CAC } from 'cac';
import chalk from 'chalk';
import { consola } from 'consola';
import {
  RepoDirectorySyncer,
  HexagonalIngestionPipeline,
  CanonicalDatabase,
  ArchiveDatasetSeeder,
  CuratedKnowledgeBridge,
} from '@intuitui-labs/rn-terrain-core';

export function registerSyncCommands(cli: CAC) {
  cli
    .command('sync:directory', 'Sync React Native Directory metadata strictly for repo dependencies')
    .alias('sync')
    .option('--cwd <dir>', 'Target repository root', { default: '.' })
    .option('--offline', 'Operate strictly offline using local discovery and embedded catalog')
    .option('--json', 'Output results as JSON')
    .action(async (options) => {
      try {
        const targetDir = path.resolve(process.cwd(), options.cwd);
        consola.info(`Discovering repository React Native dependencies at: ${chalk.cyan(targetDir)}${options.offline ? ' (offline mode)' : ''}`);

        const syncer = new RepoDirectorySyncer();
        const records = await syncer.syncRepo(targetDir, { offline: options.offline });

        if (options.json) {
          console.log(JSON.stringify(records, null, 2));
          return;
        }

        console.log(`\n${chalk.bold('REACT NATIVE DIRECTORY REPO-SCOPED COMPATIBILITY')}`);
        console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));
        console.log(
          `${chalk.bold('Package'.padEnd(36))} ${chalk.bold('Version'.padEnd(12))} ${chalk.bold('New Arch'.padEnd(14))} ${chalk.bold('Status')}`
        );
        console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));

        for (const r of records) {
          const archStr = r.supportsNewArchitecture ? chalk.green('✓ Fabric') : chalk.yellow('⚠ Interop');
          const statusStr = r.unmaintained ? chalk.red('🛑 UNMAINTAINED') : chalk.green('✓ Active');
          console.log(`${r.packageName.padEnd(36)} ${r.version.padEnd(12)} ${archStr.padEnd(22)} ${statusStr}`);
        }
        console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));
        consola.success(`Synced ${records.length} repo package(s) to .agents/state/directory-cache.json\n`);
      } catch (e: any) {
        consola.error('Failed to sync React Native Directory:', e.message);
      }
    });

  cli
    .command('sync <package>', 'Run Hexagonal Ingestion Pipeline across RN Directory, GitHub, npm, and Bundlephobia')
    .action(async (packageName) => {
      try {
        consola.info(`Triggering Hexagonal Ingestion Pipeline for: ${chalk.cyan(packageName)}`);
        const pipeline = new HexagonalIngestionPipeline();
        const res = await pipeline.ingestPackage(packageName);

        console.log(`\n${chalk.bold('HEXAGONAL INGESTION RESULT')}`);
        console.log(chalk.dim('────────────────────────────────────────'));
        console.log(`  Package:          ${chalk.green(res.packageName)}`);
        console.log(`  Latest Version:   ${chalk.green(res.latestVersion)}`);
        console.log(`  Versions Tracked: ${res.versionsIngested}`);
        console.log(`  New Arch Ready:   ${res.supportsNewArchitecture ? chalk.green('Yes') : chalk.yellow('No')}`);
        console.log(`  Bundle Gzip Size: ${(res.bundleGzipBytes / 1024).toFixed(1)} kB`);
        console.log(`  GitHub Stars:     ${res.githubStars.toLocaleString()}`);
        console.log('');
        consola.success(`Successfully ingested and synchronized ${packageName} into canonical SQLite DB.`);
      } catch (e: any) {
        consola.error('Failed hexagonal ingestion:', e.message);
      }
    });

  cli
    .command('seed:archive [peersDir]', 'Bulk ingest historical peer dependency datasets from archive')
    .action((peersDir = process.env.RN_TERRAIN_PEERS_DIR || 'compat/peers') => {
      try {
        if (!fs.existsSync(peersDir)) {
          consola.warn(`Archive peer directory not found at: ${chalk.yellow(peersDir)}`);
          consola.info('Specify a valid directory: rn-terrain seed:archive <path-to-peers-dir>');
          return;
        }
        consola.info(`Ingesting historical peer datasets from: ${chalk.cyan(peersDir)}`);
        const db = new CanonicalDatabase();
        const seeder = new ArchiveDatasetSeeder(db);
        const res = seeder.seedFromDirectory(peersDir);

        console.log(`\n${chalk.bold('ARCHIVE DATASET INGESTION SUMMARY')}`);
        console.log(chalk.dim('────────────────────────────────────────'));
        console.log(`  Packages Seeded:        ${chalk.green(res.packagesSeeded)}`);
        console.log(`  Total Versions Tracked: ${chalk.green(res.totalVersionsIngested)}`);
        console.log('');
        for (const d of res.details) {
          console.log(`    • ${chalk.bold(d.packageName.padEnd(30))} : ${chalk.cyan(d.versionsCount)} versions`);
        }
        console.log('');
        consola.success('Historical archive datasets ingested successfully into canonical SQLite DB.');
      } catch (e: any) {
        consola.error('Failed to seed archive dataset:', e.message);
      }
    });

  cli
    .command('seed:curated [vaultDir]', 'Ingest curated annotations, technology radar, and ecosystem catalog from local knowledge directory')
    .option('--views-out <dir>', 'Output directory for synthesized agent views', { default: 'docs/agent-views' })
    .action((vaultDir = process.env.TERRAIN_VAULT_PATH || 'docs/vault', options: { viewsOut: string }) => {
      try {
        consola.info(`Ingesting curated architectural knowledge from directory: ${chalk.cyan(vaultDir)}`);
        const db = new CanonicalDatabase();
        const bridge = new CuratedKnowledgeBridge(db, vaultDir);
        const stats = bridge.runFullIngestion(options.viewsOut);

        console.log(`\n${chalk.bold('CURATED KNOWLEDGE VAULT INGESTION SUMMARY')}`);
        console.log(chalk.dim('────────────────────────────────────────────────'));
        console.log(`  Global Tools Ingested:        ${chalk.green(stats.globalToolsCount)}`);
        console.log(`  Dependencies Ingested:        ${chalk.green(stats.dependencyEntriesCount)}`);
        console.log(`  Sacred Version Pins Tracked:  ${chalk.cyan.bold(stats.sacredPinsCount)}`);
        console.log(`  Technology Radar Records:     ${chalk.yellow(stats.radarRecordsCount)}`);
        console.log(`  Callstack & AI Packages:      ${chalk.magenta(stats.callstackPackagesCount)}`);
        console.log('');
        if (stats.dangerZonesPath) {
          console.log(`  🚨 Agent Danger Zones:        ${chalk.green(stats.dangerZonesPath)}`);
        }
        if (stats.currentStatePath) {
          console.log(`  🧭 Agent Current State:       ${chalk.green(stats.currentStatePath)}`);
        }
        console.log('');
        consola.success('Curated knowledge vault and agent views successfully synthesized!');
      } catch (e: any) {
        consola.error('Failed to run curated vault ingestion:', e.message);
      }
    });

  cli
    .command('agent:views [outDir]', 'Synthesize canonical DANGER-ZONES.md and CURRENT-STATE.md agent views')
    .action((outDir = 'docs/agent-views') => {
      try {
        consola.info(`Synthesizing canonical agent views into: ${chalk.cyan(outDir)}`);
        const db = new CanonicalDatabase();
        const bridge = new CuratedKnowledgeBridge(db);
        const views = bridge.synthesizeAgentViews(outDir);
        consola.success(`Generated ${views.dangerZones}`);
        consola.success(`Generated ${views.currentState}`);
      } catch (e: any) {
        consola.error('Failed to synthesize agent views:', e.message);
      }
    });
}
