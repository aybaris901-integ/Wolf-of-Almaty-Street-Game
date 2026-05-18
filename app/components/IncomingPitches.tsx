'use client';
import { motion, AnimatePresence } from 'framer-motion';
import React, { useState } from 'react';
import { ITEMS, DIFFICULTY_HIGHLIGHTS, type Difficulty } from '../game/data';
import { GameState, GameAction, IncomingPitch } from '../game/state';

interface IncomingPitchesProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

// ─── Scam Probability Meter ───────────────────────────────────────────────────

function ScamProbabilityMeter({ probability }: { probability: number }) {
  const pct = Math.round(probability * 100);
  const color = pct >= 70 ? '#ff0040' : pct >= 40 ? '#ffee00' : '#00ff41';
  const label = pct >= 70 ? 'HIGH RISK' : pct >= 40 ? 'SUSPICIOUS' : 'CLEAR';

  return (
    <div className="mt-2 mb-1">
      <div className="flex items-center justify-between mb-0.5">
        <span className="text-[8px] text-[#444] tracking-widest">SCAM PROBABILITY</span>
        <span className="text-[8px] font-bold" style={{ color }}>{label} {pct}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full" style={{ background: '#1a1a1a' }}>
        <motion.div
          className="h-full rounded-full"
          style={{ background: color, boxShadow: `0 0 6px ${color}` }}
          animate={{ width: `${pct}%` }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        />
      </div>
    </div>
  );
}

// ─── Tell-annotated pitch text ─────────────────────────────────────────────────

function AnnotatedText({
  text,
  tells,
  flaggedTells,
  hoveredTell,
  hintedTells,
  isPending,
  onHoverTell,
  onFlagTell,
}: {
  text: string;
  tells: string[];
  flaggedTells: string[];
  hoveredTell: string | null;
  hintedTells: string[];
  isPending: boolean;
  onHoverTell: (tell: string | null) => void;
  onFlagTell: (tell: string) => void;
}) {
  if (tells.length === 0 || !isPending) return <>{text}</>;

  // Split text by tell phrases, tag them
  let nodes: React.ReactNode[] = [text];
  tells.forEach((tell, tellIdx) => {
    nodes = nodes.flatMap((node) => {
      if (typeof node !== 'string') return [node];
      const parts = node.split(tell);
      return parts.flatMap((part, i) => {
        if (i < parts.length - 1) {
          const isFlagged = flaggedTells.includes(tell);
          const isHovered = hoveredTell === tell;
          const isHinted = hintedTells.includes(tell);

          const borderColor = isFlagged ? '#ff0040' : isHovered ? '#ffee00' : isHinted ? 'rgba(255,0,64,0.5)' : 'rgba(255,238,0,0.2)';
          const bg = isFlagged ? 'rgba(255,0,64,0.2)' : isHovered ? 'rgba(255,238,0,0.15)' : isHinted ? 'rgba(255,0,64,0.1)' : 'transparent';
          const textColor = isFlagged ? '#ff0040' : isHovered ? '#ffee00' : isHinted ? '#ff6688' : '#ccc';

          return [
            part,
            <span
              key={`${tellIdx}-${i}`}
              style={{
                color: textColor,
                background: bg,
                border: `1px solid ${borderColor}`,
                padding: '0 2px',
                borderRadius: 2,
                cursor: 'pointer',
                transition: 'all 0.15s ease',
              }}
              onMouseEnter={() => onHoverTell(tell)}
              onMouseLeave={() => onHoverTell(null)}
              onClick={() => onFlagTell(tell)}
              title={isFlagged ? 'Flagged as a tell' : 'Click to flag as suspicious'}
            >
              {tell}
            </span>,
          ];
        }
        return [part];
      });
    });
  });

  return <>{nodes}</>;
}

// ─── Single pitch card with per-pitch state ───────────────────────────────────

function PitchCard({
  pitch,
  state,
  dispatch,
  numHighlights,
}: {
  pitch: IncomingPitch;
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
  numHighlights: number;
}) {
  const [flaggedTells, setFlaggedTells] = useState<string[]>([]);
  const [hoveredTell, setHoveredTell] = useState<string | null>(null);

  const item = ITEMS.find((i) => i.id === pitch.itemId);
  const hasItem = state.inventory.some((inv) => inv.itemId === pitch.itemId && inv.quantity > 0);
  const isPending = pitch.status === 'pending';

  // Tells that get a visual hint based on difficulty
  const hintedTells = pitch.tells.slice(0, numHighlights);

  const handleFlagTell = (tell: string) => {
    setFlaggedTells((prev) =>
      prev.includes(tell) ? prev.filter((t) => t !== tell) : [...prev, tell]
    );
  };

  // Probability calc: baseline 5%, +40% per flag, +15% while hovering unflagged tell
  const hoverBonus = hoveredTell && !flaggedTells.includes(hoveredTell) ? 0.15 : 0;
  const flagBonus = Math.min(0.95, flaggedTells.length * 0.40);
  const probability = Math.min(1, 0.05 + flagBonus + hoverBonus);

  const canCounterPitch = pitch.isScammer && flaggedTells.length >= 2 && hasItem && isPending;
  const showMeter = pitch.isScammer && isPending && pitch.tells.length > 0;

  const borderColor =
    pitch.status === 'scammed' ? '#ff0040'
    : pitch.status === 'accepted' ? '#00ff41'
    : isPending ? '#0080ff'
    : '#222';
  const bgColor =
    pitch.status === 'scammed' ? 'rgba(255,0,64,0.05)'
    : pitch.status === 'accepted' ? 'rgba(0,255,65,0.04)'
    : 'transparent';

  return (
    <motion.div
      key={pitch.id}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-3 border transition-all"
      style={{ borderColor, background: bgColor, opacity: isPending ? 1 : 0.6 }}
    >
      {/* Header */}
      <div className="flex items-start gap-2 mb-2">
        <span className="text-xl shrink-0">{pitch.sourceAvatar}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="neon-blue text-xs font-bold">{pitch.sourceName}</span>
            <span className="text-[9px] text-[#555] italic truncate">{pitch.sourceTitle}</span>
            {pitch.status === 'accepted' && <span className="text-[9px] neon-green">✓ SOLD</span>}
            {pitch.status === 'declined' && <span className="text-[9px] text-[#555]">✗ DECLINED</span>}
            {pitch.status === 'scammed' && <span className="text-[9px] neon-red">💀 SCAMMED</span>}
          </div>

          {/* Pitch text with annotated tells */}
          <div className="text-[10px] leading-snug mt-1" style={{ color: isPending ? '#aaa' : '#555' }}>
            <AnnotatedText
              text={pitch.pitchText}
              tells={pitch.tells}
              flaggedTells={flaggedTells}
              hoveredTell={hoveredTell}
              hintedTells={hintedTells}
              isPending={isPending}
              onHoverTell={setHoveredTell}
              onFlagTell={handleFlagTell}
            />
          </div>

          {/* Scam probability meter */}
          {showMeter && (
            <ScamProbabilityMeter probability={probability} />
          )}

          {/* Flagged tells summary */}
          {showMeter && flaggedTells.length > 0 && (
            <div className="text-[8px] text-[#666] mt-0.5">
              Flagged: {flaggedTells.map((t) => `"${t}"`).join(', ')}
            </div>
          )}

          {/* Post-scam tell reveal */}
          {pitch.status === 'scammed' && (
            <div className="text-[9px] neon-red mt-1">
              Tells were: "{pitch.tells.join('", "')}"
            </div>
          )}
        </div>
      </div>

      {/* Footer: item + price + actions */}
      <div className="flex items-center gap-2 pt-2 border-t border-[#1a1a1a] flex-wrap">
        <span className="text-[10px]">{item?.emoji} {pitch.itemName}</span>
        <span className="neon-green text-[10px] font-bold">₸{pitch.offeredPrice.toLocaleString()}</span>
        {!hasItem && isPending && (
          <span className="text-[9px] neon-orange">⚠ no stock</span>
        )}

        {isPending && (
          <div className="ml-auto flex gap-1 flex-wrap justify-end">
            {/* COUNTER-PITCH — unlocks at 2+ flagged tells */}
            {canCounterPitch && (
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="btn-brutal btn-yellow text-[9px] px-2 py-1"
                onClick={() => dispatch({ type: 'COUNTER_PITCH', pitchId: pitch.id })}
                title="Out-scam the scammer — sell at 200% value!"
              >
                🎯 COUNTER-PITCH
              </motion.button>
            )}
            <button
              className="btn-brutal btn-green text-[9px] px-2 py-1"
              disabled={!hasItem}
              onClick={() => dispatch({ type: 'RESPOND_INCOMING', pitchId: pitch.id, action: 'accept' })}
            >
              ACCEPT
            </button>
            <button
              className="btn-brutal btn-red text-[9px] px-2 py-1"
              onClick={() => dispatch({ type: 'RESPOND_INCOMING', pitchId: pitch.id, action: 'decline' })}
            >
              DECLINE
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
  const numHighlights = DIFFICULTY_HIGHLIGHTS[difficulty];
  const pending = state.incomingPitches.filter((p) => p.status === 'pending');
  const resolved = state.incomingPitches.filter((p) => p.status !== 'pending');

  return (
    <div className="h-full flex flex-col overflow-hidden">
      <div className="px-3 py-2 border-b border-[#0080ff33] flex items-center gap-2 shrink-0">
        <span className="text-[10px] text-[#666]">INCOMING OFFERS TODAY</span>
        {pending.length > 0 && (
          <span className="text-[9px] px-1 py-0.5 neon-yellow" style={{ border: '1px solid #ffee00' }}>
            {pending.length} pending
          </span>
        )}
        <div className="ml-auto flex items-center gap-2">
          {difficulty === 'rookie' && <span className="text-[9px] neon-green">2 hints ON</span>}
          {difficulty === 'normal' && <span className="text-[9px] neon-yellow">1 hint ON</span>}
          {difficulty === 'hardcore' && <span className="text-[9px] neon-red">NO HINTS</span>}
          <span className="text-[8px] text-[#333]">hover tells to probe · click to flag</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {state.incomingPitches.length === 0 && (
          <div className="text-center text-[#444] text-xs mt-8">
            <div className="text-2xl mb-2">📭</div>
            <div>No incoming offers yet.</div>
            <div className="text-[9px] mt-1">Start a new day to receive client pitches.</div>
          </div>
        )}

        <AnimatePresence>
          {[...pending, ...resolved].map((pitch) => (
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