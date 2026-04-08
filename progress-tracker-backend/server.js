const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());
app.get("/", (req, res) => {
  res.send("Server is running 🚀");
});

/* ================= DATABASE CONNECTION ================= */
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'DidiBh@i9117',   // 🔴 change this
  database: 'progress_tracker'
});

db.connect(err => {
  if (err) {
    console.error('DB connection failed:', err);
  } else {
    console.log('✅ Database connected');
  }
});

/* ================= GET ALL TASKS ================= */
app.get('/api/tasks', (req, res) => {
  db.query("SELECT * FROM tasks", (err, result) => {
    if (err) {
      console.error("ERROR fetching tasks:", err);
      return res.status(500).json({ error: "DB error" });
    }
    res.json(result);
  });
});

/* ================= ADD TASK ================= */
app.post('/api/tasks', (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Task name required" });
  }

  db.query(
    "INSERT INTO tasks (name) VALUES (?)",
    [name],
    (err, result) => {
      if (err) {
        console.error("ERROR adding task:", err);
        return res.status(500).json({ error: "DB error" });
      }

      res.json({
        message: "Task added",
        taskId: result.insertId
      });
    }
  );
});

/* ================= SAVE / UPDATE CHECK ================= */
app.post('/api/checks', (req, res) => {
  const { task_id, date, status } = req.body;

  if (!task_id || !date) {
    return res.status(400).json({ error: "Missing data" });
  }

  const sql = `
    INSERT INTO checks (task_id, date, status)
    VALUES (?, ?, ?)
    ON DUPLICATE KEY UPDATE status = ?
  `;

  db.query(sql, [task_id, date, status, status], (err, result) => {
    if (err) {
      console.error("❌ DB ERROR:", err);
      return res.status(500).json({ error: "DB error" });
    }

    res.json({ message: "Updated successfully" });
  });
});

/* ================= GET ALL CHECKS ================= */
app.get('/api/checks', (req, res) => {
  db.query("SELECT * FROM checks", (err, result) => {
    if (err) {
      console.error("ERROR fetching checks:", err);
      return res.status(500).json({ error: "DB error" });
    }
    res.json(result);
  });
});

/* ================= START SERVER ================= */
app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});