import React from 'react';
import tempNFT from "../../../assets/tempNFT.png";
import "./UserNFTs.css";

const UserNFTs = (props) => {
    const nftData = props.nftData;
    const createdNFTs = nftData.createdNFTs;
    const ownedNFTs = nftData.ownedNFTs;
    return (
        <>
            <div className="user-nfts-wrapper">
                <div className="owned-nfts-wrapper">
                    {
                        ownedNFTs.map((nft, index) => (
                            <div className="own-nft">
                                <img src={tempNFT} alt="" />
                                <div className="nft-content">
                                    <p className='nft-name'>{nft.name}</p>
                                    <p className="nft-value">{nft.currentPrice.amount}</p>
                                    <p className="nft-date">{nft.dateAcquired}</p>
                                </div>
                            </div>
                        ))
                    }
                </div>
                <div className="created-nfts-wrapper">

                </div>
            </div>
        </>
    )
}

export default UserNFTs
