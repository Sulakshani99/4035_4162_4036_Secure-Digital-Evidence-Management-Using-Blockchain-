const hre = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Starting deployment of EvidenceManagement contract...\n");

  // Get the deployer account
  const [deployer] = await hre.ethers.getSigners();
  console.log("📝 Deploying contracts with account:", deployer.address);
  
  // Get account balance
  const balance = await hre.ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", hre.ethers.formatEther(balance), "ETH\n");

  // Deploy the contract
  console.log("📦 Deploying EvidenceManagement contract...");
  const EvidenceManagement = await hre.ethers.getContractFactory("EvidenceManagement");
  const evidenceManagement = await EvidenceManagement.deploy();

  await evidenceManagement.waitForDeployment();
  const contractAddress = await evidenceManagement.getAddress();

  console.log("✅ EvidenceManagement deployed to:", contractAddress);
  console.log("⛓️  Network:", hre.network.name);
  console.log("🔗 Block number:", await hre.ethers.provider.getBlockNumber());
  
  // Save contract address and ABI to frontend
  const contractsDir = path.join(__dirname, "..", "frontend", "src", "contracts");
  
  if (!fs.existsSync(contractsDir)) {
    fs.mkdirSync(contractsDir, { recursive: true });
  }

  // Save contract address
  fs.writeFileSync(
    path.join(contractsDir, "contract-address.json"),
    JSON.stringify({ EvidenceManagement: contractAddress }, null, 2)
  );

  // Save ABI
  const artifact = await hre.artifacts.readArtifact("EvidenceManagement");
  fs.writeFileSync(
    path.join(contractsDir, "EvidenceManagement.json"),
    JSON.stringify(artifact, null, 2)
  );

  console.log("\n✨ Contract artifacts saved to frontend/src/contracts/");
  console.log("\n📋 Deployment Summary:");
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
  console.log("Contract Address:", contractAddress);
  console.log("Network:", hre.network.name);
  console.log("Deployer:", deployer.address);
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n");

  // Verify contract on Etherscan (if not on hardhat network)
  if (hre.network.name !== "hardhat" && hre.network.name !== "localhost") {
    console.log("⏳ Waiting for block confirmations before verification...");
    await evidenceManagement.deploymentTransaction().wait(6);
    
    console.log("🔍 Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: contractAddress,
        constructorArguments: [],
      });
      console.log("✅ Contract verified on Etherscan");
    } catch (error) {
      console.log("❌ Verification failed:", error.message);
    }
  }

  console.log("\n🎉 Deployment completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:");
    console.error(error);
    process.exit(1);
  });
