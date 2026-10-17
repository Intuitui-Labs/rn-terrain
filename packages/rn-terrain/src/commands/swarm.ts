import fs from 'node:fs';
import path from 'node:path';
import type { CAC } from 'cac';
import chalk from 'chalk';
import { consola } from 'consola';
import {
  IncidentCollector,
  SignalDistiller,
  DPOExporter,
  isTelemetryOptedIn,
  AntibodyGossipBus,
} from '@intuitui-labs/rn-terrain-core';

export function registerSwarmCommands(cli: CAC) {
  cli
    .command('incidents:list [status]', 'List recorded telemetry incidents caught by harness gates')
    .action(async (status) => {
      try {
        const collector = new IncidentCollector();
        const filter = status ? { status: status.toUpperCase() as any } : undefined;
        const list = await collector.listIncidents(filter);
        console.log(`\n${chalk.bold('🧠 AFFERENT SENSORY TELEMETRY: INCIDENTS')}`);
        console.log(chalk.dim('────────────────────────────────────────────────────────'));
        if (list.length === 0) {
          console.log(chalk.dim('  No incidents recorded. Nervous system is clean.'));
        } else {
          for (const inc of list) {
            const statusColor =
              inc.status === 'RESOLVED'
                ? chalk.green
                : inc.status === 'DISTILLED'
                ? chalk.cyan
                : chalk.yellow;
            console.log(`  • ${chalk.bold(inc.id)} [${statusColor(inc.status)}]`);
            console.log(`    Package: ${chalk.cyan(inc.packageName)}@${inc.targetVersion}`);
            console.log(`    Severed: ${chalk.red(inc.severedSymbolsDetected.join(', ') || 'N/A')}`);
            if (inc.chosenSnippet) {
              console.log(`    Fix:     ${chalk.green(inc.chosenSnippet.slice(0, 60))}...`);
            }
            console.log('');
          }
        }
      } catch (e: any) {
        consola.error('Failed to list incidents:', e.message);
      }
    });

  cli
    .command('incidents:resolve <id> <fixedSnippetPath>', 'Attach remediated modern code snippet to an incident')
    .action(async (id, snippetPath) => {
      try {
        const collector = new IncidentCollector();
        let snippet = snippetPath;
        if (fs.existsSync(snippetPath)) {
          snippet = fs.readFileSync(snippetPath, 'utf8');
        }
        await collector.resolveRemediation(id, snippet);
        consola.success(`Incident ${chalk.cyan(id)} resolved with verified remediation.`);
      } catch (e: any) {
        consola.error('Failed to resolve incident:', e.message);
      }
    });

  cli
    .command('distill [id]', 'Distill resolved incidents into candidate Chronos shards')
    .option('--drafts-dir <dir>', 'Directory to stage draft shards', { default: 'data/packages/drafts' })
    .action(async (id, options) => {
      try {
        const collector = new IncidentCollector();
        const distiller = new SignalDistiller();
        const incidents = id
          ? [await collector.getIncident(id)].filter(Boolean) as any[]
          : await collector.listIncidents({ status: 'RESOLVED' });

        if (incidents.length === 0) {
          consola.info('No resolved incidents ready for distillation.');
          return;
        }

        console.log(`\n${chalk.bold('⚡ SYNAPTIC DISTILLATION: FORMULATING CHRONOS SIGNALS')}`);
        console.log(chalk.dim('────────────────────────────────────────────────────────'));
        for (const inc of incidents) {
          const signal = distiller.distillIncident(inc);
          const draftPath = await distiller.stageDraft(signal, { draftsDir: options.draftsDir });
          await collector.markDistilled(inc.id);
          console.log(`  ✓ Distilled ${chalk.cyan(inc.id)} -> ${chalk.green(signal.featureKey)}`);
          console.log(`    Draft Shard: ${chalk.dim(draftPath)}`);
          console.log(`    Dev Dance:   ${chalk.yellow(signal.rules.dev_dance)}`);
          console.log('');
        }
        consola.success(`Distillation complete. Draft shards staged.`);
      } catch (e: any) {
        consola.error('Failed to distill signals:', e.message);
      }
    });

  cli
    .command('export:dpo <outputFile>', 'Export resolved incidents into DPO / Apex training dataset')
    .option('--format <format>', 'Dataset schema: huggingface or apex', { default: 'huggingface' })
    .action(async (outputFile, options) => {
      try {
        const collector = new IncidentCollector();
        const exporter = new DPOExporter();
        const incidents = await collector.listIncidents();
        const resolved = incidents.filter((i) => i.status === 'RESOLVED' || i.status === 'DISTILLED');

        if (resolved.length === 0) {
          consola.warn('No resolved incidents available to export.');
          return;
        }

        const outPath = await exporter.exportToFile(resolved, outputFile, options.format);
        consola.success(
          `Exported ${resolved.length} preference pairs in [${options.format}] format to ${chalk.cyan(outPath)}.`
        );
      } catch (e: any) {
        consola.error('Failed to export DPO dataset:', e.message);
      }
    });

  cli
    .command('telemetry [action]', 'Inspect or configure privacy-first local telemetry (status, enable, disable)')
    .action((action) => {
      try {
        const rcPath = path.resolve(process.cwd(), '.terrainrc');
        let rc: any = {};
        if (fs.existsSync(rcPath)) {
          try {
            rc = JSON.parse(fs.readFileSync(rcPath, 'utf8'));
          } catch {}
        }

        if (action === 'enable' || action === 'on') {
          rc.telemetry = true;
          fs.writeFileSync(rcPath, JSON.stringify(rc, null, 2), 'utf8');
          consola.success('Local incident telemetry opted-IN. Data will be saved strictly to local .terrain/incidents/ (never sent to network).');
          return;
        }

        if (action === 'disable' || action === 'off') {
          rc.telemetry = false;
          fs.writeFileSync(rcPath, JSON.stringify(rc, null, 2), 'utf8');
          consola.success('Local incident telemetry disabled. Zero incident files will be captured.');
          return;
        }

        // Default: status
        const isOptedIn = isTelemetryOptedIn();
        const envActive = process.env.TERRAIN_TELEMETRY === '1' || process.env.TERRAIN_TELEMETRY === 'true';
        const configActive = rc.telemetry === true;

        console.log(`\n${chalk.bold('🔒 RN-TERRAIN PRIVACY & TELEMETRY STATUS')}`);
        console.log(chalk.dim('────────────────────────────────────────────────────────'));
        console.log(`  Current State:        ${isOptedIn ? chalk.green.bold('OPTED-IN (ACTIVE)') : chalk.yellow.bold('DISABLED (DEFAULT - ZERO CAPTURE)')}`);
        console.log(`  Environment Override: ${envActive ? chalk.green('TERRAIN_TELEMETRY=1') : chalk.dim('None')}`);
        console.log(`  Local Config (.terrainrc): ${configActive ? chalk.green('telemetry: true') : chalk.dim('telemetry: false / unset')}`);
        console.log(`  Remote Network Calls: ${chalk.green.bold('0 (Strictly Zero - No Cloud Endpoints)')}`);
        console.log(`  Local Disk Storage:   ${isOptedIn ? chalk.cyan('.terrain/incidents/ (.gitignore\'d)') : chalk.dim('Dormant (0 files created)')}`);
        console.log('');
        console.log(chalk.dim('  Enable local error pattern auditing:  rn-terrain telemetry enable'));
        console.log(chalk.dim('  Disable completely:                   rn-terrain telemetry disable\n'));
      } catch (e: any) {
        consola.error('Failed to configure telemetry:', e.message);
      }
    });

  cli
    .command('swarm:status', 'Inspect P2P Worktree Antibody Gossip Bus status and active worktrees')
    .action(() => {
      try {
        const bus = new AntibodyGossipBus();
        const status = bus.getStatus();

        console.log(`\n${chalk.bold('🧬 P2P WORKTREE ANTIBODY GOSSIP BUS STATUS')}`);
        console.log(chalk.dim('────────────────────────────────────────────────────────'));
        console.log(`  Engine:               ${status.walMode ? chalk.green('SQLite WAL Mode') : chalk.yellow('JSON WAL Fallback')}`);
        console.log(`  Storage Path:         ${chalk.cyan(status.dbPath)}`);
        console.log(`  Total Antibodies:     ${chalk.bold(status.totalAntibodies)}`);
        console.log(`  Active Worktrees:     ${status.activeWorktrees.length > 0 ? status.activeWorktrees.join(', ') : chalk.dim('None')}`);
        console.log(`  Zero-Latency Sync:    ${chalk.green('✓ Real-time P2P Shard Propagation')}\n`);
      } catch (e: any) {
        consola.error('Failed to query swarm status:', e.message);
      }
    });

  cli
    .command('swarm:antibodies [package]', 'List active swarm antibodies across worktrees')
    .action((packageName) => {
      try {
        const bus = new AntibodyGossipBus();
        const antibodies = bus.queryAntibodies(packageName ? { package: packageName } : undefined);

        console.log(`\n${chalk.bold('🛡️  ACTIVE SWARM ANTIBODY REGISTRY')}`);
        console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));

        if (antibodies.length === 0) {
          console.log(chalk.dim('  No active antibodies found. All swarm worktrees operating cleanly.\n'));
          return;
        }

        for (const a of antibodies) {
          console.log(`  ${chalk.red.bold('• ' + a.severedSymbol)} (${chalk.cyan(a.culpritPackage)}) from worktree ${chalk.bold(a.worktreeOrigin)}`);
          console.log(`    ${chalk.dim('Remediation:')} ${chalk.green(a.canonicalRemediation)}`);
          console.log(`    ${chalk.dim('Discovered:')}  ${a.discoveredAt}`);
          console.log('');
        }
      } catch (e: any) {
        consola.error('Failed to query antibodies:', e.message);
      }
    });
}
