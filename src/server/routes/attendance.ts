import { Router } from 'express';
import db from '../../db/init';

const router = Router();

// Get attendance for a class on a date
router.get('/', (req, res) => {
  const { class_id, date } = req.query;
  
  if (!class_id || !date) {
    return res.status(400).json({ error: 'Class ID and Date are required' });
  }

  const attendance = db.prepare(`
    SELECT a.*, s.id as student_id, u.name as student_name, s.admission_no
    FROM students s
    JOIN users u ON s.user_id = u.id
    LEFT JOIN attendance a ON s.id = a.student_id AND a.date = ?
    WHERE s.class_id = ?
  `).all(date, class_id);

  res.json(attendance);
});

// Mark attendance
router.post('/', (req, res) => {
  const { date, records } = req.body; // records: [{ student_id, status }]
  
  if (!Array.isArray(records)) {
    return res.status(400).json({ error: 'Invalid records format' });
  }

  const markAttendance = db.transaction(() => {
    const stmt = db.prepare(`
      INSERT INTO attendance (student_id, date, status)
      VALUES (?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET status = excluded.status
    `);
    
    // Simple approach: delete existing for that day/student and insert new, or use upsert if ID known.
    // Since we don't have a unique constraint on student_id + date in schema yet, let's add one or handle it.
    // Better: Check if exists, update or insert.
    
    const checkStmt = db.prepare('SELECT id FROM attendance WHERE student_id = ? AND date = ?');
    const updateStmt = db.prepare('UPDATE attendance SET status = ? WHERE id = ?');
    const insertStmt = db.prepare('INSERT INTO attendance (student_id, date, status) VALUES (?, ?, ?)');

    for (const record of records) {
      const existing = checkStmt.get(record.student_id, date) as {id: number} | undefined;
      if (existing) {
        updateStmt.run(record.status, existing.id);
      } else {
        insertStmt.run(record.student_id, date, record.status);
      }
    }
  });

  try {
    markAttendance();
    res.json({ message: 'Attendance updated' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to update attendance' });
  }
});

// Get attendance report
router.get('/report', (req, res) => {
  const { class_id, start_date, end_date } = req.query;

  let query = `
    SELECT status, COUNT(*) as count 
    FROM attendance 
    WHERE 1=1
  `;
  const params: any[] = [];

  if (class_id) {
    query += ` AND student_id IN (SELECT id FROM students WHERE class_id = ?)`;
    params.push(class_id);
  }

  if (start_date) {
    query += ` AND date >= ?`;
    params.push(start_date);
  }

  if (end_date) {
    query += ` AND date <= ?`;
    params.push(end_date);
  }

  query += ` GROUP BY status`;

  const stats = db.prepare(query).all(...params);
  
  // Format for frontend
  const result = {
    present: 0,
    absent: 0,
    late: 0
  };

  stats.forEach((s: any) => {
    if (s.status === 'present') result.present = s.count;
    if (s.status === 'absent') result.absent = s.count;
    if (s.status === 'late') result.late = s.count;
  });

  res.json(result);
});

export default router;
