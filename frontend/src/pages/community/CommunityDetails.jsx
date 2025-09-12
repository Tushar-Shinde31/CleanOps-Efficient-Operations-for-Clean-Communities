
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './CommunityDetails.css';

// Main component for displaying community details
export default function CommunityDetails() {
  const { id } = useParams(); // Get community ID from URL
  const { user } = useAuth(); // Get current user from context
  const [project, setProject] = useState(null); // Store project details
  const [note, setNote] = useState(''); // Store new note text
  const [msg, setMsg] = useState(''); // Store message after adding note

  // Fetch project details from API
  const load = async () => {
    const { data } = await api.get(`/community/${id}`);
    setProject(data);
  };

  // Load project data when component mounts or ID changes
  useEffect(() => { load(); }, [id]);

  // Join community API call
  const join = async () => { await api.post(`/community/${id}/join`); await load(); };
  // Leave community API call
  const leave = async () => { await api.post(`/community/${id}/leave`); await load(); };
  // Add note API call
  const addNote = async () => {
    const fd = new FormData();
    fd.append('text', note);
    await api.post(`/community/${id}/notes`, fd);
    setNote('');
    setMsg('Note added');
    await load();
  };

  // Show loading indicator if project data is not loaded
  if (!project) return <div className="loading">Loading...</div>;

  // Check if current user is a participant in the community
  const isParticipant = user && project.participants.some(p => p._id === user.id || p._id === user._id);

  return (
    <div className="community-details">
      {/* Project title */}
      <h2>{project.title}</h2>
      {/* Project meta info */}
      <div className="meta">
        <span className="chip">Status: {project.status}</span>
        <span className="chip">Ward: {project.ward}</span>
      </div>
      {/* Project description */}
      <p className="description">{project.description}</p>
      {/* Join/Leave buttons based on user and participant status */}
      {user && !isParticipant && <button className="btn primary" onClick={join}>Join</button>}
      {user && isParticipant && user.role !== 'organizer' && <button className="btn" onClick={leave}>Leave</button>}
      {/* Notes section */}
      <h4>Notes</h4>
      <ul className="list">
        {(project.notes || []).map((n, idx) => (
          <li key={idx}>{n.text}</li>
        ))}
      </ul>
      {/* Add note box for participants */}
      {isParticipant && (
        <div className="note-box">
          {msg && <div className="alert success">{msg}</div>}
          <textarea value={note} onChange={(e) => setNote(e.target.value)} />
          <button className="btn" onClick={addNote}>Add Note</button>
        </div>
      )}
    </div>
  );
}


