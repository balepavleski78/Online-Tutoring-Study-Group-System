const pool = require('../config/db');

async function getStudyGroups(req, res, next) {
  try {
    const [groups] = await pool.query(
      `SELECT sg.id, sg.title, sg.description, sg.meeting_date, sg.location_or_link, sg.created_by, sg.subject_id,
        u.username AS creator_name, s.name AS subject_name,
        COALESCE(member_counts.count, 0) AS member_count
       FROM study_groups sg
       JOIN users u ON sg.created_by = u.id
       JOIN subjects s ON sg.subject_id = s.id
       LEFT JOIN (
         SELECT group_id, COUNT(*) AS count FROM group_members GROUP BY group_id
       ) AS member_counts ON sg.id = member_counts.group_id
       ORDER BY sg.meeting_date DESC`
    );
    const groupsWithMembers = await Promise.all(
      groups.map(async (group) => {
        const [members] = await pool.query(
          'SELECT u.id AS student_id, u.username FROM group_members gm JOIN users u ON gm.student_id = u.id WHERE gm.group_id = ?',
          [group.id]
        );
        return { ...group, members };
      })
    );
    res.json(groupsWithMembers);
  } catch (error) {
    next(error);
  }
}

async function createStudyGroup(req, res, next) {
  try {
    const { title, subject_id, description, meeting_date, location_or_link } = req.body;
    const created_by = req.user.id;
    const [result] = await pool.query(
      'INSERT INTO study_groups (title, subject_id, created_by, description, meeting_date, location_or_link) VALUES (?, ?, ?, ?, ?, ?)',
      [title, subject_id, created_by, description, meeting_date, location_or_link]
    );
    await pool.query('INSERT INTO group_members (group_id, student_id) VALUES (?, ?)', [result.insertId, created_by]);
    res.status(201).json({ id: result.insertId, title, subject_id, description, meeting_date, location_or_link, created_by });
  } catch (error) {
    next(error);
  }
}

async function joinStudyGroup(req, res, next) {
  try {
    const group_id = req.params.id;
    const student_id = req.user.id;
    const [existing] = await pool.query('SELECT id FROM group_members WHERE group_id = ? AND student_id = ?', [group_id, student_id]);
    if (existing.length) {
      return res.status(400).json({ message: 'Already a member of this group' });
    }
    await pool.query('INSERT INTO group_members (group_id, student_id) VALUES (?, ?)', [group_id, student_id]);
    res.json({ message: 'Joined study group' });
  } catch (error) {
    next(error);
  }
}

async function leaveStudyGroup(req, res, next) {
  try {
    const group_id = req.params.id;
    const student_id = req.user.id;
    await pool.query('DELETE FROM group_members WHERE group_id = ? AND student_id = ?', [group_id, student_id]);
    res.json({ message: 'Left study group' });
  } catch (error) {
    next(error);
  }
}

module.exports = { getStudyGroups, createStudyGroup, joinStudyGroup, leaveStudyGroup };
