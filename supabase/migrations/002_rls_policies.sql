-- MIU Football Tournament System - Row Level Security Policies
-- Run this in Supabase SQL Editor after creating tables

-- Enable RLS on all tables
ALTER TABLE tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE results ENABLE ROW LEVEL SECURITY;
ALTER TABLE standings ENABLE ROW LEVEL SECURITY;

-- Helper function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (
    SELECT (auth.jwt()->>'user_metadata')::jsonb->>'role' = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to get current user id
CREATE OR REPLACE FUNCTION auth_uid()
RETURNS UUID AS $$
BEGIN
  RETURN auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- TOURNAMENTS POLICIES
-- ============================================

-- Anyone can read tournaments
CREATE POLICY "tournaments_select_all" ON tournaments
  FOR SELECT USING (true);

-- Only admins can insert tournaments
CREATE POLICY "tournaments_insert_admin" ON tournaments
  FOR INSERT WITH CHECK (is_admin());

-- Only admins can update tournaments
CREATE POLICY "tournaments_update_admin" ON tournaments
  FOR UPDATE USING (is_admin());

-- Only admins can delete tournaments
CREATE POLICY "tournaments_delete_admin" ON tournaments
  FOR DELETE USING (is_admin());

-- ============================================
-- TEAMS POLICIES
-- ============================================

-- Anyone can read teams
CREATE POLICY "teams_select_all" ON teams
  FOR SELECT USING (true);

-- Authenticated users can insert their own team (during registration)
CREATE POLICY "teams_insert_own" ON teams
  FOR INSERT WITH CHECK (auth_uid() = user_id OR is_admin());

-- Team owner can update their team, admin can update any
CREATE POLICY "teams_update_own" ON teams
  FOR UPDATE USING (auth_uid() = user_id OR is_admin());

-- Only admins can delete teams
CREATE POLICY "teams_delete_admin" ON teams
  FOR DELETE USING (is_admin());

-- ============================================
-- PLAYERS POLICIES
-- ============================================

-- Anyone can read players
CREATE POLICY "players_select_all" ON players
  FOR SELECT USING (true);

-- Team owner can manage their players
CREATE POLICY "players_insert_team_owner" ON players
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM teams 
      WHERE teams.id = team_id 
      AND teams.user_id = auth_uid()
    ) OR is_admin()
  );

CREATE POLICY "players_update_team_owner" ON players
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM teams 
      WHERE teams.id = team_id 
      AND teams.user_id = auth_uid()
    ) OR is_admin()
  );

CREATE POLICY "players_delete_team_owner" ON players
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM teams 
      WHERE teams.id = team_id 
      AND teams.user_id = auth_uid()
    ) OR is_admin()
  );

-- ============================================
-- MATCHES POLICIES
-- ============================================

-- Anyone can read matches
CREATE POLICY "matches_select_all" ON matches
  FOR SELECT USING (true);

-- Only admins can manage matches
CREATE POLICY "matches_insert_admin" ON matches
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "matches_update_admin" ON matches
  FOR UPDATE USING (is_admin());

CREATE POLICY "matches_delete_admin" ON matches
  FOR DELETE USING (is_admin());

-- ============================================
-- RESULTS POLICIES
-- ============================================

-- Anyone can read results
CREATE POLICY "results_select_all" ON results
  FOR SELECT USING (true);

-- Only admins can manage results
CREATE POLICY "results_insert_admin" ON results
  FOR INSERT WITH CHECK (is_admin());

CREATE POLICY "results_update_admin" ON results
  FOR UPDATE USING (is_admin());

-- ============================================
-- STANDINGS POLICIES
-- ============================================

-- Anyone can read standings
CREATE POLICY "standings_select_all" ON standings
  FOR SELECT USING (true);

-- Standings are managed by trigger only (SECURITY DEFINER)
-- No direct insert/update/delete allowed for regular users
