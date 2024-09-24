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
            setCount(docSnap.data().points);
          }
        }
      } catch (error) {
        console.error("Error fetching points:", error);
        // Handle the error appropriately
      }
    };
    fetchPoints();
  }, [userId]);

  const savePoints = async (newCount: number) => {
    if (userId) {
      await setDoc(doc(db, 'users', userId), { points: newCount });
    }
  };

  const incrementCount = () => {
    setCount((prevCount) => {
      const newCount = prevCount + 1;
      savePoints(newCount);
      return newCount;
    });
    setShowTooltip(false);
    const numBitcoins = 30;

    if (containerRef.current && barrelRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect();
      const barrelRect = barrelRef.current.getBoundingClientRect();

      const centerX = barrelRect.left - containerRect.left + barrelRect.width / 2;
      const centerY = barrelRect.top - containerRect.top + barrelRect.height / 2;

      for (let i = 0; i < numBitcoins; i++) {
        const angle = (i / numBitcoins) * Math.PI * 2;
        createFloatingBitcoin(centerX, centerY, angle);
      }
    }
  };

  const createFloatingBitcoin = (startX: number, startY: number, angle: number) => {
    if (!containerRef.current) return;

    const bitcoin = document.createElement('img');
    bitcoin.src = bitcoinLogo;
    bitcoin.className = 'floating-bitcoin';

    const distance = 100 + Math.random() * 150; // Increased distance
    const endX = startX + Math.cos(angle) * distance;
    const endY = startY + Math.sin(angle) * distance;

    bitcoin.style.left = `${startX}px`;
    bitcoin.style.top = `${startY}px`;
    bitcoin.style.setProperty('--start-x', `${startX}px`);
    bitcoin.style.setProperty('--start-y', `${startY}px`);
    bitcoin.style.setProperty('--end-x', `${endX}px`);
    bitcoin.style.setProperty('--end-y', `${endY}px`);

    containerRef.current.appendChild(bitcoin);

    setTimeout(() => bitcoin.remove(), 1500); // Increased duration
  };

  return (
    <div className="page-container" ref={containerRef}>
      <div className="logo-container">
        <img src={bitcoinLogo} className="logo" alt="Bitcoin logo" />
        <span className="logo-plus">+</span>
        <img src={eulerLogo} className="logo" alt="Euler logo" />
      </div>
      <div className="page-content">
        <div className="barrel-container">
          <img
            ref={barrelRef}
            src={oilBarrel}
            alt="Oil Barrel"
            className="oil-barrel"
            onClick={incrementCount}
          />
          <Tooltip show={showTooltip} />
        </div>
        <div className="points-display">
          <span className="points-label">Points:</span>
          <span className="points-value">{count}</span>
        </div>
      </div>
    </div>
  );
}

export default PointsPage;