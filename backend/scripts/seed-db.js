require('dotenv').config();

const fs = require('fs');
const path = require('path');
const pool = require('../src/db');

async function seedDb() {
  const seedPath = path.join(__dirname, '..', 'db', 'seed.sql');
  const seedSql = fs.readFileSync(seedPath, 'utf8');

  await pool.query(seedSql);
  console.log('Database seed data inserted.');
}

seedDb()
  .catch((err) => {
    console.error('Failed to seed database:', err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await pool.end();
  });
