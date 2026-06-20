import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import SnakeError from '../components/SnakeError';
import axios from 'axios';

export default function VerifyOtp() {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || '';

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/verify-otp', { email, otp });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid OTP.');
    }
  };

  const handleResend = async () => {
    try {
      await axios.post('/resend-otp', { email });
      setMessage('A new code has been sent. We apologize for the wait.');
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to resend.');
    }
  };

  return (
    <motion.div 
      className="container"
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <h1 className="title">Check your email</h1>
      <p className="subtitle">
        We know verifying emails is a hassle, but we need to make sure this is really you. 
        We've sent a code to {email}.
      </p>

      <SnakeError error={error} />
      {message && <div style={{ color: 'var(--text-accent)', marginBottom: '1rem', fontSize: '0.875rem' }}>{message}</div>}

      <form onSubmit={handleVerify}>
        <div className="form-group">
          <label className="label">Verification Code</label>
          <input type="text" className="input" value={otp} onChange={(e) => setOtp(e.target.value)} required />
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn btn-primary">Verify Identity</motion.button>
      </form>

      <div className="footer-link" style={{ marginTop: '1rem' }}>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="button" onClick={handleResend} className="btn btn-secondary" style={{ width: '100%' }}>Resend Code</motion.button>
      </div>
    </motion.div>
  );
}
