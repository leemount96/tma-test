import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useLocation } from 'react-router-dom';
import PointsPage from './components/PointsPage';
import BearnPage from './components/BearnPage';
import SharePage from './components/SharePage';
import bitcoinLogo from './assets/bitcoin.png';
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

declare global {
  interface Window {
    Telegram: {
      WebApp: any;
    }
  }
}

function App() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const initWebApp = async () => {
      try {
        console.log('Initializing WebApp...');
        
        // Use the global Telegram.WebApp object instead of the SDK
        const tgWebApp = window.Telegram.WebApp;
        console.log('Telegram WebApp object:', tgWebApp);
        
        if (typeof tgWebApp.ready === 'function') {
          tgWebApp.ready();
          console.log('WebApp initialized successfully');
        }
        
        const initDataString = tgWebApp.initData;
        console.log('WebApp.initData:', initDataString);
        
        if (initDataString) {
          try {
            // Parse the initData string
            const searchParams = new URLSearchParams(initDataString);
            const userString = searchParams.get('user');
            
            if (userString) {
              const user = JSON.parse(userString);
              if (user && user.id) {
                const telegramUserId = user.id.toString();
                console.log('Telegram User ID:', telegramUserId);
                setUserId(telegramUserId);
              } else {
                console.warn('User ID not found in parsed user data, using demo_user');
                setUserId('demo_user');
              }
            } else {
              console.warn('User data not found in initData, using demo_user');
              setUserId('demo_user');
            }
          } catch (parseError) {
            console.error('Error parsing initData:', parseError);
            setUserId('demo_user');
          }
        } else {
          console.warn('WebApp.initData is empty or undefined, using demo_user');
          setUserId('demo_user');
        }
        
        // Log initDataUnsafe for debugging
        console.log('WebApp.initDataUnsafe:', tgWebApp.initDataUnsafe);
        
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