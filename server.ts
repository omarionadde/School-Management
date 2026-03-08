import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { initializeDatabase } from './src/db/init';
import authRoutes from './src/server/routes/auth';
import studentRoutes from './src/server/routes/students';
import teacherRoutes from './src/server/routes/teachers';
import statsRoutes from './src/server/routes/stats';
import attendanceRoutes from './src/server/routes/attendance';
import feeRoutes from './src/server/routes/fees';
import classRoutes from './src/server/routes/classes';
import settingsRoutes from './src/server/routes/settings';
import examRoutes from './src/server/routes/exams';
import announcementRoutes from './src/server/routes/announcements';
import expenseRoutes from './src/server/routes/expenses';
import parentRoutes from './src/server/routes/parents';
import notificationRoutes from './src/server/routes/notifications';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Initialize Database
  initializeDatabase();

  app.use(express.json());

  // Serve uploaded files
  const uploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
  }
  app.use('/uploads', express.static(uploadsDir));

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/students', studentRoutes);
  app.use('/api/teachers', teacherRoutes);
  app.use('/api/parents', parentRoutes);
  app.use('/api/stats', statsRoutes);
  app.use('/api/attendance', attendanceRoutes);
  app.use('/api/fees', feeRoutes);
  app.use('/api/classes', classRoutes);
  app.use('/api/settings', settingsRoutes);
  app.use('/api/exams', examRoutes);
  app.use('/api/announcements', announcementRoutes);
  app.use('/api/expenses', expenseRoutes);
  app.use('/api/notifications', notificationRoutes);

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Production static file serving
    const distPath = path.resolve(__dirname, 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res) => {
        res.sendFile(path.join(distPath, 'index.html'));
      });
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
