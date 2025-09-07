import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';

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

  if (!reqItem) return <div>Loading...</div>;

  return (
    <div>
      <h2>Request {reqItem.ticketId}</h2>
      <p>Status: {reqItem.status}</p>
      <p>Ward: {reqItem.ward}</p>
      <p>Waste Type: {reqItem.wasteType}</p>
      <h4>Notes</h4>
      <ul>
        {(reqItem.notes || []).map((n, idx) => (
          <li key={idx}>{n.text} - {new Date(n.createdAt).toLocaleString()}</li>
        ))}
      </ul>

      {reqItem.status === 'Completed' && (
        <div style={{ marginTop: 16 }}>
          <h4>Give Feedback</h4>
          {msg && <div style={{ color: 'green' }}>{msg}</div>}
          <div>
            <label>Rating</label>
            <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
              {[1,2,3,4,5].map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          <div>
            <label>Comment</label>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
          </div>
          <button onClick={giveFeedback}>Submit</button>
        </div>
      )}
    </div>
  );
}


