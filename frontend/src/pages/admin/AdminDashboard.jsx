import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminDashboard() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    (async () => {
      const { data } = await api.get('/admin/dashboard');
      setData(data);
    })();
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <div className="grid-4">
        <div className="card">Today's Requests: <strong>{data.todayRequests}</strong></div>
        <div className="card">Pending: <strong>{data.pendingRequests}</strong></div>
        <div className="card">Completed Today: <strong>{data.completedToday}</strong></div>
        <div className="card">SLA Breaches: <strong>{data.slaBreaches}</strong></div>
      </div>
    </div>
  );
}


