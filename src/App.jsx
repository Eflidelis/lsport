import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LoginPage from './pages/LoginPage';

import DefaultLayout from './layouts/DefaultLayout';
import Index from './pages/Index';
import StatisticsPage from './pages/StatisticsPage';
import ThePossibilities from './components/ThePossibilities';
import TheNavigation from './components/TheNavigation';
import TheRegionalStatistics from './components/TheRegionalStatistics';
import ApplicationsPage from './pages/ApplicationsPage';
import ArchivedApplicationsPage from './pages/ArchivedApplicationsPage';

function App() {
  console.log('App rendered');
  return (
    <AuthProvider>
      <DefaultLayout>
        {/* Навигационное меню */}
        <TheNavigation />

        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Главная */}
          <Route path="/" element={<Index />} />

          <Route path="statistics" element={<StatisticsPage />} />
          <Route path="possibilities" element={<ThePossibilities />} />
          <Route path="regional-statistics" element={<TheRegionalStatistics />} />

          {/* Защищённые роуты */}
          <Route
            path="applications"
            element={
              <ProtectedRoute>
                <ApplicationsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="applications/archive"
            element={
              <ProtectedRoute>
                <ArchivedApplicationsPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </DefaultLayout>
    </AuthProvider>
  );
}

export default App;
