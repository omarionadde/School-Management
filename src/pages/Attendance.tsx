import { useEffect, useState } from 'react';
import { Calendar as CalendarIcon, Check, X, Clock, PieChart as PieChartIcon, BarChart as BarChartIcon } from 'lucide-react';
import { clsx } from 'clsx';
import { format } from 'date-fns';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function Attendance() {
  const [activeTab, setActiveTab] = useState<'mark' | 'report'>('mark');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [students, setStudents] = useState<any[]>([]);
  const [classes, setClasses] = useState<{classes: any[], sections: any[]}>({ classes: [], sections: [] });
  const [loading, setLoading] = useState(false);
  
  // Report State
  const [reportData, setReportData] = useState<any>(null);

  useEffect(() => {
    fetch('/api/classes')
      .then(res => res.json())
      .then(setClasses)
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (activeTab === 'mark' && selectedClass && selectedDate) {
      fetchAttendance();
    } else if (activeTab === 'report') {
      fetchReport();
    }
  }, [selectedClass, selectedDate, activeTab]);

  const fetchAttendance = () => {
    setLoading(true);
    fetch(`/api/attendance?class_id=${selectedClass}&date=${selectedDate}`)
      .then(res => res.json())
      .then(data => {
        setStudents(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  const fetchReport = () => {
    // Fetch overall report or filtered by class if selected
    let url = '/api/attendance/report?';
    if (selectedClass) url += `class_id=${selectedClass}&`;
    // Default to current month/year or just all time for simplicity if no date range picker yet
    
    fetch(url)
      .then(res => res.json())
      .then(setReportData)
      .catch(console.error);
  };

  const markAttendance = (studentId: number, status: 'present' | 'absent' | 'late') => {
    setStudents(prev => prev.map(s => 
      s.student_id === studentId ? { ...s, status } : s
    ));
  };

  const saveAttendance = async () => {
    const records = students.map(s => ({
      student_id: s.student_id,
      status: s.status || 'present' // Default to present if not marked
    }));

    try {
      const res = await fetch('/api/attendance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: selectedDate, records }),
      });
      if (res.ok) {
        alert('Attendance saved successfully');
      }
    } catch (error) {
      console.error(error);
      alert('Failed to save attendance');
    }
  };

  const pieData = reportData ? [
    { name: 'Present', value: reportData.present, color: '#10B981' },
    { name: 'Absent', value: reportData.absent, color: '#EF4444' },
    { name: 'Late', value: reportData.late, color: '#F59E0B' },
  ] : [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Attendance</h1>
          <p className="text-slate-500">Mark and view daily attendance</p>
        </div>
        <div className="flex bg-slate-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('mark')}
            className={clsx(
              "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all",
              activeTab === 'mark'
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
            )}
          >
            <Check className="w-4 h-4 mr-2" />
            Mark Attendance
          </button>
          <button
            onClick={() => setActiveTab('report')}
            className={clsx(
              "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-all",
              activeTab === 'report'
                ? "bg-white text-blue-600 shadow-sm"
                : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
            )}
          >
            <PieChartIcon className="w-4 h-4 mr-2" />
            Reports
          </button>
        </div>
      </div>

      {activeTab === 'mark' && (
        <>
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row gap-4 items-end">
            <div className="w-full md:w-64">
              <label className="block text-sm font-medium text-slate-700 mb-2">Select Class</label>
              <select
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={selectedClass}
                onChange={e => setSelectedClass(e.target.value)}
              >
                <option value="">Choose a class...</option>
                {classes.classes.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            
            <div className="w-full md:w-64">
              <label className="block text-sm font-medium text-slate-700 mb-2">Date</label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={selectedDate}
                onChange={e => setSelectedDate(e.target.value)}
              />
            </div>

            <div className="flex-1 text-right">
              <button
                onClick={saveAttendance}
                disabled={!selectedClass || students.length === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Save Attendance
              </button>
            </div>
          </div>

          {selectedClass ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              {loading ? (
                <div className="p-8 text-center text-slate-500">Loading students...</div>
              ) : students.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-4">Admission No</th>
                        <th className="px-6 py-4">Student Name</th>
                        <th className="px-6 py-4 text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200">
                      {students.map((student) => (
                        <tr key={student.student_id} className="hover:bg-slate-50">
                          <td className="px-6 py-4 font-mono text-slate-600">{student.admission_no}</td>
                          <td className="px-6 py-4 font-medium text-slate-900">{student.student_name}</td>
                          <td className="px-6 py-4">
                            <div className="flex justify-center gap-2">
                              <button
                                onClick={() => markAttendance(student.student_id, 'present')}
                                className={clsx(
                                  "p-2 rounded-lg flex items-center gap-2 transition-all",
                                  student.status === 'present' 
                                    ? "bg-emerald-100 text-emerald-700 ring-2 ring-emerald-500 ring-offset-1" 
                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                )}
                              >
                                <Check className="w-4 h-4" />
                                <span className="text-xs font-semibold">Present</span>
                              </button>
                              
                              <button
                                onClick={() => markAttendance(student.student_id, 'absent')}
                                className={clsx(
                                  "p-2 rounded-lg flex items-center gap-2 transition-all",
                                  student.status === 'absent' 
                                    ? "bg-red-100 text-red-700 ring-2 ring-red-500 ring-offset-1" 
                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                )}
                              >
                                <X className="w-4 h-4" />
                                <span className="text-xs font-semibold">Absent</span>
                              </button>

                              <button
                                onClick={() => markAttendance(student.student_id, 'late')}
                                className={clsx(
                                  "p-2 rounded-lg flex items-center gap-2 transition-all",
                                  student.status === 'late' 
                                    ? "bg-amber-100 text-amber-700 ring-2 ring-amber-500 ring-offset-1" 
                                    : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                                )}
                              >
                                <Clock className="w-4 h-4" />
                                <span className="text-xs font-semibold">Late</span>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="p-8 text-center text-slate-500">No students found in this class.</div>
              )}
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-xl p-12 text-center text-slate-400">
              <CalendarIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>Select a class and date to manage attendance</p>
            </div>
          )}
        </>
      )}

      {activeTab === 'report' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="font-semibold text-slate-900 mb-6">Attendance Overview</h3>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
             <h3 className="font-semibold text-slate-900 mb-4">Summary</h3>
             <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-emerald-50 rounded-lg border border-emerald-100">
                  <span className="font-medium text-emerald-900">Present</span>
                  <span className="text-2xl font-bold text-emerald-600">{reportData?.present || 0}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-red-50 rounded-lg border border-red-100">
                  <span className="font-medium text-red-900">Absent</span>
                  <span className="text-2xl font-bold text-red-600">{reportData?.absent || 0}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-amber-50 rounded-lg border border-amber-100">
                  <span className="font-medium text-amber-900">Late</span>
                  <span className="text-2xl font-bold text-amber-600">{reportData?.late || 0}</span>
                </div>
             </div>
             <div className="mt-6 text-sm text-slate-500">
               <p>Note: This report shows aggregated data for all time. Use filters to narrow down (coming soon).</p>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
