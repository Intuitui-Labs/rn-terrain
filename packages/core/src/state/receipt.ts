/**
 * @file receipt.ts
 * Outside Referent State Receipt Engine.
 *
 * Persists and validates cryptographic/timestamp receipts in `.agents/state/receipt.json`
 * when grounding tools (`tcdi_compass`, `preflight_grounding`) are invoked.
 */

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

export interface PackageReceipt {
  version: string;
  timestamp: string;
}

export interface GroundingReceipt {
  lastGrounding: string;
  lastAction: string;
  packages: Record<string, PackageReceipt>;
}

export interface ReceiptInspectionResult {
  valid: boolean;
  reason: string;
  receipt: GroundingReceipt | null;
  ageMs: number;
}

/**
 * Calculates a deterministic worktree receipt key based on projectRoot and git HEAD.
 */
export function getWorktreeReceiptKey(projectRoot: string = process.cwd()): string {
  try {
    const gitHeadPath = path.join(projectRoot, '.git', 'HEAD');
    if (fs.existsSync(gitHeadPath)) {
      const gitHead = fs.readFileSync(gitHeadPath, 'utf8').trim();
      return crypto.createHash('sha256').update(`${projectRoot}:${gitHead}`).digest('hex').substring(0, 16);
    }
    return crypto.createHash('sha256').update(projectRoot).digest('hex').substring(0, 16);
  } catch {
    return crypto.createHash('sha256').update(projectRoot).digest('hex').substring(0, 16);
  }
}

/**
 * Persists an atomic grounding receipt to `.agents/state/receipts/<worktree-key>.json`
 * and synchronizes with `.agents/state/receipt.json`.
 */
export function writeGroundingReceipt(
  packageName: string,
  version: string = 'latest',
  action: string = 'tcdi_compass',
  projectRoot: string = process.cwd()
): GroundingReceipt {
  const stateDir = path.resolve(projectRoot, '.agents', 'state');
  const receiptsDir = path.join(stateDir, 'receipts');
  if (!fs.existsSync(receiptsDir)) {
    fs.mkdirSync(receiptsDir, { recursive: true });
  }

  const worktreeKey = getWorktreeReceiptKey(projectRoot);
  const worktreeReceiptPath = path.join(receiptsDir, `${worktreeKey}.json`);
  const rootReceiptPath = path.join(stateDir, 'receipt.json');

  let receipt: GroundingReceipt = {
    lastGrounding: '',
    lastAction: action,
    packages: {},
  };

  const targetPath = fs.existsSync(worktreeReceiptPath)
    ? worktreeReceiptPath
    : (fs.existsSync(rootReceiptPath) ? rootReceiptPath : null);

  if (targetPath) {
    try {
      const raw = fs.readFileSync(targetPath, 'utf8');
      receipt = JSON.parse(raw);
    } catch {
      // In case of corrupt file, reset structure
      receipt = { lastGrounding: '', lastAction: action, packages: {} };
    }
  }

  const now = new Date().toISOString();
  receipt.lastGrounding = now;
  receipt.lastAction = action;
  receipt.packages = receipt.packages || {};
  receipt.packages[packageName] = {
    version,
    timestamp: now,
  };

  const serialized = JSON.stringify(receipt, null, 2);
  try {
    fs.writeFileSync(worktreeReceiptPath, serialized, 'utf8');
  } catch {}
  try {
    fs.writeFileSync(rootReceiptPath, serialized, 'utf8');
  } catch {}

  return receipt;
}

/**
 * Inspects whether a valid, non-expired receipt exists in the target project.
 * Checks worktree receipt first, then falls back to root receipt.
 */
export function inspectGroundingReceipt(
  projectRoot: string = process.cwd(),
  ttlMs: number = 3600000 // 60 minutes default TTL
): ReceiptInspectionResult {
  const stateDir = path.resolve(projectRoot, '.agents', 'state');
  const worktreeKey = getWorktreeReceiptKey(projectRoot);
  const worktreeReceiptPath = path.join(stateDir, 'receipts', `${worktreeKey}.json`);
  const rootReceiptPath = path.join(stateDir, 'receipt.json');

  const receiptPath = fs.existsSync(worktreeReceiptPath)
    ? worktreeReceiptPath
    : rootReceiptPath;

  if (!fs.existsSync(receiptPath)) {
    return {
      valid: false,
      reason: 'NO_RECEIPT: .agents/state/receipt.json does not exist.',
      receipt: null,
      ageMs: Infinity,
    };
  }

  try {
    const raw = fs.readFileSync(receiptPath, 'utf8');
    const receipt = JSON.parse(raw) as GroundingReceipt;
    const lastTime = new Date(receipt.lastGrounding).getTime();

    if (isNaN(lastTime)) {
      return {
        valid: false,
        reason: 'INVALID_TIMESTAMP: lastGrounding timestamp is malformed.',
        receipt,
        ageMs: Infinity,
      };
    }

    const ageMs = Date.now() - lastTime;
    if (ageMs > ttlMs) {
      return {
        valid: false,
        reason: `RECEIPT_EXPIRED: Receipt is ${Math.round(ageMs / 60000)}m old (TTL: ${Math.round(ttlMs / 60000)}m).`,
        receipt,
        ageMs,
      };
    }

    return {
      valid: true,
      reason: `RECEIPT_FRESH: Valid receipt active (${Math.round(ageMs / 1000)}s old).`,
      receipt,
      ageMs,
    };
  } catch (err: any) {
    return {
      valid: false,
      reason: `CORRUPT_RECEIPT: Failed to parse receipt JSON: ${err.message}`,
      receipt: null,
      ageMs: Infinity,
    };
  }
}
