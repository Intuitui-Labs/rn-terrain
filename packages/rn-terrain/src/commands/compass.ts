/**
 * @file compass.ts
 * Agent Compass, DevTools Compass, Granular Capabilities, and Affordances CLI commands.
 */

import type { CAC } from 'cac';
import { consola } from 'consola';
import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';
import {
  generateAgentCompass,
  writeGroundingReceipt,
  CanonicalDatabase,
  DevToolsRegistry,
  generatePnpmDevToolCompass,
  CapabilityResolver,
  NodeModulesAffordanceEngine,
  PhysicalGroundingEngine,
  getAlternatives,
  getEcosystemTopology,
} from '@intuitui-labs/rn-terrain-core';

export function registerCompassCommands(cli: CAC): void {
  // ─── Pre-flight Agent Compass ──────────────────────────────────────────────
  cli
    .command('compass [...packages]', 'Pre-flight Agent Compass: Grounded API checklist before writing React Native code')
    .option('--json', 'Output raw JSON for agent injection')
    .action((packages = [], options) => {
      try {
        const packageList = Array.isArray(packages) && packages.length > 0 ? packages : ['react-native'];
        const allBriefings = [];

        for (const packageName of packageList) {
          const briefing = generateAgentCompass(packageName, 'latest');
          writeGroundingReceipt(packageName, 'latest', 'cli:compass');
          allBriefings.push(briefing);

          if (!options.json) {
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
          }
        }

        if (options.json) {
          console.log(JSON.stringify(allBriefings.length === 1 ? allBriefings[0] : allBriefings, null, 2));
        }
      } catch (e: any) {
        consola.error('Failed to generate agent compass:', e.message);
      }
    });

  // ─── DevTool Directory & Compass ───────────────────────────────────────────
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

  // ─── Capability Management ─────────────────────────────────────────────────
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

  // ─── Affordances ───────────────────────────────────────────────────────────
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
    .command('alternatives <package>', 'Discover modern New Architecture alternatives for a legacy or unmaintained package')
    .alias('alt')
    .option('--json', 'Output results as JSON')
    .action(async (packageName: string, options: any = {}) => {
      try {
        consola.info(`Searching for alternatives to ${chalk.cyan(packageName)}...`);
        const alts = await getAlternatives(packageName);

        if (options.json) {
          console.log(JSON.stringify(alts, null, 2));
          return;
        }

        console.log(`\n${chalk.bold.underline(`🔄 MODERN ALTERNATIVES FOR: ${packageName}`)}`);
        console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));

        if (alts.length === 0) {
          console.log(chalk.dim('  No direct category alternatives found in local catalog.\n'));
          return;
        }

        for (const a of alts) {
          const archStr = a.compatibility.new_architecture ? chalk.green('✓ Fabric') : chalk.yellow('⚠ Interop');
          const scoreStr = chalk.green.bold(`${a.vitality_score}/100`);
          console.log(`  • ${chalk.bold.cyan(a.package_name.padEnd(35))} (v${a.version.latest})  Score: ${scoreStr}  ${archStr}`);
          if (a.use_case_tags && a.use_case_tags.length > 0) {
            console.log(`    ${chalk.dim('Tags: ' + a.use_case_tags.join(', '))}`);
          }
        }
        console.log('');
      } catch (e: any) {
        consola.error('Failed to fetch alternatives:', e.message);
      }
    });

  cli
    .command('ecosystem [category]', 'Inspect global topology and health of the React Native package ecosystem')
    .alias('map')
    .option('--json', 'Output results as JSON')
    .action(async (category?: string, options: any = {}) => {
      try {
        const topo = await getEcosystemTopology(category);

        if (options.json) {
          console.log(JSON.stringify(topo, null, 2));
          return;
        }

        console.log(`\n${chalk.bold.underline(`🌐 REACT NATIVE ECOSYSTEM TOPOLOGY ${category ? `[${category.toUpperCase()}]` : ''}`)}`);
        console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));
        console.log(`  Total Tracked:        ${chalk.bold(topo.total_packages_tracked)} packages`);
        console.log(`  New Arch Ready:       ${chalk.green.bold(topo.new_arch_adoption_pct + '%')}`);
        console.log(`  Expo Compatible:      ${chalk.green.bold(topo.expo_compatible_pct + '%')}`);
        console.log(`  Hermes v1 Ready:      ${chalk.green.bold(topo.hermes_v1_ready_pct + '%')}`);
        console.log(`  RN 1.0 Ready:         ${chalk.green.bold(topo.v1_ready_pct + '%')}`);
        console.log(`  Actively Maintained:  ${chalk.green.bold(topo.actively_maintained_pct + '%')}`);
        console.log(`  Health Trend:         ${chalk.magenta.bold(topo.ecosystem_health_trend.toUpperCase())}`);
        console.log('');
      } catch (e: any) {
        consola.error('Failed to query ecosystem topology:', e.message);
      }
    });

  // ─── Physical Reality Grounding Engine ─────────────────────────────────────
  cli
    .command('ground <package> [cwd]', 'Physical Reality Grounding: Inspect physical node_modules, live JSDoc deprecations, and ecosystem alignment')
    .alias('reality')
    .alias('ground:package')
    .option('--json', 'Output results as JSON')
    .action((packageName: string, cwd: string = '.', options: any = {}) => {
      try {
        const resolvedCwd = path.resolve(cwd);
        const engine = new PhysicalGroundingEngine(resolvedCwd);
        const card = engine.groundPackage(packageName);

        if (options.json) {
          console.log(JSON.stringify(card, null, 2));
          return;
        }

        console.log(`\n${chalk.bold.underline(`🧭 PHYSICAL GROUNDING REPORT: ${card.packageName}@${card.installedVersion ?? 'NOT_INSTALLED'}`)}`);
        console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));
        console.log(`  Project Root:        ${chalk.cyan(resolvedCwd)}`);
        console.log(`  Physical Path:       ${card.physicalLocation ? chalk.green(card.physicalLocation) : chalk.red('Not installed in node_modules')}`);
        console.log(`  Types Entrypoint:    ${card.typesEntrypoint ? chalk.dim(card.typesEntrypoint) : chalk.dim('None')}`);
        console.log(`  Installed Version:   ${card.installedVersion ? chalk.bold.green(`v${card.installedVersion}`) : chalk.red('None')}`);
        console.log(`  Declared Manifest:   ${card.declaredRange ? chalk.cyan(card.declaredRange) : chalk.dim('Not in package.json dependencies')}`);
        console.log('');

        // 1. Native Units & Architecture
        console.log(chalk.bold('1. NATIVE UNITS & ARCHITECTURE:'));
        const archBadge =
          card.nativeUnits.moduleType === 'NITRO'
            ? chalk.bgMagenta.black.bold(' NITRO (C++20 Hybrid Objects) ')
            : card.nativeUnits.moduleType === 'TURBOMODULE'
              ? chalk.bgGreen.black.bold(' TURBOMODULE (C++ JSI / Fabric) ')
              : card.nativeUnits.moduleType === 'EXPO_MODULE'
                ? chalk.bgCyan.black.bold(' EXPO MODULE (Swift/Kotlin DSL) ')
                : card.nativeUnits.moduleType === 'BRIDGE'
                  ? chalk.bgYellow.black.bold(' LEGACY BRIDGE (Requires Interop Layer) ')
                  : chalk.bgWhite.black.bold(' PURE JAVASCRIPT ');
        console.log(`  Module Architecture: ${archBadge}`);
        console.log(`  Native Targets:      Android: ${card.nativeUnits.hasAndroid ? chalk.green('Yes') : chalk.dim('No')} | iOS: ${card.nativeUnits.hasIos ? chalk.green('Yes') : chalk.dim('No')} | CMake C++: ${card.nativeUnits.hasCMake ? chalk.green('Yes') : chalk.dim('No')}`);
        console.log('');

        // 2. Temporal Gap & Framework Alignment
        console.log(chalk.bold('2. TEMPORAL GAP & FRAMEWORK ALIGNMENT:'));
        const gapColor =
          card.temporalGap.status === 'UP_TO_DATE' || card.temporalGap.status === 'ALIGNED'
            ? chalk.green
            : card.temporalGap.status === 'MINOR_GAP'
              ? chalk.yellow
              : chalk.red;
        console.log(`  Gap Status:          ${gapColor.bold(card.temporalGap.status)}`);
        console.log(`  Details:             ${card.temporalGap.details}`);
        console.log(`  Framework Host:      ${chalk.cyan.bold(card.ecosystemAlignment.frameworkHost ?? 'STANDALONE')}`);
        console.log(`  Alignment Status:    ${card.ecosystemAlignment.isAligned ? chalk.green.bold('✓ Aligned') : chalk.yellow.bold('⚠️ Misaligned')}`);
        console.log(`  Guidance:            ${chalk.yellow(card.ecosystemAlignment.recommendation)}`);
        console.log('');

        // 3. Physical Capabilities
        console.log(chalk.bold('3. PHYSICAL CAPABILITIES (INSPECTED FROM .d.ts):'));
        console.log(`  Exported Hooks:      ${chalk.bold(card.capabilities.exportedHooksCount)} ${card.capabilities.exportedHooks.length > 0 ? chalk.cyan(`(${card.capabilities.exportedHooks.slice(0, 10).join(', ')}${card.capabilities.exportedHooks.length > 10 ? '...' : ''})`) : chalk.dim('(None)')}`);
        console.log(`  Exported Components: ${chalk.bold(card.capabilities.exportedComponentsCount)} ${card.capabilities.exportedComponents.length > 0 ? chalk.cyan(`(${card.capabilities.exportedComponents.slice(0, 10).join(', ')}${card.capabilities.exportedComponents.length > 10 ? '...' : ''})`) : chalk.dim('(None)')}`);
        console.log(`  Exported Functions:  ${chalk.bold(card.capabilities.exportedFunctionsCount)} ${card.capabilities.exportedFunctions.length > 0 ? chalk.cyan(`(${card.capabilities.exportedFunctions.slice(0, 10).join(', ')}${card.capabilities.exportedFunctions.length > 10 ? '...' : ''})`) : chalk.dim('(None)')}`);
        console.log('');

        // 4. Live Severed Rules
        if (card.liveSeveredRulesCount > 0) {
          console.log(chalk.red.bold(`4. LIVE SEVERED / DEPRECATED SYMBOLS (${card.liveSeveredRulesCount} EXTRACTED FROM PHYSICAL .d.ts):`));
          for (const rule of card.liveSeveredRules.slice(0, 12)) {
            const sevBadge = rule.severity === 'hard' ? chalk.bgRed.black.bold(' SEVERED ') : chalk.bgYellow.black.bold(' DEPRECATED ');
            console.log(`  ${sevBadge} ${chalk.bold.red(rule.symbol)} -> Replacement: ${chalk.green.bold(rule.replacement)}`);
            console.log(`     ${chalk.dim('JSDoc:')} ${rule.message}`);
            if (rule.sourceFile) console.log(`     ${chalk.dim('File:')}  ${chalk.dim(rule.sourceFile)}`);
          }
          if (card.liveSeveredRulesCount > 12) {
            console.log(chalk.dim(`  ... and ${card.liveSeveredRulesCount - 12} more deprecated symbols in physical .d.ts.`));
          }
          console.log('');
        } else {
          console.log(chalk.green('4. LIVE SEVERED RULES: Clean! Zero @deprecated symbols found in installed .d.ts files.\n'));
        }

        // 5. Machine Pre-flight Prompt
        console.log(chalk.magenta.bold('5. PRE-FLIGHT AGENT INSTRUCTION (GROUNDED IN PHYSICAL REALITY):'));
        console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));
        console.log(chalk.cyan(card.preflightPrompt));
        console.log('');
      } catch (e: any) {
        consola.error('Failed to ground package:', e.message);
      }
    });

  cli
    .command('ground:all [cwd]', 'Inspect physical reality across all declared dependencies in the project')
    .alias('reality:all')
    .alias('ground:project')
    .option('--json', 'Output results as JSON')
    .action((cwd: string = '.', options: any = {}) => {
      try {
        const resolvedCwd = path.resolve(cwd);
        const projectPkgPath = path.join(resolvedCwd, 'package.json');
        if (!fs.existsSync(projectPkgPath)) {
          consola.error(`No package.json found at ${resolvedCwd}`);
          return;
        }

        const rootPkg = JSON.parse(fs.readFileSync(projectPkgPath, 'utf8'));
        const allDeps = Object.keys({
          ...(rootPkg.dependencies || {}),
          ...(rootPkg.devDependencies || {}),
        }).filter((d) => !d.startsWith('@types/'));

        const engine = new PhysicalGroundingEngine(resolvedCwd);
        const results = allDeps.map((pkg) => engine.groundPackage(pkg));

        if (options.json) {
          console.log(JSON.stringify(results, null, 2));
          return;
        }

        console.log(`\n${chalk.bold.underline(`🧭 FULL PROJECT PHYSICAL GROUNDING RADAR`)}`);
        console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));
        console.log(`  Project: ${chalk.cyan.bold(resolvedCwd)} (${results.length} dependencies analyzed)\n`);

        let installedCount = 0;
        let missingCount = 0;
        let totalLiveRules = 0;

        for (const card of results) {
          if (!card.isPhysicallyInstalled) {
            missingCount++;
            console.log(`  ${chalk.red('❌')} ${chalk.bold(card.packageName.padEnd(35))} ${chalk.red.bold('NOT INSTALLED')}`);
            continue;
          }

          installedCount++;
          totalLiveRules += card.liveSeveredRulesCount;

          const archStr = `[${card.nativeUnits.moduleType}]`.padEnd(14);
          const verStr = `v${card.installedVersion}`.padEnd(12);
          const rulesStr =
            card.liveSeveredRulesCount > 0
              ? chalk.yellow(`(${card.liveSeveredRulesCount} @deprecated)`)
              : chalk.green('clean');

          console.log(`  ${chalk.green('✓')} ${chalk.bold.cyan(card.packageName.padEnd(35))} ${chalk.dim(archStr)} ${chalk.bold(verStr)} ${rulesStr}`);
          if (!card.ecosystemAlignment.isAligned) {
            console.log(`     ${chalk.yellow('⚠️ ' + card.ecosystemAlignment.recommendation)}`);
          }
        }

        console.log(chalk.dim('\n─────────────────────────────────────────────────────────────────'));
        console.log(`  Physical Coverage:    ${chalk.green.bold(installedCount)} installed | ${missingCount > 0 ? chalk.red.bold(`${missingCount} missing`) : chalk.green('0 missing')}`);
        console.log(`  Live Rules Harvested: ${chalk.yellow.bold(totalLiveRules)} active deprecation rules extracted from physical .d.ts files.`);
        console.log('');
      } catch (e: any) {
        consola.error('Failed to run project grounding:', e.message);
      }
    });
}
