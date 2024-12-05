import React, { useState, useEffect, useContext, Children } from 'react'
// import Wenb3Modal from "web3modal";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import axios from "axios";
import { create as ipfsHttpClient } from "ipfs-http-client";
// import Router from "next/router";


import { NFTMarketPlaceAddress, NFTMarketPlaceABI } from './constants';

const fetchContract = (signerOrProvider) =>
    new ethers.Contract(
        NFTMarketPlaceAddress,
        NFTMarketPlaceABI,
        signerOrProvider
    )


const connectingWithSmartContract = async () => {
    try {

        // const web3modal = new Web3Modal();
        // const connection = await web3modal.connect();
        // const provider = new ethers.BrowserProvider(connection);
        // const signer = provider.getSigner();
        // const contract = fetchContract(signer);
        // // console.log("contract",contract);
        // console.log("Contract Address:", contract.address);
        // console.log()

        // return contract;
                
        const web3modal = new Web3Modal();
        const connection = await web3modal.connect();

        // Create the provider using Web3Provider for ethers.js v5
        const provider = new ethers.providers.Web3Provider(connection); // Use Web3Provider here for ethers.js v5
        const signer = provider.getSigner(); // Get signer, no need to await

        // Fetch the contract using the signer
        const contract = fetchContract(signer);

        // Debugging: Print contract address and ABI to confirm
        // console.log("Contract Address:", contract.address);
        // console.log("Contract ABI:", contract.interface.format(ethers.utils.FormatTypes.json));

        return contract;
        

    } catch (error) {
        console.log("something wrong with contract");
        console.log(error);
    }
}



// const connectingWithSmartContract = async () => {
//     try {
//         // Initialize Web3Modal and connect
//         const web3modal = new Wenb3Modal();
//         const connection = await web3modal.connect();

//         // Initialize the provider with the connected wallet
//         const provider = new ethers.Web3Provider(connection); // Use Web3Provider here, not BrowserProvider
//         const signer = provider.getSigner();

//         // Define your contract ABI and address here
//         const contractAddress = NFTMarketPlaceAddress; // Replace with actual contract address
        

//         // Create contract instance using ABI and address
//         const contract = new ethers.Contract(contractAddress, NFTMarketPlaceABI, signer);

//         // Debugging: Print contract address and ABI to confirm
//         console.log("Contract Address:", contract.address);
//         console.log("Contract ABI:", contract.interface.format(ethers.utils.FormatTypes.json));

//         return contract;
//     } catch (error) {
//         console.log("Something went wrong with contract:", error);
//     }
// };


export const NFTMarketPlaceContext = React.createContext();

export const NFTMarketPlaceProvider = ({ children }) => {
    const titleData = "potato this bro";

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

            console.log("current account",currentAccount);
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

        if (!name || !description || !price || !fileUrl)
            return console.log("Data is missing")

        const data = JSON.stringify({ name, description, image: fileUrl });
        console.log("context createNFT",data)
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
            const price = ethers.utils.parseUnits(formInputPrice, "ether");
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
            const provider = new ethers.providers.JsonRpcProvider();
            const contract = fetchContract(provider);

            const data = await contract.fetchMarketItem();

            const items = await Promise.all(
                data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
                    const tokenURI = await contract.tokenURI(tokenId);

                    const {
                        data: { image, name, description },
                    } = await axios.get(tokenURI);
                    const price = ethers.utils.formatUnits(
                        unformattedPrice.toString(),
                        "ether"
                    );

                    return {
                        price,
                        tokenId: tokenId.toNumber(),
                        seller,
                        owner,
                        image,
                        name,
                        description,
                        tokenURI
                    }
                })
            );

            return items;
        } catch (error) {
            console.log("error while fetching nfts");
        }
    }

    const fetchMyNFTsOrListedNFTs = async (type) => {
        try {

            const contract = await connectingWithSmartContract();

            const data = type == "fetchItemsListed" ? await contract.fetchItemsListed() : await contract.fetchMyNFT();

            const items = await Promise.all(
                data.map(async ({ tokenId, seller, owner, price: unformattedPrice }) => {
                    const tokenURI = await contract.tokenURI(tokenId);
                    const {
                        data: { image, name, description }
                    } = await axios.get(tokenURI);
                    const price = ethers.utils.formatUnits(
                        unformattedPrice.toString(),
                        "ether"
                    )
                    return {
                        price,
                        tokenId: tokenId.toNumber(),
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
            console.log("error while fetching listeed nfts")
        }
    }

    useEffect(()=>{
        fetchNFTS().then((items)=>{
            console.log("from context",items)
        })
    },[])

    const buyNFT = async (nft) => {
        try {
            const contract = await connectingWithSmartContract();

            const price = ethers.utils.parseUnits(nft.price.toString(), "ether");

            const transaction = await contract.createMarketSale(nft.tokenId, {
                value: price,
            })

            await transaction.wait();


        } catch (error) {
            console.log("error while buying nft")
        }
    }

    return (
        <NFTMarketPlaceContext.Provider value={{ titleData, checkIfWalletConnected, connectWallet, CreateNFT, uploadToIPFS, fetchNFTS, fetchMyNFTsOrListedNFTs, buyNFT, currentAccount }}>
            {children}
        </NFTMarketPlaceContext.Provider>
    )
}