const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/:tripId', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT p.*, pc.category_name
       FROM packing_checklist_items p
       LEFT JOIN packing_categories pc ON pc.category_id = p.category_id
       WHERE p.trip_id = ?
       ORDER BY pc.category_name, p.item_name`,
      [req.params.tripId]
    );
    const total = rows.length;
    const packed = rows.filter(r => r.is_packed).length;
    res.json({ items: rows, total, packed });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/categories/all', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM packing_categories ORDER BY category_name');
    res.json({ categories: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:tripId', async (req, res) => {
  const { item_name, category_id } = req.body;
  if (!item_name) return res.status(400).json({ error: 'item_name required' });
  const userId = req.session.user.user_id;
  try {
    const [result] = await db.query(
      'INSERT INTO packing_checklist_items (trip_id, user_id, category_id, item_name) VALUES (?,?,?,?)',
      [req.params.tripId, userId, category_id || null, item_name]
    );
    res.status(201).json({ item_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/:tripId/:itemId/toggle', async (req, res) => {
  try {
    await db.query(
      'UPDATE packing_checklist_items SET is_packed = NOT is_packed WHERE item_id = ? AND trip_id = ?',
      [req.params.itemId, req.params.tripId]
    );
    res.json({ toggled: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:tripId/:itemId', async (req, res) => {
  try {
    await db.query('DELETE FROM packing_checklist_items WHERE item_id = ? AND trip_id = ?', [req.params.itemId, req.params.tripId]);
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:tripId/reset', async (req, res) => {
  try {
    await db.query('UPDATE packing_checklist_items SET is_packed = 0 WHERE trip_id = ?', [req.params.tripId]);
    res.json({ reset: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
