import { useState } from 'react';
import api from '../../services/api';
import './RaiseRequest.css';

export default function RaiseRequest() {
  const [form, setForm] = useState({
    fullName: '',
    mobileNumber: '',
    ward: '',
    address: '',
    lat: '',
    lng: '',
    wasteType: 'household',
    preferredTimeSlot: '',
    description: ''
  });
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const descriptionMax = 600;

  const onChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg('');
    setError('');
    setLoading(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k,v]) => fd.append(k, v));
      for (const f of photos) fd.append('photos', f);
      const { data } = await api.post('/requests', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setMsg(`Request created. Ticket: ${data.request.ticketId}`);
      setForm({ fullName:'', mobileNumber:'', ward:'', address:'', lat:'', lng:'', wasteType:'household', preferredTimeSlot:'', description:'' });
      setPhotos([]);
    } catch (err) {
      setError(err?.response?.data?.message || 'Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="raise-request">
      <div className="header">
        <h2>Raise Desludging Request</h2>
        <p className="muted">Fill in the details below. Accurate address and a short description helps us serve you faster.</p>
      </div>
      {msg && <div className="alert success">{msg}</div>}
      {error && <div className="alert error">{error}</div>}
      <div className="panel">
        <form className="form" onSubmit={onSubmit}>
          <div className="grid-2">
            <div className="field">
              <label>Full Name</label>
              <input name="fullName" placeholder="e.g. Deepak Giri" value={form.fullName} onChange={onChange} required />
            </div>
            <div className="field">
              <label>Mobile Number</label>
              <input name="mobileNumber" placeholder="10-digit number" pattern="[0-9]{10}" maxLength={10} value={form.mobileNumber} onChange={onChange} required />
            </div>
            <div className="field">
              <label>Ward</label>
              <input name="ward" placeholder="e.g. 5" value={form.ward} onChange={onChange} required />
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
              <label>Preferred Time Slot</label>
              <input name="preferredTimeSlot" placeholder="e.g. 9:00 AM - 12:00 PM" value={form.preferredTimeSlot} onChange={onChange} />
            </div>
            <div className="field">
              <label>Address</label>
              <input name="address" placeholder="House No, Street, Area" value={form.address} onChange={onChange} />
            </div>
            <div className="field">
              <label>Latitude</label>
              <input name="lat" placeholder="e.g. 19.0760" value={form.lat} onChange={onChange} />
            </div>
            <div className="field">
              <label>Longitude</label>
              <input name="lng" placeholder="e.g. 72.8777" value={form.lng} onChange={onChange} />
            </div>
          </div>

          <div className="field">
            <div className="label-row">
              <label>Description</label>
              <span className="muted">{form.description.length}/{descriptionMax}</span>
            </div>
            <textarea name="description" maxLength={descriptionMax} rows={5} placeholder="Briefly describe the issue..." value={form.description} onChange={onChange} />
            <div className="hint">Avoid personal information. You can attach images below.</div>
          </div>

          <div className="field">
            <label>Photos</label>
            <input className="file-input" type="file" accept="image/*" multiple onChange={(e) => setPhotos([...e.target.files])} />
            {photos.length > 0 && (
              <div className="previews">
                {[...photos].map((f, i) => (
                  <div key={i} className="preview-item">
                    <img src={URL.createObjectURL(f)} alt={`preview-${i}`} />
                    <div className="preview-name" title={f.name}>{f.name}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="actions">
            <button className="btn primary" disabled={loading} type="submit">{loading ? 'Submitting…' : 'Submit Request'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}


