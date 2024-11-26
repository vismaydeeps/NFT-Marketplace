import React from 'react';
import tempAuctions from "./tempAuctions.json";
import tempNFT from "../../../assets/tempNFT.png";
import "./OnGoingAuctions.css";

const OnGoingAuctions = () => {

    const auctionData = tempAuctions.auctions;

    return (
        <>
            <div className="ongoing-wrapper">
                {
                    auctionData.map((data, index) => ( // Use map instead of forEach
                        <div className="ongoing-auctions" key={index}>
                            <img src={tempNFT} alt="NFT Image" />
                            <div className="ongoing-data">
                                <div className="nft-names">
                                <p className="nft-title">{data.nftId}</p>
                                <p className="nft-seller">Sold by {data.sellerId}</p>
                                </div>
                                <p className="nft-initial">Opening Price : {data.initialPrice} ETH</p>
                                <p className="nft-highest">Highest bid : {data.currentHighestBid.amount} ETH</p>
                                <p className="nft-num-bids">Number of bids : {data.bidCount}</p>
                            </div>
                            <div className="ongoing-options">
                                <button>Place a bid</button>
                                <button>View Bids</button>
                            </div>
                        </div>
                    ))
                }
            </div>
        </>
    );
};

export default OnGoingAuctions;