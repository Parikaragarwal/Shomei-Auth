import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams, Link } from 'react-router-dom';
import SnakeError from '../components/SnakeError';
import axios from 'axios';

export default function ClientDashboard() {
  const { id } = useParams();
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchClientData();
  }, [id]);

  const fetchClientData = async () => {
    try {
      const res = await axios.get(`/api/clients/${id}/users`);
      setUsers(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load client data.');
    }
  };

  return (
    <motion.div 
      className="dashboard-fullscreen"
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div style={{ marginBottom: '2rem' }}>
        <Link to="/dashboard" className="btn btn-secondary" style={{ width: 'auto', display: 'inline-flex', padding: '0.5rem 1rem', textDecoration: 'none', fontSize: '0.9rem' }}>
          &larr; Back to Dashboard
        </Link>
      </div>

      <h1 className="title" style={{ fontSize: '2.5rem' }}>App Statistics</h1>
      <p className="subtitle" style={{ fontSize: '1.1rem' }}>Client ID: {id}</p>
      
      <SnakeError error={error} />

      <div style={{ marginTop: '3rem', background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(132, 204, 22, 0.1)' }}>
        <h2 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', marginBottom: '1.5rem' }}>Active Users ({users.length})</h2>
        
        {users.length === 0 ? (
          <p style={{ color: 'var(--text-secondary)' }}>No active users currently connected to this app.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {users.map((session, index) => (
              <div key={index} style={{ padding: '1.5rem', background: 'rgba(3, 13, 8, 0.6)', borderRadius: '8px', border: '1px solid rgba(132, 204, 22, 0.2)' }}>
                <strong style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>{session.user_name}</strong>
                <div style={{ fontSize: '0.9rem', color: 'var(--text-accent)', marginTop: '0.25rem' }}>{session.user_email}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.75rem' }}>
                  Connected: {new Date(session.created_at).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
}
