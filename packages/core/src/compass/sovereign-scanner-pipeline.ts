/**
 * @file sovereign-scanner-pipeline.ts
 * Unified Sovereign Rust High-Performance Scanner Pipeline & Task Complexity Engine.
 *
 * Implements the canonical 3-stage scanning architecture:
 * 1. Stage 1 (fd microsecond discovery): Rapidly gathers valid source files using `fd` (<15ms)
 *    with canonical ignore rules (node_modules, dist*, build*, temp*, .expo*, Pods, etc.).
 * 2. Stage 2 (rg streaming sieve): Narrows discovered files down to only candidate files
 *    matching target trigger words or regex patterns (<25ms).
 * 3. Stage 3 (AST / Diagnostic Execution): Executes AST rules or checks against candidates.
 *
 * Provides task complexity weighting, throughput profiling, and sub-millisecond telemetry.
 */

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

export const CANONICAL_EXCLUDE_GLOBS = [
  'node_modules',
  '.git',
  'dist*',
  'build*',
  '.expo*',
  '.next*',
  'temp*',
  'tmp*',
  'coverage*',
  'test-results*',
  'reports*',
  'output*',
  'Pods',
  'DerivedData',
  '.gradle',
  '.turbo',
  'vendor',
  '__mocks__',
  '*.min.js',
  '*.bundle.js',
];

export interface SovereignScanOptions {
  cwd?: string;
  extensions?: string[];
  excludeGlobs?: string[];
  candidatePattern?: string; // Regex string for ripgrep pre-filter sieve
}

export interface TaskComplexityReport {
  filesDiscovered: number;
  filesMatched: number;
  totalBytesScanned: number;
  complexityWeight: number;
  latency: {
    discoveryMs: number;
    preFilterMs: number;
    analysisMs: number;
    totalMs: number;
  };
  throughputFilesPerSec: number;
  engine: '⚡ Rust Sovereign Acceleration (fd + rg)' | '⚡ Rust fd Discovery' | 'Node.js Filesystem Fallback';
  activeTools: string[];
}

export interface SovereignPipelineExecution<T> {
  files: string[];
  complexity: TaskComplexityReport;
  results: T[];
}

export class SovereignScannerPipeline {
  private hasFd: boolean | null = null;
  private hasRg: boolean | null = null;

  constructor(private readonly defaultRoot: string = process.cwd()) {}

  /**
   * Probes for available sovereign Rust binaries (fd, rg).
   */
  public probeSovereignTools(): { hasFd: boolean; hasRg: boolean } {
    if (this.hasFd === null) {
      try {
        execFileSync('fd', ['--version'], { stdio: 'ignore', shell: false });
        this.hasFd = true;
      } catch {
        this.hasFd = false;
      }
    }
    if (this.hasRg === null) {
      try {
        execFileSync('rg', ['--version'], { stdio: 'ignore', shell: false });
        this.hasRg = true;
      } catch {
        this.hasRg = false;
      }
    }
    return { hasFd: this.hasFd, hasRg: this.hasRg };
  }

  /**
   * Executes full sovereign discovery, candidate filtering, and task execution with telemetry.
   */
  public execute<T>(
    targetPath: string,
    options: SovereignScanOptions,
    analyzeFn: (filePath: string, fileContent: string) => T | null | undefined
  ): SovereignPipelineExecution<T> {
    const overallStart = performance.now();
    const resolvedPath = path.resolve(targetPath);
    const { hasFd, hasRg } = this.probeSovereignTools();

    const extensions = options.extensions ?? ['tsx', 'jsx', 'ts', 'js'];
    const excludes = options.excludeGlobs ?? CANONICAL_EXCLUDE_GLOBS;

    let filesDiscovered: string[] = [];
    let discoveryMs = 0;
    let preFilterMs = 0;
    let analysisMs = 0;

    // STAGE 1: Discovery
    const discStart = performance.now();
    if (fs.existsSync(resolvedPath) && fs.statSync(resolvedPath).isFile()) {
      filesDiscovered = [resolvedPath];
      discoveryMs = Math.round(performance.now() - discStart);
    } else if (hasFd) {
      try {
        const fdArgs = ['.', resolvedPath, '-t', 'f'];
        for (const ext of extensions) {
          fdArgs.push('-e', ext);
        }
        for (const exc of excludes) {
          fdArgs.push('-E', exc);
        }
        const fdOut = execFileSync('fd', fdArgs, {
          stdio: ['pipe', 'pipe', 'ignore'],
          maxBuffer: 32 * 1024 * 1024,
          shell: false,
        }).toString();
        filesDiscovered = fdOut.split(/\r?\n/).map((s) => s.trim()).filter(Boolean);
        discoveryMs = Math.round(performance.now() - discStart);
      } catch {
        filesDiscovered = this.fallbackScan(resolvedPath, extensions, excludes);
        discoveryMs = Math.round(performance.now() - discStart);
      }
    } else {
      filesDiscovered = this.fallbackScan(resolvedPath, extensions, excludes);
      discoveryMs = Math.round(performance.now() - discStart);
    }

    // STAGE 2: Ripgrep Candidate Pre-filter (Sub-50ms sieve)
    let candidateFiles = filesDiscovered;
    let preFilterUsed = false;
    if (options.candidatePattern && filesDiscovered.length > 5 && hasRg) {
      const pfStart = performance.now();
      try {
        const rgArgs = ['-l', options.candidatePattern];
        for (const ext of extensions) {
          rgArgs.push('-g', `*.${ext}`);
        }
        for (const exc of excludes) {
          rgArgs.push('--glob', `!${exc}`);
        }
        rgArgs.push(resolvedPath);

        const rgOut = execFileSync('rg', rgArgs, {
          stdio: ['pipe', 'pipe', 'ignore'],
          maxBuffer: 32 * 1024 * 1024,
          shell: false,
        }).toString();
        const matchedSet = new Set(rgOut.split(/\r?\n/).map((s) => s.trim()).filter(Boolean));
        candidateFiles = filesDiscovered.filter((f) => matchedSet.has(f) || matchedSet.has(path.resolve(f)));
        preFilterUsed = true;
        preFilterMs = Math.round(performance.now() - pfStart);
      } catch (e: any) {
        if (e.status === 1) {
          candidateFiles = [];
          preFilterUsed = true;
          preFilterMs = Math.round(performance.now() - pfStart);
        }
      }
    }

    // STAGE 3: Task Execution & Complexity Calculation
    const aStart = performance.now();
    const results: T[] = [];
    let totalBytesScanned = 0;

    for (const file of candidateFiles) {
      try {
        const stat = fs.statSync(file);
        totalBytesScanned += stat.size;
        const content = fs.readFileSync(file, 'utf8');
        const res = analyzeFn(file, content);
        if (res !== null && res !== undefined) {
          results.push(res);
        }
      } catch {}
    }
    analysisMs = Math.round(performance.now() - aStart);
    const totalMs = Math.round(performance.now() - overallStart);

    const complexityWeight = Math.round(
      filesDiscovered.length * 1.5 + candidateFiles.length * 8 + (totalBytesScanned / 1024) * 0.5
    );

    const activeTools = [
      hasFd ? 'fd-find' : null,
      preFilterUsed && hasRg ? 'ripgrep' : null,
    ].filter(Boolean) as string[];

    const engine =
      hasFd && preFilterUsed && hasRg
        ? '⚡ Rust Sovereign Acceleration (fd + rg)'
        : hasFd
          ? '⚡ Rust fd Discovery'
          : 'Node.js Filesystem Fallback';

    const throughputFilesPerSec =
      totalMs > 0 ? Math.round((filesDiscovered.length / (totalMs / 1000))) : filesDiscovered.length * 1000;

    return {
      files: candidateFiles,
      complexity: {
        filesDiscovered: filesDiscovered.length,
        filesMatched: candidateFiles.length,
        totalBytesScanned,
        complexityWeight,
        latency: {
          discoveryMs,
          preFilterMs,
          analysisMs,
          totalMs,
        },
        throughputFilesPerSec,
        engine,
        activeTools,
      },
      results,
    };
  }

  private fallbackScan(dir: string, extensions: string[], excludes: string[]): string[] {
    const results: string[] = [];
    if (!fs.existsSync(dir)) return results;

    const extRegex = new RegExp(`\\.(${extensions.join('|')})$`, 'i');
    const excludePatterns = excludes.map((ex) => new RegExp(`^${ex.replace(/\*/g, '.*')}$`, 'i'));

    const walk = (currentDir: string, depth = 0) => {
      if (depth > 8) return;
      try {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });
        for (const entry of entries) {
          const name = entry.name;
          const full = path.join(currentDir, name);
          const isExcluded = excludePatterns.some((re) => re.test(name));
          if (isExcluded) continue;

          if (entry.isDirectory()) {
            walk(full, depth + 1);
          } else if (entry.isFile() && extRegex.test(name)) {
            results.push(full);
          }
        }
      } catch {}
    };

    walk(dir);
    return results;
  }
}
