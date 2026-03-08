import { Router } from 'express';
import db from '../../db/init';

const router = Router();

router.get('/', (req, res) => {
  const announcements = db.prepare(`
    SELECT a.*, u.name as posted_by_name 
    FROM announcements a
    LEFT JOIN users u ON a.posted_by = u.id
    ORDER BY a.date DESC
  `).all();
  res.json(announcements);
});

router.post('/', (req, res) => {
  const { title, content, posted_by } = req.body;
  try {
    db.prepare('INSERT INTO announcements (title, content, posted_by) VALUES (?, ?, ?)').run(title, content, posted_by);
    res.status(201).json({ message: 'Announcement created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create announcement' });
  }
});

export default router;
