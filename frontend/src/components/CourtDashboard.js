import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import blockchainService from '../services/blockchainService';
import ChainOfCustodyModal from './ChainOfCustodyModal';

const CourtDashboard = () => {
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [showCustodyModal, setShowCustodyModal] = useState(false);
  const [searchCaseId, setSearchCaseId] = useState('');

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

  const handleSearchByCase = async (e) => {
    e.preventDefault();
    
    if (!searchCaseId.trim()) {
      await loadEvidence();
      return;
    }

    try {
      setLoading(true);
      const caseEvidence = await blockchainService.getEvidenceByCase(searchCaseId);
      setEvidence(caseEvidence);
      
      if (caseEvidence.length === 0) {
        toast.info('No evidence found for this case');
      } else {
        toast.success(`Found ${caseEvidence.length} evidence items`);
      }
    } catch (error) {
      console.error('Error searching evidence:', error);
      toast.error('Failed to search evidence');
    } finally {
      setLoading(false);
    }
  };

  const handlePresentInCourt = async (evidenceId) => {
    const notes = prompt('Enter court presentation notes:');
    if (!notes) return;

    try {
      toast.info('Updating evidence status...');
      await blockchainService.updateEvidenceStatus(evidenceId, 3, notes);
      toast.success('Evidence marked as presented in court!');
      await loadEvidence();
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update evidence status');
    }
  };

  const handleArchiveEvidence = async (evidenceId) => {
    const notes = prompt('Enter archival notes:');
    if (!notes) return;

    try {
      toast.info('Archiving evidence...');
      await blockchainService.updateEvidenceStatus(evidenceId, 4, notes);
      toast.success('Evidence archived successfully!');
      await loadEvidence();
    } catch (error) {
      console.error('Error archiving evidence:', error);
      toast.error('Failed to archive evidence');
    }
  };

  const handleVerifyIntegrity = async (evidenceId, ipfsHash) => {
    try {
      toast.info('Verifying evidence integrity...');
      const isValid = await blockchainService.verifyEvidenceIntegrity(evidenceId, ipfsHash);
      
      if (isValid) {
        toast.success('✓ Evidence integrity verified - No tampering detected');
      } else {
        toast.error('✗ Evidence integrity check failed - Possible tampering!');
      }
    } catch (error) {
      console.error('Error verifying integrity:', error);
      toast.error('Failed to verify evidence integrity');
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
        <h1>Court Dashboard</h1>
        <p>View and verify evidence for court proceedings</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Evidence</h3>
          <div className="number">{evidence.length}</div>
          <div className="label">Available</div>
        </div>
        <div className="stat-card">
          <h3>In Court</h3>
          <div className="number">{evidence.filter(e => e.status === 3).length}</div>
          <div className="label">Presented</div>
        </div>
        <div className="stat-card">
          <h3>Archived</h3>
          <div className="number">{evidence.filter(e => e.status === 4).length}</div>
          <div className="label">Completed</div>
        </div>
      </div>

      <div className="form-section">
        <h2>Search Evidence by Case</h2>
        <form onSubmit={handleSearchByCase} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
          <input
            type="text"
            value={searchCaseId}
            onChange={(e) => setSearchCaseId(e.target.value)}
            placeholder="Enter Case ID (e.g., CASE-2026-001)"
            style={{ flex: 1 }}
          />
          <button type="submit" className="btn btn-primary">Search</button>
          <button 
            type="button" 
            className="btn btn-secondary" 
            onClick={() => {
              setSearchCaseId('');
              loadEvidence();
            }}
          >
            Clear
          </button>
        </form>
      </div>

      <div className="form-section">
        <h2>Evidence Repository</h2>
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
              {evidence.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                    No evidence found
                  </td>
                </tr>
              ) : (
                evidence.map(ev => (
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
                    <td>
                      <button 
                        className="btn btn-primary" 
                        onClick={() => handleViewCustody(ev)}
                        style={{ padding: '6px 12px', fontSize: '12px', marginRight: '5px' }}
                      >
                        View Chain
                      </button>
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => handleVerifyIntegrity(ev.id, ev.ipfsHash)}
                        style={{ padding: '6px 12px', fontSize: '12px', marginRight: '5px' }}
                      >
                        Verify
                      </button>
                      {ev.isActive && ev.status === 2 && (
                        <button 
                          className="btn btn-success" 
                          onClick={() => handlePresentInCourt(ev.id)}
                          style={{ padding: '6px 12px', fontSize: '12px', marginRight: '5px' }}
                        >
                          Present
                        </button>
                      )}
                      {ev.isActive && ev.status === 3 && (
                        <button 
                          className="btn btn-secondary" 
                          onClick={() => handleArchiveEvidence(ev.id)}
                          style={{ padding: '6px 12px', fontSize: '12px' }}
                        >
                          Archive
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
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

export default CourtDashboard;
