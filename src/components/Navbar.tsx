import { Bell, Search, User } from 'lucide-react';

interface NavbarProps {
  title: string;
  userName: string;
}

export default function Navbar({ title, userName }: NavbarProps) {
  return (
    <header className="bg-white/50 backdrop-blur-md px-8 py-4 flex items-center justify-between sticky top-0 z-10 border-b border-slate-200">
      <h2 className="text-xl font-bold text-slate-800">{title}</h2>
      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search..." 
            className="pl-10 pr-4 py-2 bg-slate-100 border-none rounded-full text-sm focus:ring-2 focus:ring-blue-500/20 w-64 outline-none" 
          />
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-2 hover:bg-slate-200 rounded-full transition-colors">
            <Bell className="w-5 h-5 text-slate-600" />
            <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-[10px] flex items-center justify-center rounded-full border-2 border-white">2</span>
          </button>
          <div className="flex items-center gap-3 pl-4 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800 leading-none">{userName}</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Online</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
              <User className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
