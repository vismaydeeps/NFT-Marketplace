// scripts/deploy.js
const hre = require("hardhat");

async function main() {
  // Deploy the NFTMarketplace
  const NFTMarketplace = await hre.ethers.getContractFactory("NFTMarketplace");
  const marketplace = await NFTMarketplace.deploy();
  await marketplace.deployed();

  console.log("NFTMarketplace deployed to:", marketplace.address);

  // Save the contract addresses for future reference
  const addresses = {
    NFTMarketplace: marketplace.address,
  };

  // Save contract address to a file
  const fs = require("fs");
  fs.writeFileSync('deployedAddresses.json', JSON.stringify(addresses, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });