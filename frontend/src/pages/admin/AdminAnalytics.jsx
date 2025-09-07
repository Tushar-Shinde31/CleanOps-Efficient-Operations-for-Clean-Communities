import { useEffect, useState } from 'react';
import api from '../../services/api';

export default function AdminAnalytics() {
  const [data, setData] = useState(null);

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/admin/analytics');
      setData(data);
    })();
  }, []);

  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <h2>Analytics</h2>
      <section>
        <h4>Requests per Ward</h4>
        <ul>
          {data.requestsPerWard.map((x) => (
            <li key={x._id}>{x._id || 'Unknown'}: {x.count}</li>
          ))}
        </ul>
      </section>
      <section>
        <h4>Requests per Status</h4>
        <ul>
          {data.requestsPerStatus.map((x) => (
            <li key={x._id}>{x._id}: {x.count}</li>
          ))}
        </ul>
      </section>
      <section>
        <h4>Requests per Waste Type</h4>
        <ul>
          {data.requestsPerWasteType.map((x) => (
            <li key={x._id}>{x._id}: {x.count}</li>
          ))}
        </ul>
      </section>
      <section>
        <h4>Top Operators</h4>
        <ul>
          {data.activeOperators.map((x, idx) => (
            <li key={idx}>{x.name} ({x.email}): {x.count}</li>
          ))}
        </ul>
      </section>
      <section className="grid-3">
        <div className="card">Avg Completion (hrs): <strong>{data.avgCompletionTime.toFixed ? data.avgCompletionTime.toFixed(2) : data.avgCompletionTime}</strong></div>
        <div className="card">SLA Breaches: <strong>{data.slaBreachCount}</strong></div>
        <div className="card">Total Requests: <strong>{data.totalRequests}</strong></div>
      </section>
    </div>
  );
}


