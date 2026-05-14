const pool = require('../config/db');

async function getSubjects(req, res, next) {
  try {
    const [subjects] = await pool.query('SELECT id, name, description FROM subjects ORDER BY name');
    res.json(subjects);
  } catch (error) {
    next(error);
  }
}

async function createSubject(req, res, next) {
  try {
    const { name, description } = req.body;
    const [result] = await pool.query('INSERT INTO subjects (name, description) VALUES (?, ?)', [name, description]);
    res.status(201).json({ id: result.insertId, name, description });
  } catch (error) {
    next(error);
  }
}

async function updateSubject(req, res, next) {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    await pool.query('UPDATE subjects SET name = ?, description = ? WHERE id = ?', [name, description, id]);
    res.json({ id: Number(id), name, description });
  } catch (error) {
    next(error);
  }
}

async function deleteSubject(req, res, next) {
  try {
    const { id } = req.params;
    await pool.query('DELETE FROM subjects WHERE id = ?', [id]);
    res.json({ message: 'Subject deleted' });
  } catch (error) {
    next(error);
  }
}

module.exports = { getSubjects, createSubject, updateSubject, deleteSubject };
