import React from 'react';
import "./User.css";
import tempPfp from "../../assets/tempNFT.png";
import mockUserData from "./mockUserData.json";
// import mockNFTData from "./mockNFTData.json";
import UserNFTs from './UserNFTs/UserNFTs';

const User = () => {
    return (
        <>
            <div className="user-wrapper">
                <div className="profile-data">
                    <img src={tempPfp} alt="" />
                    <div className="profile-name-data">
                        <div className="profile-name-left">
                            <p className="user-name">{mockUserData.username}</p>
                            <p className="bio">{mockUserData.bio}</p>
                        </div>
                        <div className="profile-name-right">
                            <div className="right-1">
                                <div className="creation">
                                    <span>Account created</span>
                                    <p className="">{mockUserData.account_creation}</p>
                                </div>
                                <div className="created-nfts">
                                    <span>Listed NFTs</span>
                                    <p className="">{mockUserData.activity.createdNFTs.length}</p>
                                </div>
                                <div className="owned-nfts">
                                    <span>Owned NFTs</span>
                                    <p className="">{mockUserData.ownedNFTs.length}</p>
                                </div>
                            </div>
                            <div className="right-2">
                                <div className="sold-nfts">
                                    <span>Total Sold</span>
                                    <p className="">5</p>
                                </div>
                                <div className="auctions">
                                    <span>Number of Auctions</span>
                                    <p className="">2</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="nfts">
                    <div className="nfts-titles">
                        <p className="owned-title">Owned NFTs</p>
                        <p className="created-title">Listed NFTs</p>
                    </div>
                    <UserNFTs nftData={{ "ownedNFTs": mockUserData.ownedNFTs, "createdNFTs": mockUserData.activity.createdNFTs }} />
                </div>
            </div>
        </>
    )
}

export default User
