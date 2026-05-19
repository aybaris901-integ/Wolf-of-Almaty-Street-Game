'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { BOSS } from '../game/data';
import { GameState, GameAction } from '../game/state';

interface BossArenaProps {
  state: GameState;
  dispatch: React.Dispatch<GameAction>;
}

function HpBar({ hp, maxHp, color, label }: { hp: number; maxHp: number; color: string; label: string }) {
  const pct = Math.max(0, (hp / maxHp) * 100);
  const dangerColor = pct < 25 ? '#c0392b' : pct < 50 ? '#b45309' : color;
  const dangerBg    = pct < 25 ? '#fef2f2' : pct < 50 ? '#fffbeb' : color === '#c0392b' ? '#fef2f2' : '#f0fdf4';
  return (
    <div className="mb-2">
      <div className="flex justify-between text-[10px] mb-1">
        <span className="font-medium" style={{ color: dangerColor }}>{label}</span>
        <span className="font-semibold" style={{ color: dangerColor }}>{hp} / {maxHp}</span>
      </div>
      <div className="h-2.5 rounded-full overflow-hidden" style={{ background: dangerBg }}>
        <motion.div
          className="h-full rounded-full"
          initial={{ width: '100%' }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4 }}
          style={{ background: dangerColor }}
        />
      </div>
    </div>
  );
}

export default function BossArena({ state, dispatch }: BossArenaProps) {
  const boss = state.boss;
  const bossData = BOSS;

  if (!boss.active && state.phase !== 'boss') {
    return (
      <div className="h-full flex flex-col items-center justify-center p-6 text-center bg-white">
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 3, repeat: Infinity }}
          className="text-6xl mb-4"
        >
          🦁
        </motion.div>
        <div className="text-base font-semibold text-[#c0392b] mb-2">Yerlan Awaits</div>
        <div className="text-xs text-[#9ca3af] max-w-[200px] leading-relaxed">
          Complete enough trades and pitches to unlock the final boss fight.
        </div>
        <div className="mt-3 text-[10px] text-[#9ca3af]">Need: 2 sales + 1 pitch</div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col overflow-hidden bg-white">
      <div className="px-4 py-3 border-b border-[#fecaca] shrink-0 bg-[#fef2f2]">
        <div className="text-xs font-semibold text-[#c0392b]">Boss Arena</div>
        <div className="text-[10px] text-[#9ca3af] mt-0.5">Final Confrontation</div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden p-3">
        {/* Boss portrait + turn indicator */}
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            animate={{ scale: [1, 1.04, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="w-12 h-12 rounded-2xl bg-[#fef2f2] border border-[#fecaca] flex items-center justify-center text-2xl shrink-0"
          >
            {bossData.avatar}
          </motion.div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-[#1a1a1a]">{bossData.name}</div>
            <div className="text-[9px] text-[#9ca3af]">{bossData.title}</div>
          </div>
          <div className="text-right shrink-0">
            <div className="text-[9px] text-[#9ca3af]">Turn</div>
            <div className="text-xs font-bold" style={{ color: boss.turn === 'player' ? '#2d6a4f' : '#c0392b' }}>
              {boss.turn === 'player' ? 'Your Move' : 'Boss Move'}
            </div>
          </div>
        </div>

        {/* HP bars */}
        <div className="bg-[#f7f6f3] rounded-xl p-3 mb-3 border border-[#e8e6e1]">
          <HpBar hp={boss.bossHp} maxHp={boss.bossMaxHp} color="#c0392b" label="Yerlan HP" />
          <HpBar hp={boss.playerHp} maxHp={boss.playerMaxHp} color="#2d6a4f" label="Your HP" />
        </div>

        {/* Boss next move */}
        <div className="bg-[#fef2f2] border border-[#fecaca] rounded-xl p-2.5 mb-3">
          <div className="text-[9px] text-[#9ca3af] mb-1">Boss next move</div>
          {(() => {
            const nextAbility = BOSS.abilities.find((a) => a.id === boss.bossNextAbility);
            if (!nextAbility) return null;
            const onCooldown = (boss.bossAbilityCooldowns[nextAbility.id] || 0) > 0;
            const displayAbility = onCooldown ? BOSS.abilities[0] : nextAbility;
            return (
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-[#c0392b]">{displayAbility.name}</span>
                <span className="text-[9px] text-[#9ca3af] flex-1">— {displayAbility.description}</span>
                <span className="text-xs font-bold text-[#c0392b]">-{displayAbility.damage}HP</span>
              </div>
            );
          })()}
        </div>

        {/* Player abilities */}
        <div className="mb-3">
          <div className="text-[10px] font-medium text-[#6b7280] mb-2">Your Moves</div>
          <div className="grid grid-cols-2 gap-2">
            {bossData.playerAbilities.map((ability) => {
              const cooldown = boss.abilityCooldowns[ability.id] || 0;
              const isHowl = ability.id === 'wolf_howl';
              const disabled =
                boss.turn !== 'player' ||
                cooldown > 0 ||
                (isHowl && boss.wolfHowlUsed) ||
                (ability.id === 'bribe' && state.tenge < 50000);

              const btnStyle = disabled
                ? { background: '#f7f6f3', color: '#9ca3af', border: '1px solid #e8e6e1', cursor: 'not-allowed' }
                : isHowl
                  ? { background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a' }
                  : ability.id === 'bribe'
                    ? { background: '#fff7ed', color: '#ea580c', border: '1px solid #fed7aa' }
                    : { background: '#f0fdf4', color: '#2d6a4f', border: '1px solid #bbf7d0' };

              return (
                <motion.button
                  key={ability.id}
                  whileHover={!disabled ? { y: -1 } : {}}
                  whileTap={!disabled ? { scale: 0.98 } : {}}
                  className="text-left p-2 rounded-xl transition-all"
                  style={btnStyle}
                  disabled={disabled}
                  onClick={() => dispatch({ type: 'BOSS_ACTION', abilityId: ability.id })}
                >
                  <div className="text-[10px] font-semibold">{ability.name}</div>
                  <div className="text-[8px] opacity-70 mt-0.5">{ability.description}</div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[9px] font-medium">-{ability.damage} HP</span>
                    {cooldown > 0 && <span className="text-[9px] text-[#b45309]">CD: {cooldown}</span>}
                    {isHowl && boss.wolfHowlUsed && <span className="text-[9px] text-[#9ca3af]">Used</span>}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Battle log */}
        <div className="flex-1 overflow-hidden">
          <div className="text-[10px] font-medium text-[#6b7280] mb-1.5">Battle Log</div>
          <div className="overflow-y-auto h-full space-y-1">
            <AnimatePresence initial={false}>
              {[...boss.log].reverse().map((entry, i) => (
                <motion.div
                  key={`${entry}-${i}`}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex gap-2 items-start px-2 py-1 rounded-lg"
                >
                  <div
                    className="w-1 rounded-full shrink-0 mt-1 self-stretch"
                    style={{
                      background: entry.startsWith('⚡') ? '#2d6a4f' : entry.startsWith('🦁') ? '#c0392b' : '#9ca3af',
                      minHeight: 10,
                    }}
                  />
                  <span className="text-[9px] leading-snug" style={{
                    color: entry.startsWith('🏆') ? '#b45309' : entry.startsWith('💀') ? '#c0392b' : '#6b7280',
                  }}>
                    {entry}
                  </span>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}