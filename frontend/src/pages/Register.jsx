import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Register.css';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'citizen', ward: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.name) newErrors.name = 'Name is required';
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Email is invalid';
    if (!form.password || form.password.length < 6) newErrors.password = 'Min 6 characters';
    if (form.phone && !/^\+?[0-9\-\s]{7,15}$/.test(form.phone)) newErrors.phone = 'Enter a valid phone';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!validate()) return;
    setLoading(true);
    try {
      await register(form);
      navigate('/');
    } catch (err) {
      setError(err?.response?.data?.message || 'Register failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2>Create your account</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={onSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input id="name" name="name" value={form.name} onChange={onChange} className={`${errors.name ? 'error' : ''} ${form.name ? 'has-value' : ''}`} placeholder="Your full name" />
            {errors.name && <span className="error-text">{errors.name}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input id="email" name="email" value={form.email} onChange={onChange} type="email" className={`${errors.email ? 'error' : ''} ${form.email ? 'has-value' : ''}`} placeholder="you@example.com" />
            {errors.email && <span className="error-text">{errors.email}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input id="password" name="password" value={form.password} onChange={onChange} type="password" className={`${errors.password ? 'error' : ''} ${form.password ? 'has-value' : ''}`} placeholder="Minimum 6 characters" />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input id="phone" name="phone" value={form.phone} onChange={onChange} className={`${errors.phone ? 'error' : ''} ${form.phone ? 'has-value' : ''}`} placeholder="Optional" />
            {errors.phone && <span className="error-text">{errors.phone}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select id="role" name="role" value={form.role} onChange={onChange}>
              <option value="citizen">Citizen</option>
              <option value="operator">Operator</option>
              <option value="wardAdmin">Ward Admin</option>
              <option value="superAdmin">Super Admin</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="ward">Ward (optional)</label>
            <input id="ward" name="ward" value={form.ward} onChange={onChange} placeholder="Ward name/number" />
          </div>
          <button className="login-btn" disabled={loading} type="submit">{loading ? 'Registering...' : 'Register'}</button>
        </form>
        <div className="login-footer">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </div>
    </div>
  );
}


