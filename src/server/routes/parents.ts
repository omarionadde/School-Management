import { Router } from 'express';
import db from '../../db/init';
import bcrypt from 'bcryptjs';

const router = Router();

// Get all parents
router.get('/', (req, res) => {
  const parents = db.prepare(`
    SELECT u.id, u.name, u.email, u.created_at,
           (SELECT COUNT(*) FROM students s WHERE s.parent_user_id = u.id) as student_count
    FROM users u
    WHERE u.role = 'parent'
    ORDER BY u.name ASC
  `).all();
  res.json(parents);
});

// Create a parent user
router.post('/', (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = bcrypt.hashSync(password || 'parent123', 10);
    const result = db.prepare(`
      INSERT INTO users (name, email, password, role)
      VALUES (?, ?, ?, 'parent')
    `).run(name, email, hashedPassword);
    
    res.status(201).json({ id: result.lastInsertRowid, message: 'Parent account created' });
  } catch (error: any) {
    if (error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
      return res.status(400).json({ error: 'Email already exists' });
    }
    res.status(500).json({ error: 'Failed to create parent' });
  }
});

// Link student to parent
router.post('/link', (req, res) => {
  const { parent_id, student_id } = req.body;
  try {
    db.prepare('UPDATE students SET parent_user_id = ? WHERE id = ?').run(parent_id, student_id);
    res.json({ message: 'Student linked to parent successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to link student' });
  }
});

// Get students for a parent
router.get('/:id/students', (req, res) => {
  const { id } = req.params;
  const students = db.prepare(`
    SELECT s.*, u.name as student_name, c.name as class_name
    FROM students s
    JOIN users u ON s.user_id = u.id
    LEFT JOIN classes c ON s.class_id = c.id
    WHERE s.parent_user_id = ?
  `).all(id);
  res.json(students);
});

export default router;
