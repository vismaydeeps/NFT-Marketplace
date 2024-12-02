import React from 'react'
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
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const App = () => {
  return (
    // <>
    <Router>
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<LeaderBoard />} />
          <Route path="/auctions" element={<Auctions />} />
          <Route path="/for-sale" element={<Sale />} />
          <Route path="/your-nfts" element={<User />} />
          <Route path="/create" element={<CreateNFT />} />
          <Route path="/login" element={<Login />} />
          <Route path="/create-account" element={<CreateAccount />} />
        </Routes>
      </div>
    </Router>
      
  )
}

export default App
