'use client';

import { motion } from 'framer-motion';
import { GameState } from '../game/state';

interface EndScreenProps {
  state: GameState;
  onRestart: () => void;
}

export default function EndScreen({ state, onRestart }: EndScreenProps) {
  const isVictory = state.phase === 'victory';

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-6">
      <div className="max-w-lg w-full text-center">
        <motion.div
          initial={{ scale: 0.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.8 }}
          className="text-8xl mb-6"
        >
          {isVictory ? '🏆' : '💀'}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h1
            className={`text-3xl font-black tracking-tight mb-2 uppercase ${
              isVictory ? 'neon-green' : 'neon-red'
            }`}
          >
            {isVictory ? 'WOLF WINS' : 'GAME OVER'}
          </h1>
          <p className="text-[#666] text-sm mb-6">
            {isVictory
              ? 'You defeated Yerlan and became the true king of Almaty\'s underground market.'
              : 'Yerlan crushed you like a steppe bug. The streets of Almaty are not for everyone.'}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="panel p-4 mb-6 space-y-3"
          style={isVictory ? {} : { borderColor: '#ff0040', boxShadow: '4px 4px 0 #ff0040' }}
        >
          <div className="text-[10px] text-[#666] tracking-widest mb-3">FINAL STATS</div>
          <div className="grid grid-cols-2 gap-3 text-left">
            <Stat label="Final Capital" value={`₸${state.tenge.toLocaleString()}`} color="#00ff41" />
            <Stat label="Total Earned" value={`₸${state.totalEarned.toLocaleString()}`} color="#0080ff" />
            <Stat label="Sales Closed" value={String(state.salesCompleted)} color="#00ff41" />
            <Stat label="Pitches Won" value={String(state.pitchesCompleted)} color="#0080ff" />
            <Stat label="Reputation" value={`${state.reputation}/100`} color="#ffee00" />
            <Stat label="Days Survived" value={`${state.day}/${state.maxDays}`} color="#ff6600" />
          </div>

          <div className="border-t border-[#333] pt-3">
            <div className="text-[10px] text-[#666] mb-1">WOLF RATING</div>
            <div
              className="text-xl font-bold"
              style={{
                color:
                  state.totalEarned > 2000000
                    ? '#ffee00'
                    : state.totalEarned > 1000000
                    ? '#00ff41'
                    : '#0080ff',
              }}
            >
              {state.totalEarned > 2000000
                ? '★★★ GODFATHER LEVEL'
                : state.totalEarned > 1000000
                ? '★★ STREET WOLF'
                : state.totalEarned > 500000
                ? '★ BAZAAR PEDDLER'
                : '◦ STILL LEARNING'}
            </div>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`btn-brutal text-base px-10 py-3 ${isVictory ? 'btn-green' : 'btn-red'}`}
          onClick={onRestart}
        >
          PLAY AGAIN
        </motion.button>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <div className="text-[9px] text-[#555] uppercase">{label}</div>
      <div className="text-sm font-bold" style={{ color }}>
        {value}
      </div>
    </div>
  );
}