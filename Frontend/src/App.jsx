import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AppRoutes from './routes/AppRoutes';
import { fetchProfile } from './features/profile/profileSlice';

function App() {
  const { mode } = useSelector((state) => state.theme);
  const { token } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (mode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [mode]);

  useEffect(() => {
    if (token) {
      dispatch(fetchProfile());
    }
  }, [token, dispatch]);

  return (
    <div className={`min-h-screen transition-colors duration-300 font-sans ${mode === 'dark' ? 'dark bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      <AppRoutes />
    </div>
  );
}

export default App;
