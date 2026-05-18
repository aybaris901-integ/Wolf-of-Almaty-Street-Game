'use client';

import { motion } from 'framer-motion';
import { NPCS, BOSS } from '../game/data';
import { GameState } from '../game/state';

interface NPCRosterProps {
  state: GameState;
}

export default function NPCRoster({ state }: NPCRosterProps) {
  return (
    <div className="panel h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b-2 border-[#00ff41]">
        <div className="neon-green text-xs font-bold tracking-widest">[ CLIENT ROSTER ]</div>
        <div className="text-[10px] text-[#666] mt-0.5">KNOWN ASSOCIATES</div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {NPCS.map((npc) => {
          const unlocked = state.reputation >= npc.reputationRequired;
          return (
            <motion.div
              key={npc.id}
              whileHover={{ x: 2 }}
              className="p-3 border transition-all"
              style={{
                borderColor: unlocked ? '#00ff41' : '#2a2a2a',
                background: unlocked ? 'rgba(0,255,65,0.03)' : 'rgba(0,0,0,0.5)',
              }}
            >
              <div className="flex items-start gap-2">
                <div
                  className="text-2xl"
                  style={{ filter: unlocked ? 'none' : 'grayscale(1) brightness(0.3)' }}
                >
                  {npc.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div
                    className="text-xs font-bold truncate"
                    style={{ color: unlocked ? '#00ff41' : '#333' }}
                  >
                    {npc.name}
                  </div>
                  <div className="text-[9px] text-[#555] italic truncate">{npc.title}</div>
                  {!unlocked && (
                    <div className="text-[9px] text-[#ff6600] mt-0.5">
                      🔒 Needs {npc.reputationRequired} rep
                    </div>
                  )}
                  {unlocked && (
                    <div className="text-[9px] text-[#444] mt-0.5 line-clamp-2">
                      {npc.personality}
                    </div>
                  )}
                </div>
              </div>
              {unlocked && (
                <div className="mt-2 pt-2 border-t border-[#1a1a1a]">
                  <div className="text-[9px] text-[#555] mb-1">WANTS:</div>
                  <div className="flex flex-wrap gap-1">
                    {npc.preferredItems.slice(0, 3).map((itemId) => (
                      <span
                        key={itemId}
                        className="text-[8px] px-1 py-0.5 border border-[#333] text-[#666]"
                      >
                        {itemId.replace(/_/g, ' ')}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          );
        })}

        {/* Boss teaser */}
        <div className="p-3 border-2 border-[#ff004033] mt-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl" style={{ filter: 'grayscale(0.5)' }}>
              {BOSS.avatar}
            </span>
            <div>
              <div className="neon-red text-xs font-bold">{BOSS.name}</div>
              <div className="text-[9px] text-[#555]">{BOSS.title}</div>
            </div>
          </div>
          <div className="text-[9px] text-[#666] line-clamp-2">{BOSS.description}</div>
          <div className="text-[9px] neon-red mt-1 pulse-glow">⚠ FINAL BOSS</div>
        </div>
      </div>
    </div>
  );
}