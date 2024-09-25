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
      <div 
        className="nav-indicator" 
        style={{ 
          left: `${activeIndex * 25}%`,
          transform: 'translateX(0%)'
        }}
      ></div>
    </nav>
  );
}

function HomePage() {
  return (
    <div className="page-container home-page">
      <div className="home-content">
        <div className="logo-container">
          <img src={bitcoinLogo} className="logo" alt="Bitcoin logo" />
          <span className="logo-plus">+</span>
          <img src={eulerLogo} className="logo" alt="Euler logo" />
        </div>
        <h1>Welcome to ₿earn</h1>
        <div className="home-features">
          <div className="feature-item">🚀 Earn points daily</div>
          <div className="feature-item">🤝 Share with friends</div>
          <div className="feature-item">🏆 Climb the leaderboard</div>
          <div className="feature-item">🔥 More coming soon!</div>
        </div>
        <Link to="/points" className="start-button">
          Start ₿earning Now!
        </Link>
      </div>
    </div>
  );
}

function App() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const initWebApp = async () => {
      try {
        console.log('Initializing WebApp...');
        
        if (typeof WebApp.ready === 'function') {
          await WebApp.ready();
          console.log('WebApp initialized successfully');
        } else {
          console.log('WebApp.ready() not available, continuing without initialization');
        }
        
        // Access initData
        const initDataString = WebApp.initData;
        console.log('Raw initData:', initDataString);
        
        let initData;
        if (typeof initDataString === 'string') {
          try {
            initData = JSON.parse(decodeURIComponent(initDataString));
          } catch (parseError) {
            console.error('Error parsing initData string:', parseError);
          }
        } else if (typeof initDataString === 'object') {
          initData = initDataString;
        }
        
        if (initData && initData.user && initData.user.id) {
          const newUserId = initData.user.id.toString();
          console.log('Extracted user ID:', newUserId);
          setUserId(newUserId);

          // Check for referral
          const urlParams = new URLSearchParams(window.location.search);
          const referrerId = urlParams.get('ref');
          if (referrerId) {
            try {
              const response = await fetch(`https://first-tma-five.vercel.app/api/checkReferral?userId=${newUserId}&referrerId=${referrerId}`);
              const data = await response.json();
              console.log('Referral check result:', data);
              if (data.pointsAdded > 0) {
                console.log(`${data.pointsAdded} points added to referrer!`);
                // You can show a notification here if points were added
              }
            } catch (error) {
              console.error('Error checking referral:', error);
            }
          }
        } else {
          console.warn('User ID not found in initData');
          setUserId('demo_user');
        }
        
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
          <Route path="/points" element={<PointsPage userId={userId} />} />
          <Route path="/bearn" element={<BearnPage userId={userId} />} />
          <Route path="/share" element={<SharePage userId={userId} />} />
        </Routes>
        <NavBar />
      </div>
    </Router>
  );
}

export default App;