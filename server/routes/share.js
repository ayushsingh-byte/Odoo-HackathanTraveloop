const express = require('express');
const crypto = require('crypto');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.post('/generate/:tripId', requireAuth, async (req, res) => {
  const userId = req.session.user.user_id;
  const { expires_in_days } = req.body;
  try {
    const [tripRows] = await db.query('SELECT * FROM trips WHERE trip_id = ? AND user_id = ?', [req.params.tripId, userId]);
    if (tripRows.length === 0) return res.status(404).json({ error: 'Trip not found' });

    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = expires_in_days
      ? new Date(Date.now() + expires_in_days * 86400000)
      : null;

    await db.query(
      'INSERT INTO shared_links (trip_id, share_token, expires_at) VALUES (?,?,?)',
      [req.params.tripId, token, expiresAt]
    );
    res.status(201).json({ share_token: token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:token', async (req, res) => {
  try {
    const [linkRows] = await db.query(
      'SELECT * FROM shared_links WHERE share_token = ? AND is_active = 1',
      [req.params.token]
    );
    if (linkRows.length === 0) return res.status(404).json({ error: 'Link not found or revoked' });

    const link = linkRows[0];
    if (link.expires_at && new Date(link.expires_at) < new Date()) {
      return res.status(410).json({ error: 'Link expired' });
    }

    const [tripRows] = await db.query(
      `SELECT t.*, u.name AS owner_name
       FROM trips t JOIN users u ON u.user_id = t.user_id
       WHERE t.trip_id = ?`,
      [link.trip_id]
    );
    if (tripRows.length === 0) return res.status(404).json({ error: 'Trip not found' });

    const [stops] = await db.query(
      `SELECT ts.*, c.city_name, co.country_name, c.image_url AS city_image
       FROM trip_stops ts
       JOIN cities c ON c.city_id = ts.city_id
       JOIN countries co ON co.country_id = c.country_id
       WHERE ts.trip_id = ? ORDER BY ts.position ASC`,
      [link.trip_id]
    );

    for (const stop of stops) {
      const [acts] = await db.query(
        `SELECT sa.*, a.activity_name, a.estimated_cost, a.estimated_duration_minutes, ac.name AS category_name
         FROM stop_activities sa
         JOIN activities a ON a.activity_id = sa.activity_id
         JOIN activity_categories ac ON ac.category_id = a.category_id
         WHERE sa.stop_id = ? ORDER BY sa.scheduled_date, sa.scheduled_time`,
        [stop.stop_id]
      );
      stop.activities = acts;
    }

    res.json({ trip: tripRows[0], stops });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch('/revoke/:linkId', requireAuth, async (req, res) => {
  try {
    await db.query('UPDATE shared_links SET is_active = 0 WHERE link_id = ?', [req.params.linkId]);
    res.json({ revoked: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
