/**
 * @file dpo-exporter.ts
 * Continuous DPO & SFT Dataset Exporter for RN-Terrain.
 *
 * Transforms resolved incident pairs into Direct Preference Optimization (DPO) training data,
 * closing the model weights loop by preparing synthetic fine-tuning datasets for local LLMs
 * (e.g., Callstack Apex, Gemma 2, Qwen 2.5 Coder).
 */

import fs from 'node:fs';
import path from 'node:path';
import type { IncidentSpecimen } from './incident-collector.js';

export interface HuggingFaceDPORecord {
  prompt: string;
  chosen: string;
  rejected: string;
  metadata: {
    packageName: string;
    targetVersion: string;
    incidentId: string;
    timestamp: string;
  };
}

export interface ApexDPORecord {
  conversations: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  chosen: {
    role: 'assistant';
    content: string;
  };
  rejected: {
    role: 'assistant';
    content: string;
  };
  metadata: {
    packageName: string;
    targetVersion: string;
    incidentId: string;
  };
}

export class DPOExporter {
  /**
   * Converts a single resolved incident into HuggingFace DPO format.
   */
  toHuggingFaceRecord(incident: IncidentSpecimen): HuggingFaceDPORecord {
    if (!incident.chosenSnippet) {
      throw new Error(`Cannot export unresolved incident: ${incident.id}`);
    }

    const prompt = `You are writing React Native component code using ${incident.packageName}@${incident.targetVersion} under the New Architecture. Provide a clean, robust, and compile-ready implementation.`;

    return {
      prompt,
      chosen: incident.chosenSnippet,
      rejected: incident.rejectedSnippet,
      metadata: {
        packageName: incident.packageName,
        targetVersion: incident.targetVersion,
        incidentId: incident.id,
        timestamp: incident.timestamp,
      },
    };
  }

  /**
   * Converts a single resolved incident into Callstack Apex / ChatML DPO format.
   */
  toApexRecord(incident: IncidentSpecimen): ApexDPORecord {
    if (!incident.chosenSnippet) {
      throw new Error(`Cannot export unresolved incident: ${incident.id}`);
    }

    const systemPrompt =
      'You are a specialized React Native AI pair programmer. Always adhere to New Architecture Fabric and TurboModule standards. Never generate severed legacy APIs.';
    const userPrompt = `Write component logic for ${incident.packageName}@${incident.targetVersion}.`;

    return {
      conversations: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      chosen: {
        role: 'assistant',
        content: incident.chosenSnippet,
      },
      rejected: {
        role: 'assistant',
        content: incident.rejectedSnippet,
      },
      metadata: {
        packageName: incident.packageName,
        targetVersion: incident.targetVersion,
        incidentId: incident.id,
      },
    };
  }

  /**
   * Serializes a collection of resolved incidents into a JSONL string.
   */
  exportJSONL(
    incidents: IncidentSpecimen[],
    format: 'huggingface' | 'apex' = 'huggingface'
  ): string {
    const resolved = incidents.filter((i) => i.status === 'RESOLVED' || i.status === 'DISTILLED');
    const lines: string[] = [];

    for (const inc of resolved) {
      if (!inc.chosenSnippet) continue;
      const record =
        format === 'apex' ? this.toApexRecord(inc) : this.toHuggingFaceRecord(inc);
      lines.push(JSON.stringify(record));
    }

    return lines.join('\n');
  }

  /**
   * Writes the JSONL dataset to disk.
   */
  async exportToFile(
    incidents: IncidentSpecimen[],
    outputPath: string,
    format: 'huggingface' | 'apex' = 'huggingface'
  ): Promise<string> {
    const fullPath = path.resolve(process.cwd(), outputPath);
    const parentDir = path.dirname(fullPath);
    if (!fs.existsSync(parentDir)) {
      fs.mkdirSync(parentDir, { recursive: true });
    }

    const jsonl = this.exportJSONL(incidents, format);
    fs.writeFileSync(fullPath, jsonl, 'utf8');
    return fullPath;
  }
}
