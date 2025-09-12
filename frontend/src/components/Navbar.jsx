import { Link, NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar() {
  // Get current logged-in user info and logout function from AuthContext
  const { user, logout } = useAuth();

  return (
    <nav className="nav">
      {/* ======================
          Brand / Logo
         ====================== */}
      <div className="brand">CleanOps 🚛♻️</div>

      {/* ======================
          Navigation Links
         ====================== */}
      <div className="links">
        {/* Common links for all users */}
        <NavLink
          to="/"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Home
        </NavLink>
        <NavLink
          to="/community"
          className={({ isActive }) => (isActive ? 'active' : '')}
        >
          Community
        </NavLink>

        {/* Links only visible to Citizens */}
        {user?.role === 'citizen' && (
          <>
            <NavLink
              to="/raise-request"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Raise Request
            </NavLink>
            <NavLink
              to="/my-requests"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              My Requests
            </NavLink>
          </>
        )}

        {/* Link only visible to Operators */}
        {user?.role === 'operator' && (
          <NavLink
            to="/operator/assigned"
            className={({ isActive }) => (isActive ? 'active' : '')}
          >
            Assigned
          </NavLink>
        )}

        {/* Links only visible to Ward Admins or Super Admins */}
        {(user?.role === 'wardAdmin' || user?.role === 'superAdmin') && (
          <>
            {/* Admin Requests link (currently commented out) */}
            {/* <NavLink to="/admin/requests" className={({ isActive }) => isActive ? 'active' : ''}>Admin Requests</NavLink> */}

            <NavLink
              to="/admin/dashboard"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Dashboard
            </NavLink>
            <NavLink
              to="/admin/analytics"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Analytics
            </NavLink>
            <NavLink
              to="/admin/operators"
              className={({ isActive }) => (isActive ? 'active' : '')}
            >
              Operators
            </NavLink>
          </>
        )}
      </div>

      {/* ======================
          Auth Section (Right Side)
         ====================== */}
      <div className="auth">
        {/* If no user is logged in → Show Login/Register */}
        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        ) : (
          /* If user is logged in → Show name, role, and Logout button */
          <>
            <span className="user">
              {user.name} ({user.role})
            </span>
            <button className="btn" onClick={logout}>
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
}
