import React, { useEffect, useContext } from 'react';
import tempNFT from "../../../assets/tempNFT.png";
import "./UserNFTs.css";
import Heart from "react-heart";
import { useState } from 'react';
import { NFTMarketPlaceContext } from '../../../../Context/NFTMarketPlaceContext';
import { useNavigate } from 'react-router-dom';

const UserNFTs = ({ nftData, setListedNFTCount, setOwnedNFTCount, setAccountValue }) => {
    const [active, setActive] = useState(false);

    const [createdNFTs, setCreatedNFTs] = useState([]);
    const [ownedNFTs, setOwnedNFTs] = useState([]);


    const { fetchNFTS, buyNFT, fetchMyNFTsOrListedNFTs, currentAccount } = useContext(NFTMarketPlaceContext);

    const navigate = useNavigate();

    const fetchMetadata = async (tokenURI) => {
        try {
            const response = await fetch(tokenURI);
            const rawMetadata = await response.json();

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
                            ...metadata,
                        };
                    })
                );
                const filteredNFTs = updatedNFTs.filter((nft) => nft.seller.toLowerCase() === currentAccount.toLowerCase());
                setCreatedNFTs(filteredNFTs.reverse());
                setListedNFTCount(filteredNFTs.length);
            } catch (error) {
                console.error("Error loading NFTs:", error);
            }
        };

        loadNFTs();
    }, [fetchNFTS]);

    // useEffect(() => {
    //     const loadOwnedNFTs = async () => {
    //         try {
    //             const allNFTs = await fetchMyNFTsOrListedNFTs("");
    //             const value = 0;
    //             const updatedOwn = await Promise.all(
    //                 allNFTs.map(async (nft) => {
    //                     const metadata = await fetchMetadata(nft.tokenURI);
    //                     return {
    //                         ...nft,
    //                         ...metadata,
    //                     };
    //                 })
    //             );
    //             setOwnedNFTs(updatedOwn);
    //             setOwnedNFTCount(updatedOwn.length);
    //             console.log("owned", allNFTs);
    //         } catch (error) {
    //             console.log("Trouble fetching owned NFTs", error);
    //         }
    //     };
    //     loadOwnedNFTs();
    // }, [fetchMyNFTsOrListedNFTs]);

    useEffect(() => {
        const loadOwnedNFTs = async () => {
            try {
                const allNFTs = await fetchMyNFTsOrListedNFTs("");
                const updatedOwn = await Promise.all(
                    allNFTs.map(async (nft) => {
                        const metadata = await fetchMetadata(nft.tokenURI);
                        return {
                            ...nft,
                            ...metadata,
                        };
                    })
                );

                // Calculate total sum of NFT prices
                const totalPrice = updatedOwn.reduce((sum, nft) => sum + (parseFloat(nft.price) || 0), 0);
                setAccountValue(totalPrice);
                setOwnedNFTs(updatedOwn);
                setOwnedNFTCount(updatedOwn.length);
                console.log("Owned NFTs:", updatedOwn);
                console.log("Total Price of Owned NFTs:", totalPrice);
            } catch (error) {
                console.log("Trouble fetching owned NFTs", error);
            }
        };
        loadOwnedNFTs();
    }, [fetchMyNFTsOrListedNFTs]);


    const redirectResell = (id, uri) => {
        navigate(`/resell?id=${id}&uri=${encodeURIComponent(uri)}`);
    };

    const redirectToAuction = (id, uri) => {
        navigate(`/create-auction?id=${id}&uri=${encodeURIComponent(uri)}`);
    };

    return (
        <>
            <div className="user-nfts-wrapper">
                <div className="owned-nfts-wrapper">
                    {ownedNFTs.map((nft) => (
                        <div className="own-nft" key={nft.tokenId}>
                            <img src={nft.image} alt="" />
                            <div className="nft-content">
                                <p className="nft-name">{nft.name}</p>
                                <p>{nft.description}</p>
                                <div className="nft-metrics">
                                    <p className="nft-value">{nft.price} ETH</p>
                                   
                                        <button className="list-nft" onClick={() => redirectResell(nft.tokenId, nft.tokenURI)}>List</button>
                                        
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="created-nfts-wrapper">
                    {createdNFTs.map((nft) => (
                        <div className="created-nft" key={nft.tokenId}>
                            <img src={nft.image} alt="" />
                            <div className="nft-content">
                                <p className="nft-name">{nft.name}</p>
                                <p>{nft.description}</p>
                                <div className="nft-metrics">
                                    <p className="nft-value">{nft.price} ETH</p>
                                    <button className="auction-button" onClick={() => redirectToAuction(nft.tokenId, nft.tokenURI)}>Auction</button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default UserNFTs;