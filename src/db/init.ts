import Database from 'better-sqlite3';
import path from 'path';
import bcrypt from 'bcryptjs';

const dbPath = path.resolve('school.db');
const db = new Database(dbPath);

export function initializeDatabase() {
  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Users Table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT CHECK(role IN ('admin', 'teacher', 'student', 'parent', 'accountant')) NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Academic Years
  db.exec(`
    CREATE TABLE IF NOT EXISTS academic_years (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      is_active BOOLEAN DEFAULT 0
    )
  `);

  // Classes
  db.exec(`
    CREATE TABLE IF NOT EXISTS classes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL
    )
  `);

  // Sections
  db.exec(`
    CREATE TABLE IF NOT EXISTS sections (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      class_id INTEGER NOT NULL,
      FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE
    )
  `);

  // Students Profile
  db.exec(`
    CREATE TABLE IF NOT EXISTS students (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      admission_no TEXT UNIQUE NOT NULL,
      class_id INTEGER,
      section_id INTEGER,
      dob DATE,
      gender TEXT,
      address TEXT,
      parent_name TEXT,
      parent_contact TEXT,
      parent_user_id INTEGER,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
      FOREIGN KEY (parent_user_id) REFERENCES users(id) ON DELETE SET NULL,
      FOREIGN KEY (class_id) REFERENCES classes(id),
      FOREIGN KEY (section_id) REFERENCES sections(id)
    )
  `);

  // Migration: Add parent_user_id to students if not exists
  try {
    db.prepare('ALTER TABLE students ADD COLUMN parent_user_id INTEGER REFERENCES users(id) ON DELETE SET NULL').run();
  } catch (error) {
    // Column likely exists
  }

  // Teachers Profile
  db.exec(`
    CREATE TABLE IF NOT EXISTS teachers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER UNIQUE NOT NULL,
      qualification TEXT,
      specialization TEXT,
      joining_date DATE,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Attendance
  db.exec(`
    CREATE TABLE IF NOT EXISTS attendance (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      date DATE NOT NULL,
      status TEXT CHECK(status IN ('present', 'absent', 'late')) NOT NULL,
      recorded_by INTEGER,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
      FOREIGN KEY (recorded_by) REFERENCES users(id)
    )
  `);

  // Fees
  db.exec(`
    CREATE TABLE IF NOT EXISTS fees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      student_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      due_date DATE NOT NULL,
      status TEXT CHECK(status IN ('paid', 'pending', 'partial')) DEFAULT 'pending',
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    )
  `);

  // Exams
  db.exec(`
    CREATE TABLE IF NOT EXISTS exams (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      type TEXT CHECK(type IN ('midterm', 'final', 'quiz')) NOT NULL,
      date DATE NOT NULL,
      class_id INTEGER NOT NULL,
      subject TEXT NOT NULL,
      FOREIGN KEY (class_id) REFERENCES classes(id)
    )
  `);

  // Exam Results
  db.exec(`
    CREATE TABLE IF NOT EXISTS exam_results (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      exam_id INTEGER NOT NULL,
      student_id INTEGER NOT NULL,
      marks_obtained DECIMAL(5, 2) NOT NULL,
      total_marks DECIMAL(5, 2) NOT NULL,
      grade TEXT,
      FOREIGN KEY (exam_id) REFERENCES exams(id) ON DELETE CASCADE,
      FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE
    )
  `);

  // Announcements
  db.exec(`
    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      date DATETIME DEFAULT CURRENT_TIMESTAMP,
      posted_by INTEGER,
      FOREIGN KEY (posted_by) REFERENCES users(id)
    )
  `);

  // School Settings (Branding)
  db.exec(`
    CREATE TABLE IF NOT EXISTS school_settings (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      school_name TEXT DEFAULT 'EduManage School',
      school_address TEXT,
      school_phone TEXT,
      school_email TEXT,
      school_logo TEXT,
      current_session_id INTEGER,
      FOREIGN KEY (current_session_id) REFERENCES academic_years(id)
    )
  `);

  // Initialize default settings if not exists
  db.prepare(`INSERT OR IGNORE INTO school_settings (id, school_name) VALUES (1, 'EduManage School')`).run();

  // Holidays
  db.exec(`
    CREATE TABLE IF NOT EXISTS holidays (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      start_date DATE NOT NULL,
      end_date DATE NOT NULL,
      description TEXT
    )
  `);

  // Expenses
  db.exec(`
    CREATE TABLE IF NOT EXISTS expenses (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      amount DECIMAL(10, 2) NOT NULL,
      category TEXT NOT NULL,
      date DATE NOT NULL,
      description TEXT,
      recorded_by INTEGER,
      FOREIGN KEY (recorded_by) REFERENCES users(id)
    )
  `);

  // Notifications
  db.exec(`
    CREATE TABLE IF NOT EXISTS notifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      title TEXT NOT NULL,
      message TEXT NOT NULL,
      type TEXT CHECK(type IN ('info', 'warning', 'success', 'error')) DEFAULT 'info',
      is_read BOOLEAN DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Seed Admin User if not exists
  const adminExists = db.prepare('SELECT id FROM users WHERE role = ?').get('admin');
  if (!adminExists) {
    const hashedPassword = bcrypt.hashSync('admin123', 10);
    db.prepare(`
      INSERT INTO users (name, email, password, role)
      VALUES (?, ?, ?, ?)
    `).run('System Admin', 'admin@school.com', hashedPassword, 'admin');
    console.log('Admin user seeded: admin@school.com / admin123');
  }

  // Seed some initial data for demo
  const classExists = db.prepare('SELECT id FROM classes').get();
  if (!classExists) {
    db.prepare("INSERT INTO classes (name) VALUES ('Class 1')").run();
    db.prepare("INSERT INTO classes (name) VALUES ('Class 2')").run();
    db.prepare("INSERT INTO classes (name) VALUES ('Class 3')").run();
    
    const class1 = db.prepare("SELECT id FROM classes WHERE name = 'Class 1'").get() as {id: number};
    db.prepare("INSERT INTO sections (name, class_id) VALUES ('A', ?)").run(class1.id);
    db.prepare("INSERT INTO sections (name, class_id) VALUES ('B', ?)").run(class1.id);
  }
}

export default db;
