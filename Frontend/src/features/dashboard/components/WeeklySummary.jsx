import React from 'react';
import { useSelector } from 'react-redux';

export default function WeeklySummary() {
  const { data } = useSelector((state) => state.dashboard);

  const defaultDays = [
    { day: 'MON', durationMinutes: 0 },
    { day: 'TUE', durationMinutes: 0 },
    { day: 'WED', durationMinutes: 0 },
    { day: 'THU', durationMinutes: 0 },
    { day: 'FRI', durationMinutes: 0 },
    { day: 'SAT', durationMinutes: 0 },
    { day: 'SUN', durationMinutes: 0 }
  ];

  const weeklyData = (data && data.weeklyProgress && data.weeklyProgress.length === 7) 
    ? data.weeklyProgress 
    : defaultDays;

  const currentWeekDuration = data?.currentWeekDuration || 0;
  const comparison = data?.comparisonVsLastWeek || 0;

  const dailyAvgHours = (currentWeekDuration / 60 / 7).toFixed(1);
  const maxMins = Math.max(...weeklyData.map((d) => d.durationMinutes), 1);

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase().slice(0, 3);

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-200 h-full">
      <div>
        <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Daily Average Focus
        </span>
        <div className="flex items-baseline gap-2 mt-2">
          <span className="text-4xl font-extrabold text-slate-800 dark:text-white tracking-tight">{dailyAvgHours}h</span>
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${comparison >= 0 ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50' : 'text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/50'}`}>
            {comparison >= 0 ? `+${comparison}%` : `${comparison}%`} vs last week
          </span>
        </div>
      </div>

      <div className="h-48 flex items-end justify-between gap-2 sm:gap-4 mt-8 px-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        {weeklyData.map((item, idx) => {
          const hours = (item.durationMinutes / 60).toFixed(1);
          const heightPercentage = item.durationMinutes > 0 ? Math.round((item.durationMinutes / maxMins) * 100) : 4;
          const isToday = item.day === todayStr;

          return (
            <div key={idx} className="flex-1 flex flex-col items-center justify-end h-full group relative">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-800 dark:bg-slate-700 text-white text-[10px] py-1 px-1.5 rounded mb-1 absolute transform -translate-y-12 pointer-events-none z-10 shadow-sm whitespace-nowrap">
                {hours}h
              </div>
              
              <div 
                style={{ height: `${heightPercentage}%` }}
                className={`w-full rounded-lg transition-all duration-300 ${
                  isToday 
                    ? 'bg-emerald-800 hover:bg-emerald-900 shadow-sm shadow-emerald-200 dark:shadow-none' 
                    : 'bg-emerald-100 dark:bg-emerald-900/40 hover:bg-emerald-200 dark:hover:bg-emerald-800/60'
                }`}
              ></div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between mt-2 px-1 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
        {weeklyData.map((item, idx) => (
          <span key={idx} className={`flex-1 text-center ${item.day === todayStr ? 'text-emerald-600 dark:text-emerald-400 font-extrabold' : ''}`}>{item.day}</span>
        ))}
      </div>
    </div>
  );
}
