const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// MySQL connection using environment variables
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

db.connect((err) => {
  if (err) {
    console.error('❌ Database connection failed:', err);
  } else {
    console.log('✅ Connected to MySQL database');
  }
});

// Login route
app.post('/login', (req, res) => {
  const { user_email, user_pass } = req.body;

  const sql = "SELECT user_id, user_name, user_email FROM users WHERE user_email = ? AND user_pass = ?";
  db.query(sql, [user_email, user_pass], (err, results) => {
    if (err) return res.status(500).send({ message: "Database error" });
    if (results.length === 0) return res.status(401).send({ message: "Invalid credentials" });

    res.status(200).send(results[0]);
  });
});

// Get tasks
app.get('/tasks/:user_id', (req, res) => {
  const user_id = req.params.user_id;

  db.query("SELECT * FROM tasks WHERE user_id = ?", [user_id], (err, results) => {
    if (err) return res.status(500).send(err);
    res.send(results);
  });
});

// Add task
app.post('/tasks', (req, res) => {
  const { user_id, task_title, task_desc } = req.body;

  const sql = "INSERT INTO tasks (user_id, task_title, task_desc, task_time) VALUES (?, ?, ?, NOW())";
  db.query(sql, [user_id, task_title, task_desc], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: "Task added" });
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
