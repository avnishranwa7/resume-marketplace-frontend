import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import '../styles/Login.css';
import { login } from '../api/auth';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../context/AuthContext';
import useDocumentTitle from '../hooks/useDocumentTitle';

const Login: React.FC = () => {
  const location = useLocation();
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
          if (data.role === 'job_seeker') {
            navigate('/profile');
          } else {
            const from = location.state?.from;
            navigate(from ?? '/explore');
          }
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
        <div className="login-form">
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
            <img src="/favicon.svg" alt="Resume Marketplace Logo" style={{ height: 64, width: 64, marginBottom: 12 }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#222b45', letterSpacing: 0.5 }}>RESUME</span>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#4361ee', letterSpacing: 0.5 }}>MARKETPLACE</span>
            </div>
          </div>
          {success && <div className="success-message">{success}</div>}
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
                  disabled={loading}
                />
                {fieldErrors.email && <div className="error-message">{fieldErrors.email}</div>}
              </div>
            </div>

            <div className="form-group">
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
              <Link to="/forgot-password" className="forgot-password" style={{ color: '#4361ee', textDecoration: 'none', fontSize: '0.95rem' }}>
                Forgot password?
              </Link>
            </div>

            {error && <div className="error-message">{error}</div>}
            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="signup-link">
            Don't have an account? <span onClick={() => navigate('/signup')} style={{ color: '#4361ee', cursor: 'pointer', fontWeight: 500 }}>Sign up</span>
          </p>
          <p style={{ textAlign: 'center', color: '#7f8c8d', fontSize: '0.95rem', marginTop: '1.5rem' }}>
            By continuing, you accept our
            <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#4361ee', margin: '0 0.25em' }}>Terms and Conditions</a>
            and
            <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: '#4361ee', margin: '0 0.25em' }}>Privacy Policy</a>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login; 