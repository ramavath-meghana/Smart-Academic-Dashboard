import { useState, useEffect } from 'react';
import { BookOpen, Calendar, CheckCircle, Clock, Award, User } from 'lucide-react';
import Navbar from '../components/Navbar';
import Card from '../components/Card';
import { motion } from 'motion/react';

export default function StudentDashboard({ user }: { user: any }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/student-data/${user.id}`)
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      });
  }, [user.id]);

  if (loading) return <div className="p-8">Loading dashboard...</div>;

  return (
    <div className="flex-1 bg-[#f0f2ff] overflow-y-auto min-h-screen">
      <Navbar title="Student Dashboard" userName={user.name} />
      
      <div className="p-8 max-w-7xl mx-auto space-y-8">
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800">Welcome Back, {user.name.split(' ')[0]}! 👋</h1>
            <p className="text-slate-500 font-medium">Here's what's happening with your academics today.</p>
          </div>
          <div className="flex gap-4">
            <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
              <span className="text-2xl font-black text-blue-600">9.2</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">CGPA</span>
            </div>
            <div className="bg-white px-6 py-3 rounded-xl shadow-sm border border-slate-100 flex flex-col items-center">
              <span className="text-2xl font-black text-purple-600">94%</span>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Attendance</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Timetable */}
          <Card title="Today's Timetable" icon={<Calendar className="w-5 h-5" />} className="lg:col-span-2">
            <div className="space-y-4">
              {data.timetable.map((item: any) => (
                <div key={item.id} className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-100 transition-hover hover:bg-white hover:shadow-md">
                  <div className="bg-blue-500 p-3 rounded-xl text-white">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-slate-800">{item.subject}</h4>
                    <p className="text-xs text-slate-500">{item.room}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-slate-400 uppercase tracking-tighter">{item.time}</p>
                    <p className="text-[10px] text-emerald-500 font-bold uppercase mt-1">Confirmed</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Results/Marks */}
          <Card title="Latest Results" icon={<Award className="w-5 h-5" />}>
            <div className="space-y-6">
              {data.marks.map((mark: any) => (
                <div key={mark.id} className="space-y-2">
                  <div className="flex justify-between text-sm font-bold">
                    <span className="text-slate-700">{mark.subject}</span>
                    <span className="text-blue-600">{mark.score}/{mark.total}</span>
                  </div>
                  <div className="w-full h-2 bg-slate-100 rounded-md overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(mark.score / mark.total) * 100}%` }}
                      className="h-full bg-blue-500 rounded-md"
                    />
                  </div>
                </div>
              ))}
              <button className="w-full py-3 mt-4 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">
                View All Results
              </button>
            </div>
          </Card>
        </div>

        {/* Profile Card Summary */}
        <Card title="Academic Profile" icon={<User className="w-5 h-5" />} className="lg:w-1/2">
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Student ID</p>
              <p className="font-bold text-slate-800">{user.id}</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Current Year</p>
              <p className="font-bold text-slate-800">3rd Year, Semester 5</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Email</p>
              <p className="font-bold text-slate-800">{user.id.toLowerCase()}@college.edu</p>
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Department</p>
              <p className="font-bold text-slate-800">CSE Department</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
