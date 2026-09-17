import { collectSource, ConservativeOfferExtractor, HttpSourceFetcher, FileSnapshotStore, FileChangeLog, FileFactLog } from '@intuitui-labs/openeval';
import { sources } from '../data/sources';

const fetcher = new HttpSourceFetcher();
const extractor = new ConservativeOfferExtractor();
const store = new FileSnapshotStore('.atlas-cache');
const changeLog = new FileChangeLog('.atlas-cache/changes.jsonl');
const factLog = new FileFactLog('.atlas-cache/facts.jsonl');
async function main() {
  const changes = [];
  for (const source of sources) { const change = await collectSource(source, fetcher, extractor, store); changes.push(change); await changeLog.append(change); await factLog.append(change.candidateFacts, change.detectedAt); }
  console.log(JSON.stringify({ generatedAt: new Date().toISOString(), mode: 'review-only', changes }, null, 2));
}
main().catch((error) => { console.error(error); process.exitCode = 1; });


