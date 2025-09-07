import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="nav">
      <div className="brand">Waste Management</div>
      <div className="links">
        <Link to="/">Home</Link>
        <Link to="/community">Community</Link>
        {user?.role === 'citizen' && (
          <>
            <Link to="/raise-request">Raise Request</Link>
            <Link to="/my-requests">My Requests</Link>
          </>
        )}
        {user?.role === 'operator' && <Link to="/operator/assigned">Assigned</Link>}
        {(user?.role === 'wardAdmin' || user?.role === 'superAdmin') && (
          <>
            <Link to="/admin/requests">Admin Requests</Link>
            <Link to="/admin/dashboard">Dashboard</Link>
            <Link to="/admin/analytics">Analytics</Link>
            <Link to="/admin/operators">Operators</Link>
          </>
        )}
      </div>
      <div className="auth">
        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          <>
            <span className="user">{user.name} ({user.role})</span>
            <button className="btn" onClick={logout}>Logout</button>
          </>
        )}
      </div>
    </nav>
  );
}
