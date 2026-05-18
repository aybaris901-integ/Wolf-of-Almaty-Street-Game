'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect } from 'react';

export interface RaidAlert {
  id: string;
  raiderId: string;
  raiderName: string;
  timestamp: number;
}

interface RaidNotificationProps {
  raids: RaidAlert[];
  onDismiss: (id: string) => void;
}

export default function RaidNotification({ raids, onDismiss }: RaidNotificationProps) {
  // Auto-dismiss after 5s
  useEffect(() => {
    raids.forEach((raid) => {
      const age = Date.now() - raid.timestamp;
      const remaining = Math.max(0, 5000 - age);
      const t = setTimeout(() => onDismiss(raid.id), remaining);
      return () => clearTimeout(t);
    });
  }, [raids, onDismiss]);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none" style={{ maxWidth: 300 }}>
      <AnimatePresence>
        {raids.map((raid) => (
          <motion.div
            key={raid.id}
            initial={{ opacity: 0, x: 60, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 60, scale: 0.9 }}
            className="pointer-events-auto p-3"
            style={{
              background: '#141414',
              border: '2px solid #ff0040',
              boxShadow: '0 0 20px rgba(255,0,64,0.5), 4px 4px 0 #ff0040',
            }}
          >
            <div className="flex items-start gap-2">
              <span className="text-xl shrink-0">⚔️</span>
              <div className="flex-1">
                <div className="neon-red text-xs font-bold">RAIDED!</div>
                <div className="text-[10px] text-[#ccc] mt-0.5">
                  Player <span className="neon-yellow font-bold">'{raid.raiderName}'</span> sent a scammer your way!
                </div>
                <div className="text-[9px] text-[#666] mt-1">Check your Incoming Pitches.</div>
              </div>
              <button
                className="text-[#555] hover:text-[#999] text-xs"
                onClick={() => onDismiss(raid.id)}
              >
                ✕
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}