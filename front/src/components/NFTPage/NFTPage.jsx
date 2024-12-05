import React from 'react'
import "./NFTPage.css"
import tempNFT from "../../assets/tempNFT.png"

const NFTPage = () => {
    return (
        <>
            <div className="NFT-page-wrapper">
                <div className="view-top">
                    <img src={tempNFT} alt="" />
                    <div className="nft-name-data">
                        <div className="nft-name-left">
                            <p className="nft-name"><span>Title lorem</span> created by potato</p>
                            <p className="desc">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ducimus quod accusamus fugit culpa laboriosam? Vero exercitationem tempora sapiente a reprehenderit!</p>
                        </div>
                        <div className="nft-name-right">
                            {/* <div className="right-1"> */}
                            <div className="seller">
                                <span>Owned By</span>
                                <p>Lorem, ipsum.</p>
                            </div>
                            <div className="highest-bid">
                                <span>Original Price</span>
                                <p>2 ETH</p>
                            </div>
                            <div className="bid-time">
                                <span>Current Value</span>
                                <p>13 ETH</p>
                            </div>
                            <div className="nft-likes">
                                <p><span>❤️</span>15</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default NFTPage
