import React, { useEffect, useState, useContext } from 'react'
import "./Sale.css";
import saleNFT from "./mockSalesNFT.json";
import tempNFT from "../../assets/tempNFT.png";
import { NFTMarketPlaceContext } from '../../../Context/NFTMarketPlaceContext';

const Sale = () => {

  const { fetchNFTS, buyNFT, currentAccount } = useContext(NFTMarketPlaceContext);

  const [NFTs, setNFTs] = useState([]);

  const fetchMetadata = async (tokenURI) => {
    try {
      const response = await fetch(tokenURI);
      const rawMetadata = await response.json();

      // Parse the metadata key if it's a stringified JSON
      const metadataKey = Object.keys(rawMetadata)[0];
      const metadata = JSON.parse(metadataKey);

      return {
        name: metadata.name || "Unnamed NFT",
        description: metadata.description || "No description provided",
        image: metadata.image || tempNFT,
      };
    } catch (error) {
      console.error("Error fetching metadata:", error);
      return {
        name: "Unnamed NFT",
        description: "No description provided",
        image: tempNFT,
      };
    }
  };

  useEffect(() => {
    const loadNFTs = async () => {
      try {
        const allNFTs = await fetchNFTS();
        const updatedNFTs = await Promise.all(
          allNFTs.map(async (nft) => {
            const metadata = await fetchMetadata(nft.tokenURI);
            return {
              ...nft,
              ...metadata, // Spread the parsed metadata into the NFT object
            };
          })
        );
        const filteredNFTs = updatedNFTs.filter((nft) => nft.price > 1);
        setNFTs(filteredNFTs.reverse());
      } catch (error) {
        console.error("Error loading NFTs:", error);
      }
    };

    loadNFTs();
  }, [fetchNFTS]);

  return (
    <>
      <div className="sale-wrapper">
        <div className="sale-title">
          <p className='title-text'>For Sale</p>
        </div>
        <div className="nfts">
          {
            NFTs.map((nft, index) => (
              <div className="sale-nfts">
                <div className="nft-titles">
                  <p className="nft-name">{nft.name}</p>
                  <p className="seller-name">by potato</p>
                </div>
                <img src={nft.image} alt="" />
                <div className="prices">
                  {/* <div className="nft-original-wrapper">
                    <p className="original-label">Original Price</p>
                    <p className="nft-original">{nft.originalPrice}</p>
                  </div> */}
                  <div className="nft-asking-wrapper">
                    <p className="asking-label">Asking price</p>
                    <p className="nft-asking">{nft.price}</p>
                  </div>
                </div>
                {/* <p className="offer-date"></p> */}
                <p className="nft-description">{nft.description}</p>
                <div className="nft-bottom-buttons">
                  {
                    currentAccount == nft.seller.toLowerCase() ? (
                      <button className='own-nft' disabled={true}>Your NFT!</button>
                    ): (<button className = 'nft-buy' onClick = { ()=> buyNFT(nft) }>Buy</button>)
                  }

                {/* <button className='nft-like'><span>❤️</span>{nft.likes}</button> */}
              </div>
              </div>
        ))
          }
      </div>
    </div >
    </>
  )
}

export default Sale
