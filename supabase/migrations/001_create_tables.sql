-- MIU Football Tournament System - Database Schema
-- Run this in Supabase SQL Editor

-- 1. Tournaments table
CREATE TABLE IF NOT EXISTS tournaments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  format TEXT NOT NULL CHECK (format IN ('round_robin','knockout','group_knockout')),
  max_teams INTEGER NOT NULL,
  players_per_team INTEGER NOT NULL,
  registration_deadline DATE NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  banner_url TEXT,
  status TEXT DEFAULT 'registration_open' CHECK (status IN ('draft','registration_open','upcoming','ongoing','completed')),
  -- v2.1: Group+KO config fields
  group_count INTEGER,
  qualifiers_per_group INTEGER DEFAULT 2,
  knockout_seeding_strategy TEXT DEFAULT 'random_draw' CHECK (knockout_seeding_strategy IN ('random_draw','ranked_1vN','group_cross_seed')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Teams table (v2.1: changed uniqueness constraints)
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_name VARCHAR(255) NOT NULL,
  logo TEXT,
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  user_id UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending','approved','rejected','disqualified')),
  -- v2.1: roster lifecycle
  roster_status TEXT DEFAULT 'draft' CHECK (roster_status IN ('draft','submitted','locked')),
  roster_submitted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tournament_id, user_id),
  UNIQUE(tournament_id, team_name)
);

-- 3. Players table
CREATE TABLE IF NOT EXISTS players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  department VARCHAR(255),
  level VARCHAR(100),
  jersey_number INTEGER,
  position TEXT CHECK (position IN ('goalkeeper','defender','midfielder','forward')),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  is_captain BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Matches table
CREATE TABLE IF NOT EXISTS matches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  home_team UUID NOT NULL REFERENCES teams(id),
  away_team UUID NOT NULL REFERENCES teams(id),
  match_date TIMESTAMPTZ,
  venue VARCHAR(255),
  round VARCHAR(100),
  match_number INTEGER,
  status TEXT DEFAULT 'scheduled' CHECK (status IN ('scheduled','completed','postponed','cancelled')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Results table
CREATE TABLE IF NOT EXISTS results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID NOT NULL UNIQUE REFERENCES matches(id) ON DELETE CASCADE,
  home_score INTEGER NOT NULL DEFAULT 0 CHECK (home_score >= 0),
  away_score INTEGER NOT NULL DEFAULT 0 CHECK (away_score >= 0),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. Standings table
CREATE TABLE IF NOT EXISTS standings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tournament_id UUID NOT NULL REFERENCES tournaments(id) ON DELETE CASCADE,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  played INTEGER DEFAULT 0,
  wins INTEGER DEFAULT 0,
  draws INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  goals_for INTEGER DEFAULT 0,
  goals_against INTEGER DEFAULT 0,
  goal_difference INTEGER GENERATED ALWAYS AS (goals_for - goals_against) STORED,
  points INTEGER GENERATED ALWAYS AS (wins * 3 + draws) STORED,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(tournament_id, team_id)
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_teams_tournament ON teams(tournament_id);
CREATE INDEX IF NOT EXISTS idx_teams_user ON teams(user_id);
CREATE INDEX IF NOT EXISTS idx_players_team ON players(team_id);
CREATE INDEX IF NOT EXISTS idx_matches_tournament ON matches(tournament_id);
CREATE INDEX IF NOT EXISTS idx_matches_teams ON matches(home_team, away_team);
CREATE INDEX IF NOT EXISTS idx_standings_tournament ON standings(tournament_id);
CREATE INDEX IF NOT EXISTS idx_standings_team ON standings(team_id);
