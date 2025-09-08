import { useEffect, useMemo, useState } from 'react';
import api from '../../services/api';
import './AdminOperators.css'

export default function AdminOperators() {
  const [operators, setOperators] = useState([]);
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', ward:'' });
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [msg, setMsg] = useState('')
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/admin/operators');
      setOperators(data);
    } finally {
      setLoading(false)
    }
  };

  useEffect(() => { load(); }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const create = async (e) => {
    e.preventDefault();
    setMsg('')
    setError('')
    try {
      await api.post('/admin/operators', form);
      setMsg('Operator created successfully')
      setForm({ name:'', email:'', password:'', phone:'', ward:'' });
      await load();
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create operator')
    }
  };

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return operators
    return operators.filter(o => [o.name, o.email, o.phone, o.ward].some(v => String(v || '').toLowerCase().includes(q)))
  }, [operators, search])

  return (
    <div className="admin-operators">
      <div className="header">
        <h2>Operators</h2>
        <p className="muted">Create and manage field operators assigned to wards.</p>
      </div>

      {msg && <div className="alert success">{msg}</div>}
      {error && <div className="alert error">{error}</div>}

      <div className="split">
        <div className="left">
          <div className="panel">
            <h3>Create Operator</h3>
            <form className="form" onSubmit={create}>
              <div className="grid-2">
                <div className="field">
                  <label>Name</label>
                  <input name="name" value={form.name} onChange={onChange} placeholder="e.g. Rakesh Sharma" required />
                </div>
                <div className="field">
                  <label>Email</label>
                  <input name="email" value={form.email} onChange={onChange} type="email" placeholder="name@example.com" required />
                </div>
                <div className="field">
                  <label>Password</label>
                  <input name="password" value={form.password} onChange={onChange} type="password" placeholder="Set a secure password" required />
                </div>
                <div className="field">
                  <label>Phone</label>
                  <input name="phone" value={form.phone} onChange={onChange} placeholder="Optional" />
                </div>
                <div className="field">
                  <label>Ward</label>
                  <input name="ward" value={form.ward} onChange={onChange} placeholder="e.g. 12" />
                </div>
              </div>
              <div className="actions">
                <button type="submit" className="btn primary" disabled={loading}>{loading ? 'Saving…' : 'Create Operator'}</button>
              </div>
            </form>
          </div>
        </div>

        <div className="right">
          <div className="panel">
            <div className="list-header">
              <h3>All Operators</h3>
              <input className="search" placeholder="Search name, email, ward" value={search} onChange={(e) => setSearch(e.target.value)} />
            </div>
            <div className="table-wrapper">
              <table className="operators-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Ward</th>
                    <th>Created</th>
                  </tr>
                </thead>
                <tbody>
                  {loading && (
                    <tr><td colSpan={5} className="muted">Loading…</td></tr>
                  )}
                  {!loading && filtered.length === 0 && (
                    <tr><td colSpan={5} className="muted">No operators found</td></tr>
                  )}
                  {filtered.map(o => (
                    <tr key={o._id}>
                      <td>{o.name}</td>
                      <td>{o.email}</td>
                      <td>{o.phone || '—'}</td>
                      <td>{o.ward || '—'}</td>
                      <td>{o.createdAt ? new Date(o.createdAt).toLocaleDateString() : '—'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


