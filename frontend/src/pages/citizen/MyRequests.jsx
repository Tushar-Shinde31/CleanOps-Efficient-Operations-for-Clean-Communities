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
      <h2>My Requests</h2>
      <table className="table striped hover">
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
              <td>{r.status}</td>
              <td>
                <Link to={`/requests/${r._id}`}>View</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}


