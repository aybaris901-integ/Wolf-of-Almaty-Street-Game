'use client';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { loadSave, clearSave, type SaveData } from './game/saveSystem';
import { MARKET_TICKERS } from './game/data';
import { supabase, isSupabaseConfigured, type LeaderboardEntry } from './lib/supabase';
import FullscreenVideoOverlay from './components/FullscreenVideoOverlay';

export default function MainMenu() {
  const router = useRouter();
  const [save, setSave] = useState<SaveData | null>(null);
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const pendingNav = useRef<(() => void) | null>(null);

  useEffect(() => {
    setSave(loadSave());
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    supabase
      .from('leaderboard')
      .select('*')
      .order('daily_earnings', { ascending: false })
      .limit(3)
      .then(({ data }) => { if (data) setLeaderboard(data as LeaderboardEntry[]); });
  }, []);

  const finishIntro = () => {
    try { localStorage.setItem('introWolfSeen', 'true'); } catch (_) {}
    setShowIntro(false);
    const nav = pendingNav.current;
    pendingNav.current = null;
    nav?.();
  };

  const withIntroCheck = (action: () => void) => {
    let seen = false;
    try { seen = localStorage.getItem('introWolfSeen') === 'true'; } catch (_) {}
    if (seen) {
      action();
      return;
    }
    pendingNav.current = action;
    setShowIntro(true);
  };

  const handleNewGame = () => {
    withIntroCheck(() => {
      clearSave();
      router.push('/game');
    });
  };

  const handleContinue = () => {
    withIntroCheck(() => {
      router.push('/game');
    });
  };

  const tickerItems = isSupabaseConfigured && leaderboard.length > 0
    ? leaderboard.map(e => `${e.player_name} earned ₸${e.daily_earnings.toLocaleString()} today`)
    : MARKET_TICKERS;

  const tickerText = tickerItems.join('   ·   ') + '   ·   ' + tickerItems.join('   ·   ') + '   ·   ';

  return (
    <div className="min-h-screen bg-[#f7f6f3] flex flex-col overflow-x-hidden">
      <div className="flex-1 flex items-center justify-center p-3 sm:p-5 md:p-8">
        <div className="w-full max-w-xl">

          {/* Hero card */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="bg-[#1a1a1a] rounded-2xl p-5 sm:p-7 md:p-10 mb-4 md:mb-5 relative overflow-hidden"
          >
            {/* Wolf watermark */}
            <div className="absolute right-3 sm:right-6 top-4 text-[96px] sm:text-[140px] opacity-[0.04] select-none pointer-events-none leading-none">
              🐺
            </div>

            <div className="relative z-10">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4">🐺</div>
              <h1 className="text-[27px] sm:text-[32px] font-bold text-white leading-tight mb-2 break-words">
                Wolf of Almaty Street
              </h1>
              <p className="text-[#9ca3af] text-sm mb-6 sm:mb-8 leading-relaxed">
                Buy low. Sell high. Spot scammers. Survive the bazaar.
                <br />Become the trading king of Almaty.
              </p>

              <div className="space-y-2.5">
                {/* New Game */}
                <motion.button
                  whileHover={{ scale: 1.005 }}
                  whileTap={{ scale: 0.995 }}
                  onClick={handleNewGame}
                  className="w-full min-h-11 py-3.5 px-5 bg-white text-[#1a1a1a] font-semibold rounded-xl hover:bg-[#f7f6f3] transition-colors text-left flex items-center justify-between text-sm"
                >
                  <span>New Game</span>
                  <span className="text-[#9ca3af] font-normal">→</span>
                </motion.button>

                {/* Continue */}
                <motion.button
                  whileHover={mounted && save ? { scale: 1.005 } : {}}
                  whileTap={mounted && save ? { scale: 0.995 } : {}}
                  onClick={mounted && save ? handleContinue : undefined}
                  disabled={!mounted || !save}
                  className={`w-full min-h-11 py-3.5 px-5 rounded-xl font-semibold text-left flex items-center justify-between gap-3 text-sm transition-colors ${
                    mounted && save
                      ? 'bg-[#2d2d2d] text-white hover:bg-[#383838] cursor-pointer'
                      : 'bg-[#252525] text-[#4b5563] cursor-not-allowed'
                  }`}
                >
                  <span>Continue</span>
                  {mounted && save ? (
                    <span className="text-[#9ca3af] font-normal text-xs text-right">
                      Day {save.day} · ₸{save.tenge.toLocaleString()}
                    </span>
                  ) : (
                    <span className="text-[#374151] font-normal text-xs">No save found</span>
                  )}
                </motion.button>

                {/* Secondary buttons */}
                <div className="flex gap-2 pt-0.5">
                  <button
                    onClick={() => router.push('/how-to-play')}
                    className="flex-1 min-h-11 py-2.5 px-4 rounded-xl text-xs font-medium text-[#9ca3af] hover:text-[#d1d5db] transition-colors"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    How to Play
                  </button>
                  <button
                    onClick={() => router.push('/leaderboard')}
                    className="flex-1 min-h-11 py-2.5 px-4 rounded-xl text-xs font-medium text-[#9ca3af] hover:text-[#d1d5db] transition-colors"
                    style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.08)' }}
                  >
                    Leaderboard
                  </button>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mini cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-0">

            {/* Leaderboard preview */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              className="bg-white rounded-xl p-3 sm:p-4 border border-[#e8e6e1] cursor-pointer hover:border-[#d5d3cd] transition-colors"
              onClick={() => router.push('/leaderboard')}
            >
              <div className="flex items-center gap-1.5 mb-3">
                <span className="text-sm">🏆</span>
                <span className="text-[10px] font-semibold text-[#6b7280] tracking-wide">TOP TRADERS</span>
              </div>
              {leaderboard.length === 0 ? (
                <div className="text-xs text-[#9ca3af]">
                  {isSupabaseConfigured ? 'Loading rankings…' : 'Play to set the first record'}
                </div>
              ) : (
                <div className="space-y-2">
                  {leaderboard.map((entry, i) => (
                    <div key={entry.player_id} className="flex items-center gap-2">
                      <span className="text-xs w-4">{['🥇', '🥈', '🥉'][i]}</span>
                      <span className="text-xs font-medium text-[#1a1a1a] flex-1 truncate">{entry.player_name}</span>
                      <span className="text-xs font-semibold text-[#2d6a4f]">₸{entry.daily_earnings.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>

            {/* How to play mini */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              className="bg-white rounded-xl p-3 sm:p-4 border border-[#e8e6e1] cursor-pointer hover:border-[#d5d3cd] transition-colors"
              onClick={() => router.push('/how-to-play')}
            >
              <div className="flex items-center gap-1.5 mb-3">
                <span className="text-sm">📖</span>
                <span className="text-[10px] font-semibold text-[#6b7280] tracking-wide">HOW TO PLAY</span>
              </div>
              <div className="space-y-1.5">
                {[
                  'Buy items at market price',
                  'Clients make offers — negotiate',
                  'Spot scammers & flag red tells',
                  'Hit daily profit targets',
                ].map((tip, i) => (
                  <div key={i} className="flex items-start gap-1.5">
                    <span className="text-[10px] text-[#9ca3af] mt-0.5 w-3 shrink-0">{i + 1}.</span>
                    <span className="text-[11px] text-[#6b7280] leading-snug">{tip}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Live ticker */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="ticker-wrap bg-white py-2 shrink-0"
      >
        <div className="ticker-content text-[11px] text-[#9ca3af] px-4">
          {tickerText}
        </div>
      </motion.div>

      {/* Intro video overlay */}
      {showIntro && (
        <FullscreenVideoOverlay src="/videos/intro-wolf-almaty.mp4" onFinish={finishIntro} />
      )}
    </div>
  );
}
