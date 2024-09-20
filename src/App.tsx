import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import bitcoinLogo from './assets/bitcoin.png'
import eulerLogo from './assets/euler.png'
import PointsPage from './components/PointsPage'
import './App.css'
import WebApp from '@twa-dev/sdk'

function App() {
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      WebApp.ready();
      console.log('WebApp ready');
    } catch (e) {
      console.error('Error initializing WebApp:', e);
      setError('Failed to initialize WebApp');
    }
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <Router>
      <Routes>
        <Route path="/" element={
          <div className="landing-page">
            <div className="logo-container">
              <img src={bitcoinLogo} className="logo" alt="Bitcoin logo" onError={() => console.error('Failed to load Bitcoin logo')} />
              <span className="logo-plus">+</span>
              <img src={eulerLogo} className="logo" alt="Euler logo" onError={() => console.error('Failed to load Euler logo')} />
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