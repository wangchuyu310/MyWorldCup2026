CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  name VARCHAR(120) NOT NULL UNIQUE,
  fifa_code VARCHAR(3) UNIQUE,
  group_name VARCHAR(20),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS players (
  id SERIAL PRIMARY KEY,
  team_id INTEGER NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  display_name VARCHAR(160) NOT NULL,
  shirt_number INTEGER,
  position VARCHAR(40),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (team_id, display_name)
);

CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  home_team_id INTEGER REFERENCES teams(id) ON DELETE SET NULL,
  away_team_id INTEGER REFERENCES teams(id) ON DELETE SET NULL,
  kickoff_at TIMESTAMPTZ,
  stage VARCHAR(60),
  venue VARCHAR(160),
  home_score INTEGER,
  away_score INTEGER,
  status VARCHAR(30) NOT NULL DEFAULT 'scheduled',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT different_match_teams CHECK (
    home_team_id IS NULL
    OR away_team_id IS NULL
    OR home_team_id <> away_team_id
  )
);

CREATE TABLE IF NOT EXISTS match_events (
  id SERIAL PRIMARY KEY,
  match_id INTEGER NOT NULL REFERENCES matches(id) ON DELETE CASCADE,
  team_id INTEGER REFERENCES teams(id) ON DELETE SET NULL,
  player_id INTEGER REFERENCES players(id) ON DELETE SET NULL,
  event_type VARCHAR(40) NOT NULL,
  minute INTEGER,
  extra_minute INTEGER,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS notes (
  id SERIAL PRIMARY KEY,
  title VARCHAR(180),
  body TEXT NOT NULL,
  team_id INTEGER REFERENCES teams(id) ON DELETE SET NULL,
  player_id INTEGER REFERENCES players(id) ON DELETE SET NULL,
  match_id INTEGER REFERENCES matches(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_players_team_id ON players(team_id);
CREATE INDEX IF NOT EXISTS idx_matches_home_team_id ON matches(home_team_id);
CREATE INDEX IF NOT EXISTS idx_matches_away_team_id ON matches(away_team_id);
CREATE INDEX IF NOT EXISTS idx_match_events_match_id ON match_events(match_id);
CREATE INDEX IF NOT EXISTS idx_match_events_player_id ON match_events(player_id);
CREATE INDEX IF NOT EXISTS idx_notes_team_id ON notes(team_id);
CREATE INDEX IF NOT EXISTS idx_notes_player_id ON notes(player_id);
CREATE INDEX IF NOT EXISTS idx_notes_match_id ON notes(match_id);

CREATE OR REPLACE VIEW team_statistics AS
SELECT
  teams.id AS team_id,
  teams.name,
  COUNT(matches.id) FILTER (WHERE matches.status = 'final') AS played,
  COUNT(matches.id) FILTER (
    WHERE matches.status = 'final'
      AND (
        (matches.home_team_id = teams.id AND matches.home_score > matches.away_score)
        OR (matches.away_team_id = teams.id AND matches.away_score > matches.home_score)
      )
  ) AS wins,
  COUNT(matches.id) FILTER (
    WHERE matches.status = 'final'
      AND matches.home_score = matches.away_score
  ) AS draws,
  COUNT(matches.id) FILTER (
    WHERE matches.status = 'final'
      AND (
        (matches.home_team_id = teams.id AND matches.home_score < matches.away_score)
        OR (matches.away_team_id = teams.id AND matches.away_score < matches.home_score)
      )
  ) AS losses,
  COALESCE(SUM(
    CASE
      WHEN matches.home_team_id = teams.id THEN matches.home_score
      WHEN matches.away_team_id = teams.id THEN matches.away_score
      ELSE 0
    END
  ) FILTER (WHERE matches.status = 'final'), 0) AS goals_for,
  COALESCE(SUM(
    CASE
      WHEN matches.home_team_id = teams.id THEN matches.away_score
      WHEN matches.away_team_id = teams.id THEN matches.home_score
      ELSE 0
    END
  ) FILTER (WHERE matches.status = 'final'), 0) AS goals_against
FROM teams
LEFT JOIN matches
  ON matches.home_team_id = teams.id
  OR matches.away_team_id = teams.id
GROUP BY teams.id, teams.name;
