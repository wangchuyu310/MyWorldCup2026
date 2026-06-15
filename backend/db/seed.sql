INSERT INTO teams (name, fifa_code, group_name)
VALUES
  ('Canada', 'CAN', 'A'),
  ('Mexico', 'MEX', 'A'),
  ('United States', 'USA', 'A')
ON CONFLICT (name) DO NOTHING;

INSERT INTO players (team_id, display_name, shirt_number, position)
SELECT teams.id, seed_players.display_name, seed_players.shirt_number, seed_players.position
FROM (
  VALUES
    ('Canada', 'Alphonso Davies', 19, 'Defender'),
    ('Mexico', 'Santiago Gimenez', 11, 'Forward'),
    ('United States', 'Christian Pulisic', 10, 'Forward')
) AS seed_players(team_name, display_name, shirt_number, position)
JOIN teams ON teams.name = seed_players.team_name
ON CONFLICT (team_id, display_name) DO NOTHING;

INSERT INTO matches (home_team_id, away_team_id, kickoff_at, stage, venue, home_score, away_score, status)
SELECT home.id, away.id, '2026-06-11 18:00:00+00', 'Group Stage', 'Opening match venue', 2, 1, 'final'
FROM teams home
JOIN teams away ON away.name = 'Mexico'
WHERE home.name = 'Canada'
  AND NOT EXISTS (
    SELECT 1
    FROM matches
    WHERE home_team_id = home.id
      AND away_team_id = away.id
      AND kickoff_at = '2026-06-11 18:00:00+00'
  );

INSERT INTO notes (title, body, team_id)
SELECT 'Opening thoughts', 'Canada looked sharp in the sample opening match.', teams.id
FROM teams
WHERE teams.name = 'Canada'
  AND NOT EXISTS (
    SELECT 1 FROM notes WHERE title = 'Opening thoughts'
  );
