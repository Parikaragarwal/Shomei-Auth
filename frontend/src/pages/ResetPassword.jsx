import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import SnakeError from '../components/SnakeError';
import axios from 'axios';

export default function ResetPassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleReset = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    try {
      await axios.post('/reset-password', { email, otp, newPassword });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password.');
    }
  };

  return (
    <motion.div 
      className="container"
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <h1 className="title">A new beginning</h1>
      <p className="subtitle">Check your email for the reset code.</p>

      <SnakeError error={error} />

      <form onSubmit={handleReset}>
        <div className="form-group">
          <label className="label">Email address</label>
          <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="label">Reset Code</label>
          <input type="text" className="input" value={otp} onChange={(e) => setOtp(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="label">New Password</label>
          <div className="input-wrapper">
            <input 
              type={showPassword ? "text" : "password"} 
              className="input" 
              value={newPassword} 
              onChange={(e) => setNewPassword(e.target.value)} 
              required 
            />
            <button type="button" className="input-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <div className="form-group">
          <label className="label">Confirm New Password</label>
          <input 
            type={showPassword ? "text" : "password"} 
            className="input" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn btn-primary">Reset Password</motion.button>
      </form>

      <div className="footer-link">
        <Link to="/login">Back to Sign in</Link>
      </div>
    </motion.div>
  );
}
