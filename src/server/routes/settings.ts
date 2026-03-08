import { Router } from 'express';
import db from '../../db/init';
import bcrypt from 'bcryptjs';

const router = Router();

// --- System Users Management ---

router.get('/users', (req, res) => {
  const users = db.prepare("SELECT id, name, email, role, created_at FROM users WHERE role IN ('admin', 'accountant')").all();
  res.json(users);
});

router.post('/users', (req, res) => {
  const { name, email, password, role } = req.body;
  if (!['admin', 'accountant'].includes(role)) {
    return res.status(400).json({ error: 'Invalid role' });
  }

  try {
    const hashedPassword = bcrypt.hashSync(password, 10);
    db.prepare('INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)').run(name, email, hashedPassword, role);
    res.status(201).json({ message: 'User created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

router.delete('/users/:id', (req, res) => {
  const { id } = req.params;
  // Prevent deleting the last admin or self (in a real app)
  // For now, just delete
  try {
    db.prepare('DELETE FROM users WHERE id = ?').run(id);
    res.json({ message: 'User deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// --- Academic Years ---

router.get('/academic-years', (req, res) => {
  const years = db.prepare('SELECT * FROM academic_years ORDER BY start_date DESC').all();
  res.json(years);
});

router.post('/academic-years', (req, res) => {
  const { name, start_date, end_date, is_active } = req.body;
  
  const createYear = db.transaction(() => {
    if (is_active) {
      db.prepare('UPDATE academic_years SET is_active = 0').run();
    }
    db.prepare('INSERT INTO academic_years (name, start_date, end_date, is_active) VALUES (?, ?, ?, ?)').run(name, start_date, end_date, is_active ? 1 : 0);
  });

  try {
    createYear();
    res.status(201).json({ message: 'Academic year created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create academic year' });
  }
});

// --- Classes & Sections ---

router.post('/classes', (req, res) => {
  const { name } = req.body;
  try {
    db.prepare('INSERT INTO classes (name) VALUES (?)').run(name);
    res.status(201).json({ message: 'Class created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create class' });
  }
});

router.post('/sections', (req, res) => {
  const { name, class_id } = req.body;
  try {
    db.prepare('INSERT INTO sections (name, class_id) VALUES (?, ?)').run(name, class_id);
    res.status(201).json({ message: 'Section created' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create section' });
  }
});

// --- School Branding ---

router.get('/school', (req, res) => {
  const settings = db.prepare('SELECT * FROM school_settings WHERE id = 1').get();
  res.json(settings);
});

router.put('/school', (req, res) => {
  const { school_name, school_address, school_phone, school_email, school_logo } = req.body;
  try {
    db.prepare(`
      UPDATE school_settings 
      SET school_name = ?, school_address = ?, school_phone = ?, school_email = ?, school_logo = ?
      WHERE id = 1
    `).run(school_name, school_address, school_phone, school_email, school_logo);
    res.json({ message: 'Settings updated' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

// --- Holidays ---

router.get('/holidays', (req, res) => {
  const holidays = db.prepare('SELECT * FROM holidays ORDER BY start_date ASC').all();
  res.json(holidays);
});

router.post('/holidays', (req, res) => {
  const { name, start_date, end_date, description } = req.body;
  try {
    db.prepare('INSERT INTO holidays (name, start_date, end_date, description) VALUES (?, ?, ?, ?)').run(name, start_date, end_date, description);
    res.status(201).json({ message: 'Holiday added' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add holiday' });
  }
});

router.delete('/holidays/:id', (req, res) => {
  const { id } = req.params;
  try {
    db.prepare('DELETE FROM holidays WHERE id = ?').run(id);
    res.json({ message: 'Holiday deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete holiday' });
  }
});

export default router;
