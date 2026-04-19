import { useEffect, useMemo, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useLoginMutation } from '../../store/api/authApi';
import { useTheme } from '../../context/ThemeContext';
import { startOAuthLogin } from '../../services/oauthService';
import './AuthPages.css';

type ToastType = 'success' | 'error';

type FieldErrors = {
  email?: string;
  password?: string;
};

function validateEmail(value: string) {
  if (!value.trim()) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address';
  return '';
}

function validatePassword(value: string) {
  if (!value) return 'Password is required';
  if (value.length < 8) return 'Password should be at least 8 characters';
  return '';
}

const REDIRECT_DELAY_MS = 600;

export default function LoginPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [loginMutation] = useLoginMutation();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'linkedin' | null>(null);
  const [touched, setTouched] = useState({ email: false, password: false });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  const emailError = useMemo(() => validateEmail(email), [email]);
  const passwordError = useMemo(() => validatePassword(password), [password]);
  const canSubmit = !emailError && !passwordError && email.length > 0 && password.length > 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: FieldErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
    };

    setTouched({ email: true, password: true });
    setErrors(nextErrors);

    if (nextErrors.email || nextErrors.password) return;

    setLoading(true);
    loginMutation({ email: email.trim(), password })
      .unwrap()
      .then((response) => {
        localStorage.setItem('token', response.token);
        localStorage.setItem('user', JSON.stringify(response.data));
        setToast({ message: response.message || 'Welcome back!', type: 'success' });
        window.setTimeout(() => navigate('/dashboard'), REDIRECT_DELAY_MS);
      })
      .catch((error: unknown) => {
        const message =
          typeof error === 'object' &&
          error !== null &&
          'data' in error &&
          typeof (error as { data?: { message?: string } }).data?.message === 'string'
            ? (error as { data: { message: string } }).data.message
            : 'Login failed. Please try again.';

        setToast({ message, type: 'error' });
      })
      .finally(() => setLoading(false));
  }

  function handleSocial(provider: 'google' | 'linkedin') {
    if (socialLoading) return;

    try {
      setSocialLoading(provider);
      startOAuthLogin(provider);
    } catch (error) {
      setSocialLoading(null);
      setToast({
        message:
          error instanceof Error
            ? error.message
            : `${provider === 'google' ? 'Google' : 'LinkedIn'} auth is not configured.`,
        type: 'error',
      });
    }
  }

  return (
    <div className="auth-shell">
      <div className="auth-glow auth-glow-a" aria-hidden="true" />
      <div className="auth-glow auth-glow-b" aria-hidden="true" />
      <div className="auth-glow auth-glow-c" aria-hidden="true" />

      <button
        type="button"
        className="auth-theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        <span className="text-sm font-semibold">{theme === 'dark' ? 'Light mode' : 'Dark mode'}</span>
      </button>

      <div className="relative z-10 mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-12 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
          className="auth-card grid w-full overflow-hidden lg:grid-cols-[1.05fr_0.95fr]"
        >
          <section className="p-6 sm:p-10">
            <div className="mb-8 flex items-center justify-between">
              <Link to="/landing" className="inline-flex items-center gap-3 text-inherit no-underline">
                <span className="auth-brand-icon">SJ</span>
                <span>
                  <strong className="block text-base">SmartHire Jira</strong>
                  <small className="auth-helper text-xs">AI job matching workspace</small>
                </span>
              </Link>
              <span className="auth-pill px-3 py-1 text-xs font-semibold">Secure login</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Welcome Back</h1>
            <p className="auth-helper mt-3 max-w-md text-sm leading-7 md:text-base">
              Continue to your personalized job dashboard, recommendations, and application board.
            </p>

            <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-4">
              <div>
                <label htmlFor="email" className="mb-2 block text-sm font-semibold">
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => {
                    const value = event.target.value;
                    setEmail(value);
                    if (touched.email) {
                      setErrors((current) => ({ ...current, email: validateEmail(value) }));
                    }
                  }}
                  onBlur={() => {
                    setTouched((current) => ({ ...current, email: true }));
                    setErrors((current) => ({ ...current, email: validateEmail(email) }));
                  }}
                  placeholder="you@company.com"
                  className={`auth-input w-full rounded-xl px-4 py-3 text-sm outline-none ${
                    touched.email && errors.email ? 'auth-input-error' : ''
                  } ${email && !emailError ? 'auth-input-valid' : ''}`}
                />
                {touched.email && errors.email && (
                  <p className="mt-2 text-sm text-red-500" role="alert">
                    {errors.email}
                  </p>
                )}
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label htmlFor="password" className="block text-sm font-semibold">
                    Password
                  </label>
                  <button
                    type="button"
                    className="auth-link text-xs font-semibold"
                    onClick={() => setToast({ message: 'Password reset flow can be linked next.', type: 'success' })}
                  >
                    Forgot Password?
                  </button>
                </div>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    value={password}
                    onChange={(event) => {
                      const value = event.target.value;
                      setPassword(value);
                      if (touched.password) {
                        setErrors((current) => ({ ...current, password: validatePassword(value) }));
                      }
                    }}
                    onBlur={() => {
                      setTouched((current) => ({ ...current, password: true }));
                      setErrors((current) => ({ ...current, password: validatePassword(password) }));
                    }}
                    placeholder="At least 8 characters"
                    className={`auth-input w-full rounded-xl px-4 py-3 pr-11 text-sm outline-none ${
                      touched.password && errors.password ? 'auth-input-error' : ''
                    } ${password && !passwordError ? 'auth-input-valid' : ''}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-200"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOffIcon /> : <EyeIcon />}
                  </button>
                </div>

                {touched.password && errors.password && (
                  <p className="mt-2 text-sm text-red-500" role="alert">
                    {errors.password}
                  </p>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading || !canSubmit}
                className="auth-primary-btn mt-2 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold"
              >
                {loading ? 'Logging in...' : 'Login'}
              </motion.button>

              <div className="auth-divider py-2 text-xs uppercase tracking-[0.22em]">
                <span>or</span>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <motion.button
                  whileHover={{ y: -2 }}
                  type="button"
                  className="auth-social-btn inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold"
                  disabled={socialLoading !== null}
                  onClick={() => handleSocial('google')}
                >
                  <GoogleIcon />
                  {socialLoading === 'google' ? 'Redirecting...' : 'Google'}
                </motion.button>

                <motion.button
                  whileHover={{ y: -2 }}
                  type="button"
                  className="auth-social-btn inline-flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold"
                  disabled={socialLoading !== null}
                  onClick={() => handleSocial('linkedin')}
                >
                  <LinkedInIcon />
                  {socialLoading === 'linkedin' ? 'Redirecting...' : 'LinkedIn'}
                </motion.button>
              </div>
            </form>

            <p className="auth-helper mt-6 text-sm">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="auth-link font-semibold"
                onClick={(event) => {
                  event.preventDefault();
                  window.setTimeout(() => navigate('/register'), REDIRECT_DELAY_MS);
                }}
              >
                Sign up
              </Link>
            </p>
          </section>

          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="hidden border-l border-[var(--lp-border)] p-8 lg:block"
          >
            <div className="auth-illustration-box h-full rounded-3xl p-6">
              <div className="mb-4">
                <p className="auth-helper text-xs uppercase tracking-[0.2em]">Security + AI pipeline</p>
                <h2 className="mt-2 text-2xl font-bold">Protected access to your match workspace</h2>
              </div>

              <SecurityIllustration />

              <div className="mt-5 space-y-3">
                <div className="auth-card rounded-xl p-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--lp-accent)]">Signal</p>
                  <p className="auth-helper mt-1 text-sm">3 new job recommendations based on your updated CV profile.</p>
                </div>
                <div className="auth-card rounded-xl p-3">
                  <p className="text-xs uppercase tracking-[0.16em] text-[var(--lp-accent)]">Reminder</p>
                  <p className="auth-helper mt-1 text-sm">1 interview follow-up due today in your Interview column.</p>
                </div>
              </div>
            </div>
          </motion.aside>
        </motion.div>
      </div>

      {toast && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          className={`auth-toast fixed left-1/2 top-4 z-[60] -translate-x-1/2 px-4 py-2 text-sm font-medium ${
            toast.type === 'success' ? 'auth-toast-success' : 'auth-toast-error'
          }`}
        >
          {toast.message}
        </motion.div>
      )}
    </div>
  );
}

function SecurityIllustration() {
  return (
    <svg className="h-auto w-full" viewBox="0 0 520 360" role="img" aria-label="Login security illustration">
      <defs>
        <linearGradient id="login-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.24" />
          <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.22" />
        </linearGradient>
      </defs>
      <rect x="12" y="12" width="496" height="336" rx="24" fill="url(#login-bg)" stroke="rgba(255,255,255,0.15)" />

      <g className="auth-orbit">
        <circle cx="85" cy="84" r="8" fill="#67e8f9" />
        <circle cx="432" cy="72" r="7" fill="#a78bfa" />
        <circle cx="446" cy="278" r="9" fill="#22c55e" />
      </g>

      <g className="auth-wave">
        <rect x="64" y="78" width="156" height="108" rx="18" fill="rgba(15,23,42,0.84)" />
        <rect x="82" y="100" width="74" height="10" rx="5" fill="#67e8f9" />
        <rect x="82" y="121" width="118" height="8" rx="4" fill="#475569" />
        <rect x="82" y="137" width="94" height="8" rx="4" fill="#334155" />
      </g>

      <g>
        <rect x="194" y="136" width="130" height="108" rx="18" fill="rgba(255,255,255,0.9)" />
        <rect x="228" y="164" width="64" height="45" rx="10" fill="#0f172a" />
        <path d="M240 164v-10a20 20 0 0 1 40 0v10" fill="none" stroke="#94a3b8" strokeWidth="5" />
        <circle cx="260" cy="186" r="7" fill="#67e8f9" />
      </g>

      <g className="auth-grid-pulse">
        <rect x="348" y="102" width="118" height="166" rx="18" fill="rgba(15,23,42,0.88)" />
        <rect x="366" y="124" width="72" height="10" rx="5" fill="#a78bfa" />
        <rect x="366" y="146" width="84" height="8" rx="4" fill="#475569" />
        <rect x="366" y="165" width="66" height="8" rx="4" fill="#334155" />
        <rect x="366" y="188" width="86" height="28" rx="14" fill="rgba(167,139,250,0.18)" />
      </g>

      <path
        d="M82 266c52 18 108 18 164 0s108-18 164 0"
        fill="none"
        stroke="#7dd3fc"
        strokeWidth="4"
        strokeLinecap="round"
        strokeDasharray="6 9"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 12.8A8.5 8.5 0 0 1 11.2 3a9 9 0 1 0 9.8 9.8Z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2.5v3M12 18.5v3M2.5 12h3M18.5 12h3M5.2 5.2l2.1 2.1M16.7 16.7l2.1 2.1M18.8 5.2l-2.1 2.1M7.3 16.7l-2.1 2.1" />
    </svg>
  );
}

function EyeIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

function EyeOffIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M3 3 21 21" />
      <path d="M10.6 10.7A3 3 0 0 0 13.3 13.4" />
      <path d="M9.1 5.1A11.1 11.1 0 0 1 12 5c6.5 0 10 7 10 7a18.5 18.5 0 0 1-3.2 4.3" />
      <path d="M6.2 6.3A18.7 18.7 0 0 0 2 12s3.5 7 10 7a10.8 10.8 0 0 0 4.2-.8" />
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.48h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.705 17.64 9.2z" />
      <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.185l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
      <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" />
      <path fill="#EA4335" d="M9 3.583c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.583 9 3.583z" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="2.2" y="2.2" width="19.6" height="19.6" rx="3.5" fill="#0a66c2" />
      <path fill="#fff" d="M8.1 9.1H5.8v9h2.3v-9Zm-1.2-1a1.3 1.3 0 1 0 0-2.6 1.3 1.3 0 0 0 0 2.6Zm11.3 4.6c0-2.8-1.5-4.1-3.5-4.1-1.6 0-2.3.9-2.7 1.5v-1.3H9.7v9h2.3v-5c0-1.3.2-2.6 1.8-2.6 1.6 0 1.6 1.5 1.6 2.6v5h2.3v-5.4Z" />
    </svg>
  );
}
