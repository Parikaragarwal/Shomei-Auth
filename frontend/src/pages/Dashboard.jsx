import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import SnakeError from '../components/SnakeError';
import axios from 'axios';

export default function Dashboard() {
  const [sessions, setSessions] = useState([]);
  const [clients, setClients] = useState([]);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [sessRes, clientsRes] = await Promise.all([
        axios.get('/api/user/sessions'),
        axios.get('/api/clients')
      ]);
      setSessions(sessRes.data);
      setClients(clientsRes.data);
    } catch (err) {
      if (err.response?.status === 401) {
        navigate('/login');
      } else {
        setError('Failed to load dashboard data.');
      }
    }
  };

  const handleRevoke = async (clientId) => {
    try {
      await axios.delete(`/api/user/sessions/${clientId}`);
      fetchDashboardData();
    } catch (err) {
      setError('Failed to revoke access.');
    }
  };

  const handleRevokeAll = async () => {
    try {
      await axios.post('/logout-all');
      navigate('/login');
    } catch (err) {
      setError('Failed to logout of all sessions.');
    }
  };

  const handleLogout = async () => {
    try {
      await axios.post('/logout');
      navigate('/login');
    } catch (err) {
      setError('Failed to logout.');
    }
  };

  return (
    <motion.div 
      className="dashboard-fullscreen"
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h1 className="title" style={{ fontSize: '2.5rem' }}>Your Forest Hub</h1>
        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handleLogout} className="btn btn-secondary" style={{ padding: '0.75rem 1.5rem', width: 'auto' }}>
          Sign Out
        </motion.button>
      </div>
      
      <SnakeError error={error} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '3rem', marginTop: '2rem' }}>
        
        {/* Active Connections Column */}
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(132, 204, 22, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '1.5rem' }}>Active Connections</h2>
            <button onClick={handleRevokeAll} className="btn btn-secondary" style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.85rem', color: '#ff6b6b', borderColor: '#ff6b6b' }}>
              Revoke All
            </button>
          </div>
          
          {sessions.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>You are not connected to any third-party applications.</p>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {sessions.map(sess => (
                <div key={sess.session_id} style={{ padding: '1.5rem', background: 'rgba(3, 13, 8, 0.6)', borderRadius: '8px', border: '1px solid rgba(132, 204, 22, 0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <strong style={{ color: 'var(--text-primary)', fontSize: '1.1rem' }}>{sess.client_name || 'Shomei Core'}</strong>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Connected since {new Date(sess.created_at).toLocaleDateString()}</div>
                  </div>
                  {sess.client_name && (
                    <button onClick={() => handleRevoke(sess.client_id)} className="btn btn-secondary" style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.85rem' }}>
                      Disconnect
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Developer Apps Column */}
        <div style={{ background: 'rgba(0,0,0,0.2)', padding: '2rem', borderRadius: '12px', border: '1px solid rgba(132, 204, 22, 0.1)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ color: 'var(--text-primary)', fontSize: '1.5rem' }}>Developer Apps</h2>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <Link to="/docs" className="btn btn-secondary" style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.85rem', textDecoration: 'none' }}>
                View Docs
              </Link>
              <Link to="/client-signup" className="btn btn-primary" style={{ width: 'auto', padding: '0.5rem 1rem', fontSize: '0.85rem', textDecoration: 'none' }}>
                Register New App
              </Link>
            </div>
          </div>

          {clients.length === 0 ? (
            <p style={{ color: 'var(--text-secondary)' }}>You haven't registered any OAuth applications yet.</p>
          ) : (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {clients.map(client => (
                <Link to={`/client/${client.client_id}`} key={client.client_id} style={{ textDecoration: 'none' }}>
                  <motion.div whileHover={{ scale: 1.02 }} style={{ padding: '1.5rem', background: 'rgba(3, 13, 8, 0.6)', borderRadius: '8px', border: '1px solid rgba(132, 204, 22, 0.2)', cursor: 'pointer' }}>
                    <strong style={{ color: 'var(--text-accent)', fontSize: '1.1rem' }}>{client.name}</strong>
                    <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>{client.base_url}</div>
                  </motion.div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </motion.div>
  );
}
