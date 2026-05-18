import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchJournalById, updateJournal, clearCurrentJournal } from '../journalSlice';
import Navbar from '../../../components/Navbar';
import JournalForm from '../components/JournalForm';
import Loader from '../../../components/Loader';
import { ArrowLeft, Edit } from 'lucide-react';

export default function EditJournalPage() {
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

  const handleSubmit = async (formData) => {
    const resultAction = await dispatch(updateJournal({ id, journalData: formData }));
    if (updateJournal.fulfilled.match(resultAction)) {
      navigate('/journals');
    }
  };

  if (loading && !currentJournal) {
    return <Loader />;
  }

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

        <div className="flex flex-col gap-1">
          <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight flex items-center gap-2.5">
            <Edit className="w-8 h-8 text-emerald-600" />
            Edit Journal Entry
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Revise your summaries, time logged, or difficulty notes.
          </p>
        </div>

        {currentJournal && (
          <JournalForm 
            initialData={currentJournal} 
            onSubmit={handleSubmit} 
            loading={loading} 
          />
        )}
      </main>
    </div>
  );
}
