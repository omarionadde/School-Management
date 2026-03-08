import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import StudentView from '../components/StudentView';
import { motion } from 'framer-motion';
import { GraduationCap, User, BookOpen, Users, Calendar } from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    if (user?.email) {
      fetch('/api/students').then(r => r.json()).then(students => {
        const found = students.find((s: any) => s.email === user.email);
        setStudent(found);
      });
    }
  }, [user]);

  if (!student) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="animate-pulse flex flex-col items-center">
        <div className="h-12 w-12 bg-slate-200 rounded-full mb-4"></div>
        <div className="h-4 w-48 bg-slate-200 rounded mb-2"></div>
        <div className="h-3 w-32 bg-slate-100 rounded"></div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8 pb-8">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 p-8 text-white shadow-xl shadow-violet-500/20"
      >
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 opacity-80">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/10">
                Student Portal
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome back, {student.name.split(' ')[0]}</h1>
            <p className="text-violet-100 text-lg max-w-xl">You are currently enrolled in <span className="font-bold text-white">{student.class_name} - {student.section_name}</span>.</p>
          </div>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-violet-200 font-medium uppercase tracking-wider">Admission No</p>
              <p className="text-xl font-bold font-mono">{student.admission_no}</p>
            </div>
            <div className="h-10 w-10 bg-white text-violet-600 rounded-xl flex items-center justify-center shadow-lg">
              <GraduationCap className="w-6 h-6" />
            </div>
          </div>
        </div>
        
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-violet-400/20 rounded-full blur-2xl"></div>
      </motion.div>
      
      {/* Profile Details Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4"
        >
          <div className="bg-blue-50 p-3.5 rounded-2xl text-blue-600">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Class & Section</p>
            <p className="text-lg font-bold text-slate-900">{student.class_name} - {student.section_name}</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4"
        >
          <div className="bg-emerald-50 p-3.5 rounded-2xl text-emerald-600">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Parent / Guardian</p>
            <p className="text-lg font-bold text-slate-900">{student.parent_name}</p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center gap-4"
        >
          <div className="bg-amber-50 p-3.5 rounded-2xl text-amber-600">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Academic Year</p>
            <p className="text-lg font-bold text-slate-900">2023-2024</p>
          </div>
        </motion.div>
      </div>

      <StudentView studentId={student.id} />
    </div>
  );
}
