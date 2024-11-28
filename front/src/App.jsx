import React from 'react'
import "./App.css";
import Navbar from './components/Navbar/Navbar'
import LeaderBoard from './components/LeaderBoard/LeaderBoard'
import Login from './components/Login/Login';
import CreateAccount from './components/CreateAccount/CreateAccount';
import Auctions from './components/Auctions/Auctions';
import ViewBids from './components/Auctions/ViewBids/ViewBids';

const App = () => {
  return (
    <>
      <Navbar />
      <div className="content">
        {/* <LeaderBoard /> */}
        <Auctions />
        
      </div>
      {/* <Login /> */}
      {/* <CreateAccount /> */}
    </>
  )
}

export default App
