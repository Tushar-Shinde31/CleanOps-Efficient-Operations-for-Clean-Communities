import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="nav">
      <div className="brand">Waste Management</div>
      <div className="links">
        <NavLink to="/" className={({ isActive }) => isActive ? 'active' : ''}>Home</NavLink>
        <NavLink to="/community" className={({ isActive }) => isActive ? 'active' : ''}>Community</NavLink>
        {user?.role === 'citizen' && (
          <>
            <NavLink to="/raise-request" className={({ isActive }) => isActive ? 'active' : ''}>Raise Request</NavLink>
            <NavLink to="/my-requests" className={({ isActive }) => isActive ? 'active' : ''}>My Requests</NavLink>
          </>
        )}
        {user?.role === 'operator' && <NavLink to="/operator/assigned" className={({ isActive }) => isActive ? 'active' : ''}>Assigned</NavLink>}
        {(user?.role === 'wardAdmin' || user?.role === 'superAdmin') && (
          <>
            {/* <NavLink to="/admin/requests" className={({ isActive }) => isActive ? 'active' : ''}>Admin Requests</NavLink> */}
            <NavLink to="/admin/dashboard" className={({ isActive }) => isActive ? 'active' : ''}>Dashboard</NavLink>
            <NavLink to="/admin/analytics" className={({ isActive }) => isActive ? 'active' : ''}>Analytics</NavLink>
            <NavLink to="/admin/operators" className={({ isActive }) => isActive ? 'active' : ''}>Operators</NavLink>
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
