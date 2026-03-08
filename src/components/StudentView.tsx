import { useEffect, useState } from 'react';
import { Calendar, FileText, Banknote } from 'lucide-react';
import { clsx } from 'clsx';

export default function StudentView({ studentId }: { studentId: number }) {
  const [activeTab, setActiveTab] = useState<'attendance' | 'results' | 'fees'>('attendance');
  const [attendance, setAttendance] = useState<any[]>([]);
  const [results, setResults] = useState<any[]>([]);
  const [fees, setFees] = useState<any[]>([]);

  useEffect(() => {
    if (studentId) {
      fetchAttendance();
      fetchResults();
      fetchFees();
    }
  }, [studentId]);

  const fetchAttendance = () => {
    // We need a new endpoint to get attendance for a specific student
    // For now, let's assume we can filter on the client or add an endpoint
    // Let's add a specific endpoint for student details in a real app
    // For this demo, I'll mock or use existing if possible.
    // Existing: /api/attendance?class_id=X&date=Y (not suitable)
    // Let's create a new route /api/students/:id/full-details
    fetch(`/api/students/${studentId}/details`).then(r => r.json()).then(data => {
      setAttendance(data.attendance || []);
      setResults(data.results || []);
      setFees(data.fees || []);
    }).catch(console.error);
  };

  const fetchResults = () => {}; // Handled in details
  const fetchFees = () => {}; // Handled in details

  return (
    <div className="space-y-6">
      <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl w-fit">
        {[
          { id: 'attendance', label: 'Attendance', icon: Calendar },
          { id: 'results', label: 'Exam Results', icon: FileText },
          { id: 'fees', label: 'Fee Status', icon: Banknote },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={clsx(
                "flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all",
                activeTab === tab.id
                  ? "bg-white text-blue-600 shadow-sm"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
              )}
            >
              <Icon className="w-4 h-4 mr-2" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeTab === 'attendance' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-medium">
              <tr>
                <th className="px-6 py-3">Date</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {attendance.map((record: any) => (
                <tr key={record.id}>
                  <td className="px-6 py-3">{new Date(record.date).toLocaleDateString()}</td>
                  <td className="px-6 py-3">
                    <span className={clsx(
                      "px-2 py-1 rounded-full text-xs font-medium uppercase",
                      record.status === 'present' ? "bg-emerald-100 text-emerald-700" :
                      record.status === 'absent' ? "bg-red-100 text-red-700" :
                      "bg-amber-100 text-amber-700"
                    )}>
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
              {attendance.length === 0 && <tr><td colSpan={2} className="p-6 text-center text-slate-500">No attendance records found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'results' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-medium">
              <tr>
                <th className="px-6 py-3">Exam</th>
                <th className="px-6 py-3">Subject</th>
                <th className="px-6 py-3">Marks</th>
                <th className="px-6 py-3">Grade</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {results.map((res: any) => (
                <tr key={res.id}>
                  <td className="px-6 py-3 font-medium text-slate-900">{res.exam_name}</td>
                  <td className="px-6 py-3">{res.subject}</td>
                  <td className="px-6 py-3">{res.marks_obtained} / {res.total_marks}</td>
                  <td className="px-6 py-3 font-bold">{res.grade}</td>
                </tr>
              ))}
              {results.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-slate-500">No exam results found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'fees' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 text-slate-600 font-medium">
              <tr>
                <th className="px-6 py-3">Title</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Due Date</th>
                <th className="px-6 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {fees.map((fee: any) => (
                <tr key={fee.id}>
                  <td className="px-6 py-3 font-medium text-slate-900">{fee.title}</td>
                  <td className="px-6 py-3">${fee.amount}</td>
                  <td className="px-6 py-3">{new Date(fee.due_date).toLocaleDateString()}</td>
                  <td className="px-6 py-3">
                    <span className={clsx(
                      "px-2 py-1 rounded-full text-xs font-medium uppercase",
                      fee.status === 'paid' ? "bg-emerald-100 text-emerald-700" :
                      "bg-amber-100 text-amber-700"
                    )}>
                      {fee.status}
                    </span>
                  </td>
                </tr>
              ))}
              {fees.length === 0 && <tr><td colSpan={4} className="p-6 text-center text-slate-500">No fee records found.</td></tr>}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
