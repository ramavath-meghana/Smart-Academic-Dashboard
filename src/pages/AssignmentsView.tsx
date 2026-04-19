import { useState, useEffect } from 'react';
import { 
  Plus, 
  Calendar, 
  BookOpen, 
  Users, 
  Clock,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Clock3
} from 'lucide-react';

export default function AssignmentsView({ user }: { user: any }) {
  const [assignments, setAssignments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAssignments = () => {
    fetch(user.role === 'student' ? `/api/student-data/${user.id}` : '/api/complaints') // Mocking endpoint logic for demo
      .then(res => res.json())
      .then(d => {
        // In a real app we'd have a specific endpoint, but let's mock it for the demo visuals
        setAssignments(d.assignments || [
          { id: 1, title: 'Database Assignment', subject: 'Database Systems', due_date: '2026-04-25', status: 'Pending' },
          { id: 2, title: 'Web Development', subject: 'CSE Lab', due_date: '2026-04-22', status: 'In Progress' },
          { id: 3, title: 'Math Homework', subject: 'Discrete Math', due_date: '2026-04-20', status: 'Completed' }
        ]);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAssignments();
  }, [user.id, user.role]);

  if (loading) return null;

  if (user.role === 'teacher') return <TeacherAssignmentsView onRefresh={fetchAssignments} />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
      {assignments.map((asgn) => (
        <div key={asgn.id} className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100 flex flex-col h-full group hover:shadow-2xl hover:shadow-blue-900/5 transition-all">
          <div className="flex items-center gap-6 mb-8">
            <div className={`w-14 h-14 rounded-[22px] flex items-center justify-center shadow-md ${
              asgn.subject.includes('Database') ? 'bg-orange-500 text-white' :
              asgn.subject.includes('Web') ? 'bg-blue-600 text-white' :
              'bg-emerald-600 text-white'
            }`}>
              {asgn.subject.includes('Database') ? <BookOpen className="w-7 h-7" /> :
               asgn.subject.includes('Web') ? <Users className="w-7 h-7" /> :
               <TrendingUp className="w-7 h-7" />}
            </div>
            <div>
              <h3 className="text-sm font-black text-slate-800 tracking-tight">{asgn.title}</h3>
              <p className="text-[10px] font-black text-slate-400 uppercase mt-1 tracking-widest">{asgn.subject}</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mb-10 text-xs font-black text-slate-500 uppercase tracking-widest bg-slate-50 p-4 rounded-2xl border border-slate-100">
            <Calendar className="w-5 h-5 text-slate-300" />
            Due: <span className="text-slate-700">{asgn.due_date}</span>
          </div>

          <div className="mt-auto">
            <div className={`w-full py-5 rounded-[22px] font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-4 transition-all shadow-xl ${
              asgn.status === 'Pending' ? 'bg-orange-500 text-white shadow-orange-500/30' :
              asgn.status === 'In Progress' ? 'bg-blue-600 text-white shadow-blue-500/30' :
              'bg-emerald-500 text-white shadow-emerald-500/30'
            }`}>
              {asgn.status === 'Completed' && <CheckCircle2 className="w-5 h-5" />}
              {asgn.status === 'In Progress' && <Clock3 className="w-5 h-5" />}
              {asgn.status}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TeacherAssignmentsView({ onRefresh }: { onRefresh: () => void }) {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('Software Engineering');
  const [date, setDate] = useState('');
  const [desc, setDesc] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, subject, due_date: date, description: desc })
      });
      setTitle('');
      setDesc('');
      onRefresh();
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
      {/* Post New Assignment */}
      <div className="lg:col-span-5">
        <div className="bg-white rounded-[40px] p-12 shadow-sm border border-slate-100 sticky top-10">
          <div className="flex items-center gap-6 mb-12">
            <div className="w-14 h-14 bg-purple-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
              <Plus className="w-8 h-8" />
            </div>
            <h2 className="text-lg font-black text-slate-800 tracking-tight">Post New Assignment</h2>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-1">Assignment Title</label>
              <input 
                type="text" 
                placeholder="e.g. Unit 3 Quiz"
                className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[28px] outline-none text-sm font-bold text-slate-700 focus:bg-white focus:border-purple-400 transition-all shadow-inner"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-1">Subject</label>
              <select 
                className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[28px] outline-none text-sm font-bold text-slate-700 focus:bg-white focus:border-purple-400 transition-all shadow-inner"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                <option>Software Engineering</option>
                <option>Database Systems</option>
                <option>Computer Networks</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-1">Due Date</label>
              <input 
                type="date" 
                className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[28px] outline-none text-sm font-bold text-slate-700 focus:bg-white focus:border-purple-400 transition-all shadow-inner"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-1">Description</label>
              <textarea 
                placeholder="Instructions for students..."
                className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[28px] outline-none text-sm font-bold text-slate-700 focus:bg-white focus:border-purple-400 transition-all shadow-inner h-32 resize-none"
                value={desc}
                onChange={(e) => setDesc(e.target.value)}
              />
            </div>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 bg-purple-600 text-white rounded-[32px] text-xs font-black uppercase tracking-widest shadow-2xl shadow-purple-500/30 flex items-center justify-center gap-4 transition-all hover:bg-purple-700 disabled:opacity-50 hover:scale-105 active:scale-95"
            >
              Post Assignment
            </button>
          </form>
        </div>
      </div>

      {/* Active Assignments List */}
      <div className="lg:col-span-7 space-y-10">
        <div className="flex items-center gap-4 mb-4 px-1">
          <Clock className="w-6 h-6 text-purple-600" />
          <h2 className="text-lg font-black text-slate-800 tracking-tight">Active Assignments</h2>
        </div>

        {[1, 2, 3].map((_, i) => (
          <div key={i} className="bg-white rounded-[40px] p-10 shadow-sm border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:shadow-2xl hover:shadow-purple-900/5 transition-all">
            <div className="flex items-center gap-8">
              <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-[26px] flex items-center justify-center border-2 border-blue-100 shadow-sm">
                <BookOpen className="w-8 h-8" />
              </div>
              <div>
                <h4 className="text-sm font-black text-slate-800 tracking-tight mb-2">{i === 0 ? 'Agile Methodology Report' : i === 1 ? 'Process Scheduling Quiz' : 'Binary Search Tree Implementation'}</h4>
                <div className="flex flex-wrap items-center gap-6">
                  <span className="text-[10px] font-black text-blue-600 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
                    28/40 <span className="text-slate-400 font-bold">Submissions</span>
                  </span>
                  <span className="text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2">
                    <div className="w-1.5 h-1.5 bg-rose-500 rounded-full" />
                    Due: April 25, 2026
                  </span>
                </div>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="px-8 py-4 bg-slate-100 hover:bg-slate-200 rounded-[20px] text-[10px] font-black text-slate-600 uppercase tracking-widest transition-all">View</button>
              <button className="px-8 py-4 bg-purple-600 text-white hover:bg-purple-700 rounded-[20px] text-[10px] font-black uppercase tracking-widest transition-all shadow-lg shadow-purple-500/20">Grade</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
