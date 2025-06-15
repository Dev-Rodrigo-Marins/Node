// test-db.js
require('dotenv').config();
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

pool.query('SELECT 1 + 1 AS result', (err, results) => {
  if (err) {
    console.error('Erro na conexão ou consulta:', err);
  } else {
    console.log('Conexão OK, resultado da query:', results);
  }
  pool.end();
});
