/**
 * @file archive-seeder.ts
 * Bulk Ingestion Adapter for Historical Archive Datasets.
 *
 * Ingests granular version histories and peer dependency records from:
 *   - C:\projects\rn-terrain-archive-extracted\rn-terrain\compat\peers\
 */

import fs from 'node:fs';
import path from 'node:path';
import { CanonicalDatabase } from '../db/sqlite-client.js';
import type { PackageRecord, PackageVersionRecord } from '../db/canonical-schema.js';

export interface PeerRecord {
  version: string;
  published_at: string;
  peerDependencies: Record<string, string>;
  source: string;
}

export interface ArchiveSeedSummary {
  packagesSeeded: number;
  totalVersionsIngested: number;
  details: { packageName: string; versionsCount: number }[];
}

export class ArchiveDatasetSeeder {
  constructor(private readonly db: CanonicalDatabase) {}

  public seedFromDirectory(peersDir: string): ArchiveSeedSummary {
    if (!fs.existsSync(peersDir)) {
      throw new Error(`Archive directory not found: ${peersDir}`);
    }

    const files = fs.readdirSync(peersDir).filter((f) => f.endsWith('.json'));
    let totalVersions = 0;
    const details: { packageName: string; versionsCount: number }[] = [];

    for (const file of files) {
      const packageName = path.basename(file, '.json');
      const filePath = path.join(peersDir, file);

      try {
        const raw = fs.readFileSync(filePath, 'utf-8');
        const records = JSON.parse(raw) as PeerRecord[];

        if (!Array.isArray(records) || records.length === 0) continue;

        // Upsert package entry
        const first = records[0];
        const initialEpoch = first?.published_at
          ? Math.floor(new Date(first.published_at).getTime() / 1000)
          : Math.floor(Date.now() / 1000);

        const pkgRecord: PackageRecord = {
          id: packageName,
          vendor: packageName.startsWith('@') ? packageName.split('/')[0] ?? null : null,
          category: 'community-ecosystem',
          tier: 'TIER_1',
          repository_url: `https://github.com/search?q=${packageName}`,
          documentation_url: `https://www.npmjs.com/package/${packageName}`,
          created_at: initialEpoch
        };
        this.db.upsertPackage(pkgRecord);

        // Upsert versions
        for (const r of records) {
          const epoch = r.published_at
            ? Math.floor(new Date(r.published_at).getTime() / 1000)
            : Math.floor(Date.now() / 1000);

          const rnPeer = r.peerDependencies?.['react-native'] ?? null;

          const versionRecord: PackageVersionRecord = {
            package_id: packageName,
            version: r.version,
            valid_from_epoch: epoch,
            valid_to_epoch: null,
            react_native_min: rnPeer,
            react_native_max: null,
            supports_new_arch: 1,
            tarball_url: r.source ?? null
          };
          this.db.upsertVersion(versionRecord);
        }

        totalVersions += records.length;
        details.push({ packageName, versionsCount: records.length });
      } catch {
        // Skip unparseable
      }
    }

    return {
      packagesSeeded: details.length,
      totalVersionsIngested: totalVersions,
      details
    };
  }
}
