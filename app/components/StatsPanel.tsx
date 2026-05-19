'use client';
import { motion } from 'framer-motion';
import { GameState } from '../game/state';
import { getLifetimeRankTitle, getDayProfile } from '../game/data';

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
    <div className="stat-bar w-full">
      <div className="stat-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}

export default function StatsPanel({
  state, timerDisplay, timerSeconds, timerRunning, onEndDayEarly, onStartBoss,
}: StatsPanelProps) {
  const canFightBoss = state.salesCompleted >= 2 && state.pitchesCompleted >= 1;
  const timerMax = state.difficulty
    ? ([180, 300, 600][['hardcore', 'normal', 'rookie'].indexOf(state.difficulty)] ?? 300)
    : 300;
  const timerPct = timerMax > 0 ? (timerSeconds / timerMax) * 100 : 100;
  const timerColor = timerPct <= 25 ? '#c0392b' : timerPct <= 50 ? '#b45309' : '#2d6a4f';

  const profit = state.dailyStats.earned - state.dailyStats.costOfGoods;
  const targetHit = profit >= state.minProfitTarget;
  const targetPct = Math.min(100, state.minProfitTarget > 0 ? (profit / state.minProfitTarget) * 100 : 100);
  const targetColor = targetHit ? '#2d6a4f' : targetPct >= 60 ? '#b45309' : '#c0392b';
  const targetBg    = targetHit ? '#f0fdf4'  : targetPct >= 60 ? '#fffbeb'  : '#fef2f2';
  const targetBdr   = targetHit ? '#bbf7d0'  : targetPct >= 60 ? '#fde68a'  : '#fecaca';

  const rankTitle = getLifetimeRankTitle(state.totalEarned);
  const rankNum = rankTitle.startsWith('★★★') ? 6
    : rankTitle.startsWith('★★') ? (rankTitle.includes('ALMATY') ? 5 : 4)
    : rankTitle.startsWith('★') ? (rankTitle.includes('BAZAAR') ? 3 : 2)
    : 1;

  const profile = getDayProfile(state.day);

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#e8e6e1] shrink-0">
        <div className="text-xs font-semibold text-[#1a1a1a]">Wolf Terminal</div>
        <div className="text-[10px] text-[#9ca3af] mt-0.5">Almaty Street Trading v3</div>
      </div>

      {/* Rank card */}
      <div className="px-3 pt-3 pb-2 shrink-0">
        <div className="bg-[#f7f6f3] rounded-xl p-3 border border-[#e8e6e1] flex items-center gap-3">
          <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 4, repeat: Infinity }}
            className="text-3xl shrink-0">🐺
          </motion.div>
          <div className="flex-1 min-w-0">
            <div className="text-xs font-semibold text-[#1a1a1a]">The Wolf</div>
            <div className="text-[10px] text-[#6b7280] truncate leading-snug mt-0.5">{rankTitle}</div>
            <div className="text-[9px] text-[#9ca3af]">Rank {rankNum} of 6</div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[9px] text-[#9ca3af]">Day</div>
            <div className="text-2xl font-bold text-[#1a1a1a] leading-none">{state.day}</div>
            <div className="text-[9px] text-[#9ca3af]">/{state.maxDays}</div>
            {profile.allowedPersonalities
              ? <div className="text-[8px] text-[#2d6a4f] mt-0.5">rookies only</div>
              : !profile.contractsUnlocked
              ? <div className="text-[8px] text-[#b45309] mt-0.5">max {profile.maxScammers} scam</div>
              : <div className="text-[8px] text-[#c0392b] mt-0.5">all types</div>
            }
          </div>
        </div>
      </div>

      {/* Timer */}
      {timerRunning && (
        <div className="px-3 pb-2 shrink-0">
          <div className="rounded-xl p-2.5 border flex items-center gap-2"
            style={{ background: timerPct <= 25 ? '#fef2f2' : timerPct <= 50 ? '#fffbeb' : '#f0fdf4',
                     borderColor: timerPct <= 25 ? '#fecaca' : timerPct <= 50 ? '#fde68a' : '#bbf7d0' }}>
            <span className="text-sm">⏱</span>
            <span className="text-xs font-semibold w-12 shrink-0" style={{ color: timerColor }}>{timerDisplay}</span>
            <div className="flex-1">
              <div className="stat-bar">
                <motion.div className="stat-fill" animate={{ width: `${timerPct}%` }}
                  transition={{ duration: 0.5 }} style={{ background: timerColor }} />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Capital */}
      <div className="px-3 pb-2 shrink-0">
        <div className="bg-[#f0fdf4] rounded-xl p-3 border border-[#bbf7d0]">
          <div className="text-[10px] text-[#6b7280] font-medium">Capital</div>
          <motion.div key={state.tenge} initial={{ scale: 1.04 }} animate={{ scale: 1 }}
            className="text-xl font-bold text-[#2d6a4f] mt-0.5">
            ₸{state.tenge.toLocaleString()}
          </motion.div>
          <div className="text-[10px] text-[#9ca3af] mt-0.5">
            Lifetime ₸{state.totalEarned.toLocaleString()}
          </div>
        </div>
      </div>

      {/* Stat bars */}
      <div className="px-3 pb-2 space-y-2.5 shrink-0">
        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-[#6b7280] font-medium">Reputation</span>
            <span className="font-semibold text-[#1a1a1a]">{state.reputation}/100</span>
          </div>
          <StatBar value={state.reputation} max={100} color="#1a1a1a" />
        </div>
        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-[#6b7280] font-medium">Charisma</span>
            <span className="font-semibold text-[#1a1a1a]">{state.charisma}/100</span>
          </div>
          <StatBar value={state.charisma} max={100} color="#1a1a1a" />
        </div>
        <div>
          <div className="flex justify-between text-[11px] mb-1">
            <span className="text-[#6b7280] font-medium">Focus</span>
            <span className="font-semibold" style={{ color: '#6366f1' }}>{state.focus}/100</span>
          </div>
          <StatBar value={state.focus} max={100} color="#6366f1" />
          <div className="text-[9px] text-[#9ca3af] mt-0.5">Powers Scarcity & Name-Drop</div>
        </div>
      </div>

      {/* Daily target */}
      <div className="px-3 pb-2 shrink-0">
        <div className="rounded-xl p-3 border" style={{ background: targetBg, borderColor: targetBdr }}>
          <div className="flex justify-between text-[10px] mb-1.5">
            <span className="font-medium" style={{ color: targetColor }}>Daily Target</span>
            <span className="font-semibold" style={{ color: targetColor }}>
              {targetHit ? '✓' : '✗'} ₸{state.minProfitTarget.toLocaleString()}
            </span>
          </div>
          <div className="stat-bar">
            <motion.div className="stat-fill" animate={{ width: `${targetPct}%` }}
              transition={{ duration: 0.4 }} style={{ background: targetColor }} />
          </div>
          <div className="flex justify-between text-[9px] mt-1">
            <span style={{ color: profit >= 0 ? '#6b7280' : '#c0392b' }}>
              Profit ₸{profit.toLocaleString()}
            </span>
            {state.lossStreak > 0 && (
              <span style={{ color: '#c0392b' }}>⚠ Streak {state.lossStreak}/3</span>
            )}
          </div>
        </div>
      </div>

      {/* Score grid */}
      <div className="px-3 pb-2 shrink-0">
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { label: 'Sales',        value: state.salesCompleted,               color: '#2d6a4f' },
            { label: 'Pitches',      value: state.pitchesCompleted,             color: '#1d4ed8' },
            { label: 'Contracts',    value: state.completedContracts.length,    color: '#ea580c' },
            { label: 'Scams Caught', value: state.lifetimeStats.scammersDetected, color: '#b45309' },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-[#f7f6f3] rounded-lg p-2 text-center border border-[#e8e6e1]">
              <div className="text-[9px] text-[#9ca3af]">{label}</div>
              <div className="text-base font-bold mt-0.5" style={{ color }}>{value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Inventory dots */}
      <div className="px-3 pb-2 shrink-0">
        <div className="text-[10px] text-[#9ca3af] font-medium mb-1.5">Inventory</div>
        <div className="flex gap-1.5 flex-wrap">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="w-5 h-5 rounded" style={{
              background: i < state.inventory.length ? '#f0fdf4' : '#f7f6f3',
              border: `1px solid ${i < state.inventory.length ? '#86efac' : '#e8e6e1'}`,
            }} />
          ))}
        </div>
        <div className="text-[9px] text-[#9ca3af] mt-1">{state.inventory.length}/8 slots used</div>
      </div>

      {/* Actions */}
      <div className="mt-auto px-3 pb-3 space-y-2 shrink-0">
        {state.phase === 'sales' && (
          <button
            className="w-full py-2.5 rounded-lg bg-[#f7f6f3] border border-[#e8e6e1] text-xs font-medium text-[#6b7280] hover:bg-[#edecea] transition-colors"
            onClick={onEndDayEarly}
          >
            End Day Early
          </button>
        )}
        {(state.phase === 'sales' || state.phase === 'day_start') && canFightBoss && (
          <button
            className="pulse-glow w-full py-2.5 rounded-lg text-xs font-semibold text-white transition-colors"
            style={{ background: '#c0392b' }}
            onClick={onStartBoss}
          >
            ☠ Fight The Godfather
          </button>
        )}
      </div>
    </div>
  );
}