# 🚀 Quick Start Guide

## Secure Digital Evidence Management Using Blockchain

### ⚡ Fast Setup (5 minutes)

#### 1. Install Dependencies

```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

#### 2. Start Local Blockchain

```bash
# Terminal 1
npm run node
```

Keep this terminal open. You'll see 20 test accounts with private keys.

#### 3. Deploy Smart Contract

```bash
# Terminal 2
npm run deploy:localhost
```

Contract will be deployed and artifacts saved to `frontend/src/contracts/`

#### 4. Configure MetaMask

1. Open MetaMask browser extension
2. Add network manually:
   - Network Name: `Hardhat Local`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `1337`
   - Currency Symbol: `ETH`

3. Import account:
   - Copy private key from Terminal 1 (Account #0 is admin by default)
   - Click "Import Account" in MetaMask
   - Paste private key

#### 5. Start Frontend

```bash
# Terminal 3
npm run frontend
```

Application opens at `http://localhost:3000`

#### 6. Connect & Use

1. Click "Connect MetaMask" button
2. Approve connection in MetaMask
3. You're connected as Administrator!

---

## 📋 Test Scenario Walkthrough

### Scenario: Complete Evidence Lifecycle

#### Step 1: Setup Organizations (Admin Role)

Using **Account #0** (Admin):

1. **Register Law Enforcement Agency**:
   - Name: "Metropolitan Police"
   - Type: "Law Enforcement"
   - Wallet: Copy address of Account #1 from Terminal 1
   - Click "Register Organization"
   - Confirm transaction in MetaMask

2. **Verify Law Enforcement**:
   - Click "Verify" button next to the organization
   - Confirm transaction
   - Organization now has LAW_ENFORCEMENT_ROLE

3. **Register Forensic Lab**:
   - Name: "State Forensic Laboratory"
   - Type: "Forensic Lab"
   - Wallet: Copy address of Account #2
   - Register and Verify

4. **Register Court**:
   - Name: "District Court"
   - Type: "Court"
   - Wallet: Copy address of Account #3
   - Register and Verify

#### Step 2: Collect Evidence (Law Enforcement)

Switch to **Account #1** in MetaMask:

1. Refresh page (will show Law Enforcement Dashboard)
2. Click "Collect New Evidence"
3. Fill form:
   - Case ID: `CASE-2026-001`
   - Evidence Type: `Digital`
   - Description: `Suspect's laptop hard drive containing encrypted files`
   - Location: `Evidence Room 5, Metropolitan Police HQ`
   - File: Upload any test file
4. Click "Collect Evidence"
5. Wait for IPFS upload and blockchain transaction
6. Evidence #1 created with status "Collected"

#### Step 3: Transfer to Forensic Lab

Still as **Account #1**:

1. Find evidence in table
2. Click "Transfer"
3. Enter recipient address: (Account #2 address)
4. Enter notes: `Sending for digital forensic analysis`
5. Confirm transaction
6. Click "View Chain" to see custody transfer recorded

#### Step 4: Analyze Evidence (Forensic Lab)

Switch to **Account #2** in MetaMask:

1. Refresh page (shows Forensic Lab Dashboard)
2. Find Evidence #1
3. Click "Start Analysis"
4. Enter notes: `Beginning data extraction and analysis`
5. Status updates to "Under Analysis"
6. After "analysis", click "Complete Analysis"
7. Enter notes: `Found relevant digital evidence. Analysis complete.`
8. Status updates to "Analyzed"

#### Step 5: Court Proceedings (Court)

Switch to **Account #3** in MetaMask:

1. Refresh page (shows Court Dashboard)
2. Search by Case ID: `CASE-2026-001`
3. Click "Verify" to check evidence integrity
4. Click "View Chain" to see complete custody history
5. Click "Present" to mark as presented in court
6. Enter notes: `Presented as Exhibit A in trial`
7. Status updates to "In Court"
8. After trial, click "Archive"
9. Enter notes: `Trial concluded, archiving evidence`
10. Status updates to "Archived"

---

## 🎯 Key Features Demonstrated

✅ **Role-Based Access Control**: Different dashboards for each role  
✅ **Chain of Custody**: Complete audit trail viewable  
✅ **Tamper-Proof Storage**: IPFS hash stored on blockchain  
✅ **Integrity Verification**: Hash comparison ensures no tampering  
✅ **Immutable Records**: All transactions permanent on blockchain  
✅ **Multi-Organization Workflow**: Evidence flows through ecosystem  

---

## 🐛 Troubleshooting

### MetaMask Not Connecting

- Ensure you're on the correct network (Hardhat Local)
- Check if Hardhat node is running in Terminal 1
- Try disconnecting and reconnecting MetaMask

### Transaction Failing

- Check if account has ETH (test accounts start with 10000 ETH)
- Ensure you have the required role for the operation
- Check browser console for error messages

### Frontend Not Loading

- Ensure contract is deployed (`npm run deploy:localhost`)
- Check if `frontend/src/contracts/contract-address.json` exists
- Clear browser cache and reload

### IPFS Upload Failing

IPFS is optional for testing. The system will use simulated hashes if IPFS is not available.

To use real IPFS:
```bash
# Install IPFS Desktop from: https://ipfs.io/#install
# Or use IPFS daemon:
ipfs daemon
```

---

## 📊 Test Data Examples

### Case IDs
- `CASE-2026-001` - Cybercrime Investigation
- `CASE-2026-002` - Fraud Case
- `CASE-2026-003` - Data Breach Investigation

### Evidence Types
- Digital, Physical, Document, Video, Audio, Photo

### Sample Descriptions
- "Suspect's smartphone containing chat logs"
- "Hard drive with encrypted database files"
- "USB drive found at crime scene"
- "CCTV footage from incident location"
- "Email server backup with relevant communications"

---

## 🎓 Learning Objectives Achieved

After completing this walkthrough, you've learned:

1. ✅ How to deploy smart contracts on local blockchain
2. ✅ How to interact with blockchain using MetaMask
3. ✅ Role-based access control in DApps
4. ✅ State management across blockchain transactions
5. ✅ Event-driven architecture in Web3
6. ✅ IPFS integration for decentralized storage
7. ✅ Complete DApp development workflow

---

## 🚀 Next Steps

1. **Explore Admin Features**: Try destroying evidence
2. **Test Multiple Cases**: Create various evidence types
3. **Chain of Custody**: View detailed history for each evidence
4. **Integrity Checks**: Test verification with modified hashes
5. **Deploy to Testnet**: Try Sepolia deployment for public access

---

## 📝 Quick Commands Reference

```bash
# Compile contracts
npm run compile

# Start local node
npm run node

# Deploy locally
npm run deploy:localhost

# Deploy to Sepolia
npm run deploy:sepolia

# Start frontend
npm run frontend

# Install frontend dependencies
npm run frontend:install

# Build frontend for production
npm run frontend:build
```

---

## 💡 Tips for Presentation

1. **Preparation**: Have all terminals running before demo
2. **MetaMask**: Keep multiple accounts imported and ready
3. **Test Data**: Prepare case IDs and descriptions beforehand
4. **Chain of Custody**: Show timeline view for dramatic effect
5. **Integrity Check**: Demonstrate tamper detection

---

**Happy Testing! 🎉**

For detailed documentation, see [README.md](README.md)
