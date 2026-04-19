import { useState, FormEvent } from 'react';
import { 
  GraduationCap, User, Lock, LogIn, 
  Loader2, LogOut, BookOpen, Users, 
  Calendar, CheckCircle2, MessageSquare, AlertCircle,
  Search, Bell, Clock, Award, Book, ShieldCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Role = 'student' | 'teacher';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<Role>('student');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('Dashboard');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleAction = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    }, 1200);
  };

  const handleLogin = (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setIsLoggedIn(true);
    }, 1000);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#f8faff] relative overflow-hidden flex items-center justify-center p-4 font-sans">
        {/* Atmospheric Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-400/10 blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-400/10 blur-[120px]" />
          <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] rounded-full bg-indigo-400/5 blur-[100px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md relative z-10"
        >
          <div className="flex flex-col items-center mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl shadow-2xl shadow-blue-500/20 mb-4">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Smart Academic</h1>
            <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-medium">Dashboard v3.0</p>
          </div>

          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[32px] shadow-2xl border border-white">
            <div className="flex p-1 bg-slate-100 rounded-2xl mb-8">
              <button
                onClick={() => setRole('student')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  role === 'student' ? 'bg-white text-blue-600 shadow-lg' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <BookOpen className="w-4 h-4" />
                Student
              </button>
              <button
                onClick={() => setRole('teacher')}
                className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  role === 'teacher' ? 'bg-white text-purple-600 shadow-lg' : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                <Users className="w-4 h-4" />
                Teacher
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Username</label>
                <div className="relative">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    placeholder="Enter your ID"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 ml-1">Password</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 placeholder:text-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-4 rounded-2xl font-bold text-white shadow-xl transition-all flex items-center justify-center gap-2 group disabled:opacity-70 ${
                  role === 'student' 
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 shadow-blue-500/20 hover:shadow-blue-500/40' 
                    : 'bg-gradient-to-r from-purple-600 to-purple-500 shadow-purple-500/20 hover:shadow-purple-500/40'
                }`}
              >
                {isLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Login as {role.charAt(0).toUpperCase() + role.slice(1)}</span>
                    <LogIn className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f0f2ff] font-sans flex text-slate-800">
      {/* Sidebar */}
      <aside className="w-72 bg-gradient-to-b from-[#6366f1] to-[#8b5cf6] p-6 flex flex-col text-white shrink-0">
        <div className="flex items-center gap-3 mb-10">
          <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="font-bold text-lg tracking-tight">Smart Academic</span>
        </div>

        <div className="flex flex-col items-center mb-10">
          <button 
            onClick={() => setActiveTab('Profile')}
            className="relative mb-3 group transition-transform hover:scale-105"
          >
            <div className="w-20 h-20 rounded-2xl bg-white/10 p-1 border border-white/20 flex items-center justify-center text-white/50">
              <User className="w-10 h-10" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-[#6366f1] rounded-full" />
          </button>
          <h3 className="font-bold text-lg">{username || 'Ananya Sharma'}</h3>
          <p className="text-xs text-white/70 uppercase tracking-widest font-medium">
            {role === 'student' ? '2nd Year CSE A' : 'Senior Professor'}
          </p>
        </div>

        <nav className="space-y-2 flex-1">
          {[
            { name: 'Dashboard', icon: BookOpen },
            { name: 'Classroom Feedback', icon: MessageSquare },
            { name: 'Assignment Tracker', icon: CheckCircle2 },
            { name: 'Complaint Box', icon: AlertCircle },
          ].map((item) => (
            <button
              key={item.name}
              onClick={() => setActiveTab(item.name)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                activeTab === item.name 
                  ? 'bg-white text-[#6366f1] shadow-lg' 
                  : 'text-white/70 hover:bg-white/10 hover:text-white'
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </button>
          ))}
        </nav>

        <button 
          onClick={() => setIsLoggedIn(false)}
          className="mt-auto flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-white/70 hover:bg-white/10 hover:text-white transition-all"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto bg-[#f0f2ff]">
        <header className="bg-white/50 backdrop-blur-md px-8 py-4 flex items-center justify-between sticky top-0 z-10 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">{activeTab}</h2>
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input type="text" placeholder="Search..." className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500/20 w-64" />
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-slate-200 rounded-full transition-colors">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">3</span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'Dashboard' && (
              <motion.div key="dash" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <section className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                  <h3 className="text-xl font-bold mb-6">Today's Schedule</h3>
                  <div className="space-y-4">
                    {[
                      { subject: "Software Engineering", time: "10:30 - 11:30 AM", room: "CSE Lab", color: "bg-blue-500" },
                      { subject: "Data Structures", time: "3:00 - 4:30 PM", room: "Lab 2", color: "bg-purple-500" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all">
                        <div className={`${item.color} p-3 rounded-xl text-white`}><BookOpen className="w-5 h-5" /></div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800">{item.subject}</h4>
                          <p className="text-xs text-slate-500">{item.room}</p>
                        </div>
                        <p className="text-xs font-bold text-slate-400 uppercase">{item.time}</p>
                      </div>
                    ))}
                  </div>
                </section>
                {role === 'student' && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex flex-col items-center justify-center">
                      <p className="text-3xl font-black text-blue-600">9.2</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CGPA</p>
                    </div>
                    <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex flex-col items-center justify-center">
                      <p className="text-3xl font-black text-purple-600">98%</p>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Attendance</p>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'Classroom Feedback' && (
              <motion.div key="feed" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {role === 'student' ? (
                  <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-6">
                    <h3 className="text-xl font-bold">Submit Class Feedback</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none"><option>Software Engineering</option></select>
                      <div className="w-full p-4 bg-slate-100 border border-slate-200 rounded-2xl text-sm text-slate-500">08:30 - 10:15 AM</div>
                    </div>
                    <div className="flex gap-3">
                      <button className="flex-1 bg-emerald-500 text-white py-3 rounded-xl font-bold text-sm">Understood</button>
                      <button className="flex-1 bg-amber-500 text-white py-3 rounded-xl font-bold text-sm">Confused</button>
                      <button className="flex-1 bg-rose-500 text-white py-3 rounded-xl font-bold text-sm">Too Fast</button>
                    </div>
                    <textarea placeholder="Type your doubt..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm min-h-[150px] outline-none" />
                    <button onClick={handleAction} className="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold">{isLoading ? 'Submitting...' : 'Submit Feedback'}</button>
                    {showSuccess && <p className="text-emerald-600 font-bold text-center">Feedback sent!</p>}
                  </div>
                ) : (
                  <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-8">
                    <h3 className="text-xl font-bold text-center">Student Understanding Summary</h3>
                    <div className="grid grid-cols-3 gap-8 text-center">
                      <div><p className="text-4xl font-black text-emerald-500">70%</p><p className="text-xs font-bold text-slate-400">Understood</p></div>
                      <div><p className="text-4xl font-black text-amber-500">20%</p><p className="text-xs font-bold text-slate-400">Confused</p></div>
                      <div><p className="text-4xl font-black text-rose-500">10%</p><p className="text-xs font-bold text-slate-400">Too Fast</p></div>
                    </div>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'Assignment Tracker' && (
              <motion.div key="assign" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                {role === 'teacher' ? (
                   <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     <section className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 h-fit">
                       <h3 className="text-xl font-bold mb-6">Post Assignment</h3>
                       <div className="space-y-4">
                         <input type="text" placeholder="Title" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                         <input type="date" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                         <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 space-y-3">
                           <div className="flex justify-between items-center text-xs font-bold text-purple-900"><span>Auto Reminders</span><Bell className="w-4 h-4" /></div>
                           <select className="w-full bg-white border border-purple-200 rounded-lg p-2 text-xs font-bold"><option>1 Day Before</option></select>
                         </div>
                         <button onClick={handleAction} className="w-full bg-purple-600 text-white py-4 rounded-2xl font-bold">{isLoading ? 'Posting...' : 'Post Assignment'}</button>
                       </div>
                     </section>
                     <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          { title: "Agile Report", subject: "SE", submissions: "28/40", date: "April 25", color: "bg-blue-500" },
                          { title: "BST Impl", subject: "DS", submissions: "12/40", date: "April 28", color: "bg-purple-500" },
                        ].map((item, i) => (
                          <div key={i} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
                             <h4 className="font-bold flex items-center gap-2 mb-4"><div className={`${item.color} w-3 h-3 rounded-full`} /> {item.title}</h4>
                             <div className="flex justify-between text-xs font-bold text-slate-400 mb-2"><span>Submissions</span><span>{item.submissions}</span></div>
                             <div className="w-full h-1 bg-slate-100 rounded-full overflow-hidden"><div className={`${item.color} h-full`} style={{width: '60%'}}/></div>
                          </div>
                        ))}
                     </div>
                   </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                     {[{ title: "Database Impl", status: "Pending", date: "April 25" }].map((item, i) => (
                       <div key={i} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
                         <h4 className="font-bold mb-4">{item.title}</h4>
                         <button className="w-full py-3 rounded-xl bg-orange-500 text-white font-bold">{item.status}</button>
                       </div>
                     ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'Complaint Box' && (
              <motion.div key="comp" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                 <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 space-y-4">
                   <h3 className="text-xl font-bold">Student Complaint Box</h3>
                   <input type="text" placeholder="Issue Title" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none" />
                   <textarea placeholder="Description..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none min-h-[150px]" />
                   <button onClick={handleAction} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold">{isLoading ? 'Submitting...' : 'Submit Complaint'}</button>
                 </div>
              </motion.div>
            )}

            {activeTab === 'Profile' && (
              <motion.div key="prof" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                <div className="bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] p-10 rounded-[40px] text-white shadow-2xl flex items-center gap-8">
                   <div className="w-24 h-24 rounded-3xl bg-white/10 flex items-center justify-center text-white/50"><User className="w-12 h-12" /></div>
                   <div>
                     <h2 className="text-3xl font-black">{username || 'Ananya Sharma'}</h2>
                     <p className="text-sm font-bold opacity-70 uppercase tracking-widest">{role === 'student' ? 'ID: 24321A0563' : 'Senior Professor'}</p>
                   </div>
                </div>
                <div className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div><p className="text-xs font-bold text-slate-400">Phone</p><p className="font-bold">7382616050</p></div>
                  <div><p className="text-xs font-bold text-slate-400">Address</p><p className="font-bold">Bhoj Reddy Engineering College</p></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
