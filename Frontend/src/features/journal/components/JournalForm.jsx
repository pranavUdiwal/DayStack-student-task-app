import React, { useState, useEffect } from 'react';
import Loader from '../../../components/Loader';

export default function JournalForm({ initialData = null, onSubmit, loading }) {
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    duration: '',
    difficulty: 'Medium'
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        content: initialData.content || '',
        duration: initialData.duration || '',
        difficulty: initialData.difficulty || 'Medium'
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const value = e.target.name === 'duration' ? Number(e.target.value) || '' : e.target.value;
    setFormData({
      ...formData,
      [e.target.name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (formData.title && formData.content && formData.duration !== '') {
      onSubmit(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5 w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-sm transition-colors duration-200">
      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Topic / Subject Name
        </label>
        <input
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          required
          placeholder="e.g. Organic Chemistry, Linear Algebra"
          className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Duration (Minutes)
          </label>
          <input
            type="number"
            name="duration"
            min="1"
            value={formData.duration}
            onChange={handleChange}
            required
            placeholder="e.g. 45, 90"
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Difficulty Level
          </label>
          <select
            name="difficulty"
            value={formData.difficulty}
            onChange={handleChange}
            className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all cursor-pointer"
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">
          Detailed Learning Journal Notes
        </label>
        <textarea
          name="content"
          value={formData.content}
          onChange={handleChange}
          required
          rows="6"
          placeholder="What did you learn? Write summaries, concepts covered, active recall questions, or challenges encountered during this study session..."
          className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm text-slate-800 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all resize-none leading-relaxed placeholder:text-slate-400 dark:placeholder:text-slate-500"
        ></textarea>
      </div>

      <div className="flex justify-end gap-3 border-t border-slate-100 dark:border-slate-800/60 pt-5 mt-2">
        <button
          type="submit"
          disabled={loading}
          className="bg-slate-900 dark:bg-emerald-600 text-white font-bold py-2.5 px-6 rounded-xl hover:bg-slate-800 dark:hover:bg-emerald-700 transition-all duration-200 shadow-sm flex items-center justify-center min-w-[120px] cursor-pointer"
        >
          {loading ? <Loader fullScreen={false} /> : 'Save Entry'}
        </button>
      </div>
    </form>
  );
}
