-- Wolf of Almaty Street — Supabase schema
-- Run this in your Supabase SQL editor: https://supabase.com/dashboard → SQL Editor

-- ─── Leaderboard ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS leaderboard (
  player_id         TEXT PRIMARY KEY,
  player_name       TEXT NOT NULL,
  daily_earnings    BIGINT DEFAULT 0,
  total_earnings    BIGINT DEFAULT 0,
  day_number        INTEGER DEFAULT 1,
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE leaderboard ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read leaderboard"  ON leaderboard FOR SELECT USING (true);
CREATE POLICY "Player upsert leaderboard" ON leaderboard FOR INSERT WITH CHECK (true);
CREATE POLICY "Player update leaderboard" ON leaderboard FOR UPDATE USING (true);

-- ─── Raids ───────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS raids (
  id          UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  raider_id   TEXT NOT NULL,
  raider_name TEXT NOT NULL,
  target_id   TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE raids ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Read raids"   ON raids FOR SELECT USING (true);
CREATE POLICY "Insert raids" ON raids FOR INSERT WITH CHECK (true);

-- Delete raids older than 1 day automatically (optional, run as a cron or manually)
-- DELETE FROM raids WHERE created_at < NOW() - INTERVAL '1 day';

-- ─── Enable Realtime ─────────────────────────────────────────────────────────
ALTER PUBLICATION supabase_realtime ADD TABLE leaderboard;
ALTER PUBLICATION supabase_realtime ADD TABLE raids;