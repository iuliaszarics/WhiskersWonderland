import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/config.js';

function Login({ onLogin }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [twoFactorData, setTwoFactorData] = useState({
    tempToken: '',
    token: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [requiresTwoFactor, setRequiresTwoFactor] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/api/auth/login', formData);
      
      if (response.data.requiresTwoFactor) {
        setRequiresTwoFactor(true);
        setTwoFactorData(prev => ({ ...prev, tempToken: response.data.tempToken }));
      } else if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        onLogin(response.data.token);
        navigate('/');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Failed to login. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTwoFactorSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await api.post('/api/auth/verify-2fa-login', twoFactorData);
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        onLogin(response.data.token);
        navigate('/');
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      console.error('2FA verification error:', err);
      setError(err.response?.data?.message || 'Failed to verify 2FA code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {!requiresTwoFactor ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Email</label>
              <input
                type="email"
                className="w-full p-2 border rounded"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required
                disabled={isLoading}
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">Password</label>
              <input
                type="password"
                className="w-full p-2 border rounded"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required
                disabled={isLoading}
              />
            </div>
            <button
              type="submit"
              className={`w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleTwoFactorSubmit}>
            <div className="mb-6">
              <label className="block text-gray-700 mb-2">2FA Code</label>
              <input
                type="text"
                className="w-full p-2 border rounded"
                value={twoFactorData.token}
                onChange={(e) => setTwoFactorData({...twoFactorData, token: e.target.value})}
                required
                disabled={isLoading}
                placeholder="Enter 6-digit code"
                maxLength={6}
              />
            </div>
            <button
              type="submit"
              className={`w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 ${
                isLoading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
              disabled={isLoading}
            >
              {isLoading ? 'Verifying...' : 'Verify'}
            </button>
            <button
              type="button"
              onClick={() => setRequiresTwoFactor(false)}
              className="w-full mt-2 text-blue-500 hover:text-blue-600"
            >
              Back to Login
            </button>
          </form>
        )}
        
        <p className="mt-4 text-center">
          Don't have an account? <Link to="/register" className="text-blue-500">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;