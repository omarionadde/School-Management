import { Router } from 'express';
import db from '../../db/init';

const router = Router();

// Get all exams
router.get('/', (req, res) => {
  const exams = db.prepare(`
    SELECT e.*, c.name as class_name 
    FROM exams e
    JOIN classes c ON e.class_id = c.id
    ORDER BY e.date DESC
  `).all();
  res.json(exams);
});

// Create Exam
router.post('/', (req, res) => {
  const { name, type, date, class_id, subject } = req.body;
  try {
    db.prepare(`
      INSERT INTO exams (name, type, date, class_id, subject)
      VALUES (?, ?, ?, ?, ?)
    `).run(name, type, date, class_id, subject);
    res.status(201).json({ message: 'Exam created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create exam' });
  }
});

// Get Exam Results
router.get('/:exam_id/results', (req, res) => {
  const { exam_id } = req.params;
  const results = db.prepare(`
    SELECT r.*, s.admission_no, u.name as student_name
    FROM exam_results r
    JOIN students s ON r.student_id = s.id
    JOIN users u ON s.user_id = u.id
    WHERE r.exam_id = ?
  `).all(exam_id);
  res.json(results);
});

// Enter Marks
router.post('/:exam_id/results', (req, res) => {
  const { exam_id } = req.params;
  const { student_id, marks_obtained, total_marks } = req.body;
  
  // Calculate grade
  const percentage = (marks_obtained / total_marks) * 100;
  let grade = 'F';
  if (percentage >= 90) grade = 'A+';
  else if (percentage >= 80) grade = 'A';
  else if (percentage >= 70) grade = 'B';
  else if (percentage >= 60) grade = 'C';
  else if (percentage >= 50) grade = 'D';

  try {
    db.prepare(`
      INSERT INTO exam_results (exam_id, student_id, marks_obtained, total_marks, grade)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET 
        marks_obtained = excluded.marks_obtained,
        grade = excluded.grade
    `).run(exam_id, student_id, marks_obtained, total_marks, grade);
    res.json({ message: 'Marks updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update marks' });
  }
});

export default router;
