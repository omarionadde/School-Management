import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, 
  Users, 
  GraduationCap, 
  CalendarCheck, 
  Banknote, 
  LogOut, 
  Menu, 
  X,
  School,
  FileText,
  Settings,
  UserPlus
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/', roles: ['admin', 'teacher', 'student', 'parent', 'accountant'] },
    { icon: GraduationCap, label: 'Students', path: '/students', roles: ['admin', 'teacher'] },
    { icon: Users, label: 'Teachers', path: '/teachers', roles: ['admin'] },
    { icon: UserPlus, label: 'Parents', path: '/parents', roles: ['admin'] },
    { icon: CalendarCheck, label: 'Attendance', path: '/attendance', roles: ['admin', 'teacher'] },
    { icon: Banknote, label: 'Finance', path: '/fees', roles: ['admin', 'accountant'] },
    { icon: FileText, label: 'Exams', path: '/exams', roles: ['admin', 'teacher'] },
    { icon: Settings, label: 'Settings', path: '/settings', roles: ['admin'] },
  ];

  const filteredNavItems = navItems.filter(item => user?.role && item.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <aside 
        className={clsx(
          "fixed lg:static inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col shadow-xl lg:shadow-none",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="h-20 flex items-center px-8 border-b border-slate-100 flex-shrink-0">
          <div className="bg-blue-600 p-2 rounded-xl mr-3 shadow-lg shadow-blue-600/20">
            <School className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">EduManage</span>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-8 p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                {user?.name?.charAt(0)}
              </div>
              <div className="overflow-hidden">
                <p className="font-semibold truncate text-slate-900">{user?.name}</p>
                <p className="text-xs text-slate-500 uppercase tracking-wider font-medium">{user?.role}</p>
              </div>
            </div>
          </div>

          <nav className="space-y-1">
            {filteredNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsSidebarOpen(false)}
                  className={clsx(
                    "flex items-center px-4 py-3.5 text-sm font-medium rounded-xl transition-all duration-200 group relative overflow-hidden",
                    isActive 
                      ? "bg-blue-600 text-white shadow-md shadow-blue-600/20" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <Icon className={clsx("w-5 h-5 mr-3 transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-blue-600 z-0 rounded-xl"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-6 border-t border-slate-100 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3.5 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors group"
          >
            <LogOut className="w-5 h-5 mr-3 text-slate-400 group-hover:text-red-500 transition-colors" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50">
        {/* Mobile Header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200 lg:hidden sticky top-0 z-30">
          <div className="flex items-center justify-between h-16 px-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 text-slate-500 hover:text-slate-700 rounded-lg hover:bg-slate-100"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="font-bold text-slate-900">EduManage</span>
            <div className="w-10" /> {/* Spacer */}
          </div>
        </header>

        <main className="flex-1 p-4 lg:p-8 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-7xl mx-auto"
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
