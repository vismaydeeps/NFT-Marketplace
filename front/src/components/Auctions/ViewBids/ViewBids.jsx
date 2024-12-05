import React from 'react';
import "./ViewBids.css";
import tempNFT from "../../../assets/tempNFT.png";
import ViewBidsHistory from './ViewBidsHistory/ViewBidsHistory';


const ViewBids = () => {
  return (
    <>
      <div className="view-bids-wrapper">
        <div className="view-top">
          {/* <img src={tempNFT} alt="" />
          <div className="bids-data">
            <div className="bids-desc-data">
              <div className="view-bids-title">
                <p className="view-bids-name">title</p>
                <p className="view-bids-user">user</p>
              </div>
              <p className="description">Lorem ipsum dolor sit amet consectetur adipisicing elit. Similique, amet. Minima aliquam itaque possimus cum numquam voluptatem reprehenderit quisquam natus.</p>
            </div>
            <div className="bids-data-bottom">
              <div className="bids-data-timer">
                <p>18:00:00</p>
              </div>
            </div>
          </div>
          <div className="bids-highest">
            <p>Largest Bid Placed : <span>123 ETH</span>
            </p>
          </div> */}
          <img src={tempNFT} alt="" />
          <div className="nft-name-data">
            <div className="nft-name-left">
              <p className="nft-name"><span>Title lorem</span> created by potato</p>
              <p className="desc">Lorem ipsum, dolor sit amet consectetur adipisicing elit. Ducimus quod accusamus fugit culpa laboriosam? Vero exercitationem tempora sapiente a reprehenderit!</p>
            </div>
            <div className="nft-name-right">
              {/* <div className="right-1"> */}
              <div className="seller">
                <span>Sold By</span>
                <p>Lorem, ipsum.</p>
              </div>
              <div className="highest-bid">
                <span>Highest Bid</span>
                <p>2 ETH</p>
              </div>
              <div className="bid-time">
                <span>Time Left</span>
                <p>12:00:00</p>
              </div>
              <div className="nft-likes">
                <p><span>❤️</span>15</p>
              </div>
              {/* </div> */}
            </div>
          </div>
        </div>
        <div className="view-bids-mid">
          <form action="" className="view-bids">
            <input type="text" placeholder='Enter your bid (ETH)' />
            <button type="submit">Place Bid</button>
          </form>
        </div>
        <div className="view-bids-bottom">
          <p>Placed Bids ({25})</p>
          <ViewBidsHistory />
        </div>
      </div >

    </>
  )
}

export default ViewBids
