import React, { useState, useEffect, useContext, Children } from 'react'
// import Wenb3Modal from "web3modal";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import axios from "axios";
import { create as ipfsHttpClient } from "ipfs-http-client";
import { useNavigate } from 'react-router-dom';
// import Router from "next/router";


import { NFTMarketPlaceAddress, NFTMarketPlaceABI } from './constants';


//v6
const fetchContract = (signerOrProvider) =>
    new ethers.Contract(
        NFTMarketPlaceAddress,
        NFTMarketPlaceABI,
        signerOrProvider
    );

const connectingWithSmartContract = async () => {
    try {
        // Initialize Web3Modal
        const web3modal = new Web3Modal();
        const connection = await web3modal.connect();

        // Create the provider using ethers.js v6 BrowserProvider
        const provider = new ethers.BrowserProvider(connection);

        // Get the signer from the provider
        const signer = await provider.getSigner();

        // Fetch the contract using the signer
        const contract = fetchContract(signer);

        // Debugging: Print contract address and ABI to confirm
        console.log("Contract Address:", contract.target); // Use `contract.target` instead of `contract.address`
        // console.log("Contract ABI:", NFTMarketPlaceABI);

        return contract;
    } catch (error) {
        console.error("Error connecting with the smart contract:", error);
    }
};


export const NFTMarketPlaceContext = React.createContext();

export const NFTMarketPlaceProvider = ({ children }) => {
    const titleData = "potato this bro";
    // const navigate = useNavigate();
    const [currentAccount, setCurrentAccount] = useState("");

    const checkIfWalletConnected = async () => {
        try {
            if (!window.ethereum) return console.log("Install metamask");

            const accounts = await window.ethereum.request({
                method: "eth_accounts",
            })

            if (accounts.length) {
                setCurrentAccount(accounts[0]);

            } else {
                console.log("No account found")
            }

            console.log("current account", currentAccount);
        } catch (error) {
            console.log("something went wrong while connecting to wallet")
        }
    }

    useEffect(() => {
        checkIfWalletConnected();
    }, [])

    //connect wallet function

    const connectWallet = async () => {
        try {

            if (!window.ethereum) return console.log("install metamask")

            const accounts = await window.ethereum.request({
                method: "eth_requestAccounts",
            })

            setCurrentAccount(accounts[0])
            window.location.reload();
        } catch (error) {
            console.log("erroe connecting wallet")
        }
    }

    const uploadToIPFS = async (file) => {
        try {
            const formData = new FormData();
            formData.append("file", file);
            console.log("context form data", formData);

            const response = await axios({
                method: "post",
                url: "https://api.pinata.cloud/pinning/pinFileToIPFS",
                data: formData,
                headers: {
                    pinata_api_key: `d5057f77d0922275d80b`,
                    pinata_secret_api_key: `f037d3aa7de6b6f54e590be816ee905fd59bc6e39d9e761f07f875aaccd3bdda`,
                    "Content-Type": "multipart/form-data"
                }
            })
            const ImgHash = `https:///gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;

            return ImgHash;

        } catch (error) {
            console.log("error with uploadtoIPFS", error);
        }
    }

    const CreateNFT = async (formInput, fileUrl, router) => {

        const { name, description, price } = formInput;
        console.log("context price", price)
        if (!name || !description || !price || !fileUrl)
            return console.log("Data is missing")

        const data = JSON.stringify({ price, name, description, image: fileUrl });
        console.log("context createNFT", data)
        try {
            const response = await axios({
                method: "POST",
                url: "https://api.pinata.cloud/pinning/pinJSONToIPFS",
                data: data,
                headers: {
                    pinata_api_key: `d5057f77d0922275d80b`,
                    pinata_secret_api_key: `f037d3aa7de6b6f54e590be816ee905fd59bc6e39d9e761f07f875aaccd3bdda`,
                    // "Content-Type": "multipart/form-data"
                }
            })

            const url = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
            console.log("url on backend", url);
            await createSale(url, price);
        } catch (error) {
            console.log("error with create nft", error)
        }

    }

    const createSale = async (url, formInputPrice, isReselling, id) => {
        try {
            const price = ethers.parseUnits(formInputPrice, "ether");
            // const price = formInputPrice;
            const contract = await connectingWithSmartContract();

            const listingPrice = await contract.getListingPrice();

            const transaction = !isReselling ? await contract.createToken(url, price, {
                value: listingPrice.toString()
            }) : await contract.resellToken(id, price, {
                value: listingPrice.toString()
            })

            await transaction.wait();

            console.log(transaction);
        }

        catch (error) {
            console.log("error while creating sale", error);
        }
    }
    const fetchNFTS = async () => {
        try {
            // Create a provider to connect to the blockchain
            const provider = new ethers.JsonRpcProvider();

            // Fetch the contract instance
            const contract = fetchContract(provider);

            // Fetch the market items
            const data = await contract.fetchMarketItems();

            // Process the data and fetch details for each NFT
            const items = await Promise.all(
                data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
                    // Fetch the token URI for metadata
                    const tokenURI = await contract.tokenURI(tokenId);

                    // Fetch metadata from the token URI (e.g., using IPFS)
                    const {
                        data: { image, name, description },
                    } = await axios.get(tokenURI);

                    // Format the price using ethers.js v6 BigInt
                    const price = ethers.formatUnits(unformattedPrice, "ether");

                    // Return a structured item object
                    return {
                        price,
                        tokenId: Number(tokenId), // Convert BigInt to number
                        seller,
                        owner,
                        image,
                        name,
                        description,
                        tokenURI,
                    };
                })
            );

            // Return the processed items
            return items;
        } catch (error) {
            console.log("Error while fetching NFTs:", error);
        }
    };


    const fetchMyNFTsOrListedNFTs = async (type) => {
        try {

            const contract = await connectingWithSmartContract();

            const data = type == "fetchItemsListed" ? await contract.fetchItemsListed() : await contract.fetchMyNFTs();

            const items = await Promise.all(
                data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
                    const tokenURI = await contract.tokenURI(tokenId);
                    const {
                        data: { image, name, description }
                    } = await axios.get(tokenURI);
                    const price = ethers.formatUnits(
                        unformattedPrice.toString(),
                        "ether"
                    )
                    return {
                        price,
                        // tokenId: tokenId.toNumber,
                        tokenId: tokenId,
                        seller,
                        owner,
                        image,
                        name,
                        description,
                        tokenURI
                    }
                })
            )

            return items;

        } catch (error) {
            console.log("error while fetching listeed nfts", error)
        }
    }

    useEffect(() => {
        fetchNFTS().then((items) => {
            console.log("from context", items)
        })
    }, [])

    const buyNFT = async (nft) => {
        // const navigate = useNavigate();
        try {
            const contract = await connectingWithSmartContract();

            const price = ethers.parseUnits(nft.price.toString(), "ether");

            const transaction = await contract.createMarketSale(nft.tokenId, {
                value: price,
            })

            await transaction.wait();
            // navigate("/your-nfts");
            // window.location.reload();

        } catch (error) {
            console.log("error while buying nft", error);
        }
    }

    const startAuction = async (tokenId, startingBid, duration,tokenURL) => {
        try {
            const contract = await connectingWithSmartContract();
            const startingBidInWei = ethers.parseUnits(startingBid.toString(), "ether");

            const transaction = await contract.startAuction(tokenId, startingBidInWei, duration,tokenURL);
            await transaction.wait();

            console.log(`Auction started for token ID: ${tokenId}`);
        } catch (error) {
            console.error("Error starting auction:", error);
        }
    };

    const placeBid = async (tokenId, bidAmount) => {
        try {
            const contract = await connectingWithSmartContract();
            const bidInWei = ethers.parseUnits(bidAmount.toString(), "ether");
    
            const transaction = await contract.placeBid(tokenId, { value: bidInWei });
            await transaction.wait();
    
            console.log(`Bid placed on token ID: ${tokenId}`);
            // Optionally, you can call fetchActiveAuctions to get the updated auction details
        } catch (error) {
            console.error("Error placing bid:", error);
        }
    };
    const claimNFT = async (tokenId) => {
        try {
            const contract = await connectingWithSmartContract();
            
            // First, ensure the auction has ended and there's a valid highest bidder
            const auction = await contract.auctions(tokenId);
            if (auction.highestBidder === "0x0000000000000000000000000000000000000000") {
                throw new Error("No bids placed");
            }
            if (Date.now() / 1000 < auction.auctionEndTime) {
                throw new Error("Auction has not yet ended");
            }
    
            // Call the endAuction function to transfer the NFT to the highest bidder
            const transaction = await contract.endAuction(tokenId);
            
            // Wait for transaction to be mined
            const receipt = await transaction.wait();
            
            if (receipt.status === 1) {
                console.log(`NFT claimed for token ID: ${tokenId}`);
            } else {
                throw new Error("Transaction failed");
            }
        } catch (error) {
            console.error("Error claiming NFT:", error.message || error);
        }
    };
    

    const fetchActiveAuctions = async () => {
        try {
            const provider = new ethers.JsonRpcProvider();
            const contract = fetchContract(provider);
    
            // Fetch MarketItems and Auctions
            const [marketItems, activeAuctions] = await contract.fetchAuctions();
    
            // Map through both arrays to combine them into a single array of auction objects
            const auctions = marketItems.map((item, index) => {
                const auction = activeAuctions[index];
                const { tokenId, seller, sold } = item;
                const { highestBid, highestBidder, auctionEndTime, metadataHash} = auction;
    
                return {
                    tokenId: Number(tokenId.toString()), // Convert BigInt to string then to Number
                    seller,
                    sold,
                    highestBid: ethers.formatUnits(highestBid, "ether"), // Convert to ether (BigInt -> string is fine here)
                    highestBidder,
                    endTime: new Date(Number(auctionEndTime.toString()) * 1000), // Convert BigInt to number for timestamp
                    // You can skip fetching IPFS metadata if not needed
                    image: "", // Placeholder, can be fetched if needed
                    name: "", // Placeholder, can be fetched if needed
                    description: "", // Placeholder, can be fetched if needed
                    tokenURI: metadataHash, // Placeholder, can be fetched if needed
                };
            });
    
            return auctions;
        } catch (error) {
            console.error("Error fetching active auctions:", error);
        }
    };
    
    const transferNFT = async(recvAddress,tokenId)=>{
        
    }

    return (
        <NFTMarketPlaceContext.Provider
            value={{
                titleData,
                checkIfWalletConnected,
                connectWallet,
                CreateNFT, uploadToIPFS,
                fetchNFTS,
                fetchMyNFTsOrListedNFTs,
                buyNFT,
                createSale,
                currentAccount,
                startAuction,
                claimNFT,
                fetchActiveAuctions,
                placeBid,
                transferNFT
            }}>
            {children}
        </NFTMarketPlaceContext.Provider>
    )
}