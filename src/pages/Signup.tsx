import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../styles/Signup.css";
import { signup } from "../api/auth";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { Link } from "react-router-dom";
import useDocumentTitle from '../hooks/useDocumentTitle';

const Signup: React.FC = () => {
  useDocumentTitle('Sign Up');

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: searchParams.get("role") || "job_seeker",
    company: {
      name: "",
      website: "",
      industry: "",
      size: "",
      location: "",
    },
  });
  const [errors, setErrors] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/profile");
    }
  }, [navigate]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    if (name.startsWith("company.")) {
      const companyField = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        company: {
          ...prev.company,
          [companyField]: value,
        },
      }));
      setErrors((prev: any) => ({ ...prev, [name]: undefined }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
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
      if (payload.role === "job_seeker" && "company" in payload) {
        delete payload.company;
      }
      await signup(payload);
      navigate("/activate-account");
    } catch (err: any) {
      // Parse error response
      const apiErrors = err.response?.data?.data || [];
      const newErrors: any = {};
      apiErrors.forEach((error: any) => {
        if (error && error.path) {
          if (error.path.startsWith("company.")) {
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
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
          <img src="/favicon.svg" alt="Resume Marketplace Logo" style={{ height: 64, width: 64, marginBottom: 12 }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#222b45', letterSpacing: 0.5 }}>RESUME</span>
            <span style={{ fontSize: '1.5rem', fontWeight: 700, color: '#4361ee', letterSpacing: 0.5 }}>MARKETPLACE</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Full Name"
            />
          </div>

          <div className="form-group">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Email"
            />
            {errors.email && (
              <div className="error-message">{errors.email}</div>
            )}
          </div>

          <div className="form-group">
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Password"
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
            {errors.password && (
              <div className="error-message">{errors.password}</div>
            )}
          </div>

          <div className="form-group">
            <div style={{ position: "relative" }}>
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                placeholder="Confirm Password"
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
                aria-label={showConfirmPassword ? "Hide password" : "Show password"}
              >
                {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
              </button>
            </div>
            {errors.confirmPassword && (
              <div className="error-message">{errors.confirmPassword}</div>
            )}
          </div>

          <div className="form-group">
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              style={{ color: formData.role ? '#222b45' : '#a0aec0' }}
            >
              <option value="" disabled>I am a...</option>
              <option value="job_seeker">Job Seeker</option>
              <option value="recruiter">Recruiter</option>
            </select>
          </div>

          <div className="terms-checkbox">
            <input type="checkbox" id="terms" required />
            <label htmlFor="terms" style={{ fontSize: '0.97rem', color: '#6c757d' }}>
              I agree to the
              <a href="/terms" target="_blank" rel="noopener noreferrer" style={{ color: '#4361ee', margin: '0 0.25em' }}>Terms and Conditions</a>
              and
              <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" style={{ color: '#4361ee', margin: '0 0.25em' }}>Privacy Policy</a>.
            </label>
          </div>

          {formData.role === "recruiter" && (
            <>
              <div className="form-group">
                <input
                  type="text"
                  id="company.name"
                  name="company.name"
                  value={formData.company.name}
                  onChange={handleChange}
                  placeholder="Company Name"
                />
                {errors["company.name"] && (
                  <div className="error-message">{errors["company.name"]}</div>
                )}
              </div>

              <div className="form-group">
                <input
                  type="url"
                  id="company.website"
                  name="company.website"
                  value={formData.company.website}
                  onChange={handleChange}
                  placeholder="Company Website"
                />
                {errors["company.website"] && (
                  <div className="error-message">
                    {errors["company.website"]}
                  </div>
                )}
              </div>

              <div className="form-group">
                <input
                  type="text"
                  id="company.industry"
                  name="company.industry"
                  value={formData.company.industry}
                  onChange={handleChange}
                  placeholder="Industry"
                />
                {errors["company.industry"] && (
                  <div className="error-message">
                    {errors["company.industry"]}
                  </div>
                )}
              </div>

              <div className="form-group">
                <select
                  id="company.size"
                  name="company.size"
                  value={formData.company.size}
                  onChange={handleChange}
                  style={{ color: formData.company.size ? '#222b45' : '#a0aec0' }}
                >
                  <option value="">Company Size</option>
                  <option value="1-10">1-10 employees</option>
                  <option value="11-50">11-50 employees</option>
                  <option value="51-200">51-200 employees</option>
                  <option value="201-500">201-500 employees</option>
                  <option value="501-1000">501-1000 employees</option>
                  <option value="1000+">1000+ employees</option>
                </select>
                {errors["company.size"] && (
                  <div className="error-message">{errors["company.size"]}</div>
                )}
              </div>

              <div className="form-group">
                <input
                  type="text"
                  id="company.location"
                  name="company.location"
                  value={formData.company.location}
                  onChange={handleChange}
                  placeholder="Company Location"
                />
                {errors["company.location"] && (
                  <div className="error-message">
                    {errors["company.location"]}
                  </div>
                )}
              </div>
            </>
          )}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="login-link">
          Already have an account?{' '}
          <span onClick={() => navigate('/login')} style={{ color: '#4361ee', cursor: 'pointer', fontWeight: 500 }}>Login</span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
