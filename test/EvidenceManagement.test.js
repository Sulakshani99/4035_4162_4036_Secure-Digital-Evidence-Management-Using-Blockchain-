const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("EvidenceManagement", function () {
  let evidenceManagement;
  let admin, lawEnforcement, forensicLab, court, user;

  beforeEach(async function () {
    [admin, lawEnforcement, forensicLab, court, user] = await ethers.getSigners();

    const EvidenceManagement = await ethers.getContractFactory("EvidenceManagement");
    evidenceManagement = await EvidenceManagement.deploy();
    await evidenceManagement.waitForDeployment();
  });

  describe("Deployment", function () {
    it("Should set the deployer as admin", async function () {
      const ADMIN_ROLE = await evidenceManagement.ADMIN_ROLE();
      expect(await evidenceManagement.hasRole(ADMIN_ROLE, admin.address)).to.be.true;
    });
  });

  describe("Organization Management", function () {
    it("Should register and verify organizations", async function () {
      // Register law enforcement
      await evidenceManagement.registerOrganization(
        "Metro Police",
        0, // LawEnforcement
        lawEnforcement.address
      );

      // Verify organization
      await evidenceManagement.verifyOrganization(1);

      const LAW_ENFORCEMENT_ROLE = await evidenceManagement.LAW_ENFORCEMENT_ROLE();
      expect(await evidenceManagement.hasRole(LAW_ENFORCEMENT_ROLE, lawEnforcement.address)).to.be.true;
    });

    it("Should not allow non-admin to register organizations", async function () {
      await expect(
        evidenceManagement.connect(user).registerOrganization(
          "Fake Org",
          0,
          user.address
        )
      ).to.be.reverted;
    });

    it("Should get all organizations", async function () {
      await evidenceManagement.registerOrganization("Metro Police", 0, lawEnforcement.address);
      await evidenceManagement.registerOrganization("State Lab", 1, forensicLab.address);

      const orgs = await evidenceManagement.getAllOrganizations();
      expect(orgs.length).to.equal(2);
      expect(orgs[0].name).to.equal("Metro Police");
      expect(orgs[1].name).to.equal("State Lab");
    });
  });

  describe("Evidence Collection", function () {
    beforeEach(async function () {
      // Setup: Register and verify law enforcement
      await evidenceManagement.registerOrganization(
        "Metro Police",
        0,
        lawEnforcement.address
      );
      await evidenceManagement.verifyOrganization(1);
    });

    it("Should allow law enforcement to collect evidence", async function () {
      const tx = await evidenceManagement.connect(lawEnforcement).collectEvidence(
        "CASE-001",
        "Laptop hard drive",
        "Digital",
        "QmTestHash123",
        "Evidence Room 5"
      );

      const receipt = await tx.wait();
      const event = receipt.logs.find(log => {
        try {
          return evidenceManagement.interface.parseLog(log).name === 'EvidenceCollected';
        } catch {
          return false;
        }
      });

      expect(event).to.not.be.undefined;
    });

    it("Should not allow non-law enforcement to collect evidence", async function () {
      await expect(
        evidenceManagement.connect(user).collectEvidence(
          "CASE-001",
          "Test evidence",
          "Digital",
          "QmTestHash",
          "Location"
        )
      ).to.be.reverted;
    });

    it("Should create chain of custody entry on collection", async function () {
      await evidenceManagement.connect(lawEnforcement).collectEvidence(
        "CASE-001",
        "Test evidence",
        "Digital",
        "QmTestHash",
        "Location"
      );

      const custody = await evidenceManagement.getChainOfCustody(1);
      expect(custody.length).to.equal(1);
      expect(custody[0].action).to.equal("Evidence Collected");
    });
  });

  describe("Evidence Transfer", function () {
    beforeEach(async function () {
      // Setup organizations
      await evidenceManagement.registerOrganization("Metro Police", 0, lawEnforcement.address);
      await evidenceManagement.verifyOrganization(1);
      await evidenceManagement.registerOrganization("State Lab", 1, forensicLab.address);
      await evidenceManagement.verifyOrganization(2);

      // Collect evidence
      await evidenceManagement.connect(lawEnforcement).collectEvidence(
        "CASE-001",
        "Test evidence",
        "Digital",
        "QmTestHash",
        "Location"
      );
    });

    it("Should transfer evidence between verified organizations", async function () {
      await evidenceManagement.connect(lawEnforcement).transferEvidence(
        1,
        forensicLab.address,
        "Sending for analysis"
      );

      const custody = await evidenceManagement.getChainOfCustody(1);
      expect(custody.length).to.equal(2);
      expect(custody[1].action).to.equal("Evidence Transferred");
    });

    it("Should not allow transfer to unverified organization", async function () {
      await expect(
        evidenceManagement.connect(lawEnforcement).transferEvidence(
          1,
          user.address,
          "Test"
        )
      ).to.be.reverted;
    });
  });

  describe("Evidence Status Updates", function () {
    beforeEach(async function () {
      await evidenceManagement.registerOrganization("State Lab", 1, forensicLab.address);
      await evidenceManagement.verifyOrganization(1);
      await evidenceManagement.registerOrganization("Metro Police", 0, lawEnforcement.address);
      await evidenceManagement.verifyOrganization(2);

      await evidenceManagement.connect(lawEnforcement).collectEvidence(
        "CASE-001",
        "Test evidence",
        "Digital",
        "QmTestHash",
        "Location"
      );
    });

    it("Should update evidence status", async function () {
      await evidenceManagement.connect(forensicLab).updateEvidenceStatus(
        1,
        1, // UnderAnalysis
        "Starting analysis"
      );

      const evidence = await evidenceManagement.evidences(1);
      expect(evidence.status).to.equal(1);
    });

    it("Should record status update in custody chain", async function () {
      await evidenceManagement.connect(forensicLab).updateEvidenceStatus(
        1,
        1,
        "Starting analysis"
      );

      const custody = await evidenceManagement.getChainOfCustody(1);
      expect(custody.length).to.be.greaterThan(1);
      expect(custody[custody.length - 1].action).to.equal("Evidence Under Analysis");
    });
  });

  describe("Evidence Verification", function () {
    beforeEach(async function () {
      await evidenceManagement.registerOrganization("Metro Police", 0, lawEnforcement.address);
      await evidenceManagement.verifyOrganization(1);

      await evidenceManagement.connect(lawEnforcement).collectEvidence(
        "CASE-001",
        "Test evidence",
        "Digital",
        "QmTestHash123",
        "Location"
      );
    });

    it("Should verify evidence integrity with correct hash", async function () {
      const isValid = await evidenceManagement.verifyEvidenceIntegrity(
        1,
        "QmTestHash123"
      );
      expect(isValid).to.be.true;
    });

    it("Should detect tampered evidence with wrong hash", async function () {
      const isValid = await evidenceManagement.verifyEvidenceIntegrity(
        1,
        "QmWrongHash"
      );
      expect(isValid).to.be.false;
    });
  });

  describe("Evidence Destruction", function () {
    beforeEach(async function () {
      await evidenceManagement.registerOrganization("Metro Police", 0, lawEnforcement.address);
      await evidenceManagement.verifyOrganization(1);

      await evidenceManagement.connect(lawEnforcement).collectEvidence(
        "CASE-001",
        "Test evidence",
        "Digital",
        "QmTestHash",
        "Location"
      );
    });

    it("Should allow admin to destroy evidence", async function () {
      await evidenceManagement.destroyEvidence(1, "Court order");

      const evidence = await evidenceManagement.evidences(1);
      expect(evidence.isActive).to.be.false;
      expect(evidence.status).to.equal(5); // Destroyed
    });

    it("Should not allow non-admin to destroy evidence", async function () {
      await expect(
        evidenceManagement.connect(user).destroyEvidence(1, "Test")
      ).to.be.reverted;
    });
  });

  describe("Case Evidence Retrieval", function () {
    beforeEach(async function () {
      await evidenceManagement.registerOrganization("Metro Police", 0, lawEnforcement.address);
      await evidenceManagement.verifyOrganization(1);

      // Collect multiple evidence items for same case
      await evidenceManagement.connect(lawEnforcement).collectEvidence(
        "CASE-001",
        "Evidence 1",
        "Digital",
        "QmHash1",
        "Location 1"
      );

      await evidenceManagement.connect(lawEnforcement).collectEvidence(
        "CASE-001",
        "Evidence 2",
        "Physical",
        "QmHash2",
        "Location 2"
      );

      await evidenceManagement.connect(lawEnforcement).collectEvidence(
        "CASE-002",
        "Evidence 3",
        "Digital",
        "QmHash3",
        "Location 3"
      );
    });

    it("Should retrieve all evidence for a specific case", async function () {
      const caseEvidence = await evidenceManagement.getEvidenceByCase("CASE-001");
      expect(caseEvidence.length).to.equal(2);
      expect(caseEvidence[0].caseId).to.equal("CASE-001");
      expect(caseEvidence[1].caseId).to.equal("CASE-001");
    });

    it("Should return empty array for non-existent case", async function () {
      const caseEvidence = await evidenceManagement.getEvidenceByCase("CASE-999");
      expect(caseEvidence.length).to.equal(0);
    });
  });

  describe("Statistics", function () {
    it("Should return correct evidence count", async function () {
      await evidenceManagement.registerOrganization("Metro Police", 0, lawEnforcement.address);
      await evidenceManagement.verifyOrganization(1);

      expect(await evidenceManagement.getEvidenceCount()).to.equal(0);

      await evidenceManagement.connect(lawEnforcement).collectEvidence(
        "CASE-001", "Evidence 1", "Digital", "QmHash1", "Location 1"
      );

      expect(await evidenceManagement.getEvidenceCount()).to.equal(1);

      await evidenceManagement.connect(lawEnforcement).collectEvidence(
        "CASE-002", "Evidence 2", "Digital", "QmHash2", "Location 2"
      );

      expect(await evidenceManagement.getEvidenceCount()).to.equal(2);
    });

    it("Should return correct organization count", async function () {
      expect(await evidenceManagement.getOrganizationCount()).to.equal(0);

      await evidenceManagement.registerOrganization("Org 1", 0, lawEnforcement.address);
      expect(await evidenceManagement.getOrganizationCount()).to.equal(1);

      await evidenceManagement.registerOrganization("Org 2", 1, forensicLab.address);
      expect(await evidenceManagement.getOrganizationCount()).to.equal(2);
    });
  });
});
