const express = require('express');
const { body } = require('express-validator');
const { register, login, logout, profile } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validateMiddleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
    body('role').isIn(['student', 'tutor', 'admin']).withMessage('Role must be student, tutor, or admin'),
  ],
  validateRequest,
  register
);

router.post(
  '/login',
  [body('email').isEmail().withMessage('Valid email is required'), body('password').exists().withMessage('Password is required')],
  validateRequest,
  login
);

router.get('/logout', authMiddleware, logout);
router.get('/profile', authMiddleware, profile);

module.exports = router;
