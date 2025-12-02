import React, { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
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

import ScrollToTop from "./components/ScrollToTop";

// обработчик ошибок
import "./api/axiosErrorHandler";

// страницы ошибок
import Error404 from "./components/errors/Error404";
import Error500 from "./components/errors/Error500";
import NetworkError from "./components/errors/NetworkError";

function App() {
  const location = useLocation();
  console.log('App rendered');

  
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const block = params.get("scroll");
    if (!block) return;

    setTimeout(() => {
      const el = document.getElementById(block);
      if (el) el.scrollIntoView({ behavior: "smooth" });
    }, 150);
  }, [location.search]);

  return (
    <AuthProvider>
      <DefaultLayout>

        <TheNavigation />
        <ScrollToTop />

        <Routes>
          <Route path="/login" element={<LoginPage />} />

          {/* Главная */}
          <Route path="/" element={<Index />} />

          {/* Публичные страницы */}
          <Route path="statistics" element={<StatisticsPage />} />
          <Route path="possibilities" element={<ThePossibilities />} />
          <Route path="regional-statistics" element={<TheRegionalStatistics />} />

          {/* Закрытые страницы */}
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

          {/* страницы ошиок */}
          <Route path="/error/500" element={<Error500 />} />
          <Route path="/error/network" element={<NetworkError />} />

          {/* 404 */}
          <Route path="*" element={<Error404 />} />
        </Routes>

      </DefaultLayout>
    </AuthProvider>
  );
}

export default App;
