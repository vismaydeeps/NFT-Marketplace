// test/NFTMarketplace.test.js
const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("NFTMarketplace", function () {
  let marketplace;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    // Get signers
    [owner, addr1, addr2] = await ethers.getSigners();

    // Deploy contract
    const NFTMarketplace = await ethers.getContractFactory("NFTMarketplace");
    marketplace = await NFTMarketplace.deploy();
    await marketplace.deployed();
  });

  it("Should create and execute market sale", async function () {
    // Get listing price
    const listingPrice = ethers.utils.parseUnits("0.025", "ether");
    
    // Create token
    const auctionPrice = ethers.utils.parseUnits("100", "ether");
    await marketplace.createToken("tokenURI", auctionPrice, { value: listingPrice });

    // Create market sale
    await marketplace.connect(addr1).createMarketSale(1, { value: auctionPrice });

    // Verify ownership
    const items = await marketplace.fetchMarketItems();
    expect(items.length).to.equal(0);
  });

  it("Should fail if price is not met", async function () {
    const listingPrice = ethers.utils.parseUnits("0.025", "ether");
    const auctionPrice = ethers.utils.parseUnits("100", "ether");
    
    await marketplace.createToken("tokenURI", auctionPrice, { value: listingPrice });

    await expect(
      marketplace.connect(addr1).createMarketSale(1, { 
        value: ethers.utils.parseUnits("50", "ether") 
      })
    ).to.be.revertedWith("Please submit the asking price");
  });
});