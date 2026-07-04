import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { forgotPasswordThunk, verifyResetOtpThunk, resetPasswordThunk } from '../authSlice';
import Loader from '../../../components/Loader';
import { Key, ShieldCheck, Lock, X } from 'lucide-react';

export default function ForgotPasswordModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const { loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  if (!isOpen) return null;

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email) return;
    const resultAction = await dispatch(forgotPasswordThunk(email));
    if (forgotPasswordThunk.fulfilled.match(resultAction)) {
      setStep(2);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return;
    const resultAction = await dispatch(verifyResetOtpThunk(otp));
    if (verifyResetOtpThunk.fulfilled.match(resultAction)) {
      setStep(3);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!newPassword) return;
    const resultAction = await dispatch(resetPasswordThunk({ email, newPassword }));
    if (resetPasswordThunk.fulfilled.match(resultAction)) {
      setStep(1);
      setEmail('');
      setOtp('');
      setNewPassword('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-opacity animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl max-w-md w-full shadow-2xl overflow-hidden relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg transition-colors cursor-pointer z-10"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="p-6 sm:p-8 flex flex-col items-center">
          {step === 1 && (
            <div className="w-full flex flex-col items-center text-center">
              <div className="bg-emerald-50 dark:bg-emerald-950/50 p-3.5 rounded-full text-emerald-600 dark:text-emerald-400 mb-4 shadow-inner">
                <Key className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 font-serif">Forgot Password</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed max-w-xs">
                Enter your registered email address and we'll send you a 6-digit verification code to reset your password.
              </p>

              <form onSubmit={handleSendOtp} className="w-full flex flex-col gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@example.com"
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-center"
                />
                <button
                  type="submit"
                  disabled={loading || !email}
                  className="w-full bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-md disabled:opacity-50 cursor-pointer flex justify-center items-center h-11 mt-2"
                >
                  {loading ? <Loader inline /> : 'Send Reset Code'}
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="w-full flex flex-col items-center text-center">
              <div className="bg-amber-50 dark:bg-amber-950/50 p-3.5 rounded-full text-amber-600 dark:text-amber-400 mb-4 shadow-inner">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 font-serif">Enter Verification Code</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed max-w-xs">
                We've sent a 6-digit OTP code to <span className="font-semibold text-slate-800 dark:text-white">{email}</span>.
              </p>

              <form onSubmit={handleVerifyOtp} className="w-full flex flex-col gap-4">
                <input
                  type="text"
                  maxLength="6"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="123456"
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-xl font-bold text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all text-center tracking-widest placeholder:font-normal placeholder:text-sm"
                />
                <button
                  type="submit"
                  disabled={loading || otp.length < 6}
                  className="w-full bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-md disabled:opacity-50 cursor-pointer flex justify-center items-center h-11 mt-2"
                >
                  {loading ? <Loader inline /> : 'Verify Code'}
                </button>
              </form>
            </div>
          )}

          {step === 3 && (
            <div className="w-full flex flex-col items-center text-center">
              <div className="bg-indigo-50 dark:bg-indigo-950/50 p-3.5 rounded-full text-indigo-600 dark:text-indigo-400 mb-4 shadow-inner">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 font-serif">Create New Password</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed max-w-xs">
                Your email has been verified. Enter a robust new password for your account.
              </p>

              <form onSubmit={handleResetPassword} className="w-full flex flex-col gap-4">
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-500 text-center font-mono"
                />
                <button
                  type="submit"
                  disabled={loading || !newPassword}
                  className="w-full bg-slate-900 dark:bg-emerald-600 hover:bg-slate-800 dark:hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl transition-all shadow-md disabled:opacity-50 cursor-pointer flex justify-center items-center h-11 mt-2"
                >
                  {loading ? <Loader inline /> : 'Save New Password'}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
