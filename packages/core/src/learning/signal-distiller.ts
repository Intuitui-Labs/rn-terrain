/**
 * @file signal-distiller.ts
 * Self-Supervised Distillation Engine for RN-Terrain.
 *
 * Synthesizes resolved incident pairs into formal Chronos signals matching the package-features schema,
 * allowing the platform to autonomously discover workarounds and update dependency shards.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import type { IncidentSpecimen } from './incident-collector.js';

export interface DistilledChronosSignal {
  featureKey: string;
  packageName: string;
  display: string;
  impact_severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
  transition_milestones: {
    broken: string;
    fixed: string | null;
  };
  rules: {
    dev_dance: string;
    decommission_at?: string;
  };
  _chronos_meta: {
    source: 'autonomous_incident_telemetry';
    confidence: number;
    incidentId: string;
    created_at: string;
  };
}

export interface DistillOptions {
  draftsDir?: string;
  stageAsDraft?: boolean;
}

export class SignalDistiller {
  private projectRoot: string;

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
  }

  /**
   * Distills a resolved incident into a formal Chronos signal.
   */
  distillIncident(incident: IncidentSpecimen): DistilledChronosSignal {
    if (!incident.chosenSnippet) {
      throw new Error(`Cannot distill unresolved incident: ${incident.id}`);
    }

    const severed = incident.severedSymbolsDetected.length > 0
      ? incident.severedSymbolsDetected.join(', ')
      : 'Severed legacy API invocation';

    const canonical = incident.canonicalReplacements.length > 0
      ? incident.canonicalReplacements.join(', ')
      : 'canonical modern API replacement';

    const hashSuffix = crypto
      .createHash('sha256')
      .update(incident.id)
      .digest('hex')
      .substring(0, 6);

    const featureKey = `chronos_auto_${hashSuffix}`;

    const devDance = incident.canonicalReplacements.length > 0
      ? `Replace legacy [${severed}] with modern [${canonical}]`
      : `Migrate legacy pattern to modern syntax verified in incident ${incident.id}`;

    return {
      featureKey,
      packageName: incident.packageName,
      display: `Severed ${severed} -> Modern ${canonical}`,
      impact_severity: 'HIGH',
      transition_milestones: {
        broken: incident.targetVersion,
        fixed: null,
      },
      rules: {
        dev_dance: devDance,
      },
      _chronos_meta: {
        source: 'autonomous_incident_telemetry',
        confidence: 0.60,
        incidentId: incident.id,
        created_at: new Date().toISOString(),
      },
    };
  }

  /**
   * Stages a distilled signal into a draft review file under data/packages/drafts/<pkg>.draft.json.
   */
  async stageDraft(signal: DistilledChronosSignal, options: DistillOptions = {}): Promise<string> {
    const draftsDir = options.draftsDir
      ? path.resolve(this.projectRoot, options.draftsDir)
      : path.resolve(this.projectRoot, 'data', 'packages', 'drafts');

    if (!fs.existsSync(draftsDir)) {
      fs.mkdirSync(draftsDir, { recursive: true });
    }

    const safePkg = signal.packageName.replace(/[^a-z0-9]/gi, '_');
    const draftPath = path.join(draftsDir, `${safePkg}.draft.json`);

    let existingDrafts: Record<string, any> = {};
    if (fs.existsSync(draftPath)) {
      try {
        existingDrafts = JSON.parse(fs.readFileSync(draftPath, 'utf8'));
      } catch {
        existingDrafts = {};
      }
    }

    existingDrafts[signal.featureKey] = {
      display: signal.display,
      impact_severity: signal.impact_severity,
      transition_milestones: signal.transition_milestones,
      rules: signal.rules,
      _chronos_meta: signal._chronos_meta,
    };

    fs.writeFileSync(draftPath, JSON.stringify(existingDrafts, null, 2), 'utf8');
    return draftPath;
  }
}
