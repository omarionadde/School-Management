import { useEffect, useState } from 'react';
import { 
  Users, 
  CalendarCheck, 
  FileText, 
  Clock,
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Calendar,
  ArrowUpRight,
  TrendingUp
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [classes, setClasses] = useState<any[]>([]);
  const [attendance, setAttendance] = useState<any[]>([]);
  const [assignments, setAssignments] = useState<any[]>([]);

  useEffect(() => {
    // Mock data for now, in a real app fetch from API
    setClasses([
      { id: 1, name: 'Class 10-A', subject: 'Mathematics', students: 32, next_class: '10:00 AM' },
      { id: 2, name: 'Class 9-B', subject: 'Physics', students: 28, next_class: '11:30 AM' },
      { id: 3, name: 'Class 11-C', subject: 'Mathematics', students: 30, next_class: '02:00 PM' },
    ]);

    setAttendance([
      { date: 'Mon', present: 28, absent: 4 },
      { date: 'Tue', present: 30, absent: 2 },
      { date: 'Wed', present: 29, absent: 3 },
      { date: 'Thu', present: 31, absent: 1 },
      { date: 'Fri', present: 27, absent: 5 },
    ]);

    setAssignments([
      { id: 1, title: 'Algebra Quiz', class: 'Class 10-A', due_date: '2024-03-15', status: 'Pending' },
      { id: 2, title: 'Physics Lab Report', class: 'Class 9-B', due_date: '2024-03-18', status: 'Submitted' },
      { id: 3, title: 'Calculus Test', class: 'Class 11-C', due_date: '2024-03-20', status: 'Draft' },
    ]);
  }, []);

  const stats = [
    { label: 'Total Students', value: 90, sub: 'Across 3 classes', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50/50', border: 'border-blue-100', gradient: 'from-blue-500/10 to-blue-500/5' },
    { label: 'Avg Attendance', value: '96%', sub: 'Today', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100', gradient: 'from-emerald-500/10 to-emerald-500/5' },
    { label: 'Pending Grading', value: 5, sub: 'Assignments', icon: FileText, color: 'text-violet-600', bg: 'bg-violet-50/50', border: 'border-violet-100', gradient: 'from-violet-500/10 to-violet-500/5' },
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8 text-white shadow-xl shadow-emerald-500/20"
      >
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 opacity-80">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/10">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Hello, {user?.name}</h1>
            <p className="text-emerald-100 text-lg max-w-xl">You have <span className="font-bold text-white">3 classes</span> scheduled for today. Your first class starts at 10:00 AM.</p>
          </div>
          <button className="bg-white text-emerald-600 px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-black/10 hover:bg-emerald-50 transition-all active:scale-95 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            View Full Schedule
          </button>
        </div>
        
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-emerald-400/20 rounded-full blur-2xl"></div>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  Active
                </span>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight group-hover:translate-x-1 transition-transform duration-300">{stat.value}</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">{stat.label}</p>
                <p className="text-xs text-slate-400 mt-0.5">{stat.sub}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Class Schedule & Attendance */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 space-y-8"
        >
          {/* Schedule */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Today's Schedule</h3>
                <p className="text-sm text-slate-500 mt-1">Your upcoming classes</p>
              </div>
              <button className="p-2 hover:bg-slate-50 rounded-xl transition-colors">
                <MoreHorizontal className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <div className="space-y-4">
              {classes.map((cls, i) => (
                <motion.div 
                  key={cls.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + (i * 0.1) }}
                  className="flex items-center p-4 bg-slate-50/50 rounded-2xl border border-slate-100 hover:border-blue-200 hover:bg-white hover:shadow-md transition-all duration-300 group"
                >
                  <div className="bg-white p-3 rounded-xl shadow-sm mr-4 group-hover:scale-110 transition-transform duration-300">
                    <BookOpen className="w-6 h-6 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{cls.name}</h4>
                    <p className="text-sm text-slate-500 font-medium">{cls.subject} • {cls.students} Students</p>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center text-sm font-bold text-slate-700 bg-white px-3 py-1.5 rounded-xl shadow-sm border border-slate-100 group-hover:border-blue-100 group-hover:text-blue-600 transition-colors">
                      <Clock className="w-4 h-4 mr-2 text-slate-400 group-hover:text-blue-400" />
                      {cls.next_class}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Attendance Chart */}
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Attendance Overview</h3>
                <p className="text-sm text-slate-500 mt-1">Weekly student presence</p>
              </div>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={attendance} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPresent" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10B981" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#10B981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                  <XAxis 
                    dataKey="date" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 500}} 
                    dy={10} 
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{fill: '#94A3B8', fontSize: 12, fontWeight: 500}} 
                    dx={-10}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                      backgroundColor: 'rgba(255, 255, 255, 0.9)',
                      backdropFilter: 'blur(8px)',
                      padding: '12px'
                    }}
                    itemStyle={{ color: '#1E293B', fontWeight: 600 }}
                    cursor={{ stroke: '#10B981', strokeWidth: 2, strokeDasharray: '4 4' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="present" 
                    stroke="#10B981" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorPresent)" 
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </motion.div>

        {/* Upcoming Assignments */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 h-fit"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Assignments</h3>
              <p className="text-sm text-slate-500 mt-1">Tasks & Grading</p>
            </div>
            <button className="bg-slate-50 p-2 rounded-xl hover:bg-slate-100 transition-colors">
              <ArrowUpRight className="w-5 h-5 text-slate-500" />
            </button>
          </div>
          
          <div className="space-y-4">
            {assignments.map((assign, i) => (
              <motion.div 
                key={assign.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + (i * 0.1) }}
                className="p-4 rounded-2xl border border-slate-100 hover:border-slate-200 hover:shadow-md transition-all duration-300 bg-white group cursor-pointer"
              >
                <div className="flex justify-between items-start mb-3">
                  <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wide border ${
                    assign.status === 'Pending' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                    assign.status === 'Submitted' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                    'bg-slate-50 text-slate-600 border-slate-100'
                  }`}>
                    {assign.status}
                  </span>
                  <span className="text-xs font-medium text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                    {new Date(assign.due_date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 mb-1 group-hover:text-blue-600 transition-colors">{assign.title}</h4>
                <p className="text-sm text-slate-500 font-medium">{assign.class}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100">
            <button className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 active:scale-95 flex items-center justify-center gap-2">
              <Plus className="w-5 h-5" />
              Create New Assignment
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function MoreHorizontal({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="1" />
      <circle cx="19" cy="12" r="1" />
      <circle cx="5" cy="12" r="1" />
    </svg>
  );
}

function Plus({ className }: { className?: string }) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}
