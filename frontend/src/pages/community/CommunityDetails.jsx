import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './CommunityDetails.css';

export default function CommunityDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const [project, setProject] = useState(null);
  const [note, setNote] = useState('');
  const [msg, setMsg] = useState('');

  const load = async () => {
    const { data } = await api.get(`/community/${id}`);
    setProject(data);
  };

  useEffect(() => { load(); }, [id]);

  const join = async () => { await api.post(`/community/${id}/join`); await load(); };
  const leave = async () => { await api.post(`/community/${id}/leave`); await load(); };
  const addNote = async () => {
    const fd = new FormData();
    fd.append('text', note);
    await api.post(`/community/${id}/notes`, fd);
    setNote('');
    setMsg('Note added');
    await load();
  };

  if (!project) return <div className="loading">Loading...</div>;

  const isParticipant = user && project.participants.some(p => p._id === user.id || p._id === user._id);

  return (
    <div className="community-details">
      <h2>{project.title}</h2>
      <div className="meta">
        <span className="chip">Status: {project.status}</span>
        <span className="chip">Ward: {project.ward}</span>
      </div>
      <p className="description">{project.description}</p>
      {user && !isParticipant && <button className="btn primary" onClick={join}>Join</button>}
      {user && isParticipant && user.role !== 'organizer' && <button className="btn" onClick={leave}>Leave</button>}
      <h4>Notes</h4>
      <ul className="list">
        {(project.notes || []).map((n, idx) => (
          <li key={idx}>{n.text}</li>
        ))}
      </ul>
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


