/**
 * @file incident-collector.ts
 * Telemetry Intake & Afferent Sensory Receptor for RN-Terrain.
 *
 * Captures severed API gate rejections, compiler crashes, and remediated code diffs
 * into structured incident specimens within `.terrain/incidents/`.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export interface IncidentSpecimen {
  id: string;
  timestamp: string;
  packageName: string;
  targetVersion: string;
  rejectedSnippet: string;
  chosenSnippet?: string;
  severedSymbolsDetected: string[];
  canonicalReplacements: string[];
  compilerOutput?: string;
  merkleStateRoot?: string;
  status: 'RECORDED' | 'RESOLVED' | 'DISTILLED';
  tags?: string[];
}

export interface RecordIncidentInput {
  packageName: string;
  targetVersion: string;
  rejectedSnippet: string;
  severedSymbolsDetected?: string[];
  canonicalReplacements?: string[];
  compilerOutput?: string;
  merkleStateRoot?: string;
  tags?: string[];
}

/**
 * Sanitizes code snippets to remove absolute disk paths and environment-specific leaks.
 */
export function sanitizeSnippet(snippet: string): string {
  if (!snippet) return '';
  return snippet
    // Scrub Windows drive absolute paths
    .replace(/[A-Z]:\\[^"'\s\n\r]+\\/gi, '')
    // Scrub Unix absolute root paths
    .replace(/(?:\/[a-zA-Z0-9._-]+){3,}\//g, '')
    // Strip trailing whitespace
    .trim();
}

export class IncidentCollector {
  private baseDir: string;

  constructor(projectRoot: string = process.cwd(), customDir?: string) {
    this.baseDir = customDir
      ? path.resolve(projectRoot, customDir)
      : path.resolve(projectRoot, '.terrain', 'incidents');
    this.ensureDir();
  }

  private ensureDir(): void {
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  /**
   * Generates a deterministic or random incident identifier.
   */
  private generateId(packageName: string, rejectedSnippet: string): string {
    const hash = crypto
      .createHash('sha256')
      .update(`${packageName}:${rejectedSnippet}:${Date.now()}`)
      .digest('hex')
      .substring(0, 12);
    return `inc-${packageName.replace(/[^a-z0-9]/gi, '_')}-${hash}`;
  }

  /**
   * Records a severed API rejection event as an unresolved incident.
   */
  async recordRejection(input: RecordIncidentInput): Promise<IncidentSpecimen> {
    this.ensureDir();
    const id = this.generateId(input.packageName, input.rejectedSnippet);
    const incident: IncidentSpecimen = {
      id,
      timestamp: new Date().toISOString(),
      packageName: input.packageName,
      targetVersion: input.targetVersion,
      rejectedSnippet: sanitizeSnippet(input.rejectedSnippet),
      severedSymbolsDetected: input.severedSymbolsDetected || [],
      canonicalReplacements: input.canonicalReplacements || [],
      compilerOutput: input.compilerOutput ? sanitizeSnippet(input.compilerOutput) : undefined,
      merkleStateRoot: input.merkleStateRoot,
      status: 'RECORDED',
      tags: input.tags || [],
    };

    const filePath = path.join(this.baseDir, `${id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(incident, null, 2), 'utf8');
    return incident;
  }

  /**
   * Resolves an incident by attaching the working/canonical snippet that succeeded.
   */
  async resolveRemediation(incidentId: string, chosenSnippet: string): Promise<IncidentSpecimen> {
    const incident = await this.getIncident(incidentId);
    if (!incident) {
      throw new Error(`Incident not found: ${incidentId}`);
    }

    incident.chosenSnippet = sanitizeSnippet(chosenSnippet);
    incident.status = 'RESOLVED';

    const filePath = path.join(this.baseDir, `${incidentId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(incident, null, 2), 'utf8');
    return incident;
  }

  /**
   * Marks an incident as distilled after its signal has been absorbed into Chronos shards or combos.
   */
  async markDistilled(incidentId: string): Promise<IncidentSpecimen> {
    const incident = await this.getIncident(incidentId);
    if (!incident) {
      throw new Error(`Incident not found: ${incidentId}`);
    }

    incident.status = 'DISTILLED';
    const filePath = path.join(this.baseDir, `${incidentId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(incident, null, 2), 'utf8');
    return incident;
  }

  /**
   * Retrieves an incident by ID.
   */
  async getIncident(incidentId: string): Promise<IncidentSpecimen | null> {
    const filePath = path.join(this.baseDir, `${incidentId}.json`);
    if (!fs.existsSync(filePath)) {
      return null;
    }
    try {
      const raw = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(raw) as IncidentSpecimen;
    } catch {
      return null;
    }
  }

  /**
   * Lists stored incidents filtered by status or package name.
   */
  async listIncidents(filter?: {
    status?: 'RECORDED' | 'RESOLVED' | 'DISTILLED';
    packageName?: string;
  }): Promise<IncidentSpecimen[]> {
    this.ensureDir();
    const files = fs.readdirSync(this.baseDir).filter((f) => f.endsWith('.json'));
    const results: IncidentSpecimen[] = [];

    for (const f of files) {
      try {
        const raw = fs.readFileSync(path.join(this.baseDir, f), 'utf8');
        const item = JSON.parse(raw) as IncidentSpecimen;
        if (filter?.status && item.status !== filter.status) continue;
        if (filter?.packageName && item.packageName !== filter.packageName) continue;
        results.push(item);
      } catch {
        // Skip corrupted files
      }
    }

    return results.sort((a, b) => b.timestamp.localeCompare(a.timestamp));
  }

  /**
   * Cleans all incidents from disk (useful for test resets).
   */
  async clearIncidents(): Promise<void> {
    if (fs.existsSync(this.baseDir)) {
      const files = fs.readdirSync(this.baseDir).filter((f) => f.endsWith('.json'));
      for (const f of files) {
        fs.unlinkSync(path.join(this.baseDir, f));
      }
    }
  }
}
