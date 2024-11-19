import React from 'react'
import "./App.css";
import Navbar from './components/Navbar/Navbar'
import LeaderBoard from './components/LeaderBoard/LeaderBoard'
import Login from './components/Login/Login';
import CreateAccount from './components/CreateAccount/CreateAccount';

const App = () => {
  return (
    <>
      {/* <Navbar />
      <div className="content">
      <LeaderBoard />
      </div> */}
      {/* <Login /> */}
      <CreateAccount />
    </>
  )
}

export default App
