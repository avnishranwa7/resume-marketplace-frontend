import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/Login.css';
import { login } from '../api/auth';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../context/AuthContext';
import useDocumentTitle from '../hooks/useDocumentTitle';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});

  useDocumentTitle('Login');

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/profile');
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    setFieldErrors({});
    try {
      const data = await login(formData.email, formData.password);
      if (data.token) {
        authLogin(data.token);
        if (data.userId) {
          localStorage.setItem('userId', data.userId);
        }
        if (data.role) {
          localStorage.setItem('role', data.role);
        }
        setSuccess('Successfully logged in! Redirecting...');
        setTimeout(() => {
          navigate('/explore');
        }, 1000);
      } else {
        setError(data.message || 'Login failed.');
      }
    } catch (err: any) {
      const apiErrors = err.response?.data?.data || [];
      if (Array.isArray(apiErrors) && apiErrors.length > 0) {
        const newFieldErrors: { [key: string]: string } = {};
        apiErrors.forEach((error: any) => {
          if (error && error.path) {
            let msg = error.msg;
            if (error.path === 'email') {
              msg = msg.replace(/\s*Please Sign Up\s*/i, '').trim();
            }
            newFieldErrors[error.path] = msg;
          }
        });
        setFieldErrors(newFieldErrors);
        setError('');
      } else {
        setError(err.response?.data?.message || 'Login failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content" style={{ justifyContent: 'center' }}>
        {/* Minimal look: Only the login form, no illustration */}
        <div className="login-form">
          <div className="form-header">
            <h1>Welcome Back</h1>
            <p>Enter your credentials to access your account</p>
          </div>
          {success && <div className="success-message">{success}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <div className="input-wrapper-label">
                <label htmlFor="email">Email</label>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M2.5 6.66669L9.0755 11.0504C9.63533 11.4236 10.3647 11.4236 10.9245 11.0504L17.5 6.66669M4.16667 15.8334H15.8333C16.7538 15.8334 17.5 15.0872 17.5 14.1667V5.83335C17.5 4.91288 16.7538 4.16669 15.8333 4.16669H4.16667C3.24619 4.16669 2.5 4.91288 2.5 5.83335V14.1667C2.5 15.0872 3.24619 15.8334 4.16667 15.8334Z" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </div>
              <div className="input-wrapper">
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                {fieldErrors.email && <div className="error-message">{fieldErrors.email}</div>}
              </div>
            </div>

            <div className="form-group">
              <div className="input-wrapper-label">
                <label htmlFor="password">Password</label>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M13.3333 9.16669V6.66669C13.3333 4.82574 11.8409 3.33335 10 3.33335C8.15905 3.33335 6.66667 4.82574 6.66667 6.66669V9.16669M6.66667 9.16669H13.3333M6.66667 9.16669H5C4.07953 9.16669 3.33333 9.91288 3.33333 10.8334V15C3.33333 15.9205 4.07953 16.6667 5 16.6667H15C15.9205 16.6667 16.6667 15.9205 16.6667 15V10.8334C16.6667 9.91288 15.9205 9.16669 15 9.16669H13.3333" stroke="#4A5568" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
              </div>
              <div className="input-wrapper" style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  className="show-password-btn"
                  onClick={() => setShowPassword((prev) => !prev)}
                  tabIndex={-1}
                  style={{
                    position: 'absolute',
                    right: '0.75rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: '#4361EE',
                    fontSize: '1rem',
                    padding: 0
                  }}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </button>
              </div>
            </div>

            <div className="form-footer">
              <a href="#" className="forgot-password">Forgot password?</a>
            </div>

            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="signup-link">
            Don't have an account? <span onClick={() => navigate('/signup')}>Sign up</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 