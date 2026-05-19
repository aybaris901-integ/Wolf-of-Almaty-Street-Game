'use client';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import {
  ITEMS, DIFFICULTY_HIGHLIGHTS, BALANCE_BY_RANK, getPlayerRankTier,
  charismaHintBonus, PERSONALITY_LABEL, PERSONALITY_COLOR,
  type Difficulty,
} from '../game/data';
import { GameState, GameAction, IncomingPitch } from '../game/state';

interface IncomingPitchesProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

// ─── Scam Probability Meter ───────────────────────────────────────────────────

function ScamProbabilityMeter({ probability }: { probability: number }) {
  const pct = Math.round(probability * 100);
  const color = pct >= 70 ? '#c0392b' : pct >= 40 ? '#b45309' : '#2d6a4f';
  const bg    = pct >= 70 ? '#fef2f2' : pct >= 40 ? '#fffbeb' : '#f0fdf4';
  const label = pct >= 70 ? 'High Risk' : pct >= 40 ? 'Suspicious' : 'Clear';
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-1">
        <span className="text-[9px] text-[#9ca3af]">Scam probability</span>
        <span className="text-[9px] font-semibold" style={{ color }}>{label} {pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-[#e8e6e1] overflow-hidden">
        <motion.div
          className="h-full rounded-full"
          style={{ background: color }}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        />
      </div>
    </div>
  );
}

// ─── Tell-annotated pitch text ─────────────────────────────────────────────────

function AnnotatedText({
  text, tells, flaggedTells, hoveredTell, hintedTells, isPending, onHoverTell, onFlagTell,
}: {
  text: string; tells: string[]; flaggedTells: string[]; hoveredTell: string | null;
  hintedTells: string[]; isPending: boolean;
  onHoverTell: (t: string | null) => void; onFlagTell: (t: string) => void;
}) {
  if (tells.length === 0 || !isPending) return <>{text}</>;
  let nodes: (string | React.ReactElement)[] = [text];
  tells.forEach((tell, idx) => {
    nodes = nodes.flatMap((node) => {
      if (typeof node !== 'string') return [node];
      const parts = node.split(tell);
      return parts.flatMap((part, i) => {
        if (i < parts.length - 1) {
          const isFlagged = flaggedTells.includes(tell);
          const isHovered = hoveredTell === tell;
          const isHinted = hintedTells.includes(tell);
          const bg = isFlagged ? '#fecaca' : isHovered ? '#fde68a' : isHinted ? '#fee2e2' : 'transparent';
          const textColor = isFlagged ? '#c0392b' : isHovered ? '#b45309' : isHinted ? '#dc2626' : '#6b7280';
          const border = isFlagged ? '1px solid #fca5a5' : isHovered ? '1px solid #fbbf24' : isHinted ? '1px solid #fca5a5' : '1px solid transparent';
          return [
            part,
            <span
              key={`${idx}-${i}`}
              style={{ color: textColor, background: bg, border, padding: '0 2px', borderRadius: 3, cursor: 'pointer', transition: 'all 0.15s ease' }}
              onMouseEnter={() => onHoverTell(tell)}
              onMouseLeave={() => onHoverTell(null)}
              onClick={() => onFlagTell(tell)}
              title={isFlagged ? 'Flagged as a tell' : 'Click to flag as suspicious'}
            >{tell}</span>,
          ];
        }
        return [part];
      });
    });
  });
  return <>{nodes}</>;
}

// ─── Single Pitch Card ────────────────────────────────────────────────────────

function PitchCard({
  pitch, state, dispatch, numHighlights,
}: {
  pitch: IncomingPitch; state: GameState; dispatch: React.Dispatch<GameAction>; numHighlights: number;
}) {
  const [flaggedTells, setFlaggedTells] = useState<string[]>([]);
  const [hoveredTell, setHoveredTell] = useState<string | null>(null);

  const item = ITEMS.find((i) => i.id === pitch.itemId);
  const hasItem = state.inventory.some((inv) => inv.itemId === pitch.itemId && inv.quantity > 0);
  const isPending     = pitch.status === 'pending';
  const isNegotiating = pitch.status === 'negotiating';
  const isCallback    = pitch.status === 'callback_pending';
  const isActive      = isPending || isNegotiating || isCallback;

  const hintedTells = pitch.tells.slice(0, numHighlights);

  const handleFlagTell = (tell: string) =>
    setFlaggedTells((prev) => prev.includes(tell) ? prev.filter((t) => t !== tell) : [...prev, tell]);

  const hoverBonus = hoveredTell && !flaggedTells.includes(hoveredTell) ? 0.15 : 0;
  const flagBonus  = Math.min(0.95, flaggedTells.length * 0.40);
  const probability = Math.min(1, 0.05 + flagBonus + hoverBonus);

  const canCounterPitch = pitch.isScammer && flaggedTells.length >= 2 && hasItem && isPending;
  const showMeter = pitch.isScammer && (isPending || isNegotiating) && pitch.tells.length > 0;
  const tooEager  = pitch.isScammer && pitch.negotiationRound >= 2 && pitch.clientCurrentOffer === pitch.playerAskPrice;

  const personalityColor = PERSONALITY_COLOR[pitch.personality] ?? '#9ca3af';

  // Card border styling
  const borderColor =
    pitch.status === 'scammed'   ? '#fca5a5' :
    pitch.status === 'accepted'  ? '#bbf7d0' :
    isNegotiating                ? '#e8e6e1' :
    isCallback                   ? '#fed7aa' :
    isPending                    ? '#bfdbfe' :
    '#e8e6e1';

  const cardBg =
    pitch.status === 'scammed'   ? '#fef2f2' :
    pitch.status === 'accepted'  ? '#f0fdf4' :
    isCallback                   ? '#fff7ed' :
    'white';

  return (
    <motion.div
      key={pitch.id}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border p-3 transition-all"
      style={{ borderColor, background: cardBg, opacity: isActive ? 1 : 0.65 }}
    >
      {/* Header row */}
      <div className="flex items-start gap-2 mb-2">
        <div className="w-9 h-9 rounded-xl bg-[#f7f6f3] border border-[#e8e6e1] flex items-center justify-center text-lg shrink-0">
          {pitch.sourceAvatar}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold text-[#1a1a1a]">{pitch.sourceName}</span>
            <span className="text-[9px] text-[#9ca3af] italic truncate">{pitch.sourceTitle}</span>
            {(isPending || isNegotiating) && (
              <span className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full"
                style={{ color: personalityColor, background: `${personalityColor}18`, border: `1px solid ${personalityColor}33` }}>
                {PERSONALITY_LABEL[pitch.personality]}
              </span>
            )}
            {pitch.status === 'accepted' && <span className="text-[9px] font-semibold text-[#2d6a4f]">✓ Sold</span>}
            {pitch.status === 'declined' && <span className="text-[9px] text-[#9ca3af]">✗ Declined</span>}
            {pitch.status === 'scammed'  && <span className="text-[9px] font-semibold text-[#c0392b]">💀 Scammed</span>}
            {isCallback && <span className="text-[9px] font-semibold text-[#b45309]">📞 Callback</span>}
          </div>

          {/* Quote bubble */}
          <div className="text-[10px] text-[#6b7280] italic mt-1 leading-snug">
            "<AnnotatedText
              text={pitch.pitchText}
              tells={pitch.tells}
              flaggedTells={flaggedTells}
              hoveredTell={hoveredTell}
              hintedTells={hintedTells}
              isPending={isPending || isNegotiating}
              onHoverTell={setHoveredTell}
              onFlagTell={handleFlagTell}
            />"
          </div>
        </div>
      </div>

      {/* Scam meter */}
      {showMeter && <ScamProbabilityMeter probability={probability} />}
      {showMeter && flaggedTells.length > 0 && (
        <div className="text-[9px] text-[#9ca3af] mt-1">
          Flagged: {flaggedTells.map((t) => `"${t}"`).join(', ')}
        </div>
      )}

      {tooEager && (
        <div className="text-[9px] mt-2 px-2 py-1.5 rounded-lg bg-[#fef2f2] border border-[#fecaca] text-[#c0392b]">
          ⚠ They matched your asking price exactly — red flag.
        </div>
      )}

      {pitch.status === 'scammed' && (
        <div className="text-[9px] text-[#c0392b] mt-1.5">
          Tells were: "{pitch.tells.join('", "')}"
        </div>
      )}

      {/* Offer boxes — shown while negotiating */}
      {isNegotiating && (
        <div className="mt-2 space-y-1.5">
          <div className="flex gap-2">
            <div className="flex-1 rounded-lg bg-[#fef2f2] border border-[#fecaca] p-2 text-center">
              <div className="text-[9px] text-[#c0392b]">Their offer</div>
              <div className="text-sm font-bold text-[#c0392b]">₸{pitch.clientCurrentOffer.toLocaleString()}</div>
            </div>
            <div className="flex-1 rounded-lg bg-[#f0fdf4] border border-[#bbf7d0] p-2 text-center">
              <div className="text-[9px] text-[#2d6a4f]">Your ask</div>
              <div className="text-sm font-bold text-[#2d6a4f]">₸{pitch.playerAskPrice.toLocaleString()}</div>
            </div>
          </div>
          <div className="flex justify-between text-[9px] text-[#9ca3af]">
            <span>Round {pitch.negotiationRound + 1} · Gap ₸{Math.max(0, pitch.playerAskPrice - pitch.clientCurrentOffer).toLocaleString()}</span>
            <span>Patience {pitch.patience}/{pitch.maxPatience}</span>
          </div>
          <div className="h-1.5 rounded-full bg-[#e8e6e1] overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: '#b45309' }}
              animate={{ width: `${pitch.maxPatience > 0 ? (pitch.patience / pitch.maxPatience) * 100 : 0}%` }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
            />
          </div>
        </div>
      )}

      {/* Callback */}
      {isCallback && (
        <div className="mt-1.5 text-[10px] text-[#b45309]">
          They came back at ₸{pitch.clientCurrentOffer.toLocaleString()}
        </div>
      )}

      {/* Footer: item + actions */}
      <div className="flex items-center gap-2 pt-2 mt-2 border-t border-[#e8e6e1] flex-wrap">
        <span className="text-[10px] text-[#6b7280]">{item?.emoji} {pitch.itemName}</span>
        {!isNegotiating && (
          <span className="text-[10px] font-semibold text-[#2d6a4f]">₸{pitch.offeredPrice.toLocaleString()}</span>
        )}
        {!hasItem && isActive && (
          <span className="text-[9px] text-[#b45309]">⚠ No stock</span>
        )}

        {/* PENDING actions */}
        {isPending && (
          <div className="ml-auto flex gap-1.5 flex-wrap justify-end">
            {canCounterPitch && (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-[#fffbeb] text-[#b45309] border border-[#fde68a]"
                onClick={() => dispatch({ type: 'COUNTER_PITCH', pitchId: pitch.id })}
                title="Out-scam the scammer!"
              >
                🎯 Counter
              </motion.button>
            )}
            <button
              className="px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-colors"
              style={hasItem
                ? { background: '#f0fdf4', color: '#2d6a4f', border: '1px solid #bbf7d0' }
                : { background: '#f7f6f3', color: '#9ca3af', border: '1px solid #e8e6e1', cursor: 'not-allowed' }
              }
              disabled={!hasItem}
              onClick={() => dispatch({ type: 'START_NEGOTIATION', pitchId: pitch.id })}
            >
              Negotiate
            </button>
            <button
              className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-[#fef2f2] text-[#c0392b] border border-[#fecaca]"
              onClick={() => dispatch({ type: 'RESPOND_INCOMING', pitchId: pitch.id, action: 'decline' })}
            >
              Decline
            </button>
          </div>
        )}

        {/* NEGOTIATING actions — 2-col grid + close deal */}
        {isNegotiating && (
          <div className="w-full mt-1 space-y-1.5">
            <div className="grid grid-cols-2 gap-1.5">
              <button
                className="py-1.5 rounded-lg text-[10px] font-medium bg-[#f7f6f3] text-[#6b7280] border border-[#e8e6e1]"
                onClick={() => dispatch({ type: 'NEGOTIATE_INCOMING', pitchId: pitch.id, action: 'hold_firm' })}
              >
                ✊ Hold Firm
              </button>
              <button
                className="py-1.5 rounded-lg text-[10px] font-medium bg-[#fffbeb] text-[#b45309] border border-[#fde68a]"
                onClick={() => dispatch({ type: 'NEGOTIATE_INCOMING', pitchId: pitch.id, action: 'small_discount' })}
              >
                −10%
              </button>
              <button
                className="py-1.5 rounded-lg text-[10px] font-medium bg-[#fff7ed] text-[#ea580c] border border-[#fed7aa]"
                onClick={() => dispatch({ type: 'NEGOTIATE_INCOMING', pitchId: pitch.id, action: 'big_discount' })}
              >
                −25%
              </button>
              <button
                className="py-1.5 rounded-lg text-[10px] font-medium transition-colors"
                style={state.focus >= 25
                  ? { background: '#f5f3ff', color: '#6366f1', border: '1px solid #ddd6fe' }
                  : { background: '#f7f6f3', color: '#9ca3af', border: '1px solid #e8e6e1', cursor: 'not-allowed' }
                }
                disabled={state.focus < 25}
                onClick={() => dispatch({ type: 'NEGOTIATE_INCOMING', pitchId: pitch.id, action: 'pitch_value' })}
                title="Costs 25 Focus"
              >
                ⚡ Pitch Value
              </button>
            </div>
            <button
              className="w-full py-2 rounded-lg text-xs font-semibold bg-[#c0392b] text-white hover:bg-[#a93226] transition-colors"
              onClick={() => dispatch({ type: 'NEGOTIATE_INCOMING', pitchId: pitch.id, action: 'walk_away' })}
            >
              Walk Away
            </button>
            <button
              className="w-full py-2 rounded-lg text-xs font-semibold bg-[#1a1a1a] text-white hover:bg-[#2d2d2d] transition-colors"
              onClick={() => dispatch({ type: 'NEGOTIATE_INCOMING', pitchId: pitch.id, action: 'accept' })}
            >
              Close Deal — ₸{pitch.clientCurrentOffer.toLocaleString()}
            </button>
          </div>
        )}

        {/* CALLBACK actions */}
        {isCallback && (
          <div className="ml-auto flex gap-1.5">
            <button
              className="px-2.5 py-1 rounded-lg text-[10px] font-semibold transition-colors"
              style={hasItem
                ? { background: '#f0fdf4', color: '#2d6a4f', border: '1px solid #bbf7d0' }
                : { background: '#f7f6f3', color: '#9ca3af', border: '1px solid #e8e6e1', cursor: 'not-allowed' }
              }
              disabled={!hasItem}
              onClick={() => dispatch({ type: 'ACCEPT_CALLBACK', pitchId: pitch.id })}
            >
              📞 Accept
            </button>
            <button
              className="px-2.5 py-1 rounded-lg text-[10px] font-semibold bg-[#f7f6f3] text-[#6b7280] border border-[#e8e6e1]"
              onClick={() => dispatch({ type: 'RESPOND_INCOMING', pitchId: pitch.id, action: 'decline' })}
            >
              Ignore
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function IncomingPitches({ state, dispatch }: IncomingPitchesProps) {
  const difficulty = (state.difficulty ?? 'normal') as Difficulty;
  const tier = getPlayerRankTier(state.totalEarned);
  const rankHintBonus = BALANCE_BY_RANK[tier].bonusHints;
  const charHintBonus = charismaHintBonus(state.charisma);
  const numHighlights = Math.max(0, DIFFICULTY_HIGHLIGHTS[difficulty] + rankHintBonus + charHintBonus);

  const pending    = state.incomingPitches.filter((p) => p.status === 'pending');
  const negotiating = state.incomingPitches.filter((p) => p.status === 'negotiating');
  const callbacks  = state.incomingPitches.filter((p) => p.status === 'callback_pending');
  const resolved   = state.incomingPitches.filter((p) => !['pending', 'negotiating', 'callback_pending'].includes(p.status));
  const activeCount = pending.length + negotiating.length + callbacks.length;

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-3 py-2 border-b border-[#e8e6e1] flex items-center gap-2 shrink-0">
        <span className="text-[10px] font-semibold text-[#6b7280]">Incoming Offers</span>
        {activeCount > 0 && (
          <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-[#fffbeb] text-[#b45309] border border-[#fde68a] font-medium">
            {activeCount} active
          </span>
        )}
        <div className="ml-auto flex items-center gap-2 text-[9px]">
          {numHighlights > 0
            ? <span className="text-[#2d6a4f] font-medium">{numHighlights} hint{numHighlights > 1 ? 's' : ''}</span>
            : <span className="text-[#c0392b]">No hints</span>
          }
          <span className="text-[#9ca3af]">hover · click to flag</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {state.incomingPitches.length === 0 && (
          <div className="text-center mt-10">
            <div className="text-3xl mb-2">📭</div>
            <div className="text-xs text-[#9ca3af]">No incoming offers yet.</div>
            <div className="text-[10px] text-[#9ca3af] mt-1">Start a new day to receive client pitches.</div>
          </div>
        )}

        <AnimatePresence>
          {[...negotiating, ...callbacks, ...pending, ...resolved].map((pitch) => (
            <PitchCard
              key={pitch.id}
              pitch={pitch}
              state={state}
              dispatch={dispatch}
              numHighlights={numHighlights}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}