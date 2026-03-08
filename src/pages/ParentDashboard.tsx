import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import StudentView from '../components/StudentView';

export default function ParentDashboard() {
  const { user } = useAuth();
  const [children, setChildren] = useState<any[]>([]);
  const [selectedChild, setSelectedChild] = useState<any>(null);

  useEffect(() => {
    if (user?.name) {
      // Fetch students where parent_name matches user.name
      fetch('/api/students').then(r => r.json()).then(students => {
        // Simple fuzzy match for demo
        const found = students.filter((s: any) => 
          s.parent_name.toLowerCase().includes(user.name.toLowerCase()) ||
          user.name.toLowerCase().includes(s.parent_name.toLowerCase())
        );
        setChildren(found);
        if (found.length > 0) setSelectedChild(found[0]);
      });
    }
  }, [user]);

  if (children.length === 0) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">Parent Portal</h1>
        <p className="text-slate-500">No students found linked to your account.</p>
        <p className="text-sm text-slate-400 mt-2">Ensure your name matches the "Parent Name" in student records.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Parent Portal</h1>
          <p className="text-slate-500">Viewing records for {selectedChild?.name}</p>
        </div>
        
        {children.length > 1 && (
          <select 
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={selectedChild?.id}
            onChange={(e) => setSelectedChild(children.find(c => c.id === Number(e.target.value)))}
          >
            {children.map(child => (
              <option key={child.id} value={child.id}>{child.name}</option>
            ))}
          </select>
        )}
      </div>

      {selectedChild && <StudentView studentId={selectedChild.id} />}
    </div>
  );
}
