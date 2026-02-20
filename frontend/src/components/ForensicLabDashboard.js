import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import blockchainService from '../services/blockchainService';
import ChainOfCustodyModal from './ChainOfCustodyModal';

const ForensicLabDashboard = () => {
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [showCustodyModal, setShowCustodyModal] = useState(false);

  useEffect(() => {
    loadEvidence();
  }, []);

  const loadEvidence = async () => {
    try {
      setLoading(true);
      const allEvidence = await blockchainService.getAllEvidence();
      setEvidence(allEvidence);
    } catch (error) {
      console.error('Error loading evidence:', error);
      toast.error('Failed to load evidence');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (evidenceId, newStatus) => {
    const notes = prompt('Enter analysis notes:');
    if (!notes) return;

    try {
      toast.info('Updating evidence status...');
      await blockchainService.updateEvidenceStatus(evidenceId, newStatus, notes);
      toast.success('Evidence status updated successfully!');
      await loadEvidence();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update evidence status');
    }
  };

  const handleViewCustody = async (ev) => {
    setSelectedEvidence(ev);
    setShowCustodyModal(true);
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
        <h1>Forensic Lab Dashboard</h1>
        <p>Analyze evidence and update forensic findings</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Evidence</h3>
          <div className="number">{evidence.length}</div>
          <div className="label">In System</div>
        </div>
        <div className="stat-card">
          <h3>Under Analysis</h3>
          <div className="number">{evidence.filter(e => e.status === 1).length}</div>
          <div className="label">Being Analyzed</div>
        </div>
        <div className="stat-card">
          <h3>Analyzed</h3>
          <div className="number">{evidence.filter(e => e.status === 2).length}</div>
          <div className="label">Completed</div>
        </div>
      </div>

      <div className="form-section">
        <h2>Evidence Analysis</h2>
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
                <th>IPFS Hash</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {evidence.map(ev => (
                <tr key={ev.id}>
                  <td>{ev.id}</td>
                  <td>{ev.caseId}</td>
                  <td>{ev.evidenceType}</td>
                  <td>{ev.description.substring(0, 40)}...</td>
                  <td>
                    <span className={`status-badge status-${blockchainService.getStatusName(ev.status).toLowerCase().replace(' ', '-')}`}>
                      {blockchainService.getStatusName(ev.status)}
                    </span>
                  </td>
                  <td>{ev.collectedAt.toLocaleString()}</td>
                  <td style={{ fontFamily: 'monospace', fontSize: '11px' }}>
                    {ev.ipfsHash.substring(0, 10)}...
                  </td>
                  <td>
                    <button 
                      className="btn btn-primary" 
                      onClick={() => handleViewCustody(ev)}
                      style={{ padding: '6px 12px', fontSize: '12px', marginRight: '5px' }}
                    >
                      View Chain
                    </button>
                    {ev.isActive && ev.status === 0 && (
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => handleUpdateStatus(ev.id, 1)}
                        style={{ padding: '6px 12px', fontSize: '12px', marginRight: '5px' }}
                      >
                        Start Analysis
                      </button>
                    )}
                    {ev.isActive && ev.status === 1 && (
                      <button 
                        className="btn btn-success" 
                        onClick={() => handleUpdateStatus(ev.id, 2)}
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        Complete Analysis
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCustodyModal && selectedEvidence && (
        <ChainOfCustodyModal
          evidence={selectedEvidence}
          onClose={() => {
            setShowCustodyModal(false);
            setSelectedEvidence(null);
          }}
        />
      )}
    </div>
  );
};

export default ForensicLabDashboard;
