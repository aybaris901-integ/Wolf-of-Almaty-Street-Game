'use client';
import { useReducer, useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gameReducer, initialState } from './game/state';
import { saveGame, loadSave, clearSave } from './game/saveSystem';
import { DIFFICULTY_SECONDS, RAID_COST, type Difficulty } from './game/data';
import { useGameTimer } from './hooks/useGameTimer';
import { useMultiplayer, hasPlayerName } from './hooks/useMultiplayer';
import { isSupabaseConfigured } from './lib/supabase';
import StatsPanel from './components/StatsPanel';
import TradingTerminal from './components/TradingTerminal';
import BossArena from './components/BossArena';
import NPCRoster from './components/NPCRoster';
import ActivityLog from './components/ActivityLog';
import IntroScreen from './components/IntroScreen';
import ContinueScreen from './components/ContinueScreen';
import DayStartScreen from './components/DayStartScreen';
import DayEndModal from './components/DayEndModal';
import EndScreen from './components/EndScreen';
import LiveLeaderboard from './components/LiveLeaderboard';
import PlayerNameModal from './components/PlayerNameModal';
import RaidNotification, { type RaidAlert } from './components/RaidNotification';

type AppScreen = 'loading' | 'continue' | 'intro' | 'game';

export default function Home() {
  const [state, dispatch] = useReducer(gameReducer, initialState);
  const [screen, setScreen] = useState<AppScreen>('loading');
  const [showNameModal, setShowNameModal] = useState(false);
  const [raidAlerts, setRaidAlerts] = useState<RaidAlert[]>([]);
  const savedData = useRef(loadSave());

  // Auto-save after every state change
  useEffect(() => {
    if (state.phase !== 'intro' && state.phase !== 'day_start') {
      saveGame(state);
    }
  }, [state]);

  // Initial load check
  useEffect(() => {
    const save = loadSave();
    savedData.current = save;
    if (save) {
      setScreen('continue');
    } else {
      setScreen('intro');
    }
  }, []);

  // Multiplayer
  const handleRaidReceived = useCallback((raiderId: string, raiderName: string) => {
    dispatch({ type: 'APPLY_RAID', raiderName });
    const alert: RaidAlert = { id: `${Date.now()}-${raiderId}`, raiderId, raiderName, timestamp: Date.now() };
    setRaidAlerts((prev) => [...prev, alert]);
  }, []);

  const { playerId, playerName, leaderboard, connected, publishScore, sendRaid } = useMultiplayer({
    onRaidReceived: handleRaidReceived,
  });

  // Show name modal once Supabase is configured and we're in the game
  useEffect(() => {
    if (isSupabaseConfigured && screen === 'game' && !hasPlayerName()) {
      setShowNameModal(true);
    }
  }, [screen]);

  // Publish score when day ends
  const prevPhaseRef = useRef(state.phase);
  useEffect(() => {
    if (prevPhaseRef.current === 'sales' && state.phase === 'day_end') {
      publishScore(state.dailyStats.earned, state.totalEarned, state.day);
    }
    prevPhaseRef.current = state.phase;
  }, [state.phase, state.dailyStats.earned, state.totalEarned, state.day, publishScore]);

  // Timer — calls END_DAY when it expires
  const handleTimerExpire = useCallback(() => {
    dispatch({ type: 'END_DAY' });
  }, []);
  const timer = useGameTimer(handleTimerExpire);

  // Start the timer when BEGIN_DAY fires and phase becomes 'sales'
  const prevPhase = useRef(state.phase);
  useEffect(() => {
    if (prevPhase.current !== 'sales' && state.phase === 'sales' && state.difficulty) {
      timer.start(DIFFICULTY_SECONDS[state.difficulty]);
    }
    if (state.phase === 'day_end' || state.phase === 'boss') {
      timer.stop();
    }
    prevPhase.current = state.phase;
  }, [state.phase, state.difficulty, timer]);

  // ─── Handlers ──────────────────────────────────────────────────────────────

  const handleContinue = useCallback(() => {
    const save = savedData.current;
    if (!save) return;
    dispatch({ type: 'LOAD_SAVE', data: save });
    setScreen('game');
  }, []);

  const handleNewGame = useCallback(() => {
    clearSave();
    setScreen('intro');
  }, []);

  const handleIntroStart = useCallback(() => {
    dispatch({ type: 'START_GAME' });
    setScreen('game');
  }, []);

  const handleSetDifficulty = useCallback((d: Difficulty) => {
    dispatch({ type: 'SET_DIFFICULTY', difficulty: d });
  }, []);

  const handleBeginDay = useCallback(() => {
    dispatch({ type: 'BEGIN_DAY' });
  }, []);

  const handleEndDayEarly = useCallback(() => {
    timer.stop();
    dispatch({ type: 'END_DAY' });
  }, [timer]);

  const handleNextDay = useCallback(() => {
    dispatch({ type: 'NEXT_DAY' });
  }, []);

  const handleStartBoss = useCallback(() => {
    timer.stop();
    dispatch({ type: 'START_BOSS' });
  }, [timer]);

  const handleRestart = useCallback(() => {
    clearSave();
    window.location.reload();
  }, []);

  const handleRaid = useCallback((targetId: string, _targetName: string) => {
    if (state.tenge < RAID_COST) return;
    dispatch({ type: 'PAY_RAID_COST' });
    sendRaid(targetId);
  }, [state.tenge, sendRaid]);

  const handleDismissRaid = useCallback((id: string) => {
    setRaidAlerts((prev) => prev.filter((r) => r.id !== id));
  }, []);

  // ─── Screen routing ─────────────────────────────────────────────────────────

  if (screen === 'loading') {
    return <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a]"><div className="neon-green text-xs cursor-blink">LOADING</div></div>;
  }

  if (screen === 'continue' && savedData.current) {
    return <ContinueScreen save={savedData.current} onContinue={handleContinue} onNewGame={handleNewGame} />;
  }

  if (screen === 'intro' && state.phase === 'intro') {
    return <IntroScreen onStart={handleIntroStart} />;
  }

  if (state.phase === 'day_start') {
    return (
      <DayStartScreen
        state={state}
        onSetDifficulty={handleSetDifficulty}
        onBeginDay={handleBeginDay}
      />
    );
  }

  if (state.phase === 'day_end') {
    return (
      <DayEndModal
        day={state.day}
        stats={state.dailyStats}
        leaderboard={leaderboard}
        onNextDay={handleNextDay}
      />
    );
  }

  if (state.phase === 'victory' || state.phase === 'defeat') {
    return <EndScreen state={state} onRestart={handleRestart} />;
  }

  // ─── Main game dashboard ────────────────────────────────────────────────────

  const isBossPhase = state.phase === 'boss';

  const timerPct = state.difficulty && timer.seconds > 0
    ? timer.seconds / DIFFICULTY_SECONDS[state.difficulty] * 100
    : 100;
  const timerColor = timerPct <= 25 ? '#ff0040' : timerPct <= 50 ? '#ffee00' : '#00ff41';

  return (
    <div className="h-screen flex flex-col overflow-hidden bg-[#0a0a0a]">
      {/* Player name modal */}
      {showNameModal && (
        <PlayerNameModal onConfirm={() => setShowNameModal(false)} />
      )}

      {/* Raid toast notifications */}
      <RaidNotification raids={raidAlerts} onDismiss={handleDismissRaid} />

      {/* Top bar */}
      <div className="flex items-center gap-3 px-4 py-1.5 border-b-2 border-[#00ff41] bg-[#0d0d0d] shrink-0">
        <div className="text-xs neon-green font-black tracking-widest">🐺 WOLF OF ALMATY</div>
        <div className="flex gap-3 text-[10px]">
          <span className="text-[#444]">Day {state.day}/{state.maxDays}</span>
          <span className="text-[#444]">|</span>
          <span className="neon-blue">₸{state.tenge.toLocaleString()}</span>
          <span className="text-[#444]">|</span>
          <span className="neon-green">REP:{state.reputation}</span>
          <span className="text-[#444]">|</span>
          <span className="neon-yellow">CHR:{state.charisma}</span>
          {playerName && (
            <>
              <span className="text-[#444]">|</span>
              <span className="text-[#555]">{playerName}</span>
            </>
          )}
        </div>

        {timer.running && (
          <div
            className={`ml-auto flex items-center gap-2 px-2 py-0.5 border text-[10px] font-bold ${timerPct <= 25 ? 'pulse-glow' : ''}`}
            style={{ borderColor: timerColor, color: timerColor }}
          >
            <span>⏱</span>
            <span>{timer.display}</span>
          </div>
        )}

        <div
          className="px-2 py-0.5 border text-[10px]"
          style={{
            borderColor: isBossPhase ? '#ff0040' : '#00ff41',
            color: isBossPhase ? '#ff0040' : '#00ff41',
            marginLeft: timer.running ? 0 : 'auto',
          }}
        >
          {isBossPhase ? '⚔ BOSS FIGHT' : '📈 TRADING'}
        </div>
      </div>

      {/* Main 3-panel layout */}
      <div className="flex-1 overflow-hidden grid grid-cols-[240px_1fr_260px] gap-0">
        {/* Left: Stats */}
        <div className="border-r-2 border-[#1a1a1a] overflow-hidden">
          <StatsPanel
            state={state}
            timerDisplay={timer.display}
            timerSeconds={timer.seconds}
            timerRunning={timer.running}
            onEndDayEarly={handleEndDayEarly}
            onStartBoss={handleStartBoss}
          />
        </div>

        {/* Center: Trading Terminal or Boss Arena */}
        <div className="flex flex-col overflow-hidden">
          <AnimatePresence mode="wait">
            {isBossPhase ? (
              <motion.div key="boss-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full overflow-hidden">
                <BossArena state={state} dispatch={dispatch} />
              </motion.div>
            ) : (
              <motion.div key="trading-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col overflow-hidden">
                <div className="flex-1 overflow-hidden border-b-2 border-[#1a1a1a] relative">
                  <TradingTerminal state={state} dispatch={dispatch} />
                </div>
                <div className="h-[160px] overflow-hidden shrink-0">
                  <ActivityLog log={state.log} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right: NPC Roster + Leaderboard (or Battle Feed) */}
        <div className="border-l-2 border-[#1a1a1a] overflow-hidden flex flex-col">
          <AnimatePresence mode="wait">
            {isBossPhase ? (
              <motion.div key="battle-feed" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col">
                <div className="px-4 py-3 border-b-2 border-[#ff0040] bg-[#0d0d0d] shrink-0">
                  <div className="neon-red text-xs font-bold tracking-widest">[ BATTLE FEED ]</div>
                </div>
                <div className="flex-1 overflow-hidden"><ActivityLog log={state.log} /></div>
              </motion.div>
            ) : (
              <motion.div key="roster-lb" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full flex flex-col overflow-hidden">
                {/* NPC Roster — top half */}
                <div className="flex-1 overflow-hidden border-b border-[#1a1a1a]">
                  <NPCRoster state={state} />
                </div>
                {/* Live Leaderboard — bottom portion */}
                <div className="h-[220px] shrink-0 overflow-hidden">
                  <LiveLeaderboard
                    leaderboard={leaderboard}
                    currentPlayerId={playerId}
                    currentDailyEarnings={state.dailyStats.earned}
                    connected={connected}
                    isConfigured={isSupabaseConfigured}
                    raidCost={RAID_COST}
                    playerTenge={state.tenge}
                    onRaid={handleRaid}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}