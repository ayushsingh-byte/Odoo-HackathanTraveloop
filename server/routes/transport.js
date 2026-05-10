const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/:tripId', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT ts.*,
              fc.city_name AS from_city,
              tc.city_name AS to_city
       FROM transport_segments ts
       LEFT JOIN trip_stops fs ON fs.stop_id = ts.from_stop_id
       LEFT JOIN cities fc ON fc.city_id = fs.city_id
       LEFT JOIN trip_stops tst ON tst.stop_id = ts.to_stop_id
       LEFT JOIN cities tc ON tc.city_id = tst.city_id
       WHERE ts.trip_id = ?
       ORDER BY ts.created_at ASC`,
      [req.params.tripId]
    );
    res.json({ segments: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:tripId', async (req, res) => {
  const { from_stop_id, to_stop_id, transport_type, transport_cost, duration_minutes, notes } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO transport_segments (trip_id, from_stop_id, to_stop_id, transport_type, transport_cost, duration_minutes, notes) VALUES (?,?,?,?,?,?,?)',
      [req.params.tripId, from_stop_id || null, to_stop_id || null, transport_type || 'flight', transport_cost || 0, duration_minutes || null, notes || null]
    );
    res.status(201).json({ segment_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:tripId/:segmentId', async (req, res) => {
  try {
    await db.query('DELETE FROM transport_segments WHERE segment_id = ? AND trip_id = ?', [req.params.segmentId, req.params.tripId]);
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
