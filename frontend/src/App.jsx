import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ForestBackground from './components/ForestBackground';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import VerifyOtp from './pages/VerifyOtp';
import Authorize from './pages/Authorize';
import ClientSignup from './pages/ClientSignup';
import ClientDashboard from './pages/ClientDashboard';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Docs from './pages/Docs';

function App() {
  return (
    <Router>
      <ForestBackground />
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/authorize/:id" element={<Authorize />} />
        <Route path="/client-signup" element={<ClientSignup />} />
        <Route path="/client/:id" element={<ClientDashboard />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/docs" element={<Docs />} />
      </Routes>
    </Router>
  );
}

export default App;
