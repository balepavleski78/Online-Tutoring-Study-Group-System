const pool = require('../config/db');

async function getAll() {
  const [rows] = await pool.query('SELECT * FROM subjects ORDER BY name');
  return rows;
}

async function createSubject(name, description) {
  const [result] = await pool.query('INSERT INTO subjects (name, description) VALUES (?, ?)', [name, description]);
  return result.insertId;
}

module.exports = { getAll, createSubject };
