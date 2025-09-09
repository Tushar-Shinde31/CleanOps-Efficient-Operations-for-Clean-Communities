import { useEffect, useState } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, CartesianGrid } from 'recharts';
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
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={data.requestsPerWard.map(r => ({ ward: r._id || 'Unknown', count: r.count }))} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="ward" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Requests" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="panel">
        <h4>Requests per Status</h4>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={data.requestsPerStatus.map(r => ({ status: r._id, count: r.count }))} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="status" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Requests" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="panel">
        <h4>Requests per Waste Type</h4>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <PieChart>
              <Tooltip />
              <Legend />
              <Pie data={data.requestsPerWasteType.map(r => ({ name: r._id, value: r.count }))} dataKey="value" nameKey="name" outerRadius={110} label>
                {data.requestsPerWasteType.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={["#6366f1","#f59e0b","#ef4444","#10b981","#06b6d4","#a855f7"][index % 6]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
      </section>

      <section className="panel">
        <h4>Top Operators</h4>
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer>
            <BarChart data={data.activeOperators.map(r => ({ name: `${r.name}`, count: r.count }))} margin={{ top: 10, right: 20, left: 0, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" interval={0} angle={-20} textAnchor="end" height={60} />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="count" name="Handled Requests" fill="#f97316" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </section>
      <section className="grid-3">
        <div className="card stat"><span className="label">Avg Completion (hrs)</span><span className="value">{data.avgCompletionTime.toFixed ? data.avgCompletionTime.toFixed(2) : data.avgCompletionTime}</span></div>
        <div className="card stat danger"><span className="label">SLA Breaches</span><span className="value">{data.slaBreachCount}</span></div>
        <div className="card stat"><span className="label">Total Requests</span><span className="value">{data.totalRequests}</span></div>
      </section>
    </div>
  );
}


