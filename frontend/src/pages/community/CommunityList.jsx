import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import './CommunityList.css';

export default function CommunityList() {
  const { user } = useAuth(); // Get current user from context
  const [items, setItems] = useState([]); // Store list of community projects

  // Fetch all community projects from API when component mounts
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
        {/* Show 'Create Project' button if user is authenticated */}
        {user && <Link className="btn" to="/community/create">Create Project</Link>}
      </div>
      <ul className="list">
        {/* List all community projects */}
        {items.map(p => (
          <li key={p._id}>
            <Link to={`/community/${p._id}`}>{p.title} - {p.status} - Ward {p.ward}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}


