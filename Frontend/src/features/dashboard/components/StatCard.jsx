import React from 'react';

export default function StatCard({ title, value, subtext, icon, accentColor = 'emerald' }) {
  const accentColors = {
    emerald: {
      bg: 'bg-emerald-50',
      text: 'text-emerald-600',
      border: 'border-emerald-100',
      iconBg: 'bg-emerald-100/50'
    },
    indigo: {
      bg: 'bg-indigo-50',
      text: 'text-indigo-600',
      border: 'border-indigo-100',
      iconBg: 'bg-indigo-100/50'
    },
    amber: {
      bg: 'bg-amber-50',
      text: 'text-amber-600',
      border: 'border-amber-100',
      iconBg: 'bg-amber-100/50'
    }
  };

  const style = accentColors[accentColor] || accentColors.emerald;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex items-center justify-between hover:shadow-md hover:border-slate-200 dark:hover:border-slate-700 transition-all duration-200">
      <div className="flex flex-col">
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-2">
          {title}
        </span>
        <span className="text-3xl font-extrabold text-slate-800 dark:text-white tracking-tight">
          {value}
        </span>
        {subtext && (
          <span className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 flex items-center gap-1">
            {subtext}
          </span>
        )}
      </div>
      
      <div className={`p-3.5 rounded-2xl ${style.iconBg} dark:bg-opacity-20 ${style.text}`}>
        {icon}
      </div>
    </div>
  );
}
