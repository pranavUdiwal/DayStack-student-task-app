import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import journalReducer from '../features/journal/journalSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import profileReducer from '../features/profile/profileSlice';
import themeReducer from '../features/theme/themeSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    journal: journalReducer,
    dashboard: dashboardReducer,
    profile: profileReducer,
    theme: themeReducer,
  },
});
