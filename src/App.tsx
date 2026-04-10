/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, FormEvent } from 'react';
import { 
  GraduationCap, User, Lock, LogIn, 
  Loader2, LogOut, BookOpen, Users, 
  Calendar, CheckCircle2, MessageSquare, AlertCircle,
  Search, Bell, Clock, Mail, Phone, MapPin, 
  Award, Book, ShieldCheck
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
      setIsLoading(true); // Keep loading for a bit
      setTimeout(() => {
        setIsLoading(false);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }, 800);
    }, 200);
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
          {/* Logo Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-4 rounded-2xl shadow-2xl shadow-blue-500/20 mb-4">
              <GraduationCap className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Smart Academic</h1>
            <p className="text-slate-500 text-sm mt-1 uppercase tracking-widest font-medium">Dashboard v3.0</p>
          </div>

          {/* Login Card */}
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-[32px] shadow-2xl border border-white">
            {/* Role Selection */}
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

            <div className="mt-8 text-center">
              <a href="#" className="text-sm text-slate-400 hover:text-slate-600 transition-colors">Forgot credentials?</a>
            </div>
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
            <div className="w-20 h-20 rounded-2xl bg-white/10 p-1 border border-white/20 flex items-center justify-center">
              <User className="w-10 h-10 text-white/50" />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-400 border-2 border-[#6366f1] rounded-full" />
            <div className="absolute inset-0 bg-black/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <span className="text-[10px] font-bold uppercase tracking-tighter">View</span>
            </div>
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
            { name: 'Complaint & Request Box', icon: AlertCircle },
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
        {/* Top Bar */}
        <header className="bg-white/50 backdrop-blur-md px-8 py-4 flex items-center justify-between sticky top-0 z-10 border-b border-slate-200">
          <h2 className="text-xl font-bold text-slate-800">{activeTab}</h2>
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500/20 w-64"
              />
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 hover:bg-slate-200 rounded-full transition-colors">
                <Bell className="w-5 h-5 text-slate-600" />
                <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">34</span>
              </button>
              <div className="h-8 w-[1px] bg-slate-200 mx-2" />
              <button 
                onClick={() => setActiveTab('Profile')}
                className="flex items-center gap-3 hover:bg-slate-100 p-1 pr-3 rounded-xl transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-slate-200 flex items-center justify-center">
                  <User className="w-4 h-4 text-slate-400" />
                </div>
                <span className="text-sm font-bold text-slate-700 hidden sm:block">{username || 'Ananya Sharma'}</span>
              </button>
            </div>
          </div>
        </header>

        <div className="p-8">
          <AnimatePresence mode="wait">
            {activeTab === 'Dashboard' && (
              <motion.div 
                key="dashboard"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`grid grid-cols-1 ${role === 'student' ? 'lg:grid-cols-2' : ''} gap-8`}
              >
                {/* Schedule Section */}
                <section className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-8">
                    <h3 className="text-xl font-bold">Today's Schedule</h3>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                      {role === 'student' ? '2nd Year CSE A, 10S, Park, 39' : 'Senior Professor - Dept. of CSE'}
                    </span>
                  </div>
                  <div className="space-y-4">
                    {[
                      { subject: "Software Engineering", time: "10:30 - 11:30 AM", room: "CSE Lab", icon: BookOpen, color: "bg-blue-500" },
                      { subject: "Business Economics", time: "12:30 - 2:00 PM", room: "Commerce Block", icon: Users, color: "bg-orange-500" },
                      { subject: "Data Structures", time: "3:00 - 4:30 PM", room: "Lab 2", icon: Clock, color: "bg-purple-500" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50 rounded-2xl transition-all group cursor-pointer">
                        <div className={`${item.color} p-3 rounded-xl text-white shadow-lg shadow-${item.color.split('-')[1]}-500/20`}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800">{item.subject}</h4>
                          <p className="text-xs text-slate-500">{item.room}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs font-bold text-slate-400 uppercase">{item.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                {role === 'student' && (
                  <>
                    {/* Quick Stats for Student */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex flex-col items-center justify-center">
                        <p className="text-3xl font-black text-blue-600">9.2</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Current CGPA</p>
                      </div>
                      <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex flex-col items-center justify-center">
                        <p className="text-3xl font-black text-purple-600">98%</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Attendance</p>
                      </div>
                      <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex flex-col items-center justify-center">
                        <p className="text-3xl font-black text-emerald-600">12</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pending Tasks</p>
                      </div>
                      <div className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 flex flex-col items-center justify-center">
                        <p className="text-3xl font-black text-amber-600">45</p>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Credits</p>
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {activeTab === 'Classroom Feedback' && (
              <motion.div 
                key="feedback"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {role === 'student' ? (
                  <section className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                    <h3 className="text-xl font-bold mb-8">Submit Class Feedback</h3>
                    <div className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Select Subject</label>
                          <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none">
                            <option>Software Engineering (SE)</option>
                            <option>Business Economics</option>
                            <option>Data Structures</option>
                            <option>Operating Systems</option>
                            <option>Computer Networks</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Class Time</label>
                          <div className="w-full p-4 bg-slate-100 border border-slate-200 rounded-2xl text-sm text-slate-500 flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            08:30 - 10:15 AM
                          </div>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <button className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2">
                          <CheckCircle2 className="w-4 h-4" /> Understood
                        </button>
                        <button className="flex-1 bg-amber-500 hover:bg-amber-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2">
                          <AlertCircle className="w-4 h-4" /> Confused
                        </button>
                        <button className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-3 rounded-xl font-bold text-sm shadow-lg shadow-rose-500/20 transition-all flex items-center justify-center gap-2">
                          <Clock className="w-4 h-4" /> Too Fast
                        </button>
                      </div>
                      <div className="relative">
                        <textarea 
                          placeholder="Type your doubt or specific question..." 
                          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 min-h-[150px] outline-none"
                        />
                        <button 
                          onClick={handleAction}
                          className="absolute bottom-4 right-4 bg-blue-600 text-white px-6 py-2 rounded-xl font-bold text-sm shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-colors"
                        >
                          {isLoading ? 'Submitting...' : 'Submit Feedback'}
                        </button>
                      </div>
                      {showSuccess && (
                        <motion.p 
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="text-emerald-600 text-sm font-bold text-center"
                        >
                          Feedback submitted successfully!
                        </motion.p>
                      )}
                    </div>
                  </section>
                ) : (
                  <div className="grid grid-cols-1 gap-8">
                    {/* Feedback Summary for Teacher */}
                    <section className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                      <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-bold">Student Understanding Summary</h3>
                        <div className="bg-blue-50 px-4 py-1 rounded-full">
                          <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">Software Engineering - Section A</span>
                        </div>
                      </div>
                      <div className="grid grid-cols-3 gap-8 mb-8 text-center">
                        <div>
                          <p className="text-4xl font-black text-emerald-500">70%</p>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Understood</p>
                        </div>
                        <div>
                          <p className="text-4xl font-black text-amber-500">20%</p>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Confused</p>
                        </div>
                        <div>
                          <p className="text-4xl font-black text-rose-500">10%</p>
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Too Fast</p>
                        </div>
                      </div>
                      <div className="w-full h-6 bg-slate-100 rounded-full overflow-hidden flex mb-10 shadow-inner">
                        <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: '70%' }} />
                        <div className="h-full bg-amber-500 transition-all duration-500" style={{ width: '20%' }} />
                        <div className="h-full bg-rose-500 transition-all duration-500" style={{ width: '10%' }} />
                      </div>
                      
                      <div className="space-y-6">
                        <h4 className="font-bold text-slate-800 flex items-center gap-2">
                          <MessageSquare className="w-5 h-5 text-blue-500" />
                          Recent Student Doubts
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {[
                            { doubt: "Could you explain the Agile Manifesto principles again?", student: "Rahul M.", time: "2m ago" },
                            { doubt: "Difference between Spiral and Incremental models?", student: "Sanjana K.", time: "5m ago" },
                            { doubt: "Is Waterfall still used in modern industry?", student: "Amit S.", time: "12m ago" },
                            { doubt: "How to handle scope creep in SE projects?", student: "Priya V.", time: "15m ago" },
                          ].map((item, i) => (
                            <div key={i} className="p-5 bg-slate-50 rounded-2xl border border-slate-100 hover:border-blue-200 transition-colors">
                              <p className="text-sm font-medium text-slate-700 mb-3 italic">"{item.doubt}"</p>
                              <div className="flex justify-between items-center">
                                <span className="text-xs font-bold text-slate-400">{item.student}</span>
                                <span className="text-[10px] font-bold text-slate-300 uppercase">{item.time}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </section>
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'Assignment Tracker' && (
              <motion.div 
                key="assignments"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-8"
              >
                {role === 'teacher' ? (
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Post New Assignment Form */}
                    <section className="lg:col-span-1 bg-white p-8 rounded-[32px] shadow-sm border border-slate-100 h-fit sticky top-24">
                      <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <BookOpen className="w-5 h-5 text-purple-500" />
                        Post New Assignment
                      </h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Assignment Title</label>
                          <input type="text" placeholder="e.g. Unit 3 Quiz" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-purple-500/20" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Subject</label>
                          <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-purple-500/20 appearance-none">
                            <option>Software Engineering</option>
                            <option>Data Structures</option>
                            <option>Operating Systems</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Due Date</label>
                          <input type="date" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-purple-500/20" />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-slate-400 uppercase mb-2 ml-1">Description</label>
                          <textarea placeholder="Instructions for students..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-purple-500/20 min-h-[100px]" />
                        </div>
                        
                        {/* Automatic Reminders Feature */}
                        <div className="bg-purple-50 p-4 rounded-2xl border border-purple-100 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Bell className="w-4 h-4 text-purple-600" />
                              <span className="text-xs font-bold text-purple-900 uppercase tracking-wider">Auto Reminders</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input type="checkbox" className="sr-only peer" defaultChecked />
                              <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-600"></div>
                            </label>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <select className="bg-white border border-purple-200 rounded-lg text-[10px] font-bold p-2 outline-none">
                              <option>2 Days Before</option>
                              <option>1 Day Before</option>
                              <option>6 Hours Before</option>
                            </select>
                            <select className="bg-white border border-purple-200 rounded-lg text-[10px] font-bold p-2 outline-none">
                              <option>Every 12 Hours</option>
                              <option>Once Daily</option>
                            </select>
                          </div>
                        </div>

                        <button 
                          onClick={handleAction}
                          className="w-full bg-purple-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-purple-500/20 hover:bg-purple-700 transition-colors"
                        >
                          {isLoading ? 'Posting...' : 'Post Assignment'}
                        </button>
                        {showSuccess && (
                          <p className="text-emerald-600 text-xs font-bold text-center">Assignment posted and reminders scheduled!</p>
                        )}
                      </div>
                    </section>

                    {/* List of Assigned Tasks */}
                    <section className="lg:col-span-2 space-y-6">
                      <h3 className="text-xl font-bold flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        Active Assignments
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[
                          { title: "Agile Methodology Report", subject: "SE", submissions: "28/40", date: "April 25, 2024", color: "bg-blue-500" },
                          { title: "Binary Search Tree Implementation", subject: "DS", submissions: "12/40", date: "April 28, 2024", color: "bg-purple-500" },
                          { title: "Process Scheduling Quiz", subject: "OS", submissions: "35/40", date: "April 23, 2024", color: "bg-orange-500" },
                        ].map((item, i) => (
                          <div key={i} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100 hover:border-purple-200 transition-all group">
                            <div className="flex items-center justify-between mb-6">
                              <div className="flex items-center gap-3">
                                <div className={`${item.color} p-2 rounded-lg text-white`}>
                                  <BookOpen className="w-4 h-4" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-slate-800">{item.title}</h4>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.subject}</p>
                                </div>
                              </div>
                            </div>
                            <div className="space-y-4">
                              <div className="flex justify-between items-end">
                                <div>
                                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Submissions</p>
                                  <p className="text-lg font-black text-slate-700">{item.submissions}</p>
                                </div>
                                <div className="text-right">
                                  <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Due Date</p>
                                  <p className="text-xs font-bold text-slate-600">{item.date}</p>
                                </div>
                              </div>
                              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className={`h-full ${item.color}`} 
                                  style={{ width: `${(parseInt(item.submissions.split('/')[0]) / parseInt(item.submissions.split('/')[1])) * 100}%` }} 
                                />
                              </div>
                              <div className="flex gap-2">
                                <button className="flex-1 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors">View Details</button>
                                <button className="flex-1 py-2 bg-slate-50 text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-100 transition-colors">Grade All</button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      { title: "Database Assignment", status: "Pending", date: "April 25, 2024", color: "bg-orange-500" },
                      { title: "Web Development", status: "In Progress", date: "April 28, 2024", color: "bg-blue-500" },
                      { title: "Math Homework", status: "Completed", date: "April 23, 2024", color: "bg-emerald-500" },
                    ].map((item, i) => (
                      <div key={i} className="bg-white p-6 rounded-[32px] shadow-sm border border-slate-100">
                        <div className="flex items-center gap-3 mb-6">
                          <div className={`${item.color} p-2 rounded-lg text-white`}>
                            <BookOpen className="w-5 h-5" />
                          </div>
                          <h4 className="font-bold">{item.title}</h4>
                        </div>
                        <div className="space-y-4">
                          <div className="flex justify-between text-xs font-bold text-slate-400">
                            <span>Due Date: {item.date}</span>
                          </div>
                          <button className={`w-full py-3 rounded-xl font-bold text-white shadow-lg transition-all ${
                            item.status === 'Pending' ? 'bg-orange-500 shadow-orange-500/20' :
                            item.status === 'In Progress' ? 'bg-blue-500 shadow-blue-500/20' :
                            'bg-emerald-500 shadow-emerald-500/20'
                          }`}>
                            {item.status}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'Complaint & Request Box' && (
              <motion.div 
                key="complaints"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8"
              >
                <section className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                  <h3 className="text-xl font-bold mb-8">Submit a Complaint</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Issue Title</label>
                      <input type="text" placeholder="e.g. Projector not working in Room 204" className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Description</label>
                      <textarea placeholder="Describe the issue in detail..." className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 min-h-[150px]" />
                    </div>
                    <button 
                      onClick={handleAction}
                      className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-colors"
                    >
                      {isLoading ? 'Submitting...' : 'Submit Complaint'}
                    </button>
                    {showSuccess && <p className="text-emerald-600 text-sm font-bold text-center mt-2">Complaint submitted successfully!</p>}
                  </div>
                </section>

                <section className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                  <h3 className="text-xl font-bold mb-8">Leave Request</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Reason for Leave</label>
                      <select className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20 appearance-none">
                        <option>Medical Appointment</option>
                        <option>Family Emergency</option>
                        <option>Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Date</label>
                      <div className="relative">
                        <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                        <input type="date" className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-sm outline-none focus:ring-2 focus:ring-blue-500/20" />
                      </div>
                    </div>
                    <button 
                      onClick={handleAction}
                      className="w-full bg-purple-600 text-white py-4 rounded-2xl font-bold shadow-lg shadow-purple-500/20 hover:bg-purple-700 transition-colors"
                    >
                      {isLoading ? 'Submitting...' : 'Submit Leave Request'}
                    </button>
                    {showSuccess && <p className="text-emerald-600 text-sm font-bold text-center mt-2">Leave request submitted!</p>}
                  </div>
                </section>
              </motion.div>
            )}

            {activeTab === 'Profile' && (
              <motion.div 
                key="profile"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 lg:grid-cols-3 gap-8"
              >
                {/* Profile Header Card */}
                <div className="lg:col-span-3 bg-gradient-to-r from-[#6366f1] to-[#8b5cf6] p-10 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32 blur-3xl" />
                   <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                     <div className="w-32 h-32 rounded-[32px] bg-white/10 border-4 border-white/20 shadow-2xl flex items-center justify-center">
                       <User className="w-16 h-16 text-white/30" />
                     </div>
                     <div className="text-center md:text-left">
                       <h2 className="text-4xl font-black mb-2">{username || 'Ananya Sharma'}</h2>
                       <div className="flex flex-wrap justify-center md:justify-start gap-4">
                         <span className="bg-white/20 px-4 py-1 rounded-full text-sm font-bold backdrop-blur-md border border-white/10">
                           {role === 'student' ? 'Student ID: #2026001' : 'Employee ID: #T-2026-042'}
                         </span>
                         <span className="bg-white/20 px-4 py-1 rounded-full text-sm font-bold backdrop-blur-md border border-white/10">
                           {role === 'student' ? 'CGPA: 9.2 / 10.0' : 'Senior Professor'}
                         </span>
                       </div>
                     </div>
                   </div>
                </div>

                {/* Personal Details */}
                <div className="lg:col-span-2 space-y-8">
                  <section className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-500" />
                      Personal Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Full Name</p>
                        <p className="font-bold text-slate-800">{username || 'Ananya Sharma'}</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                        <p className="font-bold text-slate-800">{username.toLowerCase() || 'ananya'}@academic.edu</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Phone Number</p>
                        <p className="font-bold text-slate-800">+1 (555) 012-3456</p>
                      </div>
                      <div className="space-y-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Date of Birth</p>
                        <p className="font-bold text-slate-800">January 15, 2004</p>
                      </div>
                      <div className="space-y-1 md:col-span-2">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Address</p>
                        <p className="font-bold text-slate-800">123 University Ave, Academic City, AC 94103</p>
                      </div>
                    </div>
                  </section>

                  <section className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                    <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
                      <Award className="w-5 h-5 text-purple-500" />
                      Academic Achievements
                    </h3>
                    <div className="space-y-4">
                      {[
                        { title: 'Dean\'s List - Fall 2025', date: 'Dec 2025', desc: 'Maintained a CGPA of 9.2/10.0' },
                        { title: 'Hackathon Winner', date: 'Nov 2025', desc: 'First place in University Tech Challenge' },
                        { title: 'Research Assistant', date: 'Sept 2025', desc: 'Assisting in AI Ethics research' },
                      ].map((award, i) => (
                        <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="bg-white p-2 rounded-xl shadow-sm">
                            <Award className="w-6 h-6 text-amber-500" />
                          </div>
                          <div className="flex-1">
                            <h4 className="font-bold text-slate-800">{award.title}</h4>
                            <p className="text-xs text-slate-500">{award.desc}</p>
                          </div>
                          <p className="text-xs font-bold text-slate-400">{award.date}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Sidebar Details */}
                <div className="space-y-8">
                  <section className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                    <h3 className="text-xl font-bold mb-6">Account Status</h3>
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <ShieldCheck className="w-5 h-5 text-emerald-500" />
                          <span className="text-sm font-bold">Verified Account</span>
                        </div>
                        <div className="w-2 h-2 rounded-full bg-emerald-500" />
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Book className="w-5 h-5 text-blue-500" />
                          <span className="text-sm font-bold">Current Semester</span>
                        </div>
                        <span className="text-xs font-bold text-slate-400">Semester 4</span>
                      </div>
                      <div className="pt-4 border-t border-slate-100">
                        <button className="w-full py-3 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-colors">
                          Edit Profile
                        </button>
                      </div>
                    </div>
                  </section>

                  <section className="bg-white p-8 rounded-[32px] shadow-sm border border-slate-100">
                    <h3 className="text-xl font-bold mb-6">Quick Stats</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-blue-50 rounded-2xl text-center">
                        <p className="text-2xl font-black text-blue-600">9.2</p>
                        <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest">CGPA</p>
                      </div>
                      <div className="p-4 bg-purple-50 rounded-2xl text-center">
                        <p className="text-2xl font-black text-purple-600">98%</p>
                        <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">Attendance</p>
                      </div>
                      <div className="p-4 bg-emerald-50 rounded-2xl text-center">
                        <p className="text-2xl font-black text-emerald-600">12</p>
                        <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Courses</p>
                      </div>
                      <div className="p-4 bg-amber-50 rounded-2xl text-center">
                        <p className="text-2xl font-black text-amber-600">45</p>
                        <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest">Credits</p>
                      </div>
                    </div>
                  </section>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
