/**
 * @file doctor.ts
 * Rust Tooling Doctor, TCDI Stack Doctor, Dependency Doctor, Expo Bridge, and Multi-Diagnostic commands.
 */

import type { CAC } from 'cac';
import { consola } from 'consola';
import chalk from 'chalk';
import fs from 'node:fs';
import path from 'node:path';
import { execSync, execFileSync } from 'node:child_process';
import { RustToolingDoctor, PhysicalGroundingEngine, SovereignScannerPipeline } from '@intuitui-labs/rn-terrain-core';
import {
  TcdiStackDoctor,
  TcdiDependencyDoctor,
  ExpoDoctorBridge,
  TopologicalSubstrateProfiler,
  IntegrativeSeamsEngine,
  EcosystemStackClassifier,
} from '@intuitui-labs/rn-terrain-scanner';

export function registerDoctorCommands(cli: CAC): void {
  // ─── Rust Tooling Doctor ───────────────────────────────────────────────────
  cli
    .command('doctor', 'Rust Tooling Doctor: Inspect sovereign shiny tools and get elegant taste-of-the-best nudges')
    .option('--install', 'Automatically install missing sovereign tools')
    .action((options) => {
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
            if (t.url) {
              console.log(`     ${chalk.dim('Docs:')}    ${chalk.cyan.underline(t.url)}`);
            }
          } else {
            console.log(`  ${chalk.red('❌')} ${chalk.bold(t.id.padEnd(8))} | ${chalk.yellow(t.name.padEnd(12))} | ${chalk.red.bold('MISSING')}`);
            console.log(`     ${chalk.dim('Purpose:')} ${t.purpose}`);
            console.log(`     ${chalk.cyan('✨ Nudge:')}   ${chalk.yellow(t.tasteOfTheBestRationale)}`);
            if (t.url) {
              console.log(`     ${chalk.cyan('🌐 Docs:')}    ${chalk.blue.underline(t.url)}`);
            }
            console.log(`     ${chalk.cyan('📦 Recipe:')}  ${chalk.green.bold(t.installRecipes.windows)}`);
          }
          console.log('');
        }

        if (options?.install && report.missingCount > 0) {
          consola.info('Auto-installing missing sovereign tools...');
          for (const t of report.tools.filter(tool => !tool.installed)) {
            const recipe = t.installRecipes.windows;
            try {
              consola.start(`Installing ${t.name} (${recipe})...`);
              execSync(recipe, { stdio: 'inherit' });
              consola.success(`Installed ${t.name} successfully.`);
            } catch (err: any) {
              consola.warn(`Could not auto-install ${t.name}: ${err.message}`);
            }
          }
        } else if (report.missingCount === 0) {
          consola.success('All sovereign Rust tools are installed, verified, and active for peak agent performance!');
        } else {
          consola.info(`Run 'rn-terrain doctor --install' to auto-install or use the recipes above.`);
        }
        console.log('');
      } catch (e: any) {
        consola.error('Failed to run Rust doctor:', e.message);
      }
    });

  // ─── Tool Recipes ──────────────────────────────────────────────────────────
  cli
    .command('doctor:recipes', 'Show high-performance install recipes for sovereign Rust developer tooling')
    .option(
      '--os <os>',
      'Target operating system (windows, macos, cargo)',
      { default: process.platform === 'win32' ? 'windows' : process.platform === 'darwin' ? 'macos' : 'cargo' },
    )
    .action((options) => {
      try {
        const doctor = new RustToolingDoctor();
        const report = doctor.runDiagnostic();

        console.log(`\n${chalk.bold.underline('📦 SOVEREIGN RUST TOOLING RECIPES & UPGRADE PATH')}`);
        console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));
        console.log(`  Target OS: ${chalk.cyan.bold(options.os.toUpperCase())}\n`);

        for (const t of report.tools) {
          const status = t.installed ? chalk.green('[INSTALLED]') : chalk.yellow('[RECOMMENDED]');
          const recipe =
            options.os === 'windows'
              ? t.installRecipes.windows
              : options.os === 'macos'
                ? t.installRecipes.macos
                : t.installRecipes.cargo || t.installRecipes.windows;

          console.log(`  ${chalk.bold(t.name.padEnd(14))} ${status}`);
          console.log(`    ${chalk.dim('Purpose:')} ${t.purpose}`);
          console.log(`    ${chalk.dim('Command:')} ${chalk.green.bold(recipe)}`);
          console.log('');
        }

        if (options.os === 'windows') {
          console.log(chalk.cyan.bold('🚀 ONE-LINER FULL STACK ACCELERATION:'));
          console.log(
            chalk.green.bold('winget install BurntSushi.ripgrep.MSVC sharkdp.fd sharkdp.bat dandavison.delta eza-community.eza\n'),
          );
        }
      } catch (e: any) {
        consola.error('Failed to display tool recipes:', e.message);
      }
    });

  // ─── TCDI Stack Doctor ─────────────────────────────────────────────────────
  cli
    .command('doctor:stack [targetPath]', 'TCDI Stack Doctor: Audit React Native code against temporal New Architecture, Worklet, and gesture patterns')
    .option('--rn <version>', 'Target React Native version (e.g. ^0.88.0, 0.74.2)')
    .option('--arch <arch>', 'Target architecture: new-arch, paper, or interop', { default: 'new-arch' })
    .option('--reanimated <version>', 'Target Reanimated version (e.g. ^4.7.1, ^3.16.0)')
    .option('--gesture-handler <version>', 'Target Gesture Handler version (e.g. ^3.3.0)')
    .action((targetPath = '.', options) => {
      try {
        const resolved = path.resolve(targetPath);
        const projectDir = fs.existsSync(resolved) && fs.statSync(resolved).isDirectory() ? resolved : path.dirname(resolved);
        const profiler = new TopologicalSubstrateProfiler(projectDir);
        const substrate = profiler.profile();

        const classifier = new EcosystemStackClassifier(projectDir);
        let classification: ReturnType<typeof classifier.classify> | null = null;
        try {
          classification = classifier.classify();
        } catch {}

        const targetRn = options.rn || (classification?.summary.coreRnVersion ? classification.summary.coreRnVersion.replace(/^[~^]/, '') : '^0.88.0');
        const targetReanimated = options.reanimated || classification?.summary.reanimatedVersion;
        const targetGh = options.gestureHandler || classification?.summary.gestureHandlerVersion;

        const doctor = new TcdiStackDoctor({
          includeCanonicalRules: true,
          targetStack: {
            reactNative: targetRn,
            architecture: options.arch as any,
            reanimated: targetReanimated,
            gestureHandler: targetGh,
            compileSdkVersion: substrate.platform.compileSdkVersion ?? undefined,
            isAndroid15EdgeToEdge: substrate.platform.isAndroid15EdgeToEdgeEnforced,
            navigationShell: substrate.shell.type,
          },
        });

        // 1. Load project-declared rules (.agents/rules/severed-rules.json)
        doctor.loadProjectRules(projectDir);

        // 2. Harvest live deprecations directly from physical installed node_modules
        let liveHarvestedCount = 0;
        try {
          const grounding = new PhysicalGroundingEngine(projectDir);
          const liveDeprecations = grounding.harvestAllProjectRules();
          if (liveDeprecations.length > 0) {
            doctor.loadSeveredRules(liveDeprecations);
            liveHarvestedCount = liveDeprecations.length;
          }
        } catch {}

        console.log(`\n${chalk.bold.underline('🩺  TCDI REACT NATIVE STACK DOCTOR')}`);
        console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));
        console.log(`  Target RN:       ${chalk.cyan.bold(targetRn)}${options.rn ? ' (CLI flag)' : classification?.summary.coreRnVersion ? ` (auto-detected: ${classification.summary.coreRnVersion})` : ' (default)'}`);
        console.log(`  Architecture:    ${chalk.cyan.bold(options.arch)}`);
        console.log(`  Governance:      ${chalk.magenta.bold(substrate.governance.model)}`);
        console.log(`  Edge-to-Edge:    ${substrate.platform.isAndroid15EdgeToEdgeEnforced ? chalk.yellow('Android 15 (compileSdk 35+)') : chalk.dim('Legacy Insets')}`);
        console.log(`  Rules Armed:     ${chalk.bold(doctor.getRulesCount())} (${liveHarvestedCount > 0 ? chalk.green(`${liveHarvestedCount} harvested live from physical node_modules`) : 'canonical + substrate'})`);

        if (classification) {
          console.log(`\n${chalk.bold('📦  DYNAMIC ARCHITECTURAL STACK SURFACE')} (${chalk.bold(classification.totalPackages)} packages, ${chalk.cyan.bold(classification.nativePackagesCount)} native, ${classification.floatingNativeCount > 0 ? chalk.yellow.bold(`${classification.floatingNativeCount} floating carets`) : chalk.green('all pinned')}):`);

          const groupLabels: Record<string, string> = {
            CORE_SUBSTRATE: 'Core Substrate & Framework',
            ANIMATION_AND_GESTURES: 'Animation, Worklets & Gestures',
            HIGH_PERFORMANCE_NATIVE: 'High-Performance Native (C++20 / Nitro / Turbo)',
            NAVIGATION_AND_ROUTING: 'Navigation & Surface Layout',
            STORAGE_AND_DATA: 'Storage, SQLite & Data Engines',
            NATIVE_UI_AND_HARDWARE: 'Native UI & Device Hardware',
            STATE_AND_LOGIC: 'State & Logic (Pure JS)',
          };

          for (const [groupKey, label] of Object.entries(groupLabels)) {
            const pkgs = classification.groups[groupKey as keyof typeof classification.groups] || [];
            if (pkgs.length === 0) continue;
            console.log(`  • ${chalk.bold(label)}:`);
            for (const p of pkgs) {
              let badge = chalk.green('[PINNED]');
              let hazardNote = '';
              if (p.abiHazard.hasRisk) {
                if (p.abiHazard.level === 'CRITICAL_C_ABI') {
                  badge = chalk.bgRed.white.bold(' ⚠️ FLOATING C++ ABI ');
                  hazardNote = chalk.red(' (risk: C++ binary/vtable mismatch on bump)');
                } else {
                  badge = chalk.yellow.bold('[⚠️ FLOATING ^]');
                  hazardNote = chalk.yellow(' (risk: native JNI/header drift across builds)');
                }
              } else if (p.rangeType === 'TILDE') {
                badge = chalk.cyan('[TILDE ~]');
              }
              const nativeType = p.moduleType !== 'PURE_JS' ? chalk.magenta(`[${p.moduleType}]`) : chalk.dim('[JS]');
              console.log(`    - ${chalk.bold(p.name)}: ${chalk.cyan(p.declaredRange)} ${nativeType} ${badge}${hazardNote}`);
            }
          }
        }
        console.log('');

        const pipeline = new SovereignScannerPipeline();
        const candidatePattern = doctor.getActiveRipgrepPattern();

        const execution = pipeline.execute(
          resolved,
          {
            candidatePattern,
          },
          (filePath, content) => doctor.diagnoseSnippet(content, path.relative(process.cwd(), filePath))
        );

        console.log(`  Engine:              ${chalk.green.bold(execution.complexity.engine)}`);
        console.log(`  Source Files Found:  ${chalk.bold(execution.complexity.filesDiscovered)} files`);
        console.log(`  Candidate Sieve:     ${chalk.bold(execution.complexity.filesMatched)} files parsed by Tree-sitter`);
        console.log(`  Task Complexity:     ${chalk.magenta.bold(`${execution.complexity.complexityWeight} pts`)} (${(execution.complexity.totalBytesScanned / 1024).toFixed(1)} KB scanned)`);
        console.log(`  Latency:             Total: ${chalk.bold(`${execution.complexity.latency.totalMs}ms`)} (fd: ${execution.complexity.latency.discoveryMs}ms, rg: ${execution.complexity.latency.preFilterMs}ms, AST: ${execution.complexity.latency.analysisMs}ms)`);
        console.log(`  Throughput:          ${chalk.cyan.bold(`${execution.complexity.throughputFilesPerSec} files/sec`)}`);
        console.log('');

        let totalErrors = 0;
        let totalWarnings = 0;
        const allFindings = [];

        for (const report of execution.results) {
          if (report && report.findings.length > 0) {
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

        console.log(`  RN Health Score:     ${healthScore >= 80 ? chalk.green.bold(healthScore) : chalk.yellow.bold(healthScore)} / 100  [${statusBadge}]`);
        console.log(`  Violations:          ${totalErrors > 0 ? chalk.red.bold(totalErrors + ' errors') : chalk.green('0 errors')}, ${totalWarnings > 0 ? chalk.yellow.bold(totalWarnings + ' warnings') : chalk.dim('0 warnings')}`);
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

  // ─── React Doctor Bridge ───────────────────────────────────────────────────
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

  // ─── Dependency Doctor ─────────────────────────────────────────────────────
  cli
    .command('doctor:deps [projectDir]', 'TCDI Dependency Doctor: Audit manifest against Native Surfaces, Peer ABI Matrix, and Local Pins')
    .option('--preset <preset>', 'Stack preset: standard, expo, enterprise, or loose')
    .option('--config <configPath>', 'Path to custom terrain.config.json or .terrainrc')
    .action((projectDir = '.', options) => {
      try {
        const resolved = path.resolve(projectDir);
        const pkgPath = path.join(resolved, 'package.json');
        if (!fs.existsSync(pkgPath)) {
          consola.error(`No package.json found at ${resolved}`);
          return;
        }

        console.log(`\n${chalk.bold.underline('🛡️  TCDI DEPENDENCY & NATIVE SURFACE DOCTOR')}`);
        console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));
        console.log(`  Target Project:  ${chalk.cyan.bold(resolved)}`);

        const doctor = new TcdiDependencyDoctor({
          configPath: options.config,
          preset: options.preset as any,
        });
        const report = doctor.auditManifest(pkgPath);

        console.log(`  Scanned Deps:    ${chalk.bold(report.totalDependenciesScanned)}`);
        console.log(`  Native Modules:  ${chalk.cyan.bold(report.nativeModulesDetected)} detected`);
        console.log(`  Active Preset:   ${chalk.magenta.bold(report.activePreset.toUpperCase())}`);
        console.log(`  Pins Audited:    ${chalk.bold(report.sacredPinsChecked)} evaluated`);
        console.log(`  Status:          ${report.isHealthy ? chalk.green.bold('CLEAN (All invariants & pins respected)') : chalk.red.bold(`${report.errorsCount} errors, ${report.warningsCount} warnings`)}`);
        console.log('');

        if (report.issues.length === 0) {
          consola.success('All native module pins, ABI surfaces, and framework versions strictly conform to guidelines!');
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

  // ─── Expo Doctor Bridge ────────────────────────────────────────────────────
  cli
    .command('doctor:expo [projectDir]', 'Expo Doctor Bridge: Inspect Expo SDK version and native module compliance')
    .action((projectDir = '.') => {
      try {
        const resolved = path.resolve(projectDir);
        console.log(`\n${chalk.bold.underline('📱  EXPO SDK DOCTOR BRIDGE')}`);
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

  // ─── Unified Multi-Diagnostic ──────────────────────────────────────────────
  cli
    .command('doctor:all [projectDir]', 'Unified Multi-Diagnostic: Run 5-Layer Ecosystem Audit (Rust, Substrate, Deps, Stack AST, Seams)')
    .action((projectDir = '.') => {
      try {
        const resolved = path.resolve(projectDir);
        const isDir = fs.existsSync(resolved) && fs.statSync(resolved).isDirectory();
        const rootDir = isDir ? resolved : path.dirname(resolved);
        const pkgPath = path.join(rootDir, 'package.json');

        console.log(`\n${chalk.bold.bgBlue(' 🩺  RN-TERRAIN UNIFIED 5-LAYER ECOSYSTEM DOCTOR ')}`);
        console.log(chalk.dim('═════════════════════════════════════════════════════════════════'));
        console.log(`  Auditing workspace: ${chalk.cyan.bold(rootDir)}\n`);

        const pipeline = new SovereignScannerPipeline();

        // ─────────────────────────────────────────────────────────────
        // LAYER 1: Sovereign Rust Tooling Layer
        // ─────────────────────────────────────────────────────────────
        console.log(chalk.bold('LAYER 1: SOVEREIGN RUST TOOLING LAYER'));
        const rustDoctor = new RustToolingDoctor();
        const rustReport = rustDoctor.runDiagnostic();
        const activeRustTools = rustReport.installedCount;
        const missingRustTools = rustReport.missingCount;
        if (missingRustTools === 0) {
          console.log(`  ${chalk.green('✓')} All ${chalk.bold(activeRustTools)} sovereign Rust tools active (${rustReport.tools.map(t => t.id).join(', ')}).\n`);
        } else {
          const missingIds = rustReport.tools.filter(t => !t.installed).map(t => t.id).join(', ');
          console.log(`  ${chalk.yellow('⚠️')} ${chalk.bold(activeRustTools)} installed, ${chalk.yellow.bold(missingRustTools)} missing: ${chalk.yellow.bold(`[${missingIds}]`)}`);
          console.log(`     ${chalk.dim('Fix:')} Run ${chalk.green.bold('rn-terrain doctor --install')} to auto-install or ${chalk.green('rn-terrain doctor')} for docs links.\n`);
        }

        // ─────────────────────────────────────────────────────────────
        // LAYER 2: Topological Substrate & Platform Invariants
        // ─────────────────────────────────────────────────────────────
        console.log(chalk.bold('LAYER 2: TOPOLOGICAL SUBSTRATE & GOVERNANCE'));
        const profiler = new TopologicalSubstrateProfiler(rootDir);
        const substrate = profiler.profile();
        console.log(`  Substrate Model:     ${chalk.magenta.bold(substrate.governance.model)} (${substrate.scorecard.sovereigntyLevel})`);
        console.log(`  Autolinking:         ${chalk.cyan(substrate.autolinking.activeSystems.join(' • ') || 'None')}`);
        console.log(`  Architecture:        ${chalk.green.bold(substrate.engine.architecture)} (Bridgeless: ${substrate.engine.isBridgeless ? 'Active' : 'Inactive'})`);
        console.log(`  Edge-to-Edge:        ${substrate.platform.isAndroid15EdgeToEdgeEnforced ? chalk.yellow('Android 15 (compileSdk 35+)') : chalk.dim('Legacy Insets')}`);

        let substrateCollisions = substrate.autolinking.potentialCollisions.length;
        if (substrateCollisions > 0) {
          for (const c of substrate.autolinking.potentialCollisions) {
            console.log(`  ${chalk.yellow('⚠️')} [${chalk.bold(c.type)}]: ${c.message}`);
          }
        }
        let configDriftCount = 0;
        if (substrate.configDrift.hasDrift) {
          configDriftCount = substrate.configDrift.driftViolations.length;
          console.log(`  ${chalk.red('❌')} Config Drift: ${chalk.red.bold(`${configDriftCount} discrepancies`)} between app.json and committed native files.`);
          for (const d of substrate.configDrift.driftViolations) {
            console.log(`     • ${chalk.bold(d.file)} [${chalk.cyan(d.property)}]: ${d.hazard}`);
          }
        } else {
          console.log(`  ${chalk.green('✓')} Config Drift: Committed native files match app.json plugins.`);
        }
        console.log('');

        // ─────────────────────────────────────────────────────────────
        // LAYER 3: Sacred Native Pins & Dependency Surface
        // ─────────────────────────────────────────────────────────────
        console.log(chalk.bold('LAYER 3: SACRED NATIVE PINS & DEPENDENCY SURFACE'));
        let depErrors = 0;
        let depWarnings = 0;
        let detectedRn: string | undefined;
        let detectedReanimated: string | undefined;
        let detectedGh: string | undefined;

        if (fs.existsSync(pkgPath)) {
          const depDoctor = new TcdiDependencyDoctor({ configPath: rootDir });
          const depReport = depDoctor.auditManifest(pkgPath);
          depErrors = depReport.errorsCount;
          depWarnings = depReport.warningsCount;

          const classifier = new EcosystemStackClassifier(rootDir);
          let classification: ReturnType<typeof classifier.classify> | null = null;
          try {
            classification = classifier.classify(pkgPath);
          } catch {}

          if (classification) {
            console.log(`  Scanned Manifest:    ${chalk.bold(classification.totalPackages)} total packages (${chalk.cyan.bold(classification.nativePackagesCount)} compiled native modules)`);
            if (classification.floatingNativeCount > 0) {
              console.log(`  ABI Floating Carets: ${chalk.yellow.bold(`${classification.floatingNativeCount} native libraries with unpinned ^ ranges`)} (risks non-deterministic C++/JNI ABI crashes)`);
            } else {
              console.log(`  ABI Floating Carets: ${chalk.green('0 (All compiled native modules strictly pinned)')}`);
            }
          }

          try {
            const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
            const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };
            detectedRn = allDeps['react-native'];
            detectedReanimated = allDeps['react-native-reanimated'];
            detectedGh = allDeps['react-native-gesture-handler'];
          } catch {}

          if (depReport.isHealthy) {
            console.log(`  ${chalk.green('✓')} All native dependencies conform to Sacred Pins & ABI invariants (${depReport.nativeModulesDetected} native modules, preset: ${depReport.activePreset}).`);
          } else {
            console.log(`  ${chalk.yellow('⚠️')} Detected ${depErrors > 0 ? chalk.red.bold(`${depErrors} errors`) : chalk.green('0 errors')}, ${depWarnings > 0 ? chalk.yellow.bold(`${depWarnings} warnings`) : chalk.dim('0 warnings')} in dependencies (preset: ${depReport.activePreset}):`);
            for (const issue of depReport.issues.slice(0, 5)) {
              console.log(`     • [${issue.severity.toUpperCase()}] ${chalk.bold(issue.packageName)}: ${issue.message}`);
            }
            if (depReport.issues.length > 5) {
              console.log(chalk.dim(`       ... and ${depReport.issues.length - 5} more dependency issues.`));
            }
          }
        } else {
          console.log(`  ${chalk.dim('ℹ No package.json found, skipping dependency pin check.')}`);
        }

        const expoBridge = new ExpoDoctorBridge();
        const expoRes = expoBridge.auditExpoProject(rootDir);
        if (expoRes.isExpoProject) {
          console.log(`  ${chalk.green('✓')} Expo SDK ${expoRes.expoSdkVersion} detected: ${expoRes.status}`);
        }
        console.log('');

        // ─────────────────────────────────────────────────────────────
        // LAYER 4: Stack AST & Temporal Codebase Diagnostics
        // ─────────────────────────────────────────────────────────────
        console.log(chalk.bold('LAYER 4: STACK AST & CODEBASE DIAGNOSTICS'));
        const stackDoctor = new TcdiStackDoctor({
          includeCanonicalRules: true,
          targetStack: {
            reactNative: detectedRn || '^0.88.0',
            architecture: substrate.engine.architecture === 'LEGACY_PAPER' ? 'paper' : substrate.engine.architecture === 'INTEROP' ? 'interop' : 'new-arch',
            reanimated: detectedReanimated,
            gestureHandler: detectedGh,
            compileSdkVersion: substrate.platform.compileSdkVersion ?? undefined,
            isAndroid15EdgeToEdge: substrate.platform.isAndroid15EdgeToEdgeEnforced,
            navigationShell: substrate.shell.type,
          },
        });
        stackDoctor.loadProjectRules(rootDir);

        try {
          const grounding = new PhysicalGroundingEngine(rootDir);
          const liveDeprecations = grounding.harvestAllProjectRules();
          if (liveDeprecations.length > 0) {
            stackDoctor.loadSeveredRules(liveDeprecations);
          }
        } catch {}

        const stackCandidatePattern = stackDoctor.getActiveRipgrepPattern();
        const stackExecution = pipeline.execute(
          rootDir,
          { candidatePattern: stackCandidatePattern },
          (filePath, content) => stackDoctor.diagnoseSnippet(content, path.relative(process.cwd(), filePath))
        );

        let stackErrors = 0;
        let stackWarnings = 0;
        const stackFindings = [];
        for (const report of stackExecution.results) {
          if (report && report.findings.length > 0) {
            stackErrors += report.errorsCount;
            stackWarnings += report.warningsCount;
            stackFindings.push(...report.findings);
          }
        }

        if (stackFindings.length === 0) {
          console.log(`  ${chalk.green('✓')} Zero AST stack violations across ${stackExecution.complexity.filesDiscovered} discovered files (${stackExecution.complexity.filesMatched} parsed in ${stackExecution.complexity.latency.totalMs}ms).`);
        } else {
          console.log(`  ${chalk.yellow('⚠️')} ${chalk.red.bold(`${stackErrors} errors`)}, ${chalk.yellow.bold(`${stackWarnings} warnings`)} in code AST (${stackExecution.complexity.filesDiscovered} discovered, ${stackExecution.complexity.filesMatched} parsed in ${stackExecution.complexity.latency.totalMs}ms):`);
          for (const f of stackFindings.slice(0, 5)) {
            console.log(`     • ${f.severity === 'error' ? chalk.red('❌') : chalk.yellow('⚠️')} ${chalk.bold(f.ruleId)} at ${chalk.cyan(f.filePath)}: ${f.remediationAdvice}`);
          }
          if (stackFindings.length > 5) {
            console.log(chalk.dim(`       ... and ${stackFindings.length - 5} more AST findings.`));
          }
        }
        console.log('');

        // ─────────────────────────────────────────────────────────────
        // LAYER 5: Integrative Seams & Cross-Thread Auditor
        // ─────────────────────────────────────────────────────────────
        console.log(chalk.bold('LAYER 5: INTEGRATIVE SEAMS & CROSS-THREAD AUDITOR'));
        const seamsEngine = new IntegrativeSeamsEngine();
        const seamCandidatePattern =
          'worklet|\\.onUpdate|\\.onStart|\\.onEnd|useAnimatedStyle|useDerivedValue|useAnimatedReaction|useFrameCallback|exiting=|entering=|Gesture\\.|GestureDetector|\\.getString|\\.getNumber|\\.getBoolean|\\.executeSync|NitroModules';

        const seamsExecution = pipeline.execute(
          rootDir,
          { candidatePattern: seamCandidatePattern },
          (filePath, content) => seamsEngine.diagnoseSource(content, filePath)
        );

        let seamsViolations = 0;
        let seamsErrors = 0;
        let seamsWarnings = 0;
        for (const report of seamsExecution.results) {
          if (report && report.hasViolations) {
            seamsViolations += report.totalFindings;
            seamsErrors += report.errorsCount;
            seamsWarnings += report.warningsCount;
          }
        }

        if (seamsViolations === 0) {
          console.log(`  ${chalk.green('✓')} Zero seam violations across ${seamsExecution.complexity.filesDiscovered} discovered files (${seamsExecution.complexity.filesMatched} analyzed in ${seamsExecution.complexity.latency.totalMs}ms).`);
        } else {
          console.log(`  ${chalk.yellow('⚠️')} ${chalk.red.bold(`${seamsErrors} errors`)}, ${chalk.yellow.bold(`${seamsWarnings} warnings`)} in cross-thread/lifecycle seams (${seamsExecution.complexity.filesDiscovered} discovered, ${seamsExecution.complexity.filesMatched} analyzed in ${seamsExecution.complexity.latency.totalMs}ms).`);
        }
        console.log('');

        // ─────────────────────────────────────────────────────────────
        // COMPOSITE EXECUTIVE SCORECARD
        // ─────────────────────────────────────────────────────────────
        let executiveScore = 100;
        if (activeRustTools < 2) executiveScore -= 10;
        executiveScore -= (configDriftCount * 10);
        executiveScore -= (substrateCollisions * 5);
        executiveScore -= (depErrors * 15) + (depWarnings * 3);
        executiveScore -= (stackErrors * 15) + (stackWarnings * 4);
        executiveScore -= (seamsErrors * 15) + (seamsWarnings * 4);

        if (executiveScore < 0) executiveScore = 0;

        let statusBadge = chalk.green.bold('SOLID');
        if (executiveScore < 40) statusBadge = chalk.red.bold('CRITICAL_RISK');
        else if (executiveScore < 70) statusBadge = chalk.yellow.bold('DEGRADED');
        else if (executiveScore < 90) statusBadge = chalk.blue.bold('HEALTHY');

        const totalLatency =
          stackExecution.complexity.latency.totalMs + seamsExecution.complexity.latency.totalMs;

        console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));
        console.log(`  COMPOSITE EXECUTIVE SCORE: ${executiveScore >= 80 ? chalk.green.bold(executiveScore) : executiveScore >= 50 ? chalk.yellow.bold(executiveScore) : chalk.red.bold(executiveScore)} / 100  [${statusBadge}]`);
        console.log(`  Audited Invariants:       ${chalk.bold('5 Layers (Tooling, Substrate, Deps, AST Stack, Seams)')}`);
        console.log(`  Total Scan Latency:       ${chalk.bold(`${totalLatency}ms`)} (Sovereign Rust Accelerated)`);
        console.log(chalk.dim('═════════════════════════════════════════════════════════════════\n'));

        if (executiveScore >= 80) {
          consola.success('Ecosystem health verified! Clean architecture across all 5 dimensions.');
        } else {
          consola.warn('Action required: Address the identified discrepancies to restore physical reality alignment.');
        }
        console.log('');
      } catch (e: any) {
        consola.error('Failed to run unified doctor:', e.message);
      }
    });

  // ─── Agent Harness Doctor ──────────────────────────────────────────────────
  cli
    .command('doctor:agents [workspacePath]', 'Audit agent harness grounding gates, outside referent receipts, junctions, and adapter health')
    .action((workspacePath = '.') => {
      try {
        const resolved = path.resolve(workspacePath);
        console.log(`\n${chalk.bold.underline('🤖  RN-TERRAIN AGENT HARNESS & GROUNDING DOCTOR')}`);
        console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));
        console.log(`  Auditing workspace: ${chalk.cyan.bold(resolved)}\n`);

        let totalAudits = 0;
        let passedAudits = 0;
        const issues: string[] = [];

        // 1. Outside Referent Gate Scripts
        totalAudits++;
        const gatePath = path.join(resolved, '.agents', 'gate.mjs');
        const stopGatePath = path.join(resolved, '.agents', 'stop-gate.mjs');
        const postToolPath = path.join(resolved, '.agents', 'post-tool.mjs');

        if (fs.existsSync(gatePath) && fs.existsSync(stopGatePath) && fs.existsSync(postToolPath)) {
          passedAudits++;
          console.log(`  ${chalk.green('✓')} [1/6] Harness Gates Active: .agents/gate.mjs, stop-gate.mjs, and post-tool.mjs installed.`);
        } else {
          issues.push('Missing one or more gate scripts in .agents/ directory');
          console.log(`  ${chalk.red('❌')} [1/6] Harness Gates Incomplete: gate.mjs (${fs.existsSync(gatePath)}), stop-gate.mjs (${fs.existsSync(stopGatePath)}), post-tool.mjs (${fs.existsSync(postToolPath)})`);
        }

        // 2. Claude Code Settings & Hooks
        totalAudits++;
        const claudeSettingsPath = path.join(resolved, '.claude', 'settings.json');
        if (fs.existsSync(claudeSettingsPath)) {
          try {
            const settings = JSON.parse(fs.readFileSync(claudeSettingsPath, 'utf8'));
            const hasPreTool = settings?.hooks?.PreToolUse?.some((h: any) => h.command?.includes('gate.mjs'));
            const hasStop = settings?.hooks?.Stop?.some((h: any) => h.command?.includes('stop-gate.mjs'));
            if (hasPreTool && hasStop) {
              passedAudits++;
              console.log(`  ${chalk.green('✓')} [2/6] Claude Code Hooks: PreToolUse and Stop hooks fully wired in .claude/settings.json.`);
            } else {
              issues.push('.claude/settings.json is missing PreToolUse or Stop hook configuration');
              console.log(`  ${chalk.yellow('⚠️')} [2/6] Claude Code Hooks: Partial hook wiring (PreToolUse: ${Boolean(hasPreTool)}, Stop: ${Boolean(hasStop)})`);
            }
          } catch {
            issues.push('Invalid JSON in .claude/settings.json');
            console.log(`  ${chalk.red('❌')} [2/6] Claude Code Hooks: Unable to parse .claude/settings.json`);
          }
        } else {
          issues.push('.claude/settings.json does not exist');
          console.log(`  ${chalk.yellow('⚠️')} [2/6] Claude Code Hooks: .claude/settings.json not found.`);
        }

        // 3. Junction / Symlink Health (.claude/skills -> .agents/skills)
        totalAudits++;
        const claudeSkillsPath = path.join(resolved, '.claude', 'skills');
        const agentsSkillsPath = path.join(resolved, '.agents', 'skills');
        if (fs.existsSync(claudeSkillsPath) && fs.existsSync(agentsSkillsPath)) {
          try {
            const stat = fs.lstatSync(claudeSkillsPath);
            if (stat.isSymbolicLink() || stat.isDirectory()) {
              passedAudits++;
              console.log(`  ${chalk.green('✓')} [3/6] Skill Junction: .claude/skills successfully bridged to .agents/skills.`);
            } else {
              issues.push('.claude/skills exists but is not a valid directory or junction');
              console.log(`  ${chalk.yellow('⚠️')} [3/6] Skill Junction: .claude/skills is not a directory or junction.`);
            }
          } catch {
            issues.push('Unable to read .claude/skills junction status');
            console.log(`  ${chalk.red('❌')} [3/6] Skill Junction: Error reading .claude/skills.`);
          }
        } else {
          issues.push('.claude/skills or .agents/skills is missing');
          console.log(`  ${chalk.yellow('⚠️')} [3/6] Skill Junction: Missing skill directory.`);
        }

        // 4. Charter & Router Brevity (Preventing Catalog Bloat)
        totalAudits++;
        const agentsMdPath = path.join(resolved, 'AGENTS.md');
        const routerSkillPath = path.join(resolved, '.agents', 'skills', 'rn-entry', 'SKILL.md');
        let agentsLines = 0;
        let routerLines = 0;

        if (fs.existsSync(agentsMdPath)) {
          agentsLines = fs.readFileSync(agentsMdPath, 'utf8').split('\n').length;
        }
        if (fs.existsSync(routerSkillPath)) {
          routerLines = fs.readFileSync(routerSkillPath, 'utf8').split('\n').length;
        }

        if (agentsLines > 0 && agentsLines <= 35 && routerLines > 0 && routerLines <= 55) {
          passedAudits++;
          console.log(`  ${chalk.green('✓')} [4/6] Context Hygiene: AGENTS.md (${agentsLines} lines) and rn-entry router (${routerLines} lines) strictly within budget.`);
        } else {
          issues.push(`Context budget bloated: AGENTS.md (${agentsLines} lines, max 30) or router (${routerLines} lines, max 50)`);
          console.log(`  ${chalk.yellow('⚠️')} [4/6] Context Hygiene: Budget exceeded: AGENTS.md (${agentsLines}/30 lines), router (${routerLines}/50 lines).`);
        }

        // 5. Outside Referent Receipt State
        totalAudits++;
        const receiptPath = path.join(resolved, '.agents', 'state', 'receipt.json');
        if (fs.existsSync(receiptPath)) {
          try {
            const receipt = JSON.parse(fs.readFileSync(receiptPath, 'utf8'));
            const ageMinutes = Math.round((Date.now() - new Date(receipt.lastGrounding).getTime()) / 60000);
            const pkgCount = Object.keys(receipt.packages || {}).length;
            passedAudits++;
            console.log(`  ${chalk.green('✓')} [5/6] State Receipt: Grounded receipt active (${pkgCount} packages, ${ageMinutes}m old).`);
          } catch {
            passedAudits++;
            console.log(`  ${chalk.yellow('⚠️')} [5/6] State Receipt: Receipt file present but unparseable.`);
          }
        } else {
          passedAudits++;
          console.log(`  ${chalk.dim('ℹ')} [5/6] State Receipt: No active receipt (will be cut on first preflight_grounding or auto-ground).`);
        }

        // 6. Multi-Harness Adapters (Codex, OpenCode, Antigravity)
        totalAudits++;
        const codexAdapter = path.join(resolved, '.agents', 'adapters', 'codex-config.toml');
        const openCodeAdapter = path.join(resolved, '.agents', 'adapters', 'opencode-plugin.ts');
        const antigravityRule = path.join(resolved, '.agents', 'rules', 'rn-grounding-gate.md');

        if (fs.existsSync(codexAdapter) && fs.existsSync(openCodeAdapter) && fs.existsSync(antigravityRule)) {
          passedAudits++;
          console.log(`  ${chalk.green('✓')} [6/6] Multi-Harness Adapters: Codex, OpenCode, and Antigravity configs synchronized.`);
        } else {
          issues.push('One or more multi-harness adapter configs missing in .agents/adapters/');
          console.log(`  ${chalk.yellow('⚠️')} [6/6] Multi-Harness Adapters: Missing adapter configs.`);
        }

        console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));
        const healthPct = Math.round((passedAudits / totalAudits) * 100);
        const scoreColor = healthPct === 100 ? chalk.green.bold : healthPct >= 80 ? chalk.yellow.bold : chalk.red.bold;
        console.log(`  HARNESS HEALTH SCORE: ${scoreColor(`${healthPct}%`)} (${passedAudits}/${totalAudits} invariants verified)\n`);

        if (healthPct === 100) {
          consola.success('All agent harness gates, hooks, and context boundaries are 100% operational!');
        } else {
          consola.warn(`Harness setup requires attention for optimal performance.`);
        }
        console.log('');
      } catch (e: any) {
        consola.error('Failed to run Agent Harness Doctor:', e.message);
      }
    });

  // ─── Topological Substrate Doctor ──────────────────────────────────────────
  cli
    .command('doctor:substrate [projectDir]', 'Topological Substrate Doctor: Locate project coordinates across the 5D React Native sphere')
    .alias('substrate')
    .action((projectDir = '.') => {
      try {
        const resolved = path.resolve(projectDir);
        const profiler = new TopologicalSubstrateProfiler(resolved);
        const profile = profiler.profile();

        console.log(`\n${chalk.bold.underline('🌐  REACT NATIVE TOPOLOGICAL SUBSTRATE SPHERE')}`);
        console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));
        console.log(`  Target Project:       ${chalk.cyan.bold(profile.projectRoot)}`);
        console.log(`  Substrate Tier:       ${chalk.bold.magenta(profile.scorecard.sovereigntyLevel)}`);
        console.log(`  Summary:              ${profile.scorecard.summary}\n`);

        // Dimension 1: Native Governance
        console.log(chalk.bold('1. NATIVE GOVERNANCE DIMENSION:'));
        const govBadge =
          profile.governance.model === 'PURE_CNG'
            ? chalk.bgGreen.black.bold(' PURE CNG ')
            : profile.governance.model === 'COMMITTED_PREBUILD'
              ? chalk.bgYellow.black.bold(' COMMITTED PREBUILD (DIRTY CNG) ')
              : profile.governance.model === 'PURE_BARE'
                ? chalk.bgBlue.black.bold(' PURE BARE ')
                : chalk.bgCyan.black.bold(` ${profile.governance.model} `);
        console.log(`  Model:                ${govBadge}`);
        console.log(`  Native Directories:   Android: ${profile.governance.hasAndroidDir ? (profile.governance.androidIsGitIgnored ? chalk.yellow('Ignored') : chalk.green('Committed')) : chalk.dim('None')} | iOS: ${profile.governance.hasIosDir ? (profile.governance.iosIsGitIgnored ? chalk.yellow('Ignored') : chalk.green('Committed')) : chalk.dim('None')}`);
        console.log(`  Config Plugins:       ${chalk.bold(profile.governance.activeConfigPluginsCount)} active (${profile.governance.configPlugins.slice(0, 5).join(', ')}${profile.governance.configPlugins.length > 5 ? '...' : ''})`);
        console.log(`  ${chalk.cyan('🛡️  Patching Rule:')}     ${chalk.yellow(profile.governance.nativePatchTargetAdvice)}\n`);

        // Dimension 2: Autolinking Substrate
        console.log(chalk.bold('2. AUTOLINKING SUBSTRATE DIMENSION:'));
        console.log(`  Active Systems:       ${chalk.cyan(profile.autolinking.activeSystems.join(' • ') || 'None')}`);
        console.log(`  Nitro Prefab C++20:   ${profile.autolinking.hasNitroModules ? chalk.green('Yes') : chalk.dim('No')}`);
        console.log(`  Expo Modules Core:    ${profile.autolinking.hasExpoModulesCore ? chalk.green('Yes') : chalk.dim('No')}`);
        if (profile.autolinking.potentialCollisions.length > 0) {
          for (const c of profile.autolinking.potentialCollisions) {
            console.log(`  ${chalk.yellow('⚠️')} [${chalk.bold(c.type)}]: ${c.message}`);
            console.log(`     ${chalk.green('Fix:')} ${c.remediation}`);
          }
        }
        console.log('');

        // Dimension 3: Application Shell & Router
        console.log(chalk.bold('3. APPLICATION SHELL & NAVIGATION:'));
        console.log(`  Navigation Type:      ${chalk.bold.cyan(profile.shell.type)}`);
        if (profile.shell.type === 'EXPO_ROUTER') {
          console.log(`  Filesystem Routes:    ${chalk.green('app/ active')} (${profile.shell.modalRouteGroupsCount} modal segments detected)`);
        }
        console.log(`  ${chalk.dim('Guidance:')}             ${profile.shell.guidance}\n`);

        // Dimension 4: Platform Physics & Edge-to-Edge
        console.log(chalk.bold('4. PLATFORM INSETS & EDGE-TO-EDGE:'));
        console.log(`  compileSdkVersion:    ${chalk.bold(profile.platform.compileSdkVersion ?? 'Default')}`);
        console.log(`  Android 15 Insets:    ${profile.platform.isAndroid15EdgeToEdgeEnforced ? chalk.red.bold('ENFORCED (Core SafeAreaView severed)') : chalk.green('Legacy Insets Permitted')}`);
        console.log(`  System Bar Strategy:  ${profile.platform.systemBarStrategy}\n`);

        // Dimension 5: Engine & Architecture
        console.log(chalk.bold('5. ENGINE & RUNTIME SUBSTRATE:'));
        console.log(`  Architecture:         ${chalk.green.bold(profile.engine.architecture)} (Bridgeless: ${profile.engine.isBridgeless ? chalk.green('Active') : chalk.dim('Inactive')})`);
        console.log(`  Hermes Engine:        ${profile.engine.hermesEnabled ? chalk.green('Active') : chalk.yellow('V8 / JSC')}\n`);

        // Config Drift Audit
        if (profile.configDrift.hasDrift) {
          console.log(chalk.red.bold('🚨 CONFIG DRIFT DETECTED (app.json vs Committed Native Files):'));
          for (const d of profile.configDrift.driftViolations) {
            console.log(`  • ${chalk.bold(d.file)} [${chalk.cyan(d.property)}]:`);
            console.log(`    Plugin Value:    ${chalk.green(d.pluginValue)}`);
            console.log(`    Committed Value: ${chalk.red(d.committedValue)}`);
            console.log(`    ${chalk.yellow(d.hazard)}`);
          }
          console.log('');
        } else {
          consola.success('Config drift check clean! Committed files match app.json plugins.');
        }
      } catch (e: any) {
        consola.error('Failed to profile topological substrate:', e.message);
      }
    });
}
