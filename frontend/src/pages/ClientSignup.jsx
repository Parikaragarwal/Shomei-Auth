import { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SnakeError from '../components/SnakeError';
import axios from 'axios';

export default function ClientSignup() {
  const [name, setName] = useState('');
  const [baseUrl, setBaseUrl] = useState('');
  const [redirectUri, setRedirectUri] = useState('');
  const [error, setError] = useState('');
  const [credentials, setCredentials] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/client-signup', { name, base_url: baseUrl, redirect_uri: redirectUri });
      setCredentials(res.data);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to register application.');
    }
  };

  if (credentials) {
    return (
      <motion.div 
        className="container"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <h1 className="title" style={{ color: 'var(--text-accent)' }}>Success!</h1>
        <p className="subtitle">Please copy your Client Secret now. It will not be shown again.</p>

        <div style={{ padding: '1rem', background: 'rgba(3, 13, 8, 0.6)', borderRadius: '8px', border: '1px solid rgba(132, 204, 22, 0.4)', marginTop: '2rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Client ID</label>
            <code style={{ color: 'var(--text-primary)', wordBreak: 'break-all' }}>{credentials.client_id}</code>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Client Secret</label>
            <code style={{ color: '#ff6b6b', wordBreak: 'break-all' }}>{credentials.client_secret}</code>
          </div>
        </div>

        <Link to="/dashboard" className="btn btn-primary" style={{ display: 'block', textAlign: 'center', textDecoration: 'none', marginTop: '2rem' }}>
          Back to Dashboard
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="container"
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/dashboard" style={{ color: 'var(--text-accent)', textDecoration: 'none', fontSize: '0.9rem' }}>
          &larr; Back to Dashboard
        </Link>
      </div>

      <h1 className="title">Register Application</h1>
      <p className="subtitle">Register your app with Shomei to obtain credentials.</p>

      <SnakeError error={error} />

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="label">Application Name</label>
          <input type="text" className="input" name="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="label">Base URL</label>
          <input type="url" className="input" name="base_url" value={baseUrl} onChange={(e) => setBaseUrl(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="label">Redirect URI</label>
          <input type="url" className="input" name="redirect_uri" value={redirectUri} onChange={(e) => setRedirectUri(e.target.value)} required />
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn btn-primary">Register Client</motion.button>
      </form>
    </motion.div>
  );
}
