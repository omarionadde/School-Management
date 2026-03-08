import { Router } from 'express';
import db from '../../db/init';

const router = Router();

router.get('/', (req, res) => {
  const fees = db.prepare(`
    SELECT f.*, u.name as student_name, s.admission_no
    FROM fees f
    JOIN students s ON f.student_id = s.id
    JOIN users u ON s.user_id = u.id
    ORDER BY f.due_date DESC
  `).all();
  res.json(fees);
});

router.post('/', (req, res) => {
  const { student_id, title, amount, due_date } = req.body;
  try {
    db.prepare(`
      INSERT INTO fees (student_id, title, amount, due_date)
      VALUES (?, ?, ?, ?)
    `).run(student_id, title, amount, due_date);
    res.status(201).json({ message: 'Fee record created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create fee record' });
  }
});

router.patch('/:id/pay', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare("UPDATE fees SET status = 'paid' WHERE id = ?").run(id);
    res.json({ message: 'Fee marked as paid' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update fee status' });
  }
});

export default router;
