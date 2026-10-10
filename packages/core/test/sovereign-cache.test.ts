import { describe, it, expect, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { SovereignCacheAdapter } from '../src/db/sovereign-cache.js';

describe('SovereignCacheAdapter', () => {
  const tempDir = path.join(os.tmpdir(), `rn-terrain-test-cache-${Date.now()}`);

  afterEach(() => {
    try {
      if (fs.existsSync(tempDir)) {
        fs.rmSync(tempDir, { recursive: true, force: true });
      }
    } catch {}
  });

  it('stores and retrieves cache entries in user space without touching node_modules', () => {
    const cache = new SovereignCacheAdapter(tempDir);
    cache.set('test_key', { answer: 42, vendor: 'software-mansion' });

    const retrieved = cache.get<{ answer: number; vendor: string }>('test_key');
    expect(retrieved).toBeDefined();
    expect(retrieved?.answer).toBe(42);
    expect(retrieved?.vendor).toBe('software-mansion');
  });

  it('handles cache expiration correctly', () => {
    const cache = new SovereignCacheAdapter(tempDir);
    // Expired 1 second ago
    cache.set('expired_key', 'old_data', -1);

    const result = cache.get('expired_key');
    expect(result).toBeNull();
  });
});
