import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginUser } from '../authSlice';
import Loader from '../../../components/Loader';

export default function GoogleAuthSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      // Dispatch a manual action to store the token, or directly save it.
      // Since loginUser is an async thunk, we can dispatch an action to just update state,
      // or directly update localStorage and navigate, then the App component's useEffect will fetch profile.
      
      localStorage.setItem('token', token);
      
      // Update redux state directly or trigger reload
      // A simple reload is an easy way to initialize the Redux state with the new token from localStorage
      window.location.href = '/dashboard';
    } else {
      navigate('/login');
    }
  }, [location, navigate, dispatch]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader fullScreen={false} />
        <p className="text-slate-600 dark:text-slate-300 font-medium">Authenticating...</p>
      </div>
    </div>
  );
}
