import React from 'react'
import "./Sale.css";
import saleNFT from "./mockSalesNFT.json";
import tempNFT from "../../assets/tempNFT.png";

const Sale = () => {



  return (
    <>
      <div className="sale-wrapper">
        <div className="sale-title">
          <p className='title-text'>For Sale</p>
        </div>
        <div className="nfts">
          {
            saleNFT.map((nft, index) => (
              <div className="sale-nfts">
                <div className="nft-titles">
                  <p className="nft-name">{nft.nftName}</p>
                  <p className="seller-name">by {nft.sellerUsername}</p>
                </div>
                <img src={tempNFT} alt="" />
                <div className="prices">
                  <div className="nft-original-wrapper">
                    <p className="original-label">Original Price</p>
                    <p className="nft-original">{nft.originalPrice}</p>
                  </div>
                  <div className="nft-asking-wrapper">
                    <p className="asking-label">Asking price</p>
                    <p className="nft-asking">{nft.askingPrice}</p>
                  </div>
                </div>
                <p className="offer-date">{nft.offerDate}</p>
                <p className="nft-description">{nft.description}</p>
                <div className="nft-bottom-buttons">
                  <button className='nft-buy'>Buy</button>
                  <button className='nft-like'><span>❤️</span>{nft.likes}</button>
                </div>
              </div>
            ))
          }
        </div>
      </div>
    </>
  )
}

export default Sale
