// import React, { useContext, useEffect, useState } from 'react';
// import { NFTMarketPlaceContext } from '../../../Context/NFTMarketPlaceContext'; // Import context
// import { useSearchParams, useNavigate } from 'react-router-dom';
// import "./PlaceBid.css";

// const PlaceBid = () => {
//     const { fetchActiveAuctions, placeBid, claimNFT, currentAccount, uploadToIPFS } = useContext(NFTMarketPlaceContext); // Access functions from context
//     const [activeAuctions, setActiveAuctions] = useState([]);
//     const [bidAmount, setBidAmount] = useState("");
//     const [searchParams] = useSearchParams(); // Correct usage

//     const id = searchParams.get('id'); // Access the 'id' query parameter
//     const uri = searchParams.get('uri'); // Access the 'uri' query parameter

//     const fetchMetadata = async (tokenURI) => {
//         try {
//             const response = await fetch(tokenURI);
//             const rawMetadata = await response.json();

//             const metadataKey = Object.keys(rawMetadata)[0];
//             const metadata = JSON.parse(metadataKey);

//             return {
//                 name: metadata.name || "Unnamed NFT",
//                 description: metadata.description || "No description provided",
//                 image: metadata.image || tempNFT,
//             };
//         } catch (error) {
//             console.error("Error fetching metadata:", error);
//             return {
//                 name: "Unnamed NFT",
//                 description: "No description provided",
//                 image: tempNFT,
//             };
//         }
//     };


//     useEffect(() => {
//         const loadAuctions = async () => {
//             const auctions = await fetchActiveAuctions();
//             const updatedAuctions = await Promise.all(
//                 auctions.map(async (auction) => {
//                     const metaData = await fetchMetadata(uri);
//                     return {
//                         ...auction,
//                         ...metaData
//                     }
//                 })
//             )
//             const filteredAuctions = updatedAuctions.filter((auction) => auction.tokenId == id);
//             console.log("auctions", filteredAuctions);
//             setActiveAuctions(filteredAuctions);
//         };
//         loadAuctions();
//     }, [fetchActiveAuctions]);

//     const handleBid = async (tokenId) => {
//         if (!bidAmount || parseFloat(bidAmount) <= 0) {
//             alert("Please enter a valid bid amount.");
//             return;
//         }
//         await placeBid(tokenId, bidAmount);
//         // Optionally, refresh auctions after placing a bid
//         const auctions = await fetchActiveAuctions();
//         const updatedAuctions = await Promise.all(
//             auctions.map(async (auction) => {
//                 const metaData = await fetchMetadata(uri);
//                 return {
//                     ...auction,
//                     ...metaData
//                 }
//             })
//         )
//         const filteredAuctions = updatedAuctions.filter((auction) => auction.tokenId == id);
//         console.log("auctions", filteredAuctions);
//         setActiveAuctions(filteredAuctions);

//         // Reset bid amount after placing the bid
//         setBidAmount("");
//     };

//     useEffect(() => {
//         console.log(activeAuctions);
//     }, [activeAuctions]);


//     const handleClaimNFT = async (tokenId) => {
//         try {
//             await claimNFT(tokenId);
//             // Optionally refresh auctions after claiming the NFT
//             const updatedAuctions = await fetchActiveAuctions();
//             setActiveAuctions(updatedAuctions);
//             alert("NFT claimed successfully!");

//         } catch (error) {
//             console.error("Error claiming NFT:", error);
//             alert("Failed to claim NFT.");
//         }
//     };



//     return (
//         <div className="place-bid-container" style={{ color: "white" }}>
//             <h2>Place Bids</h2>
//             <div className="auctions-list">
//                 {activeAuctions.length > 0 ? (
//                     activeAuctions.map((auction) => {
//                         const auctionEndTime = new Date(auction.endTime); // Keeping the original value as seconds
//                         const isAuctionEnded = auctionEndTime <= Date.now();
//                         const isHighestBidder = auction.highestBidder.toLowerCase() === currentAccount.toLowerCase(); // Check if the current user is the highest bidder
//                         console.log("sum data from bids isauctionended,highestbidder,ishighestdder,auctionendtime", isAuctionEnded, auction.highestBidder, isHighestBidder, auctionEndTime, currentAccount)
//                         console.log("auction");
//                         return (
//                             <div key={auction.tokenId} className="auction-item">
//                                 <img src={auction.image} alt={auction.name} className="auction-image" />
//                                 <div className="details">
//                                     <div className="title-details">

//                                         <h3>{auction.name || "Unnamed Item"}</h3>
//                                         <p>{auction.description || "No description available"}</p>
//                                     </div>
//                                     <div className="right">
//                                         <div className="right-top">
//                                             <p>Highest Bid: {auction.highestBid} ETH</p>
//                                             <p>Ends: {auctionEndTime.toLocaleString()}</p>
//                                             {/* <p>Seller: {auction.seller}</p> */}
//                                         </div>

//                                         {/* Show bidding form only if the auction has not ended */}
//                                         {auctionEndTime > Date.now() && !auction.sold && (
//                                             <div className='place-bid-input'>
//                                                 <input
//                                                     type="text"
//                                                     placeholder="Enter your bid"
//                                                     value={bidAmount}
//                                                     onChange={(e) => setBidAmount(e.target.value)}
//                                                 />
//                                                 <button
//                                                     onClick={() => handleBid(auction.tokenId)}
//                                                     disabled={!bidAmount || parseFloat(bidAmount) <= parseFloat(auction.highestBid)}
//                                                 >
//                                                     Place Bid
//                                                 </button>
//                                             </div>
//                                         )}

//                                         {/* Allow claiming NFT if the auction has ended and the user is the highest bidder */}
//                                         {isAuctionEnded && isHighestBidder && !auction.sold ? (
//                                             <div >
//                                                 <button className='claim' onClick={() => handleClaimNFT(auction.tokenId)}>
//                                                     Claim NFT
//                                                 </button>
//                                             </div>
//                                         ) : isAuctionEnded && !auction.sold ? (
//                                             <button className='end' onClick={() => handleClaimNFT(auction.tokenId)}>
//                                                 End
//                                             </button>
//                                         ) : (<div></div>)
//                                         }
//                                     </div>

//                                 </div>
//                             </div>

//                         );
//                     })
//                 ) : (
//                     <p>No active auctions at the moment.</p>
//                 )}
//             </div>
//         </div >
//     );
// };

// export default PlaceBid;


import React, { useContext, useEffect, useState } from 'react';
import { NFTMarketPlaceContext } from '../../../Context/NFTMarketPlaceContext'; // Import context
import { useSearchParams } from 'react-router-dom';
import "./PlaceBid.css";

const PlaceBid = () => {
    const { fetchActiveAuctions, placeBid, claimNFT, currentAccount } = useContext(NFTMarketPlaceContext); // Access functions from context
    const [activeAuctions, setActiveAuctions] = useState([]);
    const [bidAmount, setBidAmount] = useState("");
    const [searchParams] = useSearchParams(); // Correct usage

    const id = searchParams.get('id'); // Access the 'id' query parameter
    const uri = searchParams.get('uri'); // Access the 'uri' query parameter

    const fetchMetadata = async (tokenURI) => {
        try {
            const response = await fetch(tokenURI);
            const rawMetadata = await response.json();

            const metadataKey = Object.keys(rawMetadata)[0];
            const metadata = JSON.parse(metadataKey);

            return {
                name: metadata.name || "Unnamed NFT",
                description: metadata.description || "No description provided",
                image: metadata.image || "", // Add default image or tempNFT if necessary
            };
        } catch (error) {
            console.error("Error fetching metadata:", error);
            return {
                name: "Unnamed NFT",
                description: "No description provided",
                image: "", // Add default image or tempNFT if necessary
            };
        }
    };

    useEffect(() => {
        const loadAuctions = async () => {
            const auctions = await fetchActiveAuctions();
            const updatedAuctions = await Promise.all(
                auctions.map(async (auction) => {
                    const metaData = await fetchMetadata(uri);
                    return {
                        ...auction,
                        ...metaData
                    };
                })
            );
            const filteredAuctions = updatedAuctions.filter((auction) => auction.tokenId == id);
            setActiveAuctions(filteredAuctions);
        };
        loadAuctions();
    }, [fetchActiveAuctions, id, uri]);

    const handleBid = async (tokenId) => {
        if (!bidAmount || parseFloat(bidAmount) <= 0) {
            alert("Please enter a valid bid amount.");
            return;
        }

        await placeBid(tokenId, bidAmount);

        // Optionally, refresh auctions after placing a bid
        const auctions = await fetchActiveAuctions();
        const updatedAuctions = await Promise.all(
            auctions.map(async (auction) => {
                const metaData = await fetchMetadata(uri);
                return {
                    ...auction,
                    ...metaData
                };
            })
        );
        const filteredAuctions = updatedAuctions.filter((auction) => auction.tokenId == id);
        setActiveAuctions(filteredAuctions);

        // Reset bid amount after placing the bid
        setBidAmount("");
    };

    const handleClaimNFT = async (tokenId) => {
        try {
            await claimNFT(tokenId);
            alert("NFT claimed successfully!");

            // Optionally refresh auctions after claiming the NFT
            const updatedAuctions = await fetchActiveAuctions();
            setActiveAuctions(updatedAuctions);
        } catch (error) {
            console.error("Error claiming NFT:", error);
            alert("Failed to claim NFT.");
        }
    };

    return (
        <div className="place-bid-container" style={{ color: "white" }}>
            <h2>Place Bids</h2>
            <div className="auctions-list">
                {activeAuctions.length > 0 ? (
                    activeAuctions.map((auction) => {
                        const auctionEndTime = new Date(auction.endTime * 1000); // Convert to milliseconds
                        const isAuctionEnded = auctionEndTime <= Date.now();
                        const isHighestBidder = auction.highestBidder.toLowerCase() === currentAccount.toLowerCase();

                        return (
                            <div key={auction.tokenId} className="auction-item">
                                <img src={auction.image} alt={auction.name} className="auction-image" />
                                <div className="details">
                                    <div className="title-details">
                                        <h3>{auction.name || "Unnamed Item"}</h3>
                                        <p>{auction.description || "No description available"}</p>
                                    </div>
                                    <div className="right">
                                        <div className="right-top">
                                            <p>Highest Bid: {auction.highestBid} ETH</p>
                                            <p>Ends: {auctionEndTime.toLocaleString()}</p>
                                        </div>

                                        {auctionEndTime > Date.now() && !auction.sold && (
                                            <div className='place-bid-input'>
                                                <input
                                                    type="number"
                                                    min={parseFloat(auction.highestBid) + 0.01}
                                                    placeholder={`Enter at least ${parseFloat(auction.highestBid) + 0.01} ETH`}
                                                    value={bidAmount}
                                                    onChange={(e) => setBidAmount(e.target.value)}
                                                />
                                                <button
                                                    onClick={() => handleBid(auction.tokenId)}
                                                    disabled={!bidAmount || parseFloat(bidAmount) <= parseFloat(auction.highestBid)}
                                                >
                                                    Place Bid
                                                </button>
                                            </div>
                                        )}

                                        {isAuctionEnded && isHighestBidder && !auction.sold && (
                                            <div>
                                                <button className='claim' onClick={() => handleClaimNFT(auction.tokenId)}>
                                                    Claim NFT
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <p>No active auctions at the moment.</p>
                )}
            </div>
        </div>
    );
};

export default PlaceBid;