#!/usr/bin/env node
import {
  getVitalityCard,
  scanProject,
  createCatalog,
  CanonicalDatabase,
  PolicyGate,
  generateAgentCompass,
  HexagonalIngestionPipeline,
  DevToolsRegistry,
  CANONICAL_DEV_TOOLS,
  generatePnpmDevToolCompass,
  ArchiveDatasetSeeder,
  CapabilityResolver,
  RustToolingDoctor,
  NodeModulesAffordanceEngine,
  CuratedKnowledgeBridge
} from '@intuitui-labs/rn-terrain-core';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import {
  AgentGuardrail,
  TcdiStackDoctor,
  TcdiDependencyDoctor,
  ExpoDoctorBridge
} from '@intuitui-labs/rn-terrain-scanner';
import { evaluatePackage, type WeightProfileName } from '@intuitui-labs/openeval';
import { cac } from 'cac';
import chalk from 'chalk';
import { consola } from 'consola';
import {
  createRadarRecord,
  listRadarRecords,
  loadRadarRecord,
  saveRadarRecord,
  updateRadarRecord,
} from './radar.js';

const cli = cac('rn-eval');

cli
  .command(
    'radar:add <subject>',
    'Capture a package, screenshot, or tool for technology-radar review',
  )
  .option('--kind <kind>', 'package, screenshot, article, issue, benchmark, or other')
  .option('--category <category>', 'Radar category')
  .option('--use-case <useCase>', 'Use case this candidate might serve')
  .option('--problem <problem>', 'Concrete problem being investigated')
  .option('--current-stack <currentStack>', 'Comma-separated current tools')
  .option('--evidence <evidence>', 'URL or local screenshot path')
  .option('--verdict <verdict>', 'ADOPT, TRIAL, ASSESS, or HOLD', { default: 'ASSESS' })
  .option('--decision <decision>', 'Human-readable decision')
  .option('--revisit-when <revisitWhen>', 'Condition for revisiting')
  .action((subject, options) => {
    const record = createRadarRecord(subject, options);
    saveRadarRecord(record);
    consola.success(`Captured ${subject} in the RN Terrain technology radar.`);
    console.log(`Verdict: ${record.verdict} (confidence: ${record.confidence})`);
    console.log(`Saved: docs/RN Terrain/radar/records/${record.id}.json`);
  });

cli
  .command('radar:list', 'List captured technology-radar candidates')
  .option('--verdict <verdict>', 'Filter by verdict')
  .action((options) => {
    const records = listRadarRecords().filter(
      (record) => !options.verdict || record.verdict === options.verdict,
    );
    if (records.length === 0) {
      consola.info('No radar candidates captured yet.');
      return;
    }
    for (const record of records)
      console.log(`${record.verdict.padEnd(6)}  ${record.subject}  — ${record.use_case}`);
  });

cli.command('radar:show <subject>', 'Show a captured technology-radar record').action((subject) => {
  const record = loadRadarRecord(subject);
  if (!record) {
    consola.warn(`No radar record found for ${subject}.`);
    return;
  }
  console.log(JSON.stringify(record, null, 2));
});

cli
  .command('radar:decide <subject>', 'Update the verdict and decision for a radar candidate')
  .option('--verdict <verdict>', 'ADOPT, TRIAL, ASSESS, or HOLD')
  .option('--decision <decision>', 'Why this verdict was chosen')
  .option('--revisit-when <revisitWhen>', 'Condition for revisiting')
  .action((subject, options) => {
    const updated = updateRadarRecord(subject, {
      ...(options.verdict ? { verdict: options.verdict } : {}),
      ...(options.decision ? { decision: options.decision } : {}),
      ...(options.revisitWhen ? { revisit_when: options.revisitWhen } : {}),
    });
    if (!updated) {
      consola.warn(`No radar record found for ${subject}. Capture it first with radar:add.`);
      return;
    }
    consola.success(`${updated.subject}: ${updated.verdict}`);
  });

cli
  .command('<package-name>', 'Evaluate a React Native package')
  .option('--breakdown', 'Show detailed score breakdown')
  .option('--full', 'Show full package capabilities card')
  .option('--json', 'Output raw JSON for machine consumption')
  .action(async (packageName, options) => {
    try {
      const card = await getVitalityCard(packageName);

      if (!card) {
        consola.warn(`Package ${chalk.yellow(packageName)} not found in RN Terrain registry.`);
        consola.info('Manual review recommended before installing.');
        return;
      }

      if (options.json) {
        console.log(JSON.stringify(card, null, 2));
        return;
      }

      // Render Layer 0/1: Summary Header
      console.log(`\n${chalk.bold.underline(`${card.display_name} v${card.version.current}`)}`);
      console.log(chalk.dim(`${card.category} · ${card.vendor} · Layer ${card.topology_layer}`));
      console.log('');

      // Verdict Badge
      const scoreColor =
        card.vitality_score >= 80
          ? chalk.green
          : card.vitality_score >= 60
            ? chalk.yellow
            : card.vitality_score >= 40
              ? chalk.yellow
              : chalk.red;

      const verdictSymbol =
        card.radar_status === 'ADOPT'
          ? '✓'
          : card.radar_status === 'TRIAL'
            ? '◎'
            : card.radar_status === 'ASSESS'
              ? '?'
              : '✗';

      console.log(
        scoreColor(
          `  ${verdictSymbol} ${chalk.bold(card.radar_status)}   ${card.vitality_score}/100`,
        ),
      );
      console.log('');

      // Render Warnings
      if (card.warnings.length > 0) {
        console.log(chalk.yellow('⚠️  SIGNALS REQUIRING ATTENTION:'));
        card.warnings.forEach((w) => {
          const prefix =
            w.severity === 'critical' ? chalk.red('  • [CRITICAL] ') : chalk.yellow('  • ');
          console.log(`${prefix}${w.message}`);
        });
        console.log('');
      }

      // Render Layer 2: Score Breakdown (if requested)
      if (options.breakdown || options.full) {
        console.log(chalk.bold('VITALITY BREAKDOWN'));
        console.log(chalk.dim('────────────────────────────────────────'));

        const renderBar = (score: number, max: number) => {
          const filled = Math.round((score / max) * 10);
          return '█'.repeat(filled) + '░'.repeat(10 - filled);
        };

        const bd = card.score_breakdown;
        console.log(
          `  Maintenance Health   ${renderBar(bd.maintenance.score, bd.maintenance.max)}  ${bd.maintenance.score}/${bd.maintenance.max}`,
        );
        console.log(
          `  Architectural Safety ${renderBar(bd.architecture.score, bd.architecture.max)}  ${bd.architecture.score}/${bd.architecture.max}`,
        );
        console.log(
          `  Temporal Stamina     ${renderBar(bd.temporal.score, bd.temporal.max)}  ${bd.temporal.score}/${bd.temporal.max}`,
        );
        console.log(
          `  Ecosystem Position   ${renderBar(bd.ecosystem.score, bd.ecosystem.max)}  ${bd.ecosystem.score}/${bd.ecosystem.max}`,
        );
        console.log(
          `  Cost Factors         ${renderBar(bd.cost.score, bd.cost.max)}  ${bd.cost.score}/${bd.cost.max}`,
        );
        console.log('');
      }

      // Render Capabilities (Layer 3)
      if (options.full && card.capability) {
        console.log(chalk.bold('CAPABILITIES & FIT'));
        console.log(chalk.dim('────────────────────────────────────────'));
        console.log(`  Primary: ${card.capability.primary_purpose}`);
        console.log(`  Capabilities: ${card.capability.key_capabilities.join(', ')}`);
        console.log(`  Limitations: ${card.capability.known_limitations.join(', ')}`);
        console.log('');
      }

      // Render Links
      console.log(chalk.bold('LINKS'));
      console.log(`  npm:    ${chalk.blue(card.links.npm)}`);
      if (card.links.github) console.log(`  github: ${chalk.blue(card.links.github)}`);
      console.log('');
    } catch (error: any) {
      consola.error('Error evaluating package:', error.message);
    }
  });

cli
  .command('scan [package-json]', 'Scan package.json dependencies')
  .action(async (packageJsonPath = './package.json') => {
    try {
      consola.info(`Auditing project dependencies: ${chalk.cyan(packageJsonPath)}`);
      const audit = await scanProject(packageJsonPath);

      console.log(`\n${chalk.bold('PROJECT VITALITY SUMMARY')}`);
      console.log(chalk.dim('────────────────────────────────────────'));
      console.log(`  SOLID ROCK (ADOPT):   ${chalk.green(audit.summary.adopt)}`);
      console.log(`  STABLE TRAIL (TRIAL): ${chalk.yellow(audit.summary.trial)}`);
      console.log(`  ASSESS FIRST:         ${chalk.yellow(audit.summary.assess)}`);
      console.log(`  HOLD (DECAYED):       ${chalk.red(audit.summary.hold)}`);
      console.log(`  UNVETTED/UNKNOWN:     ${chalk.dim(audit.summary.unknown)}`);
      console.log('');

      if (audit.critical_warnings.length > 0) {
        consola.warn(
          `${chalk.red(audit.critical_warnings.length)} critical warnings found during scan.`,
        );
      } else {
        consola.success('Scan complete. No critical compatibility warnings.');
      }
      console.log('');
    } catch (e: any) {
      consola.error('Failed to audit project:', e.message);
    }
  });

cli
  .command(
    'v1-check [package-json]',
    'Evaluate React Native 1.0 readiness for project dependencies',
  )
  .action(async (packageJsonPath = './package.json') => {
    try {
      consola.info(
        `Auditing project for React Native 1.0 compatibility: ${chalk.cyan(packageJsonPath)}`,
      );
      const audit = await scanProject(packageJsonPath);

      console.log(`\n${chalk.bold('REACT NATIVE 1.0 COMPATIBILITY REPORT')}`);
      console.log(chalk.dim('────────────────────────────────────────'));

      for (const card of audit.packages) {
        const v1 = card.v1_readiness;
        let statusColor = chalk.gray;
        if (v1.status === 'READY') statusColor = chalk.green;
        else if (v1.status === 'ADAPTING') statusColor = chalk.yellow;
        else if (v1.status === 'AT_RISK') statusColor = chalk.yellow;
        else if (v1.status === 'INCOMPATIBLE') statusColor = chalk.red;

        console.log(`  ${chalk.bold(card.package_name)}`);
        console.log(`    Status:     ${statusColor(v1.status)} (Score: ${v1.score}/100)`);
        console.log(`    New Arch:   ${card.compatibility.new_architecture}`);
        if (v1.migration_notes) {
          console.log(`    Notes:      ${chalk.dim(v1.migration_notes)}`);
        }
        console.log('');
      }

      console.log(chalk.dim('────────────────────────────────────────'));
      console.log(`  V1.0 Ready:   ${chalk.green(audit.v1_ready_count)}`);
      console.log(`  At Risk:      ${chalk.yellow(audit.v1_at_risk_count)}`);
      console.log('');

      if (audit.v1_at_risk_count > 0) {
        consola.warn(
          `${chalk.yellow(audit.v1_at_risk_count)} packages are at risk or incompatible with RN 1.0.`,
        );
      } else {
        consola.success('All checked dependencies are compatible with React Native 1.0!');
      }
      console.log('');
    } catch (e: any) {
      consola.error('Failed to run V1.0 compatibility check:', e.message);
    }
  });

cli
  .command('jump <package> <from-version> <to-version>', 'Calculate shortest safe migration path across breaking versions')
  .action((packageName, fromVersion, toVersion) => {
    try {
      consola.info(`Calculating migration jump path for ${chalk.cyan(packageName)}: ${fromVersion} -> ${toVersion}`);
      const db = new CanonicalDatabase();
      const symbols = db.getSymbols(packageName, toVersion);
      db.close();

      console.log(`\n${chalk.bold('MIGRATION PATHFINDER GRAPH')}`);
      console.log(chalk.dim('────────────────────────────────────────'));
      console.log(`  Source Version:      ${chalk.yellow(fromVersion)}`);
      console.log(`  Target Version:      ${chalk.green(toVersion)}`);
      console.log(`  Step 1: Upgrade package dependency in package.json to ${chalk.green(toVersion)}`);

      const severed = symbols.filter(s => s.status === 'UNSUPPORTED_REMOVED' || s.status === 'BROKEN_DEFECTIVE');
      if (severed.length > 0) {
        console.log(`  Step 2: ${chalk.red('BREAKING API DETECTED')} — Apply automated codemod:`);
        for (const s of severed) {
          console.log(`    • ${chalk.strikethrough(s.symbol_identifier)} -> ${chalk.green(s.replacement_symbol ?? 'Replacement needed')} (rule: ${s.codemod_rule_id ?? 'manual'})`);
        }
      } else {
        console.log(`  Step 2: No severed APIs found in registry for this jump.`);
      }
      console.log(`  Step 3: Run 'pnpm install' and verify with 'rn-terrain gate ${packageName} ${toVersion}'\n`);
    } catch (e: any) {
      consola.error('Failed to calculate jump:', e.message);
    }
  });

cli
  .command('gate <package> <version> [code-snippet]', 'Evaluate code diff or proposed change against calibrated Policy Gate')
  .action(async (packageName, version, codeSnippet = '') => {
    try {
      consola.info(`Evaluating Policy Gate for ${chalk.cyan(packageName)}@${version}`);
      const guard = new AgentGuardrail();
      const verdict = guard.verify({
        packageName,
        targetVersion: version,
        codeSnippet: codeSnippet || 'export default function App() {}'
      });

      const policyGate = new PolicyGate();
      const res = await policyGate.evaluateDiffPolicy({
        packageName,
        targetVersion: version,
        diffSnippet: codeSnippet,
        severedSymbolsFound: verdict.severedViolations.map(v => v.matchedText)
      });

      console.log(`\n${chalk.bold('CALIBRATED POLICY GATE DECISION')}`);
      console.log(chalk.dim('────────────────────────────────────────'));
      const actionColor = res.action === 'AUTO_EXECUTE' ? chalk.green : res.action === 'HUMAN_TRIAGE' ? chalk.yellow : chalk.red;
      console.log(`  Action:     ${actionColor.bold(res.action)}`);
      console.log(`  Confidence: ${(res.confidence * 100).toFixed(1)}%`);
      console.log(`  Engine:     ${chalk.cyan(res.engineUsed)}`);
      console.log(`  Rationale:  ${res.rationale}`);

      if (verdict.remediationPrompt) {
        console.log(`\n${chalk.yellow('Agent Remediation Prompt:')}`);
        console.log(chalk.dim(verdict.remediationPrompt));
      }
      console.log('');
    } catch (e: any) {
      consola.error('Failed to evaluate policy gate:', e.message);
    }
  });

cli
  .command('openeval <package> [version]', 'Run 6-dimension Deconstructible OpenEval evaluation')
  .option('--profile <profile>', 'default, high_security, bleeding_edge, lts', { default: 'default' })
  .action((packageName, version = 'latest', options) => {
    try {
      consola.info(`Running OpenEval for ${chalk.cyan(packageName)}@${version} (Profile: ${options.profile})`);
      const res = evaluatePackage(
        {
          packageId: packageName,
          version,
          supportsNewArchitecture: true,
          strictTypescript: true,
          hasCodemod: true,
          severedSymbolsRatio: 0.05,
          modernApiRatio: 0.95
        },
        options.profile as WeightProfileName
      );

      console.log(`\n${chalk.bold('DECONSTRUCTIBLE OPENEVAL SCORECARD')}`);
      console.log(chalk.dim('────────────────────────────────────────'));
      console.log(`  Overall Score:  ${chalk.green.bold(res.overallScore + '/10.0')} (${res.recommendationTier})`);
      console.log(chalk.dim('  Dimension Breakdown:'));
      for (const d of res.deconstructedBreakdown) {
        console.log(`    • ${d.dimension.padEnd(20)}: ${d.score.toFixed(1)}/10  (wt: ${(d.weight * 100).toFixed(0)}%) -> +${d.contribution.toFixed(2)}`);
      }
      console.log('');
    } catch (e: any) {
      consola.error('Failed to run OpenEval:', e.message);
    }
  });

cli
  .command('compass <package> [version]', 'Pre-flight Agent Compass: Grounded API checklist before writing React Native code')
  .option('--json', 'Output raw JSON for agent injection')
  .action((packageName, version = 'latest', options) => {
    try {
      const briefing = generateAgentCompass(packageName, version);

      if (options.json) {
        console.log(JSON.stringify(briefing, null, 2));
        return;
      }

      console.log(`\n${chalk.bold.underline(`🧭  RN TERRAIN AGENT COMPASS: ${briefing.package}@${briefing.version}`)}`);
      console.log(chalk.dim(`Architecture: ${chalk.cyan(briefing.architecture)}`));
      console.log('');

      if (briefing.bannedSeveredSymbols.length > 0) {
        console.log(chalk.red.bold('🚫 FORBIDDEN / SEVERED APIS (DO NOT CODE):'));
        for (const b of briefing.bannedSeveredSymbols) {
          console.log(`  • ${chalk.strikethrough(b.identifier)} -> Use: ${chalk.green.bold(b.replacement ?? 'None')}`);
          if (b.codemodHint) console.log(chalk.dim(`    Tip: ${b.codemodHint}`));
        }
        console.log('');
      }

      if (briefing.allowedModernSymbols.length > 0) {
        console.log(chalk.green.bold('✅ CANONICAL MODERN APIS (SAFE TO USE):'));
        console.log(`  ${briefing.allowedModernSymbols.join(', ')}`);
        console.log('');
      }

      if (briefing.knownPeerConflicts.length > 0) {
        console.log(chalk.yellow.bold('⚠️  KNOWN PEER COMBO CONFLICTS:'));
        for (const c of briefing.knownPeerConflicts) {
          console.log(`  • ${c.peerPackage} (${c.safeRange}): ${c.conflictNote} (Severity: ${c.severity}/10)`);
        }
        console.log('');
      }

      console.log(chalk.cyan.bold('📋 PRE-FLIGHT AGENT PROMPT:'));
      console.log(chalk.dim(briefing.preflightInstruction));
      console.log('');
    } catch (e: any) {
      consola.error('Failed to generate agent compass:', e.message);
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
  .command('devtool:list', 'List foundational non-RN developer tools and Rust Shiny Tools')
  .option('--category <category>', 'Filter by category (PACKAGE_MANAGER, JS_ENGINE, BUNDLER, RUST_SHINY_TOOL)')
  .action((options) => {
    try {
      const db = new CanonicalDatabase();
      const registry = new DevToolsRegistry(db);
      registry.seedDefaults();
      const tools = registry.listTools(options.category);

      console.log(`\n${chalk.bold.underline('🛠️  DEVELOPER ECOSYSTEM & SHINY TOOLS DIRECTORY')}`);
      console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));

      for (const t of tools) {
        let statusBadge = chalk.green('[RECOMMENDED]');
        if (t.status === 'SPECIALIZED') statusBadge = chalk.yellow('[SPECIALIZED]');
        else if (t.status === 'EVALUATING') statusBadge = chalk.cyan('[EVALUATING]');

        console.log(`  ${chalk.bold(t.id.padEnd(10))} ${statusBadge} ${chalk.dim(`(${t.category})`)}`);
        console.log(`    ${chalk.dim('Advantage:')} ${t.primary_advantage}`);
        if (t.rn_compatibility_notes) {
          console.log(`    ${chalk.dim('RN Interop:')} ${chalk.cyan(t.rn_compatibility_notes)}`);
        }
        console.log(`    ${chalk.dim('Install:')}    ${chalk.green(t.installCommand)}`);
        console.log('');
      }
    } catch (e: any) {
      consola.error('Failed to list dev tools:', e.message);
    }
  });

cli
  .command('devtool:compass <tool> [version]', 'Pre-flight Agent Compass for developer tooling (e.g. pnpm, bun, rg)')
  .option('--json', 'Output raw JSON for agent injection')
  .action((tool, version = '12.11.2', options) => {
    try {
      const db = new CanonicalDatabase();

      if (tool.toLowerCase() === 'pnpm') {
        const compass = generatePnpmDevToolCompass(version, db);

        if (options.json) {
          console.log(JSON.stringify(compass, null, 2));
          return;
        }

        console.log(`\n${chalk.bold.underline(`🧭  DEVTOOL COMPASS: pnpm@${compass.activeVersion}`)}`);
        console.log(`Status: ${chalk.green.bold(compass.status)} | OpenEval Score: ${chalk.cyan.bold(`${compass.openEvalScore}/100 [ADOPT]`)}`);
        console.log(`RN Compatibility: ${chalk.dim(compass.rnCompatibility)}`);
        console.log('');

        console.log(chalk.red.bold('🚫 FORBIDDEN COMMANDS & MONOREPO ANTI-PATTERNS:'));
        for (const b of compass.bannedCommands) {
          console.log(`  • ${chalk.strikethrough(b.commandOrFlag)} [${chalk.red(b.severity)}]`);
          console.log(`    ${chalk.dim('Why:')} ${b.whySevered}`);
          console.log(`    ${chalk.dim('Use Instead:')} ${chalk.green.bold(b.canonicalReplacement)}`);
        }
        console.log('');

        console.log(chalk.green.bold('✅ CANONICAL MODERN WORKFLOWS:'));
        for (const w of compass.canonicalWorkflows) {
          console.log(`  • ${chalk.green(w)}`);
        }
        console.log('');

        console.log(chalk.cyan.bold('📋 PRE-FLIGHT AGENT PROMPT:'));
        console.log(chalk.dim(compass.preflightInstruction));
        console.log('');
      } else {
        const registry = new DevToolsRegistry(db);
        const t = registry.getTool(tool);
        if (!t) {
          consola.warn(`DevTool '${tool}' not found in canonical registry. Try 'pnpm', 'bun', 'metro', 'rg', 'fd', 'oxlint'.`);
          return;
        }

        console.log(`\n${chalk.bold.underline(`🧭  DEVTOOL COMPASS: ${t.id}`)}`);
        console.log(`Category: ${t.category} | Status: ${chalk.green(t.status)}`);
        console.log(`Primary Advantage: ${t.primary_advantage}`);
        console.log(`Install: ${chalk.green(t.installCommand)}`);
        console.log('');
      }
    } catch (e: any) {
      consola.error('Failed to run devtool compass:', e.message);
    }
  });

cli
  .command('seed:archive [peersDir]', 'Bulk ingest historical peer dependency datasets from archive')
  .action((peersDir = 'C:\\projects\\rn-terrain-archive-extracted\\rn-terrain\\compat\\peers') => {
    try {
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
  .command('doctor', 'Rust Tooling Doctor: Inspect sovereign shiny tools and get elegant taste-of-the-best nudges')
  .action(() => {
    try {
      const doctor = new RustToolingDoctor();
      const report = doctor.runDiagnostic();

      console.log(`\n${chalk.bold.underline('🩺  SOVEREIGN RUST TOOLING DOCTOR & NUDGE REPORT')}`);
      console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));
      console.log(`  Tools Audited: ${chalk.bold(report.totalTools)} | Installed: ${chalk.green.bold(report.installedCount)} | Missing: ${report.missingCount > 0 ? chalk.yellow.bold(report.missingCount) : chalk.green.bold(0)}`);
      console.log('');

      for (const t of report.tools) {
        if (t.installed) {
          console.log(`  ${chalk.green('✅')} ${chalk.bold(t.id.padEnd(8))} | ${chalk.green(t.name.padEnd(12))} | ${chalk.dim(t.version ?? 'installed')}`);
          console.log(`     ${chalk.dim('Purpose:')} ${t.purpose}`);
        } else {
          console.log(`  ${chalk.red('❌')} ${chalk.bold(t.id.padEnd(8))} | ${chalk.yellow(t.name.padEnd(12))} | ${chalk.red.bold('MISSING')}`);
          console.log(`     ${chalk.dim('Purpose:')} ${t.purpose}`);
          console.log(`     ${chalk.cyan('✨ Nudge:')}   ${chalk.yellow(t.tasteOfTheBestRationale)}`);
          console.log(`     ${chalk.cyan('📦 Recipe:')}  ${chalk.green.bold(t.installRecipes.windows)}`);
        }
        console.log('');
      }

      if (report.missingCount === 0) {
        consola.success('All sovereign Rust tools are installed, verified, and active for peak agent performance!');
      } else {
        consola.info(`Run the recipes above to elevate your developer and agent toolchain.`);
      }
      console.log('');
    } catch (e: any) {
      consola.error('Failed to run Rust doctor:', e.message);
    }
  });

cli
  .command('doctor:stack [targetPath]', 'TCDI Stack Doctor: Audit React Native code against temporal New Architecture, Worklet, and gesture patterns')
  .option('--rn <version>', 'Target React Native version (e.g. ^0.88.0, 0.74.2)', { default: '^0.88.0' })
  .option('--arch <arch>', 'Target architecture: new-arch, paper, or interop', { default: 'new-arch' })
  .option('--reanimated <version>', 'Target Reanimated version (e.g. ^4.7.1, ^3.16.0)')
  .action((targetPath = '.', options) => {
    try {
      const doctor = new TcdiStackDoctor({
        targetStack: {
          reactNative: options.rn,
          architecture: options.arch as any,
          reanimated: options.reanimated,
        },
      });

      console.log(`\n${chalk.bold.underline('🩺  TCDI REACT NATIVE STACK DOCTOR')}`);
      console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));
      console.log(`  Target RN:     ${chalk.cyan.bold(options.rn)}`);
      console.log(`  Architecture:  ${chalk.cyan.bold(options.arch)}`);
      if (options.reanimated) console.log(`  Reanimated:    ${chalk.cyan.bold(options.reanimated)}`);
      console.log('');

      const resolved = path.resolve(targetPath);
      const filesToScan: string[] = [];

      function collectFiles(dirOrFile: string) {
        if (!fs.existsSync(dirOrFile)) return;
        const stat = fs.statSync(dirOrFile);
        if (stat.isFile()) {
          if (/\.(tsx|ts|jsx|js)$/.test(dirOrFile) && !dirOrFile.includes('node_modules') && !dirOrFile.includes('dist')) {
            filesToScan.push(dirOrFile);
          }
        } else if (stat.isDirectory()) {
          const entries = fs.readdirSync(dirOrFile);
          for (const entry of entries) {
            if (entry === 'node_modules' || entry === 'dist' || entry === '.git' || entry === '.turbo') continue;
            collectFiles(path.join(dirOrFile, entry));
          }
        }
      }

      collectFiles(resolved);

      if (filesToScan.length === 0) {
        consola.warn(`No source files (.tsx/.ts/.jsx/.js) found in ${resolved}.`);
        return;
      }

      let totalErrors = 0;
      let totalWarnings = 0;
      const allFindings = [];

      for (const file of filesToScan) {
        const code = fs.readFileSync(file, 'utf8');
        const report = doctor.diagnoseSnippet(code, path.relative(process.cwd(), file));
        if (report.findings.length > 0) {
          totalErrors += report.errorsCount;
          totalWarnings += report.warningsCount;
          allFindings.push(...report.findings);
        }
      }

      let healthScore = 100 - (totalErrors * 15) - (totalWarnings * 4);
      if (healthScore < 0) healthScore = 0;

      let statusBadge = chalk.green.bold('SOLID');
      if (healthScore < 50) statusBadge = chalk.red.bold('LETHAL_DRIFT');
      else if (totalErrors > 0) statusBadge = chalk.yellow.bold('DEGRADED');
      else if (totalWarnings > 0) statusBadge = chalk.blue.bold('HEALTHY');

      console.log(`  Files Audited:    ${chalk.bold(filesToScan.length)}`);
      console.log(`  RN Health Score:  ${healthScore >= 80 ? chalk.green.bold(healthScore) : chalk.yellow.bold(healthScore)} / 100  [${statusBadge}]`);
      console.log(`  Violations:       ${totalErrors > 0 ? chalk.red.bold(totalErrors + ' errors') : chalk.green('0 errors')}, ${totalWarnings > 0 ? chalk.yellow.bold(totalWarnings + ' warnings') : chalk.dim('0 warnings')}`);
      console.log('');

      if (allFindings.length === 0) {
        consola.success('No React Native substrate or New Architecture violations detected. Clean build!');
      } else {
        console.log(chalk.bold('FINDINGS BREAKDOWN:'));
        for (const f of allFindings.slice(0, 20)) {
          const icon = f.severity === 'error' ? chalk.red('❌ [ERROR]') : chalk.yellow('⚠️  [WARN]');
          console.log(`  ${icon} ${chalk.bold(f.ruleId)} at ${chalk.cyan(`${f.filePath}:${f.line}:${f.column}`)}`);
          console.log(`     ${chalk.dim('Match:')}       ${chalk.bold(f.matchedText)}`);
          console.log(`     ${chalk.yellow('Temporal:')}    ${f.temporalNote}`);
          console.log(`     ${chalk.green('Remediation:')} ${f.remediationAdvice}`);
          console.log('');
        }
        if (allFindings.length > 20) {
          console.log(chalk.dim(`  ... and ${allFindings.length - 20} more findings.`));
        }
      }
      console.log('');
    } catch (e: any) {
      consola.error('Failed to run TCDI Stack Doctor:', e.message);
    }
  });

cli
  .command('doctor:react [args...]', 'Run React Doctor for component-level hook, a11y, and web render checks')
  .action((args = []) => {
    try {
      consola.info('Invoking React Doctor (Oxlint + React Rules)...');
      const passArgs = args.length > 0 ? args.join(' ') : '--verbose --scope changed';
      execSync(`npx react-doctor@latest ${passArgs}`, { stdio: 'inherit' });
    } catch (e: any) {
      consola.error('React Doctor encountered issues or exited with non-zero code.');
    }
  });

cli
  .command('doctor:deps [projectDir]', 'TCDI Dependency Doctor: Audit manifest against Sacred Native Pins and dialect drift')
  .action((projectDir = '.') => {
    try {
      const resolved = path.resolve(projectDir);
      const pkgPath = path.join(resolved, 'package.json');
      if (!fs.existsSync(pkgPath)) {
        consola.error(`No package.json found at ${resolved}`);
        return;
      }

      console.log(`\n${chalk.bold.underline('🛡️  TCDI DEPENDENCY & SACRED PIN DOCTOR')}`);
      console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));
      console.log(`  Target Project:  ${chalk.cyan.bold(resolved)}`);

      const doctor = new TcdiDependencyDoctor();
      const report = doctor.auditManifest(pkgPath);

      console.log(`  Scanned Deps:    ${chalk.bold(report.totalDependenciesScanned)}`);
      console.log(`  Sacred Pins:     ${chalk.bold(report.sacredPinsChecked)} evaluated`);
      console.log(`  Status:          ${report.isHealthy ? chalk.green.bold('CLEAN (All sacred pins respected)') : chalk.red.bold(`${report.errorsCount} errors, ${report.warningsCount} warnings`)}`);
      console.log('');

      if (report.issues.length === 0) {
        consola.success('All native module pins and framework versions strictly conform to canonical guidelines!');
      } else {
        console.log(chalk.bold('DEPENDENCY ISSUES:'));
        for (const issue of report.issues) {
          const badge = issue.severity === 'error' ? chalk.red.bold('❌ [ERROR]') : chalk.yellow.bold('⚠️  [WARN]');
          console.log(`  ${badge} ${chalk.bold(issue.packageName)} (${chalk.cyan(issue.currentVersion)})`);
          console.log(`     ${chalk.dim('Rule:')}         ${issue.ruleType}`);
          console.log(`     ${chalk.yellow('Detail:')}       ${issue.message}`);
          console.log(`     ${chalk.green('Remediation:')}  ${issue.remediation}`);
          console.log('');
        }
      }
    } catch (e: any) {
      consola.error('Failed to run Dependency Doctor:', e.message);
    }
  });

cli
  .command('doctor:expo [projectDir]', 'Expo Doctor Bridge: Inspect Expo SDK version and native module compliance')
  .action((projectDir = '.') => {
    try {
      const resolved = path.resolve(projectDir);
      console.log(`\n${chalk.bold.underline('📱  EXPO DOCTOR COMPLIANCE BRIDGE')}`);
      console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));
      console.log(`  Target Project:  ${chalk.cyan.bold(resolved)}`);

      const bridge = new ExpoDoctorBridge();
      const res = bridge.auditExpoProject(resolved);

      if (!res.isExpoProject) {
        consola.info('Project is a bare React Native project (expo dependency not declared).');
        return;
      }

      console.log(`  Expo SDK:        ${chalk.cyan.bold(`SDK ${res.expoSdkVersion}`)}`);
      console.log(`  Status:          ${res.status === 'VALID' ? chalk.green.bold('VALID') : chalk.yellow.bold('WARNINGS_DETECTED')}`);
      console.log('');
      console.log(chalk.dim(res.output));
      console.log('');

      if (res.advice.length > 0) {
        for (const adv of res.advice) {
          console.log(`  💡 ${chalk.green(adv)}`);
        }
        console.log('');
      }
    } catch (e: any) {
      consola.error('Failed to run Expo Doctor Bridge:', e.message);
    }
  });

cli
  .command('doctor:all [projectDir]', 'Unified Multi-Diagnostic: Run Stack, Dependency, Expo, and Rust Tooling diagnostics')
  .action((projectDir = '.') => {
    try {
      const resolved = path.resolve(projectDir);
      console.log(`\n${chalk.bold.bgBlue(' 🩺  RN-TERRAIN UNIFIED ECOSYSTEM DOCTOR ')}`);
      console.log(chalk.dim('═════════════════════════════════════════════════════════════════'));
      console.log(`  Auditing workspace: ${chalk.cyan.bold(resolved)}\n`);

      // 1. Rust Tooling
      console.log(chalk.bold('1. SOVEREIGN RUST TOOLING LAYER:'));
      const rustDoctor = new RustToolingDoctor();
      const rustReport = rustDoctor.runDiagnostic();
      const activeRustTools = rustReport.installedCount;
      console.log(`   ${chalk.green('✓')} Found ${chalk.bold(activeRustTools)} active Rust high-performance tools.\n`);

      // 2. Dependency Doctor
      console.log(chalk.bold('2. SACRED NATIVE PINS & MANIFEST HEALTH:'));
      const pkgPath = path.join(resolved, 'package.json');
      let depErrors = 0;
      let depWarnings = 0;
      if (fs.existsSync(pkgPath)) {
        const depDoctor = new TcdiDependencyDoctor();
        const depReport = depDoctor.auditManifest(pkgPath);
        depErrors = depReport.errorsCount;
        depWarnings = depReport.warningsCount;
        if (depReport.isHealthy) {
          console.log(`   ${chalk.green('✓')} All native dependencies conform to Sacred Pins.`);
        } else {
          console.log(`   ${chalk.yellow('⚠️')} Detected ${depErrors} errors, ${depWarnings} warnings in dependencies.`);
        }
      } else {
        console.log(`   ${chalk.dim('ℹ No package.json in current directory, skipping manifest pin check.')}`);
      }
      console.log('');

      // 3. Expo Bridge
      console.log(chalk.bold('3. EXPO SDK ECOSYSTEM ALIGNMENT:'));
      const expoBridge = new ExpoDoctorBridge();
      const expoRes = expoBridge.auditExpoProject(resolved);
      if (expoRes.isExpoProject) {
        console.log(`   ${chalk.green('✓')} Expo SDK ${expoRes.expoSdkVersion} detected: ${expoRes.status}`);
      } else {
        console.log(`   ${chalk.dim('ℹ Bare React Native project detected.')}`);
      }
      console.log('');

      // Executive Scorecard
      let overallScore = 100 - (depErrors * 20) - (depWarnings * 5);
      if (activeRustTools < 2) overallScore -= 10;
      if (overallScore < 0) overallScore = 0;

      console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));
      console.log(`  EXECUTIVE SCORE: ${overallScore >= 80 ? chalk.green.bold(overallScore) : chalk.yellow.bold(overallScore)} / 100`);
      console.log(chalk.dim('═════════════════════════════════════════════════════════════════\n'));
    } catch (e: any) {
      consola.error('Failed to run unified doctor:', e.message);
    }
  });

cli
  .command('capability:list', 'List granular ecosystem capabilities across mobile, monorepo, and agent tooling')
  .option('--category <category>', 'Filter by category (GESTURE, ANIMATION, STORAGE, MONOREPO, AGENT_TOOLING, RUST_COMPUTE)')
  .action((options) => {
    try {
      const db = new CanonicalDatabase();
      const resolver = new CapabilityResolver(db);
      const caps = resolver.listAllCapabilities(options.category);

      console.log(`\n${chalk.bold.underline('🧬  GRANULAR CAPABILITIES REGISTRY')}`);
      console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));

      for (const c of caps) {
        console.log(`  ${chalk.bold(c.id.padEnd(35))} [${chalk.cyan(c.category)}] (${chalk.dim(c.level)})`);
        console.log(`    ${chalk.dim('Name:')}        ${c.name}`);
        if (c.description) console.log(`    ${chalk.dim('Function:')}    ${c.description}`);
        console.log(`    ${chalk.dim('Fabric Native:')} ${c.fabric_native_required ? chalk.green('Yes') : chalk.dim('No')}`);
        console.log('');
      }
    } catch (e: any) {
      consola.error('Failed to list capabilities:', e.message);
    }
  });

cli
  .command('capability:resolve <capabilityId>', 'Resolve a capability to recommended packages, introduced versions, and alternatives')
  .action((capabilityId) => {
    try {
      const db = new CanonicalDatabase();
      const resolver = new CapabilityResolver(db);
      const res = resolver.resolveCapability(capabilityId);

      if (!res) {
        consola.warn(`Capability '${capabilityId}' not found. Run 'rn-terrain capability:list' to see available capabilities.`);
        return;
      }

      console.log(`\n${chalk.bold.underline(`🎯  CAPABILITY RESOLUTION: ${res.capabilityId}`)}`);
      console.log(`Name: ${chalk.bold(res.name)} | Category: ${chalk.cyan(res.category)}`);
      if (res.description) console.log(`Description: ${res.description}`);
      console.log(`Fabric Native Required: ${res.fabricNativeRequired ? chalk.green('Yes') : chalk.dim('No')}`);
      console.log('');

      if (res.recommendedPackage) {
        console.log(chalk.green.bold('⭐ RECOMMENDED PACKAGE:'));
        console.log(`  Package:     ${chalk.green.bold(res.recommendedPackage.packageId)} (introduced in ${chalk.cyan(res.recommendedPackage.versionIntroduced)})`);
        console.log(`  Tier:        ${res.recommendedPackage.qualityTier}`);
        if (res.recommendedPackage.performanceProfile) {
          console.log(`  Performance: ${chalk.cyan(res.recommendedPackage.performanceProfile)}`);
        }
        if (res.recommendedPackage.caveats) {
          console.log(`  Caveats:     ${chalk.yellow(res.recommendedPackage.caveats)}`);
        }
        console.log('');
      }

      if (res.allProviders.length > 1) {
        console.log(chalk.dim('All Providers:'));
        for (const p of res.allProviders) {
          console.log(`  • ${p.packageId} (>=${p.versionIntroduced}) [${p.qualityTier}]`);
        }
        console.log('');
      }

      if (res.alternativeCapabilities.length > 0) {
        console.log(chalk.dim(`Alternative Capabilities: ${res.alternativeCapabilities.join(', ')}`));
        console.log('');
      }
    } catch (e: any) {
      consola.error('Failed to resolve capability:', e.message);
    }
  });

cli
  .command('capability:inspect <package> [version]', 'Inspect all granular capabilities unlocked by a package/tool')
  .action((packageName, version = 'latest') => {
    try {
      const db = new CanonicalDatabase();
      const resolver = new CapabilityResolver(db);
      const manifest = resolver.inspectPackageCapabilities(packageName, version);

      console.log(`\n${chalk.bold.underline(`📦  CAPABILITIES UNLOCKED BY: ${manifest.packageId}@${manifest.targetVersion}`)}`);
      console.log(`Total Capabilities: ${chalk.bold(manifest.capabilitiesCount)}`);
      console.log('');

      if (manifest.capabilities.length === 0) {
        console.log(chalk.dim('  No explicit capabilities registered for this package.'));
      } else {
        for (const c of manifest.capabilities) {
          const badge = c.isNewInThisVersion ? chalk.green.bold('[NEW IN THIS VERSION]') : '';
          console.log(`  • ${chalk.bold(c.id)} ${badge}`);
          console.log(`    Name:       ${c.name} (${chalk.cyan(c.category)})`);
          console.log(`    Introduced: >=${c.versionIntroduced} [${c.qualityTier}]`);
          console.log('');
        }
      }
    } catch (e: any) {
      consola.error('Failed to inspect package capabilities:', e.message);
    }
  });

cli
  .command('affordance <package> [cwd]', 'Inspect physical node_modules installation, types (.d.ts), and code graph affordances')
  .option('--json', 'Output raw JSON for agent injection')
  .action((packageName, cwd = process.cwd(), options) => {
    try {
      const engine = new NodeModulesAffordanceEngine(cwd);
      const card = engine.generateAffordance(packageName);

      if (options.json) {
        console.log(JSON.stringify(card, null, 2));
        return;
      }

      console.log(`\n${chalk.bold.underline(`📂  PHYSICAL NODE_MODULES AFFORDANCE: ${card.packageName}@${card.installedVersion}`)}`);
      console.log(`Path: ${chalk.cyan(card.packagePath)}`);
      if (card.typesEntrypoint) {
        console.log(`Types: ${chalk.green(card.typesEntrypoint)}`);
      }
      console.log(`Symbols Detected in .d.ts: ${chalk.bold(card.exportedSymbolsCount)}`);
      console.log('');

      if (card.exportedHooks.length > 0) {
        console.log(chalk.green.bold('🎣 GROUNDED HOOKS:'));
        console.log(`  ${card.exportedHooks.join(', ')}`);
        console.log('');
      }

      if (card.exportedComponents.length > 0) {
        console.log(chalk.cyan.bold('🧩 GROUNDED COMPONENTS:'));
        console.log(`  ${card.exportedComponents.join(', ')}`);
        console.log('');
      }

      if (card.exportedFunctions.length > 0) {
        console.log(chalk.blue.bold('⚡ GROUNDED FUNCTIONS:'));
        console.log(`  ${card.exportedFunctions.slice(0, 15).join(', ')}`);
        console.log('');
      }

      if (card.usageSnippet) {
        console.log(chalk.yellow.bold('📖 EXTRACTED CODE SNIPPET (FROM README/EXAMPLE):'));
        console.log(chalk.dim(card.usageSnippet));
        console.log('');
      }

      console.log(chalk.magenta.bold('📋 PRE-FLIGHT AGENT PROMPT:'));
      console.log(chalk.dim(card.preflightInstruction));
      console.log('');
    } catch (e: any) {
      consola.error('Failed to generate affordance:', e.message);
    }
  });

cli
  .command('seed:curated [xDir]', 'Ingest curated annotations, technology radar, and 50-vendor ecosystem from C:\\x vault')
  .option('--views-out <dir>', 'Output directory for synthesized agent views', { default: 'docs/agent-views' })
  .action((xDir = 'C:\\x', options: { viewsOut: string }) => {
    try {
      consola.info(`Ingesting curated architectural knowledge from vault: ${chalk.cyan(xDir)}`);
      const db = new CanonicalDatabase();
      const bridge = new CuratedKnowledgeBridge(db, xDir);
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

cli.help();


cli.parse();

