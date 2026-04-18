import express from 'express';
import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const db = new Database('academic.db');

// Set up the database tables (minimal approach)
db.exec(`
  CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT,
    subject TEXT,
    response TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    due_date TEXT
  );

  -- Add some initial assignments if empty
  INSERT INTO assignments (title, due_date) 
  SELECT 'Math Quiz', '2026-04-25' WHERE NOT EXISTS (SELECT 1 FROM assignments);
`);

app.use(express.json());
app.use(express.static('public'));

// Login API (Simple proof of concept)
app.post('/api/login', (req, res) => {
  const { username, role } = req.body;
  // In a real app, you'd check a password here.
  // For simplicity, we just accept any login.
  res.json({ success: true, user: { username, role } });
});

// Assignments API
app.get('/api/assignments', (req, res) => {
  const tasks = db.prepare('SELECT * FROM assignments').all();
  res.json(tasks);
});

// Feedback API
app.post('/api/feedback', (req, res) => {
  const { studentId, subject, response } = req.body;
  const info = db.prepare('INSERT INTO feedback (student_id, subject, response) VALUES (?, ?, ?)')
                .run(studentId, subject, response);
  res.json({ success: true, id: info.lastInsertRowid });
});

const PORT = 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
