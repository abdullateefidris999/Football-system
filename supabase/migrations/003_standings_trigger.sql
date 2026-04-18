-- MIU Football Tournament System - Standings Auto-Update Trigger
-- Run this in Supabase SQL Editor after creating tables and RLS policies

-- Create the standings update function
CREATE OR REPLACE FUNCTION update_standings_on_result()
RETURNS TRIGGER AS $$
DECLARE
  match_rec RECORD;
  old_match_rec RECORD;
BEGIN
  -- Get the match details
  SELECT * INTO match_rec FROM matches WHERE id = NEW.match_id;
  
  -- If this is an UPDATE, we need to reverse the old result first
  IF TG_OP = 'UPDATE' AND OLD IS NOT NULL THEN
    SELECT * INTO old_match_rec FROM matches WHERE id = OLD.match_id;
    
    -- Reverse home team old stats
    UPDATE standings SET
      played = played - 1,
      wins = wins - CASE WHEN OLD.home_score > OLD.away_score THEN 1 ELSE 0 END,
      draws = draws - CASE WHEN OLD.home_score = OLD.away_score THEN 1 ELSE 0 END,
      losses = losses - CASE WHEN OLD.home_score < OLD.away_score THEN 1 ELSE 0 END,
      goals_for = goals_for - OLD.home_score,
      goals_against = goals_against - OLD.away_score,
      updated_at = NOW()
    WHERE tournament_id = old_match_rec.tournament_id AND team_id = old_match_rec.home_team;
    
    -- Reverse away team old stats
    UPDATE standings SET
      played = played - 1,
      wins = wins - CASE WHEN OLD.away_score > OLD.home_score THEN 1 ELSE 0 END,
      draws = draws - CASE WHEN OLD.away_score = OLD.home_score THEN 1 ELSE 0 END,
      losses = losses - CASE WHEN OLD.away_score < OLD.home_score THEN 1 ELSE 0 END,
      goals_for = goals_for - OLD.away_score,
      goals_against = goals_against - OLD.home_score,
      updated_at = NOW()
    WHERE tournament_id = old_match_rec.tournament_id AND team_id = old_match_rec.away_team;
  END IF;
  
  -- Upsert home team standings
  INSERT INTO standings (tournament_id, team_id, played, wins, draws, losses, goals_for, goals_against)
  VALUES (
    match_rec.tournament_id, 
    match_rec.home_team, 
    1,
    CASE WHEN NEW.home_score > NEW.away_score THEN 1 ELSE 0 END,
    CASE WHEN NEW.home_score = NEW.away_score THEN 1 ELSE 0 END,
    CASE WHEN NEW.home_score < NEW.away_score THEN 1 ELSE 0 END,
    NEW.home_score, 
    NEW.away_score
  )
  ON CONFLICT (tournament_id, team_id) DO UPDATE SET
    played = standings.played + 1,
    wins = standings.wins + CASE WHEN NEW.home_score > NEW.away_score THEN 1 ELSE 0 END,
    draws = standings.draws + CASE WHEN NEW.home_score = NEW.away_score THEN 1 ELSE 0 END,
    losses = standings.losses + CASE WHEN NEW.home_score < NEW.away_score THEN 1 ELSE 0 END,
    goals_for = standings.goals_for + NEW.home_score,
    goals_against = standings.goals_against + NEW.away_score,
    updated_at = NOW();

  -- Upsert away team standings
  INSERT INTO standings (tournament_id, team_id, played, wins, draws, losses, goals_for, goals_against)
  VALUES (
    match_rec.tournament_id, 
    match_rec.away_team, 
    1,
    CASE WHEN NEW.away_score > NEW.home_score THEN 1 ELSE 0 END,
    CASE WHEN NEW.away_score = NEW.home_score THEN 1 ELSE 0 END,
    CASE WHEN NEW.away_score < NEW.home_score THEN 1 ELSE 0 END,
    NEW.away_score, 
    NEW.home_score
  )
  ON CONFLICT (tournament_id, team_id) DO UPDATE SET
    played = standings.played + 1,
    wins = standings.wins + CASE WHEN NEW.away_score > NEW.home_score THEN 1 ELSE 0 END,
    draws = standings.draws + CASE WHEN NEW.away_score = NEW.home_score THEN 1 ELSE 0 END,
    losses = standings.losses + CASE WHEN NEW.away_score < NEW.home_score THEN 1 ELSE 0 END,
    goals_for = standings.goals_for + NEW.away_score,
    goals_against = standings.goals_against + NEW.home_score,
    updated_at = NOW();

  -- Update match status to completed
  UPDATE matches SET status = 'completed' WHERE id = NEW.match_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
DROP TRIGGER IF EXISTS on_result_insert_update ON results;
CREATE TRIGGER on_result_insert_update
AFTER INSERT OR UPDATE ON results
FOR EACH ROW EXECUTE FUNCTION update_standings_on_result();

-- Grant execute permission
GRANT EXECUTE ON FUNCTION update_standings_on_result() TO authenticated;
