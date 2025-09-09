const mysql = require('mysql2');

let connection;

function getConnection() {
  if (!connection) {
    connection = mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME || 'portfolio_db',
      ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
    });
  }
  return connection;
}

module.exports = { getConnection };
