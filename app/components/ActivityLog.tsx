'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { LogEntry } from '../game/state';
import { MARKET_TICKERS } from '../game/data';

interface ActivityLogProps {
  log: LogEntry[];
}

const logColors: Record<LogEntry['type'], string> = {
  success: '#00ff41',
  failure: '#ff0040',
  info: '#0080ff',
  warning: '#ff6600',
  boss: '#ffee00',
};

export default function ActivityLog({ log }: ActivityLogProps) {
  const tickerText = MARKET_TICKERS.join(' ◆ ') + ' ◆ ' + MARKET_TICKERS.join(' ◆ ') + ' ◆ ';

  return (
    <div className="flex flex-col h-full">
      {/* Ticker */}
      <div className="ticker-wrap py-1.5 bg-[#0d0d0d] shrink-0">
        <div className="ticker-content text-[10px] neon-green tracking-widest">
          {tickerText}
        </div>
      </div>

      {/* Log */}
      <div className="flex-1 overflow-y-auto p-3 space-y-1">
        <AnimatePresence initial={false}>
          {log.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="log-entry"
              style={{ borderColor: logColors[entry.type] }}
            >
              <div className="flex gap-2 items-start">
                <span className="text-[9px] text-[#444] shrink-0 mt-0.5">
                  {new Date(entry.timestamp).toLocaleTimeString('en', {
                    hour12: false,
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </span>
                <span
                  className="text-[10px] leading-snug"
                  style={{ color: logColors[entry.type] }}
                >
                  {entry.message}
                </span>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}