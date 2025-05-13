import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { login } from "../store/slices/authSlice";
import { addNotification } from "../store/slices/notificationsSlice";
import { loginUser } from "../api/auth";
import "../styles/Login.css";
import useDocumentTitle from "../hooks/useDocumentTitle";

const Login: React.FC = () => {
  useDocumentTitle("Login");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await loginUser(formData);
      dispatch(
        login({
          token: response.token,
          role: response.role,
          userId: response.userId,
        })
      );

      // Add welcome notification
      dispatch(
        addNotification({
          message: `Welcome back! You've successfully logged in.`,
          type: "message",
        })
      );

      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || "An error occurred during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content" style={{ justifyContent: "center" }}>
        <div className="login-form">
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
          {error && <div className="error-message">{error}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper" style={{ position: "relative" }}>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="form-footer">
              <Link
                to="/forgot-password"
                className="forgot-password"
                style={{
                  color: "#4361ee",
                  textDecoration: "none",
                  fontSize: "0.95rem",
                }}
              >
                Forgot password?
              </Link>
            </div>

            <button type="submit" className="submit-btn" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="signup-link">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/signup")}
              style={{ color: "#4361ee", cursor: "pointer", fontWeight: 500 }}
            >
              Sign up
            </span>
          </p>
          <p
            style={{
              textAlign: "center",
              color: "#7f8c8d",
              fontSize: "0.95rem",
              marginTop: "1.5rem",
            }}
          >
            By continuing, you accept our
            <a
              href="/terms"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#4361ee", margin: "0 0.25em" }}
            >
              Terms and Conditions
            </a>
            and
            <a
              href="/privacy-policy"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: "#4361ee", margin: "0 0.25em" }}
            >
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
