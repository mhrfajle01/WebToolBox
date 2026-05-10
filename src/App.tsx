import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from './store/useAuthStore';

import ProtectedRoute from './components/auth/ProtectedRoute';

import { Toaster } from 'sonner';

// Lazy load pages
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Tools = React.lazy(() => import('./pages/Tools'));
const Login = React.lazy(() => import('./pages/Login'));
const ToolDetail = React.lazy(() => import('./pages/ToolDetail'));
const Favorites = React.lazy(() => import('./pages/Favorites'));
const History = React.lazy(() => import('./pages/History'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Settings = React.lazy(() => import('./pages/Settings'));

const App: React.FC = () => {
  const { initialize, loading } = useAuthStore();

  useEffect(() => {
    initialize();
  }, [initialize]);

  if (loading) {
    return (
      <div style={{ 
        height: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--bg-primary)',
        color: 'var(--accent-primary)'
      }}>
        <div className="spinner">Loading...</div>
      </div>
    );
  }

  return (
    <Router basename={import.meta.env.BASE_URL}>
      <Toaster position="top-center" richColors />
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={
          <ProtectedRoute>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Dashboard />
            </React.Suspense>
          </ProtectedRoute>
        } />

        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        
        <Route path="/tools" element={
          <ProtectedRoute>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Tools />
            </React.Suspense>
          </ProtectedRoute>
        } />

        <Route path="/tools/:toolId" element={
          <ProtectedRoute>
            <React.Suspense fallback={<div>Loading...</div>}>
              <ToolDetail />
            </React.Suspense>
          </ProtectedRoute>
        } />

        <Route path="/favorites" element={
          <ProtectedRoute>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Favorites />
            </React.Suspense>
          </ProtectedRoute>
        } />

        <Route path="/history" element={
          <ProtectedRoute>
            <React.Suspense fallback={<div>Loading...</div>}>
              <History />
            </React.Suspense>
          </ProtectedRoute>
        } />

        <Route path="/profile" element={
          <ProtectedRoute>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Profile />
            </React.Suspense>
          </ProtectedRoute>
        } />

        <Route path="/settings" element={
          <ProtectedRoute>
            <React.Suspense fallback={<div>Loading...</div>}>
              <Settings />
            </React.Suspense>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;
