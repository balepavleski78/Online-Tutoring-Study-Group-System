const pool = require('../config/db');

async function findByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
}

async function createUser(username, email, password, role) {
  const [result] = await pool.query('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', [username, email, password, role]);
  return result.insertId;
}

module.exports = { findByEmail, createUser };
