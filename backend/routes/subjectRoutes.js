const express = require('express');
const { body, param } = require('express-validator');
const { getSubjects, createSubject, updateSubject, deleteSubject } = require('../controllers/subjectController');
const authMiddleware = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validateRequest } = require('../middleware/validateMiddleware');

const router = express.Router();

router.get('/', getSubjects);
router.post(
  '/',
  authMiddleware,
  authorizeRoles('admin'),
  [body('name').trim().notEmpty().withMessage('Subject name is required'), body('description').trim().notEmpty().withMessage('Subject description is required')],
  validateRequest,
  createSubject
);
router.put(
  '/:id',
  authMiddleware,
  authorizeRoles('admin'),
  [param('id').isInt().withMessage('Subject id must be an integer'), body('name').trim().notEmpty().withMessage('Subject name is required'), body('description').trim().notEmpty().withMessage('Subject description is required')],
  validateRequest,
  updateSubject
);
router.delete('/:id', authMiddleware, authorizeRoles('admin'), [param('id').isInt().withMessage('Subject id must be an integer')], validateRequest, deleteSubject);

module.exports = router;
