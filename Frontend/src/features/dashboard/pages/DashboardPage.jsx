import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchDashboardData } from '../dashboardSlice';
import Navbar from '../../../components/Navbar';
import StatCard from '../components/StatCard';
import WeeklySummary from '../components/WeeklySummary';
import RecentTopics from '../components/RecentTopics';
import Loader from '../../../components/Loader';
import { BookOpen, Calendar, ArrowRight, Play, Book, Plus } from 'lucide-react';
import axios from 'axios';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data, loading, error } = useSelector((state) => state.dashboard);
  const { user } = useSelector((state) => state.auth);
  const { data: profile } = useSelector((state) => state.profile);
  
  const [realJournals, setRealJournals] = useState([]);
  const [quoteData, setQuoteData] = useState({
    text: "The ability to perform deep work is becoming increasingly rare at exactly the same time it is becoming increasingly valuable.",
    author: "Cal Newport",
    loading: false
  });

  useEffect(() => {
    dispatch(fetchDashboardData());
    
    const fetchRealJournals = async () => {
      try {
        const res = await axios.get('/api/journals');
        if (Array.isArray(res.data)) {
          setRealJournals(res.data);
        }
      } catch (err) {
        console.error('Failed to load journals for dashboard:', err);
      }
    };
    
    fetchRealJournals();

    const fetchRandomQuote = async () => {
      setQuoteData(prev => ({ ...prev, loading: true }));
      try {
        const response = await fetch("https://api.api-ninjas.com/v2/randomquotes", {
          headers: { "X-Api-Key": "iBYvct4c0yYE1z57ovw9ANk4tHpTskyf6eBs2lb0" }
        });
        if (response.ok) {
          const data = await response.json();
          let quoteText = "";
          let quoteAuthor = "";

          if (Array.isArray(data) && data.length > 0) {
            quoteText = data[0].quote || data[0].text;
            quoteAuthor = data[0].author;
          } else if (data && typeof data === 'object') {
            quoteText = data.quote || data.text;
            quoteAuthor = data.author;
          }

          if (quoteText) {
            setQuoteData({
              text: quoteText,
              author: quoteAuthor || "Unknown",
              loading: false
            });
            return;
          }
        }
      } catch (err) {
        console.error('Failed to fetch random quote:', err);
      }
      setQuoteData(prev => ({ ...prev, loading: false }));
    };

    fetchRandomQuote();
  }, [dispatch]);

  const getCurrentDateStr = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    }).toUpperCase();
  };

  const formattedStudyHours = data.totalStudyHours 
    ? `${(data.totalStudyHours / 60).toFixed(1)}h` 
    : '0.0h';

  if (loading && !data.totalEntries) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-300">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl shadow-sm">
          <div className="flex flex-col gap-1">
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 tracking-widest uppercase flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {getCurrentDateStr()}
            </span>
            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight mt-1">
              Welcome, {profile?.name || user?.name || 'Student'}!
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Your sanctuary is ready.
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-center">
            <button
              onClick={() => navigate('/timer')}
              className="bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-4 py-2.5 rounded-xl font-bold text-xs transition-all flex items-center gap-2 cursor-pointer shadow-sm"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Focus Timer
            </button>
            <button
              onClick={() => navigate('/journals/create')}
              className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs transition-all shadow-md flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Log Journal
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <WeeklySummary />
          </div>

          <div className="flex flex-col gap-6">
            <StatCard
              title="Total Journals"
              value={`${data.totalEntries || 0} Sessions`}
              subtext="Logged in total"
              icon={<BookOpen className="w-6 h-6" />}
              accentColor="emerald"
            />

            <div className="bg-emerald-800 text-white rounded-2xl p-6 flex flex-col justify-between shadow-md relative overflow-hidden group hover:bg-emerald-900 transition-all duration-300 flex-1 min-h-[200px]">
              <div className="absolute right-0 top-0 w-32 h-32 bg-emerald-700/20 rounded-full blur-2xl pointer-events-none group-hover:scale-125 transition-transform duration-500"></div>
              
              <div>
                <h4 className="text-lg font-bold tracking-tight mb-2">Ready to focus?</h4>
                <p className="text-xs text-emerald-100/90 leading-relaxed max-w-[85%]">
                  Clear your mind and start your next deep work interval now.
                </p>
              </div>

              <button
                onClick={() => navigate('/timer')}
                className="bg-white text-emerald-800 hover:bg-slate-50 transition-all duration-200 py-3 rounded-xl font-bold text-sm shadow-sm flex items-center justify-center gap-2 mt-6 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-emerald-800 text-emerald-800" />
                Start Timer
              </button>
            </div>
          </div>
        </div>

        <RecentTopics journals={realJournals} />

        <div className="relative rounded-2xl overflow-hidden bg-slate-900 border border-slate-800 text-white shadow-sm group hover:shadow-md transition-shadow duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-900/90 to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-emerald-900/10 mix-blend-overlay pointer-events-none"></div>
          
          <div className="relative z-20 px-8 py-10 max-w-2xl flex flex-col gap-3">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2">
              Philosophy {quoteData.loading && <span className="animate-spin inline-block">⏳</span>}
            </span>
            <h3 className="text-2xl font-bold font-serif text-white tracking-tight">
              {quoteData.loading ? "Seeking wisdom..." : "Quote of the moment..."}
            </h3>
            <p className="text-sm italic font-serif text-slate-300 font-medium leading-relaxed mt-1">
              "{quoteData.text}"
            </p>
            <span className="text-xs text-slate-400 font-semibold">— {quoteData.author}</span>
          </div>
        </div>
      </main>

      <footer className="bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 py-6 mt-12 transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-400 dark:text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-slate-900 dark:text-white font-bold font-serif">DayStack</span>
            <span>© 2026 DayStack. Visual deep breaths for deep work.</span>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-slate-600 dark:hover:text-slate-400 transition-colors">Help Center</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
