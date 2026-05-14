const pool = require('../config/db');

async function getById(id) {
  const [rows] = await pool.query('SELECT * FROM tutoring_slots WHERE id = ?', [id]);
  return rows[0];
}

module.exports = { getById };
