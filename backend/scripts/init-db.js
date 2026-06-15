require('dotenv').config();

const fs = require('fs');
const path = require('path');
const pool = require('../src/db');

async function initDb() {
  const schemaPath = path.join(__dirname, '..', 'db', 'schema.sql');
  const schemaSql = fs.readFileSync(schemaPath, 'utf8');

  await pool.query(schemaSql);
  console.log('Database schema initialized.');
}

initDb()
  .catch((err) => {
    console.error('Failed to initialize database schema:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
