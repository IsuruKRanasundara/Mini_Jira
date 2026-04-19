import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { saveAuthSession } from '../../services/authSession';

const decodeUser = (value: string | null) => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value) as { _id?: string; firstName?: string; lastName?: string; email?: string };
  } catch {
    return null;
  }
};

const OAuthCallbackPage = () => {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Completing sign-in...');
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));

    const token = params.get('token') || params.get('access_token') || hashParams.get('token') || hashParams.get('access_token');
    const user =
      decodeUser(params.get('user')) ||
      decodeUser(hashParams.get('user')) ||
      {
        _id: params.get('userId') || hashParams.get('userId') || undefined,
        firstName: params.get('firstName') || hashParams.get('firstName') || undefined,
        lastName: params.get('lastName') || hashParams.get('lastName') || undefined,
        email: params.get('email') || hashParams.get('email') || undefined,
      };

    if (!token || !user || (!user.firstName && !user.lastName && !user.email)) {
      setIsError(true);
      setMessage('OAuth response is missing token or profile data.');
      return;
    }

    saveAuthSession(token, user);
    setMessage('Sign-in successful. Redirecting to your dashboard...');

    const timer = window.setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 700);

    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-950 text-white px-6">
      <div className="max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 text-center shadow-2xl backdrop-blur">
        <p className="text-xs uppercase tracking-[0.24em] text-cyan-300">OAuth callback</p>
        <h1 className="mt-3 text-2xl font-bold">{isError ? 'Sign-in failed' : 'Signing you in'}</h1>
        <p className="mt-3 text-sm text-gray-300">{message}</p>
      </div>
    </div>
  );
};

export default OAuthCallbackPage;