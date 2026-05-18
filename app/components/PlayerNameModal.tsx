'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { savePlayerName } from '../hooks/useMultiplayer';

interface PlayerNameModalProps {
  onConfirm: (name: string) => void;
}

export default function PlayerNameModal({ onConfirm }: PlayerNameModalProps) {
  const [name, setName] = useState('');

  const handleConfirm = () => {
    const cleaned = name.trim().slice(0, 20) || 'Anonymous Wolf';
    savePlayerName(cleaned);
    onConfirm(cleaned);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.85)' }}>
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="panel p-6 max-w-sm w-full mx-4"
        style={{ boxShadow: '0 0 40px rgba(0,255,65,0.3)' }}
      >
        <div className="text-4xl text-center mb-4">🐺</div>
        <div className="neon-green text-sm font-bold text-center mb-1">ENTER YOUR STREET NAME</div>
        <div className="text-[10px] text-[#555] text-center mb-4">Shown on the live leaderboard to other players</div>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 20))}
          onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
          placeholder="NurBoss99..."
          maxLength={20}
          autoFocus
          className="w-full bg-[#0a0a0a] border-2 border-[#00ff41] text-[#00ff41] px-3 py-2 text-sm font-mono mb-1 outline-none focus:border-[#ffee00] transition-colors"
          style={{ caretColor: '#00ff41' }}
        />
        <div className="text-[9px] text-[#444] text-right mb-4">{name.length}/20</div>

        <button
          className="btn-brutal btn-green w-full py-3 text-sm"
          onClick={handleConfirm}
        >
          ENTER THE MARKET
        </button>
      </motion.div>
    </div>
  );
}