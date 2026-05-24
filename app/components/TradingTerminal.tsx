'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { ITEMS, PITCHES, NPCS, getDayProfile } from '../game/data';
import { GameState, GameAction } from '../game/state';
import IncomingPitches from './IncomingPitches';
import ContractPanel from './ContractPanel';

interface TradingTerminalProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

type Tab = 'market' | 'outgoing' | 'incoming' | 'contracts';

const ALL_TABS: { id: Tab; label: string }[] = [
  { id: 'market',    label: 'Market' },
  { id: 'outgoing',  label: 'Outgoing' },
  { id: 'incoming',  label: 'Incoming' },
  { id: 'contracts', label: 'Contracts' },
];

export default function TradingTerminal({ state, dispatch }: TradingTerminalProps) {
  const contractsUnlocked = getDayProfile(state.day).contractsUnlocked;
  const TABS = contractsUnlocked ? ALL_TABS : ALL_TABS.filter((t) => t.id !== 'contracts');
  const activeTab: Tab = (state.activeTab === 'contracts' && !contractsUnlocked)
    ? 'market'
    : (['market', 'outgoing', 'incoming', 'contracts'] as Tab[]).includes(state.activeTab as Tab)
      ? state.activeTab as Tab
      : 'market';

  const pendingIncoming = state.incomingPitches.filter(
    (p) => p.status === 'pending' || p.status === 'negotiating' || p.status === 'callback_pending'
  ).length;
  const readyContracts = state.availableContracts.filter((c) => c.step === 'ready_to_sign').length;

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      {/* Tab bar */}
      <div className="px-2 md:px-4 py-2 border-b border-[#e8e6e1] flex items-center gap-1 shrink-0 overflow-x-auto">
        {TABS.map((tab) => {
          const active = activeTab === tab.id;
          const badge = tab.id === 'incoming' && pendingIncoming > 0
            ? pendingIncoming
            : tab.id === 'contracts' && readyContracts > 0
            ? readyContracts
            : null;
          return (
            <button
              key={tab.id}
              className="relative min-h-11 md:min-h-9 px-3 py-1.5 rounded-lg text-xs font-medium transition-all whitespace-nowrap"
              style={active
                ? { background: '#1a1a1a', color: '#fff' }
                : { background: 'transparent', color: '#6b7280' }
              }
              onClick={() => dispatch({ type: 'SET_TAB', tab: tab.id })}
            >
              {tab.label}
              {badge && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold bg-[#c0392b] text-white">
                  {badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      <div className="flex-1 overflow-hidden relative">
        <AnimatePresence mode="wait">
          {activeTab === 'market' && (
            <motion.div key="market" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} className="absolute inset-0 flex">
              <MarketTab state={state} dispatch={dispatch} />
            </motion.div>
          )}
          {activeTab === 'outgoing' && (
            <motion.div key="outgoing" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} className="absolute inset-0">
              <OutgoingTab state={state} dispatch={dispatch} />
            </motion.div>
          )}
          {activeTab === 'incoming' && (
            <motion.div key="incoming" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} className="absolute inset-0">
              <IncomingPitches state={state} dispatch={dispatch} />
            </motion.div>
          )}
          {activeTab === 'contracts' && (
            <motion.div key="contracts" initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 8 }} className="absolute inset-0">
              <ContractPanel state={state} dispatch={dispatch} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// ─── Market Tab ───────────────────────────────────────────────────────────────

function rarityBadge(r: string) {
  if (r === 'legendary') return { bg: '#fffbeb', color: '#b45309', border: '#fde68a', label: 'Legendary' };
  if (r === 'rare')      return { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe', label: 'Rare' };
  return { bg: '#f0fdf4', color: '#2d6a4f', border: '#bbf7d0', label: 'Common' };
}

function MarketTab({ state, dispatch }: TradingTerminalProps) {
  return (
    <div className="flex flex-col md:flex-row h-full w-full">
      {/* Buy */}
      <div className="flex-1 border-b md:border-b-0 md:border-r border-[#e8e6e1] flex flex-col overflow-hidden min-h-0">
        <div className="px-3 py-2 border-b border-[#e8e6e1] shrink-0">
          <span className="text-[10px] font-semibold text-[#6b7280]">Buy from Market</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {ITEMS.map((item) => {
            const selected = state.selectedItemToBuy === item.id;
            const badge = rarityBadge(item.rarity);
            return (
              <motion.div
                key={item.id}
                whileHover={{ y: -1 }}
                role="button"
                tabIndex={0}
                onClick={() => dispatch({ type: 'SELECT_BUY', itemId: selected ? null : item.id })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    dispatch({ type: 'SELECT_BUY', itemId: selected ? null : item.id });
                  }
                }}
                className="w-full text-left p-3 md:p-2.5 rounded-xl border transition-all"
                style={{
                  borderColor: selected ? '#1a1a1a' : '#e8e6e1',
                  background: selected ? '#f7f6f3' : 'white',
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-lg shrink-0">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-semibold text-[#1a1a1a] break-words">{item.name}</span>
                      <span className="text-[8px] px-1 py-0.5 rounded font-medium" style={{ background: badge.bg, color: badge.color, border: `1px solid ${badge.border}` }}>
                        {badge.label}
                      </span>
                    </div>
                    <div className="text-[10px] md:text-[9px] text-[#9ca3af] mt-0.5 break-words">{item.description}</div>
                  </div>
                  <div className="text-xs font-semibold text-[#1a1a1a] shrink-0">₸{item.buyPrice.toLocaleString()}</div>
                </div>
                <AnimatePresence>
                  {selected && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="flex gap-1.5 mt-2 pt-2 border-t border-[#e8e6e1]">
                        {[1, 2, 5].map((qty) => (
                          <button
                            key={qty}
                            className="flex-1 min-h-11 py-1.5 rounded-lg text-[10px] font-semibold transition-colors"
                            style={state.tenge < item.buyPrice * qty
                              ? { background: '#f7f6f3', color: '#9ca3af', border: '1px solid #e8e6e1', cursor: 'not-allowed' }
                              : { background: '#f0fdf4', color: '#2d6a4f', border: '1px solid #bbf7d0' }
                            }
                            disabled={state.tenge < item.buyPrice * qty}
                            onClick={(e) => { e.stopPropagation(); dispatch({ type: 'BUY_ITEM', itemId: item.id, quantity: qty }); }}
                          >
                            Buy ×{qty}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Sell */}
      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        <div className="px-3 py-2 border-b border-[#e8e6e1] shrink-0">
          <span className="text-[10px] font-semibold text-[#6b7280]">Inventory — Sell</span>
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1.5">
          {state.inventory.length === 0 ? (
            <div className="text-center mt-10">
              <div className="text-3xl mb-2">📦</div>
              <div className="text-xs text-[#9ca3af]">Empty. Buy something first.</div>
            </div>
          ) : (
            state.inventory.map((slot) => {
              const item = ITEMS.find((i) => i.id === slot.itemId);
              if (!item) return null;
              const selected = state.selectedItemToSell === slot.itemId;
              const profit = item.sellPrice - slot.purchasePrice;
              const profitPct = Math.round((profit / slot.purchasePrice) * 100);
              return (
                <motion.div
                  key={slot.itemId}
                  whileHover={{ y: -1 }}
                  role="button"
                  tabIndex={0}
                  onClick={() => dispatch({ type: 'SELECT_SELL', itemId: selected ? null : slot.itemId })}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      dispatch({ type: 'SELECT_SELL', itemId: selected ? null : slot.itemId });
                    }
                  }}
                  className="w-full text-left p-3 md:p-2.5 rounded-xl border transition-all"
                  style={{ borderColor: selected ? '#1a1a1a' : '#e8e6e1', background: selected ? '#f7f6f3' : 'white' }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-lg shrink-0">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-semibold text-[#1a1a1a] break-words">{item.name}</div>
                      <div className="text-[9px] text-[#9ca3af]">Qty: {slot.quantity}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-semibold text-[#2d6a4f]">₸{item.sellPrice.toLocaleString()}</div>
                      <div className="text-[9px]" style={{ color: profit >= 0 ? '#2d6a4f' : '#c0392b' }}>
                        {profit >= 0 ? '+' : ''}{profitPct}%
                      </div>
                    </div>
                  </div>
                  <AnimatePresence>
                    {selected && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="flex gap-1.5 mt-2 pt-2 border-t border-[#e8e6e1]">
                          {[1, Math.min(2, slot.quantity), Math.min(slot.quantity, 5)]
                            .filter((v, i, a) => a.indexOf(v) === i && v <= slot.quantity)
                            .map((qty) => (
                              <button
                                key={qty}
                                className="flex-1 min-h-11 py-1.5 rounded-lg text-[10px] font-semibold transition-colors"
                                style={{ background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' }}
                                onClick={(e) => { e.stopPropagation(); dispatch({ type: 'SELL_ITEM', itemId: item.id, quantity: qty }); }}
                              >
                                Sell ×{qty}
                              </button>
                            ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Outgoing Tab ─────────────────────────────────────────────────────────────

function OutgoingTab({ state, dispatch }: TradingTerminalProps) {
  return (
    <div className="h-full flex flex-col overflow-hidden relative">
      <AnimatePresence>
        {state.activePitch && <NegotiationModal state={state} dispatch={dispatch} />}
      </AnimatePresence>
      <div className="px-3 py-2 border-b border-[#e8e6e1] shrink-0">
        <span className="text-[10px] font-semibold text-[#6b7280]">Pitch to Clients</span>
      </div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {PITCHES.map((pitch) => {
          const npc = NPCS.find((n) => n.id === pitch.npcId);
          const item = ITEMS.find((i) => i.id === pitch.itemId);
          if (!npc || !item) return null;
          const hasItem = state.inventory.some((inv) => inv.itemId === pitch.itemId && inv.quantity > 0);
          const hasRep = state.reputation >= npc.reputationRequired;
          const available = hasItem && hasRep;
          return (
            <div
              key={pitch.id}
              className="p-3 rounded-xl border transition-all"
              style={{ borderColor: available ? '#e8e6e1' : '#f0eeeb', background: available ? 'white' : '#fafaf9' }}
            >
              <div className="flex flex-col sm:flex-row items-start gap-3">
                <span className="text-2xl shrink-0">{npc.avatar}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-[#1a1a1a]">{npc.name}</span>
                    <span className="text-[10px] text-[#9ca3af] italic">{npc.title}</span>
                  </div>
                  <div className="text-[10px] text-[#6b7280] mt-0.5">{pitch.description}</div>
                  <div className="flex items-center gap-x-3 gap-y-1 mt-1.5 text-[10px] flex-wrap">
                    <span className="text-[#6b7280]">{item.emoji} {item.name}</span>
                    <span className="font-semibold text-[#2d6a4f]">₸{pitch.basePrice.toLocaleString()}</span>
                    <span className="text-[#9ca3af]">+₸{pitch.successBonus.toLocaleString()} bonus</span>
                  </div>
                  {!hasRep && <div className="text-[10px] text-[#c0392b] mt-1">Need {npc.reputationRequired} reputation</div>}
                  {!hasItem && hasRep && <div className="text-[10px] text-[#b45309] mt-1">Missing {item.name}</div>}
                </div>
                <button
                  className="w-full sm:w-auto min-h-11 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0"
                  style={available
                    ? { background: '#1a1a1a', color: 'white' }
                    : { background: '#f7f6f3', color: '#9ca3af', border: '1px solid #e8e6e1', cursor: 'not-allowed' }
                  }
                  disabled={!available}
                  onClick={() => dispatch({ type: 'START_PITCH', pitchId: pitch.id })}
                >
                  Pitch
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Negotiation Modal ────────────────────────────────────────────────────────

function NegotiationModal({ state, dispatch }: TradingTerminalProps) {
  const pitch = PITCHES.find((p) => p.id === state.activePitch?.pitchId);
  const npc = pitch ? NPCS.find((n) => n.id === pitch.npcId) : null;
  const item = pitch ? ITEMS.find((i) => i.id === pitch.itemId) : null;
  if (!pitch || !npc || !item || !state.activePitch) return null;
  const ap = state.activePitch;
  const moodEmoji = ap.npcMood === 'interested' ? '😊' : ap.npcMood === 'annoyed' ? '😤' : '🤨';
  const roundPct = ap.maxRounds > 0 ? ((ap.round - 1) / ap.maxRounds) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }}
      className="absolute inset-x-0 top-0 z-10 m-2 md:m-3 p-3 md:p-4 max-h-[calc(100%-16px)] overflow-y-auto bg-white rounded-2xl border border-[#e8e6e1]"
      style={{ boxShadow: '0 8px 32px rgba(0,0,0,0.12)' }}
    >
      <div className="flex items-start gap-3 mb-3">
        <span className="text-2xl shrink-0">{npc.avatar}</span>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-semibold text-[#1a1a1a] break-words">{npc.name}</div>
          <div className="text-[10px] text-[#9ca3af] italic break-words">{npc.title}</div>
        </div>
        <span className="text-xl">{moodEmoji}</span>
      </div>

      <div className="flex justify-between text-[10px] text-[#9ca3af] mb-1">
        <span>Round {ap.round} of {ap.maxRounds}</span>
        <span className="capitalize">{ap.npcMood}</span>
      </div>
      <div className="h-1.5 bg-[#e8e6e1] rounded-full mb-3 overflow-hidden">
        <div className="h-full rounded-full bg-[#1a1a1a] transition-all" style={{ width: `${roundPct}%` }} />
      </div>

      <div className="bg-[#f7f6f3] rounded-xl p-3 mb-3 flex flex-col min-[390px]:flex-row justify-between gap-2 min-[390px]:items-center">
        <div>
          <div className="text-[10px] text-[#9ca3af]">Current Offer</div>
          <div className="text-xl font-bold text-[#1d4ed8]">₸{ap.currentOffer.toLocaleString()}</div>
        </div>
        <div className="text-right">
          <div className="text-[10px] text-[#9ca3af]">Item</div>
          <div className="text-sm">{item.emoji} {item.name}</div>
        </div>
      </div>

      <div className="flex flex-col min-[390px]:flex-row min-[390px]:items-center justify-between gap-1 text-[10px] mb-2">
        <span className="text-[#6b7280]">Focus: <span className="font-semibold text-[#6366f1]">{state.focus}/100</span></span>
        <div className="flex gap-2 text-[#9ca3af]">
          {ap.fakeScaricityUsed && <span>📢 Scarcity used</span>}
          {ap.nameDropUsed && <span>✨ Name-drop used</span>}
        </div>
      </div>

      <div className="grid grid-cols-1 min-[390px]:grid-cols-2 gap-2 mb-2">
        <button
          className="min-h-11 py-1.5 rounded-lg text-[10px] font-medium transition-colors"
          style={(!ap.fakeScaricityUsed && state.focus >= 20)
            ? { background: '#f0fdf4', color: '#2d6a4f', border: '1px solid #bbf7d0' }
            : { background: '#f7f6f3', color: '#9ca3af', border: '1px solid #e8e6e1', cursor: 'not-allowed' }
          }
          disabled={ap.fakeScaricityUsed || state.focus < 20}
          onClick={() => dispatch({ type: 'NEGOTIATE', action: 'fake_scarcity' })}
        >
          📢 Scarcity <span className="opacity-60">-20F</span>
        </button>
        <button
          className="min-h-11 py-1.5 rounded-lg text-[10px] font-medium transition-colors"
          style={(!ap.nameDropUsed && state.focus >= 25 && state.charisma >= 15)
            ? { background: '#f5f3ff', color: '#6366f1', border: '1px solid #ddd6fe' }
            : { background: '#f7f6f3', color: '#9ca3af', border: '1px solid #e8e6e1', cursor: 'not-allowed' }
          }
          disabled={ap.nameDropUsed || state.focus < 25 || state.charisma < 15}
          onClick={() => dispatch({ type: 'NEGOTIATE', action: 'name_drop' })}
        >
          ✨ Name-Drop <span className="opacity-60">-25F</span>
        </button>
      </div>

      <div className="grid grid-cols-1 min-[390px]:grid-cols-3 gap-2">
        <button
          className="min-h-11 py-2 rounded-lg text-xs font-semibold bg-[#f0fdf4] text-[#2d6a4f] border border-[#bbf7d0] transition-colors hover:bg-[#dcfce7]"
          onClick={() => dispatch({ type: 'NEGOTIATE', action: 'accept' })}
        >
          ✓ Accept
        </button>
        {ap.round < ap.maxRounds && (
          <button
            className="min-h-11 py-2 rounded-lg text-xs font-semibold bg-[#fffbeb] text-[#b45309] border border-[#fde68a] transition-colors"
            onClick={() => dispatch({ type: 'NEGOTIATE', action: 'counter' })}
          >
            ↔ Counter
          </button>
        )}
        <button
          className="min-h-11 py-2 rounded-lg text-xs font-semibold bg-[#fef2f2] text-[#c0392b] border border-[#fecaca] transition-colors"
          onClick={() => dispatch({ type: 'NEGOTIATE', action: 'walk' })}
        >
          ✗ Walk Away
        </button>
      </div>
    </motion.div>
  );
}
