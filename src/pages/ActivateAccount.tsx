import React from 'react';
import useDocumentTitle from '../hooks/useDocumentTitle';

const ActivateAccount: React.FC = () => {
  useDocumentTitle('Activate Account');

  return (
    <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
      <div style={{ background: 'white', padding: '2.5rem 2rem', borderRadius: '12px', boxShadow: '0 4px 16px rgba(67,97,238,0.10)', maxWidth: 400, width: '100%', textAlign: 'center' }}>
        <h2 style={{ color: '#4361EE', marginBottom: '1.5rem' }}>Activate Your Account</h2>
        <p style={{ color: '#4a5568', fontSize: '1.1rem', marginBottom: '2rem' }}>
          An activation link has been sent to your email address.<br />
          Please check your inbox and click the link to activate your account.
        </p>
        <p style={{ color: '#7f8c8d', fontSize: '0.98rem' }}>
          Didn&apos;t receive the email? Please check your spam folder or try signing up again.
        </p>
      </div>
    </div>
  );
};

export default ActivateAccount; 