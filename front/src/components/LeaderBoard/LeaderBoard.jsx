import React from 'react';
import "./LeaderBoard.css";
import LbTable from './LbTable/LbTable';
import mockPopular from "./mockPopular.json";

const LeaderBoard = () => {

    return (
        <>
            <div className="lb-wrapper">
                <div className="lb-value">
                    <div className="lb-title-wrapper">
                        <p className="lb-title">For Sale</p>
                        <p className="lb-browse">Browse more</p>
                    </div>
                    <LbTable data={mockPopular} />
                </div>
                <hr className='lb-hr'/>
                <div className="lb-value">
                    <div className="lb-title-wrapper">
                        <p className="lb-title">Top Auctions</p>
                        <p className="lb-browse">Browse more</p>
                    </div>
                    <LbTable data={mockPopular} />
                </div>
            </div>
        </>
    )
}

export default LeaderBoard