import { useState, useEffect, FormEvent } from 'react';
import { Users, CheckCircle, Award, Plus, Loader2, Search } from 'lucide-react';
import Card from '../components/Card';

export default function TeacherDashboard({ user }: { user: any }) {
  const [students, setStudents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeAction, setActiveAction] = useState<'attendance' | 'marks' | 'register'>('attendance');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState('');

  // Form states
  const [studentId, setStudentId] = useState('');
  const [studentName, setStudentName] = useState('');
  const [subject, setSubject] = useState('Software Engineering');
  const [value, setValue] = useState(''); // Status or Score
  const [regPassword, setRegPassword] = useState('password123');

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = () => {
    setLoading(true);
    setError('');
    fetch('/api/students')
      .then((res) => res.json().then((body) => ({ ok: res.ok, body })))
      .then(({ ok, body }) => {
        if (!ok || body?.success === false) {
          setStudents([]);
          setError(body?.message || 'Could not load students.');
          return;
        }
        setStudents(Array.isArray(body) ? body : []);
      })
      .catch(() => setError('Could not reach the server.'))
      .finally(() => setLoading(false));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess('');

    let endpoint = '';
    let body = {};

    if (activeAction === 'attendance') {
      endpoint = '/api/attendance';
      body = { studentId, subject, date: new Date().toISOString().split('T')[0], status: value || 'Present' };
    } else if (activeAction === 'marks') {
      endpoint = '/api/marks';
      body = { studentId, subject, score: parseInt(value), total: 100 };
    } else {
      endpoint = '/api/register-student';
      body = { id: studentId, name: studentName, password: regPassword };
    }

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      
      if (data.success) {
        setSuccess(`${activeAction.charAt(0).toUpperCase() + activeAction.slice(1)} recorded successfully!`);
        if (activeAction === 'register') {
          fetchStudents();
          setStudentName('');
        }
        setValue('');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setSuccess('Error: ' + data.message);
      }
    } catch (err) {
      console.error(err);
      setSuccess('Connection error');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl p-10 shadow-sm border border-slate-50 text-center">
        <p className="text-sm font-bold text-slate-400">Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
        {error && (
          <div className="bg-white rounded-xl p-6 shadow-sm border border-rose-100 text-center">
            <p className="text-xs font-bold text-rose-600">{error}</p>
          </div>
        )}
        {/* Welcome Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-800">Faculty Hub 🍎</h1>
            <p className="text-slate-500 font-medium">Manage your classes, students, and academic records.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Action Form */}
          <Card title={`Manage ${activeAction.charAt(0).toUpperCase() + activeAction.slice(1)}`} icon={<Plus className="w-5 h-5" />}>
            <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
              <button 
                onClick={() => setActiveAction('attendance')}
                className={`flex-1 py-3 rounded-xl text-[10px] font-bold transition-all ${activeAction === 'attendance' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}`}
              >
                Attendance
              </button>
              <button 
                onClick={() => setActiveAction('marks')}
                className={`flex-1 py-3 rounded-xl text-[10px] font-bold transition-all ${activeAction === 'marks' ? 'bg-white text-purple-600 shadow-sm' : 'text-slate-500'}`}
              >
                Marks
              </button>
              <button 
                onClick={() => setActiveAction('register')}
                className={`flex-1 py-3 rounded-xl text-[10px] font-bold transition-all ${activeAction === 'register' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500'}`}
              >
                Add Student
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {activeAction === 'register' ? (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">New Student ID</label>
                    <input 
                      type="text" 
                      placeholder="e.g. S105"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Full Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. John Doe"
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Assign Password</label>
                    <input 
                      type="text" 
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Select Student</label>
                    <select 
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      value={studentId}
                      onChange={(e) => setStudentId(e.target.value)}
                      required
                    >
                      <option value="">Choose a student</option>
                      {students.map(s => <option key={s.id} value={s.id}>{s.name} ({s.id})</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">Subject</label>
                    <select 
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    >
                      <option>Software Engineering</option>
                      <option>Database Systems</option>
                      <option>Computer Networks</option>
                      <option>Artificial Intelligence</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-2">
                      {activeAction === 'attendance' ? 'Status' : 'Score (out of 100)'}
                    </label>
                    {activeAction === 'attendance' ? (
                      <select 
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                      >
                        <option value="Present">Present</option>
                        <option value="Absent">Absent</option>
                      </select>
                    ) : (
                      <input 
                        type="number" 
                        placeholder="Enter score"
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl outline-none"
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        required
                      />
                    )}
                  </div>
                </>
              )}

              {success && (
                <p className={`text-xs font-bold p-3 rounded-xl text-center ${success.includes('Error') ? 'text-rose-500 bg-rose-50' : 'text-emerald-500 bg-emerald-50'}`}>
                  {success}
                </p>
              )}

              <button 
                type="submit" 
                disabled={submitting}
                className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all flex items-center justify-center gap-2 ${
                  activeAction === 'attendance' ? 'bg-blue-600' : activeAction === 'marks' ? 'bg-purple-600' : 'bg-emerald-600'
                }`}
              >
                {submitting ? <Loader2 className="w-5 h-5 animate-spin" /> : activeAction === 'register' ? 'Register Student' : 'Record Entry'}
              </button>
            </form>
          </Card>

          {/* Student List View */}
          <Card title="Student Directory" icon={<Users className="w-5 h-5" />} className="lg:col-span-2">
            <div className="space-y-4">
              {students.map((student) => (
                <div key={student.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100 group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 font-bold">
                      {student.name.split(' ').map((nLine: string) => nLine[0]).join('')}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-800 group-hover:text-blue-600 transition-colors">{student.name}</h4>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-none mt-1">{student.id}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-[10px] font-bold uppercase tracking-widest text-slate-500 hover:border-blue-500 hover:text-blue-600 transition-all">
                      View Profile
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
    </div>
  );
}
