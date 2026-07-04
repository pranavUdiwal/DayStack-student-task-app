import React, { useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import OtpVerifyForm from '../components/OtpVerifyForm';
import { resetAuthState, sendOtp } from '../authSlice';
import { ShieldCheck, RefreshCw } from 'lucide-react';
import { useRef } from 'react';

export default function OtpPage() {
  const { token, loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const email = location.state?.email;

  const hasSentRef = useRef(false);

  useEffect(() => {
    dispatch(resetAuthState());
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate, dispatch]);

  useEffect(() => {
    if (email && !hasSentRef.current) {
      dispatch(sendOtp(email));
      hasSentRef.current = true;
    }
  }, [email, dispatch]);

  const handleResend = () => {
    if (email) {
      dispatch(sendOtp(email));
    }
  };

  if (!email && !token) {
    return <Navigate to="/register" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-4 transition-colors duration-300">
      <div className="max-w-md w-full bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-xl overflow-hidden transition-colors duration-200">
        <div className="bg-slate-900 px-6 py-8 text-center">
          <div className="flex justify-center mb-4">
             <div className="bg-white/10 p-3 rounded-full">
                <ShieldCheck className="w-8 h-8 text-emerald-400" />
             </div>
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Verify Your Email</h2>
          <p className="text-slate-300 text-sm">We've sent a 6-digit code to <span className="font-semibold text-white">{email}</span>.</p>
        </div>

        <div className="p-6 sm:p-8">
          <OtpVerifyForm email={email} />
          
          <div className="mt-6 text-center">
            <button
              onClick={handleResend}
              disabled={loading}
              className="inline-flex items-center gap-2 text-sm font-medium text-emerald-600 dark:text-emerald-400 hover:text-emerald-500 disabled:opacity-50 transition-colors cursor-pointer"
            >
              <RefreshCw className="w-4 h-4" />
              Resend verification code
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
