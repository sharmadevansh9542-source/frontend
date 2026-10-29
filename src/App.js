import React, { useState, useEffect } from 'react';
import './index.css';

import Landing        from './pages/Landing';
import Login          from './pages/Login';
import Register       from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import AdminDashboard   from './dashboards/AdminDashboard';
import DoctorDashboard  from './dashboards/DoctorDashboard';
import PatientDashboard from './dashboards/PatientDashboard';

/*
  Router state shape:
  { page: 'landing' | 'login' | 'register' | 'forgot' | 'dashboard', role: 'ADMIN'|'DOCTOR'|'PATIENT', extra: {} }
*/

export default function App() {
  const [route, setRoute] = useState({ page: 'landing', role: null });
  const [user,  setUser]  = useState(() => {
    try { return JSON.parse(localStorage.getItem('hmsUser')); } catch { return null; }
  });

  /* Auto-restore session */
  useEffect(() => {
    const token = localStorage.getItem('hmsToken');
    const saved = localStorage.getItem('hmsUser');
    if (token && saved) {
      try {
        const u = JSON.parse(saved);
        setUser(u);
        setRoute({ page: 'dashboard', role: u.role });
      } catch { /* ignore */ }
    }
  }, []);

  /* ── Navigation helper ── */
  const navigate = (page, { role, ...extra } = {}) => {
    setRoute(r => ({ page, role: role ?? r.role, extra }));
  };

  /* ── Auth handlers ── */
  const handleRoleSelect = (role) => navigate('login', { role });

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    navigate('dashboard', { role: userData.role });
  };

  const handleLogout = () => {
    localStorage.removeItem('hmsToken');
    localStorage.removeItem('hmsUser');
    setUser(null);
    navigate('landing');
  };

  /* ── Render ── */
  const { page, role } = route;

  /* Dashboard routing by role */
  if (page === 'dashboard' && user) {
    const Dashboard = {
      ADMIN:   AdminDashboard,
      DOCTOR:  DoctorDashboard,
      PATIENT: PatientDashboard,
    }[user.role] || AdminDashboard;

    return (
      <>
        <div className="bg-mesh" />
        <Dashboard user={user} onLogout={handleLogout} />
      </>
    );
  }

  return (
    <>
      {/* Animated background */}
      <div className="bg-mesh" />

      {page === 'landing' && (
        <Landing onRoleSelect={handleRoleSelect} />
      )}

      {page === 'login' && (
        <Login
          role={role}
          onBack={() => navigate('landing')}
          onLoginSuccess={handleLoginSuccess}
          onNavigate={navigate}
        />
      )}

      {page === 'register' && (
        <Register
          role={role}
          onBack={() => navigate('login', { role })}
          onNavigate={navigate}
        />
      )}

      {page === 'forgot' && (
        <ForgotPassword
          role={role}
          onBack={() => navigate('login', { role })}
          onNavigate={navigate}
        />
      )}
    </>
  );
}