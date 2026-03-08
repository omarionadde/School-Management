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
  UserPlus,
  Bell
} from 'lucide-react';
import { clsx } from 'clsx';
import { motion, AnimatePresence } from 'framer-motion';

export function Layout({ children }: { children: React.ReactNode }) {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard', roles: ['admin', 'teacher', 'student', 'parent', 'accountant'] },
    { icon: GraduationCap, label: 'Students', path: '/students', roles: ['admin', 'teacher'] },
    { icon: Users, label: 'Teachers', path: '/teachers', roles: ['admin'] },
    { icon: UserPlus, label: 'Parents', path: '/parents', roles: ['admin'] },
    { icon: CalendarCheck, label: 'Attendance', path: '/attendance', roles: ['admin', 'teacher'] },
    { icon: Banknote, label: 'Finance', path: '/fees', roles: ['admin', 'accountant'] },
    { icon: FileText, label: 'Exams', path: '/exams', roles: ['admin', 'teacher'] },
    { icon: Bell, label: 'Notifications', path: '/notifications', roles: ['admin', 'teacher', 'student', 'parent', 'accountant'] },
    { icon: Settings, label: 'Settings', path: '/settings', roles: ['admin'] },
  ];

  const filteredNavItems = navItems.filter(item => user?.role && item.roles.includes(user.role));

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans text-slate-900">
      {/* Sidebar */}
      <aside 
        className="static inset-y-0 left-0 z-[100] w-64 bg-white border-r border-slate-200 flex flex-col flex-shrink-0"
      >
        <div className="h-20 flex items-center px-6 border-b border-slate-100 flex-shrink-0">
          <div className="bg-blue-600 p-2 rounded-xl mr-3 shadow-lg shadow-blue-600/20">
            <School className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">EduManage</span>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <div className="mb-6 p-4 bg-slate-50 rounded-2xl border border-slate-100">
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
                  className={clsx(
                    "flex items-center px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 group relative overflow-hidden",
                    isActive 
                      ? "text-white shadow-md shadow-blue-600/20" 
                      : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <Icon className={clsx("w-5 h-5 mr-3 transition-colors", isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600")} />
                  <span className="relative z-10">{item.label}</span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-indigo-600 z-0 rounded-xl"
                      initial={false}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="p-4 border-t border-slate-100 flex-shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-3 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600 rounded-xl transition-colors group"
          >
            <LogOut className="w-5 h-5 mr-3 text-slate-400 group-hover:text-red-500 transition-colors" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 bg-slate-50/50">
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
