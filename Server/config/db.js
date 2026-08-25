const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'Manager',
  database: process.env.DB_NAME || 'mern_db',
  port: process.env.DB_PORT ? Number(process.env.DB_PORT) : 3306,
  waitForConnections: true,
  connectionLimit: process.env.DB_CONNECTION_LIMIT ? Number(process.env.DB_CONNECTION_LIMIT) : 10,
  queueLimit: 0,
  dateStrings: true,
});

/**
 * Simple connectivity check used at server startup.
 */
async function testConnection() {
  const connection = await pool.getConnection();
  try {
    await connection.query('SELECT 1');
    console.log(`Connected to MySQL database "${process.env.DB_NAME}" successfully.`);
  } finally {
    connection.release();
  }
}

module.exports = { pool, testConnection };
