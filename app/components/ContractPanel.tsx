'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { CONTRACTS, getDayProfile } from '../game/data';
import { GameState, GameAction, ContractSlot } from '../game/state';

interface ContractPanelProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export default function ContractPanel({ state, dispatch }: ContractPanelProps) {
  const activeContract = state.activeContract;

  return (
    <div className="h-full flex flex-col overflow-hidden relative">
      <div className="px-3 py-2 border-b border-[#e8e6e1] shrink-0 flex items-center gap-2">
        <span className="text-[10px] font-semibold text-[#6b7280]">High-Value Contracts</span>
        <span className="text-[9px] text-[#9ca3af]">Charisma: <span className="font-semibold text-[#1a1a1a]">{state.charisma}</span></span>
      </div>

      <AnimatePresence>
        {activeContract && <ContractNegotiation state={state} dispatch={dispatch} slot={activeContract} />}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {state.availableContracts.length === 0 && (
          <div className="text-center mt-10">
            <div className="text-3xl mb-2">📜</div>
            {getDayProfile(state.day).contractsUnlocked ? (
              <>
                <div className="text-xs text-[#9ca3af]">No contracts available today.</div>
                <div className="text-[10px] text-[#9ca3af] mt-1">Build charisma by closing deals.</div>
              </>
            ) : (
              <>
                <div className="text-xs font-semibold text-[#b45309]">Contracts locked</div>
                <div className="text-[10px] text-[#9ca3af] mt-1">Unlocks on Day 8. Keep trading.</div>
              </>
            )}
          </div>
        )}

        {CONTRACTS.map((contract) => {
          const slot = state.availableContracts.find((c) => c.contractId === contract.id);
          const completed = state.completedContracts.includes(contract.id);
          if (!slot && !completed) return null;
          const locked = state.charisma < contract.requiredCharisma;
          const isReady = slot?.step === 'ready_to_sign';

          return (
            <motion.div
              key={contract.id}
              whileHover={!locked && !completed ? { y: -1 } : {}}
              className="p-3 rounded-xl border transition-all"
              style={{
                borderColor: completed ? '#e8e6e1' : isReady ? '#fde68a' : locked ? '#e8e6e1' : '#fed7aa',
                background: completed ? '#f7f6f3' : isReady ? '#fffbeb' : 'white',
                opacity: completed ? 0.55 : 1,
              }}
            >
              <div className="flex items-start gap-2.5 mb-2">
                <span className="text-xl shrink-0">{contract.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-semibold" style={{ color: completed ? '#9ca3af' : locked ? '#d1d5db' : '#1a1a1a' }}>
                      {contract.title}
                    </span>
                    {completed && <span className="text-[9px] text-[#9ca3af]">Completed</span>}
                    {isReady && <span className="text-[9px] font-semibold text-[#b45309]">✍ Sign Now</span>}
                  </div>
                  <div className="text-[10px] text-[#6b7280] mt-0.5 line-clamp-2">{contract.description}</div>
                  <div className="flex items-center gap-3 mt-1.5 text-[10px]">
                    <span className="font-semibold text-[#ea580c]">₸{contract.value.toLocaleString()}</span>
                    <span className="text-[#9ca3af]">Needs {contract.requiredCharisma} charisma</span>
                  </div>
                  {locked && !completed && (
                    <div className="text-[10px] text-[#b45309] mt-1">
                      🔒 Need {contract.requiredCharisma - state.charisma} more charisma
                    </div>
                  )}
                </div>
              </div>

              {!locked && !completed && slot && (
                <div className="flex gap-2 pt-2 border-t border-[#e8e6e1]">
                  {slot.step === 'available' && (
                    <button
                      className="flex-1 py-1.5 rounded-lg text-[10px] font-semibold bg-[#fff7ed] text-[#ea580c] border border-[#fed7aa] hover:bg-[#ffedd5] transition-colors"
                      onClick={() => dispatch({ type: 'PROPOSE_CONTRACT', contractId: contract.id })}
                    >
                      Negotiate
                    </button>
                  )}
                  {slot.step === 'ready_to_sign' && (
                    <button
                      className="flex-1 py-1.5 rounded-lg text-[10px] font-semibold bg-[#1a1a1a] text-white hover:bg-[#2d2d2d] transition-colors"
                      onClick={() => dispatch({ type: 'SIGN_CONTRACT', contractId: contract.id })}
                    >
                      ✍ Sign Contract
                    </button>
                  )}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function ContractNegotiation({ state, dispatch, slot }: { state: GameState; dispatch: React.Dispatch<GameAction>; slot: ContractSlot }) {
  const contract = CONTRACTS.find((c) => c.id === slot.contractId);
  if (!contract) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -16 }}
      className="absolute inset-x-0 top-0 z-10 m-3 p-4 bg-white rounded-2xl border border-[#fed7aa]"
      style={{ boxShadow: '0 8px 32px rgba(234,88,12,0.12)' }}
    >
      <div className="flex items-start gap-2.5 mb-3">
        <span className="text-2xl">{contract.emoji}</span>
        <div className="flex-1">
          <div className="text-sm font-semibold text-[#1a1a1a]">{contract.title}</div>
          <div className="text-[10px] text-[#9ca3af] mt-0.5 italic">{contract.negotiationText}</div>
        </div>
        <button
          className="text-[#9ca3af] hover:text-[#6b7280] text-sm transition-colors"
          onClick={() => dispatch({ type: 'DISMISS_CONTRACT' })}
        >
          ×
        </button>
      </div>

      <div className="bg-[#fff7ed] border border-[#fed7aa] rounded-xl p-3 mb-3">
        <div className="text-[10px] text-[#b45309] mb-1">
          {slot.step === 'ready_to_sign' ? 'Agreed Price' : 'Offered Value'}
        </div>
        <div className="text-xl font-bold text-[#ea580c]">₸{slot.currentOffer.toLocaleString()}</div>
        {slot.counterRound > 0 && (
          <div className="text-[9px] text-[#2d6a4f] mt-1">↑ Counter-offer accepted</div>
        )}
      </div>

      {slot.step === 'negotiating' && (
        <div className="flex gap-2">
          <button
            className="flex-1 py-2 rounded-lg text-xs font-semibold bg-[#f0fdf4] text-[#2d6a4f] border border-[#bbf7d0]"
            onClick={() => dispatch({ type: 'ACCEPT_CONTRACT_TERMS', contractId: contract.id })}
          >
            ✓ Accept Terms
          </button>
          {slot.counterRound < 1 && (
            <button
              className="flex-1 py-2 rounded-lg text-xs font-semibold bg-[#fffbeb] text-[#b45309] border border-[#fde68a]"
              onClick={() => dispatch({ type: 'COUNTER_CONTRACT', contractId: contract.id })}
            >
              ↑ Counter +12%
            </button>
          )}
          <button
            className="py-2 px-3 rounded-lg text-xs font-semibold bg-[#fef2f2] text-[#c0392b] border border-[#fecaca]"
            onClick={() => dispatch({ type: 'DISMISS_CONTRACT' })}
          >
            Walk
          </button>
        </div>
      )}

      {slot.step === 'ready_to_sign' && (
        <div className="flex gap-2">
          <button
            className="flex-1 py-2 rounded-lg text-xs font-semibold bg-[#1a1a1a] text-white hover:bg-[#2d2d2d] transition-colors"
            onClick={() => dispatch({ type: 'SIGN_CONTRACT', contractId: contract.id })}
          >
            ✍ Sign Now — ₸{slot.currentOffer.toLocaleString()}
          </button>
          <button
            className="py-2 px-3 rounded-lg text-xs font-semibold bg-[#f7f6f3] text-[#6b7280] border border-[#e8e6e1]"
            onClick={() => dispatch({ type: 'DISMISS_CONTRACT' })}
          >
            Later
          </button>
        </div>
      )}
    </motion.div>
  );
}