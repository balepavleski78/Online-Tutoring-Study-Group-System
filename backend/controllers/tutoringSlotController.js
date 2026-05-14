const pool = require('../config/db');

async function getTutoringSlots(req, res, next) {
  try {
    const { subject, tutor, date } = req.query;
    let query = `SELECT ts.id, ts.tutor_id, ts.subject_id, ts.date, ts.start_time, ts.end_time, ts.status,
      u.username AS tutor_name, s.name AS subject_name
      FROM tutoring_slots ts
      JOIN users u ON ts.tutor_id = u.id
      JOIN subjects s ON ts.subject_id = s.id
      WHERE 1=1`;
    const params = [];
    if (subject) {
      query += ' AND ts.subject_id = ?';
      params.push(subject);
    }
    if (tutor) {
      query += ' AND ts.tutor_id = ?';
      params.push(tutor);
    }
    if (date) {
      query += ' AND ts.date = ?';
      params.push(date);
    }
    query += ' ORDER BY ts.date, ts.start_time';
    const [slots] = await pool.query(query, params);
    res.json(slots);
  } catch (error) {
    next(error);
  }
}

async function createTutoringSlot(req, res, next) {
  try {
    const { subject_id, date, start_time, end_time } = req.body;
    const tutor_id = req.user.id;
    const [result] = await pool.query(
      'INSERT INTO tutoring_slots (tutor_id, subject_id, date, start_time, end_time, status) VALUES (?, ?, ?, ?, ?, ?)',
      [tutor_id, subject_id, date, start_time, end_time, 'open']
    );
    res.status(201).json({ id: result.insertId, tutor_id, subject_id, date, start_time, end_time, status: 'open' });
  } catch (error) {
    next(error);
  }
}

async function updateTutoringSlot(req, res, next) {
  try {
    const { id } = req.params;
    const updates = req.body;
    const [existing] = await pool.query('SELECT tutor_id FROM tutoring_slots WHERE id = ?', [id]);
    if (!existing.length || existing[0].tutor_id !== req.user.id) {
      return res.status(403).json({ message: 'Slot not found or access denied' });
    }
    const fields = [];
    const params = [];
    Object.entries(updates).forEach(([key, value]) => {
      if (['subject_id', 'date', 'start_time', 'end_time', 'status'].includes(key)) {
        fields.push(`${key} = ?`);
        params.push(value);
      }
    });
    if (!fields.length) {
      return res.status(400).json({ message: 'No valid updates provided' });
    }
    params.push(id);
    await pool.query(`UPDATE tutoring_slots SET ${fields.join(', ')} WHERE id = ?`, params);
    res.json({ id: Number(id), ...updates });
  } catch (error) {
    next(error);
  }
}

async function deleteTutoringSlot(req, res, next) {
  try {
    const { id } = req.params;
    const [existing] = await pool.query('SELECT tutor_id FROM tutoring_slots WHERE id = ?', [id]);
    if (!existing.length || existing[0].tutor_id !== req.user.id) {
      return res.status(403).json({ message: 'Slot not found or access denied' });
    }
    await pool.query('DELETE FROM tutoring_slots WHERE id = ?', [id]);
    res.json({ message: 'Slot deleted' });
  } catch (error) {
    next(error);
  }
}

async function bookSlot(req, res, next) {
  try {
    const { slotId } = req.params;
    const { request_message } = req.body;
    const student_id = req.user.id;
    const [slots] = await pool.query('SELECT id, status FROM tutoring_slots WHERE id = ?', [slotId]);
    if (!slots.length || slots[0].status !== 'open') {
      return res.status(400).json({ message: 'Slot is not available for booking' });
    }
    await pool.query('INSERT INTO bookings (student_id, slot_id, status, request_message) VALUES (?, ?, ?, ?)', [student_id, slotId, 'requested', request_message || '']);
    await pool.query('UPDATE tutoring_slots SET status = ? WHERE id = ?', ['booked', slotId]);
    res.status(201).json({ message: 'Booking request submitted' });
  } catch (error) {
    next(error);
  }
}

module.exports = { getTutoringSlots, createTutoringSlot, updateTutoringSlot, deleteTutoringSlot, bookSlot };
