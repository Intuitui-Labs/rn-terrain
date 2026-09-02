export type SourceKind = 'official_catalogue' | 'provider_page' | 'terms' | 'community' | 'rss';
export type ChangeKind = 'new' | 'changed' | 'unchanged' | 'removed' | 'error';

export interface SourceDefinition { id: string; url: string; kind: SourceKind; offerId?: string; authoritative: boolean; }
export interface SourceSnapshot { sourceId: string; url: string; fetchedAt: string; status: number; content: string; contentHash: string; adapter: string; }
export interface CandidateFact { offerId?: string; field: string; value: string | string[]; sourceId: string; sourceUrl: string; confidence: 'high' | 'medium' | 'low'; requiresReview: boolean; }
export interface IngestionChange { sourceId: string; url: string; kind: ChangeKind; detectedAt: string; previousHash?: string; currentHash?: string; candidateFacts: CandidateFact[]; error?: string; }

export interface SourceFetcher { name: string; fetch(source: SourceDefinition): Promise<SourceSnapshot>; }
export interface FactExtractor { name: string; extract(source: SourceDefinition, snapshot: SourceSnapshot): Promise<CandidateFact[]>; }
export interface SnapshotStore { get(sourceId: string): Promise<SourceSnapshot | null>; put(snapshot: SourceSnapshot): Promise<void>; }

export async function collectSource(source: SourceDefinition, fetcher: SourceFetcher, extractor: FactExtractor, store: SnapshotStore, now = new Date()): Promise<IngestionChange> {
  try {
    const snapshot = await fetcher.fetch(source);
    const previous = await store.get(source.id);
    const kind: ChangeKind = !previous ? 'new' : previous.contentHash === snapshot.contentHash ? 'unchanged' : 'changed';
    const candidateFacts = kind === 'unchanged' ? [] : await extractor.extract(source, snapshot);
    await store.put(snapshot);
    return { sourceId: source.id, url: source.url, kind, detectedAt: now.toISOString(), previousHash: previous?.contentHash, currentHash: snapshot.contentHash, candidateFacts };
  } catch (error) {
    return { sourceId: source.id, url: source.url, kind: 'error', detectedAt: now.toISOString(), candidateFacts: [], error: error instanceof Error ? error.message : String(error) };
  }
}

export class HttpSourceFetcher implements SourceFetcher {
  name = 'http';
  async fetch(source: SourceDefinition): Promise<SourceSnapshot> {
    const response = await fetch(source.url, { headers: { 'user-agent': 'GitHub-Atlas-source-monitor/0.1' } });
    const content = await response.text();
    return { sourceId: source.id, url: source.url, fetchedAt: new Date().toISOString(), status: response.status, content, contentHash: await sha256(content), adapter: this.name };
  }
}

export class InMemorySnapshotStore implements SnapshotStore {
  private snapshots = new Map<string, SourceSnapshot>();
  async get(sourceId: string) { return this.snapshots.get(sourceId) ?? null; }
  async put(snapshot: SourceSnapshot) { this.snapshots.set(snapshot.sourceId, snapshot); }
}

export class FileSnapshotStore implements SnapshotStore {
  constructor(private readonly directory: string) {}
  async get(sourceId: string) {
    try { return JSON.parse(await (await import('node:fs/promises')).readFile(`${this.directory}/latest/${sourceId}.json`, 'utf8')) as SourceSnapshot; }
    catch { return null; }
  }
  async put(snapshot: SourceSnapshot) {
    const fs = await import('node:fs/promises');
    const sourceDirectory = `${this.directory}/snapshots/${snapshot.sourceId}`;
    await fs.mkdir(sourceDirectory, { recursive: true });
    await fs.mkdir(`${this.directory}/latest`, { recursive: true });
    const filename = `${snapshot.fetchedAt.replace(/[:.]/g, '-')}-${snapshot.contentHash}.json`;
    await fs.writeFile(`${sourceDirectory}/${filename}`, JSON.stringify(snapshot, null, 2));
    await fs.writeFile(`${this.directory}/latest/${snapshot.sourceId}.json`, JSON.stringify(snapshot, null, 2));
  }
}

export interface ChangeStore { append(change: IngestionChange): Promise<void>; }
export interface FactStore { append(facts: CandidateFact[], detectedAt: string): Promise<void>; }

export class FileChangeLog implements ChangeStore {
  constructor(private readonly file: string) {}
  async append(change: IngestionChange) {
    const fs = await import('node:fs/promises');
    await fs.mkdir((await import('node:path')).dirname(this.file), { recursive: true });
    await fs.appendFile(this.file, `${JSON.stringify(change)}\n`);
  }
}

export class FileFactLog implements FactStore {
  constructor(private readonly file: string) {}
  async append(facts: CandidateFact[], detectedAt: string) {
    if (!facts.length) return;
    const fs = await import('node:fs/promises');
    await fs.mkdir((await import('node:path')).dirname(this.file), { recursive: true });
    for (const fact of facts) await fs.appendFile(this.file, `${JSON.stringify({ ...fact, detectedAt })}\n`);
  }
}

export class ConservativeOfferExtractor implements FactExtractor {
  name = 'conservative-text';
  async extract(source: SourceDefinition, snapshot: SourceSnapshot): Promise<CandidateFact[]> {
    const text = snapshot.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
    const facts: CandidateFact[] = [];
    const patterns: Array<[string, RegExp]> = [['duration', /(?:for|up to)\s+(\d+\s+(?:months?|years?))/i], ['credit_or_limit', /\$\s?([\d,]+)\s+(?:in\s+)?(?:platform\s+)?credit/i], ['availability_signal', /\b(temporarily paused|winding down|no longer available|available to verified students)\b/i]];
    for (const [field, pattern] of patterns) { const match = text.match(pattern); if (match?.[1]) facts.push({ offerId: source.offerId, field, value: match[1], sourceId: source.id, sourceUrl: source.url, confidence: source.authoritative ? 'high' : 'low', requiresReview: true }); }
    return facts;
  }
}

export async function sha256(value: string): Promise<string> {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return Array.from(new Uint8Array(digest)).map((byte) => byte.toString(16).padStart(2, '0')).join('');
}
