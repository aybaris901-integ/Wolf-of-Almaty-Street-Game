'use client';
import { motion } from 'framer-motion';
import { Difficulty, DIFFICULTY_SECONDS } from '../game/data';
import { GameState } from '../game/state';

interface DayStartScreenProps {
  state: GameState;
  onSetDifficulty: (d: Difficulty) => void;
  onBeginDay: () => void;
}

const DIFFICULTIES: { id: Difficulty; label: string; icon: string; desc: string; color: string }[] = [
  { id: 'rookie', label: 'ROOKIE', icon: '😎', desc: `${DIFFICULTY_SECONDS.rookie / 60} min • 2 scammer hints highlighted`, color: '#00ff41' },
  { id: 'normal', label: 'NORMAL', icon: '🎯', desc: `${DIFFICULTY_SECONDS.normal / 60} min • 1 scammer hint highlighted`, color: '#ffee00' },
  { id: 'hardcore', label: 'HARDCORE', icon: '⚡', desc: `${DIFFICULTY_SECONDS.hardcore / 60} min • No hints • Harder scammers`, color: '#ff0040' },
];

export default function DayStartScreen({ state, onSetDifficulty, onBeginDay }: DayStartScreenProps) {
  const difficulty = state.difficulty;
  const isFirstDay = state.day === 1 && !difficulty;

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-6">
      <div className="max-w-lg w-full">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center mb-8"
        >
          <div className="text-5xl mb-3">📅</div>
          <div className="neon-yellow text-3xl font-black">DAY {state.day}</div>
          <div className="text-[#555] text-xs mt-1 tracking-widest">OF {state.maxDays}</div>
        </motion.div>

        {/* Difficulty selector — shown only if not yet chosen */}
        {!difficulty && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="text-center text-[10px] text-[#666] tracking-widest mb-4">SELECT DIFFICULTY</div>
            <div className="space-y-3 mb-6">
              {DIFFICULTIES.map((d, i) => (
                <motion.button
                  key={d.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * i }}
                  whileHover={{ x: 4 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full text-left p-4 border-2 transition-all"
                  style={{ borderColor: d.color, background: 'rgba(0,0,0,0.5)' }}
                  onClick={() => onSetDifficulty(d.id)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{d.icon}</span>
                    <div>
                      <div className="font-bold text-sm" style={{ color: d.color }}>{d.label}</div>
                      <div className="text-[10px] text-[#666] mt-0.5">{d.desc}</div>
                    </div>
                    <div className="ml-auto text-xl" style={{ color: d.color }}>→</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        )}

        {/* Difficulty already chosen → show day brief */}
        {difficulty && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="panel p-4 mb-4">
              <div className="grid grid-cols-3 gap-4 text-center mb-3">
                <DayStat label="CAPITAL" value={`₸${state.tenge.toLocaleString()}`} color="#0080ff" />
                <DayStat label="REPUTATION" value={`${state.reputation}`} color="#00ff41" />
                <DayStat label="CHARISMA" value={`${state.charisma}`} color="#ffee00" />
              </div>
              <div className="border-t border-[#222] pt-3">
                <div className="text-[10px] text-[#666] mb-1">TODAY'S TIMER</div>
                <div className="flex items-center gap-2">
                  {(() => {
                    const d = DIFFICULTIES.find((x) => x.id === difficulty)!;
                    return (
                      <>
                        <span className="text-xl">{d.icon}</span>
                        <span className="font-bold text-sm" style={{ color: d.color }}>{d.label} — {DIFFICULTY_SECONDS[difficulty] / 60} MIN</span>
                      </>
                    );
                  })()}
                </div>
              </div>
            </div>

            <div className="text-[10px] text-[#555] text-center mb-4">
              {state.day === 1 ? "First day. The bazaar is open. Don't embarrass yourself." : `Day ${state.day}. The wolves are circling. Stay sharp.`}
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
              className="btn-brutal btn-green w-full py-4 text-base pulse-glow"
              onClick={onBeginDay}
            >
              ▶ BEGIN DAY {state.day}
            </motion.button>
          </motion.div>
        )}

        {/* Stats summary for returning days */}
        {difficulty && state.day > 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
            <div className="grid grid-cols-3 gap-2 text-center">
              <MiniStat label="Sales" value={String(state.salesCompleted)} />
              <MiniStat label="Pitches" value={String(state.pitchesCompleted)} />
              <MiniStat label="Contracts" value={String(state.completedContracts.length)} />
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function DayStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <div className="text-[9px] text-[#555]">{label}</div>
      <div className="text-sm font-bold" style={{ color }}>{value}</div>
    </div>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-[#222] p-2">
      <div className="text-[9px] text-[#555]">{label}</div>
      <div className="text-sm neon-green font-bold">{value}</div>
    </div>
  );
}