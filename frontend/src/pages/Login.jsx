import { useState } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import SnakeError from '../components/SnakeError';
import axios from 'axios';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/login', { email, password });
      const redirectUrl = searchParams.get('redirect');
      if (redirectUrl) {
        navigate(redirectUrl);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred during login.');
    }
  };

  return (
    <motion.div 
      className="container"
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
    >
      <h1 className="title">Sign in to Shomei</h1>
      <p className="subtitle">Welcome back. Enter your credentials to access the forest.</p>
      
      <SnakeError error={error} />

      <form onSubmit={handleLogin}>
        <div className="form-group">
          <label className="label">Email address</label>
          <input type="email" className="input" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        <div className="form-group">
          <label className="label">Password</label>
          <div className="input-wrapper">
            <input 
              type={showPassword ? "text" : "password"} 
              className="input" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
            <button type="button" className="input-icon" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" className="btn btn-primary">Sign in</motion.button>
      </form>
      
      <div className="footer-link">
        <Link to="/forgot-password" style={{ display: 'block', marginBottom: '0.5rem' }}>Forgot your password?</Link>
        Don't have an account? <Link to="/signup">Sign up</Link>
      </div>
    </motion.div>
  );
}
