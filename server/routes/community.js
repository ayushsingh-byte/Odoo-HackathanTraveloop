const express = require('express');
const db = require('../db');
const { requireAuth } = require('../middleware/auth');

const router = express.Router();

router.use(requireAuth);

router.get('/', async (req, res) => {
  try {
    const { q, category, limit = 20, offset = 0 } = req.query;
    let sql = `SELECT cp.post_id, cp.title, cp.body, cp.image_url, cp.category,
                      cp.likes_count, cp.created_at,
                      u.name AS author_name, u.user_id AS author_id,
                      t.title AS trip_title
               FROM community_posts cp
               JOIN users u ON u.user_id = cp.user_id
               LEFT JOIN trips t ON t.trip_id = cp.trip_id
               WHERE 1=1`;
    const params = [];
    if (q) { sql += ' AND (cp.title LIKE ? OR cp.body LIKE ?)'; params.push(`%${q}%`, `%${q}%`); }
    if (category) { sql += ' AND cp.category = ?'; params.push(category); }
    sql += ' ORDER BY cp.created_at DESC LIMIT ? OFFSET ?';
    params.push(parseInt(limit), parseInt(offset));
    const [rows] = await db.query(sql, params);
    res.json({ posts: rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/', async (req, res) => {
  const { title, body, image_url, category, trip_id } = req.body;
  if (!title || !body) return res.status(400).json({ error: 'title and body required' });
  try {
    const [result] = await db.query(
      'INSERT INTO community_posts (user_id, trip_id, title, body, image_url, category) VALUES (?, ?, ?, ?, ?, ?)',
      [req.session.user.user_id, trip_id || null, title, body, image_url || null, category || 'experience']
    );
    res.status(201).json({ post_id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT user_id FROM community_posts WHERE post_id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Not found' });
    if (rows[0].user_id !== req.session.user.user_id && req.session.user.role !== 'admin') {
      return res.status(403).json({ error: 'Forbidden' });
    }
    await db.query('DELETE FROM community_posts WHERE post_id = ?', [req.params.id]);
    res.json({ deleted: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/like', async (req, res) => {
  try {
    await db.query('UPDATE community_posts SET likes_count = likes_count + 1 WHERE post_id = ?', [req.params.id]);
    res.json({ liked: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
