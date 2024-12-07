import React,{useContext,useState,useEffect} from 'react';
import tempAuctions from "./tempAuctions.json";
import tempNFT from "../../../assets/tempNFT.png";
import "./OnGoingAuctions.css";
import { NFTMarketPlaceContext } from '../../../../Context/NFTMarketPlaceContext';

const OnGoingAuctions = () => {

    const auctionData = tempAuctions.auctions;
    const {fetchActiveAuctions} = useContext(NFTMarketPlaceContext);

    const tempFetch  = async()=>{
        const temp =  await fetchActiveAuctions();
        console.log("ongoing auctions",temp);
    }

    tempFetch();


    return (
        <>
            <div className="ongoing-wrapper">
                {
                    auctionData.map((data, index) => (
                        <div className="ongoing-auctions" key={index}>
                            <img src={tempNFT} alt="NFT Image" />
                            <div className="ongoing-data">
                                <div className="nft-data-top">
                                    <div className="nft-names">
                                        <p className="nft-title">{data.nftId}</p>
                                        <p className="nft-seller">Sold by {data.sellerId}</p>
                                    </div>
                                    <div className="nft-num-bids">
                                        <p>
                                            {data.bidCount} bids
                                        </p>
                                    </div>
                                </div>
                                {/* <p className="nft-initial">Opening Price : {data.initialPrice} ETH</p> */}
                                <p className="nft-highest"><span> {data.currentHighestBid.amount} ETH </span>+300% (1 ETH)</p>
                                {/* <p className="nft-num-bids">Number of bids : {data.bidCount}</p> */}
                                {/* <p className="nft-time-left">1d:12h:13min</p> */}
                            </div>
                            <div className="ongoing-options">
                                {/* <button>Place a bid</button> */}
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