const express = require('express');
const { body, param, query } = require('express-validator');
const {
  getTutoringSlots,
  createTutoringSlot,
  updateTutoringSlot,
  deleteTutoringSlot,
  bookSlot,
} = require('../controllers/tutoringSlotController');
const authMiddleware = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validateRequest } = require('../middleware/validateMiddleware');

const router = express.Router();

router.get(
  '/',
  [
    query('subject').optional().isInt().withMessage('Subject filter must be numeric'),
    query('tutor').optional().isInt().withMessage('Tutor filter must be numeric'),
    query('date').optional().isISO8601().withMessage('Date must be valid'),
  ],
  validateRequest,
  getTutoringSlots
);

router.post(
  '/',
  authMiddleware,
  authorizeRoles('tutor'),
  [
    body('subject_id').isInt().withMessage('Subject id is required'),
    body('date').isISO8601().withMessage('Valid date is required'),
    body('start_time').matches(/^\d{2}:\d{2}$/).withMessage('Start time must be HH:MM'),
    body('end_time').matches(/^\d{2}:\d{2}$/).withMessage('End time must be HH:MM'),
  ],
  validateRequest,
  createTutoringSlot
);
router.put(
  '/:id',
  authMiddleware,
  authorizeRoles('tutor'),
  [
    param('id').isInt().withMessage('Slot id must be an integer'),
    body('subject_id').optional().isInt().withMessage('Subject id must be numeric'),
    body('date').optional().isISO8601().withMessage('Valid date is required'),
    body('start_time').optional().matches(/^\d{2}:\d{2}$/).withMessage('Start time must be HH:MM'),
    body('end_time').optional().matches(/^\d{2}:\d{2}$/).withMessage('End time must be HH:MM'),
    body('status').optional().isIn(['open', 'booked', 'cancelled']).withMessage('Status invalid'),
  ],
  validateRequest,
  updateTutoringSlot
);
router.delete('/:id', authMiddleware, authorizeRoles('tutor'), [param('id').isInt().withMessage('Slot id must be an integer')], validateRequest, deleteTutoringSlot);
router.post('/:slotId/book', authMiddleware, authorizeRoles('student'), [param('slotId').isInt().withMessage('Slot id must be an integer'), body('request_message').trim().optional()], validateRequest, bookSlot);

module.exports = router;
