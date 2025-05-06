import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import baseUrl from '../api/baseUrl';
import useDocumentTitle from '../hooks/useDocumentTitle';

const CompleteVerification: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your account...');

  useDocumentTitle('Complete Verification');

  useEffect(() => {
    const token = searchParams.get('token');
    const email = searchParams.get('email');
    if (!token || !email) {
      setStatus('error');
      setMessage('Invalid verification link.');
      return;
    }
    axios.put(`${baseUrl}/auth/complete-verification`, { email, token })
      .then(() => {
        setStatus('success');
        setMessage('Your account has been successfully verified! You can now log in.');
      })
      .catch(err => {
        setStatus('error');
        setMessage(err.response?.data?.message || 'Verification failed. Please try again or contact support.');
      });
  }, [searchParams]);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <div style={{ background: 'white', padding: '2.5rem 2rem', borderRadius: '12px', boxShadow: '0 4px 16px rgba(67,97,238,0.10)', maxWidth: 400, width: '100%', textAlign: 'center' }}>
        <h2 style={{ color: '#4361EE', marginBottom: '1.5rem' }}>Account Verification</h2>
        <p style={{ color: status === 'error' ? '#d32f2f' : '#4a5568', fontSize: '1.1rem', marginBottom: '2rem' }}>{message}</p>
        {status === 'success' && (
          <button
            style={{ background: '#4361EE', color: 'white', border: 'none', borderRadius: '6px', padding: '0.75rem 2rem', fontWeight: 600, cursor: 'pointer', fontSize: '1rem' }}
            onClick={() => navigate('/login')}
          >
            Go to Login
          </button>
        )}
      </div>
    </div>
  );
};

export default CompleteVerification; 