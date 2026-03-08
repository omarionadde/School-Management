import { useEffect, useState } from 'react';
import { 
  Users, 
  GraduationCap, 
  School, 
  Banknote,
  TrendingUp,
  Clock,
  Megaphone,
  Plus,
  ArrowUpRight,
  MoreHorizontal,
  Calendar
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';

interface Stats {
  students: number;
  teachers: number;
  classes: number;
  feesCollected: number;
  pendingFees: number;
}

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [isAnnouncementModalOpen, setIsAnnouncementModalOpen] = useState(false);
  const [announcementForm, setAnnouncementForm] = useState({ title: '', content: '' });

  useEffect(() => {
    fetch('/api/stats').then(res => res.json()).then(setStats).catch(console.error);
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = () => {
    fetch('/api/announcements').then(r => r.json()).then(setAnnouncements).catch(console.error);
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...announcementForm, posted_by: user?.id })
    });
    setIsAnnouncementModalOpen(false);
    fetchAnnouncements();
    setAnnouncementForm({ title: '', content: '' });
  };

  const cards = [
    { label: 'Total Students', value: stats?.students || 0, icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-50/50', border: 'border-blue-100', gradient: 'from-blue-500/10 to-blue-500/5', roles: ['admin', 'teacher', 'accountant'] },
    { label: 'Total Teachers', value: stats?.teachers || 0, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50/50', border: 'border-emerald-100', gradient: 'from-emerald-500/10 to-emerald-500/5', roles: ['admin'] },
    { label: 'Total Classes', value: stats?.classes || 0, icon: School, color: 'text-violet-600', bg: 'bg-violet-50/50', border: 'border-violet-100', gradient: 'from-violet-500/10 to-violet-500/5', roles: ['admin', 'teacher'] },
    { label: 'Fees Collected', value: `$${stats?.feesCollected || 0}`, icon: Banknote, color: 'text-amber-600', bg: 'bg-amber-50/50', border: 'border-amber-100', gradient: 'from-amber-500/10 to-amber-500/5', roles: ['admin', 'accountant'] },
  ];

  const filteredCards = cards.filter(c => user?.role && c.roles.includes(user.role));

  const data = [
    { name: 'Jan', students: 400 },
    { name: 'Feb', students: 300 },
    { name: 'Mar', students: 200 },
    { name: 'Apr', students: 278 },
    { name: 'May', students: 189 },
    { name: 'Jun', students: 239 },
    { name: 'Jul', students: 349 },
  ];

  return (
    <div className="space-y-8 pb-8">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 p-8 text-white shadow-xl shadow-blue-500/20"
      >
        <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2 opacity-80">
              <span className="bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-medium border border-white/10">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight mb-2">Welcome back, {user?.name}</h1>
            <p className="text-blue-100 text-lg max-w-xl">Here's your daily overview. You have <span className="font-bold text-white underline decoration-blue-300 underline-offset-4">3 new notifications</span> today.</p>
          </div>
          <button className="bg-white text-blue-600 px-5 py-2.5 rounded-xl font-semibold shadow-lg shadow-black/10 hover:bg-blue-50 transition-all active:scale-95 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            View Schedule
          </button>
        </div>
        
        {/* Decorative circles */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -mb-10 -ml-10 w-40 h-40 bg-blue-400/20 rounded-full blur-2xl"></div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div 
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`relative overflow-hidden bg-white p-6 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300 group`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}></div>
              
              <div className="relative z-10 flex justify-between items-start mb-4">
                <div className={`${card.bg} p-3.5 rounded-2xl border ${card.border} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  +2.5%
                </span>
              </div>
              
              <div className="relative z-10">
                <h3 className="text-3xl font-bold text-slate-900 tracking-tight group-hover:translate-x-1 transition-transform duration-300">{card.value}</h3>
                <p className="text-sm text-slate-500 font-medium mt-1">{card.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Chart Section */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-sm border border-slate-100"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Attendance Analytics</h3>
              <p className="text-sm text-slate-500 mt-1">Weekly student attendance overview</p>
            </div>
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button className="px-4 py-1.5 text-xs font-semibold bg-white text-slate-900 rounded-lg shadow-sm">Weekly</button>
              <button className="px-4 py-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors">Monthly</button>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
                <XAxis 
                  dataKey="name" 
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
                  cursor={{ stroke: '#3B82F6', strokeWidth: 2, strokeDasharray: '4 4' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="students" 
                  stroke="#3B82F6" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorStudents)" 
                  animationDuration={1500}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Announcements Section */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col h-full"
        >
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-xl font-bold text-slate-900">Announcements</h3>
              <p className="text-sm text-slate-500 mt-1">Latest updates & news</p>
            </div>
            {user?.role === 'admin' && (
              <button 
                onClick={() => setIsAnnouncementModalOpen(true)}
                className="bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white p-2.5 rounded-xl transition-all duration-300"
              >
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <div className="space-y-4 flex-1 overflow-y-auto max-h-[400px] pr-2 custom-scrollbar">
            {announcements.length > 0 ? announcements.map((ann, i) => (
              <motion.div 
                key={ann.id} 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group relative p-4 rounded-2xl bg-slate-50 border border-slate-100 hover:bg-white hover:shadow-md hover:border-blue-100 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 p-2 rounded-lg text-blue-600 shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    <Megaphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{ann.title}</h4>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">{ann.content}</p>
                    <div className="flex items-center gap-2 mt-3">
                      <span className="text-[10px] font-semibold bg-slate-200 text-slate-600 px-2 py-0.5 rounded-full">
                        {new Date(ann.date).toLocaleDateString()}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        by {ann.posted_by_name}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )) : (
              <div className="flex flex-col items-center justify-center h-40 text-center border-2 border-dashed border-slate-100 rounded-2xl">
                <div className="bg-slate-50 p-4 rounded-full mb-3">
                  <Megaphone className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm font-medium text-slate-900">No announcements</p>
                <p className="text-xs text-slate-500">Check back later for updates</p>
              </div>
            )}
          </div>
          
          <button className="w-full mt-4 py-3 text-sm font-semibold text-slate-600 bg-slate-50 hover:bg-slate-100 rounded-xl transition-colors flex items-center justify-center gap-2">
            View All Announcements
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </motion.div>
      </div>

      {/* Modal */}
      {isAnnouncementModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 flex items-center justify-center z-[110] p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-white rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden border border-white/20"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/80 backdrop-blur-md">
              <div>
                <h2 className="text-xl font-bold text-slate-900">New Announcement</h2>
                <p className="text-sm text-slate-500">Share updates with the school</p>
              </div>
              <button 
                onClick={() => setIsAnnouncementModalOpen(false)} 
                className="bg-white p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all shadow-sm border border-slate-100"
              >
                <span className="sr-only">Close</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateAnnouncement} className="p-8 space-y-6">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Title</label>
                <input
                  required
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all bg-slate-50 focus:bg-white"
                  placeholder="e.g., School Holiday Notice"
                  value={announcementForm.title}
                  onChange={e => setAnnouncementForm({...announcementForm, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Content</label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none bg-slate-50 focus:bg-white"
                  placeholder="Write your announcement here..."
                  value={announcementForm.content}
                  onChange={e => setAnnouncementForm({...announcementForm, content: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setIsAnnouncementModalOpen(false)}
                  className="px-6 py-3 text-sm font-bold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-3 text-sm font-bold bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/30 transition-all hover:scale-105 active:scale-95"
                >
                  Post Announcement
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
