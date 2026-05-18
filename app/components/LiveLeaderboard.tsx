'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { LeaderboardEntry } from '../lib/supabase';

interface LiveLeaderboardProps {
  leaderboard: LeaderboardEntry[];
  currentPlayerId: string;
  currentDailyEarnings: number;
  connected: boolean;
  isConfigured: boolean;
  raidCost: number;
  playerTenge: number;
  onRaid: (targetId: string, targetName: string) => void;
}

const RANK_MEDALS = ['🥇', '🥈', '🥉', '4', '5', '6', '7', '8', '9', '10'];

export default function LiveLeaderboard({
  leaderboard, currentPlayerId, currentDailyEarnings,
  connected, isConfigured, raidCost, playerTenge, onRaid,
}: LiveLeaderboardProps) {
  const top5 = leaderboard.slice(0, 5);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-4 py-2 border-b border-[#00ff4133] flex items-center gap-2 shrink-0">
        <span className="neon-green text-[10px] font-bold tracking-widest">LIVE LEADERBOARD</span>
        <div className="ml-auto flex items-center gap-1">
          <div
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: connected ? '#00ff41' : '#ff0040', boxShadow: connected ? '0 0 4px #00ff41' : 'none' }}
          />
          <span className="text-[9px] text-[#555]">{connected ? 'LIVE' : isConfigured ? 'CONNECTING' : 'OFFLINE'}</span>
        </div>
      </div>

      {!isConfigured && (
        <div className="px-4 py-3 text-center">
          <div className="text-[9px] text-[#444] mb-1">Multiplayer offline.</div>
          <div className="text-[8px] text-[#333]">Add Supabase keys to .env.local</div>
        </div>
      )}

      {/* List */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <AnimatePresence initial={false}>
          {top5.map((entry, i) => {
            const isMe = entry.player_id === currentPlayerId;
            return (
              <motion.div
                key={entry.player_id}
                layout
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2 p-2 border transition-all"
                style={{
                  borderColor: isMe ? '#00ff41' : '#1a1a1a',
                  background: isMe ? 'rgba(0,255,65,0.05)' : 'transparent',
                }}
              >
                <span className="text-xs shrink-0" style={{ minWidth: 18 }}>
                  {RANK_MEDALS[i]}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold truncate" style={{ color: isMe ? '#00ff41' : '#aaa' }}>
                    {isMe ? `${entry.player_name} (you)` : entry.player_name}
                  </div>
                  <div className="text-[9px] text-[#555]">Day {entry.day_number}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] font-bold neon-green">₸{entry.daily_earnings.toLocaleString()}</div>
                  <div className="text-[8px] text-[#555]">today</div>
                </div>
                {!isMe && isConfigured && (
                  <button
                    className="btn-brutal btn-red text-[8px] px-1.5 py-0.5 shrink-0"
                    disabled={playerTenge < raidCost}
                    title={`Raid — costs ₸${raidCost.toLocaleString()}`}
                    onClick={() => onRaid(entry.player_id, entry.player_name)}
                  >
                    ⚔
                  </button>
                )}
              </motion.div>
            );
          })}
        </AnimatePresence>

        {/* Current player if not in top 5 */}
        {isConfigured && top5.length > 0 && !top5.some((e) => e.player_id === currentPlayerId) && (
          <div className="border-t border-[#111] pt-1">
            <div className="flex items-center gap-2 p-2 border border-[#00ff41] bg-[#00ff410a]">
              <span className="text-[9px] text-[#666]">YOU</span>
              <div className="flex-1">
                <div className="text-[10px] neon-green font-bold">₸{currentDailyEarnings.toLocaleString()}</div>
              </div>
              <div className="text-[9px] text-[#555]">not ranked yet</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}