import { Router } from 'express';
import db from '../../db/init';

const router = Router();

router.get('/', (req, res) => {
  const totalStudents = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'student'").get() as {count: number};
  const totalTeachers = db.prepare("SELECT COUNT(*) as count FROM users WHERE role = 'teacher'").get() as {count: number};
  const totalClasses = db.prepare("SELECT COUNT(*) as count FROM classes").get() as {count: number};
  
  const fees = db.prepare("SELECT SUM(amount) as total FROM fees WHERE status = 'paid'").get() as {total: number};
  const pendingFees = db.prepare("SELECT SUM(amount) as total FROM fees WHERE status = 'pending'").get() as {total: number};
  const expenses = db.prepare("SELECT SUM(amount) as total FROM expenses").get() as {total: number};

  res.json({
    students: totalStudents.count,
    teachers: totalTeachers.count,
    classes: totalClasses.count,
    feesCollected: fees.total || 0,
    pendingFees: pendingFees.total || 0,
    totalExpenses: expenses.total || 0
  });
});

export default router;
