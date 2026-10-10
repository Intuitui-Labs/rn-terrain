/**
 * @file sovereign-cache.ts
 * Sovereign User-Space Cache Adapter for RN-Terrain.
 *
 * Resolves persistent storage to the user's home configuration directory:
 *   - Linux/macOS: ~/.rn-terrain/
 *   - Windows:     %USERPROFILE%\.rn-terrain\
 *
 * Guarantees zero writes into immutable or read-only node_modules directory.
 */

import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

export interface CacheEntry<T = unknown> {
  key: string;
  data: T;
  cachedAtEpoch: number;
  expiresAtEpoch?: number;
}

export class SovereignCacheAdapter {
  private readonly cacheDir: string;
  private readonly cacheFilePath: string;

  constructor(customDir?: string) {
    this.cacheDir = customDir || path.join(os.homedir(), '.rn-terrain');
    this.cacheFilePath = path.join(this.cacheDir, 'cache.json');
    this.ensureDirectoryExists();
  }

  private ensureDirectoryExists(): void {
    try {
      if (!fs.existsSync(this.cacheDir)) {
        fs.mkdirSync(this.cacheDir, { recursive: true });
      }
    } catch {
      // Graceful fallback for strictly restricted sandbox environments
    }
  }

  public getCacheDir(): string {
    return this.cacheDir;
  }

  private loadAll(): Record<string, CacheEntry> {
    try {
      if (fs.existsSync(this.cacheFilePath)) {
        const raw = fs.readFileSync(this.cacheFilePath, 'utf8');
        return JSON.parse(raw);
      }
    } catch {
      // Corrupt or inaccessible cache; start fresh
    }
    return {};
  }

  private saveAll(entries: Record<string, CacheEntry>): void {
    try {
      this.ensureDirectoryExists();
      fs.writeFileSync(this.cacheFilePath, JSON.stringify(entries, null, 2), 'utf8');
    } catch {
      // Non-fatal if user environment denies writes
    }
  }

  public get<T>(key: string): T | null {
    const entries = this.loadAll();
    const entry = entries[key] as CacheEntry<T> | undefined;
    if (!entry) return null;

    if (entry.expiresAtEpoch && Date.now() / 1000 > entry.expiresAtEpoch) {
      delete entries[key];
      this.saveAll(entries);
      return null;
    }

    return entry.data;
  }

  public set<T>(key: string, data: T, ttlSeconds?: number): void {
    const entries = this.loadAll();
    const now = Math.floor(Date.now() / 1000);
    entries[key] = {
      key,
      data,
      cachedAtEpoch: now,
      expiresAtEpoch: ttlSeconds ? now + ttlSeconds : undefined,
    };
    this.saveAll(entries);
  }

  public has(key: string): boolean {
    return this.get(key) !== null;
  }

  public delete(key: string): void {
    const entries = this.loadAll();
    if (entries[key]) {
      delete entries[key];
      this.saveAll(entries);
    }
  }

  public clear(): void {
    try {
      if (fs.existsSync(this.cacheFilePath)) {
        fs.unlinkSync(this.cacheFilePath);
      }
    } catch {}
  }
}
