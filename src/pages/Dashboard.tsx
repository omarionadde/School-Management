import { useAuth } from '../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import StudentDashboard from './StudentDashboard';
import ParentDashboard from './ParentDashboard';
import TeacherDashboard from './TeacherDashboard';

export default function Dashboard() {
  const { user } = useAuth();

  if (user?.role === 'student') {
    return <StudentDashboard />;
  }

  if (user?.role === 'parent') {
    return <ParentDashboard />;
  }

  if (user?.role === 'teacher') {
    return <TeacherDashboard />;
  }

  // Admin, Accountant see the main dashboard
  return <AdminDashboard />;
}
