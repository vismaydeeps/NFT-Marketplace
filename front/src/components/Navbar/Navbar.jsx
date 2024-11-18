import React from 'react';
import "./Navbar.css";
import tempLogo from "../../assets/tempLogo.png";
import Account from "../../assets/account.png";

const Navbar = () => {


    return (
        <>
            <div className="navbar-wrapper">
                <div className="navbar-left">
                    <div className="navbar-logo">
                        <img src={tempLogo} alt="" />
                        <p>ClosedSea</p>
                    </div>
                    <ul>
                        <li>Auctions</li>
                        <li>For Sale</li>
                        <li>Your NFTs</li>
                        <li>Create</li>
                    </ul>
                </div>
                <div className="navbar-right">
                    <ul>
                        <li className='navbar-login'>Login</li>
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
