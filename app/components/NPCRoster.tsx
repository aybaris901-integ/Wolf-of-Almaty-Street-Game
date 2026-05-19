'use client';
import { motion } from 'framer-motion';
import { NPCS, BOSS } from '../game/data';
import { GameState } from '../game/state';

interface NPCRosterProps {
  state: GameState;
}

export default function NPCRoster({ state }: NPCRosterProps) {
  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      <div className="px-4 py-3 border-b border-[#e8e6e1] shrink-0">
        <div className="text-xs font-semibold text-[#1a1a1a]">Client Roster</div>
        <div className="text-[10px] text-[#9ca3af] mt-0.5">Known associates</div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {NPCS.map((npc) => {
          const unlocked = state.reputation >= npc.reputationRequired;
          return (
            <motion.div
              key={npc.id}
              whileHover={unlocked ? { y: -1 } : {}}
              className="p-3 rounded-xl border transition-all"
              style={{
                borderColor: unlocked ? '#e8e6e1' : '#f0eeeb',
                background: unlocked ? 'white' : '#fafaf9',
              }}
            >
              <div className="flex items-start gap-2.5">
                <div
                  className="w-10 h-10 rounded-xl bg-[#f7f6f3] border border-[#e8e6e1] flex items-center justify-center text-xl shrink-0"
                  style={{ filter: unlocked ? 'none' : 'grayscale(1) opacity(0.4)' }}
                >
                  {npc.avatar}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold truncate" style={{ color: unlocked ? '#1a1a1a' : '#9ca3af' }}>
                    {npc.name}
                  </div>
                  <div className="text-[9px] text-[#9ca3af] italic truncate">{npc.title}</div>
                  {!unlocked && (
                    <div className="text-[9px] text-[#b45309] mt-0.5">🔒 Needs {npc.reputationRequired} rep</div>
                  )}
                  {unlocked && (
                    <div className="text-[9px] text-[#6b7280] mt-0.5 line-clamp-2">{npc.personality}</div>
                  )}
                </div>
              </div>
              {unlocked && (
                <div className="mt-2 pt-2 border-t border-[#e8e6e1]">
                  <div className="text-[9px] text-[#9ca3af] mb-1">Interested in:</div>
                  <div className="flex flex-wrap gap-1">
                    {npc.preferredItems.slice(0, 3).map((itemId) => (
                      <span key={itemId} className="text-[8px] px-1.5 py-0.5 rounded bg-[#f7f6f3] border border-[#e8e6e1] text-[#6b7280]">
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
        <div className="p-3 rounded-xl border border-[#fecaca] bg-[#fef2f2] mt-2">
          <div className="flex items-center gap-2.5 mb-1">
            <div className="w-10 h-10 rounded-xl bg-white border border-[#fecaca] flex items-center justify-center text-xl shrink-0">
              {BOSS.avatar}
            </div>
            <div>
              <div className="text-xs font-semibold text-[#c0392b]">{BOSS.name}</div>
              <div className="text-[9px] text-[#9ca3af]">{BOSS.title}</div>
            </div>
          </div>
          <div className="text-[9px] text-[#6b7280] line-clamp-2">{BOSS.description}</div>
          <div className="text-[9px] font-semibold text-[#c0392b] mt-1">⚠ Final Boss</div>
        </div>
      </div>
    </div>
  );
}