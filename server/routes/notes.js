const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/:tripId', async (req, res) => {
  const { stop_id } = req.query;
  try {
    let sql = `SELECT n.*, ts.city_id, c.city_name
               FROM trip_notes n
               LEFT JOIN trip_stops ts ON ts.stop_id = n.stop_id
               LEFT JOIN cities c ON c.city_id = ts.city_id
               WHERE n.trip_id = ?`;
    const params = [req.params.tripId];
    if (stop_id === 'null') {
      sql += ' AND n.stop_id IS NULL';
    } else if (stop_id) {
      sql += ' AND n.stop_id = ?';
      params.push(stop_id);
    }
    sql += ' ORDER BY n.created_at DESC';
    const [rows] = await db.query(sql, params);
    res.json({ notes: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:tripId', async (req, res) => {
  const { note_title, note_content, stop_id } = req.body;
  const userId = req.session.user.user_id;
  try {
    const [result] = await db.query(
      'INSERT INTO trip_notes (trip_id, stop_id, user_id, note_title, note_content) VALUES (?,?,?,?,?)',
      [req.params.tripId, stop_id || null, userId, note_title || null, note_content || null]
    );
    res.status(201).json({ note_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:tripId/:noteId', async (req, res) => {
  const { note_title, note_content } = req.body;
  try {
    await db.query(
      'UPDATE trip_notes SET note_title = ?, note_content = ? WHERE note_id = ? AND trip_id = ?',
      [note_title, note_content, req.params.noteId, req.params.tripId]
    );
    res.json({ updated: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:tripId/:noteId', async (req, res) => {
  try {
    await db.query('DELETE FROM trip_notes WHERE note_id = ? AND trip_id = ?', [req.params.noteId, req.params.tripId]);
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
