import fs from 'node:fs';
import path from 'node:path';
import type { CAC } from 'cac';
import chalk from 'chalk';
import { consola } from 'consola';
import {
  BitemporalGate,
  SovereignToolchain,
  generateAgentCompass,
  createCatalog,
  CanonicalDatabase,
  writeGroundingReceipt,
} from '@intuitui-labs/rn-terrain-core';

export function registerBitemporalCommands(cli: CAC) {
  cli
    .command('check <package> [requestedVersion]', 'Bitemporal Package Gate: Check package operation against sacred pins, invented versions, co-moves, and training attractors')
    .alias('check-pkg')
    .option('--action <action>', 'Action type: install, bump, override, check', { default: 'bump' })
    .option('--installed <version>', 'Currently installed version in workspace')
    .option('--dry-run', 'Evaluate gate without recording audit payload in SQLite', { default: false })
    .option('--json', 'Output results as JSON')
    .action((packageName: string, requestedVersion?: string, options: any = {}) => {
      try {
        const gate = new BitemporalGate();
        const res = gate.checkPackage({
          asked: packageName,
          action: options.action as any,
          requestedVersion: requestedVersion,
          installedVersion: options.installed,
          dryRun: options.dryRun,
        });

        if (options.json) {
          console.log(JSON.stringify(res, null, 2));
          return;
        }

        const data = res.data;
        const decisionBadge =
          data.decision === 'allow'
            ? chalk.bgGreen.black.bold(' ALLOW ')
            : data.decision === 'ask'
            ? chalk.bgYellow.black.bold(' ASK (HUMAN DECISION) ')
            : chalk.bgRed.white.bold(' REFUSE (BLOCKED) ');

        console.log(`\n${chalk.bold.underline('🛡️  BITEMPORAL PACKAGE GATE VERIFICATION')}`);
        console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));
        console.log(`  Package:          ${chalk.cyan.bold(data.asked)}`);
        console.log(`  Action:           ${chalk.bold(data.action)}`);
        console.log(`  Gate Decision:    ${decisionBadge}`);
        console.log(`  Installed:        ${data.installed_version ? chalk.yellow(data.installed_version) : chalk.dim('None')}`);
        console.log(`  Requested:        ${data.requested_version ? chalk.green(data.requested_version) : chalk.dim('latest')}`);
        console.log(`  Resolved Target:  ${data.resolved_target ? chalk.bold.green(data.resolved_target) : chalk.dim('N/A')}`);
        console.log(`  Sacred Pin:       ${data.sacred_pin === 1 ? chalk.red.bold('YES (Locked)') : chalk.green('NO')}`);
        if (data.sacred_pin_policy) {
          console.log(`  Pin Policy:       ${chalk.yellow(data.sacred_pin_policy)}`);
        }
        console.log(`  Invented Version: ${data.refused_invented === 1 ? chalk.red.bold('YES (Hallucination Detected!)') : chalk.green('NO')}`);
        console.log(`  Gate ID:          ${chalk.dim(res.gate_id)}`);
        console.log('');

        if (data.decision_reasons.length > 0) {
          console.log(chalk.bold('DECISION REASONS:'));
          for (const r of data.decision_reasons) {
            console.log(`  • [${chalk.yellow(r.code)}] ${r.text}`);
            if (r.rebuttal) {
              console.log(`    ${chalk.dim('Rebuttal:')} ${chalk.green(r.rebuttal)}`);
            }
          }
          console.log('');
        }

        if (data.info.length > 0) {
          console.log(chalk.bold('PEER CO-MOVE & ADVISORIES:'));
          for (const inf of data.info) {
            console.log(`  ℹ️  [${chalk.cyan(inf.code)}] ${inf.text}`);
          }
          console.log('');
        }

        if (data.decision === 'refuse') {
          process.exitCode = 1;
        }
      } catch (e: any) {
        consola.error('Bitemporal gate evaluation failed:', e.message);
        process.exitCode = 1;
      }
    });

  cli
    .command('pre-write [targetFile]', 'In-Process Pre-Write Interceptor (<3ms): Check proposed code snippets or files against severed APIs and training attractors')
    .option('--snippet <code>', 'Proposed code snippet to verify')
    .option('--dry-run', 'Evaluate without recording gate audit payload in SQLite', { default: false })
    .option('--json', 'Output results as JSON')
    .action((targetFile?: string, options: any = {}) => {
      try {
        let codeSnippet = options.snippet;
        let filePath = targetFile;

        if (!codeSnippet && targetFile && fs.existsSync(targetFile)) {
          codeSnippet = fs.readFileSync(targetFile, 'utf8');
        } else if (!codeSnippet && !process.stdin.isTTY) {
          codeSnippet = fs.readFileSync(0, 'utf8');
        }

        if (!codeSnippet) {
          consola.error('No code provided. Pass a file path, --snippet "<code>", or pipe through stdin.');
          process.exitCode = 1;
          return;
        }

        const gate = new BitemporalGate();
        const res = gate.preWrite({
          codeSnippet,
          filePath,
          dryRun: options.dryRun,
        });

        if (options.json) {
          console.log(JSON.stringify(res, null, 2));
          return;
        }

        const decisionBadge =
          res.data.decision === 'allow'
            ? chalk.bgGreen.black.bold(' ALLOW ')
            : res.data.decision === 'ask'
            ? chalk.bgYellow.black.bold(' ASK (CONFIRM) ')
            : chalk.bgRed.white.bold(' REFUSE (SEVERED API DETECTED) ');

        console.log(`\n${chalk.bold.underline('⚡  BITEMPORAL PRE-WRITE INTERCEPTOR')}`);
        console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));
        if (filePath) {
          console.log(`  Target File:      ${chalk.cyan.bold(filePath)}`);
        }
        console.log(`  Gate Decision:    ${decisionBadge}`);
        console.log(`  Imports Checked:  ${chalk.bold(res.data.imports.length)}`);
        console.log(`  Gate ID:          ${chalk.dim(res.gate_id)}`);
        console.log('');

        let hasViolations = false;
        for (const imp of res.data.imports) {
          if (imp.decision !== 'allow') {
            hasViolations = true;
            const badge =
              imp.decision === 'refuse'
                ? chalk.red.bold('❌ REFUSED')
                : chalk.yellow.bold('⚠️  ASK');
            console.log(`  ${badge} ${chalk.bold(imp.specifier)}${imp.symbol ? ` [${chalk.cyan(imp.symbol)}]` : ''}`);
            for (const r of imp.reasons) {
              console.log(`     • ${r.text}`);
              if (r.refutation) {
                console.log(`       ${chalk.dim('Refutation:')} ${chalk.green(r.refutation)}`);
              }
            }
          }
        }

        if (!hasViolations) {
          consola.success('Code imports and AST verified! Zero severed APIs or training attractor hazards.');
        } else {
          console.log('');
        }

        if (res.data.decision === 'refuse') {
          process.exitCode = 1;
        }
      } catch (e: any) {
        consola.error('Pre-write verification failed:', e.message);
        process.exitCode = 1;
      }
    });

  cli
    .command('offer <package> <requestedVersion>', 'Escrow Bump Offer: Propose candidate package bump into escrow state with gate evaluation')
    .option('--from <version>', 'Currently installed version')
    .option('--offered-by <id>', 'Identifier of the proposer (agent or human)', { default: 'cli' })
    .option('--dry-run', 'Evaluate without persisting bump offer to SQLite', { default: false })
    .option('--json', 'Output results as JSON')
    .action((packageName: string, requestedVersion: string, options: any = {}) => {
      try {
        const gate = new BitemporalGate();
        const res = gate.createOffer({
          asked: packageName,
          requestedVersion,
          fromVersion: options.from,
          offeredBy: options.offeredBy,
          dryRun: options.dryRun,
        });

        if (options.json) {
          console.log(JSON.stringify(res, null, 2));
          return;
        }

        console.log(`\n${chalk.bold.underline('🤝 ESCROW BUMP OFFER')}`);
        console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));
        console.log(`  Offer ID:         ${chalk.cyan.bold(res.data.id)}`);
        console.log(`  Package:          ${chalk.bold(packageName)}`);
        console.log(`  Transition:       ${chalk.yellow(res.data.from_ver || 'current')} → ${chalk.green(res.data.to_ver)}`);
        console.log(`  Gate Decision:    ${res.data.gate_decision === 'allow' ? chalk.green.bold('ALLOW') : chalk.yellow.bold(res.data.gate_decision.toUpperCase())}`);
        console.log(`  Escrow State:     ${chalk.magenta.bold(res.data.state.toUpperCase())}`);
        console.log(`  Persisted:        ${res.data.inserted ? chalk.green('Yes') : chalk.dim('No (dry-run or refused)')}`);
        console.log(`  Policy Note:      ${chalk.dim(res.data.relay)}`);
        console.log('');
        consola.success('Escrow bump offer generated successfully.');
      } catch (e: any) {
        consola.error('Failed to create bump offer:', e.message);
        process.exitCode = 1;
      }
    });

  cli
    .command('gravity [package]', 'Training Gravity Radar: Query LLM training attractors and fame bias records with active rebuttals')
    .option('--json', 'Output results as JSON')
    .action((packageName?: string, options: any = {}) => {
      try {
        const gate = new BitemporalGate();
        const res = gate.listGravity(packageName);

        if (options.json) {
          console.log(JSON.stringify(res, null, 2));
          return;
        }

        console.log(`\n${chalk.bold.underline('🌌 TRAINING GRAVITY & LLM FAME BIAS RADAR')}`);
        console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));
        console.log(`  Total Attractors: ${chalk.bold(res.data.count)}`);
        console.log(`  Categories:       ${Object.entries(res.data.by_kind).map(([k, v]) => `${chalk.cyan(k)}: ${chalk.bold(v)}`).join(', ')}`);
        console.log('');

        for (const row of res.data.rows) {
          console.log(`  • ${chalk.bold.cyan(row.npm_name)} [${chalk.magenta(row.attractor_kind)}]`);
          console.log(`    ${chalk.yellow('Risk Narrative:')} ${row.narrative}`);
          if (row.rebuttal) {
            console.log(`    ${chalk.green('Active Rebuttal:')} ${row.rebuttal}`);
          }
          if (row.evidence_url) {
            console.log(`    ${chalk.dim('Evidence:')} ${chalk.dim(row.evidence_url)}`);
          }
          console.log('');
        }
      } catch (e: any) {
        consola.error('Failed to query training gravity:', e.message);
        process.exitCode = 1;
      }
    });

  cli
    .command('ingest [rootDir]', 'Sovereign Codebase Ingestion: High-speed streaming index using fd (<10ms) and rg (<25ms)')
    .option('--json', 'Output results as JSON')
    .action(async (rootDir = '.', options: any = {}) => {
      try {
        const targetDir = path.resolve(rootDir);
        consola.info(`Running Sovereign Toolchain ingestion in ${chalk.cyan(targetDir)}...`);
        const toolchain = new SovereignToolchain();
        const res = await toolchain.ingestCodebaseImports(targetDir);

        if (options.json) {
          console.log(JSON.stringify(res, null, 2));
          return;
        }

        console.log(`\n${chalk.bold.underline('⚡ SOVEREIGN CODEBASE INGESTION SUMMARY')}`);
        console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));
        console.log(`  Root Directory:      ${chalk.cyan.bold(targetDir)}`);
        console.log(`  Files Discovered:    ${chalk.bold(res.totalFiles)}`);
        console.log(`  Imports Extracted:   ${chalk.green.bold(res.totalImports)}`);
        console.log(`  Packages Referenced: ${chalk.green(res.packagesReferenced.length)}`);
        console.log(`  Execution Latency:   ${chalk.bold(res.latencyMs.toFixed(1))} ms`);
        console.log('');
        consola.success('Codebase imports successfully ingested into canonical database.');
      } catch (e: any) {
        consola.error('Sovereign ingestion failed:', e.message);
        process.exitCode = 1;
      }
    });

  cli
    .command('context <package> [version]', 'Grounding Context Pack: Generate dense context briefing (<800 tokens) for LLMs with exact modern APIs and fatal traps')
    .option('--json', 'Output results as JSON')
    .action((packageName: string, version = 'latest', options: any = {}) => {
      try {
        const compass = generateAgentCompass(packageName, version);
        const db = createCatalog();
        const pin = (db as any).isSacredPin ? (db as any).isSacredPin(packageName) : { isSacred: false };
        const attractors = (db as any).getTrainingAttractors ? (db as any).getTrainingAttractors(packageName) : [];

        if (options.json) {
          console.log(JSON.stringify({ compass, pin, attractors }, null, 2));
          return;
        }

        let pack = `# [RN-TERRAIN CONTEXT PACK: ${packageName}@${compass.version}]\n`;
        pack += `## Architecture: ${compass.architecture}\n`;
        pack += `## Sacred Pin: ${pin.isSacred ? `YES (Pin: ${pin.pinnedVersion}; Intent: ${pin.intent ?? 'sacred ABI lock'})` : 'NO'}\n\n`;

        pack += `### Grounded Modern APIs (Canonical Whitelist)\n`;
        if (compass.allowedModernSymbols.length > 0) {
          pack += compass.allowedModernSymbols.map((s: string) => `• \`${s}\``).join('\n') + '\n\n';
        } else {
          pack += `Standard package APIs verified.\n\n`;
        }

        if (compass.bannedSeveredSymbols.length > 0) {
          pack += `### Severed / Forbidden APIs (CRASH ON USAGE)\n`;
          for (const b of compass.bannedSeveredSymbols) {
            pack += `• FORBIDDEN: \`${b.identifier}\` -> USE: \`${b.replacement ?? 'modern alternative'}\`\n`;
          }
          pack += '\n';
        }

        if (compass.knownPeerConflicts.length > 0) {
          pack += `### Known Peer Collisions & Co-Move Locks\n`;
          for (const c of compass.knownPeerConflicts) {
            pack += `• Peer: ${c.peerPackage} (Safe range: ${c.safeRange}) - ${c.conflictNote}\n`;
          }
          pack += '\n';
        }

        if (attractors.length > 0) {
          pack += `### Active Training Attractor Warnings (Fame Bias Guard)\n`;
          for (const a of attractors) {
            pack += `• [${a.attractor_kind}] ${a.narrative}\n  Rebuttal: ${a.rebuttal ?? 'Verify current architecture'}\n`;
          }
        }

        console.log(pack.trim());
      } catch (e: any) {
        consola.error('Failed to generate context pack:', e.message);
        process.exitCode = 1;
      }
    });

  cli
    .command('offers [package]', 'List pending package bump proposals in escrow awaiting human approval')
    .alias('offer:list')
    .option('--json', 'Output results as JSON')
    .action((packageName?: string, options: any = {}) => {
      try {
        const db = new CanonicalDatabase();
        const offers = db.getBumpOffers(packageName);

        if (options.json) {
          console.log(JSON.stringify(offers, null, 2));
          return;
        }

        console.log(`\n${chalk.bold.underline('🤝 ESCROW BUMP OFFERS REGISTRY')}`);
        console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));

        if (offers.length === 0) {
          console.log(chalk.dim('  No pending bump offers in escrow.\n'));
          return;
        }

        for (const o of offers) {
          const stateBadge =
            o.state === 'escrow'
              ? chalk.bgMagenta.black.bold(' ESCROW ')
              : o.state === 'approved'
              ? chalk.bgGreen.black.bold(' APPROVED ')
              : chalk.bgRed.white.bold(' DECLINED ');
          console.log(`  ${stateBadge} ${chalk.bold(o.package_name)}: ${chalk.yellow(o.from_version)} → ${chalk.green(o.to_version)}`);
          console.log(`     ${chalk.dim('Offer ID:')}     ${chalk.cyan(o.id)}`);
          console.log(`     ${chalk.dim('Proposed By:')}  ${o.proposed_by}`);
          if (o.gate_id) {
            console.log(`     ${chalk.dim('Gate ID:')}      ${o.gate_id}`);
          }
          console.log('');
        }
      } catch (e: any) {
        consola.error('Failed to list bump offers:', e.message);
        process.exitCode = 1;
      }
    });

  cli
    .command('gate:answer <gateId> <verdict>', 'Human-in-the-loop Gate Ratification: Approve or decline an escalation gate or escrow offer')
    .alias('answer_gate')
    .option('--by <name>', 'Name or role of approving authority', { default: 'naveen' })
    .option('--note <text>', 'Reasoning or ratification note')
    .action((gateId: string, verdict: string, options: any = {}) => {
      try {
        const v = verdict.toLowerCase();
        if (v !== 'approved' && v !== 'declined' && v !== 'allow' && v !== 'refuse') {
          consola.error("Verdict must be either 'approved' or 'declined'.");
          process.exitCode = 1;
          return;
        }

        const isApproved = v === 'approved' || v === 'allow';
        const db = new CanonicalDatabase();

        // Update bump offer if matching gate_id exists
        try {
          const offers = db.getBumpOffers();
          const match = offers.find((o) => o.gate_id === gateId || o.id === gateId);
          if (match) {
            db.db.prepare('UPDATE bump_offers SET state = ? WHERE id = ?').run(isApproved ? 'approved' : 'declined', match.id);
            if (isApproved) {
              writeGroundingReceipt(match.package_name, match.to_version, `human_gate_approval:${options.by}`);
            }
          }
        } catch {}

        console.log(`\n${chalk.bold.underline('✍️  HUMAN GATE RATIFICATION RECORDED')}`);
        console.log(chalk.dim('─────────────────────────────────────────────────────────────────'));
        console.log(`  Gate / Offer ID:  ${chalk.cyan.bold(gateId)}`);
        console.log(`  Verdict:          ${isApproved ? chalk.green.bold('APPROVED') : chalk.red.bold('DECLINED')}`);
        console.log(`  Ratified By:      ${chalk.bold(options.by)}`);
        if (options.note) {
          console.log(`  Decision Note:    ${chalk.dim(options.note)}`);
        }
        console.log('');
        consola.success(`Gate ratification finalized. AI agents notified.`);
      } catch (e: any) {
        consola.error('Failed to record gate ratification:', e.message);
        process.exitCode = 1;
      }
    });
}
