import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import './RequestDetails.css';

export default function RequestDetails() {
  const { id } = useParams();
  const [reqItem, setReqItem] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [msg, setMsg] = useState('');

  useEffect(() => {
    (async () => {
      const { data } = await api.get(`/requests/${id}`);
      setReqItem(data);
    })();
  }, [id]);

  const giveFeedback = async () => {
    try {
      await api.post(`/requests/${id}/feedback`, { rating, comment });
      setMsg('Feedback submitted');
    } catch (e) {
      setMsg(e?.response?.data?.message || 'Failed');
    }
  };

  if (!reqItem) return <div className="loading">Loading...</div>;

  return (
    <div className="request-details">
      <h2>Request {reqItem.ticketId}</h2>
      <div className="meta">
        <span className="chip">Status: {reqItem.status}</span>
        <span className="chip">Ward: {reqItem.ward}</span>
        <span className="chip">Waste Type: {reqItem.wasteType}</span>
      </div>
      <h4>Notes</h4>
      <ul className="list">
        {(reqItem.notes || []).map((n, idx) => (
          <li key={idx}><span className="note-text">{n.text}</span> <span className="note-date">{new Date(n.createdAt).toLocaleString()}</span></li>
        ))}
      </ul>

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
          <button className="btn" onClick={giveFeedback}>Submit</button>
        </div>
      )}
    </div>
  );
}


