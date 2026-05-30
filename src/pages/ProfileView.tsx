import { User, Mail, Fingerprint, MapPin, Phone, ShieldCheck, GraduationCap } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

export default function ProfileView({ user }: { user: any }) {
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/student-data/${user.id}?role=${user.role}`)
      .then((res) => res.json())
      .then((d) => setProfileData(d))
      .catch(() => setProfileData(null));
  }, [user.id, user.role]);

  const isStudent = user.role === 'student';
  const attendance = `${profileData?.stats?.attendancePct ?? 0}%`;
  const average = `${profileData?.stats?.avgMarks ?? 0}%`;

  return (
    <div className="max-w-5xl mx-auto space-y-10 pb-20">
      {/* Header Profile Section */}
      <div className="bg-white rounded-xl p-12 shadow-sm border border-slate-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-r from-[#5c67f2] to-[#4e58e6]" />
        
        <div className="relative pt-12 flex flex-col md:flex-row items-center md:items-end gap-8 px-6">
          <div className="w-40 h-40 rounded-2xl bg-white p-2 shadow-2xl">
            <div className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center border-4 border-slate-50 overflow-hidden">
               <User className="w-20 h-20 text-slate-300" />
            </div>
          </div>
          
          <div className="flex-1 text-center md:text-left pb-4">
            <h1 className="text-3xl font-black text-slate-800 capitalize mb-2">{user.name}</h1>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4">
              <span className="px-5 py-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-black uppercase tracking-widest border border-blue-100">
                {user.role}
              </span>
              <span className="px-5 py-2 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-black uppercase tracking-widest border border-emerald-100">
                {isStudent ? 'Active Student' : 'Faculty Member'}
              </span>
            </div>
          </div>

          <button className="mb-4 px-10 py-5 bg-slate-800 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-slate-900 transition-all shadow-xl shadow-slate-900/10">
            Edit Information
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Basic Info */}
        <div className="lg:col-span-2 space-y-10">
          <div className="bg-white rounded-xl p-12 shadow-sm border border-slate-100">
            <h2 className="text-lg font-black text-slate-800 tracking-tight mb-10">Personal Details</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              <InfoItem icon={Fingerprint} label={isStudent ? 'Student ID' : 'Faculty ID'} value={user.id} />
              <InfoItem icon={Mail} label="Academic Email" value={user.email || `${user.id.toLowerCase()}@university.edu`} />
              <InfoItem icon={GraduationCap} label="Course / Branch" value={user.department || 'Computer Science & Engineering'} />
              <InfoItem icon={ShieldCheck} label={isStudent ? 'Current Semester' : 'Designation'} value={isStudent ? 'II B.Tech II Semester' : 'Assistant Professor'} />
              <InfoItem icon={Phone} label="Contact Number" value={user.phone || "+91 0000000000"} />
              <InfoItem icon={MapPin} label="Local Address" value={user.address || "Not provided"} />            </div>
          </div>

          <div className="bg-white rounded-xl p-12 shadow-sm border border-slate-100">
            <h2 className="text-lg font-black text-slate-800 tracking-tight mb-8">Bio / Summary</h2>
            <p className="text-sm font-bold text-slate-400 leading-relaxed italic">
              {isStudent
                ? '"Enthusiastic computer science student with a passion for web technologies and database management."'
                : '"Faculty mentor focused on student outcomes, project mentoring, and applied learning."'}
            </p>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="space-y-10">
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 rounded-xl p-10 text-white shadow-2xl shadow-blue-900/20">
            <h3 className="text-base font-black mb-8 tracking-tight">Academic Progress</h3>
            <div className="space-y-8">
              <ProgressItem label="Attendance" value={attendance} />
              <ProgressItem label="Average Marks" value={average} />
              <ProgressItem label="Course Completion" value={isStudent ? '45%' : '78%'} />
            </div>
          </div>

          {isStudent && (
                <div className="bg-slate-900 rounded-xl p-10 text-white shadow-2xl shadow-slate-900/20">
                <h3 className="text-base font-black mb-6 tracking-tight">Guardian Contact</h3>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Name</p>
                <p className="text-sm font-bold mb-6">{user.parent_name || "Not provided"}</p>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Relationship</p>
                <p className="text-sm font-bold">{user.parent_relation || "Not provided"}</p>
                <p className="text-[10px] font-black text-white/40 uppercase tracking-widest mb-1">Contact Number</p>
                <p className="text-sm font-bold">{user.parent_phone || "Not provided"}</p>
          </div>
)}
        </div>
      </div>
    </div>
  );
}

function InfoItem({ icon: Icon, label, value }: { icon: any, label: string, value: string }) {
  return (
    <div className="flex items-start gap-6 group">
      <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-lg flex items-center justify-center border border-slate-100 group-hover:bg-blue-50 group-hover:text-blue-600 group-hover:border-blue-100 transition-all">
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
        <p className="text-sm font-bold text-slate-700">{value}</p>
      </div>
    </div>
  );
}

function ProgressItem({ label, value }: { label: string, value: string }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-[10px] font-black text-white/60 uppercase tracking-widest">{label}</span>
        <span className="text-xs font-black text-white">{value}</span>
      </div>
      <div className="h-2 w-full bg-white/10 rounded-md overflow-hidden">
        <motion.div 
          initial={{ width: 0 }}
          animate={{ width: value }}
          className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
        />
      </div>
    </div>
  );
}
