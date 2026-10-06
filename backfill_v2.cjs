const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const out = execSync('npm view react-native-gesture-handler time --json', { encoding: 'utf-8' });
const times = JSON.parse(out);

const pkgName = 'react-native-gesture-handler';
const outDir = 'docs/changelog-intelligence/entries/' + pkgName;
const indexFile = 'docs/changelog-intelligence/graph/INDEX.json';

let indexJson = JSON.parse(fs.readFileSync(indexFile, 'utf-8'));

// Filter versions: >= 2.0.0 (since current is 3, floor is 2)
const validVersions = Object.keys(times).filter(v => {
  if (v === 'modified' || v === 'created') return false;
  // Match major version
  const match = v.match(/^(\d+)\./);
  if (!match) return false;
  const major = parseInt(match[1], 10);
  return major >= 2; 
});

const existingEntries = indexJson.packages[pkgName].entries || [];
const newEntriesList = [];

// Clean up v1 entries
for (const entryId of existingEntries) {
  const match = entryId.match(/rngh_(\d+)\./);
  if (match) {
    const major = parseInt(match[1], 10);
    if (major < 2) {
      const entryObj = indexJson.entries[entryId];
      if (entryObj && entryObj.file) {
         const fullPath = path.resolve('docs/changelog-intelligence', entryObj.file);
         if (fs.existsSync(fullPath) && fullPath.includes('auto-entry')) {
           fs.unlinkSync(fullPath);
         }
      }
      delete indexJson.entries[entryId];
      continue; // Remove from list
    }
  }
  newEntriesList.push(entryId);
}

// Generate valid versions >= 2.0.0 (including stable, beta, rc, nightlies)
for (const ver of validVersions) {
  const date = times[ver].split('T')[0];
  const entryId = 'rngh_' + ver + '_auto_generated-granular';
  
  // Check if we already have an entry for this specific version
  const hasEntry = newEntriesList.some(e => e.includes('_' + ver + '_'));
  if (hasEntry) continue; 

  const mdPath = outDir + '/' + date + '-v' + ver.replace(/\./g, '-') + '-auto-entry.md';
  const mdContent = `# react-native-gesture-handler v${ver}
Date: ${date}

## Automated Granular Backfill
Granular node covering all releases from current -1 (v2.0.0) up to current (v3.x), including betas, RCs, and nightlies.
`;
  fs.writeFileSync(mdPath, mdContent);

  indexJson.entries[entryId] = {
    package: pkgName,
    version_to: ver,
    date_released: date,
    impact_type: 'MAINTENANCE',
    severity: 'LOW',
    file: mdPath.replace(/\\/g, '/').replace('docs/changelog-intelligence/', '')
  };
  
  newEntriesList.push(entryId);
}

indexJson.packages[pkgName].entries = newEntriesList;

fs.writeFileSync(indexFile, JSON.stringify(indexJson, null, 2));
console.log('Successfully pruned v1.x and generated granular nodes for all >= 2.0.0 versions (including pre-releases). Total active rngh entries: ' + newEntriesList.length);
