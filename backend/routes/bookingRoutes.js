const express = require('express');
const { body, param } = require('express-validator');
const { getMyBookings, updateBookingStatus, deleteBooking } = require('../controllers/bookingController');
const authMiddleware = require('../middleware/authMiddleware');
const { authorizeRoles } = require('../middleware/roleMiddleware');
const { validateRequest } = require('../middleware/validateMiddleware');

const router = express.Router();

router.get('/my-bookings', authMiddleware, getMyBookings);
router.put(
  '/:id/status',
  authMiddleware,
  authorizeRoles('tutor'),
  [param('id').isInt().withMessage('Booking id must be integer'), body('status').isIn(['approved', 'rejected', 'cancelled']).withMessage('Status must be approved, rejected, or cancelled')],
  validateRequest,
  updateBookingStatus
);
router.delete('/:id', authMiddleware, [param('id').isInt().withMessage('Booking id must be integer')], validateRequest, deleteBooking);

module.exports = router;
