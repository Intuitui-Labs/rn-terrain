/**
 * @file rn-terrain-linter.ts
 * Unified Real-Time Linter & ESLint Rule Provider for React Native.
 *
 * Integrates:
 * 1. Severed API Rule Enforcement (both canonical & locally extracted N-1 diffs)
 * 2. Cross-Package Integrative Seams (Worklet thread escapes, PanGesture deadlocks, Unmount races, Sync JSI)
 * 3. New Architecture (Fabric/TurboModule vs Paper) compilation alignments
 *
 * Can be executed via CLI (`rn-terrain lint`), VS Code LSP, or plugged directly into ESLint!
 */

import fs from 'node:fs';
import path from 'node:path';
import child_process from 'node:child_process';
const c = {
  red: (s: string) => `\x1b[31m${s}\x1b[0m`,
  green: (s: string) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s: string) => `\x1b[33m${s}\x1b[0m`,
  cyan: (s: string) => `\x1b[36m${s}\x1b[0m`,
  dim: (s: string) => `\x1b[2m${s}\x1b[0m`,
  gray: (s: string) => `\x1b[90m${s}\x1b[0m`,
  bold: (s: string) => `\x1b[1m${s}\x1b[0m`,
  underline: (s: string) => `\x1b[4m${s}\x1b[0m`,
};
import { TcdiStackDoctor, type TcdiDoctorFinding, type TargetStackConfig } from './tcdi-doctor.js';
import { IntegrativeSeamsEngine, type IntegrativeSeamFinding } from './integrative-seams-engine.js';
import { TcdiDependencyDoctor } from './dependency-doctor.js';
import { NativeSurfaceProfiler } from './native-surface-profiler.js';
import type { SeveredRule } from './rules/canonical-severed-rules.js';

export interface SubstrateAuditSummary {
  packageJsonFound: boolean;
  projectRoot: string;
  totalDependencies: number;
  nativeCompilationUnits: number;
  nativeExposureRatio: number;
  newArchReadyPercentage: number;
  legacyBridgeHazards: number;
  sacredPinViolations: number;
  floatingNativeCarets: number;
  hazardPackages: Array<{ packageName: string; version: string; moduleType: string; reason: string }>;
}

export interface TaskComplexityProfile {
  tier: 'LIGHT' | 'MODERATE' | 'HEAVY' | 'TITANIC';
  score: number; // 0 - 100
  weightLabel: string;
  metrics: {
    totalFiles: number;
    totalDependencies: number;
    nativeCompilationUnits: number;
    nativeExposureRatio: number;
    architectureTarget: string;
  };
  rationale: string[];
}

export interface ScanTelemetry {
  totalDurationMs: number;
  discoveryTool: 'fd (Rust)' | 'node-fs (Fallback)' | 'git-staged (Sovereign Pre-Commit)';
  phases: {
    discoveryMs: number;
    astTraversalMs: number;
    substrateAuditMs: number;
  };
  throughput: {
    filesPerSec: number;
    bytesProcessed: number;
    megabytesPerSec: number;
  };
  memory: {
    heapUsedMb: number;
    heapTotalMb: number;
    rssMb: number;
  };
  complexity: TaskComplexityProfile;
}

export interface RnTerrainLintFinding {
  ruleId: string;
  category: string;
  severity: 'error' | 'warn';
  filePath: string;
  line: number;
  column: number;
  message: string;
  matchedText: string;
  remediationAdvice: string;
  temporalNote?: string;
  autoFixSnippet?: string;
}

export interface RnTerrainLintReport {
  projectDir: string;
  filesScanned: number;
  filesWithIssues: number;
  totalFindings: number;
  errorsCount: number;
  warningsCount: number;
  findings: RnTerrainLintFinding[];
  durationMs: number;
  healthScore: number;
  substrate?: SubstrateAuditSummary;
  telemetry?: ScanTelemetry;
}

export interface RnTerrainLintOptions {
  projectDir?: string;
  targetStack?: TargetStackConfig;
  includeCanonicalRules?: boolean;
  customRules?: SeveredRule[];
  ignorePatterns?: string[];
}

export class RnTerrainLinter {
  private doctor: TcdiStackDoctor;
  private seamsEngine: IntegrativeSeamsEngine;

  constructor(private readonly options: RnTerrainLintOptions = {}) {
    this.doctor = new TcdiStackDoctor({
      targetStack: options.targetStack,
      includeCanonicalRules: options.includeCanonicalRules ?? true,
      customRules: options.customRules ?? [],
      ignorePatterns: options.ignorePatterns,
    });

    if (options.projectDir) {
      this.doctor.loadProjectRules(options.projectDir);
    }

    this.seamsEngine = new IntegrativeSeamsEngine();
  }

  /**
   * Lints a single file in memory.
   */
  public lintSource(sourceCode: string, filePath: string): RnTerrainLintFinding[] {
    const findings: RnTerrainLintFinding[] = [];

    // 1. TCDI Stack Doctor (Severed APIs + Fabric / Paper Checks)
    const doctorReport = this.doctor.diagnoseSnippet(sourceCode, filePath);
    for (const f of doctorReport.findings) {
      findings.push({
        ruleId: f.ruleId,
        category: f.category,
        severity: f.severity === 'error' ? 'error' : 'warn',
        filePath: f.filePath,
        line: f.line,
        column: f.column,
        message: f.message,
        matchedText: f.matchedText,
        remediationAdvice: f.remediationAdvice,
        temporalNote: f.temporalNote,
      });
    }

    // 2. Integrative Cross-Package Seams Engine
    const seamsReport = this.seamsEngine.diagnoseSource(sourceCode, filePath);
    for (const s of seamsReport.findings) {
      findings.push({
        ruleId: s.ruleId,
        category: s.seamType,
        severity: s.severity === 'error' ? 'error' : 'warn',
        filePath: s.filePath,
        line: s.line,
        column: s.column,
        message: s.message,
        matchedText: s.matchedText,
        remediationAdvice: s.remediationAdvice,
        autoFixSnippet: s.autoFixSnippet,
      });
    }

    // Sort findings by line and column
    return findings.sort((a, b) => a.line - b.line || a.column - b.column);
  }

  /**
   * Lints an entire project or directory.
   */
  public lintProject(
    targetPath: string = process.cwd(),
    lintOptions?: { stagedOnly?: boolean; files?: string[] }
  ): RnTerrainLintReport {
    const startTime = performance.now();
    const resolvedPath = path.resolve(targetPath);
    const filesToScan: string[] = [];

    const tDiscoveryStart = performance.now();
    let discoveryTool: 'fd (Rust)' | 'node-fs (Fallback)' | 'git-staged (Sovereign Pre-Commit)' = 'node-fs (Fallback)';

    if (lintOptions?.files && lintOptions.files.length > 0) {
      filesToScan.push(...lintOptions.files.filter((f) => fs.existsSync(f)));
      discoveryTool = 'git-staged (Sovereign Pre-Commit)';
    } else if (lintOptions?.stagedOnly) {
      try {
        const gitOut = child_process.execFileSync(
          'git',
          ['diff', '--cached', '--name-only', '--diff-filter=ACMR'],
          { cwd: resolvedPath, encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'], timeout: 2000 }
        );
        const validExts = new Set(['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs']);
        const staged = gitOut
          .split(/\r?\n/)
          .map((l) => l.trim())
          .filter((l) => l.length > 0)
          .map((l) => path.resolve(resolvedPath, l))
          .filter((l) => validExts.has(path.extname(l).toLowerCase()) && fs.existsSync(l));
        filesToScan.push(...staged);
        discoveryTool = 'git-staged (Sovereign Pre-Commit)';
      } catch {
        // Fall back to scanning directory if git diff fails or directory is not a git repo
        const res = this.collectFiles(resolvedPath);
        filesToScan.push(...res.files);
        discoveryTool = res.tool;
      }
    } else if (fs.existsSync(resolvedPath)) {
      const stat = fs.statSync(resolvedPath);
      if (stat.isFile()) {
        filesToScan.push(resolvedPath);
      } else {
        const res = this.collectFiles(resolvedPath);
        filesToScan.push(...res.files);
        discoveryTool = res.tool;
      }
    }
    const discoveryMs = Math.round(performance.now() - tDiscoveryStart);

    const tAstStart = performance.now();
    const allFindings: RnTerrainLintFinding[] = [];
    const filesWithIssuesSet = new Set<string>();
    let totalBytesScanned = 0;

    for (const file of filesToScan) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        totalBytesScanned += Buffer.byteLength(content, 'utf8');
        const fileFindings = this.lintSource(content, file);
        if (fileFindings.length > 0) {
          filesWithIssuesSet.add(file);
          allFindings.push(...fileFindings);
        }
      } catch {}
    }
    const astTraversalMs = Math.round(performance.now() - tAstStart);

    const tSubstrateStart = performance.now();
    // Locate project root containing package.json (starting from resolvedPath)
    let projectRoot: string | null = null;
    let curr = resolvedPath;
    if (fs.existsSync(curr) && fs.statSync(curr).isFile()) {
      curr = path.dirname(curr);
    }
    while (curr && curr !== path.dirname(curr)) {
      if (fs.existsSync(path.join(curr, 'package.json'))) {
        projectRoot = curr;
        break;
      }
      curr = path.dirname(curr);
    }

    let substrate: SubstrateAuditSummary | undefined = undefined;
    if (projectRoot) {
      try {
        const pkgJsonPath = path.join(projectRoot, 'package.json');
        const depDoctor = new TcdiDependencyDoctor({ configPath: projectRoot });
        const depReport = depDoctor.auditManifest(pkgJsonPath);
        const profiler = new NativeSurfaceProfiler();
        const nativeReport = profiler.profileProject({ projectDir: projectRoot });

        const sacredPinViolations = depReport.issues.filter((i) => i.ruleType === 'SACRED_PIN_VIOLATION').length;
        const floatingNativeCarets = depReport.issues.filter((i) => i.ruleType === 'HAZARDOUS_FLOATING_RANGE').length;

        substrate = {
          packageJsonFound: true,
          projectRoot,
          totalDependencies: nativeReport.totalDependencies,
          nativeCompilationUnits: nativeReport.nativeCompilationUnitsCount,
          nativeExposureRatio: nativeReport.nativeExposureRatio,
          newArchReadyPercentage: nativeReport.newArchReadyPercentage,
          legacyBridgeHazards: nativeReport.legacyBridgeHazardsCount,
          sacredPinViolations,
          floatingNativeCarets,
          hazardPackages: nativeReport.hazardPackages.map((h) => ({
            packageName: h.packageName,
            version: h.version,
            moduleType: h.moduleType,
            reason: h.hazardReason || 'Legacy Paper Bridge without Fabric support',
          })),
        };
      } catch {}
    }
    const substrateAuditMs = Math.round(performance.now() - tSubstrateStart);
    const totalDurationMs = Math.round(performance.now() - startTime);

    const errorsCount = allFindings.filter((f) => f.severity === 'error').length;
    const warningsCount = allFindings.filter((f) => f.severity === 'warn').length;

    let healthScore = 100 - errorsCount * 12 - warningsCount * 3;
    if (substrate?.packageJsonFound) {
      // Direct C++/JNI binary ABI mismatch risks
      healthScore -= substrate.sacredPinViolations * 12;
      // Legacy paper bridge hazards on New Architecture
      healthScore -= substrate.legacyBridgeHazards * 4;
      // Floating carets on native compiled packages
      const floatingDeduction = Math.min(20, substrate.floatingNativeCarets * 1.5);
      healthScore -= floatingDeduction;
    }
    healthScore = Math.max(0, Math.min(100, Math.round(healthScore)));

    // Task Complexity & Weight Profiling
    const totalFiles = filesToScan.length;
    const totalDeps = substrate?.totalDependencies || 0;
    const nativeUnits = substrate?.nativeCompilationUnits || 0;
    const nativeExposure = substrate?.nativeExposureRatio || 0;
    const isNewArch = Boolean(substrate?.packageJsonFound);

    let complexityScore = 15;
    const rationale: string[] = [];

    if (totalFiles > 300) {
      complexityScore += 25;
      rationale.push(`Scale: ${totalFiles} source files`);
    } else if (totalFiles > 100) {
      complexityScore += 15;
      rationale.push(`Scale: ${totalFiles} source files`);
    }

    if (nativeUnits > 80) {
      complexityScore += 35;
      rationale.push(`Massive native substrate: ${nativeUnits} native units (${(nativeExposure * 100).toFixed(1)}% exposure)`);
    } else if (nativeUnits > 30) {
      complexityScore += 20;
      rationale.push(`Moderate native substrate: ${nativeUnits} native units`);
    }

    if (totalDeps > 150) {
      complexityScore += 15;
      rationale.push(`Deep dependency tree: ${totalDeps} packages`);
    }

    if (isNewArch) {
      complexityScore += 10;
      rationale.push(`Target stack: New Architecture (Fabric C++ constraints)`);
    }

    complexityScore = Math.min(100, complexityScore);
    const tier: TaskComplexityProfile['tier'] =
      complexityScore >= 80 ? 'TITANIC' : complexityScore >= 60 ? 'HEAVY' : complexityScore >= 35 ? 'MODERATE' : 'LIGHT';

    const mem = process.memoryUsage();
    const telemetry: ScanTelemetry = {
      totalDurationMs,
      discoveryTool,
      phases: {
        discoveryMs,
        astTraversalMs,
        substrateAuditMs,
      },
      throughput: {
        filesPerSec: Math.round((totalFiles / Math.max(0.001, totalDurationMs / 1000)) * 10) / 10,
        bytesProcessed: totalBytesScanned,
        megabytesPerSec: Math.round(((totalBytesScanned / (1024 * 1024)) / Math.max(0.001, totalDurationMs / 1000)) * 10) / 10,
      },
      memory: {
        heapUsedMb: Math.round(mem.heapUsed / (1024 * 1024)),
        heapTotalMb: Math.round(mem.heapTotal / (1024 * 1024)),
        rssMb: Math.round(mem.rss / (1024 * 1024)),
      },
      complexity: {
        tier,
        score: complexityScore,
        weightLabel: `${tier} (Score: ${complexityScore}/100)`,
        metrics: {
          totalFiles,
          totalDependencies: totalDeps,
          nativeCompilationUnits: nativeUnits,
          nativeExposureRatio: nativeExposure,
          architectureTarget: isNewArch ? 'Fabric New Architecture' : 'Legacy Paper',
        },
        rationale,
      },
    };

    return {
      projectDir: resolvedPath,
      filesScanned: filesToScan.length,
      filesWithIssues: filesWithIssuesSet.size,
      totalFindings: allFindings.length,
      errorsCount,
      warningsCount,
      findings: allFindings,
      durationMs: totalDurationMs,
      healthScore,
      substrate,
      telemetry,
    };
  }

  private collectFiles(dir: string): { files: string[]; tool: 'fd (Rust)' | 'node-fs (Fallback)' } {
    if (!fs.existsSync(dir)) return { files: [], tool: 'node-fs (Fallback)' };

    // 1. Sovereign Rust CLI (fd): Blazing fast, respects .gitignore, excludes build output
    try {
      const stdout = child_process.execFileSync(
        'fd',
        [
          '-e', 'ts',
          '-e', 'tsx',
          '-e', 'js',
          '-e', 'jsx',
          '-E', '*.d.ts',
          '-E', 'node_modules',
          '-E', 'dist*',
          '-E', '.expo*',
          '-E', 'ios',
          '-E', 'android',
          '-E', 'build',
          '-E', '.turbo',
          '--size', '-512k',
          '.',
          dir,
        ],
        { encoding: 'utf8', maxBuffer: 32 * 1024 * 1024, windowsHide: true }
      );
      const lines = stdout
        .split(/\r?\n/)
        .map((l) => l.trim())
        .filter((l) => l.length > 0 && fs.existsSync(l));
      if (lines.length > 0) {
        return { files: lines, tool: 'fd (Rust)' };
      }
    } catch {
      // fd not available on PATH or failed -> fallback cleanly to node-fs
    }

    return { files: this.collectFilesFallback(dir), tool: 'node-fs (Fallback)' };
  }

  private collectFilesFallback(dir: string, depth = 0): string[] {
    if (depth > 12 || !fs.existsSync(dir)) return [];
    const results: string[] = [];
    const IGNORE_DIR = /^(node_modules|\.git|dist.*|build|output|reports|runtime-fixtures|\.expo.*|ios|android|\.turbo|\.gradle|coverage|temp|\.tmp|test-results|\.claude|\.agents|\.windsurf|\.trae)$/i;

    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      for (const entry of entries) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          if (!IGNORE_DIR.test(entry.name)) {
            results.push(...this.collectFilesFallback(full, depth + 1));
          }
        } else if (entry.isFile() && /\.(tsx|ts|jsx|js)$/i.test(entry.name) && !entry.name.endsWith('.d.ts')) {
          try {
            if (fs.statSync(full).size < 512 * 1024) {
              results.push(full);
            }
          } catch {}
        }
      }
    } catch {}
    return results;
  }

  /**
   * Formats a lint report into human-readable, colored terminal output.
   */
  public static formatTerminalReport(report: RnTerrainLintReport): string {
    const lines: string[] = [];

    // Group findings by file
    const byFile = new Map<string, RnTerrainLintFinding[]>();
    for (const f of report.findings) {
      const list = byFile.get(f.filePath) || [];
      list.push(f);
      byFile.set(f.filePath, list);
    }

    for (const [filePath, findings] of byFile.entries()) {
      lines.push(`\n${c.underline(filePath)}`);
      for (const f of findings) {
        const badge = f.severity === 'error' ? c.red('error') : c.yellow('warning');
        const loc = c.dim(`${f.line}:${f.column}`);
        const rule = c.dim(`(${f.ruleId})`);
        lines.push(`  ${loc}  ${badge}  [${f.category}] ${f.message} ${rule}`);
        lines.push(`         ${c.cyan('💡 Fix:')} ${f.remediationAdvice}`);
        if (f.temporalNote) {
          lines.push(`         ${c.gray('⏳ Note:')} ${f.temporalNote}`);
        }
      }
    }

    if (report.substrate?.packageJsonFound) {
      lines.push('\n' + c.bold('📦 NATIVE SUBSTRATE & DEPENDENCY DRIFT'));
      lines.push('─'.repeat(70));
      lines.push(
        `  Dependencies:            ${report.substrate.totalDependencies} total (${report.substrate.nativeCompilationUnits} native units, ${(report.substrate.nativeExposureRatio * 100).toFixed(1)}% exposure)`
      );
      lines.push(`  New Architecture Ready:  ${report.substrate.newArchReadyPercentage}%`);

      if (report.substrate.legacyBridgeHazards > 0) {
        lines.push(
          `  ${c.red('✖ Legacy Bridge Hazards:')}  ${c.red(c.bold(`${report.substrate.legacyBridgeHazards} packages`))} without Fabric/TurboModule support`
        );
        for (const hp of report.substrate.hazardPackages.slice(0, 5)) {
          lines.push(`    - ${c.yellow(hp.packageName)} (${hp.version}) [${hp.moduleType}]: ${hp.reason}`);
        }
        if (report.substrate.hazardPackages.length > 5) {
          lines.push(`    ${c.gray(`...and ${report.substrate.hazardPackages.length - 5} more`)}`);
        }
      } else {
        lines.push(`  ${c.green('✔ Legacy Bridge Hazards:')}  0 (100% New Architecture compliant)`);
      }

      if (report.substrate.sacredPinViolations > 0) {
        lines.push(
          `  ${c.red('✖ Sacred Pin Drifts:')}      ${c.red(c.bold(`${report.substrate.sacredPinViolations} ABI violations`))} (Reanimated / RNGH / Skia)`
        );
      }

      if (report.substrate.floatingNativeCarets > 0) {
        lines.push(
          `  ${c.yellow('▲ Floating Native Carets:')} ${c.yellow(`${report.substrate.floatingNativeCarets} packages`)} with ^ ranges risk non-deterministic C++ ABI drift`
        );
      }
    }

    if (report.telemetry) {
      const t = report.telemetry;
      const tierBadge =
        t.complexity.tier === 'TITANIC'
          ? c.bold(c.red(`[TITANIC]`))
          : t.complexity.tier === 'HEAVY'
            ? c.bold(c.yellow(`[HEAVY]`))
            : c.bold(c.green(`[${t.complexity.tier}]`));

      lines.push('\n' + c.bold('⏱️  TASK TELEMETRY & COMPLEXITY PROFILE'));
      lines.push('─'.repeat(70));
      lines.push(
        `  Discovery Engine:        ${t.discoveryTool === 'fd (Rust)' ? c.green('✔ Sovereign fd (Rust CLI)') : t.discoveryTool.includes('git-staged') ? c.green('✔ Git Staged Pre-Commit Gate') : c.yellow('node-fs (Fallback)')}`
      );
      lines.push(`  Task Complexity:         ${tierBadge} ${t.complexity.weightLabel}`);
      if (t.complexity.rationale.length > 0) {
        lines.push(`  Complexity Drivers:      ${c.gray(t.complexity.rationale.join(' • '))}`);
      }
      lines.push(
        `  Throughput:              ${c.cyan(`${t.throughput.filesPerSec} files/s`)} (${report.filesScanned} files, ${(t.throughput.bytesProcessed / (1024 * 1024)).toFixed(1)} MB in ${(t.totalDurationMs / 1000).toFixed(2)}s)`
      );
      lines.push(
        `  Phase Breakdown:         Discovery: ${c.dim(`${t.phases.discoveryMs}ms`)} | AST Traversal: ${c.dim(`${t.phases.astTraversalMs}ms`)} | Substrate: ${c.dim(`${t.phases.substrateAuditMs}ms`)}`
      );
      lines.push(
        `  Memory Footprint:        Heap: ${t.memory.heapUsedMb} MB / ${t.memory.heapTotalMb} MB (RSS: ${t.memory.rssMb} MB)`
      );
    }

    // Summary block
    lines.push('\n' + '─'.repeat(70));
    const statusText =
      report.errorsCount > 0
        ? c.bold(c.red(`✖ ${report.errorsCount} errors`))
        : c.bold(c.green('✔ 0 errors'));
    const warningText =
      report.warningsCount > 0
        ? c.yellow(`${report.warningsCount} warnings`)
        : c.dim('0 warnings');

    const scoreColor =
      report.healthScore >= 80 ? c.green : report.healthScore >= 50 ? c.yellow : c.red;

    lines.push(
      `${statusText}, ${warningText} found across ${report.filesScanned} files ` +
      `(${report.durationMs}ms, Unified Health Score: ${scoreColor(c.bold(`${report.healthScore}/100`))})`
    );

    return lines.join('\n');
  }

  /**
   * Creates an ESLint Rule Object for integration into ESLint flat configs or legacy .eslintrc.
   */
  public static createEslintRule() {
    const linter = new RnTerrainLinter();
    return {
      meta: {
        type: 'problem' as const,
        docs: {
          description: 'Detect severed React Native APIs, cross-package interaction deadlocks, and New Architecture traps',
          category: 'Possible Errors',
          recommended: true,
        },
        fixable: 'code' as const,
        schema: [],
      },
      create(context: any) {
        return {
          Program(node: any) {
            const filename = context.getFilename ? context.getFilename() : (context.filename || 'unknown.tsx');
            if (/node_modules|\.git|dist/i.test(filename)) return;

            const sourceCode = context.getSourceCode ? context.getSourceCode().getText() : context.sourceCode.getText();
            const findings = linter.lintSource(sourceCode, filename);

            for (const f of findings) {
              context.report({
                loc: {
                  start: { line: f.line, column: Math.max(0, f.column - 1) },
                  end: { line: f.line, column: Math.max(0, f.column - 1) + (f.matchedText?.length || 1) },
                },
                message: `[${f.category}] ${f.message} (Remediation: ${f.remediationAdvice})`,
              });
            }
          },
        };
      },
    };
  }
}
