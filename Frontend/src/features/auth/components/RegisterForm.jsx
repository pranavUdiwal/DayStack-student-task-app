import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../authSlice';
import { useNavigate } from 'react-router-dom';
import Loader from '../../../components/Loader';

export default function RegisterForm() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', bio: '' });
  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const resultAction = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(resultAction)) {
      navigate('/dashboard');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none text-slate-900 dark:text-white transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
          placeholder="Alex Rivera"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none text-slate-900 dark:text-white transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
          placeholder="student@example.com"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Password</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
          className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none text-slate-900 dark:text-white transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500"
          placeholder="••••••••"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Bio (Optional)</label>
        <textarea
          name="bio"
          value={formData.bio}
          onChange={handleChange}
          rows="2"
          className="w-full px-4 py-2 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none text-slate-900 dark:text-white transition-all resize-none placeholder:text-slate-400 dark:placeholder:text-slate-500"
          placeholder="Cognitive Science & Digital Humanities"
        ></textarea>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-slate-900 dark:bg-emerald-600 text-white font-medium py-2.5 rounded-lg hover:bg-slate-800 dark:hover:bg-emerald-700 transition-all duration-200 flex justify-center items-center mt-2 cursor-pointer"
      >
        {loading ? <Loader inline /> : 'Create Account'}
      </button>
    </form>
  );
}
