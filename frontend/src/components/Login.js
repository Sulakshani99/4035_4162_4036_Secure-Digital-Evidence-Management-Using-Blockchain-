import React from 'react';
import { FaLock } from 'react-icons/fa';

const Login = ({ onLogin }) => {
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-icon">
          <FaLock />
        </div>
        <h1>Evidence Chain</h1>
        <p>Secure Digital Evidence Management System</p>
        <p style={{ marginBottom: '30px', fontSize: '14px', color: '#999' }}>
          Connect your MetaMask wallet to access the blockchain-based evidence management system
        </p>
        <button className="btn btn-primary" onClick={onLogin} style={{ fontSize: '16px', padding: '15px 40px' }}>
          Connect MetaMask
        </button>
        <div style={{ marginTop: '30px', fontSize: '13px', color: '#666' }}>
          <p>Make sure you have MetaMask installed and are connected to the correct network.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
