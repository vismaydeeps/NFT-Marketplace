import React from 'react';
import "./ViewBidsHistory.css";
import bidsHistory from "./mockBidsHistory.json";

const ViewBidsHistory = (props) => {

  const bids = bidsHistory.auctions[0].bids;

  return (
    <>
      <div className="bids-history-wrapper">
        <table>
          <thead>
            <tr>
              <th className='start'>Rank</th>
              <th className='mid'>User</th>
              <th className='mid'>Bidding Amount</th>
              <th className='end'>Time of Bid</th>
            </tr>
          </thead>
          {/* <hr /> */}
          <tbody>
            {
              bids.map((bid, index) => (
                <tr>
                  <td className='start'>{index + 1}</td>
                  <td className='mid'>{bid.bidderId}</td>
                  <td className='mid'>{bid.amount} ETH</td>
                  <td className='end'>{bid.timestamp}</td>
                </tr>
              ))
            }
          </tbody>
        </table>
      </div>
    </>
  )
}

export default ViewBidsHistory