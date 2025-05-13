import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import styles from "./ResetPassword.module.css";
import {
  Box,
  Typography,
  Alert,
  Snackbar,
  CircularProgress,
} from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useResetPassword, useVerifyPasswordLink } from "../queries/auth";

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const navigate = useNavigate();

  const [linkValid, setLinkValid] = useState(false);
  const [passwords, setPasswords] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  const { mutate: verifyPasswordLink, isPending } = useVerifyPasswordLink(
    () => {
      setLinkValid(true);
    },
    (err) => {
      setSnackbar({
        open: true,
        message: err,
        severity: "error",
      });
    }
  );

  const { mutate: resetPassword, isPending: resettingPassword } =
    useResetPassword(
      () => {
        setSnackbar({
          open: true,
          message: "Password reset successful! Redirecting to login...",
          severity: "success",
        });

        // Redirect to login page after 2 seconds
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      },
      (error) => {
        setSnackbar({
          open: true,
          message: error || "Failed to reset password",
          severity: "error",
        });
      }
    );

  const validatePassword = (password: string) => {
    if (password.length < 8) {
      return "Password must be at least 8 characters long";
    }
    if (!/[A-Z]/.test(password)) {
      return "Password must contain at least one uppercase letter";
    }
    if (!/[a-z]/.test(password)) {
      return "Password must contain at least one lowercase letter";
    }
    if (!/[0-9]/.test(password)) {
      return "Password must contain at least one number";
    }
    if (!/[!@#$%^&*]/.test(password)) {
      return "Password must contain at least one special character (!@#$%^&*)";
    }
    return "";
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswords((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "newPassword") {
      setErrors((prev) => ({
        ...prev,
        newPassword: validatePassword(value),
      }));
    } else if (name === "confirmPassword") {
      setErrors((prev) => ({
        ...prev,
        confirmPassword:
          value !== passwords.newPassword ? "Passwords do not match" : "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate passwords
    const newPasswordError = validatePassword(passwords.newPassword);
    const confirmPasswordError =
      passwords.newPassword !== passwords.confirmPassword
        ? "Passwords do not match"
        : "";

    setErrors({
      newPassword: newPasswordError,
      confirmPassword: confirmPasswordError,
    });

    if (newPasswordError || confirmPasswordError) {
      return;
    }

    resetPassword({
      password: passwords.newPassword,
      confirmPassword: passwords.confirmPassword,
      email: email ?? "",
      token: token ?? "",
    });
  };

  useEffect(() => {
    if (!token || !email) {
      setLinkValid(false);
      return;
    }

    verifyPasswordLink({ token: token, email: email });
  }, []);

  if (!linkValid) {
    return (
      <div className={styles.resetPasswordPage}>
        <Box className={styles.resetPasswordCard}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              marginBottom: "1.5rem",
            }}
          >
            <img
              src="/favicon.svg"
              alt="Resume Marketplace Logo"
              style={{ height: 64, width: 64, marginBottom: 12 }}
            />
            <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
              <span
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#222b45",
                  letterSpacing: 0.5,
                }}
              >
                RESUME
              </span>
              <span
                style={{
                  fontSize: "1.5rem",
                  fontWeight: 700,
                  color: "#4361ee",
                  letterSpacing: 0.5,
                }}
              >
                MARKETPLACE
              </span>
            </div>
          </div>
          {isPending ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <CircularProgress size={48} sx={{ color: "#4361EE" }} />
              <Typography className={styles.subtitle}>
                Verifying reset link...
              </Typography>
            </div>
          ) : (
            <>
              <Typography variant="h5" className={styles.title}>
                Invalid Reset Link
              </Typography>
              <Typography className={styles.subtitle}>
                The password reset link is invalid or has expired.
              </Typography>
              <button
                type="button"
                className="submit-btn"
                onClick={() => navigate("/forgot-password")}
              >
                Request New Reset Link
              </button>
            </>
          )}
        </Box>
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            variant="filled"
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </div>
    );
  }

  return (
    <div className={styles.resetPasswordPage}>
      <Box className={styles.resetPasswordCard}>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            marginBottom: "1.5rem",
          }}
        >
          <img
            src="/favicon.svg"
            alt="Resume Marketplace Logo"
            style={{ height: 64, width: 64, marginBottom: 12 }}
          />
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <span
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#222b45",
                letterSpacing: 0.5,
              }}
            >
              RESUME
            </span>
            <span
              style={{
                fontSize: "1.5rem",
                fontWeight: 700,
                color: "#4361ee",
                letterSpacing: 0.5,
              }}
            >
              MARKETPLACE
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className="form-group">
            <div className="input-wrapper" style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                id="newPassword"
                name="newPassword"
                placeholder="Enter new password"
                value={passwords.newPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="show-password-btn"
                onClick={() => setShowPassword((prev) => !prev)}
                tabIndex={-1}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#4361EE",
                  fontSize: "1rem",
                  padding: 0,
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </button>
            </div>
            {errors.newPassword && (
              <div className="error-message">{errors.newPassword}</div>
            )}
          </div>

          <div className="form-group">
            <div className="input-wrapper" style={{ position: "relative" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                placeholder="Confirm new password"
                value={passwords.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="show-password-btn"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                tabIndex={-1}
                style={{
                  position: "absolute",
                  right: "0.75rem",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#4361EE",
                  fontSize: "1rem",
                  padding: 0,
                }}
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="error-message">{errors.confirmPassword}</div>
            )}
          </div>

          <button
            type="submit"
            className="submit-btn"
            disabled={resettingPassword}
          >
            {resettingPassword ? (
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <CircularProgress size={20} sx={{ color: "white" }} />
                Resetting Password...
              </div>
            ) : (
              "Reset Password"
            )}
          </button>
        </form>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default ResetPassword;
