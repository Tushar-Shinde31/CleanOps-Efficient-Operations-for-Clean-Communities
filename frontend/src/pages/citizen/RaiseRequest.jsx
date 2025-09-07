import { useState } from 'react';
import api from '../../services/api';

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
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <h2>Raise Desludging Request</h2>
      {msg && <div style={{ color: 'green', marginBottom: 10 }}>{msg}</div>}
      {error && <div style={{ color: 'red', marginBottom: 10 }}>{error}</div>}
      <form className="form" onSubmit={onSubmit}>
        <div className="grid-2">
          <div>
            <label>Full Name</label>
            <input name="fullName" value={form.fullName} onChange={onChange} required />
          </div>
          <div>
            <label>Mobile Number</label>
            <input name="mobileNumber" value={form.mobileNumber} onChange={onChange} required />
          </div>
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
            <label>Preferred Time Slot</label>
            <input name="preferredTimeSlot" value={form.preferredTimeSlot} onChange={onChange} />
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
        </div>
        <label>Description</label>
        <textarea name="description" value={form.description} onChange={onChange} />
        <label>Photos</label>
        <input type="file" multiple onChange={(e) => setPhotos([...e.target.files])} />
        <button disabled={loading} type="submit">{loading ? 'Submitting...' : 'Submit'}</button>
      </form>
    </div>
  );
}


