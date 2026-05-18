'use client';
import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase, isSupabaseConfigured, type LeaderboardEntry } from '../lib/supabase';

// Persistent player identity (browser-local UUID)
function getOrCreatePlayerId(): string {
  if (typeof window === 'undefined') return '';
  const stored = localStorage.getItem('wolf_player_id');
  if (stored) return stored;
  const id = crypto.randomUUID();
  localStorage.setItem('wolf_player_id', id);
  return id;
}

function getPlayerName(): string {
  if (typeof window === 'undefined') return 'Anonymous Wolf';
  return localStorage.getItem('wolf_player_name') ?? 'Anonymous Wolf';
}

export function savePlayerName(name: string): void {
  if (typeof window !== 'undefined') localStorage.setItem('wolf_player_name', name.trim() || 'Anonymous Wolf');
}

export function hasPlayerName(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem('wolf_player_name');
}

interface UseMultiplayerOptions {
  onRaidReceived: (raiderId: string, raiderName: string) => void;
}

export function useMultiplayer({ onRaidReceived }: UseMultiplayerOptions) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [connected, setConnected] = useState(false);
  const playerId = useRef(getOrCreatePlayerId());
  const onRaidRef = useRef(onRaidReceived);
  onRaidRef.current = onRaidReceived;

  // Initial fetch + real-time subscription
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    // Initial leaderboard
    supabase
      .from('leaderboard')
      .select('*')
      .order('daily_earnings', { ascending: false })
      .limit(10)
      .then(({ data }) => {
        if (data) setLeaderboard(data as LeaderboardEntry[]);
      });

    // Real-time leaderboard changes
    const lbChannel = supabase
      .channel('leaderboard-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leaderboard' }, () => {
        supabase!
          .from('leaderboard')
          .select('*')
          .order('daily_earnings', { ascending: false })
          .limit(10)
          .then(({ data }) => {
            if (data) setLeaderboard(data as LeaderboardEntry[]);
          });
      })
      .subscribe((status) => {
        setConnected(status === 'SUBSCRIBED');
      });

    // Real-time raids targeting this player
    const raidChannel = supabase
      .channel(`raids-${playerId.current}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'raids', filter: `target_id=eq.${playerId.current}` },
        (payload) => {
          const raid = payload.new as { raider_id: string; raider_name: string };
          onRaidRef.current(raid.raider_id, raid.raider_name);
        }
      )
      .subscribe();

    return () => {
      supabase!.removeChannel(lbChannel);
      supabase!.removeChannel(raidChannel);
    };
  }, []);

  const publishScore = useCallback(async (dailyEarnings: number, totalEarnings: number, dayNumber: number) => {
    if (!isSupabaseConfigured || !supabase) return;
    await supabase.from('leaderboard').upsert({
      player_id: playerId.current,
      player_name: getPlayerName(),
      daily_earnings: dailyEarnings,
      total_earnings: totalEarnings,
      day_number: dayNumber,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'player_id' });
  }, []);

  const sendRaid = useCallback(async (targetId: string): Promise<boolean> => {
    if (!isSupabaseConfigured || !supabase) return false;
    const { error } = await supabase.from('raids').insert({
      raider_id: playerId.current,
      raider_name: getPlayerName(),
      target_id: targetId,
    });
    return !error;
  }, []);

  return {
    playerId: playerId.current,
    playerName: getPlayerName(),
    leaderboard,
    connected,
    isConfigured: isSupabaseConfigured,
    publishScore,
    sendRaid,
  };
}