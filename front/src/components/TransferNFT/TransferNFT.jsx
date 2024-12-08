import React, { useContext, useState } from 'react';
import './TransferNFT.css';
import { NFTMarketPlaceContext } from '../../../Context/NFTMarketPlaceContext';

const TransferNFT = () => {
    const { transferNFT } = useContext(NFTMarketPlaceContext);
    const [tokenId, setTokenId] = useState('');
    const [receiverAddress, setReceiverAddress] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleTransfer = async () => {
        if (!tokenId || !receiverAddress) {
            alert('Please provide both Token ID and Receiver Address.');
            return;
        }
        try {
            setIsLoading(true);
            await transferNFT(tokenId, receiverAddress);
            alert(`NFT with Token ID ${tokenId} successfully transferred to ${receiverAddress}`);
            setTokenId('');
            setReceiverAddress('');
        } catch (error) {
            console.error('Error transferring NFT:', error);
            alert('Failed to transfer NFT. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="transfer-nft-container" style={{"color":"white"}}>
            <h2>Transfer NFT</h2>
            <div className="transfer-nft-form">
                <label htmlFor="tokenId">Token ID:</label>
                <input
                    type="text"
                    id="tokenId"
                    placeholder="Enter Token ID"
                    value={tokenId}
                    onChange={(e) => setTokenId(e.target.value)}
                />

                <label htmlFor="receiverAddress">Receiver Address:</label>
                <input
                    type="text"
                    id="receiverAddress"
                    placeholder="Enter Receiver Address"
                    value={receiverAddress}
                    onChange={(e) => setReceiverAddress(e.target.value)}
                />

                <button
                    onClick={handleTransfer}
                    disabled={isLoading}
                >
                    {isLoading ? 'Transferring...' : 'Transfer NFT'}
                </button>
            </div>
        </div>
    );
};

export default TransferNFT;
