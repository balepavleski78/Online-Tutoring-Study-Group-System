const pool = require('../config/db');

async function getGroupById(id) {
  const [rows] = await pool.query('SELECT * FROM study_groups WHERE id = ?', [id]);
  return rows[0];
}

module.exports = { getGroupById };
