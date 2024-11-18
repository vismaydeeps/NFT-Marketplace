import React from 'react'
import "./App.css";
import Navbar from './components/Navbar/Navbar'
import LeaderBoard from './components/LeaderBoard/LeaderBoard'

const App = () => {
  return (
    <>
      <Navbar />
      <div className="content">
      <LeaderBoard />
      </div>
    </>
  )
}

export default App
