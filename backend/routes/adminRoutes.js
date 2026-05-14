const express = require('express');
const { param } = require('express-validator');
const authMiddleware = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validateRequest } = require('../middleware/validateMiddleware');
const pool = require('../config/db');

const router = express.Router();
router.use(authMiddleware, authorizeRoles('admin'));

router.get('/users', async (req, res, next) => {
  try {
    const [users] = await pool.query('SELECT id, username, email, role FROM users ORDER BY id');
    res.json(users);
  } catch (error) {
    next(error);
  }
});

router.delete('/users/:id', [param('id').isInt().withMessage('User id must be integer')], validateRequest, async (req, res, next) => {
  try {
    const { id } = req.params;
    const [users] = await pool.query('SELECT role FROM users WHERE id = ?', [id]);
    if (!users.length) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (users[0].role === 'admin') {
      return res.status(403).json({ message: 'Cannot delete admin users' });
    }
    await pool.query('DELETE FROM users WHERE id = ?', [id]);
    res.json({ message: 'User deleted' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
