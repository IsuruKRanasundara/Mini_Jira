import { Navigate, useLocation } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage.tsx';
import RegisterPage from '../pages/auth/RegisterPage.tsx';
import LandingPage from '../pages/auth/LandingPage.tsx';
import DashboardPage from '../pages/dashboard/DashboardPage';
const AppRoutes = () => {
  const { pathname } = useLocation();

  if (pathname === '/login') {
    return <LoginPage />;
  }

  if (pathname === '/landing') {
    return <LandingPage />;
  }

  if (pathname === '/register') {
    return <RegisterPage />;
  }

  if (pathname === '/dashboard') {
    return <DashboardPage />;
  }

  return (
    <Navigate to="/landing" replace />
  );
};

export default AppRoutes;