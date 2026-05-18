'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { DailyStats } from '../game/state';
import { getDailyRankTitle } from '../game/data';
import { LeaderboardEntry } from '../lib/supabase';

interface DayEndModalProps {
  day: number;
  stats: DailyStats;
  leaderboard: LeaderboardEntry[];
  onNextDay: () => void;
}

export default function DayEndModal({ day, stats, leaderboard, onNextDay }: DayEndModalProps) {
  const [countdown, setCountdown] = useState(5);
  const rankTitle = getDailyRankTitle(stats.earned);

  const rankColor =
    stats.earned >= 1_500_000 ? '#ffee00' :
    stats.earned >= 800_000  ? '#00ff41' :
    stats.earned >= 400_000  ? '#0080ff' :
    stats.earned >= 150_000  ? '#ff6600' :
                               '#666';

  useEffect(() => {
    if (countdown <= 0) { onNextDay(); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, onNextDay]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="text-6xl mb-3"
          >
            {stats.earned >= 800_000 ? '🏆' : stats.earned >= 150_000 ? '💰' : '📊'}
          </motion.div>
          <div className="neon-yellow text-2xl font-black">END OF DAY {day}</div>
          <motion.div
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl font-bold mt-1"
            style={{ color: rankColor, textShadow: `0 0 15px ${rankColor}` }}
          >
            {rankTitle}
          </motion.div>
        </div>

        {/* Stats grid */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="panel p-4 mb-4">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <AnimStat label="EARNED TODAY" value={`₸${stats.earned.toLocaleString()}`} color="#00ff41" delay={0.4} />
            <AnimStat label="DEALS WON" value={String(stats.dealsWon)} color="#0080ff" delay={0.5} />
            <AnimStat label="DEALS LOST" value={String(stats.dealsFailed)} color="#ff6600" delay={0.6} />
            <AnimStat label="SCAMMERS CAUGHT" value={String(stats.scammersDetected)} color="#ffee00" delay={0.7} />
          </div>

          {stats.scammersFooled > 0 && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
              className="border border-[#ff004055] p-2 mb-3"
            >
              <div className="text-[10px] neon-red">⚠ SCAMMED {stats.scammersFooled}x TODAY</div>
              <div className="text-[9px] text-[#666] mt-0.5">Read the red flags next time.</div>
            </motion.div>
          )}

          {stats.bestDeal && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
              className="border-t border-[#222] pt-3"
            >
              <div className="text-[9px] text-[#555] mb-1">BEST DEAL OF THE DAY</div>
              <div className="neon-green text-sm font-bold">₸{stats.bestDeal.amount.toLocaleString()}</div>
              <div className="text-[9px] text-[#666] truncate">{stats.bestDeal.description}</div>
            </motion.div>
          )}
        </motion.div>

        {/* Rank bar visual */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}
          className="mb-4"
        >
          <div className="flex justify-between text-[9px] mb-1" style={{ color: rankColor }}>
            <span>DAILY PERFORMANCE</span>
            <span>{rankTitle}</span>
          </div>
          <div className="stat-bar" style={{ borderColor: rankColor, height: 10 }}>
            <motion.div
              className="stat-fill"
              initial={{ width: '0%' }}
              animate={{ width: `${Math.min(100, (stats.earned / 1_500_000) * 100)}%` }}
              transition={{ duration: 1, delay: 1.1 }}
              style={{ background: rankColor, boxShadow: `0 0 8px ${rankColor}` }}
            />
          </div>
        </motion.div>

        {/* Global leaderboard snapshot */}
        {leaderboard.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
            className="panel p-3 mb-4"
          >
            <div className="text-[9px] text-[#555] mb-2 tracking-widest">GLOBAL RANKINGS</div>
            <div className="space-y-1">
              {leaderboard.slice(0, 5).map((entry, i) => (
                <div key={entry.player_id} className="flex items-center gap-2 text-[9px]">
                  <span className="text-[#555] w-3">{i + 1}</span>
                  <span className="flex-1 truncate" style={{ color: '#aaa' }}>{entry.player_name}</span>
                  <span className="neon-green font-bold">₸{entry.daily_earnings.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        <motion.button
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
          className="btn-brutal btn-yellow w-full py-3 text-sm"
          onClick={onNextDay}
        >
          NEXT DAY ({countdown}s)
        </motion.button>
      </motion.div>
    </div>
  );
}

function AnimStat({ label, value, color, delay }: { label: string; value: string; color: string; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }}>
      <div className="text-[9px] text-[#555] uppercase">{label}</div>
      <div className="text-lg font-bold" style={{ color, textShadow: `0 0 8px ${color}` }}>{value}</div>
    </motion.div>
  );
}