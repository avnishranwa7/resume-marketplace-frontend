import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Alert,
  AlertColor,
} from "@mui/material";
import useDocumentTitle from "../hooks/useDocumentTitle";
import axiosInstance from "../api/axiosInstance";
import "../styles/ForgotPassword.css";

const ForgotPassword: React.FC = () => {
  useDocumentTitle("Forgot Password");
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: AlertColor;
  }>({ open: false, message: "", severity: "info" });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await axiosInstance.post("/forgot-password", { email });
      setSnackbar({
        open: true,
        message: "Password reset link has been sent to your email",
        severity: "success",
      });
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (error: any) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Something went wrong",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      minHeight="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
      bgcolor="#f5f7fa"
      p={2}
      sx={{ fontFamily: 'Inter, Roboto, Arial, sans-serif' }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 3, sm: 4 },
          borderRadius: 2.5,
          width: "100%",
          maxWidth: 400,
          textAlign: "center",
          fontFamily: 'inherit',
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
          <img src="/favicon.svg" alt="Resume Marketplace Logo" style={{ height: 56, width: 56, marginBottom: 10 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#222b45', letterSpacing: 0.5 }}>RESUME</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#4361ee', letterSpacing: 0.5 }}>MARKETPLACE</span>
          </div>
        </div>
        <Typography color="#7f8c8d" mb={3} sx={{ fontFamily: 'inherit', fontSize: '1rem' }}>
          Enter your email address and we'll send you a link to reset your password.
        </Typography>

        {snackbar.open && (
          <Alert severity={snackbar.severity} sx={{ mb: 2, fontFamily: 'inherit', fontSize: '1rem' }}>
            {snackbar.message}
          </Alert>
        )}

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <div className="form-group">
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </div>
          <button
            type="submit"
            className="submit-btn"
            disabled={isLoading}
            style={{ marginTop: 0 }}
          >
            {isLoading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>

        <div style={{ marginTop: 24 }}>
        <p className="forgot-password-link">
          <span onClick={() => navigate('/login')} style={{ color: '#4361ee', cursor: 'pointer', fontWeight: 500 }}>Back to Login</span>
          </p>
        </div>
      </Paper>
    </Box>
  );
};

export default ForgotPassword; 