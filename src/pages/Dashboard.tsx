import { useAuth } from '../context/AuthContext';
import AdminDashboard from './AdminDashboard';
import StudentDashboard from './StudentDashboard';
import ParentDashboard from './ParentDashboard';

export default function Dashboard() {
  const { user } = useAuth();

  if (user?.role === 'student') {
    return <StudentDashboard />;
  }

  if (user?.role === 'parent') {
    return <ParentDashboard />;
  }

  // Admin, Teacher, Accountant see the main dashboard
  return <AdminDashboard />;
}
