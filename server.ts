import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("academic.db");

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    role TEXT,
    password TEXT
  );

  CREATE TABLE IF NOT EXISTS attendance (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT,
    subject TEXT,
    date TEXT,
    status TEXT
  );

  CREATE TABLE IF NOT EXISTS marks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT,
    subject TEXT,
    score INTEGER,
    total INTEGER
  );

  CREATE TABLE IF NOT EXISTS timetable (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    day TEXT,
    student_id TEXT,
    subject TEXT,
    time TEXT,
    room TEXT
  );

  CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    student_id TEXT,
    subject TEXT,
    time TEXT,
    type TEXT,
    comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS assignments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    subject TEXT,
    due_date TEXT,
    description TEXT,
    status TEXT DEFAULT 'Pending'
  );

  CREATE TABLE IF NOT EXISTS complaints (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    title TEXT,
    description TEXT,
    type TEXT, -- 'complaint' or 'request'
    date TEXT,
    status TEXT DEFAULT 'Open'
  );
`);

// Seed Data
const userCount = db.prepare("SELECT COUNT(*) as count FROM users").get() as { count: number };
if (userCount.count === 0) {
  const insertUser = db.prepare("INSERT INTO users (id, name, role, password) VALUES (?, ?, ?, ?)");
  insertUser.run("S101", "Ananya Sharma", "student", "password123");
  insertUser.run("S102", "Rahul Verma", "student", "password123");
  insertUser.run("S103", "Megha Reddy", "student", "password123");
  insertUser.run("24321A0563", "Vishwa Teja", "student", "password123");
  insertUser.run("T201", "Dr. Rajesh Kumar", "teacher", "admin123");

  const insertTimetable = db.prepare("INSERT INTO timetable (day, student_id, subject, time, room) VALUES (?, ?, ?, ?, ?)");
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const subjects = ["Software Engineering", "Database Systems", "Computer Networks", "Artificial Intelligence", "Cyber Security"];
  
  ["S101", "S102", "S103", "24321A0563"].forEach(sid => {
    days.forEach((day, index) => {
      insertTimetable.run(day, sid, subjects[index % subjects.length], "10:30 AM", "Room 402");
      insertTimetable.run(day, sid, subjects[(index + 1) % subjects.length], "01:30 PM", "Lab 2");
    });
  });

  const insertMarks = db.prepare("INSERT INTO marks (student_id, subject, score, total) VALUES (?, ?, ?, ?)");
  ["S101", "S102", "S103", "24321A0563"].forEach(sid => {
    insertMarks.run(sid, "Data Structures", 80 + Math.floor(Math.random() * 20), 100);
    insertMarks.run(sid, "Algorithm Design", 75 + Math.floor(Math.random() * 25), 100);
    insertMarks.run(sid, "Operating Systems", 85 + Math.floor(Math.random() * 15), 100);
  });

  const insertAttendance = db.prepare("INSERT INTO attendance (student_id, subject, date, status) VALUES (?, ?, ?, ?)");
  ["S101", "S102", "S103", "24321A0563"].forEach(sid => {
    insertAttendance.run(sid, "Software Engineering", "2026-04-18", "Present");
    insertAttendance.run(sid, "Database Systems", "2026-04-18", "Present");
  });

  const insertAssignment = db.prepare("INSERT INTO assignments (title, subject, due_date, description) VALUES (?, ?, ?, ?)");
  insertAssignment.run("Database Assignment", "Database Systems", "2026-04-25", "Unit 3 ER Diagrams Quiz");
  insertAssignment.run("Agile Methodology Report", "Software Engineering", "2026-04-28", "Group report on SCRUM");
}

async function startServer() {
  const app = express();
  app.use(cors());
  app.use(express.json());

  // API Routes
  app.post("/api/login", (req, res) => {
    const { id, password, role } = req.body;
    const cleanId = id?.toString().trim();
    
    const user = db.prepare("SELECT * FROM users WHERE id = ? AND role = ?").get(cleanId, role) as any;
    
    if (user && user.password === password) {
      res.json({ success: true, user: { id: user.id, name: user.name, role: user.role } });
    } else {
      // For now, allow any input as requested by user
      res.json({ 
        success: true, 
        user: { 
          id: cleanId || "DEMO_ID", 
          name: cleanId || (role === 'student' ? "Meghana" : "Senior Professor"), 
          role: role 
        } 
      });
    }
  });

  app.post("/api/register-student", (req, res) => {
    const { id, name, password } = req.body;
    try {
      db.prepare("INSERT INTO users (id, name, role, password) VALUES (?, ?, 'student', ?)").run(id, name, password);
      res.json({ success: true });
    } catch (err: any) {
      res.status(400).json({ success: false, message: "Student ID already exists" });
    }
  });

  app.get("/api/students", (req, res) => {
    const students = db.prepare("SELECT id, name FROM users WHERE role = 'student'").all();
    res.json(students);
  });

  app.get("/api/student-data/:id", (req, res) => {
    const { id } = req.params;
    let attendance = db.prepare("SELECT * FROM attendance WHERE student_id = ?").all(id);
    let marks = db.prepare("SELECT * FROM marks WHERE student_id = ?").all(id);
    let timetable = db.prepare("SELECT * FROM timetable WHERE student_id = ?").all(id);
    const assignments = db.prepare("SELECT * FROM assignments").all();

    // Fallback for Demo session if user doesn't have data
    if (timetable.length === 0) {
      timetable = [
        { subject: 'Software Engineering', room: 'Room 402', time: '10:30 AM' },
        { subject: 'Database Systems', room: 'Lab 2', time: '01:30 PM' },
        { subject: 'Computer Networks', room: 'Room 305', time: '03:45 PM' }
      ];
    }
    if (marks.length === 0) {
      marks = [
        { subject: 'Data Structures', score: 85, total: 100 },
        { subject: 'Algorithm Design', score: 78, total: 100 }
      ];
    }
    if (attendance.length === 0) {
      attendance = [{ status: 'Present', date: new Date().toISOString().split('T')[0] }];
    }

    res.json({ attendance, marks, timetable, assignments });
  });

  app.post("/api/feedback", (req, res) => {
    const { studentId, subject, time, type, comment } = req.body;
    db.prepare("INSERT INTO feedback (student_id, subject, time, type, comment) VALUES (?, ?, ?, ?, ?)").run(studentId, subject, time, type, comment);
    res.json({ success: true });
  });

  app.get("/api/teacher/feedback", (req, res) => {
    const feedbacks = db.prepare("SELECT * FROM feedback ORDER BY created_at DESC").all();
    res.json(feedbacks);
  });

  app.post("/api/assignments", (req, res) => {
    const { title, subject, due_date, description } = req.body;
    db.prepare("INSERT INTO assignments (title, subject, due_date, description) VALUES (?, ?, ?, ?)").run(title, subject, due_date, description);
    res.json({ success: true });
  });

  app.post("/api/complaints", (req, res) => {
    const { userId, title, description, type, date } = req.body;
    db.prepare("INSERT INTO complaints (user_id, title, description, type, date) VALUES (?, ?, ?, ?, ?)").run(userId, title, description, type, date);
    res.json({ success: true });
  });

  app.get("/api/complaints", (req, res) => {
    const complaints = db.prepare("SELECT * FROM complaints ORDER BY id DESC").all();
    res.json(complaints);
  });

  app.post("/api/attendance", (req, res) => {
    const { studentId, subject, date, status } = req.body;
    db.prepare("INSERT INTO attendance (student_id, subject, date, status) VALUES (?, ?, ?, ?)").run(studentId, subject, date, status);
    res.json({ success: true });
  });

  app.post("/api/marks", (req, res) => {
    const { studentId, subject, score, total } = req.body;
    db.prepare("INSERT INTO marks (student_id, subject, score, total) VALUES (?, ?, ?, ?)").run(studentId, subject, score, total);
    res.json({ success: true });
  });

  // Vite Middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  const PORT = 3000;
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

startServer();
