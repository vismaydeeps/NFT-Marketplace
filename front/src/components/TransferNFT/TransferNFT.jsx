// import React, { useContext, useState } from 'react';
// import './TransferNFT.css';
// import { NFTMarketPlaceContext } from '../../../Context/NFTMarketPlaceContext';

// const TransferNFT = () => {
//     const { transferNFT, currentAccount } = useContext(NFTMarketPlaceContext);
//     const [tokenId, setTokenId] = useState('');
//     const [receiverAddress, setReceiverAddress] = useState('');
//     const [isLoading, setIsLoading] = useState(false);

//     const handleTransfer = async () => {
//         if (!tokenId || !receiverAddress) {
//             alert('Please provide both Token ID and Receiver Address.');
//             return;
//         }
//         try {
//             setIsLoading(true);
//             await transferNFT(tokenId, currentAccount, receiverAddress);
//             alert(`NFT with Token ID ${tokenId} successfully transferred to ${receiverAddress}`);
//             setTokenId('');
//             setReceiverAddress('');
//         } catch (error) {
//             console.error('Error transferring NFT:', error);
//             alert('Failed to transfer NFT. Please try again.');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     return (
//         <div className="transfer-nft-container" style={{ "color": "white" }}>
//             <h2>Transfer NFT</h2>
//             <div className="transfer-nft-form">
//                 <label htmlFor="tokenId">Token ID:</label>
//                 <input
//                     type="text"
//                     id="tokenId"
//                     placeholder="Enter Token ID"
//                     value={tokenId}
//                     onChange={(e) => setTokenId(e.target.value)}
//                 />

//                 <label htmlFor="receiverAddress">Receiver Address:</label>
//                 <input
//                     type="text"
//                     id="receiverAddress"
//                     placeholder="Enter Receiver Address"
//                     value={receiverAddress}
//                     onChange={(e) => setReceiverAddress(e.target.value)}
//                 />

//                 <button
//                     onClick={handleTransfer}
//                     disabled={isLoading}
//                 >
//                     {isLoading ? 'Transferring...' : 'Transfer NFT'}
//                 </button>
//             </div>
//         </div>
//     );
// };

// export default TransferNFT;


import React, { useContext, useState, useEffect } from 'react';
import './TransferNFT.css';
import { NFTMarketPlaceContext } from '../../../Context/NFTMarketPlaceContext';
import { useSearchParams, useNavigate } from 'react-router-dom';


const TransferNFT = () => {
    const { transferNFT, fetchMyNFTsOrListedNFTs, currentAccount } = useContext(NFTMarketPlaceContext);

    const [receiverAddress, setReceiverAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const [searchParams] = useSearchParams(); // Correct usage

    const id = searchParams.get("id");
    const uri = searchParams.get("uri");

    const [recipientAddress, setRecipientAddress] = useState('');

    const [nft, setNFT] = useState({});
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
                    console.log("from transfer", mergedNFT)
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


    const handleTransfer = async () => {
        if (!id || !receiverAddress) {
            alert('Please provide both Token ID and Receiver Address.');
            return;
        }
        try {
            setIsLoading(true);
            await transferNFT(id, currentAccount, receiverAddress);
            alert(`NFT with Token ID ${id} successfully transferred to ${receiverAddress}`);
            // setTokenId('');
            setReceiverAddress('');
            navigate("/")

        } catch (error) {
            console.error('Error transferring NFT:', error);
            alert('Failed to transfer NFT. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="trade-nft-container" style={{ "color": "white" }}>
            <h2>Transfer Ownership</h2>
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
                    {/* <form onSubmit={handleTransfer} className="trade-nft-form"> */}
                    <div className="form">
                        <div className="trade-inputs">
                            {/* <label>Recipient's Address</label> */}
                            <input
                                type="text"
                                placeholder="Recipient's Wallet Address"
                                value={receiverAddress}
                                onChange={(e) => setReceiverAddress(e.target.value)}
                                required
                            />
                            <button onClick={handleTransfer} className="trade-button">Trade NFT</button>
                        </div>
                    </div>

                    {/* </form> */}
                </div>
            </div>
        </div>
    );

};

export default TransferNFT;
