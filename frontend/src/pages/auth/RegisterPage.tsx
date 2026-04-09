import { useMemo, useRef, useState } from "react";
import type { CSSProperties, FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useRegisterMutation, type RegisterResponse } from "../../store/api/authApi";

type ToastType = "" | "success" | "error";

type RegisterErrors = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

const initialErrors: RegisterErrors = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  confirmPassword: "",
};

function validateEmail(value: string): string {
  if (!value.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Enter a valid email address";
  return "";
}

function validatePassword(value: string): string {
  if (!value) return "Password is required";
  if (value.length < 6) return "At least 6 characters required";
  return "";
}

export default function RegisterPage() {
  const navigate = useNavigate();
  const [registerMutation] = useRegisterMutation();
  const hideToastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<RegisterErrors>(initialErrors);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<ToastType>("");
  const [toastVisible, setToastVisible] = useState(false);

  const canSubmit = useMemo(() => {
    return (
      firstName.trim().length > 0 &&
      lastName.trim().length > 0 &&
      email.trim().length > 0 &&
      password.length > 0 &&
      confirmPassword.length > 0
    );
  }, [firstName, lastName, email, password, confirmPassword]);

  function showToast(message: string, type: Exclude<ToastType, "">) {
    setToastMessage(message);
    setToastType(type);
    setToastVisible(true);

    if (hideToastTimer.current) {
      clearTimeout(hideToastTimer.current);
    }
    hideToastTimer.current = setTimeout(() => setToastVisible(false), 2600);
  }

  function validateForm(): boolean {
    const nextErrors: RegisterErrors = {
      firstName: firstName.trim() ? "" : "First name is required",
      lastName: lastName.trim() ? "" : "Last name is required",
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: confirmPassword ? "" : "Please confirm your password",
    };

    if (!nextErrors.confirmPassword && password !== confirmPassword) {
      nextErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(nextErrors);
    return Object.values(nextErrors).every((value) => value.length === 0);
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const result: RegisterResponse = await registerMutation({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        email: email.trim(),
        password,
      }).unwrap();

      showToast(result.message || "Account created successfully", "success");
      setTimeout(() => navigate("/login"), 900);
    } catch (error: unknown) {
      if (axios.isAxiosError<{ message?: string }>(error)) {
        showToast(error.response?.data?.message || "Registration failed", "error");
      } else {
        showToast("Something went wrong. Please try again.", "error");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.side}>
          <h1 style={styles.brand}>GetJob</h1>
          <p style={styles.sideText}>Create your account to start managing tasks and projects.</p>
        </div>

        <div style={styles.formArea}>
          <div
            style={{
              ...styles.toast,
              ...(toastType === "error" ? styles.toastError : styles.toastSuccess),
              opacity: toastVisible ? 1 : 0,
              transform: toastVisible ? "translateX(-50%)" : "translateX(-50%) translateY(-6px)",
            }}
          >
            {toastMessage}
          </div>

          <h2 style={styles.title}>Create account</h2>
          <p style={styles.subtitle}>Fill in your details to register</p>

          <form onSubmit={handleSubmit} noValidate style={styles.form}>
            <div style={styles.row}>
              <div style={styles.field}>
                <label style={styles.label} htmlFor="firstName">First name</label>
                <input
                  id="firstName"
                  style={{ ...styles.input, ...(errors.firstName ? styles.inputError : {}) }}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  placeholder="John"
                  autoComplete="given-name"
                />
                {errors.firstName && <span style={styles.error}>{errors.firstName}</span>}
              </div>

              <div style={styles.field}>
                <label style={styles.label} htmlFor="lastName">Last name</label>
                <input
                  id="lastName"
                  style={{ ...styles.input, ...(errors.lastName ? styles.inputError : {}) }}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  placeholder="Doe"
                  autoComplete="family-name"
                />
                {errors.lastName && <span style={styles.error}>{errors.lastName}</span>}
              </div>
            </div>

            <div style={styles.field}>
              <label style={styles.label} htmlFor="email">Email</label>
              <input
                id="email"
                type="email"
                style={{ ...styles.input, ...(errors.email ? styles.inputError : {}) }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                autoComplete="email"
              />
              {errors.email && <span style={styles.error}>{errors.email}</span>}
            </div>

            <div style={styles.field}>
              <label style={styles.label} htmlFor="password">Password</label>
              <div style={styles.passwordWrap}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  style={{ ...styles.input, ...(errors.password ? styles.inputError : {}) }}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  autoComplete="new-password"
                />
                <button type="button" style={styles.eyeButton} onClick={() => setShowPassword((v) => !v)}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && <span style={styles.error}>{errors.password}</span>}
            </div>

            <div style={styles.field}>
              <label style={styles.label} htmlFor="confirmPassword">Confirm password</label>
              <div style={styles.passwordWrap}>
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  style={{ ...styles.input, ...(errors.confirmPassword ? styles.inputError : {}) }}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  style={styles.eyeButton}
                  onClick={() => setShowConfirmPassword((v) => !v)}
                >
                  {showConfirmPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.confirmPassword && <span style={styles.error}>{errors.confirmPassword}</span>}
            </div>

            <button type="submit" style={styles.submit} disabled={loading || !canSubmit}>
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <p style={styles.footerText}>
            Already have an account?{" "}
            <button style={styles.linkBtn} type="button" onClick={() => navigate("/login")}>
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

const styles: Record<string, CSSProperties> = {
  page: {
    minHeight: "100vh",
    background: "#0a0d12",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
    fontFamily: "'DM Sans', sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "980px",
    minHeight: "600px",
    display: "grid",
    gridTemplateColumns: "minmax(220px, 32%) 1fr",
    border: "1px solid rgba(201,168,76,0.24)",
    borderRadius: "20px",
    overflow: "hidden",
    background: "#0f1219",
  },
  side: {
    background: "linear-gradient(180deg, #1b2130 0%, #131825 100%)",
    padding: "2.25rem 1.5rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    gap: "0.75rem",
  },
  brand: {
    margin: 0,
    fontSize: "2rem",
    color: "#e8c97a",
    letterSpacing: "0.06em",
    fontWeight: 600,
  },
  sideText: {
    margin: 0,
    color: "#aeb6c4",
    fontSize: "0.95rem",
    lineHeight: 1.6,
  },
  formArea: {
    position: "relative",
    padding: "2.25rem",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  title: {
    margin: 0,
    color: "#f0ead6",
    fontSize: "1.9rem",
    lineHeight: 1.2,
  },
  subtitle: {
    margin: "0.35rem 0 1.4rem",
    color: "#8f98a8",
    fontSize: "0.92rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "0.95rem",
  },
  row: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "0.8rem",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "0.36rem",
  },
  label: {
    color: "#9ca7ba",
    fontSize: "0.8rem",
    textTransform: "uppercase",
    letterSpacing: "0.06em",
  },
  input: {
    width: "100%",
    borderRadius: "12px",
    border: "1px solid rgba(255,255,255,0.1)",
    background: "#1b2130",
    color: "#f2ecdd",
    fontSize: "0.92rem",
    padding: "0.72rem 0.85rem",
    outline: "none",
    boxSizing: "border-box",
  },
  inputError: {
    border: "1px solid rgba(224,82,82,0.62)",
  },
  passwordWrap: {
    position: "relative",
  },
  eyeButton: {
    position: "absolute",
    right: "0.6rem",
    top: "50%",
    transform: "translateY(-50%)",
    border: "none",
    background: "transparent",
    color: "#c9a84c",
    fontSize: "0.75rem",
    cursor: "pointer",
  },
  error: {
    color: "#e97b7b",
    fontSize: "0.75rem",
  },
  submit: {
    marginTop: "0.45rem",
    border: "none",
    borderRadius: "12px",
    background: "#c9a84c",
    color: "#111623",
    fontWeight: 700,
    fontSize: "0.95rem",
    padding: "0.82rem 1rem",
    cursor: "pointer",
  },
  footerText: {
    margin: "1rem 0 0",
    color: "#97a0af",
    fontSize: "0.9rem",
  },
  linkBtn: {
    border: "none",
    background: "transparent",
    color: "#e8c97a",
    cursor: "pointer",
    fontSize: "0.9rem",
    padding: 0,
  },
  toast: {
    position: "absolute",
    top: "1rem",
    left: "50%",
    transform: "translateX(-50%)",
    borderRadius: "10px",
    padding: "0.6rem 0.85rem",
    fontSize: "0.82rem",
    transition: "all 0.25s ease",
    pointerEvents: "none",
    whiteSpace: "nowrap",
  },
  toastSuccess: {
    background: "#1a2a22",
    border: "1px solid rgba(61,190,138,0.45)",
    color: "#66d7a4",
  },
  toastError: {
    background: "#2d1c1c",
    border: "1px solid rgba(224,82,82,0.45)",
    color: "#ef8686",
  },
};
