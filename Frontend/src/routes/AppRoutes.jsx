import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';

import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import OtpPage from '../features/auth/pages/OtpPage';
import GoogleAuthSuccess from '../features/auth/pages/GoogleAuthSuccess';

import DashboardPage from '../features/dashboard/pages/DashboardPage';

import AllJournalsPage from '../features/journal/pages/AllJournalsPage';
import SingleJournalPage from '../features/journal/pages/SingleJournalPage';
import CreateJournalPage from '../features/journal/pages/CreateJournalPage';
import EditJournalPage from '../features/journal/pages/EditJournalPage';

import TimerPage from '../features/timer/pages/TimerPage';

import ProfilePage from '../features/profile/pages/ProfilePage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/verify-email" element={<OtpPage />} />
      <Route path="/auth/google/success" element={<GoogleAuthSuccess />} />
      
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      
      <Route path="/journals" element={<ProtectedRoute><AllJournalsPage /></ProtectedRoute>} />
      <Route path="/journals/create" element={<ProtectedRoute><CreateJournalPage /></ProtectedRoute>} />
      <Route path="/journals/:id" element={<ProtectedRoute><SingleJournalPage /></ProtectedRoute>} />
      <Route path="/journals/edit/:id" element={<ProtectedRoute><EditJournalPage /></ProtectedRoute>} />

      <Route path="/timer" element={<ProtectedRoute><TimerPage /></ProtectedRoute>} />

      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
