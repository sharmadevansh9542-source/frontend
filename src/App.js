'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { useAuth } from './app/providers';
import AdminDashboard from './dashboards/AdminDashboard';
import DoctorDashboard from './dashboards/DoctorDashboard';
import PatientDashboard from './dashboards/PatientDashboard';
import ForgotPassword from './screens/ForgotPassword';
import Landing from './screens/Landing';
import Login from './screens/Login';
import Register from './screens/Register';

const pagePaths = {
  landing: '/',
  login: '/login',
  register: '/register',
  forgot: '/forgot-password',
  dashboard: '/dashboard',
};

export default function App({ page, role }) {
  const router = useRouter();
  const { user, setUser, sessionReady } = useAuth();

  useEffect(() => {
    if (!sessionReady) return;

    if (user && page !== 'dashboard') {
      router.replace('/dashboard');
    } else if (!user && page === 'dashboard') {
      router.replace('/');
    }
  }, [page, router, sessionReady, user]);

  const navigate = (nextPage, { role: nextRole } = {}) => {
    const path = pagePaths[nextPage];
    if (!path) {
      throw new Error(`Unknown page: ${nextPage}`);
    }

    const query = nextRole ? `?role=${encodeURIComponent(nextRole)}` : '';
    router.push(`${path}${query}`);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    navigate('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('hmsToken');
    localStorage.removeItem('hmsUser');
    setUser(null);
    navigate('landing');
  };

  let content = null;

  if (page === 'dashboard' && user) {
    const Dashboard = {
      ADMIN: AdminDashboard,
      DOCTOR: DoctorDashboard,
      PATIENT: PatientDashboard,
    }[user.role] || AdminDashboard;

    content = <Dashboard user={user} onLogout={handleLogout} />;
  } else if (page === 'landing') {
    content = <Landing onRoleSelect={(selectedRole) => navigate('login', { role: selectedRole })} />;
  } else if (page === 'login') {
    content = (
      <Login
        role={role}
        onBack={() => navigate('landing')}
        onLoginSuccess={handleLoginSuccess}
        onNavigate={navigate}
      />
    );
  } else if (page === 'register') {
    content = (
      <Register
        role={role}
        onBack={() => navigate('login', { role })}
        onNavigate={navigate}
      />
    );
  } else if (page === 'forgot') {
    content = (
      <ForgotPassword
        role={role}
        onBack={() => navigate('login', { role })}
        onNavigate={navigate}
      />
    );
  }

  return (
    <>
      <div className="bg-mesh" />
      {content}
    </>
  );
}
