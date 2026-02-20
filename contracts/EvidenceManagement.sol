// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/AccessControl.sol";

/**
 * @title EvidenceManagement
 * @dev Secure Digital Evidence Management System with Chain of Custody
 * @notice This contract manages digital evidence for law enforcement with role-based access control
 */
contract EvidenceManagement is AccessControl 
{
    
    // Role definitions
    bytes32 public constant ADMIN_ROLE = keccak256("ADMIN_ROLE");
    bytes32 public constant LAW_ENFORCEMENT_ROLE = keccak256("LAW_ENFORCEMENT_ROLE");
    bytes32 public constant FORENSIC_LAB_ROLE = keccak256("FORENSIC_LAB_ROLE");
    bytes32 public constant COURT_ROLE = keccak256("COURT_ROLE");
    
    uint256 private _evidenceIdCounter;
    uint256 private _organizationIdCounter;
    
    // Enums
    enum EvidenceStatus { Collected, UnderAnalysis, Analyzed, InCourt, Archived, Destroyed }
    enum OrganizationType { LawEnforcement, ForensicLab, Court }
    
    // Structs
    struct Organization {
        uint256 id;
        string name;
        OrganizationType orgType;
        address walletAddress;
        bool isVerified;
        uint256 registeredAt;
    }
    
    struct Evidence {
        uint256 id;
        string caseId;
        string description;
        string evidenceType;    // Physical, Digital, Document, etc.
        string ipfsHash;        // IPFS hash for the evidence file
        address collectedBy;
        uint256 collectedAt;
        EvidenceStatus status;
        bool isActive;
        string location;
    }
    
    struct ChainOfCustody {
        uint256 evidenceId;
        address handler;
        string action;
        string notes;
        uint256 timestamp;
        string organizationName;
    }
    
    // State variables
    mapping(uint256 => Organization) public organizations;
    mapping(address => uint256) public addressToOrgId;
    mapping(uint256 => Evidence) public evidences;
    mapping(uint256 => ChainOfCustody[]) public custodyChain;
    mapping(string => uint256[]) public caseToEvidences;
    
    uint256[] private allOrganizationIds;
    uint256[] private allEvidenceIds;
    
    // Events
    event OrganizationRegistered(uint256 indexed orgId, string name, OrganizationType orgType, address walletAddress);
    event OrganizationVerified(uint256 indexed orgId, address verifiedBy);
    event EvidenceCollected(uint256 indexed evidenceId, string caseId, address collectedBy, uint256 timestamp);
    event EvidenceTransferred(uint256 indexed evidenceId, address from, address to, uint256 timestamp);
    event EvidenceStatusUpdated(uint256 indexed evidenceId, EvidenceStatus newStatus, uint256 timestamp);
    event CustodyRecorded(uint256 indexed evidenceId, address handler, string action, uint256 timestamp);
    event EvidenceDestroyed(uint256 indexed evidenceId, address destroyedBy, uint256 timestamp);
    
    // Modifiers
    modifier onlyVerifiedOrganization() {
        require(addressToOrgId[msg.sender] != 0, "Not a registered organization");
        require(organizations[addressToOrgId[msg.sender]].isVerified, "Organization not verified");
        _;
    }
    
    modifier evidenceExists(uint256 _evidenceId) {
        require(evidences[_evidenceId].id != 0, "Evidence does not exist");
        _;
    }
    
    constructor() {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(ADMIN_ROLE, msg.sender);
    }
    
    /**
     * @dev Register a new organization
     */
    function registerOrganization(
        string memory _name,
        OrganizationType _orgType,
        address _walletAddress
    ) external onlyRole(ADMIN_ROLE) returns (uint256) {
        require(_walletAddress != address(0), "Invalid wallet address");
        require(addressToOrgId[_walletAddress] == 0, "Organization already registered");
        
        _organizationIdCounter++;
        uint256 newOrgId = _organizationIdCounter;
        
        organizations[newOrgId] = Organization({
            id: newOrgId,
            name: _name,
            orgType: _orgType,
            walletAddress: _walletAddress,
            isVerified: false,
            registeredAt: block.timestamp
        });
        
        addressToOrgId[_walletAddress] = newOrgId;
        allOrganizationIds.push(newOrgId);
        
        emit OrganizationRegistered(newOrgId, _name, _orgType, _walletAddress);
        
        return newOrgId;
    }
    
    /**
     * @dev Verify an organization and grant appropriate role
     */
    function verifyOrganization(uint256 _orgId) external onlyRole(ADMIN_ROLE) {
        require(organizations[_orgId].id != 0, "Organization does not exist");
        require(!organizations[_orgId].isVerified, "Organization already verified");
        
        organizations[_orgId].isVerified = true;
        address orgAddress = organizations[_orgId].walletAddress;
        
        // Grant role based on organization type
        if (organizations[_orgId].orgType == OrganizationType.LawEnforcement) {
            _grantRole(LAW_ENFORCEMENT_ROLE, orgAddress);
        } else if (organizations[_orgId].orgType == OrganizationType.ForensicLab) {
            _grantRole(FORENSIC_LAB_ROLE, orgAddress);
        } else if (organizations[_orgId].orgType == OrganizationType.Court) {
            _grantRole(COURT_ROLE, orgAddress);
        }
        
        emit OrganizationVerified(_orgId, msg.sender);
    }
    
    /**
     * @dev Collect new evidence
     */
    function collectEvidence(
        string memory _caseId,
        string memory _description,
        string memory _evidenceType,
        string memory _ipfsHash,
        string memory _location
    ) external onlyRole(LAW_ENFORCEMENT_ROLE) onlyVerifiedOrganization returns (uint256) {
        _evidenceIdCounter++;
        uint256 newEvidenceId = _evidenceIdCounter;
        
        evidences[newEvidenceId] = Evidence({
            id: newEvidenceId,
            caseId: _caseId,
            description: _description,
            evidenceType: _evidenceType,
            ipfsHash: _ipfsHash,
            collectedBy: msg.sender,
            collectedAt: block.timestamp,
            status: EvidenceStatus.Collected,
            isActive: true,
            location: _location
        });
        
        allEvidenceIds.push(newEvidenceId);
        caseToEvidences[_caseId].push(newEvidenceId);
        
        // Record initial custody
        _recordCustody(
            newEvidenceId,
            msg.sender,
            "Evidence Collected",
            string(abi.encodePacked("Initial collection at ", _location))
        );
        
        emit EvidenceCollected(newEvidenceId, _caseId, msg.sender, block.timestamp);
        
        return newEvidenceId;
    }
    
    /**
     * @dev Transfer evidence custody
     */
    function transferEvidence(
        uint256 _evidenceId,
        address _to,
        string memory _notes
    ) external onlyVerifiedOrganization evidenceExists(_evidenceId) {
        require(evidences[_evidenceId].isActive, "Evidence is not active");
        require(addressToOrgId[_to] != 0, "Recipient is not a registered organization");
        require(organizations[addressToOrgId[_to]].isVerified, "Recipient organization not verified");
        
        _recordCustody(_evidenceId, _to, "Evidence Transferred", _notes);
        
        emit EvidenceTransferred(_evidenceId, msg.sender, _to, block.timestamp);
    }
    
    /**
     * @dev Update evidence status
     */
    function updateEvidenceStatus(
        uint256 _evidenceId,
        EvidenceStatus _newStatus,
        string memory _notes
    ) external onlyVerifiedOrganization evidenceExists(_evidenceId) {
        require(evidences[_evidenceId].isActive, "Evidence is not active");
        
        evidences[_evidenceId].status = _newStatus;
        
        string memory action = _getStatusAction(_newStatus);
        _recordCustody(_evidenceId, msg.sender, action, _notes);
        
        emit EvidenceStatusUpdated(_evidenceId, _newStatus, block.timestamp);
    }
    
    /**
     * @dev Destroy evidence (mark as destroyed, cannot be deleted from blockchain)
     */
    function destroyEvidence(
        uint256 _evidenceId,
        string memory _reason
    ) external onlyRole(ADMIN_ROLE) evidenceExists(_evidenceId) {
        require(evidences[_evidenceId].isActive, "Evidence already destroyed");
        
        evidences[_evidenceId].isActive = false;
        evidences[_evidenceId].status = EvidenceStatus.Destroyed;
        
        _recordCustody(_evidenceId, msg.sender, "Evidence Destroyed", _reason);
        
        emit EvidenceDestroyed(_evidenceId, msg.sender, block.timestamp);
    }
    
    /**
     * @dev Internal function to record custody change
     */
    function _recordCustody(
        uint256 _evidenceId,
        address _handler,
        string memory _action,
        string memory _notes
    ) internal {
        uint256 orgId = addressToOrgId[_handler];
        string memory orgName = orgId != 0 ? organizations[orgId].name : "Unknown";
        
        custodyChain[_evidenceId].push(ChainOfCustody({
            evidenceId: _evidenceId,
            handler: _handler,
            action: _action,
            notes: _notes,
            timestamp: block.timestamp,
            organizationName: orgName
        }));
        
        emit CustodyRecorded(_evidenceId, _handler, _action, block.timestamp);
    }
    
    /**
     * @dev Get status action description
     */
    function _getStatusAction(EvidenceStatus _status) internal pure returns (string memory) {
        if (_status == EvidenceStatus.Collected) return "Evidence Collected";
        if (_status == EvidenceStatus.UnderAnalysis) return "Evidence Under Analysis";
        if (_status == EvidenceStatus.Analyzed) return "Evidence Analyzed";
        if (_status == EvidenceStatus.InCourt) return "Evidence Presented in Court";
        if (_status == EvidenceStatus.Archived) return "Evidence Archived";
        if (_status == EvidenceStatus.Destroyed) return "Evidence Destroyed";
        return "Status Updated";
    }
    
    // View functions
    
    /**
     * @dev Get all organizations
     */
    function getAllOrganizations() external view returns (Organization[] memory) {
        Organization[] memory orgs = new Organization[](allOrganizationIds.length);
        for (uint256 i = 0; i < allOrganizationIds.length; i++) {
            orgs[i] = organizations[allOrganizationIds[i]];
        }
        return orgs;
    }
    
    /**
     * @dev Get all evidence
     */
    function getAllEvidence() external view returns (Evidence[] memory) {
        Evidence[] memory evs = new Evidence[](allEvidenceIds.length);
        for (uint256 i = 0; i < allEvidenceIds.length; i++) {
            evs[i] = evidences[allEvidenceIds[i]];
        }
        return evs;
    }
    
    /**
     * @dev Get evidence by case ID
     */
    function getEvidenceByCase(string memory _caseId) external view returns (Evidence[] memory) {
        uint256[] memory evidenceIds = caseToEvidences[_caseId];
        Evidence[] memory caseEvidence = new Evidence[](evidenceIds.length);
        
        for (uint256 i = 0; i < evidenceIds.length; i++) {
            caseEvidence[i] = evidences[evidenceIds[i]];
        }
        
        return caseEvidence;
    }
    
    /**
     * @dev Get chain of custody for evidence
     */
    function getChainOfCustody(uint256 _evidenceId) external view evidenceExists(_evidenceId) returns (ChainOfCustody[] memory) {
        return custodyChain[_evidenceId];
    }
    
    /**
     * @dev Get organization by address
     */
    function getOrganizationByAddress(address _address) external view returns (Organization memory) {
        uint256 orgId = addressToOrgId[_address];
        require(orgId != 0, "Organization not found");
        return organizations[orgId];
    }
    
    /**
     * @dev Verify evidence integrity
     */
    function verifyEvidenceIntegrity(uint256 _evidenceId, string memory _ipfsHash) 
        external 
        view 
        evidenceExists(_evidenceId) 
        returns (bool) 
    {
        return keccak256(abi.encodePacked(evidences[_evidenceId].ipfsHash)) == 
               keccak256(abi.encodePacked(_ipfsHash));
    }
    
    /**
     * @dev Get evidence count
     */
    function getEvidenceCount() external view returns (uint256) {
        return _evidenceIdCounter;
    }
    
    /**
     * @dev Get organization count
     */
    function getOrganizationCount() external view returns (uint256) {
        return _organizationIdCounter;
    }
}
