'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { CONTRACTS } from '../game/data';
import { GameState, GameAction, ContractSlot } from '../game/state';

interface ContractPanelProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

export default function ContractPanel({ state, dispatch }: ContractPanelProps) {
  const activeContract = state.activeContract;

  return (
    <div className="h-full flex flex-col overflow-hidden relative">
      <div className="px-3 py-2 border-b border-[#ff660033] shrink-0">
        <span className="text-[10px] text-[#666]">HIGH-VALUE CONTRACTS</span>
        <span className="text-[9px] text-[#555] ml-2">CHARISMA: <span className="neon-orange">{state.charisma}</span></span>
      </div>

      {/* Active contract negotiation overlay */}
      <AnimatePresence>
        {activeContract && <ContractNegotiation state={state} dispatch={dispatch} slot={activeContract} />}
      </AnimatePresence>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {state.availableContracts.length === 0 && (
          <div className="text-center text-[#444] text-xs mt-8">
            <div className="text-2xl mb-2">📜</div>
            <div>No contracts available today.</div>
            <div className="text-[9px] mt-1 text-[#333]">Build charisma by closing deals.</div>
          </div>
        )}

        {CONTRACTS.map((contract) => {
          const slot = state.availableContracts.find((c) => c.contractId === contract.id);
          const completed = state.completedContracts.includes(contract.id);
          if (!slot && !completed) return null;
          const locked = state.charisma < contract.requiredCharisma;

          return (
            <motion.div
              key={contract.id}
              whileHover={!locked && !completed ? { x: 2 } : {}}
              className="p-3 border transition-all"
              style={{
                borderColor: completed ? '#333' : slot?.step === 'ready_to_sign' ? '#ffee00' : locked ? '#1a1a1a' : '#ff6600',
                background: completed ? 'rgba(0,0,0,0.5)' : slot?.step === 'ready_to_sign' ? 'rgba(255,238,0,0.05)' : 'transparent',
                opacity: completed ? 0.45 : 1,
              }}
            >
              <div className="flex items-start gap-2 mb-2">
                <span className="text-xl">{contract.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold" style={{ color: completed ? '#444' : locked ? '#333' : '#ff6600' }}>
                      {contract.title}
                    </span>
                    {completed && <span className="text-[9px] text-[#444]">COMPLETED</span>}
                    {slot?.step === 'ready_to_sign' && <span className="text-[9px] neon-yellow pulse-glow">SIGN NOW</span>}
                  </div>
                  <div className="text-[9px] text-[#666] mt-0.5 line-clamp-2">{contract.description}</div>
                  <div className="flex items-center gap-3 mt-1.5 text-[9px]">
                    <span className="neon-orange font-bold">₸{contract.value.toLocaleString()}</span>
                    <span className="text-[#555]">Charisma: {contract.requiredCharisma}</span>
                  </div>
                  {locked && !completed && (
                    <div className="text-[9px] text-[#ff6600] mt-1">
                      🔒 Need {contract.requiredCharisma - state.charisma} more charisma
                    </div>
                  )}
                </div>
              </div>

              {!locked && !completed && slot && (
                <div className="flex gap-2 pt-2 border-t border-[#1a1a1a]">
                  {slot.step === 'available' && (
                    <button
                      className="btn-brutal btn-orange text-[9px] px-3 py-1 flex-1"
                      onClick={() => dispatch({ type: 'PROPOSE_CONTRACT', contractId: contract.id })}
                    >
                      NEGOTIATE
                    </button>
                  )}
                  {slot.step === 'ready_to_sign' && (
                    <button
                      className="btn-brutal btn-yellow text-[9px] px-3 py-1 flex-1 pulse-glow"
                      onClick={() => dispatch({ type: 'SIGN_CONTRACT', contractId: contract.id })}
                    >
                      ✍ SIGN CONTRACT
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
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="absolute inset-x-0 top-0 z-10 m-3 p-4"
      style={{ background: '#141414', border: '2px solid #ff6600', boxShadow: '0 0 30px rgba(255,102,0,0.3)' }}
    >
      <div className="flex items-start gap-2 mb-3">
        <span className="text-2xl">{contract.emoji}</span>
        <div className="flex-1">
          <div className="neon-orange text-sm font-bold">{contract.title}</div>
          <div className="text-[9px] text-[#666] mt-0.5 italic">{contract.negotiationText}</div>
        </div>
        <button className="btn-brutal btn-red text-[9px] px-2 py-1" onClick={() => dispatch({ type: 'DISMISS_CONTRACT' })}>✕</button>
      </div>

      <div className="p-3 mb-3" style={{ border: '1px solid #ff6600', background: 'rgba(255,102,0,0.05)' }}>
        <div className="text-[10px] text-[#666] mb-1">
          {slot.step === 'ready_to_sign' ? 'AGREED PRICE' : 'OFFERED VALUE'}
        </div>
        <div className="neon-orange text-2xl font-bold">₸{slot.currentOffer.toLocaleString()}</div>
        {slot.counterRound > 0 && (
          <div className="text-[9px] neon-green mt-1">↑ Counter-offer accepted by other party</div>
        )}
      </div>

      {slot.step === 'negotiating' && (
        <div className="flex gap-2">
          <button
            className="btn-brutal btn-green flex-1 py-2 text-[10px]"
            onClick={() => dispatch({ type: 'ACCEPT_CONTRACT_TERMS', contractId: contract.id })}
          >
            ✓ ACCEPT TERMS
          </button>
          {slot.counterRound < 1 && (
            <button
              className="btn-brutal btn-yellow flex-1 py-2 text-[10px]"
              onClick={() => dispatch({ type: 'COUNTER_CONTRACT', contractId: contract.id })}
            >
              ↑ COUNTER (+12%)
            </button>
          )}
          <button
            className="btn-brutal btn-red py-2 px-3 text-[10px]"
            onClick={() => dispatch({ type: 'DISMISS_CONTRACT' })}
          >
            WALK
          </button>
        </div>
      )}

      {slot.step === 'ready_to_sign' && (
        <div className="flex gap-2">
          <button
            className="btn-brutal btn-yellow flex-1 py-2 text-sm pulse-glow"
            onClick={() => dispatch({ type: 'SIGN_CONTRACT', contractId: contract.id })}
          >
            ✍ SIGN NOW — ₸{slot.currentOffer.toLocaleString()}
          </button>
          <button
            className="btn-brutal btn-red py-2 px-3 text-[10px]"
            onClick={() => dispatch({ type: 'DISMISS_CONTRACT' })}
          >
            LATER
          </button>
        </div>
      )}
    </motion.div>
  );
}