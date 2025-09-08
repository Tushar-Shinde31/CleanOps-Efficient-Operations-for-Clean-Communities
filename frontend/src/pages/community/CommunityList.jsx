import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './CommunityList.css';

export default function CommunityList() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);

  useEffect(() => {
    (async () => {
      const { data } = await api.get('/community');
      setItems(data.data || []);
    })();
  }, []);

  return (
    <div className="community-list">
      <div className="header">
        <h2>Community Projects</h2>
        {user && <Link className="btn" to="/community/create">Create Project</Link>}
      </div>
      <ul className="list">
        {items.map(p => (
          <li key={p._id}>
            <Link to={`/community/${p._id}`}>{p.title} - {p.status} - Ward {p.ward}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}


