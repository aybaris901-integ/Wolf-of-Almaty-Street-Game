'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase, isSupabaseConfigured, type LeaderboardEntry } from '../lib/supabase';
import { getLifetimeRankTitle } from '../game/data';

type Tab = 'today' | 'alltime';

const MEDALS = ['🥇', '🥈', '🥉'];

function getPlayerIdClient(): string {
  if (typeof window === 'undefined') return '';
  return localStorage.getItem('wolf_player_id') ?? '';
}

export default function LeaderboardPage() {
  const router = useRouter();
  const [tab, setTab] = useState<Tab>('today');
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [myId, setMyId] = useState('');

  useEffect(() => {
    setMyId(getPlayerIdClient());
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const col = tab === 'today' ? 'daily_earnings' : 'total_earnings';
    supabase
      .from('leaderboard')
      .select('*')
      .order(col, { ascending: false })
      .limit(20)
      .then(({ data }) => {
        setEntries(data as LeaderboardEntry[] ?? []);
        setLoading(false);
      });

    // Real-time subscription
    const ch = supabase
      .channel('lb-page')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'leaderboard' }, () => {
        supabase!
          .from('leaderboard')
          .select('*')
          .order(col, { ascending: false })
          .limit(20)
          .then(({ data }) => { if (data) setEntries(data as LeaderboardEntry[]); });
      })
      .subscribe();

    return () => { supabase!.removeChannel(ch); };
  }, [tab]);

  const top3 = entries.slice(0, 3);
  const rest = entries.slice(3);
  const valueKey = tab === 'today' ? 'daily_earnings' : 'total_earnings';

  return (
    <div className="min-h-screen bg-[#f7f6f3] py-12 px-6">
      <div className="max-w-xl mx-auto">

        {/* Back */}
        <button
          onClick={() => router.push('/')}
          className="text-xs text-[#9ca3af] hover:text-[#6b7280] transition-colors mb-8 flex items-center gap-1"
        >
          ← Back to menu
        </button>

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="text-5xl mb-4">🏆</div>
          <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">Leaderboard</h1>
          <p className="text-[#6b7280] text-sm">Top traders in Almaty</p>
        </motion.div>

        {/* Tab switcher */}
        <div className="flex gap-1 p-1 bg-[#e8e6e1] rounded-xl mb-6">
          {(['today', 'alltime'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2 rounded-lg text-xs font-semibold transition-all"
              style={tab === t
                ? { background: 'white', color: '#1a1a1a', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' }
                : { background: 'transparent', color: '#6b7280' }
              }
            >
              {t === 'today' ? 'Today' : 'All Time'}
            </button>
          ))}
        </div>

        {!isSupabaseConfigured && (
          <div className="bg-[#fffbeb] border border-[#fde68a] rounded-xl p-6 text-center mb-6">
            <div className="text-2xl mb-2">📡</div>
            <div className="text-sm font-semibold text-[#b45309] mb-1">Multiplayer offline</div>
            <div className="text-xs text-[#6b7280]">Add Supabase keys to .env.local to enable live rankings</div>
          </div>
        )}

        {isSupabaseConfigured && loading && (
          <div className="text-center py-12 text-[#9ca3af] text-sm">Loading rankings…</div>
        )}

        {isSupabaseConfigured && !loading && entries.length === 0 && (
          <div className="text-center py-12 text-[#9ca3af] text-sm">
            No players yet — start a game to set the first record!
          </div>
        )}

        {/* Podium */}
        {top3.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex items-end gap-3 mb-6 justify-center"
          >
            {/* Silver */}
            {top3[1] && (
              <PodiumCard
                entry={top3[1]}
                rank={2}
                valueKey={valueKey}
                isMe={top3[1].player_id === myId}
                height="h-24"
              />
            )}
            {/* Gold */}
            {top3[0] && (
              <PodiumCard
                entry={top3[0]}
                rank={1}
                valueKey={valueKey}
                isMe={top3[0].player_id === myId}
                height="h-32"
                gold
              />
            )}
            {/* Bronze */}
            {top3[2] && (
              <PodiumCard
                entry={top3[2]}
                rank={3}
                valueKey={valueKey}
                isMe={top3[2].player_id === myId}
                height="h-20"
              />
            )}
          </motion.div>
        )}

        {/* Rest of list */}
        {rest.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl border border-[#e8e6e1] overflow-hidden"
          >
            <AnimatePresence initial={false}>
              {rest.map((entry, i) => {
                const isMe = entry.player_id === myId;
                const pos = i + 4;
                return (
                  <motion.div
                    key={entry.player_id}
                    layout
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-3 px-4 py-3"
                    style={{
                      borderBottom: i < rest.length - 1 ? '1px solid #e8e6e1' : 'none',
                      background: isMe ? '#f0fdf4' : 'white',
                    }}
                  >
                    <span className="text-xs text-[#9ca3af] w-5 shrink-0">{pos}</span>
                    <div className="w-8 h-8 rounded-lg bg-[#f7f6f3] border border-[#e8e6e1] flex items-center justify-center text-base shrink-0">
                      🐺
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold text-[#1a1a1a] truncate">
                        {entry.player_name}{isMe && <span className="text-[#2d6a4f] ml-1.5 text-xs">(you)</span>}
                      </div>
                      <div className="text-[10px] text-[#9ca3af]">
                        {getLifetimeRankTitle(entry.total_earnings)} · Day {entry.day_number}
                      </div>
                    </div>
                    <div className="text-sm font-bold text-[#2d6a4f] shrink-0">
                      ₸{entry[valueKey].toLocaleString()}
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function PodiumCard({
  entry, rank, valueKey, isMe, height, gold,
}: {
  entry: LeaderboardEntry;
  rank: number;
  valueKey: keyof LeaderboardEntry;
  isMe: boolean;
  height: string;
  gold?: boolean;
}) {
  return (
    <div className="flex-1 flex flex-col items-center">
      <div
        className="w-full rounded-xl p-3 text-center border flex flex-col items-center justify-end"
        style={{
          background: gold ? '#fffbeb' : isMe ? '#f0fdf4' : 'white',
          border: `1px solid ${gold ? '#fde68a' : isMe ? '#bbf7d0' : '#e8e6e1'}`,
        }}
      >
        <div className="text-2xl mb-1">{MEDALS[rank - 1]}</div>
        <div className="w-10 h-10 rounded-full bg-[#f7f6f3] border border-[#e8e6e1] flex items-center justify-center text-xl mb-2">🐺</div>
        <div className="text-xs font-semibold text-[#1a1a1a] truncate w-full text-center">{entry.player_name}</div>
        <div className="text-[10px] text-[#9ca3af] mt-0.5">Day {entry.day_number}</div>
        <div
          className="text-sm font-bold mt-1"
          style={{ color: gold ? '#b45309' : '#2d6a4f' }}
        >
          ₸{(entry[valueKey] as number).toLocaleString()}
        </div>
      </div>
      <div
        className={`w-full ${height} rounded-b-none rounded-t-none mt-0 border-x border-b border-t-0`}
        style={{
          background: gold ? '#fef3c7' : '#f7f6f3',
          borderColor: gold ? '#fde68a' : '#e8e6e1',
          borderRadius: '0 0 8px 8px',
        }}
      />
    </div>
  );
}