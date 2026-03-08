import { Router } from 'express';
import db from '../../db/init';

const router = Router();

router.get('/', (req, res) => {
  const classes = db.prepare('SELECT * FROM classes').all();
  const sections = db.prepare('SELECT * FROM sections').all();
  res.json({ classes, sections });
});

export default router;
