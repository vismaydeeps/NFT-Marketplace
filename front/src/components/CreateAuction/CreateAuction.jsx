import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { NFTMarketPlaceContext } from '../../../Context/NFTMarketPlaceContext';

const CreateAuction = () => {
    const [searchParams] = useSearchParams(); // Correct usage
    const tokenId = searchParams.get('id'); // Access the 'id' query parameter
    const tokenURI = searchParams.get('uri'); // Access the 'uri' query parameter

    const {
        currentAccount,
        startAuction,
        placeBid,
        endAuction,
    } = useContext(NFTMarketPlaceContext);

    const [startingBid, setStartingBid] = useState("");
    const [duration, setDuration] = useState("");
    const [bidAmount, setBidAmount] = useState("");
    const [nftMetadata, setNftMetadata] = useState(null);


    
    useEffect(() => {
        const fetchMetadata = async () => {
            try {
                const response = await fetch(tokenURI);
                const rawMetadata = await response.json();

                const metadataKey = Object.keys(rawMetadata)[0];
                const metadata = JSON.parse(metadataKey);

                setNftMetadata({
                    name: metadata.name || "Unnamed NFT",
                    description: metadata.description || "No description provided",
                    image: metadata.image,
                });
            } catch (error) {
                console.error("Error fetching metadata:", error);
            }
        };

        if (tokenURI) fetchMetadata();
    }, [tokenURI]);

    const handleStartAuction = async () => {
        if (!startingBid || !duration) return alert("All fields are required");
        try {
            await startAuction(tokenId, startingBid, duration);
            alert("Auction started successfully!");
        } catch (error) {
            console.error("Error starting auction:", error);
        }
    };

    const handlePlaceBid = async () => {
        if (!bidAmount) return alert("Bid amount is required");
        try {
            await placeBid(tokenId, bidAmount);
            alert("Bid placed successfully!");
        } catch (error) {
            console.error("Error placing bid:", error);
        }
    };

    const handleEndAuction = async () => {
        try {
            await endAuction(tokenId);
            alert("Auction ended successfully!");
        } catch (error) {
            console.error("Error ending auction:", error);
        }
    };

    return (
        <div className="auction-page" style={{"color":"white"}}>
            <h1>Auction Page</h1>

            {!currentAccount && <p>Please connect your wallet to proceed.</p>}

            {nftMetadata && (
                <div className="nft-details">
                    <img src={nftMetadata.image} alt={nftMetadata.name} />
                    <h2>{nftMetadata.name}</h2>
                    <p>{nftMetadata.description}</p>
                </div>
            )}

            <div className="auction-actions">
                <div>
                    <h3>Start Auction</h3>
                    <input
                        type="text"
                        placeholder="Starting Bid (ETH)"
                        value={startingBid}
                        onChange={(e) => setStartingBid(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Duration (seconds)"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                    />
                    <button onClick={handleStartAuction}>Start Auction</button>
                </div>

                <div>
                    <h3>Place Bid</h3>
                    <input
                        type="text"
                        placeholder="Bid Amount (ETH)"
                        value={bidAmount}
                        onChange={(e) => setBidAmount(e.target.value)}
                    />
                    <button onClick={handlePlaceBid}>Place Bid</button>
                </div>

                <div>
                    <h3>End Auction</h3>
                    <button onClick={handleEndAuction}>End Auction</button>
                </div>
            </div>
        </div>
    );
};

export default CreateAuction;
