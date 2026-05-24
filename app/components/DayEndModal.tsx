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
  minProfitTarget: number;
  lossStreak: number;
  onNextDay: () => void;
}

export default function DayEndModal({ day, stats, leaderboard, minProfitTarget, lossStreak, onNextDay }: DayEndModalProps) {
  const [countdown, setCountdown] = useState(5);
  const rankTitle = getDailyRankTitle(stats.earned);
  const profit = stats.earned - stats.costOfGoods;
  const profitHit = profit >= minProfitTarget;

  useEffect(() => {
    if (countdown <= 0) { onNextDay(); return; }
    const t = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, onNextDay]);

  const rankColor =
    stats.earned >= 1_500_000 ? '#b45309' :
    stats.earned >= 800_000   ? '#2d6a4f' :
    stats.earned >= 400_000   ? '#1d4ed8' :
    stats.earned >= 150_000   ? '#ea580c' :
    '#6b7280';

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f6f3] p-3 md:p-6 overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full max-h-[calc(100dvh-24px)] overflow-y-auto"
      >
        {/* Hero */}
        <div className="bg-[#1a1a1a] rounded-2xl p-5 md:p-8 mb-3 md:mb-4 text-center">
          <motion.div
            initial={{ scale: 0 }} animate={{ scale: 1 }}
            transition={{ type: 'spring', duration: 0.6 }}
            className="text-4xl md:text-5xl mb-3 md:mb-4"
          >
            {stats.earned >= 800_000 ? '🏆' : stats.earned >= 150_000 ? '💰' : '📊'}
          </motion.div>
          <div className="text-white text-xl font-bold mb-1">End of Day {day}</div>
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-sm font-semibold mt-1"
            style={{ color: rankColor }}
          >
            {rankTitle}
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-2xl md:text-3xl font-bold text-white mt-3"
          >
            ₸{stats.earned.toLocaleString()}
          </motion.div>
          <div className="text-[#9ca3af] text-xs mt-1">earned today</div>
        </div>

        {/* Stats grid */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-[#e8e6e1] p-3 md:p-4 mb-3">
          <div className="grid grid-cols-2 gap-3 mb-4">
            <AnimStat label="Deals Won"       value={String(stats.dealsWon)}          color="#2d6a4f" delay={0.4} />
            <AnimStat label="Deals Lost"      value={String(stats.dealsFailed)}       color="#c0392b" delay={0.5} />
            <AnimStat label="Scammers Caught" value={String(stats.scammersDetected)}  color="#b45309" delay={0.6} />
            <AnimStat label="Cost of Goods"   value={`₸${stats.costOfGoods.toLocaleString()}`} color="#6b7280" delay={0.7} />
          </div>

          {/* Profit row */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.75 }}
            className="flex justify-between items-center px-3 py-2 rounded-xl mb-2"
            style={{
              background: profit < 0 ? '#fef2f2' : '#f0fdf4',
              border: `1px solid ${profit < 0 ? '#fecaca' : '#bbf7d0'}`,
            }}
          >
            <span className="text-xs text-[#6b7280]">Daily Profit</span>
            <span className="text-sm font-bold" style={{ color: profit < 0 ? '#c0392b' : '#2d6a4f' }}>
              {profit < 0 ? '−' : '+'}₸{Math.abs(profit).toLocaleString()}
            </span>
          </motion.div>

          {/* Target row */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
            className="flex justify-between items-center px-3 py-2 rounded-xl mb-2"
            style={{
              background: profitHit ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${profitHit ? '#bbf7d0' : '#fecaca'}`,
            }}
          >
            <span className="text-xs text-[#6b7280]">Target ₸{minProfitTarget.toLocaleString()}</span>
            <div className="flex items-center gap-2">
              {lossStreak > 0 && !profitHit && (
                <span className="text-[9px] text-[#b45309]">Streak {lossStreak}/3</span>
              )}
              <span className="text-xs font-bold" style={{ color: profitHit ? '#2d6a4f' : '#c0392b' }}>
                {profitHit ? '✓ Hit' : '✗ Missed'}
              </span>
            </div>
          </motion.div>

          {stats.scammersFooled > 0 && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.85 }}
              className="px-3 py-2 rounded-xl bg-[#fef2f2] border border-[#fecaca] mb-2"
            >
              <div className="text-xs font-semibold text-[#c0392b]">⚠ Scammed {stats.scammersFooled}x today</div>
              <div className="text-[10px] text-[#9ca3af] mt-0.5">Read the red flags next time.</div>
            </motion.div>
          )}

          {stats.bestDeal && (
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}
              className="border-t border-[#e8e6e1] pt-3"
            >
              <div className="text-[10px] text-[#9ca3af] mb-1">Best deal today</div>
              <div className="text-sm font-bold text-[#2d6a4f]">₸{stats.bestDeal.amount.toLocaleString()}</div>
              <div className="text-[10px] text-[#6b7280] truncate">{stats.bestDeal.description}</div>
            </motion.div>
          )}
        </motion.div>

        {/* Global leaderboard */}
        {leaderboard.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}
          className="bg-white rounded-2xl border border-[#e8e6e1] p-3 md:p-4 mb-4"
          >
            <div className="text-[10px] font-semibold text-[#9ca3af] tracking-wide mb-2">GLOBAL RANKINGS</div>
            <div className="space-y-1.5">
              {leaderboard.slice(0, 5).map((entry, i) => (
                <div key={entry.player_id} className="flex items-center gap-2 text-xs">
                  <span className="text-[#9ca3af] w-4">{i + 1}</span>
                  <span className="flex-1 truncate text-[#6b7280]">{entry.player_name}</span>
                  <span className="font-semibold text-[#2d6a4f]">₸{entry.daily_earnings.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.1 }}
          className="sticky bottom-0 space-y-2 bg-[#f7f6f3] pt-2 pb-1"
        >
          <button
            className="w-full min-h-11 py-3.5 bg-[#1a1a1a] text-white font-semibold rounded-xl hover:bg-[#2d2d2d] transition-colors text-sm"
            onClick={onNextDay}
          >
            Start Day {day + 1} ({countdown}s)
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}

function AnimStat({ label, value, color, delay }: { label: string; value: string; color: string; delay: number }) {
  return (
    <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }}>
      <div className="text-[10px] text-[#9ca3af]">{label}</div>
      <div className="text-base font-bold mt-0.5" style={{ color }}>{value}</div>
    </motion.div>
  );
}
