import React, { useContext, useState, useEffect } from 'react';
import tempNFT from "../../../assets/tempNFT.png";
import "./OnGoingAuctions.css";
import { useNavigate } from 'react-router-dom';
import { NFTMarketPlaceContext } from '../../../../Context/NFTMarketPlaceContext';

const OnGoingAuctions = () => {
    const { fetchActiveAuctions, currentAccount } = useContext(NFTMarketPlaceContext); // Access functions from context

    const [activeAuctions, setActiveAuctions] = useState([]);
    const navigate = useNavigate();

    const fetchMetadata = async (tokenURI) => {
        try {
            const response = await fetch(tokenURI);
            const rawMetadata = await response.json();

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
                image: tempNFT,
            };
        }
    };

    useEffect(() => {
        const loadAuctions = async () => {
            try {
                const auctions = await fetchActiveAuctions();
                const updatedAuctions = await Promise.all(
                    auctions.map(async (auction) => {
                        const metadata = await fetchMetadata(auction.tokenURI);
                        return {
                            ...auction,
                            ...metadata,
                        };
                    })
                );
                // Filter out auctions that have already ended
                const filteredAuctions = updatedAuctions.filter(
                    (auction) => new Date(auction.endTime).getTime() > Date.now()
                );
                setActiveAuctions(filteredAuctions.reverse());
            } catch (error) {
                console.error("Error loading active auctions:", error);
            }
        };

        loadAuctions();
    }, []);

    const handlePlaceBid = (id, url) => {
        navigate(`/place-bid?id=${id}&uri=${encodeURIComponent(url)}`);
    };

    return (
        <div className="ongoing-wrapper">
            {activeAuctions.length > 0 ? (
                activeAuctions.map((data, index) => (
                    <div className="ongoing-auctions" key={index}>
                        <img src={data.image} alt="NFT Image" />
                        <div className="ongoing-data">
                            <p className="nft-title">{data.name}</p>
                            <p className="desc">{data.description}</p>
                            <p className="date">{new Date(data.endTime).toLocaleString()}</p>
                            <p className="nft-highest">
                                <span>{data.highestBid} ETH</span>
                            </p>
                        </div>
                        <div className="ongoing-options">
                            {data.seller.toLowerCase() !== currentAccount.toLowerCase() ? (
                                <button onClick={() => handlePlaceBid(data.tokenId, data.tokenURI)}>Place Bid</button>
                            ) : (
                                <button disabled className='your-auction'>Your Auction!</button>
                            )}
                        </div>
                    </div>
                ))
            ) : (
                <p className="no-auctions-message">There are no ongoing auctions at the moment.</p>
            )}
        </div>
    );
};

export default OnGoingAuctions;
