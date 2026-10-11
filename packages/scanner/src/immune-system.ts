/**
 * @file immune-system.ts
 * Artificial Immune System (AIS) & Clonal Selection Engine for Agent Deflection.
 *
 * Implements clonal selection theory for fast-path O(1) deflection of repeated
 * agent hallucinations and severed API calls across multi-turn sessions.
 *
 * Concepts:
 *   - Antigen: An invalid, severed, or hallucinated API call attempted by an LLM.
 *   - Antibody: A canonical normalized AST signature stored in memory.
 *   - Affinity Maturation: As an antigen is repeatedly detected, its strike count
 *     increases and defense priority is elevated.
 *   - Memory Cells: Persistent JSON ledger at `.agents/state/immune-memory.json`.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export interface Antibody {
  hash: string;
  callee: string;
  object?: string;
  sourcePackage: string;
  replacement?: string;
  message: string;
  severity: 'hard' | 'soft';
  strikeCount: number;
  lastObserved: number;
}

export interface ImmuneMemory {
  version: number;
  antibodies: Record<string, Antibody>;
}

export class ImmuneSystem {
  private memoryPath: string;
  private memory: ImmuneMemory;

  constructor(customPath?: string) {
    this.memoryPath = customPath || path.resolve(process.cwd(), '.agents', 'state', 'immune-memory.json');
    this.memory = this.loadMemory();
  }

  /**
   * Computes a canonical deterministic hash for an API symbol signature.
   */
  public static computeHash(callee: string, object?: string, sourcePackage?: string): string {
    const raw = `${sourcePackage || 'any'}::${object ? object + '.' : ''}${callee}`.toLowerCase().trim();
    return crypto.createHash('sha256').update(raw).digest('hex').slice(0, 16);
  }

  /**
   * Loads immune memory from disk or initializes an empty ledger.
   */
  private loadMemory(): ImmuneMemory {
    try {
      if (fs.existsSync(this.memoryPath)) {
        const raw = fs.readFileSync(this.memoryPath, 'utf8');
        const parsed = JSON.parse(raw);
        if (parsed && typeof parsed.antibodies === 'object') {
          return parsed;
        }
      }
    } catch {}

    return {
      version: 1,
      antibodies: {}
    };
  }

  /**
   * Persists the current antibody memory to disk.
   */
  public saveMemory(): void {
    try {
      const dir = path.dirname(this.memoryPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.memoryPath, JSON.stringify(this.memory, null, 2), 'utf8');
    } catch {}
  }

  /**
   * Registers a new antibody when a violation is detected (Clonal expansion).
   */
  public registerAntibody(input: {
    callee: string;
    object?: string;
    sourcePackage: string;
    replacement?: string;
    message: string;
    severity?: 'hard' | 'soft';
  }): Antibody {
    const hash = ImmuneSystem.computeHash(input.callee, input.object, input.sourcePackage);
    const existing = this.memory.antibodies[hash];

    if (existing) {
      existing.strikeCount += 1;
      existing.lastObserved = Date.now();
      if (input.replacement) existing.replacement = input.replacement;
      if (input.message) existing.message = input.message;
      this.saveMemory();
      return existing;
    }

    const antibody: Antibody = {
      hash,
      callee: input.callee,
      object: input.object,
      sourcePackage: input.sourcePackage,
      replacement: input.replacement,
      message: input.message,
      severity: input.severity || 'hard',
      strikeCount: 1,
      lastObserved: Date.now()
    };

    this.memory.antibodies[hash] = antibody;
    this.saveMemory();
    return antibody;
  }

  /**
   * Checks whether a symbol has an existing antibody in memory (O(1) lookup).
   */
  public checkImmunity(callee: string, object?: string, sourcePackage?: string): Antibody | null {
    const hash = ImmuneSystem.computeHash(callee, object, sourcePackage);
    const match = this.memory.antibodies[hash];
    if (match) {
      match.strikeCount += 1;
      match.lastObserved = Date.now();
      return match;
    }
    return null;
  }

  /**
   * Returns all active antibodies in the memory ledger.
   */
  public listAntibodies(): Antibody[] {
    return Object.values(this.memory.antibodies);
  }

  /**
   * Clears antibodies or removes entries older than maxAgeMs.
   */
  public purge(maxAgeMs?: number): number {
    if (!maxAgeMs) {
      const count = Object.keys(this.memory.antibodies).length;
      this.memory.antibodies = {};
      this.saveMemory();
      return count;
    }

    const cutoff = Date.now() - maxAgeMs;
    let purged = 0;
    for (const [hash, ab] of Object.entries(this.memory.antibodies)) {
      if (ab.lastObserved < cutoff) {
        delete this.memory.antibodies[hash];
        purged++;
      }
    }

    if (purged > 0) {
      this.saveMemory();
    }
    return purged;
  }
}
