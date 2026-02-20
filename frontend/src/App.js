import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import blockchainService from './services/blockchainService';
import Navbar from './components/Navbar';
import AdminDashboard from './components/AdminDashboard';
import LawEnforcementDashboard from './components/LawEnforcementDashboard';
import ForensicLabDashboard from './components/ForensicLabDashboard';
import CourtDashboard from './components/CourtDashboard';
import Login from './components/Login';
import './App.css';

function App() {
  const [account, setAccount] = useState(null);
  const [roles, setRoles] = useState({
    isAdmin: false,
    isLawEnforcement: false,
    isForensicLab: false,
    isCourt: false
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      setLoading(true);
      const currentAccount = await blockchainService.init();
      setAccount(currentAccount);
      
      const userRoles = await blockchainService.getUserRoles();
      setRoles(userRoles);
      
      toast.success('Connected to MetaMask successfully!');
    } catch (error) {
      console.error('Error initializing app:', error);
      toast.error(error.message || 'Failed to connect to MetaMask');
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    await initializeApp();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading blockchain connection...</p>
      </div>
    );
  }

  if (!account) {
    return (
      <>
        <Login onLogin={handleLogin} />
        <ToastContainer position="top-right" autoClose={5000} />
      </>
    );
  }

  return (
    <Router>
      <div className="App">
        <Navbar account={account} roles={roles} />
        <div className="container">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route 
              path="/dashboard" 
              element={
                roles.isAdmin ? <AdminDashboard /> :
                roles.isLawEnforcement ? <LawEnforcementDashboard /> :
                roles.isForensicLab ? <ForensicLabDashboard /> :
                roles.isCourt ? <CourtDashboard /> :
                <div className="no-role-message">
                  <h2>No Role Assigned</h2>
                  <p>Please contact the administrator to get a role assigned to your account.</p>
                  <p className="account-address">Your Address: {account}</p>
                </div>
              } 
            />
          </Routes>
        </div>
        <ToastContainer position="top-right" autoClose={5000} />
      </div>
    </Router>
  );
}

export default App;
