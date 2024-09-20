import { useEffect, useState } from 'react';
import { HashRouter as Router, Route, Routes, Link } from 'react-router-dom';
import WebApp from '@twa-dev/sdk';
import PointsPage from './components/PointsPage';
import bitcoinLogo from './assets/bitcoin.png';
import eulerLogo from './assets/euler.png';
import './App.css';

function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    WebApp.ready();
    setIsReady(true);
  }, []);

  if (!isReady) {
    return <div>Loading...</div>;
  }

  return (
    <Router>
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
  );
}

export default App;