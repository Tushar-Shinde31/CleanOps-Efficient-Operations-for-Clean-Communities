import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminOperators() {
  const [operators, setOperators] = useState([]);
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', ward:'' });

  const load = async () => {
    const { data } = await api.get('/admin/operators');
    setOperators(data);
  };

  useEffect(() => { load(); }, []);

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const create = async (e) => {
    e.preventDefault();
    await api.post('/admin/operators', form);
    setForm({ name:'', email:'', password:'', phone:'', ward:'' });
    await load();
  };

  return (
    <div>
      <h2>Operators</h2>
      <form className="form" onSubmit={create} style={{ maxWidth: 520 }}>
        <label>Name</label>
        <input name="name" value={form.name} onChange={onChange} required />
        <label>Email</label>
        <input name="email" value={form.email} onChange={onChange} type="email" required />
        <label>Password</label>
        <input name="password" value={form.password} onChange={onChange} type="password" required />
        <label>Phone</label>
        <input name="phone" value={form.phone} onChange={onChange} />
        <label>Ward</label>
        <input name="ward" value={form.ward} onChange={onChange} />
        <button type="submit">Create Operator</button>
      </form>
      <h3>All Operators</h3>
      <ul>
        {operators.map(o => (
          <li key={o._id}>{o.name} - {o.email} - {o.ward || 'N/A'}</li>
        ))}
      </ul>
    </div>
  );
}


