import React,{useState,useEffect,useContext} from 'react';
import "./Navbar.css";
import tempLogo from "../../assets/tempLogo.png";
import Account from "../../assets/account.png";
import { Link } from 'react-router-dom';

import { NFTMarketPlaceContext } from '../../../Context/NFTMarketPlaceContext';

const Navbar = () => {

    const {currentAccount,connectWallet} = useContext(NFTMarketPlaceContext);

    return (
        <>
            <div className="navbar-wrapper">
                <div className="navbar-left">
                    {/* <div className="navbar-logo"> */}
                        <Link to="/" className='navbar-logo'>
                            <img src={tempLogo} alt="" />
                            <p>ClosedSea</p>
                            {/* <p>{titleData}</p> */}
                        </Link>
                    {/* </div> */}
                    <ul>
                        <li><Link to="/auctions">Auctions</Link></li>
                        <li><Link to="/for-sale">For Sale</Link></li>
                        <li><Link to="/your-auctions">Pending Auctions</Link></li>
                        <li><Link to="/create">Create</Link></li>
                        
                    </ul>
                </div>
                <div className="navbar-right">
                    <ul>
                        {currentAccount == "" ?  <li className="navbar-login"><button  onClick={()=>connectWallet()}>Connect</button></li>:<li className="navbar-login">Create</li>} 
                        
                        <li className='navbar-account'>
                            <img src={Account} alt="" />
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default Navbar
