import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom'
import bitcoinLogo from './assets/bitcoin.png'
import eulerLogo from './assets/euler.png'
import PointsPage from './components/PointsPage'
import './App.css'

function App() {
  return (
    <Router>
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