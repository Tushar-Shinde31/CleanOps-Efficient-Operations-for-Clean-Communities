import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function OperatorAssigned() {
  const [items, setItems] = useState([]);
  const [status, setStatus] = useState('');

  const load = async () => {
    const { data } = await api.get(`/requests/my/assigned`, { params: { status } });
    setItems(data.data || []);
  };

  useEffect(() => { load(); }, [status]);

  const updateStatus = async (id, newStatus) => {
    await api.put(`/requests/${id}/status`, { status: newStatus });
    await load();
  };

  return (
    <div>
      <h2>Assigned Requests</h2>
      <div>
        <label>Filter Status</label>
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="">All</option>
          {['Assigned','On the Way','In Progress','Completed','Rejected'].map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Ward</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(r => (
            <tr key={r._id}>
              <td>{r.ticketId}</td>
              <td>{r.ward}</td>
              <td>{r.status}</td>
              <td>
                {['On the Way','In Progress','Completed','Rejected'].map(s => (
                  <button key={s} onClick={() => updateStatus(r._id, s)} style={{ marginRight: 6 }}>{s}</button>
                ))}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


