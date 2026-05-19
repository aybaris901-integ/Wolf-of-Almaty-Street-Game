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
    <div className="fixed inset-0 z-50 flex items-center justify-center" style={{ background: 'rgba(0,0,0,0.5)' }}>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 max-w-sm w-full mx-4 border border-[#e8e6e1]"
        style={{ boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }}
      >
        <div className="text-4xl text-center mb-4">🐺</div>
        <div className="text-sm font-semibold text-[#1a1a1a] text-center mb-1">Enter your street name</div>
        <div className="text-[10px] text-[#9ca3af] text-center mb-4">Shown on the live leaderboard to other players</div>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value.slice(0, 20))}
          onKeyDown={(e) => e.key === 'Enter' && handleConfirm()}
          placeholder="NurBoss99..."
          maxLength={20}
          autoFocus
          className="w-full bg-[#f7f6f3] border border-[#e8e6e1] rounded-xl px-3 py-2.5 text-sm text-[#1a1a1a] mb-1 outline-none focus:border-[#1a1a1a] transition-colors"
        />
        <div className="text-[9px] text-[#9ca3af] text-right mb-4">{name.length}/20</div>

        <button
          className="w-full py-3 bg-[#1a1a1a] text-white font-semibold rounded-xl hover:bg-[#2d2d2d] transition-colors text-sm"
          onClick={handleConfirm}
        >
          Enter the Market →
        </button>
      </motion.div>
    </div>
  );
}