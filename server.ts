import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { supabase } from "./lib/db.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const app = express();
app.use(cors());
app.use(express.json());

const getTodayName = () =>
  new Date().toLocaleDateString("en-US", { weekday: "long" });

// ---------------- LOGIN ----------------
app.post("/api/login", async (req, res) => {
  const id = String(req.body?.id ?? "").trim();
  const role = String(req.body?.role ?? "student").trim().toLowerCase();
  const password = String(req.body?.password ?? "").trim();

  if (!id) return res.json({ success: false, message: "Please enter ID" });

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .ilike("id", id)
    .single();

  if (error || !user)
    return res.status(401).json({ success: false, message: "User not found." });

  if (String(user.role).toLowerCase() !== role)
    return res.status(401).json({ success: false, message: "Role mismatch." });

  if (String(user.password) !== password)
    return res.status(401).json({ success: false, message: "Invalid password." });

  return res.json({
    success: true,
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
      department: "Computer Science & Engineering",
      section: user.role === "student" ? "II B.Tech II Sem CSE - A" : "Faculty",
      email:
        user.role === "student"
          ? `${String(user.id).toLowerCase()}@university.edu`
          : `${String(user.id).toLowerCase()}@college.edu`,
    },
  });
});

// ---------------- REGISTER STUDENT ----------------
app.post("/api/register-student", async (req, res) => {
  const { id, name, password } = req.body;
  const { error } = await supabase
    .from("users")
    .insert([{ id, name, role: "student", password }]);

  if (error)
    return res.status(400).json({ success: false, message: "Student ID may already exist." });

  res.json({ success: true });
});

// ---------------- STUDENTS LIST ----------------
app.get("/api/students", async (_req, res) => {
  const { data, error } = await supabase
    .from("users")
    .select("id, name")
    .eq("role", "student");

  if (error)
    return res.status(500).json({ success: false, message: "Failed to fetch students." });

  res.json(data);
});

// ---------------- STUDENT DATA ----------------
app.get("/api/student-data/:id", async (req, res) => {
  const { id } = req.params;
  const role = String(req.query.role || "student");
  const today = getTodayName();

  try {
    if (role === "teacher") {
      const [{ data: timetable }, { data: assignments }, { data: students }] =
        await Promise.all([
          supabase.from("timetable").select("*").eq("day", today),
          supabase.from("assignments").select("*").order("due_date"),
          supabase.from("users").select("id, name").eq("role", "student").order("name"),
        ]);

      return res.json({
        attendance: [],
        marks: [],
        timetable: timetable ?? [],
        todaySchedule: timetable ?? [],
        assignments: assignments ?? [],
        today,
        students: students ?? [],
      });
    }

    const [
      { data: attendance },
      { data: marks },
      { data: timetable },
      { data: assignments },
    ] = await Promise.all([
      supabase.from("attendance").select("*").eq("student_id", id),
      supabase.from("marks").select("*").eq("student_id", id),
      supabase.from("timetable").select("*").eq("student_id", id),
      supabase.from("assignments").select("*").order("due_date"),
    ]);

    const att = attendance ?? [];
    const mrk = marks ?? [];
    const tt = timetable ?? [];
    const todaySchedule = tt.filter((item: any) => item.day === today);
    const presentCount = att.filter((a: any) => a.status === "Present").length;
    const attendancePct = att.length
      ? Math.round((presentCount / att.length) * 100)
      : 0;
    const avgMarks = mrk.length
      ? Math.round(
          (mrk.reduce((s: number, i: any) => s + Number(i.score), 0) /
            mrk.reduce((s: number, i: any) => s + Number(i.total || 100), 0)) *
            100
        )
      : 0;

    res.json({
      attendance: att,
      marks: mrk,
      timetable: tt,
      todaySchedule,
      assignments: assignments ?? [],
      today,
      stats: { attendancePct, avgMarks },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch data." });
  }
});

// ---------------- FEEDBACK ----------------
app.post("/api/feedback", async (req, res) => {
  const { studentId, subject, time, type, comment } = req.body;
  const { error } = await supabase
    .from("feedback")
    .insert([{ student_id: studentId, subject, time, type, comment }]);

  if (error)
    return res.status(500).json({ success: false, message: "Failed to save feedback." });

  res.json({ success: true });
});

app.get("/api/teacher/feedback", async (_req, res) => {
  const { data, error } = await supabase
    .from("feedback")
    .select("*")
    .order("created_at", { ascending: false });

  if (error)
    return res.status(500).json({ success: false, message: "Failed to fetch feedback." });

  res.json(data);
});

// ---------------- ASSIGNMENTS ----------------
app.post("/api/assignments", async (req, res) => {
  const { title, subject, due_date, description } = req.body;
  const { error } = await supabase
    .from("assignments")
    .insert([{ title, subject, due_date, description }]);

  if (error)
    return res.status(500).json({ success: false, message: "Failed to create assignment." });

  res.json({ success: true });
});

app.get("/api/assignments", async (_req, res) => {
  const { data, error } = await supabase
    .from("assignments")
    .select("*")
    .order("due_date");

  if (error)
    return res.status(500).json({ success: false, message: "Failed to fetch assignments." });

  res.json(data);
});

// ---------------- COMPLAINTS ----------------
app.post("/api/complaints", async (req, res) => {
  const { userId, title, description, type, date } = req.body;
  const { error } = await supabase
    .from("complaints")
    .insert([{ user_id: userId, title, description, type, date }]);

  if (error)
    return res.status(500).json({ success: false, message: "Failed to submit complaint." });

  res.json({ success: true });
});

app.get("/api/complaints", async (_req, res) => {
  const { data, error } = await supabase
    .from("complaints")
    .select("*")
    .order("id", { ascending: false });

  if (error)
    return res.status(500).json({ success: false, message: "Failed to fetch complaints." });

  res.json(data);
});

// ---------------- ATTENDANCE ----------------
app.post("/api/attendance", async (req, res) => {
  const { studentId, subject, date, status } = req.body;
  const { error } = await supabase
    .from("attendance")
    .insert([{ student_id: studentId, subject, date, status }]);

  if (error)
    return res.status(500).json({ success: false, message: "Failed to save attendance." });

  res.json({ success: true });
});

// ---------------- MARKS ----------------
app.post("/api/marks", async (req, res) => {
  const { studentId, subject, score, total } = req.body;
  const { error } = await supabase
    .from("marks")
    .insert([{ student_id: studentId, subject, score, total }]);

  if (error)
    return res.status(500).json({ success: false, message: "Failed to save marks." });

  res.json({ success: true });
});

// ---------------- HEALTH ----------------
app.get("/api/health", async (_req, res) => {
  const { error } = await supabase.from("users").select("id").limit(1);
  if (error)
    return res.status(503).json({ success: false, status: "degraded" });

  res.json({ success: true, status: "ok" });
});

// ---------------- START ----------------
const PORT = process.env.PORT || 3000;
const isDirectRun =
  process.argv[1] && path.resolve(process.argv[1]) === __filename;

if (isDirectRun) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`);
  });
}

export default app;