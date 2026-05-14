const pool = require('../config/db');

async function getByUserId(userId) {
  const [rows] = await pool.query('SELECT * FROM tutor_profiles WHERE user_id = ?', [userId]);
  return rows[0];
}

module.exports = { getByUserId };
