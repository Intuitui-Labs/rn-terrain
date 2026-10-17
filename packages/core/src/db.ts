/**
 * @file db.ts
 * Hexagonal Supabase Driven Adapter for Cloud Synchronization.
 *
 * Provides typed Supabase client connection only when SUPABASE_URL and SUPABASE_ANON_KEY
 * are explicitly configured in the environment. Never hardcodes third-party private credentials.
 */

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createClient, type SupabaseClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env'), quiet: true });

export function isSupabaseConfigured(): boolean {
  if (process.env.OFFLINE === 'true' || process.env.RN_TERRAIN_OFFLINE === 'true') {
    return false;
  }
  return Boolean(process.env.SUPABASE_URL && process.env.SUPABASE_ANON_KEY);
}

export function createSupabaseClient(
  url?: string,
  anonKey?: string
): SupabaseClient | null {
  const targetUrl = url || process.env.SUPABASE_URL;
  const targetKey = anonKey || process.env.SUPABASE_ANON_KEY;

  if (!targetUrl || !targetKey) {
    return null;
  }

  return createClient(targetUrl, targetKey);
}

// Fallback client for backward compatibility; points to configured env or an offline dummy client
const defaultClient = createSupabaseClient();
export const supabase = (defaultClient ||
  createClient(
    process.env.SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.SUPABASE_ANON_KEY || 'placeholder-key'
  )) as SupabaseClient;
