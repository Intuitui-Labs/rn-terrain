/**
 * @file radar.ts
 * Technology Radar CLI commands for RN-Terrain.
 */

import type { CAC } from 'cac';
import { consola } from 'consola';
import {
  createRadarRecord,
  listRadarRecords,
  loadRadarRecord,
  saveRadarRecord,
  updateRadarRecord,
} from '../radar.js';

export function registerRadarCommands(cli: CAC): void {
  cli
    .command(
      'radar:add <subject>',
      'Capture a package, screenshot, or tool for technology-radar review',
    )
    .option('--kind <kind>', 'package, screenshot, article, issue, benchmark, or other')
    .option('--category <category>', 'Radar category')
    .option('--use-case <useCase>', 'Use case this candidate might serve')
    .option('--problem <problem>', 'Concrete problem being investigated')
    .option('--current-stack <currentStack>', 'Comma-separated current tools')
    .option('--evidence <evidence>', 'URL or local screenshot path')
    .option('--verdict <verdict>', 'ADOPT, TRIAL, ASSESS, or HOLD', { default: 'ASSESS' })
    .option('--decision <decision>', 'Human-readable decision')
    .option('--revisit-when <revisitWhen>', 'Condition for revisiting')
    .action((subject, options) => {
      const record = createRadarRecord(subject, options);
      saveRadarRecord(record);
      consola.success(`Captured ${subject} in the RN Terrain technology radar.`);
      console.log(`Verdict: ${record.verdict} (confidence: ${record.confidence})`);
      console.log(`Saved: docs/RN Terrain/radar/records/${record.id}.json`);
    });

  cli
    .command('radar:list', 'List captured technology-radar candidates')
    .option('--verdict <verdict>', 'Filter by verdict')
    .action((options) => {
      const records = listRadarRecords().filter(
        (record) => !options.verdict || record.verdict === options.verdict,
      );
      if (records.length === 0) {
        consola.info('No radar candidates captured yet.');
        return;
      }
      for (const record of records) {
        console.log(`${record.verdict.padEnd(6)}  ${record.subject}  — ${record.use_case}`);
      }
    });

  cli
    .command('radar:show <subject>', 'Show a captured technology-radar record')
    .action((subject) => {
      const record = loadRadarRecord(subject);
      if (!record) {
        consola.warn(`No radar record found for ${subject}.`);
        return;
      }
      console.log(JSON.stringify(record, null, 2));
    });

  cli
    .command('radar:decide <subject>', 'Update the verdict and decision for a radar candidate')
    .option('--verdict <verdict>', 'ADOPT, TRIAL, ASSESS, or HOLD')
    .option('--decision <decision>', 'Why this verdict was chosen')
    .option('--revisit-when <revisitWhen>', 'Condition for revisiting')
    .action((subject, options) => {
      const updated = updateRadarRecord(subject, {
        ...(options.verdict ? { verdict: options.verdict } : {}),
        ...(options.decision ? { decision: options.decision } : {}),
        ...(options.revisitWhen ? { revisit_when: options.revisitWhen } : {}),
      });
      if (!updated) {
        consola.warn(`No radar record found for ${subject}. Capture it first with radar:add.`);
        return;
      }
      consola.success(`${updated.subject}: ${updated.verdict}`);
    });
}
