import './Footer.css';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="brand">
          <div className="logo-circle">WM</div>
          <div>
            <div className="brand-name">Waste Management</div>
            <div className="brand-sub">Desludging Request System</div>
          </div>
        </div>
        <nav className="links">
          <a href="/raise-request">Raise Request</a>
          <a href="/my-requests">My Requests</a>
          <a href="/admin/requests">Admin</a>
          <a href="/admin/analytics">Analytics</a>
        </nav>
        <div className="meta">
          <span>© {new Date().getFullYear()} City Services</span>
          <span className="dot">•</span>
          <a href="#">Privacy</a>
          <span className="dot">•</span>
          <a href="#">Terms</a>
        </div>
      </div>
    </footer>
  );
}


