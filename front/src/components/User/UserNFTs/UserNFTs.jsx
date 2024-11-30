import React from 'react';
import tempNFT from "../../../assets/tempNFT.png";
import "./UserNFTs.css";
import Heart from "react-heart"
import { useState } from 'react';

const UserNFTs = (props) => {
    const nftData = props.nftData;
    const createdNFTs = nftData.createdNFTs;
    const ownedNFTs = nftData.ownedNFTs;
    const [active, setActive] = useState(false)
    return (
        <>
            <div className="user-nfts-wrapper">
                {/* <div className="owner-wrapper"> */}
                    {/* <p className="owned-title">Owned NFTs</p> */}
                    {/* <div className="user-nfts-container"> */}
                    <div className="owned-nfts-wrapper">
                        {
                            ownedNFTs.map((nft, index) => (
                                <div className="own-nft">

                                    <img src={tempNFT} alt="" />
                                    <div className="nft-content">
                                        <p className='nft-name'>{nft.name}</p>
                                        <p className="nft-date">{nft.dateAcquired}</p>
                                        <div className="nft-metrics">
                                            <p className="nft-value">{nft.currentPrice.amount} ETH</p>
                                            <div className='nft-likes'>
                                                <p>
                                                    {/* <Heart isActive={active} onClick={() => setActive(!active)} animationScale={1.25} inactiveColor="white" /> */}
                                                    <span>❤️</span>{nft.likes}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                {/* </div> */}

                {/* <div className="creator-wrapper"> */}
                    {/* <p className="created-title">Created NFTs</p> */}
                    <div className="created-nfts-wrapper">
                        {
                            createdNFTs.map((nft, index) => (
                                <div className="created-nft">

                                    <img src={tempNFT} alt="" />
                                    <div className="nft-content">
                                        <p className='nft-name'>{nft.name}</p>
                                        <p className="nft-date">{nft.createdDate}</p>
                                        <div className="nft-metrics">
                                            <p className="nft-value">{nft.price.amount} ETH</p>
                                            <div className='nft-likes'>
                                                {/* <Heart isActive={active} onClick={() => setActive(!active)} animationScale={1.25} inactiveColor="white" /> */}

                                                <p><span>❤️</span> {nft.likes}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        }
                    </div>
                {/* </div> */}
            </div>

        </>
    )
}

export default UserNFTs
