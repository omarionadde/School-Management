import { useEffect, useState } from 'react';
import { Plus, FileText, Award } from 'lucide-react';
import { clsx } from 'clsx';

export default function Exams() {
  const [exams, setExams] = useState<any[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [classes, setClasses] = useState<any[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    type: 'midterm',
    date: '',
    class_id: '',
    subject: ''
  });

  // Marks Entry State
  const [selectedExam, setSelectedExam] = useState<any | null>(null);
  const [examResults, setExamResults] = useState<any[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [loadingResults, setLoadingResults] = useState(false);

  useEffect(() => {
    fetchExams();
    fetch('/api/classes').then(r => r.json()).then(d => setClasses(d.classes));
  }, []);

  const fetchExams = () => fetch('/api/exams').then(r => r.json()).then(setExams);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/exams', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    setIsModalOpen(false);
    fetchExams();
    setFormData({ name: '', type: 'midterm', date: '', class_id: '', subject: '' });
  };

  const handleViewResults = async (exam: any) => {
    setSelectedExam(exam);
    setLoadingResults(true);
    
    try {
      // Fetch students for this class
      const studentsRes = await fetch(`/api/students`);
      const allStudents = await studentsRes.json();
      const classStudents = allStudents.filter((s: any) => s.class_id === exam.class_id);
      setStudents(classStudents);

      // Fetch existing results
      const resultsRes = await fetch(`/api/exams/${exam.id}/results`);
      const results = await resultsRes.json();
      setExamResults(results);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingResults(false);
    }
  };

  const handleMarkUpdate = async (studentId: number, marks: number, total: number) => {
    try {
      await fetch(`/api/exams/${selectedExam.id}/results`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          marks_obtained: marks,
          total_marks: total
        })
      });
      
      const newResult = { student_id: studentId, marks_obtained: marks, total_marks: total };
      // Calculate grade locally for immediate feedback
      const percentage = (marks / total) * 100;
      let grade = 'F';
      if (percentage >= 90) grade = 'A+';
      else if (percentage >= 80) grade = 'A';
      else if (percentage >= 70) grade = 'B';
      else if (percentage >= 60) grade = 'C';
      else if (percentage >= 50) grade = 'D';
      
      setExamResults(prev => {
        const existing = prev.find(r => r.student_id === studentId);
        if (existing) {
          return prev.map(r => r.student_id === studentId ? { ...r, ...newResult, grade } : r);
        }
        return [...prev, { ...newResult, grade }];
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Exams & Results</h1>
          <p className="text-slate-500">Manage examinations and student grades</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Create Exam
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {exams.map((exam) => (
          <div key={exam.id} className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <span className={clsx(
                "text-xs font-medium px-2 py-1 rounded-full uppercase",
                exam.type === 'final' ? "bg-purple-100 text-purple-700" :
                exam.type === 'midterm' ? "bg-amber-100 text-amber-700" :
                "bg-slate-100 text-slate-700"
              )}>
                {exam.type}
              </span>
            </div>
            
            <h3 className="text-lg font-bold text-slate-900 mb-1">{exam.name}</h3>
            <p className="text-sm text-slate-500 mb-4">{exam.subject} • {exam.class_name}</p>
            
            <div className="flex items-center text-sm text-slate-600 mb-4">
              <span className="font-medium">Date:</span>
              <span className="ml-2">{new Date(exam.date).toLocaleDateString()}</span>
            </div>

            <button 
              onClick={() => handleViewResults(exam)}
              className="w-full py-2 border border-slate-200 rounded-lg text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center justify-center gap-2"
            >
              <Award className="w-4 h-4" />
              Manage Marks
            </button>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-900">Create New Exam</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <span className="sr-only">Close</span>
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Exam Name</label>
                <input
                  required
                  placeholder="e.g. Midterm Mathematics"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.name}
                  onChange={e => setFormData({...formData, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Type</label>
                  <select
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.type}
                    onChange={e => setFormData({...formData, type: e.target.value})}
                  >
                    <option value="midterm">Midterm</option>
                    <option value="final">Final</option>
                    <option value="quiz">Quiz</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                  <input
                    required
                    type="date"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Class</label>
                <select
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.class_id}
                  onChange={e => setFormData({...formData, class_id: e.target.value})}
                >
                  <option value="">Select Class</option>
                  {classes.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                <input
                  required
                  placeholder="e.g. Mathematics"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={formData.subject}
                  onChange={e => setFormData({...formData, subject: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Create Exam
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {selectedExam && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200 flex justify-between items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">{selectedExam.name}</h2>
                <p className="text-sm text-slate-500">{selectedExam.subject} • {selectedExam.class_name}</p>
              </div>
              <button onClick={() => setSelectedExam(null)} className="text-slate-400 hover:text-slate-600">
                <span className="sr-only">Close</span>
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6">
              {loadingResults ? (
                <div className="text-center py-12 text-slate-500">Loading students...</div>
              ) : students.length === 0 ? (
                <div className="text-center py-12 text-slate-500">No students found in this class.</div>
              ) : (
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-600 font-medium sticky top-0 bg-white">
                    <tr>
                      <th className="px-6 py-3">Admission No</th>
                      <th className="px-6 py-3">Student Name</th>
                      <th className="px-6 py-3">Marks Obtained</th>
                      <th className="px-6 py-3">Total Marks</th>
                      <th className="px-6 py-3">Grade</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200">
                    {students.map((student) => {
                      const result = examResults.find(r => r.student_id === student.id);
                      return (
                        <tr key={student.id}>
                          <td className="px-6 py-3 font-mono text-slate-600">{student.admission_no}</td>
                          <td className="px-6 py-3 font-medium text-slate-900">{student.name}</td>
                          <td className="px-6 py-3">
                            <input
                              type="number"
                              className="w-20 px-2 py-1 border border-slate-300 rounded focus:ring-2 focus:ring-blue-500 outline-none"
                              defaultValue={result?.marks_obtained || ''}
                              onBlur={(e) => handleMarkUpdate(student.id, Number(e.target.value), 100)}
                            />
                          </td>
                          <td className="px-6 py-3 text-slate-500">100</td>
                          <td className="px-6 py-3 font-bold text-slate-700">
                            {result?.grade || '-'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
            
            <div className="p-4 border-t border-slate-200 bg-slate-50 text-right">
              <button
                onClick={() => setSelectedExam(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function X({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
