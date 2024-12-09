// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

import "hardhat/console.sol";

contract NFTMarketPlace is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    Counters.Counter private _itemsSold;

    uint256 listingPrice = 0.025 ether;
    address payable owner;

    mapping(uint256 => MarketItem) private idToMarketItem;

    struct MarketItem {
        uint256 tokenId;
        address payable seller;
        address payable owner;
        uint256 price;
        bool sold;
    }

    struct Auction {
        uint256 auctionEndTime;
        uint256 highestBid;
        address payable highestBidder;
        string metadataHash;
    }

    mapping(uint256 => Auction) public auctions;
    struct Item {
        address owner;
        address seller;
        bool sold;
        uint256 price;
        // Add other properties as needed
    }

    mapping(uint256 => Item) public items;

    event AuctionBidPlaced(
        uint256 indexed tokenId,
        address bidder,
        uint256 amount
    );
    event AuctionEnded(uint256 indexed tokenId, address winner, uint256 amount);

    event MarketItemCreated(
        uint256 indexed tokenId,
        address seller,
        address owner,
        uint256 price,
        bool sold
    );

    constructor() ERC721("Metaverse Tokens", "METT") {
        owner = payable(msg.sender);
    }

    /* Updates the listing price of the contract */
    function updateListingPrice(uint256 _listingPrice) public payable {
        require(
            owner == msg.sender,
            "Only marketplace owner can update listing price."
        );
        listingPrice = _listingPrice;
    }

    /* Returns the listing price of the contract */
    function getListingPrice() public view returns (uint256) {
        return listingPrice;
    }

    /* Mints a token and lists it in the marketplace */
    function createToken(string memory tokenURI, uint256 price)
        public
        payable
        returns (uint256)
    {
        _tokenIds.increment();
        uint256 newTokenId = _tokenIds.current();

        _mint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        createMarketItem(newTokenId, price);
        return newTokenId;
    }

    function createMarketItem(uint256 tokenId, uint256 price) private {
        require(price > 0, "Price must be at least 1 wei");
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );

        idToMarketItem[tokenId] = MarketItem(
            tokenId,
            payable(msg.sender),
            payable(address(this)),
            price,
            false
        );

        _transfer(msg.sender, address(this), tokenId);
        emit MarketItemCreated(
            tokenId,
            msg.sender,
            address(this),
            price,
            false
        );
    }

    /* allows someone to resell a token they have purchased */
    function resellToken(uint256 tokenId, uint256 price) public payable {
        require(
            idToMarketItem[tokenId].owner == msg.sender,
            "Only item owner can perform this operation"
        );
        require(
            msg.value == listingPrice,
            "Price must be equal to listing price"
        );
        idToMarketItem[tokenId].sold = false;
        idToMarketItem[tokenId].price = price;
        idToMarketItem[tokenId].seller = payable(msg.sender);
        idToMarketItem[tokenId].owner = payable(address(this));
        _itemsSold.decrement();

        _transfer(msg.sender, address(this), tokenId);
    }

    /* Creates the sale of a marketplace item */
    /* Transfers ownership of the item, as well as funds between parties */
    function createMarketSale(uint256 tokenId) public payable {
        uint256 price = idToMarketItem[tokenId].price;
        require(
            msg.value == price,
            "Please submit the asking price in order to complete the purchase"
        );
        payable(owner).transfer(listingPrice);
        payable(idToMarketItem[tokenId].seller).transfer(msg.value);
        idToMarketItem[tokenId].owner = payable(msg.sender);
        idToMarketItem[tokenId].sold = true;
        idToMarketItem[tokenId].seller = payable(address(0));
        _itemsSold.increment();
        _transfer(address(this), msg.sender, tokenId);
    }

    /* Returns all unsold market items */
    function fetchMarketItems() public view returns (MarketItem[] memory) {
        uint256 itemCount = _tokenIds.current();
        uint256 unsoldItemCount = _tokenIds.current() - _itemsSold.current();
        uint256 currentIndex = 0;

        MarketItem[] memory items = new MarketItem[](unsoldItemCount);
        for (uint256 i = 0; i < itemCount; i++) {
            if (idToMarketItem[i + 1].owner == address(this)) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns only items that a user has purchased */
    function fetchMyNFTs() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].owner == msg.sender) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    /* Returns only items a user has listed */
    function fetchItemsListed() public view returns (MarketItem[] memory) {
        uint256 totalItemCount = _tokenIds.current();
        uint256 itemCount = 0;
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                itemCount += 1;
            }
        }

        MarketItem[] memory items = new MarketItem[](itemCount);
        for (uint256 i = 0; i < totalItemCount; i++) {
            if (idToMarketItem[i + 1].seller == msg.sender) {
                uint256 currentId = i + 1;
                MarketItem storage currentItem = idToMarketItem[currentId];
                items[currentIndex] = currentItem;
                currentIndex += 1;
            }
        }
        return items;
    }

    // partially working stuff

    function startAuction(
        uint256 tokenId,
        uint256 startingBid,
        uint256 duration,
        string calldata url
    ) public {
        require(!items[tokenId].sold, "Item already sold");

        auctions[tokenId] = Auction({
            auctionEndTime: block.timestamp + duration,
            highestBid: startingBid,
            highestBidder: payable(address(0)),
            metadataHash: url
        });
    }

    function placeBid(uint256 tokenId) external payable {
        Auction storage auction = auctions[tokenId];
        require(block.timestamp < auction.auctionEndTime, "Auction ended");
        require(
            msg.value > auction.highestBid,
            "There already is a higher bid"
        );

        // if (auction.highestBid > 0) {
        //     payable(auction.highestBidder).transfer(auction.highestBid); // Refund previous bidder
        // }

        auction.highestBid = msg.value;
        auction.highestBidder = payable(msg.sender);
    }

    function endAuction(uint256 tokenId) public {
        // address seller = idToMarketItem[tokenId].seller;
        Auction storage auction = auctions[tokenId];
        uint256 price = auction.highestBid;

        require(!idToMarketItem[tokenId].sold, "Auction has already ended");

        address payable seller = idToMarketItem[tokenId].seller;
        payable(idToMarketItem[tokenId].seller).transfer(auction.highestBid); // Refund previous bidder

        // Mark the auction as ended
        // idToMarketItem[tokenId].owner = payable(msg.sender);
        idToMarketItem[tokenId].owner = payable(auction.highestBidder);
        idToMarketItem[tokenId].sold = true;
        idToMarketItem[tokenId].seller = payable(address(0));
        idToMarketItem[tokenId].price = price;
        _itemsSold.increment();

        // Transfer ownership of the token from the contract to the highest bidder (msg.sender in this case)

        _transfer(address(this), auction.highestBidder, tokenId);
        delete auctions[tokenId];
        // Clean up auction-related data (optional, based on your contract design)
    }

    function fetchAuctions()
        public
        view
        returns (MarketItem[] memory, Auction[] memory)
    {
        uint256 itemCount = _tokenIds.current();
        uint256 auctionCount = 0;

        // Count active auctions
        for (uint256 i = 0; i < itemCount; i++) {
            uint256 tokenId = i + 1;
            if (auctions[tokenId].auctionEndTime > block.timestamp) {
                auctionCount += 1;
            }
        }

        // Prepare arrays for active auctions
        MarketItem[] memory marketItems = new MarketItem[](auctionCount);
        Auction[] memory activeAuctions = new Auction[](auctionCount);
        uint256 currentIndex = 0;

        for (uint256 i = 0; i < itemCount; i++) {
            uint256 tokenId = i + 1;
            Auction storage auction = auctions[tokenId];

            if (auction.auctionEndTime > block.timestamp) {
                marketItems[currentIndex] = idToMarketItem[tokenId];
                activeAuctions[currentIndex] = auction;
                currentIndex += 1;
            }
        }

        return (marketItems, activeAuctions);
    }

    function transferNFT(uint256 tokenId,address sender, address recvAdd) public {
        idToMarketItem[tokenId].owner = payable(recvAdd);
        idToMarketItem[tokenId].sold = true;
        idToMarketItem[tokenId].seller = payable(address(0));
        // _itemsSold.increment();
        // _transfer(address(this), recvAdd, tokenId);
        _transfer(sender, recvAdd, tokenId);

    }

    function tradeNFT(
        address add1,
        uint256 token1,
        address add2,
        uint256 token2
    ) public {
        idToMarketItem[token1].owner = payable(add2);
        idToMarketItem[token1].sold = true;
        idToMarketItem[token1].seller = payable(address(0));
        // _itemsSold.increment();
        _transfer(add1, add2, token1);

        idToMarketItem[token2].owner = payable(add1);
        idToMarketItem[token2].sold = true;
        idToMarketItem[token2].seller = payable(address(0));
        // _itemsSold.increment();
        _transfer(add2, add1, token2);
    }
}
