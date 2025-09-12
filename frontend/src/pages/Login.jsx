import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Login.css';

export default function Login() {
  const { login } = useAuth(); // AuthContext hook (provides login method)
  const navigate = useNavigate(); // React Router navigation

  // ============================
  // Local State Management
  // ============================
  // Stores form input values (email, password)
  const [formData, setFormData] = useState({ email: '', password: '' });
  // Stores validation errors for each field
  const [errors, setErrors] = useState({});
  // Tracks loading state when form is submitting
  const [loading, setLoading] = useState(false);
  // Stores error message returned from API (login failure, etc.)
  const [error, setError] = useState('');

  // ============================
  // Handle input field changes
  // ============================
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Update field value
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error if user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // ============================
  // Form Validation
  // ============================
  const validateForm = () => {
    const newErrors = {};

    // Validate Email
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    // Validate Password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    // Save validation errors in state
    setErrors(newErrors);
    // Return true if no validation errors
    return Object.keys(newErrors).length === 0;
  };

  // ============================
  // Handle Form Submit
  // ============================
  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous API error

    // Stop if validation fails
    if (!validateForm()) return;

    setLoading(true); // Show loading state in button
    try {
      // Call AuthContext login method
      await login(formData.email, formData.password);
      // Navigate to homepage after success
      navigate('/');
    } catch (err) {
      // Show backend error (if available) or fallback message
      setError(err?.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false); // Reset loading state
    }
  };

  // ============================
  // JSX Layout
  // ============================
  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Welcome back</h2>

        {/* API error (invalid credentials, server error, etc.) */}
        {error && <div className="error-message">{error}</div>}

        {/* Login Form */}
        <form onSubmit={onSubmit} className="login-form">
          
          {/* Email Input */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`${errors.email ? 'error' : ''} ${formData.email ? 'has-value' : ''}`}
              placeholder="Enter your email"
              autoComplete="email"
            />
            {/* Email validation error */}
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              className={`${errors.password ? 'error' : ''} ${formData.password ? 'has-value' : ''}`}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            {/* Password validation error */}
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          {/* Submit Button (shows loading text while logging in) */}
          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        {/* Footer Link (for users who don't have an account yet) */}
        <div className="login-footer">
          <p>Don't have an account? <Link to="/register">Register here</Link></p>
        </div>
      </div>
    </div>
  );
}
