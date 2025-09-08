import { useEffect, useState } from 'react';
import api from '../../services/api';
import './AdminDashboard.css';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    (async () => {
      const { data } = await api.get('/admin/dashboard');
      setData(data);
    })();
  }, []);

  if (!data) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <div className="grid-4">
        <div className="card stat">
          <span className="label">Today's Requests</span>
          <span className="value">{data.todayRequests}</span>
        </div>
        <div className="card stat warning">
          <span className="label">Pending</span>
          <span className="value">{data.pendingRequests}</span>
        </div>
        <div className="card stat success">
          <span className="label">Completed Today</span>
          <span className="value">{data.completedToday}</span>
        </div>
        <div className="card stat danger">
          <span className="label">SLA Breaches</span>
          <span className="value">{data.slaBreaches}</span>
        </div>
      </div>
    </div>
  );
}


