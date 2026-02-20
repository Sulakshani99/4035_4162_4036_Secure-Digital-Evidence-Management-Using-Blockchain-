import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import blockchainService from '../services/blockchainService';

const AdminDashboard = () => {
  const [organizations, setOrganizations] = useState([]);
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    orgType: '0',
    walletAddress: ''
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [orgs, evs] = await Promise.all([
        blockchainService.getAllOrganizations(),
        blockchainService.getAllEvidence()
      ]);
      setOrganizations(orgs);
      setEvidence(evs);
    } catch (error) {
      console.error('Error loading data:', error);
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleRegisterOrganization = async (e) => {
    e.preventDefault();
    
    try {
      toast.info('Registering organization...');
      await blockchainService.registerOrganization(
        formData.name,
        parseInt(formData.orgType),
        formData.walletAddress
      );
      
      toast.success('Organization registered successfully!');
      setFormData({ name: '', orgType: '0', walletAddress: '' });
      setShowRegisterForm(false);
      await loadData();
    } catch (error) {
      console.error('Error registering organization:', error);
      toast.error('Failed to register organization');
    }
  };

  const handleVerifyOrganization = async (orgId) => {
    try {
      toast.info('Verifying organization...');
      await blockchainService.verifyOrganization(orgId);
      toast.success('Organization verified successfully!');
      await loadData();
    } catch (error) {
      console.error('Error verifying organization:', error);
      toast.error('Failed to verify organization');
    }
  };

  const handleDestroyEvidence = async (evidenceId) => {
    const reason = prompt('Enter reason for destroying evidence:');
    if (!reason) return;

    try {
      toast.info('Destroying evidence...');
      await blockchainService.destroyEvidence(evidenceId, reason);
      toast.success('Evidence marked as destroyed');
      await loadData();
    } catch (error) {
      console.error('Error destroying evidence:', error);
      toast.error('Failed to destroy evidence');
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Administrator Dashboard</h1>
        <p>Manage organizations and oversee all evidence in the system</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Organizations</h3>
          <div className="number">{organizations.length}</div>
          <div className="label">Registered</div>
        </div>
        <div className="stat-card">
          <h3>Verified Organizations</h3>
          <div className="number">{organizations.filter(o => o.isVerified).length}</div>
          <div className="label">Active</div>
        </div>
        <div className="stat-card">
          <h3>Total Evidence</h3>
          <div className="number">{evidence.length}</div>
          <div className="label">In System</div>
        </div>
        <div className="stat-card">
          <h3>Active Evidence</h3>
          <div className="number">{evidence.filter(e => e.isActive).length}</div>
          <div className="label">Currently Active</div>
        </div>
      </div>

      <div className="form-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Organizations Management</h2>
          <button 
            className="btn btn-primary" 
            onClick={() => setShowRegisterForm(!showRegisterForm)}
          >
            {showRegisterForm ? 'Cancel' : 'Register New Organization'}
          </button>
        </div>

        {showRegisterForm && (
          <form onSubmit={handleRegisterOrganization} style={{ marginBottom: '30px' }}>
            <div className="form-group">
              <label>Organization Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="e.g., Metropolitan Police Department"
              />
            </div>

            <div className="form-group">
              <label>Organization Type</label>
              <select
                name="orgType"
                value={formData.orgType}
                onChange={handleInputChange}
                required
              >
                <option value="0">Law Enforcement</option>
                <option value="1">Forensic Lab</option>
                <option value="2">Court</option>
              </select>
            </div>

            <div className="form-group">
              <label>Wallet Address</label>
              <input
                type="text"
                name="walletAddress"
                value={formData.walletAddress}
                onChange={handleInputChange}
                required
                placeholder="0x..."
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Register Organization
            </button>
          </form>
        )}

        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Type</th>
                <th>Wallet Address</th>
                <th>Status</th>
                <th>Registered At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map(org => (
                <tr key={org.id}>
                  <td>{org.id}</td>
                  <td>{org.name}</td>
                  <td>{blockchainService.getOrgTypeName(org.orgType)}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '12px' }}>
                    {org.walletAddress.substring(0, 10)}...{org.walletAddress.substring(org.walletAddress.length - 8)}
                  </td>
                  <td>
                    {org.isVerified ? 
                      <span className="verified">✓ Verified</span> : 
                      <span className="not-verified">✗ Not Verified</span>
                    }
                  </td>
                  <td>{org.registeredAt.toLocaleString()}</td>
                  <td>
                    {!org.isVerified && (
                      <button 
                        className="btn btn-success" 
                        onClick={() => handleVerifyOrganization(org.id)}
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        Verify
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="form-section">
        <h2>All Evidence</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Case ID</th>
                <th>Type</th>
                <th>Description</th>
                <th>Status</th>
                <th>Collected At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {evidence.map(ev => (
                <tr key={ev.id}>
                  <td>{ev.id}</td>
                  <td>{ev.caseId}</td>
                  <td>{ev.evidenceType}</td>
                  <td>{ev.description.substring(0, 50)}...</td>
                  <td>
                    <span className={`status-badge status-${blockchainService.getStatusName(ev.status).toLowerCase().replace(' ', '-')}`}>
                      {blockchainService.getStatusName(ev.status)}
                    </span>
                  </td>
                  <td>{ev.collectedAt.toLocaleString()}</td>
                  <td>
                    {ev.isActive && (
                      <button 
                        className="btn btn-danger" 
                        onClick={() => handleDestroyEvidence(ev.id)}
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        Destroy
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
