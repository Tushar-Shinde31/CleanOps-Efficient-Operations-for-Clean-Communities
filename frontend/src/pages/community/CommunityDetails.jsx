import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

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

  if (!project) return <div>Loading...</div>;

  const isParticipant = user && project.participants.some(p => p._id === user.id || p._id === user._id);

  return (
    <div>
      <h2>{project.title}</h2>
      <p>Status: {project.status}</p>
      <p>Ward: {project.ward}</p>
      <p>{project.description}</p>
      {user && !isParticipant && <button onClick={join}>Join</button>}
      {user && isParticipant && user.role !== 'organizer' && <button onClick={leave}>Leave</button>}
      <h4>Notes</h4>
      <ul>
        {(project.notes || []).map((n, idx) => (
          <li key={idx}>{n.text}</li>
        ))}
      </ul>
      {isParticipant && (
        <div style={{ marginTop: 12 }}>
          {msg && <div style={{ color: 'green' }}>{msg}</div>}
          <textarea value={note} onChange={(e) => setNote(e.target.value)} />
          <button onClick={addNote}>Add Note</button>
        </div>
      )}
    </div>
  );
}


