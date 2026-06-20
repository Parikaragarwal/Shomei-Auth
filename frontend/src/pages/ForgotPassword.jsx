import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import SnakeError from '../components/SnakeError';
import axios from 'axios';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleForgot = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/forgot-password', { email });
      navigate('/reset-password', { state: { email } });
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to request password reset.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      className="container"
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <h1 className="title">Lost your way?</h1>
      <p className="subtitle">It happens to the best of us. Let's find your password.</p>

      <SnakeError error={error} />

      <form onSubmit={handleForgot}>
        <div className="form-group">
          <label className="label">Email address</label>
          <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Sending..." : "Send Reset Code"}
        </motion.button>
      </form>

      <div className="footer-link">
        Remembered it? <Link to="/login">Sign in</Link>
      </div>
    </motion.div>
  );
}
