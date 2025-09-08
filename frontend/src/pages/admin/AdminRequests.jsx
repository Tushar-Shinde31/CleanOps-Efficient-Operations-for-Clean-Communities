import { useEffect, useState } from 'react';
import api from '../../services/api';
import './AdminRequests.css';

export default function AdminRequests() {
  const [items, setItems] = useState([]);
  const [filters, setFilters] = useState({ ward:'', status:'', wasteType:'' });
  const [operators, setOperators] = useState([]);

  const load = async () => {
    const { data } = await api.get('/requests', { params: { ...filters } });
    setItems(data.data || []);
  };

  useEffect(() => { load(); }, [filters]);
  useEffect(() => { (async () => { const { data } = await api.get('/admin/operators'); setOperators(data); })(); }, []);

  const assign = async (id, operatorId) => {
    await api.put(`/requests/${id}/assign`, { operatorId });
    await load();
  };

  return (
    <div className="admin-requests">
      <h2>Admin - Incoming Requests</h2>
      <div className="filters grid-3">
        <div className="field">
          <label>Ward</label>
          <input value={filters.ward} onChange={(e) => setFilters({ ...filters, ward: e.target.value })} />
        </div>
        <div className="field">
          <label>Status</label>
          <select value={filters.status} onChange={(e) => setFilters({ ...filters, status: e.target.value })}>
            <option value="">All</option>
            {['Open','Assigned','On the Way','In Progress','Completed','Rejected'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div className="field">
          <label>Waste Type</label>
          <select value={filters.wasteType} onChange={(e) => setFilters({ ...filters, wasteType: e.target.value })}>
            <option value="">All</option>
            {['sewage','household','industrial','other'].map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <table className="table striped hover">
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Ward</th>
            <th>Waste</th>
            <th>Status</th>
            <th>Assign</th>
          </tr>
        </thead>
        <tbody>
          {items.map(r => (
            <tr key={r._id}>
              <td>{r.ticketId}</td>
              <td>{r.ward}</td>
              <td>{r.wasteType}</td>
              <td>{r.status}</td>
              <td>
                <select onChange={(e) => assign(r._id, e.target.value)} defaultValue="">
                  <option value="" disabled>Choose operator</option>
                  {operators.map(o => <option key={o._id} value={o._id}>{o.name}</option>)}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


