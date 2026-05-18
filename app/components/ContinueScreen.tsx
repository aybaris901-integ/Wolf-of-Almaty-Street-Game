'use client';
import { motion } from 'framer-motion';
import { SaveData } from '../game/saveSystem';
import { getLifetimeRankTitle } from '../game/data';

interface ContinueScreenProps {
  save: SaveData;
  onContinue: () => void;
  onNewGame: () => void;
}

export default function ContinueScreen({ save, onContinue, onNewGame }: ContinueScreenProps) {
  const timeAgo = (() => {
    const diff = Date.now() - save.savedAt;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    if (mins < 1) return 'just now';
    if (hours < 1) return `${mins}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return `${Math.floor(hours / 24)}d ago`;
  })();

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-6">
      <div className="max-w-md w-full">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🐺</div>
            <div className="neon-green text-2xl font-black tracking-widest uppercase">Wolf of Almaty Street</div>
            <div className="text-[#555] text-xs mt-1 tracking-widest">SAVE DETECTED</div>
          </div>

          <div className="panel p-4 mb-4">
            <div className="text-[10px] text-[#555] tracking-widest mb-3">SAVED SESSION — {timeAgo}</div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <Stat label="Capital" value={`₸${save.tenge.toLocaleString()}`} color="#0080ff" />
              <Stat label="Day" value={`${save.day} / 10`} color="#ffee00" />
              <Stat label="Charisma" value={`${save.charisma}`} color="#00ff41" />
              <Stat label="Reputation" value={`${save.reputation}`} color="#00ff41" />
              <Stat label="Total Earned" value={`₸${save.totalEarned.toLocaleString()}`} color="#00ff41" />
              <Stat label="Contracts" value={`${save.completedContracts.length}`} color="#ff6600" />
            </div>
            <div className="border-t border-[#222] pt-3">
              <div className="text-[9px] text-[#555]">RANK</div>
              <div className="neon-yellow text-sm font-bold mt-0.5">{getLifetimeRankTitle(save.totalEarned)}</div>
            </div>
            {save.difficulty && (
              <div className="mt-2 text-[9px]">
                <span className="text-[#555]">DIFFICULTY: </span>
                <span className={save.difficulty === 'hardcore' ? 'neon-red' : save.difficulty === 'rookie' ? 'neon-green' : 'neon-yellow'}>
                  {save.difficulty.toUpperCase()}
                </span>
              </div>
            )}
          </div>

          <div className="space-y-3">
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="btn-brutal btn-green w-full py-4 text-sm"
              onClick={onContinue}
            >
              ▶ CONTINUE — DAY {save.day}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="btn-brutal btn-red w-full py-3 text-xs"
              onClick={onNewGame}
            >
              ✕ NEW GAME (saves will be deleted)
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div>
      <div className="text-[9px] text-[#555] uppercase">{label}</div>
      <div className="text-xs font-bold" style={{ color }}>{value}</div>
    </div>
  );
}