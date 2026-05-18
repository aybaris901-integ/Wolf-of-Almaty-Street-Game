'use client';

import { motion } from 'framer-motion';

interface IntroScreenProps {
  onStart: () => void;
}

export default function IntroScreen({ onStart }: IntroScreenProps) {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0a0a0a] p-6">
      <div className="max-w-lg w-full text-center">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: 'spring' }}
          className="text-8xl mb-6"
        >
          🐺
        </motion.div>

        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div className="text-[10px] tracking-[0.4em] text-[#666] mb-2">PRESENTS</div>
          <h1 className="neon-green text-3xl font-black tracking-tight mb-1 uppercase">
            The Real Wolf
          </h1>
          <h2 className="neon-blue text-xl font-bold tracking-widest mb-6 uppercase">
            of Almaty Street
          </h2>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="panel p-4 mb-6 text-left space-y-3"
        >
          <p className="text-sm text-[#ccc] leading-relaxed">
            You have <span className="neon-green font-bold">₸500,000</span> and a dream.
            The year is 2024. The city is <span className="neon-blue">Almaty</span>.
          </p>
          <p className="text-sm text-[#ccc] leading-relaxed">
            Trade grey-market goods at Baraholka. Pitch luxury items to shady clients.
            Build your reputation. Stack your tenge.
          </p>
          <p className="text-sm text-[#ccc] leading-relaxed">
            Then face <span className="neon-red font-bold">Yerlan "The Godfather" Seitkali</span>—
            the man who controls all underground trade in Kazakhstan.
          </p>
          <div className="border-t border-[#333] pt-3">
            <div className="text-[10px] text-[#666] space-y-1">
              <div className="flex gap-4">
                <span className="neon-green">BUY LOW</span>
                <span className="text-[#555]">→</span>
                <span className="neon-blue">PITCH HIGH</span>
                <span className="text-[#555]">→</span>
                <span className="neon-red">FIGHT BOSS</span>
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="btn-brutal btn-green text-lg px-12 py-4 pulse-glow"
            onClick={onStart}
          >
            START TRADING
          </motion.button>
          <div className="mt-4 text-[9px] text-[#444]">
            "In Almaty, everyone is a businessman. The question is what kind."
          </div>
        </motion.div>
      </div>
    </div>
  );
}
