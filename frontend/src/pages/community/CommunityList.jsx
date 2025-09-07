import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

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
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center' }}>
        <h2>Community Projects</h2>
        {user && <Link to="/community/create">Create Project</Link>}
      </div>
      <ul>
        {items.map(p => (
          <li key={p._id}>
            <Link to={`/community/${p._id}`}>{p.title} - {p.status} - Ward {p.ward}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}


