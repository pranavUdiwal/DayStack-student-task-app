import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchJournals, deleteJournal } from '../journalSlice';
import Navbar from '../../../components/Navbar';
import FilterBar from '../components/FilterBar';
import JournalCard from '../components/JournalCard';
import Loader from '../../../components/Loader';
import { Plus, BookOpen, Inbox } from 'lucide-react';

export default function AllJournalsPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: journals, loading } = useSelector((state) => state.journal);

  const [filters, setFilters] = useState({
    search: '',
    difficulty: '',
    date: ''
  });

  useEffect(() => {
    dispatch(fetchJournals());
  }, [dispatch]);

  const handleResetFilters = () => {
    setFilters({
      search: '',
      difficulty: '',
      date: ''
    });
  };

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to permanently delete this journal entry?')) {
      dispatch(deleteJournal(id));
    }
  };

  const getLocalYYYYMMDD = (dateVal) => {
    if (!dateVal) return '';
    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return '';
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const filteredJournals = journals.filter((journal) => {
    const matchesSearch = filters.search
      ? journal.title.toLowerCase().includes(filters.search.toLowerCase())
      : true;

    const matchesDifficulty = filters.difficulty
      ? journal.difficulty === filters.difficulty
      : true;

    const matchesDate = filters.date
      ? getLocalYYYYMMDD(journal.createdAt) === filters.date
      : true;

    return matchesSearch && matchesDifficulty && matchesDate;
  });

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex flex-col gap-1">
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
              <BookOpen className="w-8 h-8 text-emerald-600" />
              Learning Journals
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Browse and search through all your logged deep study intervals.
            </p>
          </div>

          <button
            onClick={() => navigate('/journals/create')}
            className="w-full sm:w-auto bg-emerald-800 hover:bg-emerald-950 text-white font-bold py-2.5 px-5 rounded-xl transition-all duration-200 shadow-md flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-5 h-5" />
            New Entry
          </button>
        </div>

        <FilterBar 
          filters={filters} 
          setFilters={setFilters} 
          onReset={handleResetFilters} 
        />

        {loading && journals.length === 0 ? (
          <Loader />
        ) : filteredJournals.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-2">
            {filteredJournals.map((journal) => (
              <JournalCard
                key={journal._id}
                journal={journal}
                onDelete={handleDelete}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-12 text-center shadow-sm flex flex-col items-center justify-center gap-3 mt-4 transition-colors duration-200">
            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-full text-slate-400 dark:text-slate-500">
              <Inbox className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">No Journal Entries Found</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm">
              {journals.length === 0 
                ? "You haven't logged any study sessions yet! Click the 'New Entry' button to begin." 
                : "No entries match your current search and filters. Try clearing some options."}
            </p>
            {journals.length > 0 && (
              <button
                onClick={handleResetFilters}
                className="text-xs font-bold text-emerald-700 dark:text-emerald-400 hover:underline mt-1 cursor-pointer"
              >
                Reset all filters
              </button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
