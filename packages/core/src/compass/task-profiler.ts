/**
 * @file task-profiler.ts
 * Sovereign Task Complexity & Performance Profiling Utility.
 *
 * Provides a universal, lightweight telemetry harness for measuring
 * computational weight, high-resolution latency, file discovery throughput,
 * and memory/byte consumption across any scan, doctor layer, or audit pass.
 */

const BOLD = '\x1b[1m';
const RESET = '\x1b[0m';
const GREEN = '\x1b[32m';
const MAGENTA = '\x1b[35m';
const CYAN = '\x1b[36m';
const DIM = '\x1b[2m';

export interface TaskMetrics {
  name: string;
  filesDiscovered: number;
  filesMatched: number;
  totalBytesScanned: number;
  complexityWeight: number;
  durationMs: number;
  breakdown: Record<string, number>;
  throughputFilesPerSec: number;
  engine: string;
}

export class TaskProfiler {
  private startTime: number;
  private splitTimes: Map<string, number> = new Map();
  private lastMark: number;
  private filesDiscovered = 0;
  private filesMatched = 0;
  private totalBytesScanned = 0;

  private constructor(
    public readonly name: string,
    public engine: string = '⚡ Sovereign Rust (fd + rg)'
  ) {
    this.startTime = performance.now();
    this.lastMark = this.startTime;
  }

  /**
   * Starts a new TaskProfiler instance.
   */
  public static start(name: string, engine?: string): TaskProfiler {
    return new TaskProfiler(name, engine);
  }

  /**
   * Records an intermediate milestone/phase latency in milliseconds.
   */
  public mark(phaseName: string): number {
    const now = performance.now();
    const elapsed = Math.round(now - this.lastMark);
    this.splitTimes.set(phaseName, elapsed);
    this.lastMark = now;
    return elapsed;
  }

  /**
   * Records file discovery and byte metrics.
   */
  public recordMetrics(discovered: number, matched: number, bytes: number = 0): this {
    this.filesDiscovered = discovered;
    this.filesMatched = matched;
    this.totalBytesScanned = bytes;
    return this;
  }

  /**
   * Sets the engine label.
   */
  public setEngine(engine: string): this {
    this.engine = engine;
    return this;
  }

  /**
   * Finalizes profiling and calculates complexity weight and throughput.
   */
  public finalize(): TaskMetrics {
    const totalDurationMs = Math.max(1, Math.round(performance.now() - this.startTime));
    const breakdown: Record<string, number> = {};
    for (const [phase, ms] of this.splitTimes.entries()) {
      breakdown[phase] = ms;
    }

    // Complexity Weight formula:
    // Discovered files (0.1 pt/file) + Sieved candidates (1.5 pt/file) +
    // Scanned data (1 pt / 100 KB) + Latency penalty (0.02 pt / ms)
    const dataPoints = Math.round((this.totalBytesScanned / 1024) / 100);
    const complexityWeight = Math.max(
      1,
      Math.round(
        this.filesDiscovered * 0.1 +
        this.filesMatched * 1.5 +
        dataPoints +
        totalDurationMs * 0.02
      )
    );

    const throughputFilesPerSec = Math.round(
      (this.filesDiscovered / (totalDurationMs / 1000)) || 0
    );

    return {
      name: this.name,
      filesDiscovered: this.filesDiscovered,
      filesMatched: this.filesMatched,
      totalBytesScanned: this.totalBytesScanned,
      complexityWeight,
      durationMs: totalDurationMs,
      breakdown,
      throughputFilesPerSec,
      engine: this.engine,
    };
  }

  /**
   * Formats a concise inline telemetry badge for CLI output.
   */
  public static formatBadge(metrics: TaskMetrics): string {
    const kb = (metrics.totalBytesScanned / 1024).toFixed(1);
    return `${MAGENTA}${BOLD}${metrics.complexityWeight} pts${RESET} (${BOLD}${metrics.durationMs}ms${RESET}, ${metrics.filesDiscovered} files, ${kb} KB, ${CYAN}${metrics.throughputFilesPerSec} files/s${RESET})`;
  }

  /**
   * Formats a comprehensive multi-line telemetry block for detailed reports.
   */
  public static formatDetailed(metrics: TaskMetrics): string[] {
    const kb = (metrics.totalBytesScanned / 1024).toFixed(1);
    const breakdownParts = Object.entries(metrics.breakdown)
      .map(([k, v]) => `${k}: ${v}ms`)
      .join(', ');

    return [
      `  Engine:              ${GREEN}${BOLD}${metrics.engine}${RESET}`,
      `  Files Discovered:    ${BOLD}${metrics.filesDiscovered}${RESET} files (${BOLD}${metrics.filesMatched}${RESET} sieved candidates)`,
      `  Task Complexity:     ${MAGENTA}${BOLD}${metrics.complexityWeight} pts${RESET} (${kb} KB scanned)`,
      `  Latency:             Total: ${BOLD}${metrics.durationMs}ms${RESET}${breakdownParts ? ` (${breakdownParts})` : ''}`,
      `  Throughput:          ${CYAN}${BOLD}${metrics.throughputFilesPerSec} files/sec${RESET}`,
    ];
  }
}
