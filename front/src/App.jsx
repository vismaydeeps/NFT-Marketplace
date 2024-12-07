import React, { useContext, useEffect } from 'react'
import "./App.css";
import Navbar from './components/Navbar/Navbar'
import LeaderBoard from './components/LeaderBoard/LeaderBoard'
import Login from './components/Login/Login';
import CreateAccount from './components/CreateAccount/CreateAccount';
import Auctions from './components/Auctions/Auctions';
import ViewBids from './components/Auctions/ViewBids/ViewBids';
import Sale from './components/SalePage/Sale';
import CreateNFT from './components/CreateNFT/CreateNFT';
import User from './components/User/User';
import NFTPage from './components/NFTPage/NFTPage';
import ResellNFT from './components/ResellNFT/ResellNFT';
import NFTTestComponent from './components/Auctions/tempAuctions';
import CreateAuction from './components/CreateAuction/CreateAuction';
import PlaceBid from './components/PlaceBid/PlaceBid';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { NFTMarketPlaceContext } from '../Context/NFTMarketPlaceContext';


const App = () => {

  const { checkIfWalletConnected } = useContext(NFTMarketPlaceContext);

  useEffect(() => {
    checkIfWalletConnected();
  })

  return (
    <Router>
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<NFTPage />} />
          {/* <Route path="/auctions" element={<Auctions />} /> */}
          <Route path="/auctions" element={<Auctions />} />
          <Route path="/create-auction" element={<CreateAuction />} />
          <Route path="/for-sale" element={<Sale />} />
          <Route path="/your-nfts" element={<User />} />
          <Route path="/create" element={<CreateNFT />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
          <Route path="/resell" element={<ResellNFT />} />
          <Route path="/place-bid" element={<PlaceBid />} />
        </Routes>
      </div>
    </Router>
    // </NFTMarketPlaceProvider>

  )
}

export default App
