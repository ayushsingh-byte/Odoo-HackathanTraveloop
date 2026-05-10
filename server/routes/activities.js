const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  const { q, city_id, category_id, limit = 20, offset = 0 } = req.query;
  try {
    let sql = `SELECT a.*, ac.name AS category_name, c.city_name
               FROM activities a
               JOIN activity_categories ac ON ac.category_id = a.category_id
               JOIN cities c ON c.city_id = a.city_id
               WHERE 1=1`;
    const params = [];
    if (q) {
      sql += ' AND MATCH(a.activity_name, a.description) AGAINST(? IN BOOLEAN MODE)';
      params.push(q + '*');
    }
    if (city_id) {
      sql += ' AND a.city_id = ?';
      params.push(city_id);
    }
    if (category_id) {
      sql += ' AND a.category_id = ?';
      params.push(category_id);
    }
    sql += ' ORDER BY a.rating DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));
    const [rows] = await db.query(sql, params);
    res.json({ activities: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/categories', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM activity_categories ORDER BY name ASC');
    res.json({ categories: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
