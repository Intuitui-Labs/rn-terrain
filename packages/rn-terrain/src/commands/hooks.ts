import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import type { CAC } from 'cac';
import chalk from 'chalk';
import { consola } from 'consola';
import { BitemporalGate } from '@intuitui-labs/rn-terrain-core';
import { AgentGuardrail, HoneypotEngine, RnTerrainLinter } from '@intuitui-labs/rn-terrain-scanner';

export function registerHookCommands(cli: CAC) {
  cli
    .command('hooks:install [targetDir]', 'Install ultra-fast RN-Terrain pre-commit and pre-push Git hooks')
    .option('--husky', 'Install to .husky directory instead of .git/hooks')
    .option('--force', 'Overwrite existing pre-commit hook')
    .action((targetDir = '.', options: any = {}) => {
      try {
        const root = path.resolve(targetDir);
        const gitDir = path.join(root, '.git');
        const huskyDir = path.join(root, '.husky');

        if (!fs.existsSync(gitDir) && !options.husky) {
          consola.error(`No .git repository found at ${root}. Run git init first or specify valid path.`);
          process.exitCode = 1;
          return;
        }

        const hookScript = `#!/usr/bin/env sh
# RN-Terrain Sovereign Zero-Hallucination Pre-Commit Gate (<20ms)
npx --no-install rn-terrain hooks:pre-commit
`;

        if (options.husky || fs.existsSync(huskyDir)) {
          fs.mkdirSync(huskyDir, { recursive: true });
          const huskyHookPath = path.join(huskyDir, 'pre-commit');
          if (!fs.existsSync(huskyHookPath) || options.force) {
            fs.writeFileSync(huskyHookPath, hookScript, { encoding: 'utf8', mode: 0o755 });
            consola.success(`Installed Husky pre-commit hook: ${chalk.cyan(huskyHookPath)}`);
          } else {
            consola.warn(`Husky pre-commit already exists at ${huskyHookPath}. Use --force to overwrite.`);
          }
        } else {
          const hooksDir = path.join(gitDir, 'hooks');
          fs.mkdirSync(hooksDir, { recursive: true });
          const preCommitPath = path.join(hooksDir, 'pre-commit');
          if (!fs.existsSync(preCommitPath) || options.force) {
            fs.writeFileSync(preCommitPath, hookScript, { encoding: 'utf8', mode: 0o755 });
            consola.success(`Installed native Git pre-commit hook: ${chalk.cyan(preCommitPath)}`);
          } else {
            consola.warn(`Git pre-commit already exists at ${preCommitPath}. Use --force to overwrite.`);
          }
        }
      } catch (e: any) {
        consola.error('Failed to install Git hooks:', e.message);
        process.exitCode = 1;
      }
    });

  cli
    .command('hooks:pre-commit', 'Execute high-speed (<20ms) staged git pre-commit verification against bitemporal gate')
    .option('--cwd <dir>', 'Repository root directory', { default: '.' })
    .action((options: any = {}) => {
      const startTime = performance.now();
      const cwd = path.resolve(options.cwd);

      try {
        // 1. Get staged files
        const stagedRaw = execSync('git diff --cached --name-only --diff-filter=ACM', {
          cwd,
          encoding: 'utf8',
          stdio: ['pipe', 'pipe', 'ignore'],
        }).trim();

        if (!stagedRaw) {
          // No files staged
          return;
        }

        const stagedFiles = stagedRaw.split(/\r?\n/).map((f) => f.trim()).filter(Boolean);
        const bitemporalGate = new BitemporalGate();
        const guardrail = new AgentGuardrail();
        const linter = new RnTerrainLinter({ projectDir: cwd });

        let rejected = false;
        const violations: Array<{ file: string; message: string; remediation?: string }> = [];

        // 2. Check staged package.json dependencies
        const packageJsonFile = stagedFiles.find((f) => f === 'package.json' || f.endsWith('/package.json'));
        if (packageJsonFile) {
          try {
            const stagedPkgContent = execSync(`git show :${packageJsonFile}`, {
              cwd,
              encoding: 'utf8',
              stdio: ['pipe', 'pipe', 'ignore'],
            });
            const stagedPkg = JSON.parse(stagedPkgContent);
            const allDeps = {
              ...stagedPkg.dependencies,
              ...stagedPkg.devDependencies,
            };

            for (const [pkgName, version] of Object.entries(allDeps)) {
              if (typeof version === 'string') {
                const check = bitemporalGate.checkPackage({
                  asked: pkgName,
                  action: 'check',
                  requestedVersion: version.replace(/^[~^]/, ''),
                  dryRun: true,
                  caller: 'git-pre-commit',
                });

                if (check.data.refused_invented === 1) {
                  rejected = true;
                  violations.push({
                    file: packageJsonFile,
                    message: `Invented/hallucinated version for '${pkgName}': '${version}'. Not found in canonical registry.`,
                    remediation: check.data.resolved_target ? `Use verified version ${check.data.resolved_target}` : 'Verify package version on npm.',
                  });
                }
              }
            }
          } catch {}
        }

        // 3. Check staged code files (.ts, .tsx, .js, .jsx)
        const codeFiles = stagedFiles.filter((f) => /\.(tsx|jsx|ts|js)$/i.test(f));
        for (const file of codeFiles) {
          try {
            const stagedCode = execSync(`git show :${file}`, {
              cwd,
              encoding: 'utf8',
              stdio: ['pipe', 'pipe', 'ignore'],
            });

            // Fast PreWrite check
            const pwResult = bitemporalGate.preWrite({
              codeSnippet: stagedCode,
              filePath: file,
              dryRun: true,
              caller: 'git-pre-commit',
            });

            if (pwResult.data.decision === 'refuse') {
              for (const imp of pwResult.data.imports) {
                if (imp.decision === 'refuse') {
                  rejected = true;
                  for (const r of imp.reasons) {
                    violations.push({
                      file,
                      message: `Severed API import in '${imp.specifier}': ${r.text}`,
                      remediation: r.refutation,
                    });
                  }
                }
              }
            }

            // AgentGuardrail evaluation
            const guardResult = guardrail.verify({
              packageName: 'workspace',
              targetVersion: 'latest',
              codeSnippet: stagedCode,
              filePath: file,
            });
            if (!guardResult.allowed) {
              rejected = true;
              for (const v of guardResult.severedViolations) {
                violations.push({
                  file,
                  message: `Guardrail violation: ${v.message} (${v.symbol})`,
                  remediation: v.replacement,
                });
              }
            }

            // Parametric Honeypot Hallucination check
            const honeypot = new HoneypotEngine();
            const hpResult = honeypot.detectHoneypots(stagedCode, file);
            if (hpResult.hasTrapdoorTriggered) {
              rejected = true;
              for (const v of hpResult.violations) {
                violations.push({
                  file,
                  message: `Hallucinated API detected [${v.package}]: ${v.symbol} - ${v.message}`,
                  remediation: v.canonicalRemediation,
                });
              }
            }

            // 4. Unified RnTerrainLinter (Integrative Seams & Severed APIs)
            const lintFindings = linter.lintSource(stagedCode, file);
            for (const f of lintFindings) {
              if (f.severity === 'error') {
                rejected = true;
                violations.push({
                  file,
                  message: `${f.category}: ${f.message}`,
                  remediation: f.remediationAdvice,
                });
              }
            }
          } catch {}
        }

        const elapsed = (performance.now() - startTime).toFixed(1);

        if (rejected) {
          console.error(`\n${chalk.bgRed.white.bold(' 🛑 RN-TERRAIN PRE-COMMIT GATE REJECTION ')} (${elapsed}ms)`);
          console.error(chalk.dim('─────────────────────────────────────────────────────────────────'));
          for (const v of violations) {
            console.error(`  ${chalk.red.bold('•')} ${chalk.cyan(v.file)}: ${chalk.yellow(v.message)}`);
            if (v.remediation) {
              console.error(`    ${chalk.green('Fix:')} ${v.remediation}`);
            }
          }
          console.error(chalk.dim('─────────────────────────────────────────────────────────────────'));
          console.error(chalk.red.bold('Commit aborted to protect repository from severed APIs or model drift.\n'));
          process.exit(1);
        }

        // Silent on success unless in debug mode, maintaining <20ms terminal speed
        if (process.env.DEBUG || process.env.RN_TERRAIN_VERBOSE) {
          consola.success(`RN-Terrain pre-commit check passed (${elapsed}ms across ${stagedFiles.length} files).`);
        }
      } catch (e: any) {
        // If git is not installed or repo is empty, do not block commits unnecessarily
        if (process.env.DEBUG) {
          consola.warn('Pre-commit gate skipped:', e.message);
        }
      }
    });

  cli
    .command('hooks:pre-push', 'Execute branch readiness check prior to git push')
    .action(() => {
      try {
        consola.info('Running RN-Terrain pre-push safety scan...');
        const gate = new BitemporalGate();
        const res = gate.checkPackage({
          asked: 'react-native-reanimated',
          action: 'check',
          dryRun: true,
        });
        if (res.data.decision === 'refuse') {
          consola.error('Pre-push check failed: Reanimated invariant violated.');
          process.exit(1);
        }
        consola.success('Pre-push gate passed!');
      } catch (e: any) {
        consola.error('Pre-push failed:', e.message);
        process.exit(1);
      }
    });
}
