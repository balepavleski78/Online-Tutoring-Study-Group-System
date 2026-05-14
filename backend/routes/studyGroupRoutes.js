const express = require('express');
const { body, param } = require('express-validator');
const { getStudyGroups, createStudyGroup, joinStudyGroup, leaveStudyGroup } = require('../controllers/studyGroupController');
const authMiddleware = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validateMiddleware');
const pool = require('../config/db');

const router = express.Router();

router.get('/', getStudyGroups);
router.post(
  '/',
  authMiddleware,
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('subject_id').isInt().withMessage('Subject id is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('meeting_date').isISO8601().withMessage('Valid meeting date is required'),
    body('location_or_link').trim().notEmpty().withMessage('Location or link is required'),
  ],
  validateRequest,
  createStudyGroup
);
router.post('/:id/join', authMiddleware, [param('id').isInt().withMessage('Group id must be integer')], validateRequest, joinStudyGroup);
router.post('/:id/leave', authMiddleware, [param('id').isInt().withMessage('Group id must be integer')], validateRequest, leaveStudyGroup);
router.delete('/:id', authMiddleware, [param('id').isInt().withMessage('Group id must be integer')], validateRequest, async (req, res, next) => {
  try {
    const { id } = req.params;
    const [group] = await pool.query('SELECT created_by FROM study_groups WHERE id = ?', [id]);
    if (!group.length || (group[0].created_by !== req.user.id && req.user.role !== 'admin')) {
      return res.status(403).json({ message: 'Access denied' });
    }
    await pool.query('DELETE FROM group_members WHERE group_id = ?', [id]);
    await pool.query('DELETE FROM study_groups WHERE id = ?', [id]);
    res.json({ message: 'Study group deleted' });
  } catch (error) {
    next(error);
  }
});
router.get('/:id/members', authMiddleware, [param('id').isInt().withMessage('Group id must be integer')], validateRequest, async (req, res, next) => {
  try {
    const { id } = req.params;
    const [members] = await pool.query(
      'SELECT u.id AS student_id, u.username FROM group_members gm JOIN users u ON gm.student_id = u.id WHERE gm.group_id = ?',
      [id]
    );
    res.json(members);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id/members/:memberId', authMiddleware, [param('id').isInt().withMessage('Group id must be integer'), param('memberId').isInt().withMessage('Member id must be integer')], validateRequest, async (req, res, next) => {
  try {
    const { id, memberId } = req.params;
    const [group] = await pool.query('SELECT created_by FROM study_groups WHERE id = ?', [id]);
    if (!group.length || (group[0].created_by !== req.user.id && req.user.role !== 'admin')) {
      return res.status(403).json({ message: 'Access denied' });
    }
    await pool.query('DELETE FROM group_members WHERE group_id = ? AND student_id = ?', [id, memberId]);
    res.json({ message: 'Member removed' });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
