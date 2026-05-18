import React from 'react';
import { BookOpen, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function RecentTopics({ journals = [] }) {
  const navigate = useNavigate();

  const formatDuration = (mins) => {
    if (!mins) return '0m';
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    if (hours === 0) return `${remainingMins}m`;
    if (remainingMins === 0) return `${hours}h`;
    return `${hours}h ${remainingMins}m`;
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) {
        return 'Recently';
      }
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Recently';
    }
  };

  const bulletColors = [
    'bg-indigo-500 shadow-indigo-100',
    'bg-rose-500 shadow-rose-100',
    'bg-emerald-500 shadow-emerald-100',
    'bg-amber-500 shadow-amber-100',
    'bg-purple-500 shadow-purple-100',
  ];

  const displayItems = journals ? journals.slice(0, 4) : [];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-200">
      <div className="px-6 py-5 border-b border-slate-50 dark:border-slate-800/60 flex justify-between items-center">
        <h3 className="text-lg font-bold text-slate-800 dark:text-white tracking-tight">Recent Journals</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/journals/create')}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            Log Entry
          </button>
          <button
            onClick={() => navigate('/journals')}
            className="text-xs font-semibold text-slate-500 dark:text-slate-400 hover:text-emerald-700 dark:hover:text-emerald-400 transition-colors cursor-pointer"
          >
            View all
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        {displayItems.length === 0 ? (
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <div className="bg-slate-100 dark:bg-slate-800/60 p-4 rounded-full text-slate-400 dark:text-slate-500 mb-3">
              <BookOpen className="w-8 h-8" />
            </div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">No journals recorded yet</p>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mb-4">
              Log your learning sessions and topics to track your deep work and progress over time.
            </p>
            <button
              onClick={() => navigate('/journals/create')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Log Your First Entry
            </button>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                <th className="px-6 py-3.5">Subject</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Duration</th>
                <th className="px-6 py-3.5 text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50 dark:divide-slate-800/60">
              {displayItems.map((item, index) => (
                <tr 
                  key={item._id}
                  onClick={() => navigate(`/journals/${item._id}`)}
                  className="group text-sm hover:bg-slate-50/50 dark:hover:bg-slate-800/60 transition-all duration-150 cursor-pointer"
                >
                  <td className="px-6 py-4 font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full shadow-inner ${bulletColors[index % bulletColors.length]}`}></span>
                    <span className="group-hover:text-emerald-700 dark:group-hover:text-emerald-400 transition-colors">{item.title}</span>
                  </td>
                  
                  <td className="px-6 py-4 text-slate-500 dark:text-slate-400">
                    {formatDate(item.createdAt)}
                  </td>
                  
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300 font-medium">
                    {formatDuration(item.duration)}
                  </td>
                  
                  <td className="px-6 py-4 text-right">
                    <span className="text-[10px] font-extrabold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-100/50 dark:border-emerald-800/40 px-2 py-0.5 rounded-full tracking-wider uppercase">
                      Completed
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
