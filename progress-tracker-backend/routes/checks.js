const express = require('express');
const router = express.Router();
const db = require('../db');

router.post('/', (req, res) => {
  const { task_id, date, status } = req.body;

  // First check if record exists
  const checkQuery = "SELECT * FROM checks WHERE task_id = ? AND date = ?";

  db.query(checkQuery, [task_id, date], (err, results) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: "DB error" });
    }

    if (results.length > 0) {
      // Update
      const updateQuery = "UPDATE checks SET status = ? WHERE task_id = ? AND date = ?";
      db.query(updateQuery, [status, task_id, date], (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ error: "DB error" });
        }
        res.json({ message: "Updated successfully" });
      });
    } else {
      // Insert
     db.query(
  `INSERT INTO checks (task_id, date, status)
   VALUES (?, ?, ?)
   ON DUPLICATE KEY UPDATE status = ?`,
  [task_id, date, status, status],
  (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ error: 'DB error' });
    }
    res.json({ message: 'Saved' });
  }
);
    }
  });
});

module.exports = router;