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
                        <p className="user-name">{mockUserData.username}</p>
                        <p className="creation">Account created on <span>{mockUserData.account_creation}</span></p>
                        <p className="bio">{mockUserData.bio}</p>
                        <p className="created-nfts">{mockUserData.activity.createdNFTs.length}</p>
                        <p className="owned-nfts">{mockUserData.ownedNFTs.length}</p>
                    </div>
                </div>
                <div className="nfts">
                    <UserNFTs nftData={{ "ownedNFTs": mockUserData.ownedNFTs, "createdNFTs": mockUserData.activity.createdNFTs }} />
                </div>
            </div>
        </>
    )
}

export default User
