import React, { useState, useContext, useEffect } from 'react';
import './TradeNFT.css';
import { NFTMarketPlaceContext } from '../../../Context/NFTMarketPlaceContext';
import { useSearchParams, useNavigate } from 'react-router-dom';


const TradeNFT = () => {
    const { tradeNFT, currentAccount, fetchMyNFTsOrListedNFTs } = useContext(NFTMarketPlaceContext);
    const [searchParams] = useSearchParams(); // Correct usage

    const id = searchParams.get("id");
    const uri = searchParams.get("uri")

    const [myTokenId, setMyTokenId] = useState('');
    const [recipientTokenId, setRecipientTokenId] = useState('');
    const [recipientAddress, setRecipientAddress] = useState('');

    const [nft, setNFT] = useState({});

    const myAddress = currentAccount;

    const fetchMetadata = async (tokenURI) => {
        try {
            const response = await fetch(tokenURI);
            const rawMetadata = await response.json();

            // Assuming metadata is a JSON object with `name`, `description`, and `image`
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
            };
        }
    };

    useEffect(() => {
        const fetchNFT = async () => {

            try {
                // Fetch metadata from URI
                const nftMetadata = await fetchMetadata(uri);

                // Fetch all NFTs
                const allNFTs = await fetchMyNFTsOrListedNFTs("");
                // console.log("all nfts",allNFTs);
                // console.log("id",id==allNFTs[0].tokenId);
                // Find the specific NFT by ID
                const filteredNFT = allNFTs.find((nft) => nft.tokenId == id);

                if (filteredNFT) {
                    // Merge metadata and NFT data
                    const mergedNFT = { ...filteredNFT, ...nftMetadata };
                    setNFT(mergedNFT);
                } else {
                    console.warn("NFT with specified ID not found");
                    setNFT(null);
                }
            } catch (error) {
                console.error("Error fetching NFT:", error);
                setNFT(null);
            } finally {
                // setLoading(false);
            }
        };
        if (uri && id) {
            fetchNFT();
        }
    }, [uri, id, fetchMyNFTsOrListedNFTs]);
    useEffect(() => {
        console.log(nft);
    }, [nft]);

    const handleTrade = async (e) => {
        e.preventDefault();

        if (!myTokenId || !myAddress || !recipientTokenId || !recipientAddress) {
            alert('Please fill out all fields.');
            return;
        }

        try {
            await tradeNFT(myAddress, id, recipientAddress, recipientTokenId);
            alert('Trade completed successfully!');
            // Reset form fields
            setMyTokenId('');
            // setMyAddress('');
            setRecipientTokenId('');
            setRecipientAddress('');
        } catch (error) {
            console.error('Trade failed:', error);
            alert('Trade failed. Please check your input or try again later.');
        }
    };

    return (
        <div className="trade-nft-container" style={{ "color": "white" }}>
            <h2>Trade NFTs</h2>
            <div className="trade-content">
                <div className="trade-left">
                    <img src={nft.image} alt="" />
                </div>
                <div className="trade-right">
                    <div className="nft-details">
                        <p className="title">{nft.name}</p>
                        <p className="desc">{nft.description}</p>
                        <p className="price">{nft.price} ETH</p>
                    </div>
                    <form onSubmit={handleTrade} className="trade-nft-form">
                        <div className="trade-inputs">
                            <div className="form-group">
                                {/* <label>Recipient's Address</label> */}
                                <input
                                    type="text"
                                    placeholder="Recipient's Wallet Address"
                                    value={recipientAddress}
                                    onChange={(e) => setRecipientAddress(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                {/* <label>Recipient's Token ID</label> */}
                                <input
                                    type="text"
                                    placeholder="Recipient's Token ID"
                                    value={recipientTokenId}
                                    onChange={(e) => setRecipientTokenId(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button type="submit" className="trade-button">Trade NFTs</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default TradeNFT;
