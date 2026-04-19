import { useState } from 'react';
import { 
  Send, 
  MessageSquare, 
  Calendar, 
  FileText,
  User,
  ShieldAlert,
  Loader2,
  CheckCircle2
} from 'lucide-react';

export default function ComplaintsView({ user }: { user: any }) {
  const [complaintTitle, setComplaintTitle] = useState('');
  const [complaintDesc, setComplaintDesc] = useState('');
  const [requestReason, setRequestReason] = useState('Medical Appointment');
  const [requestDate, setRequestDate] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState<'complaint' | 'request' | null>(null);

  const handleSubmit = async (e: React.FormEvent, type: 'complaint' | 'request') => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          title: type === 'complaint' ? complaintTitle : requestReason,
          description: type === 'complaint' ? complaintDesc : `Leave request for ${requestDate}`,
          type,
          date: type === 'request' ? requestDate : new Date().toISOString().split('T')[0]
        })
      });
      setSubmitted(type);
      setTimeout(() => setSubmitted(null), 3000);
      if (type === 'complaint') {
        setComplaintTitle('');
        setComplaintDesc('');
      } else {
        setRequestDate('');
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Complaint Box */}
      <div className="bg-white rounded-[40px] p-12 shadow-sm border border-slate-100 flex flex-col h-full">
        <div className="flex items-center gap-6 mb-12">
          <div className="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <ShieldAlert className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-black text-slate-800 tracking-tight">Submit a Complaint</h2>
        </div>

        <form onSubmit={(e) => handleSubmit(e, 'complaint')} className="space-y-10 flex-1 flex flex-col">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-1">Issue Title</label>
            <input 
              type="text" 
              placeholder="e.g. Projector not working in Room 204"
              className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[28px] outline-none text-sm font-bold text-slate-700 focus:bg-white focus:border-blue-400 transition-all shadow-inner"
              value={complaintTitle}
              onChange={(e) => setComplaintTitle(e.target.value)}
              required
            />
          </div>

          <div className="flex-1">
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-1">Description</label>
            <textarea 
              placeholder="Describe the issue in detail..."
              className="w-full p-8 bg-slate-50 border border-slate-100 rounded-[40px] outline-none text-sm font-bold text-slate-700 focus:bg-white focus:border-blue-400 transition-all shadow-inner h-64 resize-none"
              value={complaintDesc}
              onChange={(e) => setComplaintDesc(e.target.value)}
              required
            />
          </div>

          <div className="pt-6">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 bg-blue-600 text-white rounded-[32px] text-xs font-black uppercase tracking-widest shadow-2xl shadow-blue-500/30 flex items-center justify-center gap-4 transition-all hover:bg-blue-700 disabled:opacity-50 hover:scale-105 active:scale-95"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 
                submitted === 'complaint' ? <CheckCircle2 className="w-5 h-5" /> : <Send className="w-5 h-5" />}
              {submitted === 'complaint' ? 'Complaint Received' : 'Submit Complaint'}
            </button>
          </div>
        </form>
      </div>

      {/* Leave Request */}
      <div className="bg-white rounded-[40px] p-12 shadow-sm border border-slate-100 flex flex-col">
        <div className="flex items-center gap-6 mb-12">
          <div className="w-14 h-14 bg-purple-600 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/20">
            <FileText className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-black text-slate-800 tracking-tight">Leave Request</h2>
        </div>

        <form onSubmit={(e) => handleSubmit(e, 'request')} className="space-y-10 h-full">
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-1">Reason for Leave</label>
            <select 
              className="w-full p-6 bg-slate-50 border border-slate-100 rounded-[28px] outline-none text-sm font-bold text-slate-700 focus:bg-white focus:border-purple-400 transition-all shadow-inner"
              value={requestReason}
              onChange={(e) => setRequestReason(e.target.value)}
            >
              <option>Medical Appointment</option>
              <option>Family Emergency</option>
              <option>Personal Reason</option>
              <option>On-Duty (OD) Request</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4 px-1">Requested Date</label>
            <div className="relative">
              <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
              <input 
                type="date" 
                className="w-full pl-16 pr-6 py-6 bg-slate-50 border border-slate-100 rounded-[28px] outline-none text-sm font-bold text-slate-700 focus:bg-white focus:border-purple-400 transition-all shadow-inner"
                value={requestDate}
                onChange={(e) => setRequestDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="pt-12">
            <button 
              type="submit"
              disabled={isSubmitting}
              className="w-full py-6 bg-purple-600 text-white rounded-[32px] text-xs font-black uppercase tracking-widest shadow-2xl shadow-purple-500/30 flex items-center justify-center gap-4 transition-all hover:bg-purple-700 disabled:opacity-50 hover:scale-105 active:scale-95"
            >
              {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : 
                submitted === 'request' ? <CheckCircle2 className="w-5 h-5" /> : <Send className="w-5 h-5" />}
              {submitted === 'request' ? 'Request Submitted' : 'Submit Leave Request'}
            </button>
          </div>
        </form>

        <div className="mt-14 p-10 bg-slate-50 rounded-[40px] border border-slate-100 shadow-inner">
          <h4 className="text-xs font-black text-slate-800 uppercase tracking-widest mb-6">Important Guidelines</h4>
          <p className="text-xs font-bold text-slate-400 leading-relaxed italic">Leave requests should be submitted at least 24 hours in advance for non-emergency situations. Approval usually takes 4-8 working hours from the Dean's office.</p>
        </div>
      </div>
    </div>
  );
}
