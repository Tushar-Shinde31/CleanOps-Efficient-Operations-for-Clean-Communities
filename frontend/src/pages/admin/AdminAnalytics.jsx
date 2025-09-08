import { useEffect, useState } from 'react';
import api from '../../services/api';
import './AdminAnalytics.css';

export default function AdminAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/admin/analytics');
      setData(data);
    })();
  }, []);

  if (!data) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-analytics">
      <h2>Analytics</h2>
      <section className="panel">
        <h4>Requests per Ward</h4>
        <ul className="list">
          {data.requestsPerWard.map((x) => (
            <li key={x._id}>{x._id || 'Unknown'}: {x.count}</li>
          ))}
        </ul>
      </section>
      <section className="panel">
        <h4>Requests per Status</h4>
        <ul className="list">
          {data.requestsPerStatus.map((x) => (
            <li key={x._id}>{x._id}: {x.count}</li>
          ))}
        </ul>
      </section>
      <section className="panel">
        <h4>Requests per Waste Type</h4>
        <ul className="list">
          {data.requestsPerWasteType.map((x) => (
            <li key={x._id}>{x._id}: {x.count}</li>
          ))}
        </ul>
      </section>
      <section className="panel">
        <h4>Top Operators</h4>
        <ul className="list">
          {data.activeOperators.map((x, idx) => (
            <li key={idx}>{x.name} ({x.email}): {x.count}</li>
          ))}
        </ul>
      </section>
      <section className="grid-3">
        <div className="card stat"><span className="label">Avg Completion (hrs)</span><span className="value">{data.avgCompletionTime.toFixed ? data.avgCompletionTime.toFixed(2) : data.avgCompletionTime}</span></div>
        <div className="card stat danger"><span className="label">SLA Breaches</span><span className="value">{data.slaBreachCount}</span></div>
        <div className="card stat"><span className="label">Total Requests</span><span className="value">{data.totalRequests}</span></div>
      </section>
    </div>
  );
}


