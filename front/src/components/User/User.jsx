import React, { useState, useEffect, useContext } from 'react';
import "./User.css";
import tempPfp from "../../assets/tempNFT.png";
import mockUserData from "./mockUserData.json";
// import mockNFTData from "./mockNFTData.json";
import UserNFTs from './UserNFTs/UserNFTs';
import { NFTMarketPlaceContext } from '../../../Context/NFTMarketPlaceContext';

const User = () => {

    const [listedNFTCount, setListedNFTCount] = useState(0);
    const [ownedNFTCount, setOwnedNFTCount] = useState(0);
    const [accountValue, setAccountValue] = useState(0);

    const { currentAccount } = useContext(NFTMarketPlaceContext);

    return (
        <>
            <div className="user-wrapper">
                <div className="profile-data">
                    <img src={tempPfp} alt="" />
                    <div className="profile-name-data">
                        <div className="profile-name-left">
                            <p className="user-name">
                                {currentAccount ? `${currentAccount.slice(0, 6)}...${currentAccount.slice(-4)}` : "N/A"}
                            </p>
                            <p className="bio">Lorem ipsum dolor sit amet consectetur adipisicing elit. Quo temporibus deleniti odio voluptates architecto aliquid. Harum, magnam necessitatibus. Aliquid animi, odit quisquam quas veniam hic quod alias facere quia eius!</p>
                        </div>
                        <div className="profile-name-right">
                            <div className="right-1">
                                <div className="creation">
                                    <span>Account Value</span>
                                    <p className="">{accountValue}</p>
                                </div>
                                <div className="created-nfts">
                                    <span>Listed NFTs</span>
                                    <p className="">{listedNFTCount}</p>
                                </div>
                                <div className="owned-nfts">
                                    <span>Owned NFTs</span>
                                    <p className="">{ownedNFTCount}</p>
                                </div>
                            </div>
                            {/* <div className="right-2">
                                <div className="sold-nfts">
                                    <span>Total Sold</span>
                                    <p className="">5</p>
                                </div>
                                <div className="auctions">
                                    <span>Number of Auctions</span>
                                    <p className="">2</p>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
                <div className="nfts">
                    <div className="nfts-titles">
                        <p className="owned-title">Owned NFTs</p>
                        <p className="created-title">Listed NFTs</p>
                    </div>
                    <UserNFTs
                        setListedNFTCount={setListedNFTCount}
                        setOwnedNFTCount={setOwnedNFTCount}
                        setAccountValue={setAccountValue}
                    />
                </div>
            </div>
        </>
    )
}

export default User
