import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Register.css';

export default function Register() {
  const { register } = useAuth(); // AuthContext hook (provides register function)
  const navigate = useNavigate(); // Navigation after successful registration

  // ============================
  // Local State
  // ============================
  // Form data fields: name, email, password, phone, role, ward
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'citizen',
    ward: ''
  });

  // Validation errors for each input field
  const [errors, setErrors] = useState({});
  // Tracks loading state during submission
  const [loading, setLoading] = useState(false);
  // Stores backend error message (if registration fails)
  const [error, setError] = useState('');

  // ============================
  // Handle Input Change
  // ============================
  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    // Clear existing error for the field if user starts typing
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  // ============================
  // Client-side Form Validation
  // ============================
  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Name is required';

    // Email validation
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email is invalid';

    // Password validation
    if (!form.password || form.password.length < 6)
      newErrors.password = 'Min 6 characters';

    // Phone validation (optional field)
    if (form.phone && !/^\+?[0-9\-\s]{7,15}$/.test(form.phone))
      newErrors.phone = 'Enter a valid phone';

    // Save errors into state
    setErrors(newErrors);
    // Return true only if no errors
    return Object.keys(newErrors).length === 0;
  };

  // ============================
  // Handle Form Submit
  // ============================
  const onSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear old error messages

    // Run client-side validation
    if (!validate()) return;

    setLoading(true); // Show loading state
    try {
      // Call AuthContext register method with form data
      await register(form);
      // Redirect to homepage after successful registration
      navigate('/');
    } catch (err) {
      // Display backend error if available, else fallback message
      setError(err?.response?.data?.message || 'Register failed');
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
        <h2>Create your account</h2>

        {/* API/server error (e.g., email already taken) */}
        {error && <div className="error-message">{error}</div>}

        {/* Registration Form */}
        <form onSubmit={onSubmit} className="login-form">

          {/* Name Input */}
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={onChange}
              className={`${errors.name ? 'error' : ''} ${form.name ? 'has-value' : ''}`}
              placeholder="Your full name"
            />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>

          {/* Email Input */}
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              value={form.email}
              onChange={onChange}
              type="email"
              className={`${errors.email ? 'error' : ''} ${form.email ? 'has-value' : ''}`}
              placeholder="you@example.com"
            />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>

          {/* Password Input */}
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              name="password"
              value={form.password}
              onChange={onChange}
              type="password"
              className={`${errors.password ? 'error' : ''} ${form.password ? 'has-value' : ''}`}
              placeholder="Minimum 6 characters"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          {/* Phone Input (optional) */}
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              name="phone"
              value={form.phone}
              onChange={onChange}
              className={`${errors.phone ? 'error' : ''} ${form.phone ? 'has-value' : ''}`}
              placeholder="Optional"
            />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>

          {/* Role Selection */}
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select id="role" name="role" value={form.role} onChange={onChange}>
              <option value="citizen">Citizen</option>
              <option value="operator">Operator</option>
              <option value="wardAdmin">Ward Admin</option>
              <option value="superAdmin">Super Admin</option>
            </select>
          </div>

          {/* Ward Input (optional) */}
          <div className="form-group">
            <label htmlFor="ward">Ward (optional)</label>
            <input
              id="ward"
              name="ward"
              value={form.ward}
              onChange={onChange}
              placeholder="Ward name/number"
            />
          </div>

          {/* Submit Button */}
          <button className="login-btn" disabled={loading} type="submit">
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        {/* Footer Link (for users who already have an account) */}
        <div className="login-footer">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
}
