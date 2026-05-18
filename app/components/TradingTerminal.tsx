'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { ITEMS, PITCHES, NPCS } from '../game/data';
import { GameState, GameAction } from '../game/state';
import IncomingPitches from './IncomingPitches';
import ContractPanel from './ContractPanel';

interface TradingTerminalProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

type Tab = 'market' | 'outgoing' | 'incoming' | 'contracts';

const TABS: { id: Tab; label: string; color: string }[] = [
  { id: 'market',    label: 'MARKET',    color: '#00ff41' },
  { id: 'outgoing',  label: 'OUTGOING',  color: '#0080ff' },
  { id: 'incoming',  label: 'INCOMING',  color: '#ffee00' },
  { id: 'contracts', label: 'CONTRACTS', color: '#ff6600' },
];

function rarityColor(r: string) {
  if (r === 'legendary') return '#ffee00';
  if (r === 'rare') return '#0080ff';
  return '#00ff41';
}

export default function TradingTerminal({ state, dispatch }: TradingTerminalProps) {
  const activeTab = state.activeTab === 'market' || state.activeTab === 'outgoing' || state.activeTab === 'incoming' || state.activeTab === 'contracts'
    ? state.activeTab : 'market';

  const pendingIncoming = state.incomingPitches.filter((p) => p.status === 'pending').length;
  const readyContracts = state.availableContracts.filter((c) => c.step === 'ready_to_sign').length;

  return (
    <div className="panel-blue h-full flex flex-col overflow-hidden">
      <div className="px-4 py-2 border-b-2 border-[#0080ff] flex items-center gap-1 shrink-0 flex-wrap">
        <div className="neon-blue text-[10px] font-bold tracking-widest mr-2">TERMINAL</div>
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
              className="btn-brutal text-[9px] px-2 py-1 relative"
              style={{
                color: active ? tab.color : '#444',
                borderColor: active ? tab.color : '#333',
                boxShadow: active ? `2px 2px 0 ${tab.color}` : 'none',
              }}
              onClick={() => dispatch({ type: 'SET_TAB', tab: tab.id })}
            >
              {tab.label}
              {badge && (
                <span className="absolute -top-1 -right-1 text-[8px] font-bold w-4 h-4 flex items-center justify-center" style={{ background: tab.color, color: '#000' }}>
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

// ─── Market Tab ──────────────────────────────────────────────────────────────

function MarketTab({ state, dispatch }: TradingTerminalProps) {
  return (
    <div className="flex h-full w-full">
      {/* Buy */}
      <div className="flex-1 border-r-2 border-[#0080ff33] flex flex-col overflow-hidden">
        <div className="px-3 py-2 border-b border-[#0080ff22] text-[10px] text-[#666] shrink-0">BUY FROM MARKET</div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {ITEMS.map((item) => {
            const selected = state.selectedItemToBuy === item.id;
            const color = rarityColor(item.rarity);
            return (
              <motion.button
                key={item.id}
                whileHover={{ x: 2 }}
                onClick={() => dispatch({ type: 'SELECT_BUY', itemId: selected ? null : item.id })}
                className="w-full text-left p-2 border transition-all"
                style={{
                  borderColor: selected ? color : '#1a1a1a',
                  background: selected ? `rgba(${color === '#00ff41' ? '0,255,65' : color === '#0080ff' ? '0,128,255' : '255,238,0'},0.06)` : 'transparent',
                }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold truncate" style={{ color }}>{item.name}</div>
                    <div className="text-[9px] text-[#555] truncate">{item.description}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[10px]" style={{ color }}>₸{item.buyPrice.toLocaleString()}</div>
                  </div>
                </div>
                <AnimatePresence>
                  {selected && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <div className="flex gap-1 mt-2 pt-1 border-t border-[#222]">
                        {[1, 2, 5].map((qty) => (
                          <button
                            key={qty}
                            className="btn-brutal btn-green text-[9px] px-2 py-1 flex-1"
                            disabled={state.tenge < item.buyPrice * qty}
                            onClick={(e) => { e.stopPropagation(); dispatch({ type: 'BUY_ITEM', itemId: item.id, quantity: qty }); }}
                          >
                            BUY ×{qty}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Sell (inventory) */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="px-3 py-2 border-b border-[#0080ff22] text-[10px] text-[#666] shrink-0">INVENTORY — SELL</div>
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {state.inventory.length === 0 ? (
            <div className="text-center text-[#333] text-xs mt-8"><div className="text-2xl mb-2">📦</div><div>Empty. Buy something.</div></div>
          ) : (
            state.inventory.map((slot) => {
              const item = ITEMS.find((i) => i.id === slot.itemId);
              if (!item) return null;
              const selected = state.selectedItemToSell === slot.itemId;
              const color = rarityColor(item.rarity);
              const profit = item.sellPrice - slot.purchasePrice;
              const profitPct = Math.round((profit / slot.purchasePrice) * 100);
              return (
                <motion.button
                  key={slot.itemId}
                  whileHover={{ x: 2 }}
                  onClick={() => dispatch({ type: 'SELECT_SELL', itemId: selected ? null : slot.itemId })}
                  className="w-full text-left p-2 border transition-all"
                  style={{ borderColor: selected ? color : '#1a1a1a', background: selected ? 'rgba(0,255,65,0.06)' : 'transparent' }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-sm">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-[10px] font-bold truncate" style={{ color }}>{item.name}</div>
                      <div className="text-[9px] text-[#555]">Qty: {slot.quantity}</div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-[10px] neon-green">₸{item.sellPrice.toLocaleString()}</div>
                      <div className="text-[9px]" style={{ color: profit >= 0 ? '#00ff41' : '#ff0040' }}>
                        {profit >= 0 ? '+' : ''}{profitPct}%
                      </div>
                    </div>
                  </div>
                  <AnimatePresence>
                    {selected && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                        <div className="flex gap-1 mt-2 pt-1 border-t border-[#222]">
                          {[1, Math.min(2, slot.quantity), Math.min(slot.quantity, 5)]
                            .filter((v, i, a) => a.indexOf(v) === i && v <= slot.quantity)
                            .map((qty) => (
                              <button
                                key={qty}
                                className="btn-brutal btn-yellow text-[9px] px-2 py-1 flex-1"
                                onClick={(e) => { e.stopPropagation(); dispatch({ type: 'SELL_ITEM', itemId: item.id, quantity: qty }); }}
                              >
                                SELL ×{qty}
                              </button>
                            ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.button>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Outgoing Pitches Tab ─────────────────────────────────────────────────────

function OutgoingTab({ state, dispatch }: TradingTerminalProps) {
  return (
    <div className="h-full flex flex-col overflow-hidden relative">
      <AnimatePresence>
        {state.activePitch && <NegotiationModal state={state} dispatch={dispatch} />}
      </AnimatePresence>
      <div className="px-3 py-2 border-b border-[#0080ff22] text-[10px] text-[#666] shrink-0">PITCH TO CLIENTS</div>
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {PITCHES.map((pitch) => {
          const npc = NPCS.find((n) => n.id === pitch.npcId);
          const item = ITEMS.find((i) => i.id === pitch.itemId);
          if (!npc || !item) return null;
          const hasItem = state.inventory.some((inv) => inv.itemId === pitch.itemId && inv.quantity > 0);
          const hasRep = state.reputation >= npc.reputationRequired;
          const available = hasItem && hasRep;
          return (
            <motion.div
              key={pitch.id}
              whileHover={{ x: 2 }}
              className="p-3 border transition-all"
              style={{ borderColor: available ? '#0080ff' : '#222', background: available ? 'rgba(0,128,255,0.04)' : 'transparent' }}
            >
              <div className="flex items-start gap-3">
                <span className="text-2xl">{npc.avatar}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="neon-blue text-[11px] font-bold">{npc.name}</span>
                    <span className="text-[9px] text-[#555] italic">{npc.title}</span>
                  </div>
                  <div className="text-[10px] text-[#777] mt-0.5">{pitch.description}</div>
                  <div className="flex items-center gap-3 mt-1.5 text-[9px]">
                    <span>{item.emoji} {item.name}</span>
                    <span className="neon-green">₸{pitch.basePrice.toLocaleString()}</span>
                    <span className="text-[#555]">+₸{pitch.successBonus.toLocaleString()}</span>
                  </div>
                  {!hasRep && <div className="text-[9px] neon-red mt-1">⚠ Need {npc.reputationRequired} rep</div>}
                  {!hasItem && hasRep && <div className="text-[9px] neon-orange mt-1">⚠ Missing {item.name}</div>}
                </div>
                <button
                  className="btn-brutal btn-blue text-[9px] px-2 py-1 shrink-0"
                  disabled={!available}
                  onClick={() => dispatch({ type: 'START_PITCH', pitchId: pitch.id })}
                >
                  PITCH
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Negotiation Modal ───────────────────────────────────────────────────────

function NegotiationModal({ state, dispatch }: TradingTerminalProps) {
  const pitch = PITCHES.find((p) => p.id === state.activePitch?.pitchId);
  const npc = pitch ? NPCS.find((n) => n.id === pitch.npcId) : null;
  const item = pitch ? ITEMS.find((i) => i.id === pitch.itemId) : null;
  if (!pitch || !npc || !item || !state.activePitch) return null;
  const ap = state.activePitch;
  const moodEmoji = ap.npcMood === 'interested' ? '😊' : ap.npcMood === 'annoyed' ? '😤' : '🤨';
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
      className="absolute inset-x-0 top-0 z-10 m-3 p-4 panel-blue"
      style={{ boxShadow: '0 0 25px rgba(0,128,255,0.4)' }}
    >
      <div className="flex items-start gap-3 mb-3">
        <span className="text-3xl">{npc.avatar}</span>
        <div className="flex-1">
          <div className="neon-blue text-sm font-bold">{npc.name}</div>
          <div className="text-[9px] text-[#666] italic">{npc.title}</div>
        </div>
        <span className="text-xl">{moodEmoji}</span>
      </div>
      <div className="flex justify-between text-[9px] mb-1">
        <span className="text-[#666]">ROUND {ap.round} / {ap.maxRounds}</span>
        <span className="text-[#666]">{ap.npcMood.toUpperCase()}</span>
      </div>
      <div className="stat-bar mb-3" style={{ borderColor: '#0080ff' }}>
        <div className="stat-fill" style={{ width: `${((ap.round - 1) / ap.maxRounds) * 100}%`, background: '#0080ff' }} />
      </div>
      <div className="p-3 mb-3 border border-[#0080ff] bg-[#0080ff0a]">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-[9px] text-[#666]">CURRENT OFFER</div>
            <div className="neon-blue text-2xl font-bold">₸{ap.currentOffer.toLocaleString()}</div>
          </div>
          <div className="text-right">
            <div className="text-[9px] text-[#666]">ITEM</div>
            <div className="text-xs">{item.emoji} {item.name}</div>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <button className="btn-brutal btn-green flex-1 py-2 text-[10px]" onClick={() => dispatch({ type: 'NEGOTIATE', action: 'accept' })}>✓ ACCEPT</button>
        {ap.round < ap.maxRounds && (
          <button className="btn-brutal btn-yellow flex-1 py-2 text-[10px]" onClick={() => dispatch({ type: 'NEGOTIATE', action: 'counter' })}>↔ COUNTER</button>
        )}
        <button className="btn-brutal btn-red flex-1 py-2 text-[10px]" onClick={() => dispatch({ type: 'NEGOTIATE', action: 'walk' })}>✗ WALK</button>
      </div>
    </motion.div>
  );
}