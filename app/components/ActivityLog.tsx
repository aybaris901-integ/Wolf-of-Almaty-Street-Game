'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { LogEntry } from '../game/state';
import { MARKET_TICKERS } from '../game/data';

interface ActivityLogProps {
  log: LogEntry[];
}

const logColors: Record<LogEntry['type'], string> = {
  success: '#2d6a4f',
  failure: '#c0392b',
  info:    '#1d4ed8',
  warning: '#b45309',
  boss:    '#6366f1',
};

const logBgs: Record<LogEntry['type'], string> = {
  success: '#bbf7d0',
  failure: '#fecaca',
  info:    '#bfdbfe',
  warning: '#fde68a',
  boss:    '#ddd6fe',
};

export default function ActivityLog({ log }: ActivityLogProps) {
  const tickerText = MARKET_TICKERS.join('   ·   ') + '   ·   ' + MARKET_TICKERS.join('   ·   ') + '   ·   ';

  return (
    <div className="flex flex-col h-full">
      {/* Ticker */}
      <div className="ticker-wrap py-1.5 bg-[#f7f6f3] border-b border-[#e8e6e1] shrink-0">
        <div className="ticker-content text-[10px] text-[#9ca3af] px-4">
          {tickerText}
        </div>
      </div>

      {/* Log */}
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        <AnimatePresence initial={false}>
          {log.map((entry) => (
            <motion.div
              key={entry.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="flex gap-2 items-start px-2 py-1.5 rounded-lg"
            >
              <div
                className="w-1 h-full rounded-full shrink-0 mt-1 self-stretch"
                style={{ background: logColors[entry.type], minHeight: 12 }}
              />
              <span className="text-[9px] text-[#9ca3af] shrink-0 mt-0.5">
                {new Date(entry.timestamp).toLocaleTimeString('en', {
                  hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit',
                })}
              </span>
              <span className="text-[10px] leading-snug" style={{ color: logColors[entry.type] }}>
                {entry.message}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
        {log.length === 0 && (
          <div className="text-center text-[#9ca3af] text-[10px] py-2">No activity yet.</div>
        )}
      </div>
    </div>
  );
}