import { Router } from 'express';
import db from '../../db/init';
import bcrypt from 'bcryptjs';

const router = Router();

// Get all students
router.get('/', (req, res) => {
  const students = db.prepare(`
    SELECT s.*, u.name, u.email, c.name as class_name, sec.name as section_name 
    FROM students s
    JOIN users u ON s.user_id = u.id
    LEFT JOIN classes c ON s.class_id = c.id
    LEFT JOIN sections sec ON s.section_id = sec.id
    ORDER BY u.name ASC
  `).all();
  res.json(students);
});

// Add a student
router.post('/', (req, res) => {
  const { name, email, password, admission_no, class_id, section_id, dob, parent_name, parent_contact, address } = req.body;

  const createUser = db.transaction(() => {
    const hashedPassword = bcrypt.hashSync(password || 'student123', 10);
    const result = db.prepare(`
      INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'student')
    `).run(name, email, hashedPassword);
    
    const userId = result.lastInsertRowid;

    db.prepare(`
      INSERT INTO students (user_id, admission_no, class_id, section_id, dob, parent_name, parent_contact, address)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(userId, admission_no, class_id, section_id, dob, parent_name, parent_contact, address);
    
    return userId;
  });

  try {
    createUser();
    res.status(201).json({ message: 'Student created successfully' });
  } catch (error: any) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create student. Email or Admission No might be duplicate.' });
  }
});

// Get student details (attendance, results, fees)
router.get('/:id/details', (req, res) => {
  const { id } = req.params;
  
  const attendance = db.prepare('SELECT * FROM attendance WHERE student_id = ? ORDER BY date DESC').all(id);
  
  const results = db.prepare(`
    SELECT r.*, e.name as exam_name, e.subject 
    FROM exam_results r 
    JOIN exams e ON r.exam_id = e.id 
    WHERE r.student_id = ?
    ORDER BY e.date DESC
  `).all(id);
  
  const fees = db.prepare('SELECT * FROM fees WHERE student_id = ? ORDER BY due_date DESC').all(id);

  res.json({ attendance, results, fees });
});

// Delete student
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  // This will cascade delete from students table due to foreign key
  db.prepare('DELETE FROM users WHERE id = (SELECT user_id FROM students WHERE id = ?)').run(id);
  res.json({ message: 'Student deleted' });
});

export default router;
