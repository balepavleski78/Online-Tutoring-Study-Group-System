const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const pool = require('../config/db');

dotenv.config();

async function register(req, res, next) {
  try {
    const { username, email, password, role } = req.body;
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length) {
      return res.status(409).json({ message: 'Email already registered' });
    }
    const hashed = await bcrypt.hash(password, 10);
    const [result] = await pool.query('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', [username, email, hashed, role]);
    if (role === 'tutor') {
      await pool.query('INSERT INTO tutor_profiles (user_id, bio, expertise, hourly_rate) VALUES (?, ?, ?, ?)', [result.insertId, '', '', 0]);
    }
    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const [rows] = await pool.query('SELECT id, username, email, password, role FROM users WHERE email = ?', [email]);
    if (!rows.length) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '8h' });
    res.json({ token, user: { id: user.id, username: user.username, email: user.email, role: user.role } });
  } catch (error) {
    next(error);
  }
}

async function logout(req, res) {
  res.json({ message: 'Logout successful' });
}

async function profile(req, res, next) {
  try {
    const user = req.user;
    const [profileRows] = await pool.query(
      `SELECT u.id, u.username, u.email, u.role, tp.bio, tp.expertise, tp.hourly_rate
       FROM users u
       LEFT JOIN tutor_profiles tp ON u.id = tp.user_id
       WHERE u.id = ?`,
      [user.id]
    );
    if (!profileRows.length) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profileRows[0]);
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, logout, profile };
