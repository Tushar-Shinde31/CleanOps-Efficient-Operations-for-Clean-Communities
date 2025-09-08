import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import './RequestDetails.css';

export default function RequestDetails() {
  const { id } = useParams();
  const [reqItem, setReqItem] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await api.get(`/requests/${id}`);
      setReqItem(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [id]);

  const giveFeedback = async () => {
    try {
      await api.post(`/requests/${id}/feedback`, { rating, comment });
      setMsg('Feedback submitted');
    } catch (e) {
      setMsg(e?.response?.data?.message || 'Failed');
    }
  };

  const statusClass = useMemo(() => String(reqItem?.status || '').toLowerCase().replace(/\s/g,'-'), [reqItem]);

  if (!reqItem) return <div className="loading">Loading...</div>;

  return (
    <div className="request-details">
      <div className="header">
        <h2>Ticket {reqItem.ticketId}</h2>
        <div className="chips">
          <span className={`chip ${statusClass}`}>{reqItem.status}</span>
          <span className="chip">Ward {reqItem.ward || '—'}</span>
          <span className="chip">{reqItem.wasteType}</span>
        </div>
        <div className="muted">Raised on {new Date(reqItem.createdAt).toLocaleString()} {reqItem.updatedAt ? ` · Last update ${new Date(reqItem.updatedAt).toLocaleString()}` : ''}</div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="section-title">Details</div>
          <div className="row"><span className="label">Citizen</span><span>{reqItem.fullName || reqItem.citizen?.name || '—'}</span></div>
          <div className="row"><span className="label">Mobile</span><span>{reqItem.mobileNumber || reqItem.citizen?.phone || '—'}</span></div>
          <div className="row"><span className="label">Address</span><span>{reqItem.location?.address || '—'}</span></div>
          <div className="row"><span className="label">Coordinates</span><span>{Array.isArray(reqItem.location?.coordinates) ? reqItem.location.coordinates.join(', ') : '—'}</span></div>
          <div className="row"><span className="label">Preferred Slot</span><span>{reqItem.preferredTimeSlot || '—'}</span></div>
        </div>

        <div className="card">
          <div className="section-title">Assigned Operator</div>
          {reqItem.assignedOperator ? (
            <>
              <div className="row"><span className="label">Name</span><span>{reqItem.assignedOperator.name || '—'}</span></div>
              <div className="row"><span className="label">Email</span><span>{reqItem.assignedOperator.email || '—'}</span></div>
              <div className="row"><span className="label">Phone</span><span>{reqItem.assignedOperator.phone || '—'}</span></div>
            </>
          ) : (
            <div className="muted">Not assigned yet</div>
          )}
        </div>
      </div>

      <div className="card">
        <div className="section-title">Description</div>
        <div className="description">{reqItem.description || '—'}</div>
      </div>

      {Array.isArray(reqItem.photos) && reqItem.photos.length > 0 && (
        <div className="card">
          <div className="section-title">Photos</div>
          <div className="photos">
            {reqItem.photos.map((p, i) => (
              <a key={i} href={p.url} target="_blank" rel="noreferrer">
                <img src={p.url} alt={`photo-${i}`} />
              </a>
            ))}
          </div>
        </div>
      )}

      <div className="card">
        <div className="section-title">Updates</div>
        <ul className="list">
          {(reqItem.notes || []).length === 0 && <li className="muted">No updates yet</li>}
          {(reqItem.notes || []).map((n, idx) => (
            <li key={idx}><span className="note-text">{n.text}</span> <span className="note-date">{new Date(n.createdAt).toLocaleString()}</span></li>
          ))}
        </ul>
      </div>

      {reqItem.status === 'Completed' && (
        <div className="feedback">
          <h4>Give Feedback</h4>
          {msg && <div className="alert success">{msg}</div>}
          <div>
            <label>Rating</label>
            <div className="rating" role="radiogroup" aria-label="Rating">
              {[1,2,3,4,5].map((r) => (
                <span key={r} className={`star ${r <= rating ? 'active' : ''}`} onClick={() => setRating(r)} role="radio" aria-checked={r === rating} tabIndex={0} onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && setRating(r)} />
              ))}
            </div>
          </div>
          <div>
            <label>Comment</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
          </div>
          <button className="btn" onClick={giveFeedback} disabled={loading}>{loading ? 'Submitting…' : 'Submit'}</button>
        </div>
      )}
    </div>
  );
}


