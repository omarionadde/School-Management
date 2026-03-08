import { useEffect, useState } from 'react';
import { 
  BookOpen, 
  Calendar, 
  Award, 
  DollarSign,
  MessageSquare,
  TrendingUp,
  Clock,
  FileText,
  ArrowUpRight,
  Download
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

export default function ParentDashboard() {
  const { user } = useAuth();
  const [student, setStudent] = useState<any>(null);
  const [attendanceData, setAttendanceData] = useState<any[]>([]);
  const [fees, setFees] = useState<any[]>([]);

  useEffect(() => {
    // Mock data - in real app fetch linked student data
    setStudent({
      name: 'Alex Johnson',
      class: '10-A',
      admission_no: 'ADM-2024-001',
      attendance_percentage: 92,
      gpa: 3.8
    });

    setAttendanceData([
      { name: 'Present', value: 92, color: '#10B981' },
      { name: 'Absent', value: 5, color: '#EF4444' },
      { name: 'Late', value: 3, color: '#F59E0B' },
    ]);

    setFees([
      { id: 1, title: 'Term 1 Tuition', amount: 1200, status: 'paid', date: '2024-01-15' },
      { id: 2, title: 'Lab Fee', amount: 150, status: 'paid', date: '2024-02-01' },
      { id: 3, title: 'Term 2 Tuition', amount: 1200, status: 'pending', date: '2024-04-15' },
    ]);
  }, []);

  const stats = [
    { label: 'Class', value: student?.class, icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50/50', border: 'border-blue-100', gradient: 'from-blue-500/10 to-blue-500/5' },
    { label: 'GPA', value: student?.gpa, icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100', gradient: 'from-emerald-500/10 to-emerald-500/5' },
    { label: 'Attendance', value: `${student?.attendance_percentage}%`, icon: Clock, color: 'text-violet-600', bg: 'bg-violet-50/50', border: 'border-violet-100', gradient: 'from-violet-500/10 to-violet-500/5' },
    { label: 'Fees Due', value: '$1,200', icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-50/50', border: 'border-amber-100', gradient: 'from-amber-500/10 to-amber-500/5' },
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-600 p-8 text-white shadow-xl shadow-indigo-500/20"
      >
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 opacity-80">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/10">
                Parent Portal
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome, {user?.name?.split(' ')[0]}</h1>
            <p className="text-indigo-100 text-lg max-w-xl">Viewing academic progress for <span className="font-bold text-white underline decoration-indigo-300 underline-offset-4">{student?.name}</span></p>
          </div>
          <button className="bg-white text-indigo-600 px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-black/10 hover:bg-indigo-50 transition-all active:scale-95 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            View Calendar
          </button>
        </div>
        
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-indigo-400/20 rounded-full blur-2xl"></div>
      </motion.div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${stat.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              <div className="relative z-10 flex justify-between items-start mb-4">
                <div className={`${stat.bg} p-3.5 rounded-2xl border ${stat.border} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
              
              <div className="relative z-10">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">{stat.label}</p>
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight group-hover:translate-x-1 transition-transform duration-300">{stat.value}</h3>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Attendance Chart */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col"
        >
          <h3 className="text-xl font-bold text-slate-900 mb-2">Attendance</h3>
          <p className="text-sm text-slate-500 mb-6">Overall presence this term</p>
          
          <div className="h-64 relative flex-1">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={attendanceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  cornerRadius={6}
                >
                  {attendanceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: 'none', 
                    boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                    padding: '8px 12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <p className="text-4xl font-bold text-slate-900">{student?.attendance_percentage}%</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mt-1">Present</p>
              </div>
            </div>
          </div>
          
          <div className="flex justify-center gap-6 mt-6">
            {attendanceData.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: item.color }} />
                <span className="text-sm font-medium text-slate-600">{item.name}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Fee Status */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.6 }}
          className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Fee History</h3>
              <p className="text-sm text-slate-500 mt-1">Recent transactions & dues</p>
            </div>
            <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors">
              <Download className="w-4 h-4" />
              Statement
            </button>
          </div>
          
          <div className="overflow-hidden rounded-2xl border border-slate-100">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50/80 text-slate-600 font-semibold border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4">Description</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Amount</th>
                  <th className="px-6 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {fees.map((fee) => (
                  <tr key={fee.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-6 py-4 font-bold text-slate-900">{fee.title}</td>
                    <td className="px-6 py-4 text-slate-500">{new Date(fee.date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-mono font-medium text-slate-700">${fee.amount}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${
                        fee.status === 'paid' 
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                          : 'bg-amber-50 text-amber-700 border-amber-100'
                      }`}>
                        {fee.status.charAt(0).toUpperCase() + fee.status.slice(1)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>

      {/* Communication */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.7 }}
        className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
      >
        <div className="flex justify-between items-center mb-8">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Contact Teachers</h3>
            <p className="text-sm text-slate-500 mt-1">Message your child's instructors</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { name: 'Mrs. Smith', subject: 'Mathematics', email: 'smith@school.edu' },
            { name: 'Mr. Davis', subject: 'Physics', email: 'davis@school.edu' },
            { name: 'Ms. Wilson', subject: 'English', email: 'wilson@school.edu' },
          ].map((teacher, i) => (
            <motion.div 
              key={teacher.name} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + (i * 0.1) }}
              className="flex items-center p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-lg mr-4 shadow-md shadow-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                {teacher.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{teacher.name}</h4>
                <p className="text-xs font-medium text-slate-500 uppercase tracking-wide">{teacher.subject}</p>
              </div>
              <button className="p-2.5 text-slate-400 hover:text-white hover:bg-blue-600 rounded-xl transition-all shadow-sm bg-white border border-slate-100 group-hover:border-blue-600">
                <MessageSquare className="w-5 h-5" />
              </button>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
