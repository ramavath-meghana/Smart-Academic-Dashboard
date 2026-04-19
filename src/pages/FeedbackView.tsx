import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Smile, 
  Frown, 
  Zap, 
  Send,
  Loader2,
  CheckCircle2,
  Clock
} from 'lucide-react';

export default function FeedbackView({ user }: { user: any }) {
  const [activeSubject, setActiveSubject] = useState('Software Engineering (SE)');
  const [feedbackType, setFeedbackType] = useState<'Understood' | 'Confused' | 'Too Fast' | null>(null);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const isStudent = user.role === 'student';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackType) return;
    setIsSubmitting(true);
    
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: user.id,
          subject: activeSubject,
          time: '08:30 - 10:15 AM',
          type: feedbackType,
          comment
        })
      });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
      setFeedbackType(null);
      setComment('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isStudent) return <TeacherFeedbackView />;

  return (
    <div className="max-w-5xl mx-auto">
      <div className="bg-white rounded-[40px] p-12 shadow-sm border border-slate-100">
        <h2 className="text-xl font-black text-slate-800 tracking-tight mb-10">How's the Lecture Going?</h2>
        
        <form onSubmit={handleSubmit} className="space-y-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4 pl-1">Current Subject</label>
              <select 
                className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[28px] outline-none text-sm font-black text-slate-700 focus:bg-white focus:border-blue-400 transition-all shadow-inner"
                value={activeSubject}
                onChange={(e) => setActiveSubject(e.target.value)}
              >
                <option>Software Engineering (SE)</option>
                <option>Database Systems (DBS)</option>
                <option>Computer Networks (CN)</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4 pl-1">Ongoing Session</label>
              <div className="w-full p-6 bg-blue-50 border border-blue-100 rounded-[28px] text-sm font-black text-blue-600 flex items-center gap-4">
                <Clock className="w-5 h-5" />
                08:30 - 10:15 AM
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-6 text-center">Tap to respond (Poll)</label>
            <div className="grid grid-cols-3 gap-6">
              <button 
                type="button"
                onClick={() => setFeedbackType('Understood')}
                className={`py-10 rounded-[40px] flex flex-col items-center justify-center gap-4 transition-all border-4 ${
                  feedbackType === 'Understood' 
                    ? 'bg-emerald-500 border-emerald-200 text-white shadow-xl shadow-emerald-500/30' 
                    : 'bg-slate-50 border-slate-50 text-slate-400 hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-600'
                }`}
              >
                <Smile className="w-12 h-12" />
                <span className="text-xs font-black uppercase tracking-widest">Understood</span>
              </button>
              <button 
                type="button"
                onClick={() => setFeedbackType('Confused')}
                className={`py-10 rounded-[40px] flex flex-col items-center justify-center gap-4 transition-all border-4 ${
                  feedbackType === 'Confused' 
                    ? 'bg-orange-500 border-orange-200 text-white shadow-xl shadow-orange-500/30' 
                    : 'bg-slate-50 border-slate-50 text-slate-400 hover:border-orange-200 hover:bg-orange-50 hover:text-orange-600'
                }`}
              >
                <Frown className="w-12 h-12" />
                <span className="text-xs font-black uppercase tracking-widest">Confused</span>
              </button>
              <button 
                type="button"
                onClick={() => setFeedbackType('Too Fast')}
                className={`py-10 rounded-[40px] flex flex-col items-center justify-center gap-4 transition-all border-4 ${
                  feedbackType === 'Too Fast' 
                    ? 'bg-rose-500 border-rose-200 text-white shadow-xl shadow-rose-500/30' 
                    : 'bg-slate-50 border-slate-50 text-slate-400 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600'
                }`}
              >
                <Zap className="w-12 h-12" />
                <span className="text-xs font-black uppercase tracking-widest">Too Fast</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4 pl-1">Ask a specific question privately</label>
            <textarea 
              placeholder="Your question will be sent directly to the professor's dashboard..."
              className="w-full p-8 bg-slate-50 border border-slate-100 rounded-[40px] outline-none text-sm font-bold text-slate-700 focus:bg-white focus:border-blue-400 transition-all shadow-inner h-40 resize-none px-10"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />
          </div>

          <div className="flex justify-center pt-6">
            <button 
              type="submit"
              disabled={isSubmitting || !feedbackType}
              className="px-14 py-6 bg-blue-600 text-white rounded-[32px] text-xs font-black uppercase tracking-widest shadow-2xl shadow-blue-500/30 flex items-center gap-4 transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : (
                submitted ? <CheckCircle2 className="w-5 h-5" /> : <Send className="w-5 h-5" />
              )}
              {submitted ? 'Response Sent' : 'Submit My Response'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TeacherFeedbackView() {
  const [feedbacks, setFeedbacks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/teacher/feedback')
      .then(res => res.json())
      .then(d => {
        setFeedbacks(d);
        setLoading(false);
      });
  }, []);

  if (loading) return null;

  return (
    <div className="space-y-10">
      {/* Summary Charts */}
      <div className="bg-white rounded-[40px] p-12 shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-lg font-black text-slate-800 tracking-tight">Student Understanding Summary</h2>
          <span className="text-xs font-black text-blue-600 bg-blue-50 px-6 py-3 rounded-2xl uppercase tracking-widest border border-blue-100">Section A - SE Lecture</span>
        </div>

        <div className="grid grid-cols-3 gap-12 mb-12">
          <div className="text-center p-8 bg-emerald-50 rounded-[32px] border border-emerald-100">
            <p className="text-4xl font-black text-emerald-600 mb-2">70%</p>
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Understood</p>
          </div>
          <div className="text-center p-8 bg-orange-50 rounded-[32px] border border-orange-100">
            <p className="text-4xl font-black text-orange-500 mb-2">20%</p>
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Confused</p>
          </div>
          <div className="text-center p-8 bg-rose-50 rounded-[32px] border border-rose-100">
            <p className="text-4xl font-black text-rose-600 mb-2">10%</p>
            <p className="text-xs font-black text-slate-500 uppercase tracking-widest">Too Fast</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-6 w-full bg-slate-100 rounded-full flex overflow-hidden shadow-inner">
          <div className="h-full bg-emerald-500 transition-all duration-1000 ease-out shadow-lg" style={{ width: '70%' }} />
          <div className="h-full bg-orange-500 transition-all duration-1000 ease-out shadow-lg" style={{ width: '20%' }} />
          <div className="h-full bg-rose-500 transition-all duration-1000 ease-out shadow-lg" style={{ width: '10%' }} />
        </div>
      </div>

      {/* Doubts List */}
      <div className="bg-white rounded-[40px] p-12 shadow-sm border border-slate-100">
        <div className="flex items-center gap-4 mb-10">
          <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center">
            <MessageSquareText className="w-6 h-6" />
          </div>
          <h2 className="text-lg font-black text-slate-800 tracking-tight">Real-time Student Doubts</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {feedbacks.filter(f => f.comment).map((f, i) => (
            <div key={i} className="p-8 bg-slate-50 border border-slate-100 rounded-[40px] transition-all hover:bg-white hover:shadow-2xl hover:shadow-blue-900/5 group">
              <p className="text-sm font-bold text-slate-600 mb-6 italic leading-relaxed">"{f.comment}"</p>
              <div className="flex items-center justify-between pt-6 border-t border-slate-100">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-white rounded-2xl flex items-center justify-center text-xs font-black text-blue-600 shadow-sm border border-slate-100">
                    {f.student_id ? f.student_id.slice(-2) : '??'}
                  </div>
                  <span className="text-xs font-black text-slate-800">{f.student_id || 'Anonymous'}</span>
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest leading-none">{new Date(f.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

import { MessageSquareText } from 'lucide-react';
