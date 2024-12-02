import React from 'react';
import "./CreateNFT.css";

const CreateNFT = () => {
    return (
        <>
            <div className="create-nft-wrapper">
                <form action="">
                <p className='create-nft-title'>Create Your NFT</p>
                    <div className="nft-upload">
                        <label htmlFor="nft">Upload your NFT (Only png or jpeg)</label>
                        <input type="file" name="nft" id="" />
                    </div>
                    <div className="nft-name">
                        <label htmlFor="name">Name</label>
                        <input name='name' type="text" placeholder='Name of the NFT'/>
                    </div>
                    <div className="nft-price">
                        <label htmlFor="price">Price</label>
                        <input type="text" name='price' placeholder='Your desired pricing'/>
                    </div>
                    <div className="nft-gratuity">
                        <label htmlFor="gratuity">Gratuity to the platform</label>
                        <input type="text" name='gratuity' placeholder='Enter as a percentage (min 20%)'/>
                    </div>
                    <button type="submit">Create!</button>
                </form>
            </div>
        </>
    )
}

export default CreateNFT
