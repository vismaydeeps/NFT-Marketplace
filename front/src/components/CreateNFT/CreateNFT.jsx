import React, { useContext, useState } from 'react';
import "./CreateNFT.css";
import { NFTMarketPlaceContext } from '../../../Context/NFTMarketPlaceContext';

const CreateNFT = () => {
    const { uploadToIPFS, CreateNFT } = useContext(NFTMarketPlaceContext);

    const [formInput, setFormInput] = useState({
        name: '',
        description: '',
        price: ''
    });

    const [file, setFile] = useState(null);
    const [fileUrl, setFileUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormInput({ ...formInput, [name]: value });
    };

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUploadToIPFS = async () => {
        if (!file) {
            alert("Please upload a file first.");
            return;
        }
        setLoading(true);
        try {
            const url = await uploadToIPFS(file);
            setFileUrl(url);
            alert("File uploaded to IPFS successfully!");
            console.log("url thing",url);
        } catch (error) {
            console.error("Error uploading file to IPFS:", error);
            alert("File upload failed!");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!fileUrl) {
            alert("Please upload your NFT file first.");
            return;
        }
        if (!formInput.name || !formInput.description || !formInput.price) {
            alert("Please fill out all the required fields.");
            return;
        }

        setLoading(true);
        try {
            await CreateNFT(formInput, fileUrl);
            alert("NFT created successfully!");
        } catch (error) {
            console.error("Error creating NFT:", error);
            alert("NFT creation failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="create-nft-wrapper">
            <form onSubmit={handleSubmit}>
                <p className='create-nft-title'>Create Your NFT</p>
                <div className="nft-upload">
                    <label htmlFor="nft">Upload your NFT (Only png or jpeg)</label>
                    <input type="file" name="nft" onChange={handleFileChange} />
                    <button type="button" onClick={handleUploadToIPFS} disabled={loading}>
                        {loading ? "Uploading..." : "Upload to IPFS"}
                    </button>
                </div>
                <div className="nft-name">
                    <label htmlFor="name">Name</label>
                    <input
                        name="name"
                        type="text"
                        placeholder="Name of the NFT"
                        value={formInput.name}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="nft-price">
                    <label htmlFor="price">Price</label>
                    <input
                        type="text"
                        name="price"
                        placeholder="Your desired pricing"
                        value={formInput.price}
                        onChange={handleInputChange}
                    />
                </div>
                <div className="nft-description">
                    <label htmlFor="description">Description</label>
                    <input
                        type="text"
                        name="description"
                        placeholder="A brief description of 20 words"
                        value={formInput.description}
                        onChange={handleInputChange}
                    />
                </div>
               
                <button type="submit" disabled={loading}>
                    {loading ? "Creating..." : "Create!"}
                </button>
            </form>
        </div>
    );
};

export default CreateNFT;
