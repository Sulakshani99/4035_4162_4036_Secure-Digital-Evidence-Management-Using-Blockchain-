import React, { useState, useEffect } from 'react';
import blockchainService from '../services/blockchainService';
import ipfsService from '../services/ipfsService';

const ChainOfCustodyModal = ({ evidence, onClose }) => {
  const [custody, setCustody] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCustodyChain();
  }, [evidence]);

  const loadCustodyChain = async () => {
    try {
      setLoading(true);
      const chain = await blockchainService.getChainOfCustody(evidence.id);
      setCustody(chain);
    } catch (error) {
      console.error('Error loading custody chain:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAddress = (address) => {
    return `${address.substring(0, 10)}...${address.substring(address.length - 8)}`;
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Chain of Custody</h2>
          <button className="modal-close" onClick={onClose}>&times;</button>
        </div>

        <div style={{ marginBottom: '20px', padding: '15px', background: '#f8f9fa', borderRadius: '8px' }}>
          <h3 style={{ marginBottom: '10px', color: '#333' }}>Evidence Details</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '10px', fontSize: '14px' }}>
            <div style={{ fontWeight: 'bold', color: '#666' }}>Evidence ID:</div>
            <div>{evidence.id}</div>
            
            <div style={{ fontWeight: 'bold', color: '#666' }}>Case ID:</div>
            <div>{evidence.caseId}</div>
            
            <div style={{ fontWeight: 'bold', color: '#666' }}>Type:</div>
            <div>{evidence.evidenceType}</div>
            
            <div style={{ fontWeight: 'bold', color: '#666' }}>Description:</div>
            <div>{evidence.description}</div>
            
            <div style={{ fontWeight: 'bold', color: '#666' }}>Location:</div>
            <div>{evidence.location}</div>
            
            <div style={{ fontWeight: 'bold', color: '#666' }}>Status:</div>
            <div>
              <span className={`status-badge status-${blockchainService.getStatusName(evidence.status).toLowerCase().replace(' ', '-')}`}>
                {blockchainService.getStatusName(evidence.status)}
              </span>
            </div>
            
            <div style={{ fontWeight: 'bold', color: '#666' }}>IPFS Hash:</div>
            <div style={{ fontFamily: 'monospace', fontSize: '12px', wordBreak: 'break-all' }}>
              {evidence.ipfsHash}
              <br />
              <a 
                href={ipfsService.getGatewayURL(evidence.ipfsHash)} 
                target="_blank" 
                rel="noopener noreferrer"
                style={{ color: '#667eea', fontSize: '11px' }}
              >
                View on IPFS Gateway →
              </a>
            </div>
            
            <div style={{ fontWeight: 'bold', color: '#666' }}>Collected By:</div>
            <div style={{ fontFamily: 'monospace', fontSize: '12px' }}>{formatAddress(evidence.collectedBy)}</div>
            
            <div style={{ fontWeight: 'bold', color: '#666' }}>Collected At:</div>
            <div>{evidence.collectedAt.toLocaleString()}</div>
          </div>
        </div>

        <h3 style={{ marginBottom: '15px', color: '#333' }}>Custody Timeline</h3>
        
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <div className="spinner"></div>
            <p>Loading custody chain...</p>
          </div>
        ) : (
          <div className="custody-timeline">
            {custody.map((record, index) => (
              <div key={index} className="custody-item">
                <div className="custody-dot"></div>
                <div className="custody-content">
                  <div className="custody-action">{record.action}</div>
                  <div className="custody-handler">
                    {record.organizationName} ({formatAddress(record.handler)})
                  </div>
                  {record.notes && (
                    <div className="custody-notes">Notes: {record.notes}</div>
                  )}
                  <div className="custody-time">
                    {record.timestamp.toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: '30px', textAlign: 'right' }}>
          <button className="btn btn-secondary" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChainOfCustodyModal;
