import React from 'react'
import OnGoingAuctions from './OnGoingAuctions/OnGoingAuctions'
import "./Auctions.css";

const Auctions = () => {
    return (
        <>
            <div className="auctions-wrapper">
                <p className='auctions-title'>On Going Auctions <span className='auctions-live'>Live</span></p>
                <OnGoingAuctions />
            </div>
        </>
    )
}

export default Auctions
