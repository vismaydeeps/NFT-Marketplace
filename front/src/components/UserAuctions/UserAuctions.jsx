// import React, { useContext, useState, useEffect } from 'react';
// import "./UserAuctions.css";
// import { NFTMarketPlaceContext } from '../../../Context/NFTMarketPlaceContext';

// const UserAuctions = () => {

//     const { fetchActiveAuctions, placeBid, claimNFT, currentAccount, uploadToIPFS } = useContext(NFTMarketPlaceContext); // Access functions from context

//     const [activeAuctions, setActiveAuctions] = useState([]);

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
//             try {
//                 const auctions = await fetchActiveAuctions();
//                 const updatedAuctions = await Promise.all(
//                     auctions.map(async (auction) => {
//                         const metadata = await fetchMetadata(auction.tokenURI);
//                         return {
//                             ...auction,
//                             ...metadata,
//                         };
//                     })
//                 );
//                 const filteredAuctions = updatedAuctions.filter((auction) => auction.seller.toLowerCase() === currentAccount.toLowerCase());
//                 setActiveAuctions(filteredAuctions.reverse());
//             } catch (error) {
//                 console.error("Error loading active auctions:", error);
//             }
//         };

//         loadAuctions();
//     }, [activeAuctions]);


//     return (
//         <>

//             <div className="user-auction-wrapper">
//                 <p className="title">Your Auctions</p>
//                 <div className="ongoing-wrapper">
//                     {
//                         activeAuctions.map((data, index) => (
//                             <div className="ongoing-auctions" key={index}>
//                                 <img src={data.image} alt="NFT Image" />
//                                 <div className="ongoing-data">
//                                     {/* <div className="nft-data-top">
//                                     <div className="nft-names"> */}
//                                     <p className="nft-title">{data.name}</p>
//                                     <p className="desc">{data.description}</p>
//                                     <p className="date">{(new Date(data.endTime).toLocaleString())}</p>
//                                     {/* <p className="nft-seller">Sold by {data.sellerId}</p> */}
//                                     {/* </div>
                                    
//                                 </div> */}
//                                     {/* <p className="nft-initial">Opening Price : {data.initialPrice} ETH</p> */}
//                                     <p className="nft-highest"><span> {data.highestBid} ETH </span></p>
//                                     {/* <p className="nft-num-bids">Number of bids : {data.bidCount}</p> */}
//                                     {/* <p className="nft-time-left">1d:12h:13min</p> */}
//                                 </div>
//                                 <div className="ongoing-options">
//                                     {/* <button>Place a bid</button> */}
//                                     <button>Place Bid</button>
//                                 </div>
//                             </div>
//                         ))
//                     }
//                 </div>
//             </div>

//         </>
//     )
// }

// export default UserAuctions

import React, { useContext, useState, useEffect } from 'react';
import "./UserAuctions.css";
import { NFTMarketPlaceContext } from '../../../Context/NFTMarketPlaceContext';

const UserAuctions = () => {
    const { fetchActiveAuctions, placeBid, currentAccount, claimNFT } = useContext(NFTMarketPlaceContext); // Access functions from context

    const [activeAuctions, setActiveAuctions] = useState([]);

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
        const loadAuctions = async () => {
            try {
                const auctions = await fetchActiveAuctions();
                const updatedAuctions = await Promise.all(
                    auctions.map(async (auction) => {
                        const metadata = await fetchMetadata(auction.tokenURI);
                        return {
                            ...auction,
                            ...metadata,
                        };
                    })
                );

                // Filter auctions based on the new criteria
                const filteredAuctions = updatedAuctions.filter((auction) => {
                    const currentTime = new Date().getTime(); // Current time in milliseconds
                    return (
                        auction.seller.toLowerCase() === currentAccount.toLowerCase() &&
                        auction.highestBidder.toLowerCase() !== "0x0000000000000000000000000000000000000000" &&
                        currentTime > auction.endTime
                    );
                });

                setActiveAuctions(filteredAuctions.reverse());
            } catch (error) {
                console.error("Error loading active auctions:", error);
            }
        };

        loadAuctions();
    }, [fetchActiveAuctions, currentAccount]);

    return (
        <>
            <div className="user-auction-wrapper">
                <p className="title">Pending Auctions</p>
                <div className="ongoing-wrapper">
                    {
                        activeAuctions.length > 0 ? (
                            activeAuctions.map((data, index) => (
                                <div className="ongoing-auctions" key={index}>
                                    <img src={data.image} alt="NFT Image" />
                                    <div className="ongoing-data">
                                        <p className="nft-title">{data.name}</p>
                                        <p className="desc">{data.description}</p>
                                        <p className="date">{new Date(data.endTime).toLocaleString()}</p>
                                        <p className="nft-highest"><span>{data.highestBid} ETH</span></p>
                                    </div>
                                    <div className="ongoing-options">
                                        <button onClick={() => claimNFT(data.tokenId)}>End</button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className='pending-auctions'>No Pending auctions</p>
                        )
                    }
                </div>
            </div>
        </>
    );
};

export default UserAuctions;
