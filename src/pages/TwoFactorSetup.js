import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/config.js';

function TwoFactorSetup() {
  const [qrCode, setQrCode] = useState('');
  const [secret, setSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [showVerification, setShowVerification] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    check2FAStatus();
  }, []);

  const check2FAStatus = async () => {
    try {
      const response = await api.get('/auth/2fa-status');
      setIsEnabled(response.data.enabled);
    } catch (error) {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
      setError(error.response?.data?.message || 'Failed to check 2FA status. Please try again.');
    }
  };

  const setup2FA = async () => {
    try {
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);
      
      console.log('Making setup-2fa request...');
      const response = await api.post('/auth/setup-2fa');
      console.log('Setup response:', response.data);
      
      setSecret(response.data.secret);
      setQrCode(response.data.qrCode);
      setShowVerification(true);
    } catch (error) {
      console.error('Setup error:', {
        status: error.response?.status,
        data: error.response?.data,
        headers: error.response?.headers
      });
      setError(error.response?.data?.message || 'Failed to set up 2FA. Please try again.');
    }
  };

  const verifyAndEnable2FA = async () => {
    try {
      const response = await api.post('/auth/verify-2fa', { token: verificationCode });
      if (response.data.success) {
        setIsEnabled(true);
        setShowVerification(false);
        setVerificationCode('');
        setError('');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to verify 2FA code. Please try again.');
    }
  };

  const disable2FA = async () => {
    try {
      const response = await api.post('/auth/disable-2fa', { token: verificationCode });
      if (response.data.success) {
        setIsEnabled(false);
        setSecret('');
        setQrCode('');
        setVerificationCode('');
        setError('');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to disable 2FA. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Two-Factor Authentication</h2>
        
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
            {success}
          </div>
        )}

        {!isEnabled ? (
          <div>
            {!qrCode ? (
              <button
                onClick={setup2FA}
                disabled={isLoading}
                className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 mb-4"
              >
                {isLoading ? 'Setting up...' : 'Set up 2FA'}
              </button>
            ) : (
              <div className="space-y-4">
                <p className="text-center">Scan this QR code with your authenticator app:</p>
                <div className="flex justify-center">
                  <img src={qrCode} alt="2FA QR Code" className="w-48 h-48" />
                </div>
                <p className="text-center text-sm text-gray-600">
                  Or enter this code manually: {secret}
                </p>
                <div className="mt-4">
                  <input
                    type="text"
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="w-full p-2 border rounded mb-4"
                  />
                  <button
                    onClick={verifyAndEnable2FA}
                    disabled={isLoading}
                    className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600"
                  >
                    {isLoading ? 'Verifying...' : 'Verify and Enable'}
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <p className="text-center text-green-600">2FA is currently enabled</p>
            <div>
              <input
                type="text"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                placeholder="Enter 6-digit code to disable"
                maxLength={6}
                className="w-full p-2 border rounded mb-4"
              />
              <button
                onClick={disable2FA}
                disabled={isLoading}
                className="w-full bg-red-500 text-white p-2 rounded hover:bg-red-600"
              >
                {isLoading ? 'Disabling...' : 'Disable 2FA'}
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => navigate('/')}
          className="w-full mt-4 text-blue-500 hover:text-blue-600"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default TwoFactorSetup; 