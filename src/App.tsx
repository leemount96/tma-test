import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import WebApp from '@twa-dev/sdk';
import PointsPage from './components/PointsPage';
import BearnPage from './components/BearnPage';
import SharePage from './components/SharePage';
import bitcoinLogo from './assets/Bearn.png';
import eulerLogo from './assets/euler.png';
import './App.css';

function NavBar() {
  const location = useLocation();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const paths = ['/', '/points', '/bearn', '/share'];
    const index = paths.indexOf(location.pathname);
    setActiveIndex(index !== -1 ? index : 0);
  }, [location]);

  return (
    <nav className="bottom-nav">
      <Link to="/" className={location.pathname === '/' ? 'active' : ''}>
        🏠 Home
      </Link>
      <Link to="/points" className={location.pathname === '/points' ? 'active' : ''}>
        ⭐ Points
      </Link>
      <Link to="/bearn" className={location.pathname === '/bearn' ? 'active' : ''}>
        💰 Bearn
      </Link>
      <Link to="/share" className={location.pathname === '/share' ? 'active' : ''}>
        🔗 Share
      </Link>
      <div className="nav-indicator" style={{ left: `calc(${activeIndex * 25}% + 40px)` }}></div>
    </nav>
  );
}

function HomePage() {
  return (
    <div className="page-container home-page">
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
  );
}

function App() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initWebApp = async () => {
      try {
        console.log('Initializing WebApp...');
        await WebApp.ready();
        console.log('WebApp initialized successfully');
        setIsReady(true);
      } catch (err) {
        console.error('Error initializing WebApp:', err);
        setError('Failed to initialize WebApp');
      }
    };

    initWebApp();
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!isReady) {
    return <div>Loading...</div>;
  }

  return (
    <Router basename="/tma-test">
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/points" element={<PointsPage />} />
          <Route path="/bearn" element={<BearnPage />} />
          <Route path="/share" element={<SharePage />} />
        </Routes>
        <NavBar />
      </div>
    </Router>
  );
}

export default App;