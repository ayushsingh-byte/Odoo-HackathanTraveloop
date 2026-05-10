const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');

const router = express.Router();

router.post('/register', async (req, res) => {
  const { name, email, password, phone, city_name, country_name, additional_info } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'name, email, password required' });
  }
  try {
    const [existing] = await db.query('SELECT user_id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'Email already registered' });
    }
    const hash = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      'INSERT INTO users (name, email, password_hash, phone, city_name, country_name, additional_info) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, email, hash, phone || null, city_name || null, country_name || null, additional_info || null]
    );
    const user = { user_id: result.insertId, name, email, role: 'user' };
    req.session.user = user;
    res.status(201).json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'email and password required' });
  }
  try {
    const [rows] = await db.query(
      'SELECT user_id, name, email, password_hash, role, profile_photo FROM users WHERE email = ?',
      [email]
    );
    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    delete user.password_hash;
    req.session.user = user;
    res.json({ user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy(() => {
    res.json({ message: 'Logged out' });
  });
});

router.get('/me', async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }
  try {
    const [rows] = await db.query(
      'SELECT user_id, name, email, phone, city_name, country_name, additional_info, role, profile_photo FROM users WHERE user_id = ?',
      [req.session.user.user_id]
    );
    if (rows.length === 0) return res.status(401).json({ error: 'Not authenticated' });
    res.json({ user: rows[0] });
  } catch (err) {
    res.json({ user: req.session.user });
  }
});

router.put('/profile', async (req, res) => {
  if (!req.session.user) return res.status(401).json({ error: 'Not authenticated' });
  const { name, email, password, phone, city_name, country_name, additional_info } = req.body;
  try {
    let sql = 'UPDATE users SET name=?, email=?, phone=?, city_name=?, country_name=?, additional_info=?';
    const params = [name, email, phone || null, city_name || null, country_name || null, additional_info || null];
    if (password && password.length >= 6) {
      const hash = await bcrypt.hash(password, 10);
      sql += ', password_hash=?';
      params.push(hash);
    }
    sql += ' WHERE user_id=?';
    params.push(req.session.user.user_id);
    await db.query(sql, params);
    req.session.user = { ...req.session.user, name, email };
    res.json({ updated: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
