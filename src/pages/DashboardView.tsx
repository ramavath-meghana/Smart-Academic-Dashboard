import { useState, useEffect } from 'react';
import { Clock, MapPin, BookOpen, GraduationCap, Calendar, Zap, ClipboardList, Users } from 'lucide-react';
import { motion } from 'motion/react';

export default function DashboardView({ user }: { user: any }) {
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

  if (loading) return null;

  const isStudent = user.role === 'student';

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Schedule Section */}
      <div className={isStudent ? "lg:col-span-8" : "lg:col-span-12"}>
        <div className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-50 h-full">
          <div className="flex items-center justify-between mb-10">
            <h2 className="text-base font-black text-slate-800 tracking-tight">Today's Schedule</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
              {isStudent ? '2ND YEAR CSE A, 105, PARK, 39' : 'SENIOR PROFESSOR - DEPT. OF CSE'}
            </p>
          </div>

          <div className="space-y-6">
            {data.timetable.slice(0, 3).map((item: any, idx: number) => (
              <div key={idx} className="flex items-center gap-6 group">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                  idx === 0 ? 'bg-[#5c67f2] text-white' : 
                  idx === 1 ? 'bg-orange-500 text-white' : 
                  'bg-[#a855f7] text-white'
                }`}>
                  <BookOpen className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h4 className="text-xs font-black text-slate-800 tracking-tight">{item.subject}</h4>
                  <p className="text-[10px] font-bold text-slate-400 mt-0.5">{item.room || 'CSE Lab'}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{item.time || '10:30 - 11:30 AM'}</span>
                </div>
              </div>
            ))}
          </div>

          {!isStudent && (
             <div className="mt-12 text-right">
                <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Activate Windows</p>
                <p className="text-[8px] font-bold text-slate-300 uppercase mt-1">Go to Settings to activate Windows.</p>
             </div>
          )}
        </div>
      </div>

      {/* Stats Section - ONLY FOR STUDENT */}
      {isStudent && (
        <div className="lg:col-span-4 grid grid-cols-2 gap-6">
          <StatCard value="9.2" label="Current CGPA" color="text-blue-600" />
          <StatCard value="98%" label="Attendance" color="text-[#a855f7]" />
          <StatCard value="12" label="Pending Tasks" color="text-emerald-500" />
          <StatCard value="45" label="Total Credits" color="text-orange-500" />
          
          <div className="col-span-2 mt-4 text-right">
            <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">Activate Windows</p>
            <p className="text-[8px] font-bold text-slate-300 uppercase mt-1">Go to Settings to activate Windows.</p>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ value, label, color }: { value: string, label: string, color: string }) {
  return (
    <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-50 flex flex-col items-center justify-center text-center hover:scale-105 transition-transform cursor-pointer">
      <h2 className={`text-2xl font-black ${color} mb-1`}>{value}</h2>
      <p className="text-[8px] font-black text-slate-400 uppercase tracking-widest">{label}</p>
    </div>
  );
}
