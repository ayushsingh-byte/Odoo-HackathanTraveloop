const express = require('express');
const { v4: uuidv4 } = require('uuid');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  const userId = req.session.user.user_id;
  const today = new Date().toISOString().split('T')[0];
  try {
    const [rows] = await db.query(
      `SELECT t.*,
        (SELECT COUNT(*) FROM trip_stops WHERE trip_id = t.trip_id) AS stop_count,
        tb.total_budget, tb.total_cost, tb.currency
       FROM trips t
       LEFT JOIN trip_budgets tb ON tb.trip_id = t.trip_id
       WHERE t.user_id = ?
       ORDER BY t.created_at DESC`,
      [userId]
    );
    const d = (s) => s ? s.slice(0, 10) : null;
    const ongoing   = rows.filter(t => d(t.start_date) && d(t.end_date) && d(t.start_date) <= today && d(t.end_date) >= today);
    const upcoming  = rows.filter(t => d(t.start_date) && d(t.start_date) > today);
    const completed = rows.filter(t => d(t.end_date) && d(t.end_date) < today);
    const undated   = rows.filter(t => !t.start_date && !t.end_date);
    res.json({ ongoing, upcoming, completed, undated });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  const userId = req.session.user.user_id;
  try {
    const [rows] = await db.query(
      `SELECT t.*, tb.total_budget, tb.total_cost, tb.transport_cost,
              tb.stay_cost, tb.food_cost, tb.activity_cost, tb.misc_cost, tb.currency
       FROM trips t
       LEFT JOIN trip_budgets tb ON tb.trip_id = t.trip_id
       WHERE t.trip_id = ? AND t.user_id = ?`,
      [req.params.id, userId]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'Trip not found' });

    const [stops] = await db.query(
      `SELECT ts.*, c.city_name, c.image_url as city_image, c.avg_daily_cost,
              co.country_name, co.currency as country_currency
       FROM trip_stops ts
       JOIN cities c ON c.city_id = ts.city_id
       JOIN countries co ON co.country_id = c.country_id
       WHERE ts.trip_id = ?
       ORDER BY ts.position ASC`,
      [req.params.id]
    );

    for (const stop of stops) {
      const [acts] = await db.query(
        `SELECT sa.*, a.activity_name, a.description, a.estimated_cost,
                a.estimated_duration_minutes, a.rating, a.image_url,
                ac.name AS category_name
         FROM stop_activities sa
         JOIN activities a ON a.activity_id = sa.activity_id
         JOIN activity_categories ac ON ac.category_id = a.category_id
         WHERE sa.stop_id = ?
         ORDER BY sa.scheduled_date, sa.scheduled_time`,
        [stop.stop_id]
      );
      stop.activities = acts;
    }

    const [segments] = await db.query(
      `SELECT ts.*,
              fs.stop_id AS from_stop_id, fc.city_name AS from_city,
              ts2.stop_id AS to_stop_id2, tc.city_name AS to_city
       FROM transport_segments ts
       LEFT JOIN trip_stops fs ON fs.stop_id = ts.from_stop_id
       LEFT JOIN cities fc ON fc.city_id = fs.city_id
       LEFT JOIN trip_stops ts2 ON ts2.stop_id = ts.to_stop_id
       LEFT JOIN cities tc ON tc.city_id = ts2.city_id
       WHERE ts.trip_id = ?`,
      [req.params.id]
    );

    res.json({ trip: rows[0], stops, segments });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { title, description, start_date, end_date, visibility, cover_image, total_budget, currency } = req.body;
  if (!title) return res.status(400).json({ error: 'title required' });
  const tripId = uuidv4();
  const userId = req.session.user.user_id;
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    await conn.query(
      'INSERT INTO trips (trip_id, user_id, title, description, start_date, end_date, visibility, cover_image) VALUES (?,?,?,?,?,?,?,?)',
      [tripId, userId, title, description || null, start_date || null, end_date || null, visibility || 'private', cover_image || null]
    );
    await conn.query(
      'INSERT INTO trip_budgets (trip_id, total_budget, currency) VALUES (?,?,?)',
      [tripId, total_budget || 0, currency || 'USD']
    );
    await conn.commit();
    res.status(201).json({ trip_id: tripId });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

router.put('/:id', async (req, res) => {
  const userId = req.session.user.user_id;
  const { title, description, start_date, end_date, visibility, cover_image } = req.body;
  try {
    const [result] = await db.query(
      'UPDATE trips SET title=?, description=?, start_date=?, end_date=?, visibility=?, cover_image=? WHERE trip_id=? AND user_id=?',
      [title, description, start_date, end_date, visibility, cover_image, req.params.id, userId]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Trip not found' });
    res.json({ updated: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  const userId = req.session.user.user_id;
  try {
    const [result] = await db.query(
      'DELETE FROM trips WHERE trip_id = ? AND user_id = ?',
      [req.params.id, userId]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Trip not found' });
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/stops', async (req, res) => {
  const { city_id, arrival_date, departure_date, position, notes } = req.body;
  if (!city_id) return res.status(400).json({ error: 'city_id required' });
  try {
    const [result] = await db.query(
      'INSERT INTO trip_stops (trip_id, city_id, arrival_date, departure_date, position, notes) VALUES (?,?,?,?,?,?)',
      [req.params.id, city_id, arrival_date || null, departure_date || null, position || 0, notes || null]
    );
    res.status(201).json({ stop_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/stops/:stopId', async (req, res) => {
  const { arrival_date, departure_date, position, notes } = req.body;
  try {
    await db.query(
      'UPDATE trip_stops SET arrival_date=?, departure_date=?, position=?, notes=? WHERE stop_id=? AND trip_id=?',
      [arrival_date, departure_date, position, notes, req.params.stopId, req.params.id]
    );
    res.json({ updated: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id/stops/:stopId', async (req, res) => {
  try {
    await db.query('DELETE FROM trip_stops WHERE stop_id = ? AND trip_id = ?', [req.params.stopId, req.params.id]);
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/stops/:stopId/activities', async (req, res) => {
  const { activity_id, scheduled_date, scheduled_time, actual_cost, notes } = req.body;
  if (!activity_id) return res.status(400).json({ error: 'activity_id required' });
  try {
    const [result] = await db.query(
      'INSERT INTO stop_activities (stop_id, activity_id, scheduled_date, scheduled_time, actual_cost, notes) VALUES (?,?,?,?,?,?)',
      [req.params.stopId, activity_id, scheduled_date || null, scheduled_time || null, actual_cost || null, notes || null]
    );
    res.status(201).json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id/stops/:stopId/activities/:saId', async (req, res) => {
  try {
    await db.query('DELETE FROM stop_activities WHERE id = ? AND stop_id = ?', [req.params.saId, req.params.stopId]);
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:id/stops/reorder', async (req, res) => {
  const { order } = req.body;
  if (!Array.isArray(order)) return res.status(400).json({ error: 'order array required' });
  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();
    for (let i = 0; i < order.length; i++) {
      await conn.query('UPDATE trip_stops SET position = ? WHERE stop_id = ? AND trip_id = ?', [i, order[i], req.params.id]);
    }
    await conn.commit();
    res.json({ updated: true });
  } catch (err) {
    await conn.rollback();
    res.status(500).json({ error: err.message });
  } finally {
    conn.release();
  }
});

router.get('/:id/invoice', async (req, res) => {
  try {
    const [trips] = await db.query(
      `SELECT t.*, u.name AS owner_name
       FROM trips t JOIN users u ON u.user_id = t.user_id
       WHERE t.trip_id = ? AND t.user_id = ?`,
      [req.params.id, req.session.user.user_id]
    );
    if (trips.length === 0) return res.status(404).json({ error: 'Trip not found' });
    const trip = trips[0];

    const [budgetRows] = await db.query('SELECT * FROM trip_budgets WHERE trip_id = ?', [req.params.id]);
    const budget = budgetRows[0] || {};

    const [stops] = await db.query(
      `SELECT ts.stop_id, ts.arrival_date, ts.departure_date,
              c.city_name, co.country_name, c.avg_daily_cost
       FROM trip_stops ts
       JOIN cities c ON c.city_id = ts.city_id
       JOIN countries co ON co.country_id = c.country_id
       WHERE ts.trip_id = ?
       ORDER BY ts.position`,
      [req.params.id]
    );

    const lineItems = [];
    for (const s of stops) {
      const days = s.arrival_date && s.departure_date
        ? Math.max(1, Math.ceil((new Date(s.departure_date) - new Date(s.arrival_date)) / 86400000))
        : 1;
      lineItems.push({
        description: `Stay in ${s.city_name}, ${s.country_name}`,
        qty: days,
        unit: 'day',
        unit_cost: s.avg_daily_cost,
        amount: days * s.avg_daily_cost
      });

      const [acts] = await db.query(
        `SELECT a.activity_name, a.estimated_cost, sa.actual_cost
         FROM stop_activities sa
         JOIN activities a ON a.activity_id = sa.activity_id
         WHERE sa.stop_id = ?`,
        [s.stop_id]
      );
      for (const a of acts) {
        lineItems.push({
          description: `Activity: ${a.activity_name}`,
          qty: 1,
          unit: 'item',
          unit_cost: a.actual_cost || a.estimated_cost,
          amount: a.actual_cost || a.estimated_cost
        });
      }
    }

    if (budget.transport_cost > 0) lineItems.push({ description: 'Transport', qty: 1, unit: 'trip', unit_cost: budget.transport_cost, amount: budget.transport_cost });
    if (budget.food_cost > 0) lineItems.push({ description: 'Food & Dining', qty: 1, unit: 'trip', unit_cost: budget.food_cost, amount: budget.food_cost });
    if (budget.misc_cost > 0) lineItems.push({ description: 'Miscellaneous', qty: 1, unit: 'trip', unit_cost: budget.misc_cost, amount: budget.misc_cost });

    const subtotal = lineItems.reduce((s, i) => s + Number(i.amount), 0);
    const tax_rate = 0.05;
    const tax = subtotal * tax_rate;
    const discount = 0;
    const grand_total = subtotal + tax - discount;
    const currency = budget.currency || 'USD';

    res.json({
      invoice: {
        invoice_id: `INV-${req.params.id.substring(0, 8).toUpperCase()}`,
        trip_title: trip.title,
        owner_name: trip.owner_name,
        start_date: trip.start_date,
        end_date: trip.end_date,
        currency,
        line_items: lineItems,
        subtotal,
        tax_rate,
        tax,
        discount,
        grand_total,
        total_budget: budget.total_budget || 0,
        total_spent: subtotal,
        remaining: (budget.total_budget || 0) - subtotal,
        payment_status: subtotal <= (budget.total_budget || subtotal) ? 'pending' : 'over_budget'
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
