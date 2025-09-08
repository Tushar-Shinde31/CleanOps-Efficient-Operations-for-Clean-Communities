import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './MyRequests.css';

export default function MyRequests() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/requests');
        setItems(data.data || []);
      } catch (e) {
        // noop simple
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="my-requests">
      <div className="header">
        <h2>My Requests</h2>
        <Link className="btn primary" to="/raise-request">Raise Request</Link>
      </div>
      {items.length === 0 ? (
        <div className="empty-state card">
          <h4>No requests yet</h4>
          <p>Create your first desludging request to get started.</p>
          <Link className="btn" to="/raise-request">Create Request</Link>
        </div>
      ) : (
      <table className="table striped hover requests-table">
        <thead>
          <tr>
            <th>Ticket</th>
            <th>Ward</th>
            <th>Waste</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {items.map(r => (
            <tr key={r._id}>
              <td>{r.ticketId}</td>
              <td>{r.ward}</td>
              <td>{r.wasteType}</td>
              <td><span className={`badge ${String(r.status).toLowerCase().replace(/\s/g,'-')}`}>{r.status}</span></td>
              <td>
                <Link to={`/requests/${r._id}`}>View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      )}
    </div>
  );
}


