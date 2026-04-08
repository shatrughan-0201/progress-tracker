const express = require('express');
const router = express.Router();
const { hashPassword, comparePassword, generateToken } = require('../auth');

router.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }
  const db = req.db;
  try {
    const hashed = await hashPassword(password);
    await db.run('INSERT INTO users (email, password_hash) VALUES (?, ?)', [email, hashed]);
    res.status(201).json({ message: 'User created' });
  } catch (err) {
    if (err.message.includes('UNIQUE')) {
      res.status(400).json({ error: 'Email already exists' });
    } else {
      res.status(500).json({ error: err.message });
    }
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const db = req.db;
  const user = await db.get('SELECT * FROM users WHERE email = ?', [email]);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const match = await comparePassword(password, user.password_hash);
  if (!match) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  const token = generateToken(user.id);
  res.json({ token, userId: user.id });
});

module.exports = router;