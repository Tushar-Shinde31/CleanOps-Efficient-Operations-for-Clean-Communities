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
    </div>
  );
}


