import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// ============================
// ProtectedRoute Component
// ============================
// This component is a wrapper for protecting routes.
// - If the user is not logged in → redirect to /login
// - If the user does not have the required role → redirect to /
// - Otherwise → render the requested page (children)
export default function ProtectedRoute({ children, roles }) {
  // Get current user and loading state from AuthContext
  const { user, loading } = useAuth();

  // While authentication state is being checked → show loading screen
  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;

  // If no user is logged in → redirect to login page
  if (!user) return <Navigate to="/login" replace />;

  // If specific roles are required and the user's role is not included → redirect to home
  if (roles && !roles.includes(user.role)) return <Navigate to="/" replace />;

  // If everything is valid → render the protected child component
  return children;
}
