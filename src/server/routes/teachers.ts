import { Router } from 'express';
import db from '../../db/init';
import bcrypt from 'bcryptjs';

const router = Router();

// Get all teachers
router.get('/', (req, res) => {
  const teachers = db.prepare(`
    SELECT t.*, u.name, u.email 
    FROM teachers t
    JOIN users u ON t.user_id = u.id
    ORDER BY u.name ASC
  `).all();
  res.json(teachers);
});

// Add a teacher
router.post('/', (req, res) => {
  const { name, email, password, qualification, specialization, joining_date } = req.body;

  const createTeacher = db.transaction(() => {
    const hashedPassword = bcrypt.hashSync(password || 'teacher123', 10);
    const result = db.prepare(`
      INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'teacher')
    `).run(name, email, hashedPassword);
    
    const userId = result.lastInsertRowid;

    db.prepare(`
      INSERT INTO teachers (user_id, qualification, specialization, joining_date)
      VALUES (?, ?, ?, ?)
    `).run(userId, qualification, specialization, joining_date);
    
    return userId;
  });

  try {
    createTeacher();
    res.status(201).json({ message: 'Teacher created successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create teacher' });
  }
});

export default router;
