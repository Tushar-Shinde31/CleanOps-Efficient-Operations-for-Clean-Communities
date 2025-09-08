import { useState } from 'react';
import api from '../../services/api';
import './CommunityCreate.css';

export default function CommunityCreate() {
  const [form, setForm] = useState({ title:'', description:'', ward:'', address:'', lat:'', lng:'', wasteType:'household', targetDate:'' });
  const [photos, setPhotos] = useState([]);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const descriptionMax = 800;

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
      <div className="header">
        <h2>Create Community Project</h2>
        <p className="muted">Organize a neighborhood clean-up or desludging drive. Share clear details to get more citizens involved.</p>
      </div>
      {msg && <div className="alert success">{msg}</div>}
      {error && <div className="alert error">{error}</div>}
      <div className="panel">
        <form className="form" onSubmit={onSubmit}>
          <div className="field">
            <label>Title</label>
            <input name="title" value={form.title} onChange={onChange} placeholder="e.g. Ward 5 Desludging Drive" required />
          </div>

          <div className="field">
            <div className="label-row">
              <label>Description</label>
              <span className="muted">{form.description.length}/{descriptionMax}</span>
            </div>
            <textarea name="description" value={form.description} onChange={onChange} placeholder="Describe the project goals, meeting point, and any coordination details" maxLength={descriptionMax} rows={5} required />
          </div>

          <div className="grid-2">
            <div className="field">
              <label>Ward</label>
              <input name="ward" value={form.ward} onChange={onChange} placeholder="e.g. 5" required />
            </div>
            <div className="field">
              <label>Waste Type</label>
              <select name="wasteType" value={form.wasteType} onChange={onChange}>
                <option value="sewage">Sewage</option>
                <option value="household">Household</option>
                <option value="industrial">Industrial</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="field">
              <label>Address</label>
              <input name="address" value={form.address} onChange={onChange} placeholder="Meeting point or project address" />
            </div>
            <div className="field">
              <label>Latitude</label>
              <input name="lat" value={form.lat} onChange={onChange} placeholder="e.g. 19.0760" />
            </div>
            <div className="field">
              <label>Longitude</label>
              <input name="lng" value={form.lng} onChange={onChange} placeholder="e.g. 72.8777" />
            </div>
            <div className="field">
              <label>Target Date</label>
              <input name="targetDate" value={form.targetDate} onChange={onChange} type="date" />
            </div>
          </div>

          <div className="field">
            <label>Photos</label>
            <input className="file-input" type="file" accept="image/*" multiple onChange={(e) => setPhotos([...e.target.files])} />
            {photos.length > 0 && (
              <div className="previews">
                {photos.map((f, i) => (
                  <div key={i} className="preview-item">
                    <img src={URL.createObjectURL(f)} alt={`preview-${i}`} />
                    <div className="preview-name" title={f.name}>{f.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="actions">
            <button className="btn primary" type="submit">Create Project</button>
          </div>
        </form>
      </div>
    </div>
  );
}


