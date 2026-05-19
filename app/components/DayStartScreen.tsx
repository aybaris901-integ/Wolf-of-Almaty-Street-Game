'use client';
import { motion } from 'framer-motion';
import { Difficulty, DIFFICULTY_SECONDS, getDayProfile } from '../game/data';
import { GameState } from '../game/state';

interface DayStartScreenProps {
  state: GameState;
  onSetDifficulty: (d: Difficulty) => void;
  onBeginDay: () => void;
  onBack: () => void;
}

const DIFFICULTIES: { id: Difficulty; label: string; icon: string; desc: string; color: string; bg: string; border: string }[] = [
  { id: 'rookie',   label: 'Rookie',   icon: '😎', desc: `${DIFFICULTY_SECONDS.rookie / 60} min · 2 scammer hints highlighted`,   color: '#2d6a4f', bg: '#f0fdf4', border: '#bbf7d0' },
  { id: 'normal',   label: 'Normal',   icon: '🎯', desc: `${DIFFICULTY_SECONDS.normal / 60} min · 1 scammer hint highlighted`,    color: '#b45309', bg: '#fffbeb', border: '#fde68a' },
  { id: 'hardcore', label: 'Hardcore', icon: '⚡', desc: `${DIFFICULTY_SECONDS.hardcore / 60} min · No hints · Harder scammers`, color: '#c0392b', bg: '#fef2f2', border: '#fecaca' },
];

export default function DayStartScreen({ state, onSetDifficulty, onBeginDay, onBack }: DayStartScreenProps) {
  const difficulty = state.difficulty;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f6f3] p-6">
      <div className="max-w-lg w-full">

        {/* Back */}
        <button
          onClick={onBack}
          className="text-xs text-[#9ca3af] hover:text-[#6b7280] transition-colors mb-8 flex items-center gap-1"
        >
          ← Back to menu
        </button>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="text-5xl mb-3">📅</div>
          <div className="text-3xl font-bold text-[#1a1a1a]">Day {state.day}</div>
          <div className="text-[#9ca3af] text-sm mt-1">of {state.maxDays}</div>
        </motion.div>

        {/* Difficulty selector */}
        {!difficulty && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
            <div className="text-[10px] font-semibold text-[#9ca3af] tracking-wide text-center mb-4">SELECT DIFFICULTY</div>
            <div className="space-y-3 mb-6">
              {DIFFICULTIES.map((d, i) => (
                <motion.button
                  key={d.id}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  className="w-full text-left p-4 rounded-2xl border transition-all"
                  style={{ borderColor: d.border, background: d.bg }}
                  onClick={() => onSetDifficulty(d.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{d.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-sm" style={{ color: d.color }}>{d.label}</div>
                      <div className="text-[10px] text-[#6b7280] mt-0.5">{d.desc}</div>
                    </div>
                    <span className="text-lg" style={{ color: d.color }}>→</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Day brief once difficulty chosen */}
        {difficulty && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">

            {/* Stats card */}
            <div className="bg-white rounded-2xl border border-[#e8e6e1] p-4 mb-3">
              <div className="grid grid-cols-3 gap-4 text-center mb-3">
                <DayStat label="Capital" value={`₸${state.tenge.toLocaleString()}`} />
                <DayStat label="Reputation" value={String(state.reputation)} />
                <DayStat label="Charisma" value={String(state.charisma)} />
              </div>
              <div className="border-t border-[#e8e6e1] pt-3">
                {(() => {
                  const d = DIFFICULTIES.find((x) => x.id === difficulty)!;
                  return (
                    <div className="flex items-center gap-2 text-sm">
                      <span>{d.icon}</span>
                      <span className="font-semibold" style={{ color: d.color }}>{d.label}</span>
                      <span className="text-[#9ca3af]">— {DIFFICULTY_SECONDS[difficulty] / 60} min timer</span>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Day conditions */}
            {(() => {
              const profile = getDayProfile(state.day);
              return (
                <div className="bg-white rounded-2xl border border-[#e8e6e1] p-3 mb-3 space-y-2">
                  <div className="text-[10px] font-semibold text-[#9ca3af] tracking-wide">TODAY'S CONDITIONS</div>
                  <CondRow label="Profit Target" value={`₸${profile.minProfitTarget.toLocaleString()}`} />
                  <CondRow
                    label="Clients"
                    value={profile.allowedPersonalities ? 'Friendly & Impulsive only' : 'All types'}
                    valueColor={profile.allowedPersonalities ? '#2d6a4f' : '#6b7280'}
                  />
                  <CondRow
                    label="Scammers"
                    value={profile.maxScammers === 0 ? 'None today' : `Up to ${profile.maxScammers}`}
                    valueColor={profile.maxScammers === 0 ? '#2d6a4f' : profile.maxScammers <= 2 ? '#b45309' : '#c0392b'}
                  />
                  <CondRow
                    label="Contracts"
                    value={profile.contractsUnlocked ? 'Unlocked' : 'Locked (Day 8+)'}
                    valueColor={profile.contractsUnlocked ? '#1d4ed8' : '#9ca3af'}
                  />
                  {state.lossStreak > 0 && (
                    <div className="flex justify-between text-[10px] pt-1 border-t border-[#e8e6e1]">
                      <span className="text-[#9ca3af]">Loss Streak</span>
                      <span className="font-semibold text-[#c0392b]">⚠ {state.lossStreak}/3 — miss again = fired</span>
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="text-xs text-[#9ca3af] text-center mb-5">
              {state.day === 1
                ? "First day. The bazaar is open. Don't embarrass yourself."
                : `Day ${state.day}. The wolves are circling. Stay sharp.`}
            </div>

            <motion.button
              whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
              className="w-full py-4 bg-[#1a1a1a] text-white font-semibold rounded-xl hover:bg-[#2d2d2d] transition-colors text-sm"
              onClick={onBeginDay}
            >
              Begin Day {state.day} →
            </motion.button>
          </motion.div>
        )}

        {/* Returning days summary */}
        {difficulty && state.day > 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { label: 'Sales',     value: state.salesCompleted },
                { label: 'Pitches',   value: state.pitchesCompleted },
                { label: 'Contracts', value: state.completedContracts.length },
              ].map((s) => (
                <div key={s.label} className="bg-white rounded-xl border border-[#e8e6e1] p-2.5">
                  <div className="text-[9px] text-[#9ca3af]">{s.label}</div>
                  <div className="text-base font-bold text-[#1a1a1a] mt-0.5">{s.value}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}

function DayStat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-[10px] text-[#9ca3af]">{label}</div>
      <div className="text-sm font-bold text-[#1a1a1a] mt-0.5">{value}</div>
    </div>
  );
}

function CondRow({ label, value, valueColor = '#1a1a1a' }: { label: string; value: string; valueColor?: string }) {
  return (
    <div className="flex justify-between text-[10px]">
      <span className="text-[#9ca3af]">{label}</span>
      <span className="font-medium" style={{ color: valueColor }}>{value}</span>
    </div>
  );
}