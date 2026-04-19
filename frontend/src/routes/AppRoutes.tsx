import { Navigate, useLocation } from 'react-router-dom';
import LoginPage from '../pages/auth/LoginPage.tsx';
import RegisterPage from '../pages/auth/RegisterPage.tsx';
import LandingPage from '../pages/auth/LandingPage.tsx';
import DashboardPage from '../pages/dashboard/DashboardPage';
import OAuthCallbackPage from '../pages/auth/OAuthCallbackPage';
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

  if (pathname === '/auth/callback') {
    return <OAuthCallbackPage />;
  }

  return (
    <Navigate to="/landing" replace />
  );
};

export default AppRoutes;