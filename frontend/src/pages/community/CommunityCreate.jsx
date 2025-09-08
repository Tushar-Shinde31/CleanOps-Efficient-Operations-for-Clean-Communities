import { useState } from 'react';
import api from '../../services/api';
import './CommunityCreate.css';

export default function CommunityCreate() {
  const [form, setForm] = useState({ title:'', description:'', ward:'', address:'', lat:'', lng:'', wasteType:'household', targetDate:'' });
  const [photos, setPhotos] = useState([]);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg(''); setError('');
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, v));
      for (const f of photos) fd.append('photos', f);
      const { data } = await api.post('/community', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMsg(`Project created: ${data.project.title}`);
      setForm({ title:'', description:'', ward:'', address:'', lat:'', lng:'', wasteType:'household', targetDate:'' });
      setPhotos([]);
    } catch (e2) {
      setError(e2?.response?.data?.message || 'Failed');
    }
  };

  return (
    <div className="community-create">
      <h2>Create Community Project</h2>
      {msg && <div className="alert success">{msg}</div>}
      {error && <div className="alert error">{error}</div>}
      <form className="form" onSubmit={onSubmit}>
        <label>Title</label>
        <input name="title" value={form.title} onChange={onChange} required />
        <label>Description</label>
        <textarea name="description" value={form.description} onChange={onChange} required />
        <div className="grid-2">
          <div>
            <label>Ward</label>
            <input name="ward" value={form.ward} onChange={onChange} required />
          </div>
          <div>
            <label>Waste Type</label>
            <select name="wasteType" value={form.wasteType} onChange={onChange}>
              <option value="sewage">Sewage</option>
              <option value="household">Household</option>
              <option value="industrial">Industrial</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label>Address</label>
            <input name="address" value={form.address} onChange={onChange} />
          </div>
          <div>
            <label>Latitude</label>
            <input name="lat" value={form.lat} onChange={onChange} />
          </div>
          <div>
            <label>Longitude</label>
            <input name="lng" value={form.lng} onChange={onChange} />
          </div>
          <div>
            <label>Target Date</label>
            <input name="targetDate" value={form.targetDate} onChange={onChange} type="date" />
          </div>
        </div>
        <label>Photos</label>
        <input className="file-input" type="file" multiple onChange={(e) => setPhotos([...e.target.files])} />
        <button className="btn primary" type="submit">Create</button>
      </form>
    </div>
  );
}


