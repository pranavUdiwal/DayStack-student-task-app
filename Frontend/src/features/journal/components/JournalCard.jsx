import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, Edit2, Trash2 } from 'lucide-react';

export default function JournalCard({ journal, onDelete }) {
  const navigate = useNavigate();

  const difficultyBadges = {
    Easy: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Medium: 'bg-amber-50 text-amber-700 border-amber-100',
    Hard: 'bg-rose-50 text-rose-700 border-rose-100'
  };

  const badgeClass = difficultyBadges[journal.difficulty] || difficultyBadges.Medium;

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'Recently';
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Recently';
    }
  };

  const formatDuration = (mins) => {
    if (!mins) return '0m';
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    if (hours === 0) return `${remainingMins}m`;
    if (remainingMins === 0) return `${hours}h`;
    return `${hours}h ${remainingMins}m`;
  };

  return (
    <div 
      onClick={() => navigate(`/journals/${journal._id}`)}
      className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between group h-full relative"
    >
      <div>
        <div className="flex justify-between items-center mb-3.5">
          <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(journal.createdAt)}
          </span>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border dark:bg-opacity-20 ${badgeClass}`}>
            {journal.difficulty}
          </span>
        </div>

        <h4 className="text-base font-bold text-slate-800 dark:text-white tracking-tight mb-2 group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">
          {journal.title}
        </h4>

        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed mb-4">
          {journal.content}
        </p>
      </div>

      <div className="flex justify-between items-center border-t border-slate-50 dark:border-slate-800/60 pt-4 mt-auto">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
          {formatDuration(journal.duration)}
        </span>

        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={() => navigate(`/journals/edit/${journal._id}`)}
            className="p-1.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700 text-slate-500 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
            title="Edit Entry"
          >
            <Edit2 className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => onDelete(journal._id)}
            className="p-1.5 rounded-lg border border-slate-100 dark:border-slate-800 hover:border-rose-200 dark:hover:border-rose-900 text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50/50 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
            title="Delete Entry"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
