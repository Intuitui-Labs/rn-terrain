import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { projectKernel } from './project-kernel.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../data/packages');

// Parse CLI arguments
const args = process.argv.slice(2);
let packageJsonPath = 'c:/x/apps/gurudevi-mobile/package.json';
const scanRoots = [];

for (let i = 0; i < args.length; i++) {
  if (args[i] === '--pkg' && args[i + 1]) {
    packageJsonPath = args[i + 1];
    i++;
  } else if (args[i] === '--target' && args[i + 1]) {
    scanRoots.push(args[i + 1]);
    i++;
  }
}

if (scanRoots.length === 0) {
  scanRoots.push('c:/x/apps/gurudevi-mobile/src');
  scanRoots.push('c:/x/apps/gurudevi-mobile/app');
  scanRoots.push('c:/x/packages/ui/src');
  scanRoots.push('c:/x/packages/core/src');
}

if (!fs.existsSync(packageJsonPath)) {
  console.error(`package.json not found: ${packageJsonPath}`);
  process.exit(1);
}

const pkgJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
const allDeps = {
  ...pkgJson.dependencies,
  ...pkgJson.devDependencies,
};

console.log('================================================================');
console.log('       TCDI: DYNAMIC SLIDING-KERNEL REPOSITORY AUDIT            ');
console.log('================================================================');
console.log(`📦 Root: ${packageJsonPath}`);
console.log(`🎯 Targets: ${scanRoots.join(', ')}\n`);

// Load all available package shard definitions
const availableShards = fs
  .readdirSync(DATA_DIR)
  .filter((f) => f.endsWith('.json'))
  .map((f) => f.replace('.json', ''));

const activeProjections = [];

for (const shardPkg of availableShards) {
  if (allDeps[shardPkg]) {
    const rawVersion = allDeps[shardPkg];
    const projection = projectKernel(shardPkg, rawVersion);
    activeProjections.push(projection);
  }
}

console.log(`Matched ${activeProjections.length} active pilot packages in package.json:\n`);
for (const p of activeProjections) {
  console.log(`  - ${p.package.padEnd(30)} installed: ${p.target_version.padEnd(10)} [${p.category}]`);
}
console.log('\nScanning codebase against dynamically projected kernel rules...\n');

const findings = {
  REMOVED: [],
  DEPRECATED: [],
  BROKEN: [],
  OPPORTUNITY: [],
};

// Scan files recursively
function scanDir(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name).replace(/\\/g, '/');

    if (entry.isDirectory()) {
      if (
        entry.name === 'node_modules' ||
        entry.name === '.git' ||
        entry.name === 'dist' ||
        entry.name === '.turbo' ||
        entry.name === 'build' ||
        entry.name === 'output' ||
        entry.name === 'archive' ||
        entry.name === 'android' ||
        entry.name === 'ios' ||
        entry.name === '.expo' ||
        entry.name === 'assets' ||
        entry.name.startsWith('dist-') ||
        entry.name === 'reports' ||
        entry.name === 'test-results' ||
        entry.name === 'runtime-fixtures'
      ) {
        continue;
      }
      scanDir(fullPath);
    } else if (entry.isFile()) {
      if (!/\.(tsx|ts|jsx|js|css)$/.test(entry.name)) continue;

      try {
        const content = fs.readFileSync(fullPath, 'utf8');

        for (const proj of activeProjections) {
          // Check REMOVED (Fatal)
          for (const feat of proj.kernel.REMOVED) {
            if (feat.code_smell) {
              const reg = new RegExp(feat.code_smell);
              if (reg.test(content)) {
                findings.REMOVED.push({
                  package: proj.package,
                  feature: feat.display,
                  file: fullPath,
                  rules: feat.rules,
                });
              }
            }
          }

          // Check DEPRECATED (Warning)
          for (const feat of proj.kernel.DEPRECATED) {
            if (feat.code_smell) {
              const reg = new RegExp(feat.code_smell);
              if (reg.test(content)) {
                findings.DEPRECATED.push({
                  package: proj.package,
                  feature: feat.display,
                  file: fullPath,
                  rules: feat.rules,
                });
              }
            }
          }

          // Check BROKEN (Regressed / Defective)
          for (const feat of proj.kernel.BROKEN) {
            if (feat.code_smell) {
              const reg = new RegExp(feat.code_smell);
              if (reg.test(content)) {
                findings.BROKEN.push({
                  package: proj.package,
                  feature: feat.display,
                  file: fullPath,
                  rules: feat.rules,
                  broken_in: feat.broken_in,
                  fixed_in: feat.fixed_in,
                  dev_dance: feat.dev_dance,
                });
              }
            }
          }

          // Check Code Smells in FUNCTIONAL or NEW (Type bypasses, JS timers, missing recovery)
          for (const feat of [...proj.kernel.FUNCTIONAL, ...proj.kernel.NEW]) {
            if (feat.code_smell) {
              const reg = new RegExp(feat.code_smell);
              if (reg.test(content)) {
                findings.OPPORTUNITY.push({
                  package: proj.package,
                  feature: feat.display,
                  file: fullPath,
                  rules: feat.rules,
                });
              }
            }
          }
        }
      } catch {
        // ignore unreadable
      }
    }
  }
}

for (const root of scanRoots) {
  scanDir(root);
}

console.log('================================================================');
console.log('                    DYNAMIC AUDIT REPORT                        ');
console.log('================================================================\n');

console.log(`🚫 1. FATAL / REMOVED APIS IN ACTIVE CODE [${findings.REMOVED.length} detected]`);
console.log('----------------------------------------------------------------');
if (findings.REMOVED.length === 0) {
  console.log('  ✅ Clean. Zero removed/dead APIs found.\n');
} else {
  for (const f of findings.REMOVED) {
    console.log(`  [CRITICAL] ${f.package}: ${f.feature}`);
    console.log(`    📁 File:        ${f.file}`);
    console.log(`    💡 Replacement: ${f.rules.replacement || 'Remove immediately'}\n`);
  }
}

console.log(`⚠️ 2. DEPRECATED APIS (ACTIVE GRACE PERIOD) [${findings.DEPRECATED.length} detected]`);
console.log('----------------------------------------------------------------');
if (findings.DEPRECATED.length === 0) {
  console.log('  ✅ Clean. Zero deprecated APIs found.\n');
} else {
  for (const f of findings.DEPRECATED) {
    console.log(`  [DEPRECATED] ${f.package}: ${f.feature}`);
    console.log(`    📁 File:        ${f.file}`);
    console.log(`    💡 Replacement: ${f.rules.replacement || 'Migrate to standard'}\n`);
  }
}

console.log(`💥 3. BROKEN / REGRESSED APIS (MANDATORY DEV DANCE WORKAROUND REQUIRED) [${findings.BROKEN.length} detected]`);
console.log('----------------------------------------------------------------');
if (findings.BROKEN.length === 0) {
  console.log('  ✅ Clean. Zero active broken/regressed API patterns detected.\n');
} else {
  for (const f of findings.BROKEN) {
    console.log(`  [BROKEN] ${f.package}: ${f.feature}`);
    console.log(`    📁 File:        ${f.file}`);
    console.log(`    ⚠️ Status:      Broken in ${f.broken_in} (Fixed in: ${f.fixed_in})`);
    console.log(`    💃 Dev Dance:   ${f.dev_dance || 'No documented workaround'}\n`);
  }
}

console.log(`💎 4. OPPORTUNITIES & CODE SMELLS [${findings.OPPORTUNITY.length} detected]`);
console.log('----------------------------------------------------------------');
if (findings.OPPORTUNITY.length === 0) {
  console.log('  ✅ Clean. No unadopted capabilities or legacy type workarounds detected.\n');
} else {
  for (const f of findings.OPPORTUNITY) {
    console.log(`  [OPPORTUNITY] ${f.package}: ${f.feature}`);
    console.log(`    📁 File:    ${f.file}`);
    console.log(`    💡 Action:  ${f.rules.replaces_custom_code || f.rules.replacement || f.rules.benefit}\n`);
  }
}

console.log('================================================================');
console.log(`Audit Complete. (Fatal: ${findings.REMOVED.length}, Deprecated: ${findings.DEPRECATED.length}, Broken: ${findings.BROKEN.length}, Opportunities: ${findings.OPPORTUNITY.length})`);
console.log('================================================================\n');
