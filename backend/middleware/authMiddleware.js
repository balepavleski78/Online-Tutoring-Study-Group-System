const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const pool = require('../config/db');

dotenv.config();

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Authorization required' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const [rows] = await pool.query('SELECT id, username, email, role FROM users WHERE id = ?', [decoded.userId]);
    if (!rows.length) {
      return res.status(401).json({ message: 'Invalid token' });
    }
    req.user = rows[0];
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Invalid token' });
  }
}

module.exports = authMiddleware;
