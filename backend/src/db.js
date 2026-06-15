const { Pool } = require('pg'); 
 
 const hasConnectionString = Boolean(process.env.DATABASE_URL); 
 
 try {
  const pool = new Pool( 
    hasConnectionString 
      ? { 
          connectionString: process.env.DATABASE_URL, 
          ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false, 
        } 
      : { 
          user: process.env.DB_USER || 'worldcup_user', 
          host: process.env.DB_HOST || 'localhost', 
          database: process.env.DB_DATABASE || 'worldcup_notes', 
          password: process.env.DB_PASSWORD || 'worldcup_password', 
          port: Number(process.env.DB_PORT) || 5432, 
        } 
  ); 
  pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })
  module.exports = pool;
} catch (error) {
  console.error('Error initializing database pool:', error);
}
