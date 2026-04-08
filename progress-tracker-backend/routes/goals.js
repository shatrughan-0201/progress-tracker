const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const userId = req.userId;
  const rows = await req.db.all('SELECT id, goal_text as text FROM goals WHERE user_id = ? ORDER BY id', [userId]);
  res.json(rows);
});

router.post('/', async (req, res) => {
  const { text } = req.body;
  if (!text) return res.status(400).json({ error: 'Goal text required' });
  const userId = req.userId;
  const result = await req.db.run('INSERT INTO goals (user_id, goal_text) VALUES (?, ?)', [userId, text]);
  res.status(201).json({ id: result.lastID, text });
});

router.put('/:id', async (req, res) => {
  const goalId = req.params.id;
  const { text } = req.body;
  const userId = req.userId;
  const goal = await req.db.get('SELECT * FROM goals WHERE id = ? AND user_id = ?', [goalId, userId]);
  if (!goal) return res.status(404).json({ error: 'Goal not found' });
  await req.db.run('UPDATE goals SET goal_text = ? WHERE id = ?', [text, goalId]);
  res.json({ id: goalId, text });
});

router.delete('/:id', async (req, res) => {
  const goalId = req.params.id;
  const userId = req.userId;
  await req.db.run('DELETE FROM goals WHERE id = ? AND user_id = ?', [goalId, userId]);
  res.status(204).send();
});

module.exports = router;