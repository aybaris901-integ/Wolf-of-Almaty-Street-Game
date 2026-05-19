'use client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const STEPS = [
  {
    n: 1, title: 'Pick an item', icon: '🛒',
    desc: 'Browse the market and buy goods at wholesale price. Your profit is the spread between buy and sell.',
  },
  {
    n: 2, title: 'Wait for client offers', icon: '📩',
    desc: "Clients appear in your Incoming tab with offers. Each has a personality — impulsive buyers may pay full price instantly.",
  },
  {
    n: 3, title: 'Negotiate smart', icon: '🤝',
    desc: 'Hold firm, offer small discounts, or pitch the value. Watch the patience bar — push too hard and they walk.',
  },
  {
    n: 4, title: 'Watch for scammers', icon: '🚨',
    desc: "Scammers offer suspiciously high prices then reverse the deal. Flag red tells in their pitch text to detect them.",
  },
];

const TIPS = [
  {
    icon: '⚡', title: 'Focus Energy',
    desc: 'Use Focus for Fake Scarcity (−20) and Name-Drop (−25). It recharges when you close deals.',
  },
  {
    icon: '📋', title: 'Contracts',
    desc: 'High-value contracts unlock on Day 8. Build Charisma by closing deals to access better contracts.',
  },
  {
    icon: '💰', title: 'Profit Formula',
    desc: 'Daily profit = Revenue − Cost of Goods. Miss the daily target 3 days in a row and it\'s game over.',
  },
  {
    icon: '⚔️', title: 'Raids',
    desc: 'Send a scammer to another player\'s game for ₸500. They can do the same to you — always check Incoming.',
  },
];

const RANKS = [
  { emoji: '◦', name: 'Rookie Peddler',     req: 'Starting rank' },
  { emoji: '★', name: 'Market Hustler',      req: '₸200,000 lifetime' },
  { emoji: '★', name: 'Bazaar Shark',        req: '₸500,000 lifetime' },
  { emoji: '★★', name: 'Street Wolf',        req: '₸1,000,000 lifetime' },
  { emoji: '★★', name: 'Almaty Shark',       req: '₸2,000,000 lifetime' },
  { emoji: '★★★', name: 'Wolf of Al-Farabi', req: '₸3,000,000 lifetime' },
];

const card = 'bg-white rounded-xl border border-[#e8e6e1] p-5';

export default function HowToPlay() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#f7f6f3] py-12 px-6">
      <div className="max-w-2xl mx-auto">

        {/* Back */}
        <button
          onClick={() => router.push('/')}
          className="text-xs text-[#9ca3af] hover:text-[#6b7280] transition-colors mb-8 flex items-center gap-1"
        >
          ← Back to menu
        </button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="text-5xl mb-4">📖</div>
          <h1 className="text-3xl font-bold text-[#1a1a1a] mb-2">How to Play</h1>
          <p className="text-[#6b7280] text-sm">Master the bazaar in four simple steps</p>
        </motion.div>

        {/* Steps */}
        <div className="space-y-3 mb-8">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07 }}
              className={card}
            >
              <div className="flex items-start gap-4">
                <div className="w-9 h-9 rounded-xl bg-[#1a1a1a] flex items-center justify-center text-white text-sm font-bold shrink-0">
                  {s.n}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">{s.icon}</span>
                    <span className="font-semibold text-[#1a1a1a] text-sm">{s.title}</span>
                  </div>
                  <p className="text-sm text-[#6b7280] leading-relaxed">{s.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tips grid */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-sm font-semibold text-[#6b7280] mb-3 tracking-wide">ADVANCED TIPS</h2>
          <div className="grid grid-cols-2 gap-3">
            {TIPS.map((t) => (
              <div key={t.title} className={card}>
                <div className="text-2xl mb-2">{t.icon}</div>
                <div className="font-semibold text-sm text-[#1a1a1a] mb-1">{t.title}</div>
                <p className="text-xs text-[#6b7280] leading-relaxed">{t.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Ranks table */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-10"
        >
          <h2 className="text-sm font-semibold text-[#6b7280] mb-3 tracking-wide">RANK PROGRESSION</h2>
          <div className={card + ' overflow-hidden p-0'}>
            {RANKS.map((r, i) => (
              <div
                key={r.name}
                className="flex items-center gap-4 px-5 py-3.5"
                style={{ borderBottom: i < RANKS.length - 1 ? '1px solid #e8e6e1' : 'none' }}
              >
                <span className="text-base w-6 text-center shrink-0">{r.emoji}</span>
                <div className="flex-1">
                  <div className="text-sm font-semibold text-[#1a1a1a]">{r.name}</div>
                </div>
                <div className="text-xs text-[#9ca3af]">{r.req}</div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Start button */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={() => router.push('/game')}
          className="w-full py-4 bg-[#1a1a1a] text-white font-semibold rounded-xl hover:bg-[#2d2d2d] transition-colors text-sm"
        >
          Start Playing →
        </motion.button>
      </div>
    </div>
  );
}