'use client';
import { motion } from 'framer-motion';
import { GameState } from '../game/state';

interface EndScreenProps {
  state: GameState;
  onRestart: () => void;
}

export default function EndScreen({ state, onRestart }: EndScreenProps) {
  const isVictory  = state.phase === 'victory';
  const isBankrupt = state.phase === 'defeat' && state.lossStreak >= 3;

  const ratingLabel =
    state.totalEarned > 2_000_000 ? '★★★ Godfather Level' :
    state.totalEarned > 1_000_000 ? '★★ Street Wolf' :
    state.totalEarned > 500_000   ? '★ Bazaar Peddler' :
    '◦ Still Learning';

  const ratingColor =
    state.totalEarned > 2_000_000 ? '#b45309' :
    state.totalEarned > 1_000_000 ? '#2d6a4f' :
    '#1d4ed8';

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f6f3] p-6">
      <div className="max-w-lg w-full">

        {/* Hero card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-2xl p-10 mb-4 text-center"
          style={{ background: isVictory ? '#1a1a1a' : '#1a1a1a' }}
        >
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', duration: 0.8 }}
            className="text-7xl mb-5"
          >
            {isVictory ? '🏆' : isBankrupt ? '📉' : '💀'}
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-3xl font-bold text-white mb-2"
          >
            {isVictory ? 'Wolf Wins' : isBankrupt ? "You're Fired" : 'Game Over'}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-[#9ca3af] text-sm leading-relaxed"
          >
            {isVictory
              ? "You defeated Yerlan and became the true king of Almaty's underground market."
              : isBankrupt
              ? "Three days of losses. Your investors have left. Your stall is padlocked."
              : "Yerlan crushed you like a steppe bug. The streets of Almaty are not for everyone."}
          </motion.p>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-2xl border border-[#e8e6e1] p-5 mb-4"
        >
          <div className="text-[10px] font-semibold text-[#9ca3af] tracking-wide mb-4">FINAL STATS</div>
          <div className="grid grid-cols-2 gap-4">
            <Stat label="Final Capital"    value={`₸${state.tenge.toLocaleString()}`}       color="#2d6a4f" />
            <Stat label="Total Earned"     value={`₸${state.totalEarned.toLocaleString()}`} color="#1d4ed8" />
            <Stat label="Sales Closed"     value={String(state.salesCompleted)}             color="#2d6a4f" />
            <Stat label="Pitches Won"      value={String(state.pitchesCompleted)}           color="#1d4ed8" />
            <Stat label="Reputation"       value={`${state.reputation}/100`}               color="#b45309" />
            <Stat label="Days Survived"    value={`${state.day}/${state.maxDays}`}         color="#ea580c" />
          </div>

          <div className="border-t border-[#e8e6e1] pt-4 mt-4">
            <div className="text-[10px] text-[#9ca3af] mb-1">Wolf Rating</div>
            <div className="text-lg font-bold" style={{ color: ratingColor }}>{ratingLabel}</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="space-y-2"
        >
          <motion.button
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
            className="w-full py-4 bg-[#1a1a1a] text-white font-semibold rounded-xl hover:bg-[#2d2d2d] transition-colors text-sm"
            onClick={onRestart}
          >
            Play Again →
          </motion.button>
        </motion.div>

      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <div className="text-[10px] text-[#9ca3af]">{label}</div>
      <div className="text-sm font-bold mt-0.5" style={{ color }}>{value}</div>
    </div>
  );
}