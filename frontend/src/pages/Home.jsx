import './Home.css';

export default function Home() {
  return (
    <div className="home-page">
      <div className="hero">
        <h2>Welcome to Waste Management & Desludging</h2>
        <p>Track, request, and manage desludging services with a simple interface.</p>
        <div className="hero-actions">
          <a className="btn primary" href="/citizen/raise">Raise Request</a>
          <a className="btn" href="/citizen/requests">My Requests</a>
        </div>
      </div>
      <section className="features">
        <div className="feature">
          <h4>Fast Requests</h4>
          <p>Submit desludging requests in minutes and get real-time updates.</p>
        </div>
        <div className="feature">
          <h4>Community Projects</h4>
          <p>Join local initiatives and make your neighborhood cleaner.</p>
        </div>
        <div className="feature">
          <h4>Operator Tracking</h4>
          <p>Operators manage assignments and status in one place.</p>
        </div>
      </section>
      <section className="stats-band">
        <div className="stat-item">
          <div className="value">24k+</div>
          <div className="label">Requests Processed</div>
        </div>
        <div className="stat-item">
          <div className="value">98%</div>
          <div className="label">On-time Completion</div>
        </div>
        <div className="stat-item">
          <div className="value">1.2k</div>
          <div className="label">Community Members</div>
        </div>
      </section>
    </div>
  );
}


