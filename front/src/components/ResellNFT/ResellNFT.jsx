import React, { useState, useContext, useEffect } from 'react';
import "./ResellNFT.css";
import { NFTMarketPlaceContext } from '../../../Context/NFTMarketPlaceContext';
import { useSearchParams, useNavigate } from 'react-router-dom';

const ResellNFT = () => {
    const { createSale } = useContext(NFTMarketPlaceContext);
    const [nft, setNFT] = useState({});
    const [loading, setLoading] = useState(true); // Loading state
    const [searchParams] = useSearchParams(); // Correct usage
    const [resellValue, setResellValue] = useState(''); // Default to empty string

    const id = searchParams.get('id'); // Access the 'id' query parameter
    const uri = searchParams.get('uri'); // Access the 'uri' query parameter

    const tempNFT = "/path/to/placeholder/image.jpg"; // Fallback image URL

    const navigate = useNavigate();

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
                price: metadata.price || "Price unknown"
            };
        } catch (error) {
            console.error("Error fetching metadata:", error);
            return {
                name: "Unnamed NFT",
                description: "No description provided",
                image: tempNFT,
                price: "Price unknown"
            };
        }
    };

    useEffect(() => {
        const fetchNFT = async () => {
            setLoading(true);
            const nftMetadata = await fetchMetadata(uri);
            setNFT(nftMetadata);
            setLoading(false);
        };

        if (uri) {
            fetchNFT();
        }

    }, [uri]); // Dependency array only has 'uri' to fetch the NFT when 'uri' changes

    useEffect(() => {
        console.log(nft);
    }, [nft]);

    if (loading) {
        return <div>Loading...</div>; // Optional: You can show a loading spinner or message
    }

    const listNFT = async () => {
        if (resellValue) {
            await createSale(uri, resellValue, true, id);
            navigate("/your-nfts");
        } else {
            alert("Please enter a resell price.");
        }
    };

    return (
        <>
            <div className="resell-wrapper">
                <div className="resell-title">
                    <p>List Your NFT</p>
                </div>
                <div className="content">
                    <img src={nft.image} alt={nft.name} />
                    <div className="nft-details">
                        <p className="name">{nft.name}</p>
                        <p className="price">{nft.price}</p>
                    </div>
                    <input
                        type="text"
                        value={resellValue}
                        onChange={e => setResellValue(e.target.value)}
                        placeholder="Enter resell price"
                    />
                    <button onClick={()=>listNFT()}>List NFT!</button>
                </div>
            </div>
        </>
    );
};

export default ResellNFT;