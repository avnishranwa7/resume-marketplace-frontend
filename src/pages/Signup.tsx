import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../styles/Signup.css';
import { signup } from '../api/auth';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const Signup: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: searchParams.get('role') || 'job_seeker',
    company: {
      name: '',
      website: '',
      industry: '',
      size: '',
      location: ''
    }
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('token')) {
      navigate('/profile');
    }
  }, [navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('company.')) {
      const companyField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        company: {
          ...prev.company,
          [companyField]: value
        }
      }));
      setErrors((prev: any) => ({ ...prev, [name]: undefined }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
      setErrors((prev: any) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    try {
      const payload: any = { ...formData };
      if (payload.role === 'job_seeker' && 'company' in payload) {
        delete payload.company;
      }
      await signup(payload);
      navigate('/activate-account');
    } catch (err: any) {
      // Parse error response
      const apiErrors = err.response?.data?.data || [];
      const newErrors: any = {};
      apiErrors.forEach((error: any) => {
        if (error && error.path) {
          if (error.path.startsWith('company.')) {
            newErrors[error.path] = error.msg;
          } else {
            newErrors[error.path] = error.msg;
          }
        }
      });
      setErrors(newErrors);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-container">
      <div className="signup-form">
        <h1>Create Your Account</h1>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            {errors.email && <div className="error-message">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
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
            {errors.password && <div className="error-message">{errors.password}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div style={{ position: 'relative' }}>
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="show-password-btn"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
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
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </button>
            </div>
            {errors.confirmPassword && <div className="error-message">{errors.confirmPassword}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="role">I am a</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
            >
              <option value="job_seeker">Job Seeker</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>

          {formData.role === 'recruiter' && (
            <>
              <div className="form-group">
                <label htmlFor="company.name">Company Name</label>
                <input
                  type="text"
                  id="company.name"
                  name="company.name"
                  value={formData.company.name}
                  onChange={handleChange}
                />
                {errors['company.name'] && <div className="error-message">{errors['company.name']}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="company.website">Company Website</label>
                <input
                  type="url"
                  id="company.website"
                  name="company.website"
                  value={formData.company.website}
                  onChange={handleChange}
                />
                {errors['company.website'] && <div className="error-message">{errors['company.website']}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="company.industry">Industry</label>
                <input
                  type="text"
                  id="company.industry"
                  name="company.industry"
                  value={formData.company.industry}
                  onChange={handleChange}
                />
                {errors['company.industry'] && <div className="error-message">{errors['company.industry']}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="company.size">Company Size</label>
                <select
                  id="company.size"
                  name="company.size"
                  value={formData.company.size}
                  onChange={handleChange}
                >
                  <option value="">Select size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
                {errors['company.size'] && <div className="error-message">{errors['company.size']}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="company.location">Company Location</label>
                <input
                  type="text"
                  id="company.location"
                  name="company.location"
                  value={formData.company.location}
                  onChange={handleChange}
                />
                {errors['company.location'] && <div className="error-message">{errors['company.location']}</div>}
              </div>
            </>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className="login-link">
          Already have an account? <span onClick={() => navigate('/login')}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default Signup; 