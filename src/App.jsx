import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from './config/supabase';
import Layout from './components/Layout/Layout';
import HomePage from './components/Home/HomePage';
import TraineeRegistration from './components/Forms/TraineeRegistration';
import QRScanner from './components/QR/QRScanner';
import AdminLogin from './components/Admin/AdminLogin';
import AdminDashboard from './components/Admin/AdminDashboard';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/register" element={<TraineeRegistration />} />
          <Route path="/checkin" element={<QRScanner />} />
          <Route 
            path="/login" 
            element={
              user ? <Navigate to="/admin" replace /> : <AdminLogin onLogin={handleLogin} />
            } 
          />
          <Route 
            path="/admin" 
            element={
              user ? <AdminDashboard /> : <Navigate to="/login" replace />
            } 
          />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;