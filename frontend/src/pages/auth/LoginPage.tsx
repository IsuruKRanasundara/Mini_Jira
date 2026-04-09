import { useReducer, useRef } from "react";
import type { CSSProperties, ChangeEvent, FormEvent } from "react";
import { useLoginMutation } from "../../store/api/authApi";


type AuthToastType = "" | "success" | "error";

type LoginState = {
  email: string;
  password: string;
  emailTouched: boolean;
  pwTouched: boolean;
  loading: boolean;
  googleLoading: boolean;
  showPassword: boolean;
  errors: {
    email: string;
    password: string;
  };
  toast: {
    message: string;
    type: AuthToastType;
    visible: boolean;
  };
};

type LoginAction =
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_PASSWORD"; payload: string }
  | { type: "TOUCH_EMAIL" }
  | { type: "TOUCH_PW" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_GOOGLE_LOADING"; payload: boolean }
  | { type: "TOGGLE_PASSWORD" }
  | { type: "SET_ERRORS"; payload: Partial<LoginState["errors"]> }
  | { type: "SHOW_TOAST"; payload: { message: string; type: Exclude<AuthToastType, ""> } }
  | { type: "HIDE_TOAST" };

const initialState: LoginState = {
  email: "",
  password: "",
  emailTouched: false,
  pwTouched: false,
  loading: false,
  googleLoading: false,
  showPassword: false,
  errors: { email: "", password: "" },
  toast: { message: "", type: "", visible: false },
};

function reducer(state: LoginState, action: LoginAction): LoginState {
  switch (action.type) {
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_PASSWORD":
      return { ...state, password: action.payload };
    case "TOUCH_EMAIL":
      return { ...state, emailTouched: true };
    case "TOUCH_PW":
      return { ...state, pwTouched: true };
    case "SET_LOADING":
      return { ...state, loading: action.payload };
    case "SET_GOOGLE_LOADING":
      return { ...state, googleLoading: action.payload };
    case "TOGGLE_PASSWORD":
      return { ...state, showPassword: !state.showPassword };
    case "SET_ERRORS":
      return { ...state, errors: { ...state.errors, ...action.payload } };
    case "SHOW_TOAST":
      return { ...state, toast: { message: action.payload.message, type: action.payload.type, visible: true } };
    case "HIDE_TOAST":
      return { ...state, toast: { ...state.toast, visible: false } };
    default:
      return state;
  }
}


function validateEmail(value: string): string {
  if (!value) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address";
  return "";
}

function validatePassword(value: string): string {
  if (!value) return "Password is required";
  if (value.length < 8) return "At least 8 characters required";
  
  return "";
}

function passwordStrength(value: string): number {
  if (!value) return 0;
  let score = 0;
  if (value.length >= 8) score++;
  if (/[A-Z]/.test(value)) score++;
  if (/[0-9]/.test(value)) score++;
  if (/[^A-Za-z0-9]/.test(value)) score++;
  return score;
}


const EmailIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="1" y="3" width="14" height="10" rx="2" stroke="#A8B0C0" strokeWidth="1.2" />
    <path d="M1 5l7 5 7-5" stroke="#A8B0C0" strokeWidth="1.2" />
  </svg>
);

const LockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <rect x="3" y="7" width="10" height="7" rx="1.5" stroke="#A8B0C0" strokeWidth="1.2" />
    <path d="M5 7V5a3 3 0 1 1 6 0v2" stroke="#A8B0C0" strokeWidth="1.2" />
    <circle cx="8" cy="10.5" r="1" fill="#A8B0C0" />
  </svg>
);

function EyeIcon({ open }: { open: boolean }) {
  return open ? (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path
        d="M2 2l12 12M6.5 6.7A2.5 2.5 0 0 0 8 11a2.5 2.5 0 0 0 2.5-2.5M1 8s2.5-5 7-5c1 0 2 .2 2.8.6M15 8s-.9 1.8-2.8 3.2M4.3 4.5C2.3 5.8 1 8 1 8"
        stroke="#A8B0C0"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <path d="M1 8s2.5-5 7-5 7 5 7 5-2.5 5-7 5-7-5-7-5z" stroke="#A8B0C0" strokeWidth="1.2" />
      <circle cx="8" cy="8" r="2.5" stroke="#A8B0C0" strokeWidth="1.2" />
    </svg>
  );
}

const ArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
    <path d="M8 2l6 6-6 6M2 8h12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ErrorIcon = () => (
  <svg width="12" height="12" viewBox="0 0 12 12">
    <circle cx="6" cy="6" r="5.5" stroke="currentColor" />
    <line x1="6" y1="4" x2="6" y2="6.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" />
    <circle cx="6" cy="8.5" r="0.7" fill="currentColor" />
  </svg>
);

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18">
    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.48h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908C16.658 14.013 17.64 11.705 17.64 9.2z" />
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.185l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" />
    <path fill="#FBBC05" d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" />
    <path fill="#EA4335" d="M9 3.583c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.583 9 3.583z" />
  </svg>
);

const BrandMark = () => (
  <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
    <polygon points="28,4 52,16 52,40 28,52 4,40 4,16" fill="#1E2330" stroke="#C9A84C" strokeWidth="1.2" />
    <polygon points="28,12 44,20 44,36 28,44 12,36 12,20" fill="none" stroke="#C9A84C" strokeWidth="0.7" opacity="0.6" />
    <circle cx="28" cy="28" r="7" fill="#C9A84C" opacity="0.9" />
    <line x1="28" y1="14" x2="28" y2="21" stroke="#C9A84C" strokeWidth="1.5" opacity="0.5" />
    <line x1="28" y1="35" x2="28" y2="42" stroke="#C9A84C" strokeWidth="1.5" opacity="0.5" />
    <line x1="14" y1="28" x2="21" y2="28" stroke="#C9A84C" strokeWidth="1.5" opacity="0.5" />
    <line x1="35" y1="28" x2="42" y2="28" stroke="#C9A84C" strokeWidth="1.5" opacity="0.5" />
  </svg>
);

const GeometricBg = () => (
  <svg style={styles.geoBg} viewBox="0 0 240 520" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="hex" width="40" height="46" patternUnits="userSpaceOnUse">
        <polygon points="20,2 38,12 38,34 20,44 2,34 2,12" fill="none" stroke="#C9A84C" strokeWidth="0.8" />
      </pattern>
    </defs>
    <rect width="240" height="520" fill="url(#hex)" />
    <circle cx="120" cy="260" r="90" fill="none" stroke="#C9A84C" strokeWidth="0.5" />
    <circle cx="120" cy="260" r="60" fill="none" stroke="#C9A84C" strokeWidth="0.3" />
    <line x1="0" y1="260" x2="240" y2="260" stroke="#C9A84C" strokeWidth="0.4" />
    <line x1="120" y1="0" x2="120" y2="520" stroke="#C9A84C" strokeWidth="0.4" />
  </svg>
);


const strengthLabels = ["", "Weak", "Fair", "Strong", "Very strong"];
const strengthColors = ["", "#E05252", "#E08A2A", "#D4B430", "#3DBE8A"];

function StrengthBar({ password }: { password: string }) {
  const score = passwordStrength(password);
  return (
    <div>
      <div style={styles.strengthBar}>
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            style={{
              ...styles.strengthSeg,
              background: i <= score ? strengthColors[score] : "rgba(255,255,255,0.07)",
            }}
          />
        ))}
      </div>
      {password && (
        <div style={styles.strengthHint}>
          {strengthLabels[score]}
        </div>
      )}
    </div>
  );
}


const Spinner = () => (
  <div style={styles.spinner} />
);


function Toast({ message, type, visible }: LoginState["toast"]) {
  return (
    <div
      style={{
        ...styles.toast,
        ...(type === "error" ? styles.toastError : styles.toastSuccess),
        opacity: visible ? 1 : 0,
        transform: visible ? "translateX(-50%) translateY(0)" : "translateX(-50%) translateY(-8px)",
      }}
    >
      {message}
    </div>
  );
}


export default function LoginScreen() {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [loginMutation] = useLoginMutation();
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function showToast(message: string, type: Exclude<AuthToastType, ""> = "success") {
    dispatch({ type: "SHOW_TOAST", payload: { message, type } });
    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }
    toastTimer.current = setTimeout(() => dispatch({ type: "HIDE_TOAST" }), 2800);
  }

  function handleEmailChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    dispatch({ type: "SET_EMAIL", payload: value });
    if (state.emailTouched) {
      dispatch({ type: "SET_ERRORS", payload: { email: validateEmail(value) } });
    }
  }

  function handleEmailBlur() {
    dispatch({ type: "TOUCH_EMAIL" });
    dispatch({ type: "SET_ERRORS", payload: { email: validateEmail(state.email) } });
  }

  function handlePasswordChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    dispatch({ type: "SET_PASSWORD", payload: value });
    if (state.pwTouched) {
      dispatch({ type: "SET_ERRORS", payload: { password: validatePassword(value) } });
    }
  }

  function handlePasswordBlur() {
    dispatch({ type: "TOUCH_PW" });
    dispatch({ type: "SET_ERRORS", payload: { password: validatePassword(state.password) } });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const emailErr = validateEmail(state.email);
    const pwErr = validatePassword(state.password);
    dispatch({ type: "TOUCH_EMAIL" });
    dispatch({ type: "TOUCH_PW" });
    dispatch({ type: "SET_ERRORS", payload: { email: emailErr, password: pwErr } });
    if (emailErr || pwErr) return;

    dispatch({ type: "SET_LOADING", payload: true });

    try {
      const response = await loginMutation({
        email: state.email,
        password: state.password,
      }).unwrap();
      localStorage.setItem("token", response.token);
      localStorage.setItem("user", JSON.stringify(response.data));
      showToast(response.message || "Signed in successfully!", "success");
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof (error as { data?: { message?: string } }).data?.message === "string"
          ? (error as { data: { message: string } }).data.message
          : "Login failed. Please try again.";

      showToast(message, "error");
    } finally {
      dispatch({ type: "SET_LOADING", payload: false });
    }
  }

  function handleGoogleLogin() {
    if (state.googleLoading) return;
    dispatch({ type: "SET_GOOGLE_LOADING", payload: true });
    // Replace with real Google OAuth flow
    setTimeout(() => {
      dispatch({ type: "SET_GOOGLE_LOADING", payload: false });
      showToast("Google sign-in successful!", "success");
    }, 1600);
  }

  const emailValid = Boolean(state.email) && !validateEmail(state.email);
  const pwValid = Boolean(state.password) && !validatePassword(state.password);

  return (
    <div style={styles.page}>
      <link
        href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Sans:wght@300;400;500&display=swap"
        rel="stylesheet"
      />
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:-webkit-autofill {
          -webkit-box-shadow: 0 0 0 1000px #1E2330 inset !important;
          -webkit-text-fill-color: #E8E0D0 !important;
        }
      `}</style>

      <div style={styles.card}>
        {/* ── Side Panel ── */}
        <div style={styles.side}>
          <GeometricBg />
          <div style={styles.sideContent}>
            <BrandMark />
            <div style={styles.brandName}>GetJob</div>
            <div style={styles.brandSub}>Enterprise Suite</div>
            <div style={styles.sideDivider} />
            <div style={styles.sideTagline}>
              Secure access to your<br />enterprise workspace
            </div>
          </div>
        </div>

        {/* ── Form Panel ── */}
        <div style={styles.formArea}>
          <div style={styles.formContent}>
            <Toast {...state.toast} />

            <div style={styles.formTitle}>Welcome back</div>
            <div style={styles.formSub}>Sign in to your account</div>

          {/* Google Button */}
            <button
              style={{
                ...styles.googleBtn,
                ...(state.googleLoading ? styles.googleBtnLoading : {}),
              }}
              onClick={handleGoogleLogin}
              disabled={state.googleLoading}
            >
              <GoogleIcon />
              <span>{state.googleLoading ? "Connecting..." : "Continue with Google"}</span>
            </button>

          {/* Divider */}
            <div style={styles.divider}>
              <div style={styles.divLine} />
              <span style={styles.divText}>or</span>
              <div style={styles.divLine} />
            </div>

            <form onSubmit={handleSubmit} noValidate>
            {/* Email Field */}
            <div style={styles.field}>
              <div style={styles.fieldLabel}>
                <span>Email address</span>
              </div>
              <div style={styles.inputWrap}>
                <span style={styles.inputIconLeft}><EmailIcon /></span>
                <input
                  type="email"
                  value={state.email}
                  onChange={handleEmailChange}
                  onBlur={handleEmailBlur}
                  placeholder="you@company.com"
                  style={{
                    ...styles.input,
                    ...(state.errors.email && state.emailTouched ? styles.inputError : {}),
                    ...(emailValid ? styles.inputValid : {}),
                  }}
                  autoComplete="email"
                />
              </div>
              {state.errors.email && state.emailTouched && (
                <div style={styles.fieldErr}>
                  <ErrorIcon />
                  <span>{state.errors.email}</span>
                </div>
              )}
            </div>

            {/* Password Field */}
            <div style={styles.field}>
              <div style={styles.fieldLabel}>
                <span>Password</span>
                <button
                  type="button"
                  style={styles.forgotBtn}
                  onClick={() => showToast("Password reset link sent!", "success")}
                >
                  Forgot?
                </button>
              </div>
              <div style={styles.inputWrap}>
                <span style={styles.inputIconLeft}><LockIcon /></span>
                <input
                  type={state.showPassword ? "text" : "password"}
                  value={state.password}
                  onChange={handlePasswordChange}
                  onBlur={handlePasswordBlur}
                  placeholder="Min. 8 characters"
                  style={{
                    ...styles.input,
                    ...(state.errors.password && state.pwTouched ? styles.inputError : {}),
                    ...(pwValid ? styles.inputValid : {}),
                  }}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  style={styles.eyeBtn}
                  onClick={() => dispatch({ type: "TOGGLE_PASSWORD" })}
                  aria-label="Toggle password visibility"
                >
                  <EyeIcon open={state.showPassword} />
                </button>
              </div>
              <StrengthBar password={state.password} />
              {state.errors.password && state.pwTouched && (
                <div style={styles.fieldErr}>
                  <ErrorIcon />
                  <span>{state.errors.password}</span>
                </div>
              )}
            </div>

            {/* Submit */}
              <button
                type="submit"
                disabled={state.loading}
                style={{
                  ...styles.submitBtn,
                  ...(state.loading ? styles.submitBtnDisabled : {}),
                }}
              >
                {state.loading ? (
                  <div style={styles.btnInner}>
                    <Spinner />
                  </div>
                ) : (
                  <div style={styles.btnInner}>
                    <ArrowIcon />
                    <span>Sign In</span>
                  </div>
                )}
              </button>
            </form>

            <div style={styles.registerText}>
              New to Nexus?{" "}
              <span
                style={styles.registerLink}
                onClick={() => showToast("Redirecting to registration...", "success")}
              >
                Create an account
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles: Record<string, CSSProperties> = {
  page: {
    display: "flex",
    alignItems: "stretch",
    justifyContent: "stretch",
    width: "100%",
    minHeight: "100vh",
    padding: 0,
    overflow: "hidden",
    fontFamily: "'DM Sans', sans-serif",
  },
  card: {
    display: "flex",
    width: "100%",
    maxWidth: "none",
    minHeight: "100vh",
    borderRadius: "0",
    overflow: "hidden",
    background: "#0D0F14",
    border: "none",
  },
  side: {
    width: "min(36vw, 420px)",
    flexShrink: 0,
    background: "#161A23",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem 1.5rem",
    position: "relative",
    overflow: "hidden",
    borderRight: "1px solid rgba(201,168,76,0.12)",
  },
  geoBg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    opacity: 0.07,
    pointerEvents: "none",
  },
  sideContent: {
    position: "relative",
    zIndex: 2,
    textAlign: "center",
  },
  brandName: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "22px",
    fontWeight: 600,
    color: "#E8C97A",
    letterSpacing: "0.08em",
    lineHeight: 1.2,
    marginTop: "1.25rem",
  },
  brandSub: {
    fontSize: "11px",
    color: "#6B7280",
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    marginTop: "6px",
  },
  sideDivider: {
    width: "40px",
    height: "1px",
    background: "linear-gradient(90deg, transparent, #8A6E2F, transparent)",
    margin: "1.5rem auto",
  },
  sideTagline: {
    fontSize: "12px",
    color: "#A8B0C0",
    lineHeight: 1.7,
    textAlign: "center",
    opacity: 0.75,
  },
  formArea: {
    flex: 1,
    padding: "2.5rem 2rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  formContent: {
    width: "100%",
    maxWidth: "420px",
    position: "relative",
  },
  formTitle: {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: "28px",
    fontWeight: 600,
    color: "#F0EAD6",
    letterSpacing: "0.02em",
    marginBottom: "4px",
  },
  formSub: {
    fontSize: "13px",
    color: "#6B7280",
    marginBottom: "1.75rem",
  },
  googleBtn: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "10px",
    width: "100%",
    padding: "11px",
    background: "#1E2330",
    border: "1px solid rgba(201,168,76,0.25)",
    borderRadius: "12px",
    cursor: "pointer",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13.5px",
    color: "#A8B0C0",
    fontWeight: 500,
    transition: "all 0.2s",
    letterSpacing: "0.01em",
    marginBottom: "1.5rem",
  },
  googleBtnLoading: {
    opacity: 0.6,
    cursor: "not-allowed",
  },
  divider: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "1.25rem",
  },
  divLine: {
    flex: 1,
    height: "1px",
    background: "rgba(255,255,255,0.07)",
  },
  divText: {
    fontSize: "11px",
    color: "#6B7280",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  field: {
    marginBottom: "1.1rem",
  },
  fieldLabel: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "11.5px",
    fontWeight: 500,
    color: "#A8B0C0",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    marginBottom: "7px",
  },
  inputWrap: {
    position: "relative",
  },
  inputIconLeft: {
    position: "absolute",
    left: "13px",
    top: "50%",
    transform: "translateY(-50%)",
    opacity: 0.6,
    pointerEvents: "none",
    display: "flex",
    alignItems: "center",
  },
  input: {
    width: "100%",
    background: "#1E2330",
    border: "1px solid rgba(255,255,255,0.09)",
    borderRadius: "12px",
    padding: "11px 42px 11px 40px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "13.5px",
    color: "#E8E0D0",
    outline: "none",
    caretColor: "#C9A84C",
  },
  inputError: {
    borderColor: "rgba(224,82,82,0.6)",
    background: "#1A1519",
  },
  inputValid: {
    borderColor: "rgba(61,190,138,0.4)",
  },
  eyeBtn: {
    position: "absolute",
    right: "13px",
    top: "50%",
    transform: "translateY(-50%)",
    cursor: "pointer",
    opacity: 0.4,
    background: "none",
    border: "none",
    padding: "2px",
    display: "flex",
    alignItems: "center",
  },
  forgotBtn: {
    fontSize: "12px",
    color: "#8A6E2F",
    cursor: "pointer",
    background: "none",
    border: "none",
    fontFamily: "'DM Sans', sans-serif",
    padding: 0,
  },
  fieldErr: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    fontSize: "11.5px",
    color: "#E05252",
    marginTop: "6px",
  },
  strengthBar: {
    display: "flex",
    gap: "3px",
    marginTop: "7px",
  },
  strengthSeg: {
    flex: 1,
    height: "3px",
    borderRadius: "2px",
    transition: "background 0.3s",
  },
  strengthHint: {
    fontSize: "11px",
    color: "#6B7280",
    marginTop: "5px",
  },
  submitBtn: {
    width: "100%",
    padding: "12.5px",
    background: "#C9A84C",
    border: "none",
    borderRadius: "12px",
    fontFamily: "'DM Sans', sans-serif",
    fontSize: "14px",
    fontWeight: 500,
    color: "#0D0F14",
    cursor: "pointer",
    transition: "all 0.2s",
    letterSpacing: "0.04em",
    marginTop: "0.25rem",
  },
  submitBtnDisabled: {
    background: "#3A3420",
    color: "#6B5E30",
    cursor: "not-allowed",
  },
  btnInner: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: "8px",
  },
  spinner: {
    width: "16px",
    height: "16px",
    border: "2px solid rgba(0,0,0,0.2)",
    borderTopColor: "#0D0F14",
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  },
  registerText: {
    textAlign: "center",
    marginTop: "1.25rem",
    fontSize: "12.5px",
    color: "#6B7280",
  },
  registerLink: {
    color: "#C9A84C",
    cursor: "pointer",
    fontWeight: 500,
  },
  toast: {
    position: "absolute",
    top: "16px",
    left: "50%",
    transform: "translateX(-50%)",
    borderRadius: "10px",
    padding: "10px 18px",
    fontSize: "13px",
    pointerEvents: "none",
    transition: "all 0.3s",
    whiteSpace: "nowrap",
    zIndex: 10,
  },
  toastSuccess: {
    background: "#1C2D24",
    border: "1px solid rgba(61,190,138,0.4)",
    color: "#3DBE8A",
  },
  toastError: {
    background: "#2D1C1C",
    border: "1px solid rgba(224,82,82,0.4)",
    color: "#E05252",
  },
};