import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import StudentView from '../components/StudentView';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    if (user?.email) {
      // Find student record by email (via user_id ideally, but we can fetch all students and find)
      // Better: endpoint to get student by user_id
      fetch('/api/students').then(r => r.json()).then(students => {
        const found = students.find((s: any) => s.email === user.email);
        setStudent(found);
      });
    }
  }, [user]);

  if (!student) return <div className="p-8 text-center">Loading student profile...</div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My Dashboard</h1>
        <p className="text-slate-500">Welcome back, {student.name}</p>
      </div>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div>
            <p className="text-slate-500">Admission No</p>
            <p className="font-medium">{student.admission_no}</p>
          </div>
          <div>
            <p className="text-slate-500">Class</p>
            <p className="font-medium">{student.class_name} - {student.section_name}</p>
          </div>
          <div>
            <p className="text-slate-500">Parent</p>
            <p className="font-medium">{student.parent_name}</p>
          </div>
        </div>
      </div>

      <StudentView studentId={student.id} />
    </div>
  );
}
