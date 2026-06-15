console.log('Starting backend server...');
require('dotenv').config();

const express = require('express');
const pool = require('./src/db');
const { getOnlineCount, removeVisitor, touchVisitor } = require('./src/visitorPresence');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

app.use((req, res, next) => {
  const requestOrigin = req.headers.origin;
  const configuredOrigin = process.env.FRONTEND_ORIGIN;
  const isLocalDevOrigin = /^http:\/\/(localhost|127\.0\.0\.1):\d+$/.test(requestOrigin || '');
  const allowedOrigin = configuredOrigin || (isLocalDevOrigin ? requestOrigin : 'http://localhost:5173');

  res.setHeader('Access-Control-Allow-Origin', allowedOrigin);
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.sendStatus(204);
  }

  next();
});

app.get('/', (req, res) => {
  res.json({ message: 'World Cup 2026 API is running' });
});

app.get('/health/db', async (req, res) => {
  try {
    const result = await pool.query('SELECT NOW() AS current_time');
    res.json({ ok: true, databaseTime: result.rows[0].current_time });
  } catch (err) {
    console.error('Database health check failed:', err);
    res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/visitors/count', (req, res) => {
  res.json({ onlineCount: getOnlineCount() });
});

app.post('/visitors/heartbeat', (req, res) => {
  const { visitorId } = req.body;

  if (!visitorId || typeof visitorId !== 'string') {
    return res.status(400).json({ error: 'visitorId is required' });
  }

  res.json({ onlineCount: touchVisitor(visitorId) });
});

app.post('/visitors/leave', (req, res) => {
  const { visitorId } = req.body;

  if (visitorId && typeof visitorId === 'string') {
    removeVisitor(visitorId);
  }

  res.json({ onlineCount: getOnlineCount() });
});

app.get('/teams', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, name, fifa_code, group_name, created_at FROM teams ORDER BY name'
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching teams:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/teams', async (req, res) => {
  const { name, fifaCode, groupName } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Team name is required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO teams (name, fifa_code, group_name)
       VALUES ($1, $2, $3)
       RETURNING id, name, fifa_code, group_name, created_at`,
      [name, fifaCode || null, groupName || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating team:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/matches', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         matches.id,
         matches.kickoff_at,
         matches.stage,
         matches.venue,
         matches.home_score,
         matches.away_score,
         home.name AS home_team,
         away.name AS away_team
       FROM matches
       LEFT JOIN teams home ON home.id = matches.home_team_id
       LEFT JOIN teams away ON away.id = matches.away_team_id
       ORDER BY matches.kickoff_at NULLS LAST, matches.id`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching matches:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/stats/teams', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         team_id,
         name,
         played,
         wins,
         draws,
         losses,
         goals_for,
         goals_against,
         goals_for - goals_against AS goal_difference,
         wins * 3 + draws AS points
       FROM team_statistics
       ORDER BY points DESC, goal_difference DESC, goals_for DESC, name`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching team statistics:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/notes', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT
         notes.id,
         notes.title,
         notes.body,
         notes.created_at,
         notes.updated_at,
         teams.name AS team_name,
         players.display_name AS player_name,
         matches.id AS match_id
       FROM notes
       LEFT JOIN teams ON teams.id = notes.team_id
       LEFT JOIN players ON players.id = notes.player_id
       LEFT JOIN matches ON matches.id = notes.match_id
       ORDER BY notes.updated_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error('Error fetching notes:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.post('/notes', async (req, res) => {
  const { title, body, teamId, playerId, matchId } = req.body;

  if (!body) {
    return res.status(400).json({ error: 'Note body is required' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO notes (title, body, team_id, player_id, match_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, title, body, team_id, player_id, match_id, created_at, updated_at`,
      [title || null, body, teamId || null, playerId || null, matchId || null]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating note:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

console.log(`Attempting to listen on port ${port}...`);
app.listen(port, () => {
  console.log(`Backend server listening at http://localhost:${port}`);
});
