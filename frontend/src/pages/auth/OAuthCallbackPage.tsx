import { useEffect, useMemo } from 'react';
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
  const { oauthError, token, user } = useMemo(() => {
    const params = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''));

    return {
      oauthError: params.get('error') || hashParams.get('error'),
      token:
        params.get('token') || params.get('access_token') || hashParams.get('token') || hashParams.get('access_token'),
      user:
        decodeUser(params.get('user')) ||
        decodeUser(hashParams.get('user')) ||
        {
          _id: params.get('userId') || hashParams.get('userId') || undefined,
          firstName: params.get('firstName') || hashParams.get('firstName') || undefined,
          lastName: params.get('lastName') || hashParams.get('lastName') || undefined,
          email: params.get('email') || hashParams.get('email') || undefined,
        },
    };
  }, []);

  const hasMissingOAuthPayload = !token || !user || (!user.firstName && !user.lastName && !user.email);
  const isError = Boolean(oauthError) || hasMissingOAuthPayload;
  const message = oauthError
    ? `OAuth sign-in failed: ${oauthError}`
    : hasMissingOAuthPayload
      ? 'OAuth response is missing token or profile data.'
      : 'Sign-in successful. Redirecting to your dashboard...';

  useEffect(() => {
    if (isError || !token || !user) {
      return;
    }

    saveAuthSession(token, user);

    const timer = window.setTimeout(() => {
      navigate('/dashboard', { replace: true });
    }, 700);

    return () => window.clearTimeout(timer);
  }, [isError, navigate, token, user]);

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