import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import mysql from "mysql2";
import dotenv from "dotenv";
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// ---------------- MYSQL CONNECTION ----------------
const db = mysql.createPool(process.env.MYSQL_URL as string);
const dbPromise = db.promise();
const getTodayName = () =>
  new Date().toLocaleDateString("en-US", { weekday: "long" });

async function ensureSchema() {
  await dbPromise.query(`
    CREATE TABLE IF NOT EXISTS users (
      id VARCHAR(50) PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      role VARCHAR(20) NOT NULL,
      password VARCHAR(255) NOT NULL
    )
  `);

  await dbPromise.query(`
    CREATE TABLE IF NOT EXISTS marks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id VARCHAR(50) NOT NULL,
      subject VARCHAR(100) NOT NULL,
      score INT NOT NULL,
      total INT NOT NULL
    )
  `);

  await dbPromise.query(`
    CREATE TABLE IF NOT EXISTS attendance (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id VARCHAR(50) NOT NULL,
      subject VARCHAR(100) NOT NULL,
      date DATE NOT NULL,
      status VARCHAR(20) NOT NULL
    )
  `);

  await dbPromise.query(`
    CREATE TABLE IF NOT EXISTS timetable (
      id INT AUTO_INCREMENT PRIMARY KEY,
      day VARCHAR(20) NOT NULL,
      student_id VARCHAR(50) NOT NULL,
      subject VARCHAR(100) NOT NULL,
      time VARCHAR(50) NOT NULL,
      room VARCHAR(100) NOT NULL
    )
  `);

  await dbPromise.query(`
    CREATE TABLE IF NOT EXISTS complaints (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id VARCHAR(50) NOT NULL,
      title VARCHAR(255) NOT NULL,
      description TEXT NOT NULL,
      type VARCHAR(20) NOT NULL,
      date DATE NOT NULL,
      status VARCHAR(20) DEFAULT 'Open'
    )
  `);

  await dbPromise.query(`
    CREATE TABLE IF NOT EXISTS assignments (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      subject VARCHAR(100) NOT NULL,
      due_date DATE NOT NULL,
      description TEXT,
      status VARCHAR(30) DEFAULT 'Pending'
    )
  `);

  await dbPromise.query(`
    CREATE TABLE IF NOT EXISTS feedback (
      id INT AUTO_INCREMENT PRIMARY KEY,
      student_id VARCHAR(50) NOT NULL,
      subject VARCHAR(100) NOT NULL,
      time VARCHAR(50) NOT NULL,
      type VARCHAR(30) NOT NULL,
      comment TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

async function seedDemoData() {
  try {
    const [existingUsers] = await dbPromise.query(
      "SELECT id FROM users WHERE id IN ('24321A0563', '24321A0522', '24321A0524', 'T123') LIMIT 1"
    );
    if (Array.isArray(existingUsers) && existingUsers.length > 0) {
      console.log("ℹ️ Demo data already present");
      return;
    }

    await dbPromise.query(`
      INSERT INTO users (id, name, role, password)
      VALUES 
      ('24321A0563', 'Meghana', 'student', '123'),
      ('24321A0522', 'Bhuvana', 'student', '123'),
      ('24321A0524', 'Chandana', 'student', '123'),
      ('T123', 'Arshad Hussain', 'teacher', '123')
    `);

    await dbPromise.query(`
      INSERT INTO marks (student_id, subject, score, total)
      VALUES
      ('24321A0563','OS',98,100),
      ('24321A0563','DBMS',80,100),
      ('24321A0563','DSA',85,100),
      ('24321A0522','OS',98,100),
      ('24321A0522','DBMS',97,100),
      ('24321A0522','DSA',95,100),
      ('24321A0524','OS',98,100),
      ('24321A0524','DBMS',99,100),
      ('24321A0524','DSA',95,100)
    `);

    await dbPromise.query(`
      INSERT INTO attendance (student_id, subject, date, status)
      VALUES
      ('24321A0563','OS','2026-04-17','Present'),
      ('24321A0563','DBMS','2026-04-18','Present'),
      ('24321A0563','DSA','2026-04-19','Present'),
      ('24321A0522','OS','2026-04-17','Present'),
      ('24321A0522','DBMS','2026-04-18','Present'),
      ('24321A0522','DSA','2026-04-19','Present'),
      ('24321A0524','OS','2026-04-17','Present'),
      ('24321A0524','DBMS','2026-04-18','Present'),
      ('24321A0524','DSA','2026-04-19','Present')
    `);

    await dbPromise.query(`
      INSERT INTO timetable (day, student_id, subject, time, room)
      VALUES
      ('Monday','24321A0563','DBMS','10:30 AM','Room 402'),
      ('Tuesday','24321A0563','DSA','01:30 PM','Lab 2'),
      ('Wednesday','24321A0563','DBMS','10:30 AM','Room 402'),
      ('Thursday','24321A0563','DSA','01:30 PM','Lab 2'),
      ('Friday','24321A0563','OS','09:30 AM','Room 305'),
      ('Saturday','24321A0563','ECA/Student Clubs','09:30 AM','Seminar Hall'),
      ('Monday','24321A0522','DBMS','10:30 AM','Room 402'),
      ('Tuesday','24321A0522','DSA','01:30 PM','Lab 2'),
      ('Wednesday','24321A0522','DBMS','10:30 AM','Room 402'),
      ('Thursday','24321A0522','DSA','01:30 PM','Lab 2'),
      ('Friday','24321A0522','OS','09:30 AM','Room 305'),
      ('Saturday','24321A0522','ECA/Student Clubs','09:30 AM','Seminar Hall'),
      ('Monday','24321A0524','DBMS','10:30 AM','Room 402'),
      ('Tuesday','24321A0524','DSA','01:30 PM','Lab 2'),
      ('Wednesday','24321A0524','DBMS','10:30 AM','Room 402'),
      ('Thursday','24321A0524','DSA','01:30 PM','Lab 2'),
      ('Friday','24321A0524','OS','09:30 AM','Room 305'),
      ('Saturday','24321A0524','ECA/Student Clubs','09:30 AM','Seminar Hall')
    `);

    await dbPromise.query(`
      INSERT INTO complaints (user_id, title, description, type, date)
      VALUES
      ('24321A0563','WiFi Issue','Internet not working in class','complaint','2026-04-18'),
      ('24321A0522','Lab Request','Need extra lab session','request','2026-04-19')
    `);

    await dbPromise.query(`
      INSERT INTO assignments (title, subject, due_date, description)
      VALUES
      ('DBMS Project', 'DBMS', '2026-04-25', 'ER diagram + SQL queries'),
      ('DSA Assignment', 'DSA', '2026-04-28', 'Sorting algorithms')
    `);

    console.log("✅ Demo data seeded");
  } catch (error) {
    console.log("⚠️ Demo seed skipped:", error);
  }
}

// test DB connection (safe for pool)
db.query("SELECT 1", (err) => {
  if (err) {
    console.log("❌ MySQL connection failed:", err);
  } else {
    console.log("✅ MySQL connected");
    void ensureSchema().then(seedDemoData).catch((schemaErr) => {
      console.log("❌ Schema setup failed:", schemaErr);
    });
  }
});

// ---------------- LOGIN ----------------
app.post("/api/login", (req, res) => {
  const { id, password, role } = req.body;

  db.query(
    "SELECT * FROM users WHERE id = ? AND role = ?",
    [id, role],
    (err, results: any) => {
      if (err) return res.json({ success: false, error: err });

      const user = results[0];

      if (user && user.password === password) {
        res.json({
          success: true,
          user: {
            id: user.id,
            name: user.name,
            role: user.role,
            department: "Computer Science & Engineering",
            section: user.role === "student" ? "II B.Tech II Sem CSE - A" : "Faculty",
            email:
              user.role === "student"
                ? `${user.id.toLowerCase()}@university.edu`
                : `${user.id.toLowerCase()}@college.edu`,
          },
        });
      } else {
        res.json({ success: false, message: "Invalid credentials" });
      }
    }
  );
});

// ---------------- REGISTER STUDENT ----------------
app.post("/api/register-student", (req, res) => {
  const { id, name, password } = req.body;

  db.query(
    "INSERT INTO users (id, name, role, password) VALUES (?, ?, 'student', ?)",
    [id, name, password],
    (err) => {
      if (err) {
        return res.status(400).json({
          success: false,
          message: "Student ID already exists",
        });
      }
      res.json({ success: true });
    }
  );
});

// ---------------- STUDENTS LIST ----------------
app.get("/api/students", (req, res) => {
  db.query(
    "SELECT id, name FROM users WHERE role = 'student'",
    (err, results) => {
      res.json(results);
    }
  );
});

// ---------------- STUDENT DATA ----------------
app.get("/api/student-data/:id", (req, res) => {
  const { id } = req.params;
  const role = String(req.query.role || "student");
  const today = getTodayName();

  if (role === "teacher") {
    db.query(
      "SELECT day, subject, time, room, student_id FROM timetable WHERE day = ? ORDER BY time ASC",
      [today],
      (err, timetable: any) => {
        if (err) return res.status(500).json({ success: false, message: "Failed timetable query" });
        db.query(
          "SELECT * FROM assignments ORDER BY due_date ASC",
          (err2, assignments: any) => {
            if (err2) return res.status(500).json({ success: false, message: "Failed assignments query" });
            db.query(
              "SELECT id, name FROM users WHERE role = 'student' ORDER BY name ASC",
              (err3, students: any) => {
                if (err3) return res.status(500).json({ success: false, message: "Failed students query" });
                res.json({
                  attendance: [],
                  marks: [],
                  timetable,
                  todaySchedule: timetable,
                  assignments,
                  today,
                  students,
                });
              }
            );
          }
        );
      }
    );
    return;
  }

  db.query("SELECT * FROM attendance WHERE student_id = ?", [id], (err, attendance: any) => {
    if (err) return res.status(500).json({ success: false, message: "Failed attendance query" });
    db.query("SELECT * FROM marks WHERE student_id = ?", [id], (err2, marks: any) => {
      if (err2) return res.status(500).json({ success: false, message: "Failed marks query" });
      db.query("SELECT * FROM timetable WHERE student_id = ?", [id], (err3, timetable: any) => {
        if (err3) return res.status(500).json({ success: false, message: "Failed timetable query" });
        db.query("SELECT * FROM assignments ORDER BY due_date ASC", (err4, assignments: any) => {
          if (err4) return res.status(500).json({ success: false, message: "Failed assignments query" });
          const todaySchedule = timetable.filter((item: any) => item.day === today);
          const presentCount = attendance.filter((a: any) => a.status === "Present").length;
          const attendancePct = attendance.length ? Math.round((presentCount / attendance.length) * 100) : 0;
          const avgMarks = marks.length
            ? Math.round(
                (marks.reduce((sum: number, item: any) => sum + Number(item.score || 0), 0) /
                  marks.reduce((sum: number, item: any) => sum + Number(item.total || 100), 0)) *
                  100
              )
            : 0;
          res.json({
            attendance,
            marks,
            timetable,
            todaySchedule,
            assignments,
            today,
            stats: {
              attendancePct,
              avgMarks,
            },
          });
        });
      });
    });
  });
});

// ---------------- FEEDBACK ----------------
app.post("/api/feedback", (req, res) => {
  const { studentId, subject, time, type, comment } = req.body;

  db.query(
    "INSERT INTO feedback (student_id, subject, time, type, comment) VALUES (?, ?, ?, ?, ?)",
    [studentId, subject, time, type, comment],
    () => {
      res.json({ success: true });
    }
  );
});

// ---------------- TEACHER FEEDBACK ----------------
app.get("/api/teacher/feedback", (req, res) => {
  db.query(
    "SELECT * FROM feedback ORDER BY created_at DESC",
    (err, results) => {
      res.json(results);
    }
  );
});

// ---------------- ASSIGNMENTS ----------------
app.post("/api/assignments", (req, res) => {
  const { title, subject, due_date, description } = req.body;

  db.query(
    "INSERT INTO assignments (title, subject, due_date, description) VALUES (?, ?, ?, ?)",
    [title, subject, due_date, description],
    () => {
      res.json({ success: true });
    }
  );
});

app.get("/api/assignments", (req, res) => {
  db.query("SELECT * FROM assignments ORDER BY due_date ASC", (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Failed to fetch assignments" });
    res.json(results);
  });
});

// ---------------- COMPLAINTS ----------------
app.post("/api/complaints", (req, res) => {
  const { userId, title, description, type, date } = req.body;

  db.query(
    "INSERT INTO complaints (user_id, title, description, type, date) VALUES (?, ?, ?, ?, ?)",
    [userId, title, description, type, date],
    () => {
      res.json({ success: true });
    }
  );
});

app.get("/api/complaints", (req, res) => {
  db.query(
    "SELECT * FROM complaints ORDER BY id DESC",
    (err, results) => {
      res.json(results);
    }
  );
});

// ---------------- ATTENDANCE ----------------
app.post("/api/attendance", (req, res) => {
  const { studentId, subject, date, status } = req.body;

  db.query(
    "INSERT INTO attendance (student_id, subject, date, status) VALUES (?, ?, ?, ?)",
    [studentId, subject, date, status],
    () => {
      res.json({ success: true });
    }
  );
});

// ---------------- MARKS ----------------
app.post("/api/marks", (req, res) => {
  const { studentId, subject, score, total } = req.body;

  db.query(
    "INSERT INTO marks (student_id, subject, score, total) VALUES (?, ?, ?, ?)",
    [studentId, subject, score, total],
    () => {
      res.json({ success: true });
    }
  );
});

// ---------------- VITE ----------------


// ---------------- START ----------------
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});