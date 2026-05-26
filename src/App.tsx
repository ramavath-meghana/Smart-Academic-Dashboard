import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  MessageSquareText, 
  CheckSquare, 
  AlertCircle, 
  LogOut,
  User,
  Search,
  Bell,
  GraduationCap
} from 'lucide-react';

// Pages
import Login from './pages/Login';
import StudentDashboard from './pages/StudentDashboard';
import TeacherDashboard from './pages/TeacherDashboard';
import FeedbackView from './pages/FeedbackView';
import AssignmentsView from './pages/AssignmentsView';
import ComplaintsView from './pages/ComplaintsView';
import ProfileView from './pages/ProfileView';

type View = 'dashboard' | 'feedback' | 'assignments' | 'complaints' | 'profile';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleLogin = (userData: any) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  if (loading) return null;

  if (!user) {
    return (
      <AnimatePresence mode="wait">
        <motion.div 
          key="login" 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          exit={{ opacity: 0 }}
        >
          <Login onLogin={handleLogin} />
        </motion.div>
      </AnimatePresence>
    );
  }

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'feedback', label: 'Classroom Feedback', icon: MessageSquareText },
    { id: 'assignments', label: 'Assignment Tracker', icon: CheckSquare },
    { id: 'complaints', label: 'Complaint & Request Box', icon: AlertCircle },
  ];

  return (
    <div className="flex min-h-screen bg-[#f1f4ff]">
      {/* Sidebar */}
      <aside className="w-80 bg-[#5c67f2] text-white flex flex-col p-8 fixed h-full z-30">
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="bg-white/20 p-2 rounded-xl">
            <GraduationCap className="w-6 h-6" />
          </div>
          <h1 className="text-sm font-black tracking-tight leading-none uppercase">Smart Academic</h1>
        </div>

        {/* Profile Card */}
        <button 
          onClick={() => setActiveView('profile')}
          className="flex flex-col items-center mb-10 p-6 bg-white/10 rounded-xl backdrop-blur-md transition-all hover:bg-white/15 group text-center w-full"
        >
          <div className="relative mb-4">
            <div className="w-24 h-24 rounded-xl bg-slate-800/10 flex items-center justify-center border-2 border-white/20 overflow-hidden group-hover:scale-105 transition-transform">
              <User className="w-12 h-12 text-white/50" />
            </div>
            <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-400 border-2 border-[#5c67f2] rounded-lg shadow-lg" />
          </div>
          <h2 className="text-sm font-black tracking-wide mb-1 lowercase">{user.name}</h2>
          <p className="text-[10px] font-bold text-white/60 uppercase tracking-widest">
            {user.role === 'student' ? '2nd Year CSE A' : 'Senior Professor'}
          </p>
        </button>

        {/* Nav Links */}
        <nav className="flex-1 space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveView(item.id as View)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-xl text-[11px] font-black transition-all ${
                activeView === item.id 
                  ? 'bg-white text-[#5c67f2] shadow-lg' 
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon className={`w-5 h-5 ${activeView === item.id ? 'text-[#5c67f2]' : 'text-white/60'}`} />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <button 
          onClick={handleLogout}
          className="mt-auto flex items-center gap-4 px-5 py-4 rounded-xl text-[10px] font-bold text-white/70 hover:bg-white/5 hover:text-white transition-all"
        >
          <LogOut className="w-5 h-5 text-white/60" />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-80 p-10 min-h-screen">
        {/* Top Header */}
        <header className="flex items-center justify-between mb-10">
          <h3 className="text-xl font-black text-slate-800 tracking-tight">{activeView.charAt(0).toUpperCase() + activeView.slice(1)}</h3>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
              <input 
                type="text" 
                placeholder="Search..."
                className="pl-12 pr-6 py-2.5 bg-slate-50 border border-slate-100 rounded-xl outline-none text-xs w-72 transition-all font-bold text-slate-600 focus:bg-white focus:border-blue-400 shadow-inner"
              />
            </div>
            
            <button className="relative w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 hover:text-slate-600 transition-all">
              <Bell className="w-5 h-5" />
              <div className="absolute top-2.5 right-2.5 w-2 h-2 bg-rose-500 border-2 border-white rounded" />
            </button>

            <div className="flex items-center gap-3 pl-6">
              <button 
                onClick={() => setActiveView('profile')}
                className="flex items-center gap-3 bg-slate-50 p-2 pr-4 rounded-xl border border-slate-100 hover:bg-slate-100 transition-all group"
              >
                <div className="w-8 h-8 rounded-xl bg-slate-200 flex items-center justify-center text-slate-400 group-hover:bg-blue-600 group-hover:text-white transition-all overflow-hidden">
                  <User className="w-5 h-5" />
                </div>
                <span className="text-xs font-black text-slate-600 lowercase tracking-tight">{user.name}</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dynamic View Rendering */}
        <div className="relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeView}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {activeView === 'dashboard' && (
                user.role === 'teacher'
                  ? <TeacherDashboard user={user} />
                  : <StudentDashboard user={user} />
              )}
              {activeView === 'feedback' && <FeedbackView user={user} />}
              {activeView === 'assignments' && <AssignmentsView user={user} />}
              {activeView === 'complaints' && <ComplaintsView user={user} />}
              {activeView === 'profile' && <ProfileView user={user} />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
