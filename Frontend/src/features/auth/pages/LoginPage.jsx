import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import LoginForm from '../components/LoginForm';
import ForgotPasswordModal from '../components/ForgotPasswordModal';
import { resetAuthState } from '../authSlice';
import { BookOpen } from 'lucide-react';

export default function LoginPage() {
  const [isForgotModalOpen, setIsForgotModalOpen] = useState(false);
  const { token } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(resetAuthState());
    
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate, dispatch]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-200">
        <div className="bg-slate-900 px-6 py-8 text-center">
          <div className="flex justify-center mb-4">
             <div className="bg-white/10 p-3 rounded-full">
                <BookOpen className="w-8 h-8 text-emerald-400" />
             </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-slate-300 text-sm">Clear your mind and start your next deep work interval.</p>
        </div>

        <div className="p-6 sm:p-8">
          <LoginForm onForgotPassword={() => setIsForgotModalOpen(true)} />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{' '}
              <Link to="/register" className="font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 transition-colors">
                Create one
              </Link>
            </p>
          </div>
        </div>
      </div>

      <ForgotPasswordModal
        isOpen={isForgotModalOpen}
        onClose={() => setIsForgotModalOpen(false)}
      />
    </div>
  );
}
