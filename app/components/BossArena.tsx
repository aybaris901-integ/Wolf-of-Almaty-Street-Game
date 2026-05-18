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
  const dangerColor = pct < 25 ? '#ff0040' : pct < 50 ? '#ff6600' : color;
  return (
    <div className="mb-1">
      <div className="flex justify-between text-[10px] mb-1">
        <span style={{ color: dangerColor }}>{label}</span>
        <span style={{ color: dangerColor }}>{hp} / {maxHp}</span>
      </div>
      <div className="stat-bar" style={{ borderColor: dangerColor, height: 10 }}>
        <motion.div
          className="stat-fill"
          initial={{ width: '100%' }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4 }}
          style={{ background: dangerColor, boxShadow: `0 0 8px ${dangerColor}` }}
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
      <div className="panel-red h-full flex flex-col items-center justify-center p-6 text-center">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="text-6xl mb-4"
        >
          🦁
        </motion.div>
        <div className="neon-red text-lg font-bold mb-2">YERLAN AWAITS</div>
        <div className="text-[#666] text-xs max-w-[200px]">
          Complete enough trades and pitches to unlock the final boss fight.
        </div>
        <div className="mt-4 text-[10px] text-[#555]">
          Need: 2 sales + 1 pitch
        </div>
      </div>
    );
  }

  return (
    <div className="panel-red h-full flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b-2 border-[#ff0040]">
        <div className="neon-red text-xs font-bold tracking-widest">[ BOSS ARENA ]</div>
        <div className="text-[10px] text-[#666] mt-0.5 pulse-glow">FINAL CONFRONTATION</div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden p-3">
        {/* Boss portrait */}
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            animate={{
              scale: [1, 1.05, 1],
              filter: [
                'drop-shadow(0 0 5px #ff0040)',
                'drop-shadow(0 0 15px #ff0040)',
                'drop-shadow(0 0 5px #ff0040)',
              ],
            }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-4xl"
          >
            {bossData.avatar}
          </motion.div>
          <div>
            <div className="neon-red text-sm font-bold">{bossData.name}</div>
            <div className="text-[9px] text-[#666]">{bossData.title}</div>
          </div>
          <div className="ml-auto text-right">
            <div className="text-[9px] text-[#666]">TURN</div>
            <div
              className="text-sm font-bold"
              style={{ color: boss.turn === 'player' ? '#00ff41' : '#ff0040' }}
            >
              {boss.turn === 'player' ? 'YOUR MOVE' : 'BOSS MOVE'}
            </div>
          </div>
        </div>

        {/* HP bars */}
        <div className="mb-3">
          <HpBar hp={boss.bossHp} maxHp={boss.bossMaxHp} color="#ff0040" label="YERLAN HP" />
          <HpBar hp={boss.playerHp} maxHp={boss.playerMaxHp} color="#00ff41" label="YOUR HP" />
        </div>

        {/* Boss next move */}
        <div className="panel p-2 mb-3" style={{ borderColor: '#ff0040', boxShadow: 'none' }}>
          <div className="text-[9px] text-[#666] mb-1">BOSS NEXT MOVE</div>
          {(() => {
            const nextAbility = BOSS.abilities.find((a) => a.id === boss.bossNextAbility);
            if (!nextAbility) return null;
            const onCooldown = (boss.bossAbilityCooldowns[nextAbility.id] || 0) > 0;
            const displayAbility = onCooldown ? BOSS.abilities[0] : nextAbility;
            return (
              <div className="flex items-center gap-2">
                <span className="neon-red text-xs font-bold">{displayAbility.name}</span>
                <span className="text-[9px] text-[#666]">— {displayAbility.description}</span>
                <span className="neon-red text-xs ml-auto">-{displayAbility.damage}HP</span>
              </div>
            );
          })()}
        </div>

        {/* Player abilities */}
        <div className="mb-3">
          <div className="text-[10px] text-[#666] mb-2">YOUR MOVES</div>
          <div className="grid grid-cols-2 gap-2">
            {bossData.playerAbilities.map((ability) => {
              const cooldown = boss.abilityCooldowns[ability.id] || 0;
              const isHowl = ability.id === 'wolf_howl';
              const disabled =
                boss.turn !== 'player' ||
                cooldown > 0 ||
                (isHowl && boss.wolfHowlUsed) ||
                (ability.id === 'bribe' && state.tenge < 50000);

              return (
                <motion.button
                  key={ability.id}
                  whileHover={!disabled ? { scale: 1.02 } : {}}
                  whileTap={!disabled ? { scale: 0.98 } : {}}
                  className={`btn-brutal ${isHowl ? 'btn-yellow' : ability.id === 'bribe' ? 'btn-orange' : 'btn-green'} text-left p-2`}
                  disabled={disabled}
                  onClick={() => dispatch({ type: 'BOSS_ACTION', abilityId: ability.id })}
                >
                  <div className="text-[10px] font-bold">{ability.name}</div>
                  <div className="text-[8px] opacity-70 mt-0.5">{ability.description}</div>
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-[10px]">-{ability.damage} HP</span>
                    {cooldown > 0 && (
                      <span className="text-[9px] text-[#ff6600]">CD: {cooldown}</span>
                    )}
                    {isHowl && boss.wolfHowlUsed && (
                      <span className="text-[9px] text-[#555]">USED</span>
                    )}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Battle log */}
        <div className="flex-1 overflow-hidden">
          <div className="text-[10px] text-[#666] mb-1">BATTLE LOG</div>
          <div className="overflow-y-auto h-full space-y-1">
            <AnimatePresence initial={false}>
              {[...boss.log].reverse().map((entry, i) => (
                <motion.div
                  key={`${entry}-${i}`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="log-entry text-[10px]"
                  style={{
                    borderColor: entry.startsWith('⚡')
                      ? '#00ff41'
                      : entry.startsWith('🦁')
                      ? '#ff0040'
                      : '#666',
                    color: entry.startsWith('🏆') ? '#ffee00' : entry.startsWith('💀') ? '#ff0040' : '#aaa',
                  }}
                >
                  {entry}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}