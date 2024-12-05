// // SPDX-License-Identifier: MIT
// pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
// import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
// import "@openzeppelin/contracts/utils/Counters.sol";
// import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

// contract NFTMarketplace is ERC721URIStorage, ReentrancyGuard {
//     using Counters for Counters.Counter;
    
//     Counters.Counter private _tokenIds;
//     Counters.Counter private _itemsSold;
    
//     address payable owner;
//     uint256 listingPrice = 0.025 ether;
    
//     struct MarketItem {
//         uint256 tokenId;
//         address payable seller;
//         address payable owner;
//         uint256 price;
//         bool sold;
//         bool isAuction;
//         uint256 auctionEndTime;
//         address highestBidder;
//         uint256 highestBid;
//     }
    
//     mapping(uint256 => MarketItem) private idToMarketItem;
//     mapping(uint256 => mapping(address => uint256)) private pendingReturns;
    
//     event MarketItemCreated(
//         uint256 indexed tokenId,
//         address seller,
//         address owner,
//         uint256 price,
//         bool sold
//     );
    
//     event AuctionCreated(
//         uint256 indexed tokenId,
//         uint256 startingPrice,
//         uint256 duration
//     );
    
//     event BidPlaced(
//         uint256 indexed tokenId,
//         address bidder,
//         uint256 amount
//     );
    
//     event AuctionEnded(
//         uint256 indexed tokenId,
//         address winner,
//         uint256 amount
//     );
    
//     constructor() ERC721("NFT Marketplace", "NFTM") {
//         owner = payable(msg.sender);
//     }
    
//     // Update listing price
//     function updateListingPrice(uint256 _listingPrice) public payable {
//         require(owner == msg.sender, "Only marketplace owner can update listing price");
//         listingPrice = _listingPrice;
//     }
    
//     function getListingPrice() public view returns (uint256) {
//         return listingPrice;
//     }
    
//     // Mint new NFT
//     function createToken(string memory tokenURI, uint256 price) public payable returns (uint256) {
//         require(price > 0, "Price must be greater than 0");
//         require(msg.value == listingPrice, "Price must be equal to listing price");
        
//         _tokenIds.increment();
//         uint256 newTokenId = _tokenIds.current();
        
//         _mint(msg.sender, newTokenId);
//         _setTokenURI(newTokenId, tokenURI);
//         createMarketItem(newTokenId, price);
        
//         return newTokenId;
//     }
    
//     // Create market item
//     function createMarketItem(uint256 tokenId, uint256 price) private {
//         require(price > 0, "Price must be greater than 0");
        
//         idToMarketItem[tokenId] = MarketItem(
//             tokenId,
//             payable(msg.sender),
//             payable(address(this)),
//             price,
//             false,
//             false,
//             0,
//             address(0),
//             0
//         );
        
//         _transfer(msg.sender, address(this), tokenId);
//         emit MarketItemCreated(tokenId, msg.sender, address(this), price, false);
//     }
    
//     // Buy NFT
//     function createMarketSale(uint256 tokenId) public payable nonReentrant {
//         require(!idToMarketItem[tokenId].isAuction, "Item is in auction");
//         uint256 price = idToMarketItem[tokenId].price;
//         require(msg.value == price, "Please submit the asking price");
        
//         idToMarketItem[tokenId].seller.transfer(msg.value);
//         _transfer(address(this), msg.sender, tokenId);
//         idToMarketItem[tokenId].owner = payable(msg.sender);
//         idToMarketItem[tokenId].sold = true;
//         _itemsSold.increment();
//         payable(owner).transfer(listingPrice);
//     }
    
//     // Resell NFT
//     function resellToken(uint256 tokenId, uint256 price) public payable {
//         require(idToMarketItem[tokenId].owner == msg.sender, "Only item owner can perform this operation");
//         require(msg.value == listingPrice, "Price must be equal to listing price");
        
//         idToMarketItem[tokenId].sold = false;
//         idToMarketItem[tokenId].price = price;
//         idToMarketItem[tokenId].seller = payable(msg.sender);
//         idToMarketItem[tokenId].owner = payable(address(this));
        
//         _itemsSold.decrement();
//         _transfer(msg.sender, address(this), tokenId);
//     }
    
//     // Create auction
//     function createAuction(uint256 tokenId, uint256 startingPrice, uint256 duration) public {
//         require(msg.sender == idToMarketItem[tokenId].seller, "Only seller can start auction");
//         require(!idToMarketItem[tokenId].isAuction, "Already in auction");
        
//         idToMarketItem[tokenId].isAuction = true;
//         idToMarketItem[tokenId].price = startingPrice;
//         idToMarketItem[tokenId].auctionEndTime = block.timestamp + duration;
        
//         emit AuctionCreated(tokenId, startingPrice, duration);
//     }
    
//     // Place bid
//     function placeBid(uint256 tokenId) public payable {
//         MarketItem storage item = idToMarketItem[tokenId];
//         require(item.isAuction, "Not an auction");
//         require(block.timestamp <= item.auctionEndTime, "Auction ended");
//         require(msg.value > item.highestBid, "Bid not high enough");
        
//         if (item.highestBidder != address(0)) {
//             pendingReturns[tokenId][item.highestBidder] += item.highestBid;
//         }
        
//         item.highestBidder = msg.sender;
//         item.highestBid = msg.value;
        
//         emit BidPlaced(tokenId, msg.sender, msg.value);
//     }
    
//     // End auction
//     function endAuction(uint256 tokenId) public {
//         MarketItem storage item = idToMarketItem[tokenId];
//         require(item.isAuction, "Not an auction");
//         require(block.timestamp > item.auctionEndTime, "Auction not yet ended");
        
//         if (item.highestBidder != address(0)) {
//             _transfer(address(this), item.highestBidder, tokenId);
//             item.seller.transfer(item.highestBid);
//             item.owner = payable(item.highestBidder);
//             item.sold = true;
//         } else {
//             _transfer(address(this), item.seller, tokenId);
//             item.owner = item.seller;
//         }
        
//         item.isAuction = false;
//         _itemsSold.increment();
        
//         emit AuctionEnded(tokenId, item.highestBidder, item.highestBid);
//     }
    
//     // Withdraw bid
//     function withdrawBid(uint256 tokenId) public {
//         uint256 amount = pendingReturns[tokenId][msg.sender];
//         if (amount > 0) {
//             pendingReturns[tokenId][msg.sender] = 0;
//             payable(msg.sender).transfer(amount);
//         }
//     }
    
//     // Transfer ownership
//     function transferOwnership(uint256 tokenId, address newOwner) public {
//         require(msg.sender == idToMarketItem[tokenId].owner, "Only owner can transfer");
//         require(newOwner != address(0), "Invalid address");
        
//         _transfer(msg.sender, newOwner, tokenId);
//         idToMarketItem[tokenId].owner = payable(newOwner);
//     }
    
//     // Fetch market items
//     function fetchMarketItems() public view returns (MarketItem[] memory) {
//         uint256 itemCount = _tokenIds.current();
//         uint256 unsoldItemCount = _tokenIds.current() - _itemsSold.current();
//         uint256 currentIndex = 0;
        
//         MarketItem[] memory items = new MarketItem[](unsoldItemCount);
//         for (uint256 i = 0; i < itemCount; i++) {
//             if (idToMarketItem[i + 1].owner == address(this)) {
//                 uint256 currentId = i + 1;
//                 MarketItem storage currentItem = idToMarketItem[currentId];
//                 items[currentIndex] = currentItem;
//                 currentIndex += 1;
//             }
//         }
//         return items;
//     }
    
//     // Fetch my NFTs
//     function fetchMyNFTs() public view returns (MarketItem[] memory) {
//         uint256 totalItemCount = _tokenIds.current();
//         uint256 itemCount = 0;
//         uint256 currentIndex = 0;
        
//         for (uint256 i = 0; i < totalItemCount; i++) {
//             if (idToMarketItem[i + 1].owner == msg.sender) {
//                 itemCount += 1;
//             }
//         }
        
//         MarketItem[] memory items = new MarketItem[](itemCount);
//         for (uint256 i = 0; i < totalItemCount; i++) {
//             if (idToMarketItem[i + 1].owner == msg.sender) {
//                 uint256 currentId = i + 1;
//                 MarketItem storage currentItem = idToMarketItem[currentId];
//                 items[currentIndex] = currentItem;
//                 currentIndex += 1;
//             }
//         }
//         return items;
//     }
// }
