import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import blockchainService from '../services/blockchainService';
import ipfsService from '../services/ipfsService';
import ChainOfCustodyModal from './ChainOfCustodyModal';

const LawEnforcementDashboard = () => {
  const [evidence, setEvidence] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCollectForm, setShowCollectForm] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedEvidence, setSelectedEvidence] = useState(null);
  const [showCustodyModal, setShowCustodyModal] = useState(false);
  
  const [formData, setFormData] = useState({
    caseId: '',
    description: '',
    evidenceType: 'Digital',
    location: ''
  });

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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
  };

  const handleCollectEvidence = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error('Please select a file');
      return;
    }

    try {
      toast.info('Uploading evidence to IPFS...');
      
      // Upload to IPFS (or simulate)
      let ipfsHash;
      try {
        ipfsHash = await ipfsService.uploadFile(selectedFile);
      } catch (ipfsError) {
        console.warn('IPFS upload failed, using simulated hash:', ipfsError);
        ipfsHash = await ipfsService.simulateUpload(selectedFile);
      }
      
      toast.info('Recording evidence on blockchain...');
      
      const result = await blockchainService.collectEvidence(
        formData.caseId,
        formData.description,
        formData.evidenceType,
        ipfsHash,
        formData.location
      );
      
      toast.success(`Evidence collected! ID: ${result.evidenceId}`);
      
      setFormData({
        caseId: '',
        description: '',
        evidenceType: 'Digital',
        location: ''
      });
      setSelectedFile(null);
      setShowCollectForm(false);
      await loadEvidence();
    } catch (error) {
      console.error('Error collecting evidence:', error);
      toast.error('Failed to collect evidence');
    }
  };

  const handleTransferEvidence = async (evidenceId) => {
    const toAddress = prompt('Enter recipient wallet address:');
    if (!toAddress) return;

    const notes = prompt('Enter transfer notes:');
    if (!notes) return;

    try {
      toast.info('Transferring evidence...');
      await blockchainService.transferEvidence(evidenceId, toAddress, notes);
      toast.success('Evidence transferred successfully!');
      await loadEvidence();
    } catch (error) {
      console.error('Error transferring evidence:', error);
      toast.error('Failed to transfer evidence');
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
        <h1>Law Enforcement Dashboard</h1>
        <p>Collect and manage digital evidence</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Evidence</h3>
          <div className="number">{evidence.length}</div>
          <div className="label">Collected</div>
        </div>
        <div className="stat-card">
          <h3>Active Evidence</h3>
          <div className="number">{evidence.filter(e => e.isActive).length}</div>
          <div className="label">Currently Active</div>
        </div>
        <div className="stat-card">
          <h3>In Court</h3>
          <div className="number">{evidence.filter(e => e.status === 3).length}</div>
          <div className="label">Court Cases</div>
        </div>
      </div>

      <div className="form-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2>Evidence Collection</h2>
          <button 
            className="btn btn-primary" 
            onClick={() => setShowCollectForm(!showCollectForm)}
          >
            {showCollectForm ? 'Cancel' : 'Collect New Evidence'}
          </button>
        </div>

        {showCollectForm && (
          <form onSubmit={handleCollectEvidence}>
            <div className="form-group">
              <label>Case ID</label>
              <input
                type="text"
                name="caseId"
                value={formData.caseId}
                onChange={handleInputChange}
                required
                placeholder="e.g., CASE-2026-001"
              />
            </div>

            <div className="form-group">
              <label>Evidence Type</label>
              <select
                name="evidenceType"
                value={formData.evidenceType}
                onChange={handleInputChange}
                required
              >
                <option value="Digital">Digital</option>
                <option value="Physical">Physical</option>
                <option value="Document">Document</option>
                <option value="Video">Video</option>
                <option value="Audio">Audio</option>
                <option value="Photo">Photo</option>
              </select>
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
                placeholder="Detailed description of the evidence"
              />
            </div>

            <div className="form-group">
              <label>Collection Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                placeholder="e.g., 123 Main St, Evidence Room A"
              />
            </div>

            <div className="form-group">
              <label>Evidence File</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  onChange={handleFileChange}
                  required
                />
                <div className="file-input-label">
                  {selectedFile ? selectedFile.name : 'Choose File'}
                </div>
              </div>
              {selectedFile && (
                <div className="selected-file">
                  Selected: {selectedFile.name} ({(selectedFile.size / 1024).toFixed(2)} KB)
                </div>
              )}
            </div>

            <button type="submit" className="btn btn-primary">
              Collect Evidence
            </button>
          </form>
        )}
      </div>

      <div className="form-section">
        <h2>Collected Evidence</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Case ID</th>
                <th>Type</th>
                <th>Description</th>
                <th>Location</th>
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
                  <td>{ev.description.substring(0, 40)}...</td>
                  <td>{ev.location}</td>
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
                    {ev.isActive && (
                      <button 
                        className="btn btn-secondary" 
                        onClick={() => handleTransferEvidence(ev.id)}
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        Transfer
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

export default LawEnforcementDashboard;
