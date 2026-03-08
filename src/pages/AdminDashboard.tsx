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
  ArrowUpRight
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';
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
    { label: 'Total Students', value: stats?.students || 0, icon: GraduationCap, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100', roles: ['admin', 'teacher', 'accountant'] },
    { label: 'Total Teachers', value: stats?.teachers || 0, icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', roles: ['admin'] },
    { label: 'Total Classes', value: stats?.classes || 0, icon: School, color: 'text-violet-600', bg: 'bg-violet-50', border: 'border-violet-100', roles: ['admin', 'teacher'] },
    { label: 'Fees Collected', value: `$${stats?.feesCollected || 0}`, icon: Banknote, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', roles: ['admin', 'accountant'] },
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
    <div className="space-y-8">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-end"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-slate-500 mt-2">Welcome back, {user?.name}. Here's what's happening today.</p>
        </div>
        <div className="hidden sm:block text-right">
          <p className="text-sm font-medium text-slate-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <motion.div 
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`bg-white p-6 rounded-2xl shadow-sm border ${card.border} hover:shadow-md transition-shadow`}
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`${card.bg} p-3 rounded-xl`}>
                  <Icon className={`w-6 h-6 ${card.color}`} />
                </div>
                <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <ArrowUpRight className="w-3 h-3 mr-1" />
                  +2.5%
                </span>
              </div>
              <h3 className="text-3xl font-bold text-slate-900">{card.value}</h3>
              <p className="text-sm text-slate-500 font-medium mt-1">{card.label}</p>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Attendance Analytics</h3>
            <select className="bg-slate-50 border-none text-sm font-medium text-slate-500 rounded-lg px-3 py-1 outline-none cursor-pointer hover:text-slate-700">
              <option>This Week</option>
              <option>This Month</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorStudents" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#64748B', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="students" stroke="#3B82F6" strokeWidth={3} fillOpacity={1} fill="url(#colorStudents)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold text-slate-900">Announcements</h3>
            {user?.role === 'admin' && (
              <button 
                onClick={() => setIsAnnouncementModalOpen(true)}
                className="bg-blue-50 text-blue-600 hover:bg-blue-100 p-2 rounded-xl transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            )}
          </div>
          
          <div className="space-y-4 flex-1 overflow-y-auto max-h-[350px] pr-2 custom-scrollbar">
            {announcements.length > 0 ? announcements.map((ann) => (
              <div key={ann.id} className="group relative pl-4 border-l-2 border-slate-200 hover:border-blue-500 transition-colors py-1">
                <div className="absolute -left-[5px] top-3 w-2.5 h-2.5 rounded-full bg-slate-200 group-hover:bg-blue-500 transition-colors border-2 border-white" />
                <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{ann.title}</h4>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{ann.content}</p>
                <p className="text-[10px] text-slate-400 mt-2 font-medium">
                  {new Date(ann.date).toLocaleDateString()} • {ann.posted_by_name}
                </p>
              </div>
            )) : (
              <div className="flex flex-col items-center justify-center h-40 text-center">
                <div className="bg-slate-50 p-3 rounded-full mb-3">
                  <Megaphone className="w-6 h-6 text-slate-400" />
                </div>
                <p className="text-sm text-slate-500">No announcements yet.</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {isAnnouncementModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
          >
            <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h2 className="text-xl font-bold text-slate-900">New Announcement</h2>
              <button onClick={() => setIsAnnouncementModalOpen(false)} className="text-slate-400 hover:text-slate-600 transition-colors">
                <span className="sr-only">Close</span>
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleCreateAnnouncement} className="p-6 space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Title</label>
                <input
                  required
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
                  placeholder="e.g., School Holiday Notice"
                  value={announcementForm.title}
                  onChange={e => setAnnouncementForm({...announcementForm, title: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Content</label>
                <textarea
                  required
                  rows={4}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all resize-none"
                  placeholder="Write your announcement here..."
                  value={announcementForm.content}
                  onChange={e => setAnnouncementForm({...announcementForm, content: e.target.value})}
                />
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAnnouncementModalOpen(false)}
                  className="px-5 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg shadow-blue-600/20 transition-all hover:shadow-blue-600/30"
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
