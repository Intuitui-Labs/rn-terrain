import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import type { CAC } from 'cac';
import chalk from 'chalk';
import { consola } from 'consola';
import { SovereignVersionDiffer, SovereignScannerPipeline } from '@intuitui-labs/rn-terrain-core';
import {
  SovereignCodemodEngine,
  NativeSurfaceProfiler,
  IntegrativeSeamsEngine,
  RnTerrainLinter,
  NitroAuditor,
  YogaLayoutProver,
  HermesBytecodeVerifier,
  HoneypotEngine,
} from '@intuitui-labs/rn-terrain-scanner';

export function registerCodeCommands(cli: CAC) {
  cli
    .command('codemod:apply <rule-id> [targetPath]', 'Automatically rewrite severed APIs in the target codebase')
    .alias('codemod')
    .action((ruleId, targetPath = '.', options) => {
      try {
        consola.info(`Executing automated codemod for rule: ${chalk.cyan(ruleId)} in ${chalk.cyan(targetPath)}`);
        const engine = new SovereignCodemodEngine();
        const result = engine.applyRule(ruleId, targetPath);

        console.log(`\n${chalk.bold('SOVEREIGN CODEMOD EXECUTION SUMMARY')}`);
        console.log(chalk.dim('────────────────────────────────────────'));
        console.log(`  Rule Applied:    ${chalk.bold(result.ruleId)}`);
        console.log(`  Files Scanned:   ${result.filesScanned}`);
        console.log(`  Files Modified:  ${result.filesModified > 0 ? chalk.green.bold(result.filesModified) : chalk.dim('0')}`);
        console.log(`  Engine:          ${result.engineUsed === 'rust_sd' ? chalk.green('Rust sd') : chalk.cyan('Scoped AST Engine')}`);

        if (result.modifiedFiles.length > 0) {
          console.log(`\n${chalk.bold('Modified Files:')}`);
          for (const f of result.modifiedFiles) {
            console.log(`  ${chalk.green('✓')} ${f}`);
          }
        }

        console.log(`\n${chalk.green(result.message)}\n`);
      } catch (e: any) {
        consola.error('Failed to apply codemod:', e.message);
      }
    });

  cli
    .command('audit:native [projectDir]', 'Audit native compilation surface, module types, and leverage index')
    .option('--rn-version <version>', 'Target React Native version override (e.g. 0.88.0)')
    .action((projectDir = '.', options) => {
      try {
        const resolved = path.resolve(projectDir);
        const profiler = new NativeSurfaceProfiler();
        const report = profiler.profileProject({
          projectDir: resolved,
          targetReactNativeVersion: options.rnVersion,
        });

        console.log(`\n${chalk.bold.underline('🏔️  RN-TERRAIN NATIVE SURFACE & LEVERAGE AUDITOR')}`);
        console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));
        console.log(`  Target Project:           ${chalk.cyan.bold(report.projectRoot)}`);
        console.log(`  Total Dependencies:       ${chalk.bold(report.totalDependencies)} (${report.runtimeDependenciesCount} runtime, ${report.devDependenciesCount} dev)`);
        console.log(`  Native Compilation Units: ${chalk.cyan.bold(report.nativeCompilationUnitsCount)} (${chalk.yellow.bold((report.nativeExposureRatio * 100).toFixed(1) + '%')} Native Exposure)`);
        console.log(`  Pure JS Dependencies:     ${chalk.bold(report.pureJsDependenciesCount)}`);
        console.log(`  New Architecture Ready:   ${chalk.green.bold(report.newArchReadyCount + ' / ' + report.nativeCompilationUnitsCount)} (${report.newArchReadyPercentage}%)`);
        console.log(`  Legacy Bridge Hazards:    ${report.legacyBridgeHazardsCount > 0 ? chalk.red.bold(`${report.legacyBridgeHazardsCount} HAZARDS DETECTED`) : chalk.green.bold('0 (Clean)')}`);
        console.log('');

        console.log(chalk.bold('TOP HIGH-LEVERAGE NATIVE PACKAGES:'));
        for (const p of report.topLeveragePackages) {
          const typeBadge =
            p.moduleType === 'NITRO_MODULE'
              ? chalk.bgMagenta.black.bold(' NITRO ')
              : p.moduleType === 'TURBOMODULE'
                ? chalk.bgCyan.black.bold(' TURBO ')
                : p.moduleType === 'EXPO_MODULE'
                  ? chalk.bgBlue.black.bold(' EXPO ')
                  : chalk.bgYellow.black.bold(' BRIDGE ');
          const scoreStr = chalk.green.bold(`${p.leverageScore}/100`);
          console.log(`  ${typeBadge} ${chalk.bold(p.packageName.padEnd(35))} ${chalk.dim('v' + p.version)}  Leverage: ${scoreStr}`);
        }
        console.log('');

        if (report.hazardPackages.length > 0) {
          console.log(chalk.red.bold('🚨 NATIVE ARCHITECTURE HAZARDS:'));
          for (const h of report.hazardPackages) {
            const badge = h.hazardLevel === 'CRITICAL' ? chalk.bgRed.white.bold(' CRITICAL ') : chalk.bgYellow.black.bold(' WARNING ');
            console.log(`  ${badge} ${chalk.bold(h.packageName)} (${chalk.cyan(h.version)}) [${h.moduleType}]`);
            console.log(`     ${chalk.yellow(h.hazardReason || 'Architectural mismatch')}`);
            console.log('');
          }
        } else {
          consola.success('All native compilation units conform to New Architecture standards!');
        }
      } catch (e: any) {
        consola.error('Failed to run Native Surface Audit:', e.message);
      }
    });

  cli
    .command('audit:seams [targetPath]', 'Audit cross-package integrative seams: worklet thread leakage, lifecycle races, gesture deadlocks')
    .action((targetPath = '.') => {
      try {
        const resolved = path.resolve(targetPath);
        const pipeline = new SovereignScannerPipeline();
        const seamsEngine = new IntegrativeSeamsEngine();

        console.log(`\n${chalk.bold.underline('⚡  RN-TERRAIN INTEGRATIVE SEAMS & CROSS-THREAD AUDITOR')}`);
        console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));
        console.log(`  Target Path:         ${chalk.cyan.bold(resolved)}`);

        // Seam candidate pattern: screen source code before AST parsing
        const seamCandidatePattern =
          'worklet|\\.onUpdate|\\.onStart|\\.onEnd|useAnimatedStyle|useDerivedValue|useAnimatedReaction|useFrameCallback|exiting=|entering=|Gesture\\.|GestureDetector|\\.getString|\\.getNumber|\\.getBoolean|\\.executeSync|NitroModules';

        const execution = pipeline.execute(
          resolved,
          {
            candidatePattern: seamCandidatePattern,
          },
          (filePath, content) => seamsEngine.diagnoseSource(content, filePath)
        );

        console.log(`  Engine:              ${chalk.green.bold(execution.complexity.engine)}`);
        console.log(`  Source Files Found:  ${chalk.bold(execution.complexity.filesDiscovered)} files`);
        console.log(`  Candidate Sieve:     ${chalk.bold(execution.complexity.filesMatched)} files matching interaction patterns`);
        console.log(`  Task Complexity:     ${chalk.magenta.bold(`${execution.complexity.complexityWeight} pts`)} (${(execution.complexity.totalBytesScanned / 1024).toFixed(1)} KB scanned)`);
        console.log(`  Latency:             Total: ${chalk.bold(`${execution.complexity.latency.totalMs}ms`)} (fd: ${execution.complexity.latency.discoveryMs}ms, rg: ${execution.complexity.latency.preFilterMs}ms, AST: ${execution.complexity.latency.analysisMs}ms)`);
        console.log(`  Throughput:          ${chalk.cyan.bold(`${execution.complexity.throughputFilesPerSec} files/sec`)}`);
        console.log('');

        let totalViolations = 0;
        let totalErrors = 0;
        let totalWarnings = 0;

        for (const report of execution.results) {
          if (report.hasViolations) {
            totalViolations += report.totalFindings;
            totalErrors += report.errorsCount;
            totalWarnings += report.warningsCount;

            const relPath = path.relative(process.cwd(), report.filePath);
            console.log(`\n📄 ${chalk.bold.underline(relPath)}:`);
            for (const f of report.findings) {
              const badge = f.severity === 'error' ? chalk.bgRed.white.bold(' CRITICAL SEAM ') : chalk.bgYellow.black.bold(' WARNING ');
              console.log(`  ${badge} Line ${f.line}:${f.column} [${chalk.magenta(f.seamType)}]`);
              console.log(`     ${chalk.bold(f.title)}`);
              console.log(`     ${chalk.yellow(f.message)}`);
              console.log(`     ${chalk.green('Fix:')} ${f.remediationAdvice}`);
            }
          }
        }

        console.log('\n' + chalk.dim('─────────────────────────────────────────────────────────────────'));
        if (totalViolations === 0) {
          consola.success('All integrative seams verified! Zero cross-thread or lifecycle race conditions detected.');
        } else {
          console.log(`  Audit Result: ${chalk.red.bold(`${totalErrors} errors`)}, ${chalk.yellow.bold(`${totalWarnings} warnings`)} across ${execution.files.length} candidate files.`);
        }
      } catch (e: any) {
        consola.error('Failed to run Integrative Seams Audit:', e.message);
      }
    });

  cli
    .command('diff:flags <package> [fromVersion] [toVersion]', 'Sovereign N-1 declaration differ: extract severed APIs and migration recipes locally')
    .option('--sync', 'Persist extracted severed rules into local project .agents/rules/severed-rules.json', { default: false })
    .option('--cache-dir <dir>', 'Custom cache directory for downloaded .d.ts tarballs')
    .action(async (pkgName, fromVersion, toVersion, options) => {
      try {
        consola.info(`Diffing ${chalk.bold(pkgName)} declarations: ${chalk.cyan(fromVersion || 'auto')} → ${chalk.cyan(toVersion || 'installed')}`);
        const differ = new SovereignVersionDiffer();

        let resolvedFrom = fromVersion;
        if (!resolvedFrom) {
          try {
            const log = execSync('git log -p -n 5 -- package.json', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
            const match = new RegExp(`^[+-]\\s+"${pkgName}":\\s+"([^"]+)"`, 'm').exec(log);
            if (match && match[1]) {
              resolvedFrom = match[1].replace(/^[~^]/, '');
            }
          } catch {}
        }

        if (!resolvedFrom) {
          consola.error(`Could not determine prior version (N-1) for ${pkgName}. Please specify explicitly: rn-terrain diff:flags ${pkgName} <fromVersion> [toVersion]`);
          return;
        }

        const report = await differ.diffVersions({
          packageName: pkgName,
          fromVersion: resolvedFrom,
          toVersion: toVersion || 'installed',
          cacheDir: options.cacheDir,
        });

        console.log(`\n${chalk.bold.underline('📦 SOVEREIGN N-1 DECLARATION DIFF REPORT')}`);
        console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));
        console.log(`  Package: ${chalk.bold.cyan(report.packageName)}`);
        console.log(`  Version Transition: ${chalk.yellow(report.fromVersion)} (N-1) → ${chalk.green(report.toVersion)} (N)`);
        console.log(`  Sourced From: ${chalk.magenta(report.source)} (Decentralized Local Grounding)`);
        console.log(`  Severed APIs Count: ${chalk.red.bold(report.severedSymbolsCount)}`);
        console.log(`  Newly Deprecated Count: ${chalk.yellow.bold(report.newlyDeprecatedCount)}`);

        if (report.severedRules.length > 0) {
          console.log(`\n${chalk.red.bold('🚨 Severed Symbols (Deleted in N):')}`);
          for (const rule of report.severedRules) {
            console.log(`  • ${chalk.bold(rule.symbol)} (${rule.type})`);
            console.log(`    ${chalk.dim('Notice:')} ${rule.message}`);
            console.log(`    ${chalk.green('Remediation:')} ${rule.replacement}`);
          }
        }

        if (options.sync) {
          const savedPath = differ.syncRulesToProject(report.severedRules);
          consola.success(`Synchronized ${report.severedRules.length} severed rules to ${chalk.cyan(savedPath)}`);
        } else {
          console.log(chalk.dim('\nTip: Run with --sync to automatically save these rules into .agents/rules/severed-rules.json'));
        }
      } catch (e: any) {
        consola.error('Failed to diff package versions:', e.message);
      }
    });

  cli
    .command('align [projectDir]', 'Auto-detect recently updated packages (N-1 -> N) in git/manifest and synthesize local severed rules')
    .option('--sync', 'Persist extracted rules to .agents/rules/severed-rules.json', { default: true })
    .action(async (projectDir = '.', options) => {
      try {
        const targetDir = path.resolve(projectDir);
        const pkgPath = path.join(targetDir, 'package.json');
        if (!fs.existsSync(pkgPath)) {
          consola.error(`No package.json found at ${targetDir}`);
          return;
        }

        const pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
        consola.info(`Inspecting dependency alignment in ${chalk.cyan(targetDir)}...`);
        const differ = new SovereignVersionDiffer(targetDir);

        const bumpedPackages: Array<{ name: string; from: string; to: string }> = [];
        try {
          const log = execSync('git log -p -n 10 -- package.json', { cwd: targetDir, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
          const depRegex = /^[+-]\s+"([\w@][^"]+)":\s+"([^"]+)"/gm;
          const seenChanges = new Map<string, { from?: string; to?: string }>();
          let match;
          while ((match = depRegex.exec(log)) !== null) {
            const name = match[1];
            const rawVer = match[2];
            if (!name || !rawVer) continue;
            const ver = rawVer.replace(/^[~^]/, '');
            if (!seenChanges.has(name)) seenChanges.set(name, {});
            const entry = seenChanges.get(name)!;
            if (match[0].startsWith('+') && !entry.to) entry.to = ver;
            if (match[0].startsWith('-') && !entry.from) entry.from = ver;
          }
          for (const [name, entry] of seenChanges.entries()) {
            if (entry.from && entry.to && entry.from !== entry.to) {
              // Check if major or minor bumped (breaking or significant API change)
              const fromParts = entry.from.split('.');
              const toParts = entry.to.split('.');
              const isSignificant = fromParts[0] !== toParts[0] || fromParts[1] !== toParts[1];

              // Prioritize React Native runtime packages
              const isRnPackage =
                name.includes('react-native') ||
                name.startsWith('@react-native') ||
                name.includes('expo') ||
                name.startsWith('@expo') ||
                name.startsWith('@shopify') ||
                name.startsWith('@legendapp') ||
                name.includes('reanimated') ||
                name.includes('gesture-handler') ||
                name.includes('powersync') ||
                name.includes('nitro') ||
                Boolean(pkgJson.dependencies?.[name]);

              if (isSignificant && isRnPackage) {
                bumpedPackages.push({ name, from: entry.from, to: entry.to });
              }
            }
          }
        } catch {}

        if (bumpedPackages.length === 0) {
          consola.info('No significant (major/minor) version bumps detected in package.json.');
        } else {
          consola.info(`Detected ${bumpedPackages.length} high-leverage bumped package(s) requiring alignment:`);
          for (const b of bumpedPackages.slice(0, 10)) {
            console.log(`  • ${chalk.bold(b.name)}: ${chalk.yellow(b.from)} → ${chalk.green(b.to)}`);
          }
          if (bumpedPackages.length > 10) {
            console.log(chalk.dim(`  ... and ${bumpedPackages.length - 10} more`));
          }
        }

        let totalSeveredExtracted = 0;
        // Process top high-priority packages
        for (const b of bumpedPackages.slice(0, 10)) {
          try {
            const report = await differ.diffVersions({
              packageName: b.name,
              fromVersion: b.from,
              toVersion: b.to,
              projectRoot: targetDir,
            });
            totalSeveredExtracted += report.severedRules.length;
            if (options.sync && report.severedRules.length > 0) {
              differ.syncRulesToProject(report.severedRules, targetDir);
            }
          } catch {}
        }

        consola.success(`Alignment complete! Extracted and armed ${totalSeveredExtracted} severed rules.`);
      } catch (e: any) {
        consola.error('Failed to run alignment:', e.message);
      }
    });

  cli
    .command('lint [targetPath]', 'Unified React Native project linter: enforce severed APIs, cross-package interaction seams, and Fabric alignment')
    .option('--format <format>', 'Output format: terminal, json, eslint', { default: 'terminal' })
    .option('--staged', 'Lint only git-staged files (sub-50ms pre-commit gate)', { default: false })
    .action((targetPath = '.', options) => {
      try {
        const resolved = path.resolve(targetPath);
        const linter = new RnTerrainLinter({ projectDir: resolved });
        const report = linter.lintProject(resolved, { stagedOnly: Boolean(options.staged) });

        if (options.format === 'json') {
          console.log(JSON.stringify(report, null, 2));
        } else if (options.staged && report.filesScanned === 0) {
          console.log(`\n${chalk.bold('🛡️  RN-TERRAIN STAGED PRE-COMMIT GATE')}`);
          console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));
          console.log(`  Target:           ${chalk.cyan(resolved)}`);
          console.log(`  ${chalk.green('✔')} No staged TypeScript/JavaScript files found.`);
          console.log(chalk.dim(`  Verification completed in ${report.durationMs}ms.\n`));
        } else {
          console.log(RnTerrainLinter.formatTerminalReport(report));
        }

        if (report.errorsCount > 0) {
          process.exitCode = 1;
        }
      } catch (e: any) {
        consola.error('Linter failed:', e.message);
        process.exitCode = 1;
      }
    });

  cli
    .command('lint:rules [format]', 'Export or inspect active RN-Terrain rules for ESLint, Oxlint, or IDE configs')
    .action(() => {
      console.log(`\n${chalk.bold.underline('🛡️  RN-TERRAIN ESLINT / LINT RULES INTEGRATION')}`);
      console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));
      console.log(`To use RN-Terrain rules in your ESLint flat config (eslint.config.js):\n`);
      console.log(chalk.cyan(`import { RnTerrainLinter } from '@intuitui-labs/rn-terrain-scanner';

export default [
  {
    plugins: {
      'rn-terrain': {
        rules: {
          'all': RnTerrainLinter.createEslintRule(),
        },
      },
    },
    rules: {
      'rn-terrain/all': 'error',
    },
  },
];`));
      console.log(`\n${chalk.dim('Or run the standalone zero-config CLI linter anytime:')} ${chalk.green('npx rn-terrain lint')}`);
    });

  cli
    .command('audit:nitro [projectDir]', 'Nitro Modules & C++ Native Architecture Auditor: Audit HybridObjects, specs, CMakeLists, and NDK')
    .option('--snippet <code>', 'Audit an isolated code snippet for Nitro worklet thread affinity hazards')
    .action((projectDir = '.', options: any = {}) => {
      try {
        const resolved = path.resolve(projectDir);
        const auditor = new NitroAuditor(resolved);

        if (options.snippet) {
          const findings = auditor.verifyCodeSnippet(options.snippet);
          console.log(`\n${chalk.bold.underline('⚡  NITRO MODULE SNIPPET AUDIT')}`);
          console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));
          if (findings.length === 0) {
            consola.success('Clean! Zero Nitro thread affinity hazards or NativeModules anti-patterns detected.');
          } else {
            for (const f of findings) {
              const badge = f.severity === 'error' ? chalk.red.bold('❌ ERROR') : chalk.yellow.bold('⚠️  WARN');
              console.log(`  ${badge} [${chalk.magenta(f.ruleId)}]: ${f.message}`);
              console.log(`     ${chalk.green('Remediation:')} ${f.remediation}\n`);
            }
          }
          return;
        }

        const report = auditor.audit();
        console.log(`\n${chalk.bold.underline('⚡  RN-TERRAIN NITRO MODULES & C++ AUDITOR')}`);
        console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));
        console.log(`  Target Project:       ${chalk.cyan.bold(resolved)}`);
        console.log(`  Nitro Dependency:     ${report.hasNitroDependency ? chalk.green.bold(`Yes (${report.nitroVersion ?? 'detected'})`) : chalk.dim('No')}`);
        console.log(`  Nitrogen Codegen:     ${report.nitrogenInstalled ? chalk.green('Configured') : chalk.yellow('Not found')}`);
        console.log(`  HybridObjects Found:  ${chalk.bold(report.hybridObjects.length)}`);
        for (const ho of report.hybridObjects) {
          console.log(`    • ${chalk.bold.cyan(ho.name)} (${chalk.dim(ho.specPath)}) - ${ho.methods.length} methods`);
        }
        console.log(`  CMake C++20 Status:   ${report.cmakeStatus.found ? chalk.green(`Found (std: ${report.cmakeStatus.cxxStandard ?? 'default'})`) : chalk.dim('No CMakeLists')}`);
        console.log(`  Android NDK Prefab:   ${report.ndkStatus.isCompatible ? chalk.green('Compatible (NDK 26+)') : chalk.red(`Hazard (${report.ndkStatus.ndkVersion})`)}`);
        console.log('');

        if (report.violations.length === 0) {
          consola.success('All Nitro Module invariants, CMakeLists, and Nitrogen specs conform to standards!');
        } else {
          console.log(chalk.bold('VIOLATIONS:'));
          for (const v of report.violations) {
            const badge = v.severity === 'error' ? chalk.red.bold('❌ [ERROR]') : chalk.yellow.bold('⚠️  [WARN]');
            console.log(`  ${badge} [${chalk.magenta(v.ruleId)}] ${v.message}`);
            console.log(`     ${chalk.green('Remediation:')} ${v.remediation}\n`);
          }
          if (report.violations.some((v) => v.severity === 'error')) {
            process.exitCode = 1;
          }
        }
      } catch (e: any) {
        consola.error('Failed to run Nitro audit:', e.message);
        process.exitCode = 1;
      }
    });

  cli
    .command('verify:yoga [targetPath]', 'Headless Yoga C++ Virtual Layout Prover: Verify JSX layout invariants before disk write')
    .option('--snippet <code>', 'Proposed JSX code snippet to verify')
    .action((targetPath?: string, options: any = {}) => {
      try {
        let code = options.snippet;
        let file = targetPath ?? 'VirtualComponent.tsx';
        if (!code && targetPath && fs.existsSync(targetPath)) {
          code = fs.readFileSync(targetPath, 'utf8');
        } else if (!code && !process.stdin.isTTY) {
          code = fs.readFileSync(0, 'utf8');
        }

        if (!code) {
          consola.error('No code provided. Pass a file path, --snippet "<code>", or pipe through stdin.');
          process.exitCode = 1;
          return;
        }

        const prover = new YogaLayoutProver();
        const report = prover.diagnoseLayout(code, file);

        console.log(`\n${chalk.bold.underline('📐  YOGA HEADLESS VIRTUAL LAYOUT PROVER')}`);
        console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));
        console.log(`  Target:       ${chalk.cyan(file)}`);
        console.log(`  Layout Valid: ${report.valid ? chalk.green.bold('YES (Invariants Satisfied)') : chalk.red.bold('FAILED (Visual Trap Detected)')}`);
        console.log('');

        if (report.violations.length === 0) {
          consola.success('Zero 0px height ScrollView collapses or clipped coordinate bounds detected!');
        } else {
          for (const v of report.violations) {
            const badge = v.severity === 'error' ? chalk.red.bold('❌ ERROR') : chalk.yellow.bold('⚠️  WARN');
            console.log(`  ${badge} Line ${v.line ?? '?'}: [${chalk.bold(v.component)}] ${v.message}`);
            console.log(`     ${chalk.green('Fix:')} ${v.remediation}\n`);
          }
          if (!report.valid) {
            process.exitCode = 1;
          }
        }
      } catch (e: any) {
        consola.error('Yoga layout verification failed:', e.message);
        process.exitCode = 1;
      }
    });

  cli
    .command('verify:hermes [targetPath]', 'Headless Hermes Bytecode Compiler Proof Gate: Run sub-10ms in-memory hermesc verification')
    .option('--snippet <code>', 'Code snippet to compile to Hermes bytecode')
    .action((targetPath?: string, options: any = {}) => {
      try {
        let code = options.snippet;
        let file = targetPath ?? 'VirtualComponent.js';
        if (!code && targetPath && fs.existsSync(targetPath)) {
          code = fs.readFileSync(targetPath, 'utf8');
        } else if (!code && !process.stdin.isTTY) {
          code = fs.readFileSync(0, 'utf8');
        }

        if (!code) {
          consola.error('No code provided. Pass a file path, --snippet "<code>", or pipe through stdin.');
          process.exitCode = 1;
          return;
        }

        const verifier = new HermesBytecodeVerifier();
        const res = verifier.verifyCode(code, file);

        console.log(`\n${chalk.bold.underline('⚡  HERMES IN-MEMORY BYTECODE PROOF GATE')}`);
        console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));
        console.log(`  Target:      ${chalk.cyan(file)}`);
        console.log(`  Engine:      ${res.engineUsed === 'native_hermesc' ? chalk.green('Native hermesc') : chalk.yellow('Sovereign Fallback')}`);
        console.log(`  Result:      ${res.valid ? chalk.green.bold('VALID (Hermes HBC Ready)') : chalk.red.bold('INVALID (Syntax/Runtime Trap)')}`);
        if (res.bytecodeSizeBytes) {
          console.log(`  HBC Size:    ${chalk.bold(res.bytecodeSizeBytes)} bytes`);
        }
        console.log('');

        if (res.valid) {
          consola.success('Code compiles to Hermes Bytecode without strict-mode or closure capture errors!');
        } else {
          console.error(`  ${chalk.red.bold('Error:')} Line ${res.line ?? '?'}:${res.column ?? '?'} - ${res.error}`);
          if (res.tasteNudge) {
            console.log(`  ${chalk.green('Nudge:')} ${res.tasteNudge}`);
          }
          process.exitCode = 1;
        }
      } catch (e: any) {
        consola.error('Hermes verification failed:', e.message);
        process.exitCode = 1;
      }
    });

  cli
    .command('audit:honeypot [targetPath]', 'Parametric Hallucination Honeypot Engine: Scan code for imaginary/confabulated APIs')
    .alias('honeypot')
    .option('--snippet <code>', 'Code snippet to scan for trapdoor symbols')
    .option('--generate-dts', 'Generate ambient TypeScript definitions (.terrain/honeypots.d.ts)', { default: false })
    .action((targetPath?: string, options: any = {}) => {
      try {
        const engine = new HoneypotEngine();

        if (options.generateDts) {
          const writtenPath = engine.writeHoneypotDefinitions(path.join(process.cwd(), '.terrain'));
          consola.success(`Generated ambient compile-time trapdoors at ${chalk.cyan(writtenPath)}`);
          return;
        }

        let code = options.snippet;
        let file = targetPath ?? 'VirtualComponent.tsx';
        if (!code && targetPath && fs.existsSync(targetPath)) {
          code = fs.readFileSync(targetPath, 'utf8');
        } else if (!code && !process.stdin.isTTY) {
          code = fs.readFileSync(0, 'utf8');
        }

        if (!code) {
          consola.error('No code provided. Pass a file path, --snippet "<code>", or run with --generate-dts.');
          process.exitCode = 1;
          return;
        }

        const report = engine.detectHoneypots(code, file);
        console.log(`\n${chalk.bold.underline('🍯  PARAMETRIC HALLUCINATION HONEYPOT ENGINE')}`);
        console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));
        console.log(`  Target:               ${chalk.cyan(file)}`);
        console.log(`  Trapdoor Triggered:   ${report.hasTrapdoorTriggered ? chalk.red.bold('YES (Confabulated API Detected!)') : chalk.green.bold('NO (Clean)')}`);
        console.log('');

        if (!report.hasTrapdoorTriggered) {
          consola.success('Clean! Zero hallucinated / imaginary APIs found.');
        } else {
          for (const v of report.violations) {
            console.log(`  ${chalk.red.bold('🚨 TRAPDOOR')}: ${chalk.bold(v.symbol)} in package ${chalk.cyan(v.package)} (Line ${v.line})`);
            console.log(`     ${chalk.yellow('Reason:')}      ${v.message}`);
            console.log(`     ${chalk.green('Remediation:')} ${v.canonicalRemediation}\n`);
          }
          process.exitCode = 1;
        }
      } catch (e: any) {
        consola.error('Honeypot scan failed:', e.message);
        process.exitCode = 1;
      }
    });
}
