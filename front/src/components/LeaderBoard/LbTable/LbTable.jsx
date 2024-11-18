import React from 'react';
import "./LbTable.css";
import tempNFT from "../../../assets/tempNFT.png"

const LbTable = (props) => {
    const data = props.data;
    const nftData = data.nfts;
    const titles = data.titles;

    const leftSideData = nftData.slice(0, Math.ceil(nftData.length / 2));
    const rightSideData = nftData.slice(Math.ceil(nftData.length / 2));

    return (
        <div className="lbt-wrapper">
            <div className="lbt-column">
                <div className="lbt-title">
                    {titles.map((title, index) => (
                        <p key={`left-title-${index}`}>{title}</p>
                    ))}
                </div>
                <div className="lbt-content">
                    {leftSideData.map((nft, index) => (
                        <div className="lbt-nft-wrapper" key={`left-nft-${index}`}>
                            <p >{nft.rank}</p>
                            <div className="nft-img">
                                <img src={tempNFT} />
                                <p>{nft.name}</p>
                            </div>
                            <p>{nft.price}</p>
                            <p>{nft.priceBoughtFor}</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="lbt-column">
                <div className="lbt-title">
                    {titles.map((title, index) => (
                        <p key={`right-title-${index}`}>{title}</p>
                    ))}
                </div>
                <div className="lbt-content">
                    {rightSideData.map((nft, index) => (
                        <div className="lbt-nft-wrapper" key={`right-nft-${index}`}>
                            <p>{nft.rank}</p>
                            <div className="nft-img">
                                <img src={tempNFT} />
                                <p>{nft.name}</p>
                            </div>
                            <p>{nft.price}</p>
                            <p>{nft.priceBoughtFor}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default LbTable;
