const pool = require('../config/db');

async function getBookingById(id) {
  const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [id]);
  return rows[0];
}

module.exports = { getBookingById };
