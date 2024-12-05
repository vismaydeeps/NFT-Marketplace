import React, { useEffect, useContext } from 'react';
import tempNFT from "../../../assets/tempNFT.png";
import "./UserNFTs.css";
import Heart from "react-heart"
import { useState } from 'react';
import { NFTMarketPlaceContext } from '../../../../Context/NFTMarketPlaceContext';

const UserNFTs = (props) => {
    const nftData = props.nftData;
    // const createdNFTs = nftData.createdNFTs;
    const ownedNFTs = nftData.ownedNFTs;
    const [active, setActive] = useState(false)
    const [createdNFTs, setCreatedNFTs] = useState([]);

    const [copyNFTs, setCopyNFTs] = useState({});

    const { fetchNFTS } = useContext(NFTMarketPlaceContext);

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
    


    // useEffect(() => {
    //     fetchNFTS().then((item) => {
    //         setNFTs(item.reverse());
    //         setCopyNFTs(item);
    //     })
    //     console.log(nfts);
    // }, [])
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
                setCreatedNFTs(filteredNFTs.reverse());
            } catch (error) {
                console.error("Error loading NFTs:", error);
            }
        };
    
        loadNFTs();
    }, [fetchNFTS]);
    

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

                                <img src={nft.image} alt="" />
                                <div className="nft-content">
                                    <p className='nft-name'>{nft.name}</p>
                                    <p className="nft-date">123</p>
                                    <div className="nft-metrics">
                                        <p className="nft-value">{nft.price} ETH</p>
                                        <div className='nft-likes'>
                                            {/* <Heart isActive={active} onClick={() => setActive(!active)} animationScale={1.25} inactiveColor="white" /> */}

                                            <p><span>❤️</span> 123</p>
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
