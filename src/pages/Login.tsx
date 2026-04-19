import { useState } from 'react';
import { LogIn, User, ShieldCheck, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login({ onLogin }: { onLogin: (user: any) => void }) {
  const [role, setRole] = useState<'student' | 'teacher'>('student');
  const [id, setId] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, password, role }),
      });
      const data = await res.json();
      if (data.success) {
        onLogin(data.user);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Connection failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-[#e8f0ff] to-[#f4f7ff] flex flex-col items-center justify-center p-4 overflow-hidden">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="w-14 h-14 bg-gradient-to-tr from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-2xl shadow-blue-200 mx-auto mb-4 transform transition-hover hover:rotate-6">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-2xl font-black text-slate-800 tracking-tight mb-1">Smart Academic</h1>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Management System v2.0</p>
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }} 
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md"
      >
        <div className="bg-white/80 backdrop-blur-xl border border-white rounded-2xl shadow-2xl shadow-blue-900/10 p-8 md:p-10 relative overflow-hidden">
          
          {/* Action Tabs */}
          <div className="flex p-1.5 bg-slate-100/50 backdrop-blur-sm rounded-xl mb-8">
            <button 
              type="button"
              onClick={() => setRole('student')}
              className={`flex-1 py-3 px-4 rounded-lg text-[10px] font-black transition-all flex items-center justify-center gap-2 ${
                role === 'student' ? 'bg-white text-blue-600 shadow-md' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <User className="w-4 h-4" />
              Student
            </button>
            <button 
              type="button"
              onClick={() => setRole('teacher')}
              className={`flex-1 py-3 px-4 rounded-lg text-[10px] font-black transition-all flex items-center justify-center gap-2 ${
                role === 'teacher' ? 'bg-white text-purple-600 shadow-md' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              Teacher
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-6">
              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-3 mb-2">Username / ID</label>
                <div className="relative group">
                  <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Enter your university ID"
                    className="w-full pl-14 pr-6 py-4 bg-[#f8faff] border border-slate-100 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-bold placeholder:text-slate-300 shadow-inner"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest pl-3 mb-2">Secured Password</label>
                <div className="relative group">
                  <LogIn className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    className="w-full pl-14 pr-6 py-4 bg-[#f8faff] border border-slate-100 rounded-xl outline-none focus:border-blue-500 focus:bg-white transition-all text-sm font-bold placeholder:text-slate-300 shadow-inner"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            {error && <p className="text-rose-500 text-[10px] font-black bg-rose-50 p-4 rounded-lg text-center border border-rose-100 animate-pulse">{error}</p>}

            <button 
              type="submit" 
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-black text-white shadow-xl flex items-center justify-center gap-3 transition-all hover:scale-105 active:scale-95 disabled:opacity-50 ${
                role === 'student' 
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 shadow-blue-500/40' 
                  : 'bg-gradient-to-r from-purple-600 to-purple-500 shadow-purple-500/40'
              }`}
            >
              <span className="text-xs tracking-wide uppercase">Login to Portal ➜</span>
            </button>

            <button type="button" className="w-full text-[10px] font-black text-slate-400 hover:text-slate-600 transition-colors py-1 uppercase tracking-widest">
              Forgot your ID / Password?
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
