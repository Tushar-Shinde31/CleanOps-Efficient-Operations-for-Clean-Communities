import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '', role: 'citizen', ward: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
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
    <div style={{ maxWidth: 520, margin: '0 auto' }}>
      <h2>Register</h2>
      {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
      <form onSubmit={onSubmit} className="form">
        <label>Name</label>
        <input name="name" value={form.name} onChange={onChange} required />
        <label>Email</label>
        <input name="email" value={form.email} onChange={onChange} type="email" required />
        <label>Password</label>
        <input name="password" value={form.password} onChange={onChange} type="password" required />
        <label>Phone</label>
        <input name="phone" value={form.phone} onChange={onChange} />
        <label>Role</label>
        <select name="role" value={form.role} onChange={onChange}>
          <option value="citizen">Citizen</option>
          <option value="operator">Operator</option>
          <option value="wardAdmin">Ward Admin</option>
          <option value="superAdmin">Super Admin</option>
        </select>
        <label>Ward (optional)</label>
        <input name="ward" value={form.ward} onChange={onChange} />
        <button disabled={loading} type="submit">{loading ? 'Registering...' : 'Register'}</button>
      </form>
    </div>
  );
}


