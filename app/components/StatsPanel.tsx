'use client';
import { motion } from 'framer-motion';
import { GameState } from '../game/state';
import { getLifetimeRankTitle } from '../game/data';

interface StatsPanelProps {
  state: GameState;
  timerDisplay: string;
  timerSeconds: number;
  timerRunning: boolean;
  onEndDayEarly: () => void;
  onStartBoss: () => void;
}

function StatBar({ value, max, color }: { value: number; max: number; color: string }) {
  const pct = Math.min(100, (value / max) * 100);
  return (
    <div className="stat-bar w-full" style={{ borderColor: color }}>
      <div className="stat-fill" style={{ width: `${pct}%`, background: color, boxShadow: `0 0 6px ${color}` }} />
    </div>
  );
}

export default function StatsPanel({ state, timerDisplay, timerSeconds, timerRunning, onEndDayEarly, onStartBoss }: StatsPanelProps) {
  const isBoss = state.phase === 'boss';
  const canFightBoss = state.salesCompleted >= 2 && state.pitchesCompleted >= 1;

  const timerPct = state.difficulty ? timerSeconds / ([180, 300, 600][['hardcore','normal','rookie'].indexOf(state.difficulty)]) * 100 : 100;
  const timerColor = timerPct > 50 ? '#00ff41' : timerPct > 25 ? '#ffee00' : '#ff0040';
  const shouldPulse = timerPct <= 25 && timerPct > 0 && timerRunning;

  return (
    <div className="panel h-full flex flex-col overflow-hidden">
      <div className="px-4 py-3 border-b-2 border-[#00ff41] shrink-0">
        <div className="neon-green text-xs font-bold tracking-widest">[ WOLF TERMINAL ]</div>
        <div className="text-[10px] text-[#666] mt-0.5 cursor-blink">ALMATY STREET TRADING v3.0</div>
      </div>

      {/* Avatar + Day */}
      <div className="px-4 pt-4 pb-2 flex items-center gap-3 shrink-0">
        <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity }} className="text-4xl">🐺</motion.div>
        <div>
          <div className="neon-green text-sm font-bold">THE WOLF</div>
          <div className="text-[10px] text-[#666] truncate" style={{ maxWidth: 100 }}>{getLifetimeRankTitle(state.totalEarned)}</div>
        </div>
        <div className="ml-auto text-right shrink-0">
          <div className="text-[10px] text-[#666]">DAY</div>
          <div className="neon-yellow text-2xl font-bold leading-none">{state.day}</div>
          <div className="text-[10px] text-[#666]">/ {state.maxDays}</div>
        </div>
      </div>

      {/* Timer */}
      {timerRunning && (
        <div className="px-4 pb-2 shrink-0">
          <div className="p-2 border" style={{ borderColor: timerColor, background: `rgba(${timerColor === '#ff0040' ? '255,0,64' : timerColor === '#ffee00' ? '255,238,0' : '0,255,65'},0.05)` }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] text-[#666]">TIME REMAINING</span>
              <span className={`text-xs font-bold ${shouldPulse ? 'pulse-glow' : ''}`} style={{ color: timerColor }}>{timerDisplay}</span>
            </div>
            <div className="stat-bar" style={{ borderColor: timerColor, height: 4 }}>
              <motion.div
                className="stat-fill"
                animate={{ width: `${timerPct}%` }}
                transition={{ duration: 0.5 }}
                style={{ background: timerColor, boxShadow: `0 0 4px ${timerColor}` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Capital */}
      <div className="px-4 py-2 shrink-0">
        <div className="panel-blue p-3">
          <div className="text-[10px] text-[#666] mb-1">CAPITAL (₸)</div>
          <motion.div key={state.tenge} initial={{ scale: 1.05 }} animate={{ scale: 1 }} className="neon-blue text-xl font-bold">
            ₸{state.tenge.toLocaleString()}
          </motion.div>
          <div className="text-[10px] text-[#666] mt-0.5">LIFETIME: ₸{state.totalEarned.toLocaleString()}</div>
        </div>
      </div>

      {/* Stats bars */}
      <div className="px-4 py-2 space-y-3 shrink-0">
        <div>
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-[#666]">REPUTATION</span>
            <span className="neon-green">{state.reputation}/100</span>
          </div>
          <StatBar value={state.reputation} max={100} color="#00ff41" />
        </div>
        <div>
          <div className="flex justify-between text-[10px] mb-1">
            <span className="text-[#666]">CHARISMA</span>
            <span className="neon-yellow">{state.charisma}/100</span>
          </div>
          <StatBar value={state.charisma} max={100} color="#ffee00" />
        </div>
      </div>

      {/* Score grid */}
      <div className="px-4 py-2 shrink-0">
        <div className="grid grid-cols-2 gap-2 text-center">
          <div className="panel p-2" style={{ borderColor: '#00ff41', boxShadow: 'none' }}>
            <div className="text-[9px] text-[#555]">SALES</div>
            <div className="neon-green text-lg font-bold">{state.salesCompleted}</div>
          </div>
          <div className="panel-blue p-2" style={{ boxShadow: 'none' }}>
            <div className="text-[9px] text-[#555]">PITCHES</div>
            <div className="neon-blue text-lg font-bold">{state.pitchesCompleted}</div>
          </div>
          <div className="p-2 border border-[#ff6600]">
            <div className="text-[9px] text-[#555]">CONTRACTS</div>
            <div className="neon-orange text-lg font-bold">{state.completedContracts.length}</div>
          </div>
          <div className="p-2 border border-[#ffee00]">
            <div className="text-[9px] text-[#555]">SCAMS CAUGHT</div>
            <div className="neon-yellow text-lg font-bold">{state.lifetimeStats.scammersDetected}</div>
          </div>
        </div>
      </div>

      {/* Inventory count */}
      <div className="px-4 py-2 shrink-0">
        <div className="text-[10px] text-[#666] mb-1">INVENTORY</div>
        <div className="flex gap-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="w-5 h-5 border"
              style={{
                borderColor: i < state.inventory.length ? '#00ff41' : '#333',
                background: i < state.inventory.length ? 'rgba(0,255,65,0.15)' : 'transparent',
              }}
            />
          ))}
        </div>
        <div className="text-[9px] text-[#666] mt-1">{state.inventory.length}/8 slots used</div>
      </div>

      {/* Actions */}
      <div className="mt-auto px-4 pb-4 space-y-2 shrink-0">
        {state.phase === 'sales' && (
          <button className="btn-brutal btn-yellow w-full py-2 text-xs" onClick={onEndDayEarly}>
            ⏩ END DAY EARLY
          </button>
        )}
        {(state.phase === 'sales' || state.phase === 'day_start') && canFightBoss && (
          <button className="btn-brutal btn-red w-full py-2 text-xs pulse-glow" onClick={onStartBoss}>
            ☠ FIGHT THE GODFATHER
          </button>
        )}
      </div>
    </div>
  );
}