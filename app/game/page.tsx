'use client';
import { useReducer, useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { gameReducer, initialState } from './state';
import { saveGame, loadSave, clearSave } from './saveSystem';
import { DIFFICULTY_SECONDS, RAID_COST, type Difficulty } from './data';
import { useGameTimer } from '../hooks/useGameTimer';
import { useMultiplayer, hasPlayerName } from '../hooks/useMultiplayer';
import { isSupabaseConfigured } from '../lib/supabase';
import StatsPanel from '../components/StatsPanel';
import TradingTerminal from '../components/TradingTerminal';
import BossArena from '../components/BossArena';
import NPCRoster from '../components/NPCRoster';
import ActivityLog from '../components/ActivityLog';
import DayStartScreen from '../components/DayStartScreen';
import DayEndModal from '../components/DayEndModal';
import EndScreen from '../components/EndScreen';
import PlayerNameModal from '../components/PlayerNameModal';
import RaidNotification, { type RaidAlert } from '../components/RaidNotification';
import FullscreenVideoOverlay from '../components/FullscreenVideoOverlay';

export default function GamePage() {
  const router = useRouter();
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [mounted, setMounted] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
  const [raidAlerts, setRaidAlerts] = useState<RaidAlert[]>([]);
  const [showFirstMoneyVideo, setShowFirstMoneyVideo] = useState(false);
  const saleBaselineRef = useRef<{ sales: number; pitches: number; scammed: number } | null>(null);

  // Load save or start fresh
  useEffect(() => {
    const s = loadSave();
    if (s) {
      dispatch({ type: 'LOAD_SAVE', data: s });
    } else {
      dispatch({ type: 'START_GAME' });
    }
    setMounted(true);
  }, []);

  // First-money video: fires after the first legitimate item sale this session.
  // Scammer-loss sales are excluded because they also bump dailyStats.scammersFooled.
  useEffect(() => {
    if (!mounted) return;
    const curr = {
      sales: state.salesCompleted,
      pitches: state.pitchesCompleted,
      scammed: state.dailyStats.scammersFooled,
    };
    if (saleBaselineRef.current === null) {
      saleBaselineRef.current = curr;
      return;
    }
    const prev = saleBaselineRef.current;
    const newSale = (curr.sales + curr.pitches) > (prev.sales + prev.pitches);
    const newScam = curr.scammed > prev.scammed;
    saleBaselineRef.current = curr;
    if (newSale && !newScam) {
      let seen = false;
      try { seen = localStorage.getItem('firstMoneyVideoSeen') === 'true'; } catch (_) {}
      if (!seen) {
        try { localStorage.setItem('firstMoneyVideoSeen', 'true'); } catch (_) {}
        setShowFirstMoneyVideo(true);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mounted, state.salesCompleted, state.pitchesCompleted, state.dailyStats.scammersFooled]);

  // Auto-save
  useEffect(() => {
    if (!mounted) return;
    if (state.phase !== 'intro' && state.phase !== 'victory' && state.phase !== 'defeat') {
      saveGame(state);
    }
    if (state.phase === 'victory' || state.phase === 'defeat') {
      clearSave();
    }
  }, [state, mounted]);

  // Multiplayer
  const handleRaidReceived = useCallback((raiderId: string, raiderName: string) => {
    dispatch({ type: 'APPLY_RAID', raiderName });
    setRaidAlerts(prev => [...prev, {
      id: `${Date.now()}-${raiderId}`, raiderId, raiderName, timestamp: Date.now(),
    }]);
  }, []);

  const { playerId, playerName, leaderboard, connected, publishScore, sendRaid } = useMultiplayer({
    onRaidReceived: handleRaidReceived,
  });

  // Show name modal once in sales phase
  useEffect(() => {
    if (isSupabaseConfigured && mounted && state.phase === 'sales' && !hasPlayerName()) {
      setShowNameModal(true);
    }
  }, [mounted, state.phase]);

  // Publish score on day end
  const prevPhaseRef = useRef(state.phase);
  useEffect(() => {
    if (prevPhaseRef.current === 'sales' && state.phase === 'day_end') {
      publishScore(state.dailyStats.earned, state.totalEarned, state.day);
    }
    prevPhaseRef.current = state.phase;
  }, [state.phase, state.dailyStats.earned, state.totalEarned, state.day, publishScore]);

  // Timer
  const handleTimerExpire = useCallback(() => { dispatch({ type: 'END_DAY' }); }, []);
  const timer = useGameTimer(handleTimerExpire);

  const prevPhase = useRef(state.phase);
  useEffect(() => {
    if (prevPhase.current !== 'sales' && state.phase === 'sales' && state.difficulty) {
      timer.start(DIFFICULTY_SECONDS[state.difficulty]);
    }
    if (state.phase === 'day_end' || state.phase === 'boss') timer.stop();
    prevPhase.current = state.phase;
  }, [state.phase, state.difficulty, timer]);

  // Handlers
  const handleSetDifficulty = useCallback((d: Difficulty) => {
    dispatch({ type: 'SET_DIFFICULTY', difficulty: d });
  }, []);
  const handleBeginDay    = useCallback(() => dispatch({ type: 'BEGIN_DAY' }), []);
  const handleEndDayEarly = useCallback(() => { timer.stop(); dispatch({ type: 'END_DAY' }); }, [timer]);
  const handleNextDay     = useCallback(() => dispatch({ type: 'NEXT_DAY' }), []);
  const handleStartBoss   = useCallback(() => { timer.stop(); dispatch({ type: 'START_BOSS' }); }, [timer]);
  const handleRestart     = useCallback(() => { clearSave(); router.push('/'); }, [router]);
  const handleRaid        = useCallback((targetId: string, targetName: string) => {
    if (state.tenge < RAID_COST) return;
    dispatch({ type: 'PAY_RAID_COST' });
    sendRaid(targetId);
  }, [state.tenge, sendRaid]);
  const handleDismissRaid = useCallback((id: string) => {
    setRaidAlerts(prev => prev.filter(r => r.id !== id));
  }, []);

  // Loading
  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f7f6f3]">
        <div className="text-[#9ca3af] text-sm">Loading…</div>
      </div>
    );
  }

  // Phase-routed screens
  if (state.phase === 'intro' || state.phase === 'day_start') {
    return (
      <DayStartScreen
        state={state}
        onSetDifficulty={handleSetDifficulty}
        onBeginDay={handleBeginDay}
        onBack={() => router.push('/')}
      />
    );
  }

  if (state.phase === 'day_end') {
    return (
      <DayEndModal
        day={state.day}
        stats={state.dailyStats}
        leaderboard={leaderboard}
        minProfitTarget={state.minProfitTarget}
        lossStreak={state.lossStreak}
        onNextDay={handleNextDay}
      />
    );
  }

  if (state.phase === 'victory' || state.phase === 'defeat') {
    return <EndScreen state={state} onRestart={handleRestart} />;
  }

  // Main dashboard (sales + boss)
  const isBoss = state.phase === 'boss';
  const timerPct = state.difficulty && timer.seconds > 0
    ? (timer.seconds / DIFFICULTY_SECONDS[state.difficulty]) * 100
    : 100;
  const timerColor = timerPct <= 25 ? '#c0392b' : timerPct <= 50 ? '#b45309' : '#2d6a4f';

  return (
    <div className="min-h-screen md:h-screen flex flex-col overflow-x-hidden md:overflow-hidden bg-[#f7f6f3]">
      {showNameModal && <PlayerNameModal onConfirm={() => setShowNameModal(false)} />}
      <RaidNotification raids={raidAlerts} onDismiss={handleDismissRaid} />
      {showFirstMoneyVideo && (
        <FullscreenVideoOverlay
          src="/videos/first-money.mp4"
          onFinish={() => setShowFirstMoneyVideo(false)}
        />
      )}

      {/* Top bar */}
      <div className="min-h-11 shrink-0 border-b border-[#e8e6e1] bg-white flex flex-wrap md:flex-nowrap items-center px-3 md:px-4 py-2 md:py-0 gap-2 md:gap-4">
        <button
          onClick={() => router.push('/')}
          className="min-h-8 text-sm font-semibold text-[#1a1a1a] hover:text-[#6b7280] transition-colors"
        >
          🐺 Wolf of Almaty
        </button>

        <div className="order-3 md:order-none w-full md:w-auto flex items-center gap-x-2.5 gap-y-1 text-xs text-[#6b7280] overflow-x-auto whitespace-nowrap">
          <span className="font-medium text-[#1a1a1a]">Day {state.day}/{state.maxDays}</span>
          <span className="text-[#d5d3cd]">·</span>
          <span className="font-semibold text-[#1a1a1a]">₸{state.tenge.toLocaleString()}</span>
          <span className="text-[#d5d3cd]">·</span>
          <span>Rep {state.reputation}</span>
          <span className="text-[#d5d3cd]">·</span>
          <span>Chr {state.charisma}</span>
          {playerName && (
            <>
              <span className="text-[#d5d3cd]">·</span>
              <span className="text-[#9ca3af]">{playerName}</span>
            </>
          )}
        </div>

        <div className="ml-auto flex items-center gap-2">
          {timer.running && (
            <div
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
              style={{
                background: timerPct <= 25 ? '#fef2f2' : timerPct <= 50 ? '#fffbeb' : '#f0fdf4',
                color: timerColor,
              }}
            >
              <span>⏱</span>
              <span>{timer.display}</span>
            </div>
          )}
          <div
            className="px-3 py-1 rounded-full text-xs font-semibold"
            style={isBoss
              ? { background: '#fef2f2', color: '#c0392b' }
              : { background: '#f0fdf4', color: '#2d6a4f' }
            }
          >
            {isBoss ? '⚔️ Boss Fight' : '📈 Trading'}
          </div>
        </div>
      </div>

      {/* Main 3-panel grid */}
      <div className="flex-1 min-h-0 overflow-visible md:overflow-hidden grid grid-cols-1 md:grid-cols-[260px_1fr_280px]">

        {/* Left: Stats */}
        <div className="border-b md:border-b-0 md:border-r border-[#e8e6e1] overflow-visible md:overflow-hidden bg-white">
          <StatsPanel
            state={state}
            timerDisplay={timer.display}
            timerSeconds={timer.seconds}
            timerRunning={timer.running}
            onEndDayEarly={handleEndDayEarly}
            onStartBoss={handleStartBoss}
          />
        </div>

        {/* Center: Trading or Boss */}
        <div className="flex flex-col min-h-[680px] md:min-h-0 overflow-hidden">
          <AnimatePresence mode="wait">
            {isBoss ? (
              <motion.div key="boss" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full overflow-hidden">
                <BossArena state={state} dispatch={dispatch} />
              </motion.div>
            ) : (
              <motion.div key="trading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col overflow-hidden">
                <div className="flex-1 overflow-hidden">
                  <TradingTerminal state={state} dispatch={dispatch} />
                </div>
                <div className="h-[140px] shrink-0 border-t border-[#e8e6e1] bg-white">
                  <ActivityLog log={state.log} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: NPCRoster */}
        <div className="border-t md:border-t-0 md:border-l border-[#e8e6e1] min-h-[420px] md:min-h-0 overflow-hidden bg-white">
          <AnimatePresence mode="wait">
            {isBoss ? (
              <motion.div key="battle-feed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col overflow-hidden">
                <div className="px-4 py-3 border-b border-[#e8e6e1] shrink-0">
                  <div className="text-xs font-semibold" style={{ color: '#c0392b' }}>Battle Feed</div>
                </div>
                <div className="flex-1 overflow-hidden bg-white">
                  <ActivityLog log={state.log} />
                </div>
              </motion.div>
            ) : (
              <motion.div key="roster" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full overflow-hidden">
                <NPCRoster state={state} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom bar: leaderboard + raid */}
      <div className="min-h-10 shrink-0 border-t border-[#e8e6e1] bg-white flex flex-wrap items-center px-3 md:px-4 py-2 md:py-0 gap-2 md:gap-4">
        <span className="text-[10px] font-semibold text-[#9ca3af] tracking-wide shrink-0">RANKINGS</span>

        {leaderboard.length === 0 && (
          <span className="text-[10px] text-[#9ca3af]">
            {isSupabaseConfigured ? 'Connecting…' : 'Offline mode'}
          </span>
        )}

        {leaderboard.slice(0, 3).map((entry, i) => (
          <div key={entry.player_id} className="flex items-center gap-1.5 min-w-0">
            <span className="text-xs">{['🥇', '🥈', '🥉'][i]}</span>
            <span className="text-[11px] font-medium text-[#1a1a1a] max-w-[90px] truncate">{entry.player_name}</span>
            <span className="text-[11px] font-semibold text-[#2d6a4f]">₸{entry.daily_earnings.toLocaleString()}</span>
            {entry.player_id !== playerId && isSupabaseConfigured && (
              <button
                className="text-[9px] px-1.5 py-0.5 rounded font-medium"
                style={{ background: '#fef2f2', color: '#c0392b', border: '1px solid #fecaca' }}
                disabled={state.tenge < RAID_COST}
                title={`Send scammer — costs ₸${RAID_COST}`}
                onClick={() => handleRaid(entry.player_id, entry.player_name)}
              >
                ⚔
              </button>
            )}
          </div>
        ))}

        <div className="ml-auto flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: connected ? '#2d6a4f' : '#9ca3af' }} />
          <span className="text-[10px] text-[#9ca3af]">{connected ? 'Live' : 'Offline'}</span>
        </div>
      </div>
    </div>
  );
}
