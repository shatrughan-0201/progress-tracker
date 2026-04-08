const express = require('express');
const router = express.Router();
const db = require('../db');

// CREATE TASK
router.post('/', (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Task name required' });
  }

  const query = "INSERT INTO tasks (name) VALUES (?)";

  db.query(query, [name], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'DB error' });
    }

    res.json({
      message: "Task added",
      taskId: result.insertId   // 🔥 VERY IMPORTANT
    });
  });
});

module.exports = router;