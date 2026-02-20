import { ethers } from 'ethers';
import EvidenceManagementArtifact from '../contracts/EvidenceManagement.json';
import contractAddress from '../contracts/contract-address.json';

class BlockchainService {
  constructor() {
    this.provider = null;
    this.signer = null;
    this.contract = null;
    this.currentAccount = null;
  }

  /**
   * Initialize connection to MetaMask
   */
  async init() {
    if (typeof window.ethereum === 'undefined') {
      throw new Error('Please install MetaMask to use this application');
    }

    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
      this.signer = this.provider.getSigner();
      this.currentAccount = await this.signer.getAddress();

      // Initialize contract
      this.contract = new ethers.Contract(
        contractAddress.EvidenceManagement,
        EvidenceManagementArtifact.abi,
        this.signer
      );

      // Listen for account changes
      window.ethereum.on('accountsChanged', (accounts) => {
        window.location.reload();
      });

      // Listen for chain changes
      window.ethereum.on('chainChanged', (chainId) => {
        window.location.reload();
      });

      return this.currentAccount;
    } catch (error) {
      console.error('Error initializing blockchain service:', error);
      throw error;
    }
  }

  /**
   * Get current connected account
   */
  getCurrentAccount() {
    return this.currentAccount;
  }

  /**
   * Get contract instance
   */
  getContract() {
    if (!this.contract) {
      throw new Error('Contract not initialized. Call init() first.');
    }
    return this.contract;
  }

  /**
   * Check if user has specific role
   */
  async hasRole(role) {
    try {
      const contract = this.getContract();
      const roleHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(role));
      return await contract.hasRole(roleHash, this.currentAccount);
    } catch (error) {
      console.error('Error checking role:', error);
      return false;
    }
  }

  /**
   * Get user roles
   */
  async getUserRoles() {
    const roles = {
      isAdmin: false,
      isLawEnforcement: false,
      isForensicLab: false,
      isCourt: false
    };

    try {
      roles.isAdmin = await this.hasRole('ADMIN_ROLE');
      roles.isLawEnforcement = await this.hasRole('LAW_ENFORCEMENT_ROLE');
      roles.isForensicLab = await this.hasRole('FORENSIC_LAB_ROLE');
      roles.isCourt = await this.hasRole('COURT_ROLE');
    } catch (error) {
      console.error('Error getting user roles:', error);
    }

    return roles;
  }

  /**
   * Register a new organization
   */
  async registerOrganization(name, orgType, walletAddress) {
    try {
      const contract = this.getContract();
      const tx = await contract.registerOrganization(name, orgType, walletAddress);
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Error registering organization:', error);
      throw error;
    }
  }

  /**
   * Verify an organization
   */
  async verifyOrganization(orgId) {
    try {
      const contract = this.getContract();
      const tx = await contract.verifyOrganization(orgId);
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Error verifying organization:', error);
      throw error;
    }
  }

  /**
   * Get all organizations
   */
  async getAllOrganizations() {
    try {
      const contract = this.getContract();
      const organizations = await contract.getAllOrganizations();
      return organizations.map(org => ({
        id: org.id.toNumber(),
        name: org.name,
        orgType: org.orgType,
        walletAddress: org.walletAddress,
        isVerified: org.isVerified,
        registeredAt: new Date(org.registeredAt.toNumber() * 1000)
      }));
    } catch (error) {
      console.error('Error getting organizations:', error);
      throw error;
    }
  }

  /**
   * Collect new evidence
   */
  async collectEvidence(caseId, description, evidenceType, ipfsHash, location) {
    try {
      const contract = this.getContract();
      const tx = await contract.collectEvidence(
        caseId,
        description,
        evidenceType,
        ipfsHash,
        location
      );
      const receipt = await tx.wait();
      
      // Extract evidence ID from event
      const event = receipt.events?.find(e => e.event === 'EvidenceCollected');
      const evidenceId = event?.args?.evidenceId.toNumber();
      
      return { receipt, evidenceId };
    } catch (error) {
      console.error('Error collecting evidence:', error);
      throw error;
    }
  }

  /**
   * Transfer evidence
   */
  async transferEvidence(evidenceId, toAddress, notes) {
    try {
      const contract = this.getContract();
      const tx = await contract.transferEvidence(evidenceId, toAddress, notes);
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Error transferring evidence:', error);
      throw error;
    }
  }

  /**
   * Update evidence status
   */
  async updateEvidenceStatus(evidenceId, newStatus, notes) {
    try {
      const contract = this.getContract();
      const tx = await contract.updateEvidenceStatus(evidenceId, newStatus, notes);
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Error updating evidence status:', error);
      throw error;
    }
  }

  /**
   * Get all evidence
   */
  async getAllEvidence() {
    try {
      const contract = this.getContract();
      const evidence = await contract.getAllEvidence();
      return this._formatEvidenceArray(evidence);
    } catch (error) {
      console.error('Error getting all evidence:', error);
      throw error;
    }
  }

  /**
   * Get evidence by case ID
   */
  async getEvidenceByCase(caseId) {
    try {
      const contract = this.getContract();
      const evidence = await contract.getEvidenceByCase(caseId);
      return this._formatEvidenceArray(evidence);
    } catch (error) {
      console.error('Error getting evidence by case:', error);
      throw error;
    }
  }

  /**
   * Get chain of custody
   */
  async getChainOfCustody(evidenceId) {
    try {
      const contract = this.getContract();
      const custody = await contract.getChainOfCustody(evidenceId);
      return custody.map(record => ({
        evidenceId: record.evidenceId.toNumber(),
        handler: record.handler,
        action: record.action,
        notes: record.notes,
        timestamp: new Date(record.timestamp.toNumber() * 1000),
        organizationName: record.organizationName
      }));
    } catch (error) {
      console.error('Error getting chain of custody:', error);
      throw error;
    }
  }

  /**
   * Verify evidence integrity
   */
  async verifyEvidenceIntegrity(evidenceId, ipfsHash) {
    try {
      const contract = this.getContract();
      return await contract.verifyEvidenceIntegrity(evidenceId, ipfsHash);
    } catch (error) {
      console.error('Error verifying evidence integrity:', error);
      throw error;
    }
  }

  /**
   * Destroy evidence
   */
  async destroyEvidence(evidenceId, reason) {
    try {
      const contract = this.getContract();
      const tx = await contract.destroyEvidence(evidenceId, reason);
      const receipt = await tx.wait();
      return receipt;
    } catch (error) {
      console.error('Error destroying evidence:', error);
      throw error;
    }
  }

  /**
   * Format evidence array
   */
  _formatEvidenceArray(evidenceArray) {
    return evidenceArray.map(ev => ({
      id: ev.id.toNumber(),
      caseId: ev.caseId,
      description: ev.description,
      evidenceType: ev.evidenceType,
      ipfsHash: ev.ipfsHash,
      collectedBy: ev.collectedBy,
      collectedAt: new Date(ev.collectedAt.toNumber() * 1000),
      status: ev.status,
      isActive: ev.isActive,
      location: ev.location
    }));
  }

  /**
   * Get status name
   */
  getStatusName(status) {
    const statuses = ['Collected', 'Under Analysis', 'Analyzed', 'In Court', 'Archived', 'Destroyed'];
    return statuses[status] || 'Unknown';
  }

  /**
   * Get organization type name
   */
  getOrgTypeName(orgType) {
    const types = ['Law Enforcement', 'Forensic Lab', 'Court'];
    return types[orgType] || 'Unknown';
  }
}

export default new BlockchainService();
