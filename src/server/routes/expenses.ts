import { Router } from 'express';
import db from '../../db/init';

const router = Router();

router.get('/', (req, res) => {
  const expenses = db.prepare(`
    SELECT e.*, u.name as recorded_by_name 
    FROM expenses e
    LEFT JOIN users u ON e.recorded_by = u.id
    ORDER BY e.date DESC
  `).all();
  res.json(expenses);
});

router.post('/', (req, res) => {
  const { title, amount, category, date, description, recorded_by } = req.body;
  try {
    db.prepare(`
      INSERT INTO expenses (title, amount, category, date, description, recorded_by)
      VALUES (?, ?, ?, ?, ?, ?)
    `).run(title, amount, category, date, description, recorded_by);
    res.status(201).json({ message: 'Expense recorded' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to record expense' });
  }
});

router.delete('/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM expenses WHERE id = ?').run(id);
    res.json({ message: 'Expense deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete expense' });
  }
});

export default router;
