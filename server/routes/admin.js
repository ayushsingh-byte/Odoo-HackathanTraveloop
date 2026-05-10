const express = require('express');
const db = require('../db');
const { requireAdmin } = require('../middleware/auth');

const router = express.Router();

router.use(requireAdmin);

router.get('/stats', async (req, res) => {
  try {
    const [[{ total_users }]]  = await db.query('SELECT COUNT(*) AS total_users FROM users WHERE role = "user"');
    const [[{ total_trips }]]  = await db.query('SELECT COUNT(*) AS total_trips FROM trips');
    const [[{ total_stops }]]  = await db.query('SELECT COUNT(*) AS total_stops FROM trip_stops');
    const [[{ total_activities }]] = await db.query('SELECT COUNT(*) AS total_activities FROM stop_activities');

    const [top_cities] = await db.query(
      `SELECT c.city_name, co.country_name, COUNT(ts.stop_id) AS visit_count
       FROM trip_stops ts
       JOIN cities c ON c.city_id = ts.city_id
       JOIN countries co ON co.country_id = c.country_id
       GROUP BY ts.city_id
       ORDER BY visit_count DESC LIMIT 10`
    );

    const [top_activities] = await db.query(
      `SELECT a.activity_name, COUNT(sa.id) AS use_count
       FROM stop_activities sa
       JOIN activities a ON a.activity_id = sa.activity_id
       GROUP BY sa.activity_id
       ORDER BY use_count DESC LIMIT 10`
    );

    const [trips_per_day] = await db.query(
      `SELECT DATE(created_at) AS date, COUNT(*) AS count
       FROM trips
       WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)
       GROUP BY DATE(created_at)
       ORDER BY date ASC`
    );

    res.json({ total_users, total_trips, total_stops, total_activities, top_cities, top_activities, trips_per_day });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/users', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT u.user_id, u.name, u.email, u.role, u.created_at,
              COUNT(t.trip_id) AS trip_count
       FROM users u
       LEFT JOIN trips t ON t.user_id = u.user_id
       GROUP BY u.user_id
       ORDER BY u.created_at DESC`
    );
    res.json({ users: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
