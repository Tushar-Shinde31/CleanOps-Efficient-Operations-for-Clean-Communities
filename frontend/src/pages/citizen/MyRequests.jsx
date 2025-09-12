import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import './MyRequests.css';

// ============================
// MyRequests Component
// ============================
// This page shows all requests raised by the logged-in citizen.
// - Fetches requests from backend (`/requests`).
// - Displays them in a table with ticket, ward, waste type, and status.
// - If no requests → shows an empty state with a "Create Request" button.
// - Allows navigation to "Raise Request" or individual request details.
// ============================

export default function MyRequests() {
  // Store fetched requests
  const [items, setItems] = useState([]);

  // Track loading state while fetching data
  const [loading, setLoading] = useState(true);

  // ----------------------------
  // Fetch requests on mount
  // ----------------------------
  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get('/requests');
        setItems(data.data || []); // backend returns { data: [...] }
      } catch (e) {
        // error ignored (noop), could add toast later
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // ----------------------------
  // Show loading spinner
  // ----------------------------
  if (loading) return <div className="loading">Loading...</div>;

  // ----------------------------
  // Render UI
  // ----------------------------
  return (
    <div className="my-requests">
      {/* Header */}
      <div className="header">
        <h2>My Requests</h2>
        <Link className="btn primary" to="/raise-request">Raise Request</Link>
      </div>

      {/* If no requests → show empty state */}
      {items.length === 0 ? (
        <div className="empty-state card">
          <h4>No requests yet</h4>
          <p>Create your first desludging request to get started.</p>
          <Link className="btn" to="/raise-request">Create Request</Link>
        </div>
      ) : (
        // Otherwise show table of requests
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
                <td>
                  <span
                    className={`badge ${String(r.status)
                      .toLowerCase()
                      .replace(/\s/g, '-')}`}
                  >
                    {r.status}
                  </span>
                </td>
                <td>
                  {/* Link to request details page */}
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
