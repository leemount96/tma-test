import { useState, useRef, useEffect } from 'react';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../firebaseConfig';
import bitcoinLogo from '../assets/Bearn.png';
import eulerLogo from '../assets/euler.png';
import oilBarrel from '../assets/oil.png';

function Tooltip({ show }: { show: boolean }) {
  return (
    <div className={`tooltip ${show ? 'show' : ''}`}>
      Tap the barrel to start ₿earning points!
    </div>
  )
}

function PointsPage() {
  const [count, setCount] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const barrelRef = useRef<HTMLImageElement>(null);

  const userId = new URLSearchParams(window.location.search).get('userId');

  useEffect(() => {
    const fetchPoints = async () => {
      try {
        if (userId) {
          const docRef = doc(db, 'users', userId);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const points = docSnap.data().points;
            setCount(points);
            if (points === 0) {
              const tooltipTimer = setTimeout(() => {
                setShowTooltip(true);
              }, 3000);
              return () => clearTimeout(tooltipTimer);
            }
          }
        }
      } catch (error) {
        console.error("Error fetching points:", error);
      }
    };
    fetchPoints();
  }, [userId]);

  const savePoints = async (newCount: number) => {
    if (userId) {
      await setDoc(doc(db, 'users', userId), { points: newCount });
    }
  };

  const incrementCount = (event: React.MouseEvent<HTMLDivElement>) => {
    setCount((prevCount) => {
      const newCount = prevCount + 1;
      savePoints(newCount);
      return newCount;
    });
    setShowTooltip(false);
    const numBitcoins = 30;

    if (containerRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      
      // Calculate click position relative to the container
      const clickX = event.clientX - containerRect.left;
      const clickY = event.clientY - containerRect.top;

      for (let i = 0; i < numBitcoins; i++) {
        const angle = (i / numBitcoins) * Math.PI * 2;
        createFloatingBitcoin(clickX, clickY, angle);
      }
    }
  };

  const createFloatingBitcoin = (startX: number, startY: number, angle: number) => {
    if (!containerRef.current) return;

    const bitcoin = document.createElement('img');
    bitcoin.src = bitcoinLogo;
    bitcoin.className = 'floating-bitcoin';

    const distance = 100 + Math.random() * 150;
    const endX = startX + Math.cos(angle) * distance;
    const endY = startY + Math.sin(angle) * distance;

    bitcoin.style.setProperty('--start-x', `${startX}px`);
    bitcoin.style.setProperty('--start-y', `${startY}px`);
    bitcoin.style.setProperty('--end-x', `${endX}px`);
    bitcoin.style.setProperty('--end-y', `${endY}px`);

    // Position the bitcoin relative to the container
    bitcoin.style.left = `${startX - 15}px`; // 15 is half the width of the bitcoin
    bitcoin.style.top = `${startY - 15}px`; // 15 is half the height of the bitcoin

    containerRef.current.appendChild(bitcoin);

    setTimeout(() => bitcoin.remove(), 1500);
  };

  return (
    <div className="page-container">
      <div className="logo-container">
        <img src={bitcoinLogo} className="logo" alt="Bitcoin logo" />
        <span className="logo-plus">+</span>
        <img src={eulerLogo} className="logo" alt="Euler logo" />
      </div>
      <div className="content-container" ref={containerRef}>
        <div className="barrel-container" onClick={incrementCount}>
          <img
            ref={barrelRef}
            src={oilBarrel}
            alt="Oil Barrel"
            className="oil-barrel"
          />
          <Tooltip show={showTooltip} />
        </div>
        <div className="points-display">
          <span className="points-label">Points: </span>
          <span className="points-value">{count}</span>
        </div>
      </div>
    </div>
  );
}

export default PointsPage;