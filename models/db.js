const { Pool } = require('pg');

// Create PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
});

// Optional: Test connection when server starts
pool.connect()
  .then(() => {
    console.log("✅ Connected to Supabase PostgreSQL");
  })
  .catch((err) => {
    console.error("❌ Database connection error:", err);
  });

module.exports = pool;
