import { createClient, SupabaseClient } from '@supabase/supabase-js';

const url  = process.env.NEXT_PUBLIC_SUPABASE_URL  ?? '';
const key  = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const isSupabaseConfigured = !!(url && key);

// Single shared client — null when not configured (offline mode)
export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createClient(url, key)
  : null;

export interface LeaderboardEntry {
  player_id: string;
  player_name: string;
  daily_earnings: number;
  total_earnings: number;
  day_number: number;
  updated_at: string;
}