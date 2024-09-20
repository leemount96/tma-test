import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom'
import bitcoinLogo from './assets/bitcoin.png'
import eulerLogo from './assets/euler.png'
import PointsPage from './components/PointsPage'
import './App.css'
import WebApp from '@twa-dev/sdk'

function App() {
  WebApp.ready();

  return (
    <Router basename="/tma-test">
      <Routes>
        <Route path="/" element={
          <div className="landing-page">
            <div className="logo-container">
              <img src={bitcoinLogo} className="logo" alt="Bitcoin logo" />
              <span className="logo-plus">+</span>
              <img src={eulerLogo} className="logo" alt="Euler logo" />
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