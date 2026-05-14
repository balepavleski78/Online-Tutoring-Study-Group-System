const pool = require('../config/db');

async function getMyBookings(req, res, next) {
  try {
    const user = req.user;
    let query;
    let params;
    if (user.role === 'student') {
      query = `SELECT b.id, b.student_id, b.slot_id, b.status, b.request_message, ts.date, ts.start_time, ts.end_time, ts.subject_id,
        u.username AS tutor_name, s.name AS subject_name
        FROM bookings b
        JOIN tutoring_slots ts ON b.slot_id = ts.id
        JOIN users u ON ts.tutor_id = u.id
        JOIN subjects s ON ts.subject_id = s.id
        WHERE b.student_id = ?
        ORDER BY ts.date`;
      params = [user.id];
    } else if (user.role === 'tutor') {
      query = `SELECT b.id, b.student_id, b.slot_id, b.status, b.request_message, ts.date, ts.start_time, ts.end_time, ts.subject_id,
        su.username AS student_name, s.name AS subject_name
        FROM bookings b
        JOIN tutoring_slots ts ON b.slot_id = ts.id
        JOIN users su ON b.student_id = su.id
        JOIN subjects s ON ts.subject_id = s.id
        WHERE ts.tutor_id = ?
        ORDER BY ts.date`;
      params = [user.id];
    } else {
      return res.status(403).json({ message: 'Role not supported' });
    }
    const [bookings] = await pool.query(query, params);
    res.json(bookings);
  } catch (error) {
    next(error);
  }
}

async function updateBookingStatus(req, res, next) {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const [bookings] = await pool.query(
      `SELECT b.id, b.slot_id, ts.tutor_id
       FROM bookings b
       JOIN tutoring_slots ts ON b.slot_id = ts.id
       WHERE b.id = ?`,
      [id]
    );
    if (!bookings.length || bookings[0].tutor_id !== req.user.id) {
      return res.status(403).json({ message: 'Booking not found or access denied' });
    }
    await pool.query('UPDATE bookings SET status = ? WHERE id = ?', [status, id]);
    const slotStatus = status === 'approved' ? 'booked' : status === 'rejected' ? 'open' : 'cancelled';
    await pool.query('UPDATE tutoring_slots SET status = ? WHERE id = ?', [slotStatus, bookings[0].slot_id]);
    res.json({ id: Number(id), status });
  } catch (error) {
    next(error);
  }
}

async function deleteBooking(req, res, next) {
  try {
    const { id } = req.params;
    const [bookings] = await pool.query(
      `SELECT b.id, b.student_id, b.slot_id, ts.tutor_id
       FROM bookings b
       JOIN tutoring_slots ts ON b.slot_id = ts.id
       WHERE b.id = ?`,
      [id]
    );
    if (!bookings.length) {
      return res.status(404).json({ message: 'Booking not found' });
    }
    const booking = bookings[0];
    const allowed = req.user.role === 'admin' || booking.student_id === req.user.id || booking.tutor_id === req.user.id;
    if (!allowed) {
      return res.status(403).json({ message: 'Access denied' });
    }
    await pool.query('DELETE FROM bookings WHERE id = ?', [id]);
    await pool.query('UPDATE tutoring_slots SET status = ? WHERE id = ?', ['open', booking.slot_id]);
    res.json({ message: 'Booking deleted' });
  } catch (error) {
    next(error);
  }
}

module.exports = { getMyBookings, updateBookingStatus, deleteBooking };
