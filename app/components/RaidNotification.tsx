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
  useEffect(() => {
    const timers = raids.map((raid) => {
      const age = Date.now() - raid.timestamp;
      const remaining = Math.max(0, 5000 - age);
      return setTimeout(() => onDismiss(raid.id), remaining);
    });
    return () => timers.forEach(clearTimeout);
  }, [raids, onDismiss]);

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none" style={{ maxWidth: 300 }}>
      <AnimatePresence>
        {raids.map((raid) => (
          <motion.div
            key={raid.id}
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 40, scale: 0.95 }}
            className="pointer-events-auto bg-white rounded-xl border border-[#fecaca] p-3"
            style={{ boxShadow: '0 4px 16px rgba(192,57,43,0.15)' }}
          >
            <div className="flex items-start gap-2">
              <span className="text-lg shrink-0">⚔️</span>
              <div className="flex-1">
                <div className="text-xs font-semibold text-[#c0392b]">Raided!</div>
                <div className="text-[10px] text-[#6b7280] mt-0.5">
                  <span className="font-medium text-[#1a1a1a]">{raid.raiderName}</span> sent a scammer your way
                </div>
                <div className="text-[9px] text-[#9ca3af] mt-1">Check Incoming Pitches →</div>
              </div>
              <button
                className="text-[#9ca3af] hover:text-[#6b7280] text-sm transition-colors"
                onClick={() => onDismiss(raid.id)}
              >
                ×
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}