# 🔐 Secure Digital Evidence Management Using Blockchain

**University of Ruhuna - Faculty of Engineering**  
**EC8204: Blockchain and Cyber Security**  
**Group: 4035_4162_4036**

---

## 📋 Project Overview

A comprehensive blockchain-based Digital Evidence Management System that revolutionizes how law enforcement agencies handle digital evidence by providing tamper-proof chain of custody tracking, immutable evidence storage, and complete transparency throughout the evidence lifecycle.

### 🎯 Problem Statement

Traditional digital evidence management systems face critical challenges:
- **Tampering Risks**: Centralized systems vulnerable to data manipulation
- **Chain of Custody Issues**: Difficult to track and verify evidence handling
- **Trust Deficits**: Lack of transparency in evidence management
- **Integrity Concerns**: No guaranteed proof of evidence authenticity
- **Interoperability**: Poor coordination between law enforcement, forensic labs, and courts

### 💡 Solution

Our blockchain-based system provides:
- ✅ **Immutable Records**: Evidence data stored permanently on blockchain
- ✅ **Complete Chain of Custody**: Every evidence transfer recorded with timestamps
- ✅ **Role-Based Access**: Granular permissions for different stakeholders
- ✅ **Tamper-Proof Storage**: IPFS integration for decentralized file storage
- ✅ **Cryptographic Verification**: Hash-based integrity checking
- ✅ **100% Transparency**: All actions auditable and traceable

---

## 🏗️ Technical Architecture

### Smart Contract Stack

**Blockchain Platform**: Ethereum  
**Smart Contract Language**: Solidity 0.8.20  
**Development Framework**: Hardhat  
**Security Libraries**: OpenZeppelin Contracts v5.0.1

#### Core Smart Contract Features:

1. **Role-Based Access Control (RBAC)**
   - Administrator: System management and organization verification
   - Law Enforcement: Evidence collection and initial custody
   - Forensic Lab: Evidence analysis and status updates
   - Court: Evidence verification and court proceedings

2. **Evidence Management**
   - Collect evidence with IPFS hash reference
   - Transfer custody with full audit trail
   - Update status throughout evidence lifecycle
   - Verify evidence integrity cryptographically
   - Archive or destroy evidence with proper authorization

3. **Chain of Custody Tracking**
   - Automatic logging of all evidence interactions
   - Timestamp recording for every transaction
   - Organization attribution for accountability
   - Complete history retrieval for any evidence item

4. **Data Structures** (Gas-optimized)
   ```solidity
   struct Evidence {
     uint256 id;
     string caseId;
     string description;
     string evidenceType;
     string ipfsHash;
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
   ```

### Frontend Stack

**Framework**: React.js 18.2  
**Blockchain Integration**: Ethers.js v5.7  
**Wallet Connection**: MetaMask  
**Routing**: React Router v6  
**Notifications**: React Toastify  
**Icons**: React Icons  
**Styling**: Custom CSS with responsive design

#### Frontend Features:

1. **Multi-Role Dashboards**
   - Admin Dashboard: Organization and system management
   - Law Enforcement Dashboard: Evidence collection and transfer
   - Forensic Lab Dashboard: Evidence analysis workflow
   - Court Dashboard: Evidence verification and court presentation

2. **Real-Time Blockchain Interaction**
   - MetaMask wallet integration
   - Transaction status tracking
   - Event listening and updates
   - Gas estimation and optimization

3. **Chain of Custody Visualization**
   - Timeline-based custody display
   - Complete transaction history
   - Handler identification
   - Timestamp tracking

### Decentralized Storage

**Platform**: IPFS (InterPlanetary File System)  
**Purpose**: Store actual evidence files off-chain  
**Integration**: IPFS HTTP Client

- Evidence files uploaded to IPFS
- IPFS hash stored on blockchain
- Content-addressed storage ensures integrity
- Public gateway access for verification

---

## 🚀 Installation & Setup

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js)
- **MetaMask** browser extension - [Install from Chrome Web Store](https://metamask.io/)
- **Git** (optional, for cloning)

### Step 1: Get the Project Files

**Option A - If using Git:**
```bash
git clone <repository-url>
cd 4035_4162_4036_Secure-Digital-Evidence-Management-Using-Blockchain-
```

**Option B - If using ZIP file:**
1. Extract the ZIP file
2. Open terminal/PowerShell in the project folder

### Step 2: Install All Dependencies

**Quick Setup (Recommended):**
```bash
npm run setup
```
This command installs both backend and frontend dependencies automatically.

**Manual Setup:**
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd frontend
npm install
cd ..
```

**Expected Output:**
```
✓ Backend dependencies installed
✓ Frontend dependencies installed
```

---

## 🎮 Running the Application

### 🔥 **Method 1: Local Development (Recommended for Testing)**

Follow these steps **in order** using **3 separate terminal windows**:

#### **Terminal 1: Start Local Blockchain**

```bash
npm run node
```

**What this does:**
- Starts a local Ethereum blockchain on your computer
- Creates 20 test accounts with 10,000 ETH each
- Runs on `http://127.0.0.1:8545`

**Important:** Keep this terminal running! Don't close it.

**Expected Output:**
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========
Account #0: 0x... (10000 ETH)
Account #1: 0x... (10000 ETH)
...
```

**Copy Account #0 private key** - You'll need this for MetaMask!

---

#### **Terminal 2: Deploy Smart Contracts**

**Wait for Terminal 1 to be fully running**, then open a new terminal:

```bash
npm run deploy:localhost
```

**What this does:**
- Compiles the smart contracts
- Deploys contracts to your local blockchain
- Saves contract address and ABI to `frontend/src/contracts/`

**Expected Output:**
```
🚀 Starting deployment of EvidenceManagement contract...
📝 Deploying contracts with account: 0x...
✅ EvidenceManagement deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
✨ Contract artifacts saved to frontend/src/contracts/
🎉 Deployment completed successfully!
```

**Success Indicator:** You should see files created in `frontend/src/contracts/` folder

---

#### **Terminal 3: Start Frontend Application**

```bash
npm run frontend
```

**What this does:**
- Starts the React development server
- Opens the web application

**Expected Output:**
```
Compiled successfully!

You can now view the app in the browser.

  Local:            http://localhost:3000
  On Your Network:  http://192.168.x.x:3000
```

**The browser should automatically open** at `http://localhost:3000`

---

### 🦊 **Configure MetaMask**

#### Step 1: Add Hardhat Network to MetaMask

1. **Open MetaMask** extension in your browser
2. Click on **Network dropdown** (top center)
3. Click **"Add Network"** → **"Add a network manually"**
4. Enter the following details:

   ```
   Network Name:     Hardhat Local
   New RPC URL:      http://127.0.0.1:8545
   Chain ID:         31337
   Currency Symbol:  ETH
   ```

5. Click **"Save"**
6. **Switch to "Hardhat Local" network**

#### Step 2: Import Test Account

1. In MetaMask, click on **account icon** (top right)
2. Click **"Import Account"**
3. Select **"Private Key"**
4. **Paste the private key** from Terminal 1 (Account #0)
5. Click **"Import"**

**You should now see 10,000 ETH in your account!**

#### Step 3: Import Additional Accounts (Optional)

For testing different roles, import more accounts:
- **Account #1** - For Law Enforcement
- **Account #2** - For Forensic Lab  
- **Account #3** - For Court

Repeat the import process with their private keys from Terminal 1.

---

### 🎯 **Using the Application**

#### First Time Setup:

1. **Open the application** at `http://localhost:3000`

2. **Click "Connect MetaMask"** button

3. **Approve the connection** in MetaMask popup

4. You should see the **Admin Dashboard** (since Account #0 is admin by default)

#### Setting Up Organizations:

**As Admin (Account #0):**

1. Click **"Register New Organization"**
2. Fill in the form:
   - **Name:** Metro Police
   - **Type:** Law Enforcement
   - **Wallet Address:** (Paste Account #1 address from Terminal 1)
3. Click **"Register Organization"**
4. Approve the transaction in MetaMask
5. Click **"Verify"** next to the organization
6. Repeat for Forensic Lab (Account #2) and Court (Account #3)

#### Testing Evidence Collection:

**Switch to Law Enforcement (Account #1):**

1. In MetaMask, switch to Account #1
2. Refresh the page - you'll see **Law Enforcement Dashboard**
3. Click **"Collect New Evidence"**
4. Fill in the form:
   - **Case ID:** CASE-2026-001
   - **Evidence Type:** Digital
   - **Description:** Test evidence for demo
   - **Location:** Evidence Room 5
   - **File:** Upload any test file
5. Click **"Collect Evidence"**
6. Approve transaction in MetaMask
7. Wait for confirmation

#### Viewing Chain of Custody:

1. Find your evidence in the table
2. Click **"View Chain"** button
3. See the complete timeline of evidence handling

---

### 🛑 **Stopping the Application**

To properly shut down:

1. **Terminal 3** - Press `Ctrl + C` to stop frontend
2. **Terminal 1** - Press `Ctrl + C` to stop blockchain
3. Close all terminals

**Note:** When you restart, you'll need to:
- Start all 3 terminals again (in order)
- Redeploy contracts (Terminal 2)
- The blockchain state will be reset (fresh start)

---

## 🌐 **Method 2: Deploy to Test Network (Sepolia)**

### Prerequisites:

1. **Get Sepolia ETH:**
   - Visit: https://sepoliafaucet.com/
   - Or: https://faucet.quicknode.com/ethereum/sepolia
   - Request test ETH for your MetaMask account

2. **Get Alchemy API Key:**
   - Sign up at https://www.alchemy.com/
   - Create new app (Ethereum → Sepolia)
   - Copy the API key

### Configuration:

1. **Create `.env` file** in project root:
   ```env
   SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
   PRIVATE_KEY=your_metamask_private_key_here
   ETHERSCAN_API_KEY=optional_for_verification
   ```

2. **Deploy to Sepolia:**
   ```bash
   npm run deploy:sepolia
   ```

3. **Update Frontend:**
   - Copy deployed contract address from terminal
   - Update `frontend/src/contracts/contract-address.json`

4. **Configure MetaMask:**
   - Switch to Sepolia Test Network
   - Ensure you have test ETH

5. **Start Frontend:**
   ```bash
   npm run frontend
   ```

**Advantages:**
- ✅ Persistent deployment (data not lost on restart)
- ✅ Publicly accessible
- ✅ Real network experience

**Disadvantages:**
- ❌ Requires test ETH (free but need faucet)
- ❌ Slower transactions (15-30 seconds)
- ❌ Gas costs (free test ETH but limited)

---

## 🧪 **Testing Smart Contracts**

Run the test suite to verify everything works:

```bash
npm run test
```

**Expected Output:**
```
  EvidenceManagement
    Deployment
      ✓ Should set the deployer as admin
    Organization Management
      ✓ Should register and verify organizations
      ✓ Should not allow non-admin to register
    Evidence Collection
      ✓ Should allow law enforcement to collect evidence
      ✓ Should create chain of custody entry
    ...

  20 passing (2s)
```

---

## 🔧 **Troubleshooting**

### Problem: "Cannot connect to MetaMask"

**Solution:**
1. Ensure MetaMask is installed
2. Check you're on the correct network (Hardhat Local)
3. Try refreshing the page
4. Check Terminal 1 is still running

### Problem: "Transaction Failed"

**Solution:**
1. Ensure account has ETH (check MetaMask balance)
2. Verify you have the required role for the action
3. Check Terminal 1 for error messages
4. Try resetting MetaMask (Settings → Advanced → Reset Account)

### Problem: "Contract not deployed"

**Solution:**
1. Check Terminal 2 completed successfully
2. Verify `frontend/src/contracts/contract-address.json` exists
3. Restart all terminals and redeploy
4. Check `frontend/src/contracts/EvidenceManagement.json` has content

### Problem: "IPFS upload fails"

**Solution:**
- The system automatically uses simulated IPFS hashes for testing
- No action needed - evidence will still be recorded
- For real IPFS: Install IPFS Desktop from https://ipfs.io/

### Problem: "Port 3000 already in use"

**Solution:**
```bash
# Kill the process using port 3000
# On Windows PowerShell:
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process

# On Linux/Mac:
kill -9 $(lsof -t -i:3000)
```

### Problem: "npm install fails"

**Solution:**
1. Delete `node_modules` and `package-lock.json`
2. Run `npm install` again
3. Ensure you have Node.js v16 or higher: `node --version`
4. Try using `npm install --legacy-peer-deps`

---

## 📝 **Quick Command Reference**

```bash
# Setup
npm run setup                  # Install all dependencies

# Development
npm run node                   # Start local blockchain
npm run deploy:localhost       # Deploy to local network
npm run frontend               # Start React app
npm run test                   # Run tests
npm run compile                # Compile contracts

# Deployment
npm run deploy:sepolia         # Deploy to Sepolia testnet

# Cleanup
npm run clean                  # Clean Hardhat artifacts
```

---

## ✅ **Verification Checklist**

Before using the application, verify:

- [ ] Terminal 1 shows "Started HTTP and WebSocket JSON-RPC server"
- [ ] Terminal 2 shows "Deployment completed successfully"
- [ ] Terminal 3 shows "Compiled successfully"
- [ ] Browser opened at http://localhost:3000
- [ ] MetaMask shows "Hardhat Local" network
- [ ] MetaMask account has 10,000 ETH
- [ ] Clicking "Connect MetaMask" works
- [ ] Admin dashboard is visible

---

## 📱 Usage Guide

### For Administrators

1. **Connect MetaMask** with admin account
2. **Register Organizations**:
   - Click "Register New Organization"
   - Enter organization name, type, and wallet address
   - Submit transaction
3. **Verify Organizations**:
   - Find pending organization in table
   - Click "Verify" button
   - Confirm transaction (grants role automatically)

### For Law Enforcement

1. **Connect MetaMask** with verified law enforcement account
2. **Collect Evidence**:
   - Click "Collect New Evidence"
   - Fill in case ID, evidence type, description, location
   - Upload evidence file (stored on IPFS)
   - Submit transaction
3. **Transfer Evidence**:
   - Find evidence in table
   - Click "Transfer"
   - Enter recipient address and notes
   - Confirm transaction

### For Forensic Labs

1. **Connect MetaMask** with verified forensic lab account
2. **Analyze Evidence**:
   - Find collected evidence
   - Click "Start Analysis" to update status
   - Enter analysis notes
3. **Complete Analysis**:
   - Click "Complete Analysis"
   - Enter forensic findings
   - Submit transaction

### For Courts

1. **Connect MetaMask** with verified court account
2. **Search Evidence**:
   - Enter case ID in search box
   - View all evidence for the case
3. **Verify Integrity**:
   - Click "Verify" on any evidence
   - System checks IPFS hash against blockchain
4. **Present in Court**:
   - Click "Present" on analyzed evidence
   - Enter court presentation notes
5. **View Chain of Custody**:
   - Click "View Chain" to see complete history
   - Timeline shows all handlers and actions

---

## 🔒 Security Features

### Smart Contract Security

1. **Access Control**:
   - OpenZeppelin AccessControl for role management
   - Role-based function restrictions
   - Admin-only sensitive operations

2. **Data Integrity**:
   - Cryptographic hash verification
   - Immutable blockchain storage
   - Tamper-evident chain of custody

3. **Input Validation**:
   - Require statements for all critical operations
   - Address validation
   - State checks before modifications

### Frontend Security

1. **Wallet Authentication**:
   - MetaMask signature verification
   - Account change detection
   - Network validation

2. **Transaction Safety**:
   - User confirmation for all transactions
   - Gas estimation
   - Error handling and rollback

---

## 📊 Key Features Comparison

| Feature | Traditional System | Our Blockchain Solution |
|---------|-------------------|------------------------|
| **Tampering Prevention** | Vulnerable | 100% Tamper-Proof |
| **Chain of Custody** | Manual logs | Automatic & Immutable |
| **Verification Time** | Days/Weeks | < 1 second |
| **Trust Model** | Centralized | Decentralized |
| **Transparency** | Limited | Complete |
| **Data Permanence** | Deletable | Permanent |
| **Integrity Proof** | None | Cryptographic |

---

## 🎓 Educational Value

This project demonstrates:
- ✅ Smart contract development with Solidity
- ✅ Role-based access control implementation
- ✅ Integration of IPFS for decentralized storage
- ✅ Full-stack DApp development
- ✅ Blockchain security best practices
- ✅ Event-driven architecture
- ✅ Real-world blockchain application
- ✅ Gas optimization techniques

---

## 🛠️ Technology Stack Summary

**Blockchain Layer:**
- Solidity 0.8.20
- Hardhat 2.19.4
- OpenZeppelin Contracts 5.0.1
- Ethers.js 5.7.2

**Frontend Layer:**
- React.js 18.2
- React Router 6.20
- React Toastify 9.1
- React Icons 4.12

**Storage Layer:**
- IPFS HTTP Client 60.0.1
- Decentralized file storage

**Development Tools:**
- Node.js 16+
- MetaMask
- Hardhat Network
- Etherscan (verification)

---

## 📈 Project Statistics

- **Smart Contract Lines**: ~450 lines
- **Frontend Components**: 7 major components
- **Supported Roles**: 4 (Admin, Law Enforcement, Forensic Lab, Court)
- **Evidence Lifecycle Stages**: 6 statuses
- **Gas Optimized**: Yes (struct packing, efficient mappings)
- **Test Coverage**: Comprehensive unit tests available

---

## 🔮 Future Enhancements

1. **Multi-Signature Evidence Destruction**: Require multiple approvals
2. **AI-Powered Evidence Analysis**: Integration with ML models
3. **Mobile Application**: iOS and Android support
4. **Advanced Search**: Full-text search and filtering
5. **Notification System**: Real-time alerts for stakeholders
6. **Integration APIs**: Connect with existing law enforcement systems
7. **Privacy Features**: Zero-knowledge proofs for sensitive evidence
8. **Cross-Chain Support**: Deploy on multiple blockchains

---

## 👥 Team Members

**Group 4035_4162_4036**
- Member 1: [4035]
- Member 2: [4162]
- Member 3: [4036]

---

## 📄 License

MIT License - See LICENSE file for details

---

## 🙏 Acknowledgments

- University of Ruhuna - Faculty of Engineering
- EC8204 Course Instructors
- OpenZeppelin for secure smart contract libraries
- Ethereum Foundation
- IPFS Protocol Labs

---

## 📞 Support

For issues or questions:
- Create an issue in the repository
- Contact project team members
- Refer to Hardhat documentation: https://hardhat.org/
- Refer to Ethers.js documentation: https://docs.ethers.org/

---

## 🎯 Project Presentation

**Presentation File**: `GP_XX_Secure_Digital_Evidence.ppt`  
**Duration**: 3 minutes  
**Focus Areas**:
1. Problem statement and blockchain solution (30s)
2. Technical architecture and smart contracts (60s)
3. Live demo of evidence collection and chain of custody (60s)
4. Security features and impact (30s)

---

**🌟 Built with Blockchain Technology for a More Secure Future 🌟** 
