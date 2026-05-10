const express = require('express');
const db = require('../db');

const router = express.Router();

router.get('/', async (req, res) => {
  const { q, country_id, limit = 20, offset = 0 } = req.query;
  try {
    let sql = `SELECT c.*, co.country_name, co.currency
               FROM cities c
               JOIN countries co ON co.country_id = c.country_id
               WHERE 1=1`;
    const params = [];
    if (q) {
      sql += ' AND MATCH(c.city_name, c.description) AGAINST(? IN BOOLEAN MODE)';
      params.push(q + '*');
    }
    if (country_id) {
      sql += ' AND c.country_id = ?';
      params.push(country_id);
    }
    sql += ' ORDER BY c.popularity_score DESC LIMIT ? OFFSET ?';
    params.push(Number(limit), Number(offset));
    const [rows] = await db.query(sql, params);
    res.json({ cities: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/countries', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM countries ORDER BY country_name ASC');
    res.json({ countries: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query(
      `SELECT c.*, co.country_name, co.currency
       FROM cities c JOIN countries co ON co.country_id = c.country_id
       WHERE c.city_id = ?`,
      [req.params.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: 'City not found' });
    res.json({ city: rows[0] });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
