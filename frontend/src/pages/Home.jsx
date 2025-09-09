import './Home.css';
import { FiPlusCircle, FiList, FiBarChart2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'wardAdmin' || user?.role === 'superAdmin';
  const isCitizen = user?.role === 'citizen';
  return (
    <div className="home-page">
      <div className="hero simple">
        <h1>Waste Management & Desludging</h1>
        <p>Report and track desludging services with ease. Make your ward cleaner.</p>
      </div>

      {user && (
        <div className="welcome-card">
          <div className="welcome-title">Welcome back, {user.name}! ({user.role})</div>
          <div className="welcome-sub">You're signed in and ready to go.</div>
        </div>
      )}

      <section className="quick-actions">
        {(isCitizen || !user) && (
          <>
            <div className="qa-card">
              <div className="qa-icon primary"><FiPlusCircle /></div>
              <h3>Raise Request</h3>
              <p>Submit a desludging request in under a minute.</p>
              <a className="btn primary" href="/raise-request">Submit Now</a>
            </div>
            <div className="qa-card">
              <div className="qa-icon"><FiList /></div>
              <h3>My Requests</h3>
              <p>Track the status of your submitted requests.</p>
              <a className="btn" href="/my-requests">View Requests</a>
            </div>
          </>
        )}
        {isAdmin && (
          <div className="qa-card">
            <div className="qa-icon"><FiBarChart2 /></div>
            <h3>Admin Dashboard</h3>
            <p>Manage assignments and view ward analytics.</p>
            <a className="btn ghost" href="/admin/dashboard">Open Dashboard</a>
          </div>
        )}
        {isAdmin && (
          <div className="qa-card">
            <div className="qa-icon"><FiBarChart2 /></div>
            <h3>Admin Analytics</h3>
            <p>Manage assignments and view ward analytics.</p>
            <a className="btn ghost" href="/admin/analytics">Open Analytics</a>
          </div>
        )}
      </section>
    </div>
  );
}


