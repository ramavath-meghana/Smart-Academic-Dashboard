import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import mysql from "mysql2";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json());

// ---------------- MYSQL CONNECTION ----------------
if (!process.env.MYSQL_PUBLIC_URL) {
  throw new Error("MYSQL_PUBLIC_URL environment variable is not set");
}
const db = mysql.createConnection(process.env.MYSQL_PUBLIC_URL);

db.connect((err) => {
  if (err) {
    console.log("❌ MySQL connection failed:", err);
  } else {
    console.log("✅ MySQL connected");
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
          user: { id: user.id, name: user.name, role: user.role },
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

  db.query("SELECT * FROM attendance WHERE student_id = ?", [id], (err, attendance: any) => {
    db.query("SELECT * FROM marks WHERE student_id = ?", [id], (err2, marks: any) => {
      db.query("SELECT * FROM timetable WHERE student_id = ?", [id], (err3, timetable: any) => {
        db.query("SELECT * FROM assignments", (err4, assignments: any) => {
          res.json({
            attendance,
            marks,
            timetable,
            assignments,
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

// ---------------- START ----------------
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});