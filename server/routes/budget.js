const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/:tripId', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM trip_budgets WHERE trip_id = ?', [req.params.tripId]);
    if (rows.length === 0) return res.status(404).json({ error: 'Budget not found' });
    const budget = rows[0];
    budget.remaining = budget.total_budget - budget.total_cost;
    budget.over_budget = budget.remaining < 0;
    res.json({ budget });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put('/:tripId', async (req, res) => {
  const { total_budget, transport_cost, stay_cost, food_cost, activity_cost, misc_cost, currency } = req.body;
  const total_cost = (transport_cost || 0) + (stay_cost || 0) + (food_cost || 0) + (activity_cost || 0) + (misc_cost || 0);
  try {
    await db.query(
      `UPDATE trip_budgets SET total_budget=?, transport_cost=?, stay_cost=?, food_cost=?,
       activity_cost=?, misc_cost=?, total_cost=?, currency=?
       WHERE trip_id=?`,
      [total_budget || 0, transport_cost || 0, stay_cost || 0, food_cost || 0,
       activity_cost || 0, misc_cost || 0, total_cost, currency || 'USD', req.params.tripId]
    );
    res.json({ updated: true, total_cost });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
