const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3306;

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

  const sql = "INSERT INTO tasks (user_id, task_title, task_desc) VALUES (?, ?, ?)";
  db.query(sql, [user_id, task_title, task_desc], (err, result) => {
    if (err) return res.status(500).send(err);
    res.send({ message: "Task added" });
  });
});


app.post("/login", (req, res) => {

   console.log("🔥 /login endpoint hit"); 
  const { email, password } = req.body;

  console.log("📥 Login Attempt:", email, password); // Log input

  const query = "SELECT * FROM users WHERE user_email = ? AND user_password = ?";
  db.query(query, [email, password], (err, result) => {
    if (err) {
      console.error("❌ Login DB Error:", err.sqlMessage);  // Log actual SQL error
      return res.status(500).json({ message: "Database error" });
    }

    if (result.length > 0) {
      const user = result[0];
      return res.json({
        success: true,
        user_id: user.user_id,
        user_name: user.user_name,
      });
    } else {
      return res.json({ success: false, message: "Invalid credentials" });
    }
  });
});


app.delete('/tasks/:id', (req, res) => {
  const taskId = req.params.id;
  const sql = 'DELETE FROM tasks WHERE task_id = ?';

  db.query(sql, [taskId], (err, result) => {
    if (err) {
      console.error("❌ Delete error:", err);
      return res.status(500).json({ message: 'Database error' });
    }
    res.json({ success: true, message: 'Task deleted' });
  });
});






// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
