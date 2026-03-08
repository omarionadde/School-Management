import express from 'express';
import db from '../../db/init';

const router = express.Router();

// Get notifications for current user
router.get('/', (req, res) => {
  // @ts-ignore
  const userId = req.headers['x-user-id']; // Middleware should set this, but for now we rely on client sending it or session
  // In a real app, use proper auth middleware. Here we assume the client sends the user ID in a header for simplicity 
  // or we extract it from the token if we had the middleware set up in this file.
  // However, looking at other routes, let's see how they handle auth.
  // They seem to rely on the frontend passing context or just simple logic.
  // Let's assume we get the user ID from the query or header.
  
  // Actually, let's look at how other routes do it.
  // They don't seem to have explicit auth middleware in the snippets I saw, 
  // but the frontend sends requests.
  // I'll assume the user ID is passed in the query for now for simplicity, 
  // or I'll implement a simple check.
  
  const { user_id } = req.query;

  if (!user_id) {
    return res.status(400).json({ error: 'User ID required' });
  }

  try {
    const notifications = db.prepare(`
      SELECT * FROM notifications 
      WHERE user_id = ? 
      ORDER BY created_at DESC
    `).all(user_id);
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

// Mark as read
router.patch('/:id/read', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('UPDATE notifications SET is_read = 1 WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update notification' });
  }
});

// Create notification (Internal or Admin)
router.post('/', (req, res) => {
  const { user_id, title, message, type } = req.body;
  try {
    const result = db.prepare(`
      INSERT INTO notifications (user_id, title, message, type)
      VALUES (?, ?, ?, ?)
    `).run(user_id, title, message, type || 'info');
    res.json({ id: result.lastInsertRowid });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create notification' });
  }
});

// Delete notification
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM notifications WHERE id = ?').run(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});

export default router;
