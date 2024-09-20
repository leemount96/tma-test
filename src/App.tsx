import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom'
import { useEffect } from 'react'
import bitcoinLogo from './assets/bitcoin.png'
import eulerLogo from './assets/euler.png'
import PointsPage from './components/PointsPage'
import './App.css'
import WebApp from '@twa-dev/sdk'

function App() {
  useEffect(() => {
    try {
      WebApp.ready();
      console.log('WebApp ready');
    } catch (error) {
      console.error('Error initializing WebApp:', error);
    }
  }, []);

  const checkWebApp = () => {
    try {
      WebApp.showAlert('WebApp is working!');
    } catch (error) {
      console.error('Error calling WebApp method:', error);
    }
  }

  return (
    <Router>
      <button onClick={checkWebApp} style={{position: 'fixed', top: 10, right: 10, zIndex: 9999}}>
        Check WebApp
      </button>
      <Routes>
        <Route path="/" element={
          <div className="landing-page">
            <div className="logo-container">
              <a href="https://bitcoin.org" target="_blank" rel="noopener noreferrer">
                <img src={bitcoinLogo} className="logo" alt="Bitcoin logo" />
              </a>
              <span className="logo-plus">+</span>
              <a href="http://euler.finance/" target="_blank" rel="noopener noreferrer">
                <img src={eulerLogo} className="logo" alt="Euler logo" />
              </a>
            </div>
            <h1>Welcome to ₿earn</h1>
            <Link to="/points" className="start-button">
              Start to ₿earn Points
            </Link>
          </div>
        } />
        <Route path="/points" element={<PointsPage />} />
      </Routes>
    </Router>
  )
}

export default App