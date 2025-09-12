import React from 'react';
import './Home.css';
import { FiPlusCircle, FiList, FiBarChart2 } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

// ============================
// Home Page Component
// ============================
// This is the main landing page for the Waste Management & Desludging system.
// It shows different sections based on whether the logged-in user is a citizen or an admin.
export default function Home() {
  // Get the current logged-in user from AuthContext
  const { user } = useAuth();

  // Check if the logged-in user is an Admin (wardAdmin or superAdmin)
  const isAdmin = user?.role === 'wardAdmin' || user?.role === 'superAdmin';

  // Check if the logged-in user is a Citizen
  const isCitizen = user?.role === 'citizen';
  
  return (
    <div className="home-page">
      
      {/* ======================
          Hero Section (Header)
         ====================== */}
      <div className="hero simple">
        <h1>Waste Management & Desludging</h1>
        <p>Report and track desludging services with ease. Make your ward cleaner.</p>
      </div>

      {/* ======================
          Welcome Message (only for logged-in users)
         ====================== */}
      {user && (
        <div className="welcome-card">
          <div className="welcome-title">Welcome back, {user.name}! ({user.role})</div>
          <div className="welcome-sub">You're signed in and ready to go.</div>
        </div>
      )}

      {/* ======================
          Quick Actions Section
         ====================== */}
      <section className="quick-actions">
        
        {/* Citizen (or guest) quick actions */}
        {(isCitizen || !user) && (
          <>
            {/* Raise Request card */}
            <div className="qa-card">
              <div className="qa-icon primary"><FiPlusCircle /></div>
              <h3>Raise Request</h3>
              <p>Submit a desludging request in under a minute.</p>
              <a className="btn primary" href="/raise-request">Submit Now</a>
            </div>

            {/* My Requests card */}
            <div className="qa-card">
              <div className="qa-icon"><FiList /></div>
              <h3>My Requests</h3>
              <p>Track the status of your submitted requests.</p>
              <a className="btn" href="/my-requests">View Requests</a>
            </div>
          </>
        )}

        {/* Admin quick actions */}
        {isAdmin && (
          <div className="qa-card">
            <div className="qa-icon"><FiBarChart2 /></div>
            <h3>Admin Dashboard</h3>
            <p>Manage assignments and view ward analytics.</p>
            <a className="btn ghost" href="/admin/dashboard">Open Dashboard</a>
          </div>
        )}

        {/* Admin analytics */}
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
