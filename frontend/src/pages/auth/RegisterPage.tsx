import { useEffect, useMemo, useState } from 'react';
import type { DragEvent, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import { useRegisterMutation, type RegisterResponse } from '../../store/api/authApi';
import { useTheme } from '../../context/ThemeContext';
import { startOAuthLogin } from '../../services/oauthService';
import './AuthPages.css';

type ToastType = 'success' | 'error';

type RegisterErrors = {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

function validateEmail(value: string) {
  if (!value.trim()) return 'Email is required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Enter a valid email address';
  return '';
}

function validatePassword(value: string) {
  if (!value) return 'Password is required';
  if (value.length < 8) return 'At least 8 characters required';
  if (!/[A-Z]/.test(value)) return 'Include at least one uppercase letter';
  if (!/[0-9]/.test(value)) return 'Include at least one number';
  return '';
}

function getPasswordScore(value: string) {
  let score = 0;
  if (value.length >= 8) score += 1;
  if (/[A-Z]/.test(value)) score += 1;
  if (/[0-9]/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;
  return score;
}

function getPasswordLabel(score: number) {
  if (score <= 1) return 'Weak';
  if (score === 2) return 'Fair';
  if (score === 3) return 'Strong';
  return 'Very strong';
}

function splitName(fullName: string) {
  const clean = fullName.trim().replace(/\s+/g, ' ');
  if (!clean) return { firstName: '', lastName: '' };

  const [firstName, ...rest] = clean.split(' ');
  return { firstName, lastName: rest.join(' ') || '-' };
}

const REDIRECT_DELAY_MS = 600;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const [registerMutation] = useRegisterMutation();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [socialLoading, setSocialLoading] = useState<'google' | 'linkedin' | null>(null);
  const [errors, setErrors] = useState<RegisterErrors>({});
  const [touched, setTouched] = useState({ fullName: false, email: false, password: false, confirmPassword: false });
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(null), 2800);
    return () => clearTimeout(timer);
  }, [toast]);

  const passwordScore = useMemo(() => getPasswordScore(password), [password]);
  const fullNameError = useMemo(() => {
    if (!fullName.trim()) return 'Full name is required';
    if (fullName.trim().length < 3) return 'Please enter your full name';
    return '';
  }, [fullName]);
  const emailError = useMemo(() => validateEmail(email), [email]);
  const passwordError = useMemo(() => validatePassword(password), [password]);
  const confirmPasswordError = useMemo(() => {
    if (!confirmPassword) return 'Confirm your password';
    if (password !== confirmPassword) return 'Passwords do not match';
    return '';
  }, [password, confirmPassword]);

  const canSubmit =
    !fullNameError && !emailError && !passwordError && !confirmPasswordError && fullName && email && password;

  useEffect(() => {
    if (!cvFile) {
      setUploadProgress(0);
      return;
    }

    setUploadProgress(0);
    const interval = setInterval(() => {
      setUploadProgress((current) => {
        const next = current + 14;
        if (next >= 100) {
          clearInterval(interval);
          return 100;
        }
        return next;
      });
    }, 110);

    return () => clearInterval(interval);
  }, [cvFile]);

  function onSelectFile(file: File | null) {
    if (!file) return;

    const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowed.includes(file.type)) {
      setToast({ message: 'Please upload a PDF or Word document for CV parsing.', type: 'error' });
      return;
    }

    setCvFile(file);
  }

  function onDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
    onSelectFile(event.dataTransfer.files?.[0] ?? null);
  }

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors: RegisterErrors = {
      fullName: fullNameError,
      email: emailError,
      password: passwordError,
      confirmPassword: confirmPasswordError,
    };

    setTouched({ fullName: true, email: true, password: true, confirmPassword: true });
    setErrors(nextErrors);

    if (Object.values(nextErrors).some(Boolean)) return;

    const names = splitName(fullName);
    if (!names.firstName) {
      setErrors((current) => ({ ...current, fullName: 'Please provide your full name' }));
      return;
    }

    setLoading(true);
    registerMutation({
      firstName: names.firstName,
      lastName: names.lastName,
      email: email.trim(),
      password,
    })
      .unwrap()
      .then((result: RegisterResponse) => {
        setToast({ message: result.message || 'Account created successfully.', type: 'success' });
        window.setTimeout(() => navigate('/login'), REDIRECT_DELAY_MS);
      })
      .catch((error: unknown) => {
        if (axios.isAxiosError<{ message?: string }>(error)) {
          setToast({ message: error.response?.data?.message || 'Registration failed', type: 'error' });
        } else {
          setToast({ message: 'Something went wrong. Please try again.', type: 'error' });
        }
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
          className="auth-card grid w-full overflow-hidden lg:grid-cols-[1.07fr_0.93fr]"
        >
          <section className="p-6 sm:p-10">
            <div className="mb-8 flex items-center justify-between">
              <Link to="/landing" className="inline-flex items-center gap-3 text-inherit no-underline">
                <span className="auth-brand-icon">SJ</span>
                <span>
                  <strong className="block text-base">SmartHire Jira</strong>
                  <small className="auth-helper text-xs">AI-powered onboarding</small>
                </span>
              </Link>
              <span className="auth-pill px-3 py-1 text-xs font-semibold">Create account</span>
            </div>

            <h1 className="text-4xl font-bold tracking-tight md:text-5xl">Create Your Account</h1>
            <p className="auth-helper mt-3 max-w-md text-sm leading-7 md:text-base">
              Sign up to unlock CV-based job matching, smart recommendations, and a Jira-style tracking board.
            </p>

            <form onSubmit={onSubmit} noValidate className="mt-8 space-y-4">
              <div>
                <label htmlFor="fullName" className="mb-2 block text-sm font-semibold">
                  Full Name
                </label>
                <input
                  id="fullName"
                  type="text"
                  value={fullName}
                  autoComplete="name"
                  onChange={(event) => {
                    const value = event.target.value;
                    setFullName(value);
                    if (touched.fullName) {
                      setErrors((current) => ({ ...current, fullName: value.trim().length >= 3 ? '' : 'Please enter your full name' }));
                    }
                  }}
                  onBlur={() => {
                    setTouched((current) => ({ ...current, fullName: true }));
                    setErrors((current) => ({ ...current, fullName: fullNameError }));
                  }}
                  placeholder="Alex Morgan"
                  className={`auth-input w-full rounded-xl px-4 py-3 text-sm outline-none ${
                    touched.fullName && errors.fullName ? 'auth-input-error' : ''
                  } ${fullName && !fullNameError ? 'auth-input-valid' : ''}`}
                />
                {touched.fullName && errors.fullName && (
                  <p className="mt-2 text-sm text-red-500" role="alert">
                    {errors.fullName}
                  </p>
                )}
              </div>

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

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="password" className="mb-2 block text-sm font-semibold">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      autoComplete="new-password"
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
                      placeholder="Strong password"
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

                <div>
                  <label htmlFor="confirmPassword" className="mb-2 block text-sm font-semibold">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(event) => {
                        const value = event.target.value;
                        setConfirmPassword(value);
                        if (touched.confirmPassword) {
                          setErrors((current) => ({
                            ...current,
                            confirmPassword:
                              value.length === 0
                                ? 'Confirm your password'
                                : password !== value
                                  ? 'Passwords do not match'
                                  : '',
                          }));
                        }
                      }}
                      onBlur={() => {
                        setTouched((current) => ({ ...current, confirmPassword: true }));
                        setErrors((current) => ({
                          ...current,
                          confirmPassword: confirmPasswordError,
                        }));
                      }}
                      placeholder="Repeat password"
                      className={`auth-input w-full rounded-xl px-4 py-3 pr-11 text-sm outline-none ${
                        touched.confirmPassword && errors.confirmPassword ? 'auth-input-error' : ''
                      } ${confirmPassword && !confirmPasswordError ? 'auth-input-valid' : ''}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword((value) => !value)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-slate-200"
                      aria-label={showConfirmPassword ? 'Hide confirm password' : 'Show confirm password'}
                    >
                      {showConfirmPassword ? <EyeOffIcon /> : <EyeIcon />}
                    </button>
                  </div>
                  {touched.confirmPassword && errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-500" role="alert">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <p className="text-(--lp-accent) text-xs font-semibold uppercase tracking-[0.16em]">Password strength</p>
                  <span className="auth-helper text-xs">{password ? getPasswordLabel(passwordScore) : 'Add a password'}</span>
                </div>
                <div className="grid grid-cols-4 gap-1">
                  {[0, 1, 2, 3].map((index) => (
                    <span
                      key={index}
                      className="h-1.5 rounded-full"
                      style={{
                        background:
                          index < passwordScore
                            ? 'linear-gradient(135deg, var(--lp-accent), var(--lp-accent-3))'
                            : 'rgba(148, 163, 184, 0.26)',
                      }}
                    />
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center gap-2">
                  <label className="text-sm font-semibold" htmlFor="cv-upload">
                    Upload CV (optional)
                  </label>
                  <span
                    tabIndex={0}
                    className="auth-tooltip"
                    data-tip="Uploading your CV helps SmartHire Jira generate better skill-based matches and profile suggestions."
                  >
                    i
                  </span>
                </div>

                <label
                  htmlFor="cv-upload"
                  className={`auth-upload-zone block cursor-pointer rounded-xl px-4 py-4 text-center ${isDragging ? 'drag-over' : ''}`}
                  onDragOver={(event) => {
                    event.preventDefault();
                    setIsDragging(true);
                  }}
                  onDragLeave={() => setIsDragging(false)}
                  onDrop={onDrop}
                >
                  <input
                    id="cv-upload"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    className="hidden"
                    onChange={(event) => onSelectFile(event.target.files?.[0] ?? null)}
                  />
                  <p className="text-sm font-semibold">Drag and drop your CV here, or click to browse</p>
                  <p className="auth-helper mt-1 text-xs">Accepted formats: PDF, DOC, DOCX</p>
                </label>

                {cvFile && (
                  <div className="auth-card mt-3 rounded-xl p-3">
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold">{cvFile.name}</p>
                        <p className="auth-helper text-xs">{Math.ceil(cvFile.size / 1024)} KB</p>
                      </div>
                      <button
                        type="button"
                        className="auth-link text-xs font-semibold"
                        onClick={() => setCvFile(null)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="auth-progress-track mt-2">
                      <motion.div
                        className="auth-progress-fill"
                        initial={{ width: '0%' }}
                        animate={{ width: `${uploadProgress}%` }}
                        transition={{ duration: 0.2 }}
                      />
                    </div>
                    <p className="auth-helper mt-1 text-xs">Upload progress: {uploadProgress}%</p>
                  </div>
                )}
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="submit"
                disabled={loading || !canSubmit}
                className="auth-primary-btn mt-2 inline-flex w-full items-center justify-center rounded-xl px-4 py-3 text-sm font-semibold"
              >
                {loading ? 'Registering...' : 'Register'}
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
              Already have an account?{' '}
              <Link
                to="/login"
                className="auth-link font-semibold"
                onClick={(event) => {
                  event.preventDefault();
                  window.setTimeout(() => navigate('/login'), REDIRECT_DELAY_MS);
                }}
              >
                Log in
              </Link>
            </p>
          </section>

          <motion.aside
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.55, ease: 'easeOut' }}
            className="hidden border-(--lp-border) border-l p-8 lg:block"
          >
            <div className="auth-illustration-box h-full rounded-3xl p-6">
              <div className="mb-4">
                <p className="auth-helper text-xs uppercase tracking-[0.2em]">Onboarding + AI matching</p>
                <h2 className="mt-2 text-2xl font-bold">Start with your profile, then let AI guide the pipeline</h2>
              </div>

              <OnboardingIllustration />

              <div className="mt-5 space-y-3">
                <div className="auth-card rounded-xl p-3">
                  <p className="text-(--lp-accent) text-xs uppercase tracking-[0.16em]">AI fit analysis</p>
                  <p className="auth-helper mt-1 text-sm">Skill extraction, role fit scoring, and suggestions from your CV.</p>
                </div>
                <div className="auth-card rounded-xl p-3">
                  <p className="text-(--lp-accent) text-xs uppercase tracking-[0.16em]">Smart board setup</p>
                  <p className="auth-helper mt-1 text-sm">Applied, Interview, and Offered columns ready on your first login.</p>
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
          className={`auth-toast fixed left-1/2 top-4 z-60 -translate-x-1/2 px-4 py-2 text-sm font-medium ${
            toast.type === 'success' ? 'auth-toast-success' : 'auth-toast-error'
          }`}
        >
          {toast.message}
        </motion.div>
      )}
    </div>
  );
}

function OnboardingIllustration() {
  return (
    <svg className="h-auto w-full" viewBox="0 0 520 360" role="img" aria-label="AI onboarding illustration">
      <defs>
        <linearGradient id="register-bg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#a78bfa" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <rect x="12" y="12" width="496" height="336" rx="24" fill="url(#register-bg)" stroke="rgba(255,255,255,0.15)" />

      <g className="auth-orbit">
        <circle cx="96" cy="76" r="7" fill="#7dd3fc" />
        <circle cx="430" cy="82" r="8" fill="#a78bfa" />
        <circle cx="422" cy="294" r="9" fill="#34d399" />
      </g>

      <g className="auth-wave">
        <rect x="58" y="106" width="162" height="198" rx="20" fill="rgba(255,255,255,0.9)" />
        <rect x="80" y="128" width="88" height="12" rx="6" fill="#0ea5e9" />
        <rect x="80" y="150" width="120" height="8" rx="4" fill="#94a3b8" />
        <rect x="80" y="170" width="96" height="8" rx="4" fill="#cbd5e1" />
        <rect x="80" y="194" width="118" height="26" rx="13" fill="rgba(14,165,233,0.18)" />
        <rect x="80" y="232" width="130" height="8" rx="4" fill="#94a3b8" />
        <rect x="80" y="249" width="102" height="8" rx="4" fill="#cbd5e1" />
      </g>

      <g className="auth-grid-pulse">
        <rect x="252" y="90" width="208" height="120" rx="20" fill="rgba(15,23,42,0.9)" />
        <rect x="272" y="112" width="96" height="11" rx="5" fill="#67e8f9" />
        <rect x="272" y="132" width="160" height="8" rx="4" fill="#475569" />
        <rect x="272" y="149" width="140" height="8" rx="4" fill="#334155" />
        <circle cx="420" cy="116" r="15" fill="#22c55e" />
        <path d="M413 116l5 5 10-12" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      </g>

      <g>
        <rect x="250" y="226" width="208" height="78" rx="18" fill="rgba(255,255,255,0.88)" />
        <rect x="270" y="248" width="136" height="10" rx="5" fill="#a78bfa" />
        <rect x="270" y="266" width="100" height="8" rx="4" fill="#c4b5fd" />
        <rect x="376" y="244" width="62" height="24" rx="12" fill="rgba(167,139,250,0.24)" />
      </g>

      <path
        d="M88 74c52 22 106 24 164 0s112-24 174 0"
        fill="none"
        stroke="#7dd3fc"
        strokeWidth="4"
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
