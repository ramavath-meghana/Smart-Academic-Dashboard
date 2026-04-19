import { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  title?: string;
  className?: string;
  icon?: ReactNode;
}

export default function Card({ children, title, className = "", icon }: CardProps) {
  return (
    <div className={`bg-white rounded-xl p-8 shadow-sm border border-slate-100 ${className}`}>
      {title && (
        <div className="flex items-center gap-3 mb-6">
          {icon && <div className="p-2 bg-slate-50 rounded-xl text-slate-600">{icon}</div>}
          <h3 className="text-xl font-bold text-slate-800">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
}
