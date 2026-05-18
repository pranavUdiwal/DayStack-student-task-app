import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJournalById, deleteJournal, clearCurrentJournal } from '../journalSlice';
import Navbar from '../../../components/Navbar';
import Loader from '../../../components/Loader';
import { ArrowLeft, Calendar, Clock, Edit2, Trash2 } from 'lucide-react';

export default function SingleJournalPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentJournal, loading } = useSelector((state) => state.journal);

  useEffect(() => {
    dispatch(fetchJournalById(id));
    return () => {
      dispatch(clearCurrentJournal());
    };
  }, [dispatch, id]);

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to permanently delete this journal entry?')) {
      dispatch(deleteJournal(id)).then(() => {
        navigate('/journals');
      });
    }
  };

  const formatDate = (dateStr) => {
    try {
      const date = new Date(dateStr);
      if (isNaN(date.getTime())) return 'Recently';
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric'
      });
    } catch {
      return 'Recently';
    }
  };

  const formatDuration = (mins) => {
    if (!mins) return '0 minutes';
    const hours = Math.floor(mins / 60);
    const remainingMins = mins % 60;
    if (hours === 0) return `${remainingMins} minutes`;
    if (remainingMins === 0) return `${hours} hours`;
    return `${hours} hours ${remainingMins} minutes`;
  };

  const difficultyStyles = {
    Easy: 'bg-emerald-50 text-emerald-700 border-emerald-100',
    Medium: 'bg-amber-50 text-amber-700 border-amber-100',
    Hard: 'bg-rose-50 text-rose-700 border-rose-100'
  };

  if (loading || !currentJournal) {
    return <Loader />;
  }

  const badgeClass = difficultyStyles[currentJournal.difficulty] || difficultyStyles.Medium;

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-8 flex flex-col gap-6">
        <div>
          <button
            onClick={() => navigate('/journals')}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Journals
          </button>
        </div>

        <article className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-200">
          <div className="px-6 py-6 sm:px-8 border-b border-slate-50 dark:border-slate-800/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex flex-col gap-2">
              <div>
                <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border dark:bg-opacity-20 ${badgeClass}`}>
                  {currentJournal.difficulty} Difficulty
                </span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
                {currentJournal.title}
              </h1>
            </div>

            <div className="flex items-center gap-2 self-stretch sm:self-auto justify-end border-t border-slate-50 dark:border-slate-800/60 pt-4 sm:border-t-0 sm:pt-0">
              <button
                onClick={() => navigate(`/journals/edit/${currentJournal._id}`)}
                className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 text-slate-600 dark:text-slate-300 hover:text-emerald-700 dark:hover:text-emerald-400 rounded-xl text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-all cursor-pointer"
              >
                <Edit2 className="w-3.5 h-3.5" />
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="flex items-center gap-1.5 px-3 py-2 border border-slate-200 dark:border-slate-700 hover:border-rose-300 dark:hover:border-rose-800 text-slate-600 dark:text-slate-300 hover:text-rose-600 dark:hover:text-rose-400 rounded-xl text-xs font-bold hover:bg-rose-50/50 dark:hover:bg-rose-950/40 transition-all cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </div>
          </div>

          <div className="px-6 py-4 sm:px-8 bg-slate-50/50 dark:bg-slate-800/40 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              {formatDate(currentJournal.createdAt)}
            </span>
            <span className="hidden sm:inline text-slate-300 dark:text-slate-600">|</span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-4 h-4 text-slate-400 dark:text-slate-500" />
              Studied for <span className="font-bold text-slate-700 dark:text-slate-200">{formatDuration(currentJournal.duration)}</span>
            </span>
          </div>

          <div className="px-6 py-8 sm:px-8 prose prose-slate max-w-none">
            <p className="text-slate-600 dark:text-slate-300 text-base leading-relaxed whitespace-pre-wrap font-medium">
              {currentJournal.content}
            </p>
          </div>
        </article>
      </main>
    </div>
  );
}
