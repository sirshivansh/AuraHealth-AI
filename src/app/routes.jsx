import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Features
import LandingPage from '../features/landing/LandingPage.jsx';
import DashboardPage from '../features/dashboard/DashboardPage.jsx';
import ChatPage from '../features/chat/ChatPage.jsx';
import SymptomCheckerPage from '../features/symptoms/SymptomCheckerPage.jsx';
import LoginPage from '../features/auth/LoginPage.jsx';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/chat" element={<ChatPage />} />
      <Route path="/symptoms" element={<SymptomCheckerPage />} />
    </Routes>
  );
}
