import React, { useEffect, useState, useContext } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { NFTMarketPlaceContext } from '../../../Context/NFTMarketPlaceContext';
import "./CreateAuction.css";

const CreateAuction = () => {
    const [searchParams] = useSearchParams(); // Correct usage
    const tokenId = searchParams.get('id'); // Access the 'id' query parameter
    const tokenURI = searchParams.get('uri'); // Access the 'uri' query parameter

    const {
        currentAccount,
        startAuction,
        placeBid,
        endAuction,
        fetchMyNFTsOrListedNFTs
    } = useContext(NFTMarketPlaceContext);

    const [startingBid, setStartingBid] = useState("");
    const [duration, setDuration] = useState("");
    const [bidAmount, setBidAmount] = useState("");
    const [nft, setNFT] = useState(null);


    const fetchMetadata = async (tokenURI) => {
        try {
            const response = await fetch(tokenURI);
            const rawMetadata = await response.json();

            // Assuming metadata is a JSON object with `name`, `description`, and `image`
            const metadataKey = Object.keys(rawMetadata)[0];
            const metadata = JSON.parse(metadataKey);
            return {
                name: metadata.name || "Unnamed NFT",
                description: metadata.description || "No description provided",
                image: metadata.image || tempNFT,
            };
        } catch (error) {
            console.error("Error fetching metadata:", error);
            return {
                name: "Unnamed NFT",
                description: "No description provided",
            };
        }
    };

    useEffect(() => {
        const fetchNFT = async () => {
            try {
                const nftMetadata = await fetchMetadata(tokenURI);
                console.log("all nfts",nftMetadata)
                const allNFTs = await fetchMyNFTsOrListedNFTs("fetchItemsListed");


                const filteredNFT = allNFTs.find((nft) => nft.tokenId == tokenId);


                if (filteredNFT) {
                    // Merge metadata and NFT data
                    const mergedNFT = { ...filteredNFT, ...nftMetadata };
                    setNFT(mergedNFT);
                } else {
                    console.warn("NFT with specified ID not found");
                    setNFT(null);
                }
            } catch (error) {
                console.error("Error fetching metadata:", error);
            }
        };

        if (tokenURI && tokenId) {
            fetchNFT();
        }
    }, [tokenURI, tokenId, fetchMyNFTsOrListedNFTs]);

    const handleStartAuction = async () => {
        if (!startingBid || !duration) return alert("All fields are required");
        try {
            await startAuction(tokenId, startingBid, duration, tokenURI);
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
        <div className="create-auction-wrapper" style={{ "color": "white" }}>
            <h1>Auction Page</h1>

            {!currentAccount && <p>Please connect your wallet to proceed.</p>}

            {nft && (
                <>
                    <div className="nft-details">
                        <img src={nft.image} alt={nft.name} />
                        <div className="title-details">
                            <div className="name">
                                <h2>{nft.name}</h2>
                                <p>{nft.description}</p>
                                <p className="price">{nft.price} ETH</p>
                            </div>
                            <div className="auction-actions">

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
                        </div>
                    </div>
                </>
            )}

        </div>

    );
};

export default CreateAuction;
