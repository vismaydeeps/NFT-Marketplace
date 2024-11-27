import React from 'react';
import "./ViewBids.css";
import tempNFT from "../../../assets/tempNFT.png";


const ViewBids = () => {
  return (
    <>
      <div className="view-bids-wrapper">
        <div className="view-top">
          <img src={tempNFT} alt="" />
          <div className="bids-data">
            <div className="view-bids-title">
              <p className="view-bids-name">title</p>
              <p className="view-bids-user">user</p>
            </div>
            <div className="bids-data-bottom">
                <div className="bids-data-timer">
                  <p>18:00:00</p>
                </div>
                <form action="" className="view-bids">
                  <input type="text" placeholder='Enter your bid'/>
                  <button type="submit">Place Bid</button>
                </form>
            </div>

          </div>
        </div>

        <div className="view-mid">

        </div>
      </div >

    </>
  )
}

export default ViewBids
