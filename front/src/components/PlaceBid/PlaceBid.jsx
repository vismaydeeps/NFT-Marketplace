import React, { useContext, useEffect, useState } from 'react';
import { NFTMarketPlaceContext } from '../../../Context/NFTMarketPlaceContext'; // Import context
import "./PlaceBid.css";

const PlaceBid = () => {
    const { fetchActiveAuctions, placeBid, claimNFT, currentAccount, uploadToIPFS } = useContext(NFTMarketPlaceContext); // Access functions from context
    const [activeAuctions, setActiveAuctions] = useState([]);
    const [bidAmount, setBidAmount] = useState("");

    useEffect(() => {
        const loadAuctions = async () => {
            const auctions = await fetchActiveAuctions();
            setActiveAuctions(auctions);
            console.log("auctions from bid", auctions);
        };
        loadAuctions();
    }, [fetchActiveAuctions]);

    const handleBid = async (tokenId) => {
        if (!bidAmount || parseFloat(bidAmount) <= 0) {
            alert("Please enter a valid bid amount.");
            return;
        }
        await placeBid(tokenId, bidAmount);
        // Optionally, refresh auctions after placing a bid
        const updatedAuctions = await fetchActiveAuctions();
        setActiveAuctions(updatedAuctions);

        // Reset bid amount after placing the bid
        setBidAmount("");
    };

    useEffect(() => {
        console.log(activeAuctions);
    }, [activeAuctions]);


    const handleClaimNFT = async (tokenId) => {
        try {
            await claimNFT(tokenId);
            // Optionally refresh auctions after claiming the NFT
            const updatedAuctions = await fetchActiveAuctions();
            setActiveAuctions(updatedAuctions);
            alert("NFT claimed successfully!");

        } catch (error) {
            console.error("Error claiming NFT:", error);
            alert("Failed to claim NFT.");
        }
    };



    return (
        <div className="place-bid-container" style={{ color: "white" }}>
            <h2>Active Auctions</h2>
            <div className="auctions-list">
                {activeAuctions.length > 0 ? (
                    activeAuctions.map((auction) => {
                        const auctionEndTime = new Date(auction.endTime); // Keeping the original value as seconds
                        const isAuctionEnded = auctionEndTime <= Date.now();
                        const isHighestBidder = auction.highestBidder.toLowerCase() === currentAccount.toLowerCase(); // Check if the current user is the highest bidder
                        console.log("sum data from bids isauctionended,highestbidder,ishighestdder,auctionendtime", isAuctionEnded, auction.highestBidder, isHighestBidder, auctionEndTime, currentAccount)
                        return (
                            <div key={auction.tokenId} className="auction-item">
                                <img src={auction.image} alt={auction.name} className="auction-image" />
                                <h3>{auction.name || "Unnamed Item"}</h3>
                                <p>{auction.description || "No description available"}</p>
                                <p>Highest Bid: {auction.highestBid} ETH</p>
                                <p>Ends: {auctionEndTime.toLocaleString()}</p>
                                <p>Seller: {auction.seller}</p>

                                {/* Show bidding form only if the auction has not ended */}
                                {auctionEndTime > Date.now() && !auction.sold && (
                                    <div>
                                        <input
                                            type="number"
                                            placeholder="Enter your bid"
                                            value={bidAmount}
                                            onChange={(e) => setBidAmount(e.target.value)}
                                        />
                                        <button
                                            onClick={() => handleBid(auction.tokenId)}
                                            disabled={!bidAmount || parseFloat(bidAmount) <= parseFloat(auction.highestBid)}
                                        >
                                            Place Bid
                                        </button>
                                    </div>
                                )}

                                {/* Allow claiming NFT if the auction has ended and the user is the highest bidder */}
                                {isAuctionEnded && isHighestBidder && !auction.sold ? (
                                    <div>
                                        <button onClick={() => handleClaimNFT(auction.tokenId)}>
                                            Claim NFT
                                        </button>
                                    </div>
                                ) : isAuctionEnded && !auction.sold ? (
                                    <button onClick={() => handleClaimNFT(auction.tokenId)}>
                                        End
                                    </button>
                                ) : (<div></div>)
                                }
                            </div>
                        );
                    })
                ) : (
                    <p>No active auctions at the moment.</p>
                )}
            </div>
        </div >
    );
};

export default PlaceBid;
