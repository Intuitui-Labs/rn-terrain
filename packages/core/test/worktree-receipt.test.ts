import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {
  getWorktreeReceiptKey,
  writeGroundingReceipt,
  inspectGroundingReceipt
} from '../src/state/receipt.js';

describe('Worktree-Isolated Grounding Receipts', () => {
  let tempDir: string;

  beforeEach(() => {
    tempDir = fs.mkdtempSync(path.join(os.tmpdir(), 'rn-terrain-receipt-test-'));
  });

  afterEach(() => {
    try {
      fs.rmSync(tempDir, { recursive: true, force: true });
    } catch {}
  });

  it('generates a deterministic 16-char worktree receipt key', () => {
    const key1 = getWorktreeReceiptKey(tempDir);
    const key2 = getWorktreeReceiptKey(tempDir);
    expect(key1).toBe(key2);
    expect(key1.length).toBe(16);
  });

  it('incorporates git HEAD into receipt key when git repo exists', () => {
    const gitDir = path.join(tempDir, '.git');
    fs.mkdirSync(gitDir, { recursive: true });
    fs.writeFileSync(path.join(gitDir, 'HEAD'), 'ref: refs/heads/feature-branch\n', 'utf8');

    const keyWithHead = getWorktreeReceiptKey(tempDir);
    expect(keyWithHead.length).toBe(16);

    fs.writeFileSync(path.join(gitDir, 'HEAD'), 'ref: refs/heads/main\n', 'utf8');
    const keyWithMain = getWorktreeReceiptKey(tempDir);

    expect(keyWithHead).not.toBe(keyWithMain);
  });

  it('writes and validates isolated worktree receipt', () => {
    const receipt = writeGroundingReceipt('react-native-reanimated', '3.16.0', 'tcdi_compass', tempDir);
    expect(receipt.packages['react-native-reanimated'].version).toBe('3.16.0');

    const key = getWorktreeReceiptKey(tempDir);
    const worktreeReceiptPath = path.join(tempDir, '.agents', 'state', 'receipts', `${key}.json`);
    const rootReceiptPath = path.join(tempDir, '.agents', 'state', 'receipt.json');

    expect(fs.existsSync(worktreeReceiptPath)).toBe(true);
    expect(fs.existsSync(rootReceiptPath)).toBe(true);

    const inspection = inspectGroundingReceipt(tempDir);
    expect(inspection.valid).toBe(true);
    expect(inspection.reason).toContain('RECEIPT_FRESH');
    expect(inspection.receipt?.packages['react-native-reanimated']).toBeDefined();
  });
});
