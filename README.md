# 🎓 Smart Academic Dashboard

A complete full-stack academic management system built for a high-impact college project demo.

## 🚀 Features
- **Role-Based Auth**: Secure login for Students and Teachers.
- **Student Portal**: View personal results, profile summary, and daily timetable.
- **Teacher Hub**: Manage student records, record attendance, and post marks.
- **Modern UI**: Clean, card-based layout with smooth transitions and responsive design.
- **SQLite Database**: Persistent data storage using a lightweight file-based database.

## 🛠️ Technology Stack
- **Frontend**: React 19, Vite, Tailwind CSS 4, Framer Motion
- **Backend**: Node.js, Express 5
- **Database**: SQLite (built-in for demo), MySQL (ready to integrate)

## 📡 MySQL Integration Guide
To switch from SQLite to MySQL on GitHub or your own server:
1. **Install MySQL driver**: `npm install mysql2`.
2. **Update Database connection**: In `server.ts`, replace the `better-sqlite3` import and initialization with:
   ```ts
   import mysql from 'mysql2';
   const pool = mysql.createPool({
     host: process.env.DB_HOST,
     user: process.env.DB_USER,
     password: process.env.DB_PASSWORD,
     database: process.env.DB_NAME
   }).promise();
   ```
3. **Update Queries**: Change `db.prepare(...).all()` to `await pool.query(...)`.
4. **Env Variables**: Add your database credentials to the environment (or a `.env` file).

## 📁 Sections Built (Matching Images)
- **Login v2.0**: Themed login with role selection and input flexibility.
- **Main Dashboard**: Integrated Sidebar, Daily Schedule, and Stats Cards.
- **Classroom Feedback**: Real-time understanding tracking and summary charts for teachers.
- **Assignment Tracker**: Status-based assignment cards and post-assignment form.
- **Complaint & Request Box**: Dual-form system for submitting issues or leave requests.

## 📝 Demo Instructions (Viva-Ready)
1. **Login**: 
   - Click the **Student** or **Teacher** tab.
   - Enter **any ID** (e.g., `S101` or your name) and tap Login.
   - The system is configured to allow demo access with any credentials for this session.
