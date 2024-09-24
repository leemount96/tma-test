import { useState, useRef, useEffect } from 'react';
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
            const response = await fetch(`https://${process.env.VERCEL_URL}/api/getPoints?userId=${userId}`);
            if (!response.ok) {
              throw new Error('Failed to fetch points');
            }
            const data = await response.json();
            setCount(data.points);
          }
        } catch (error) {
          console.error("Error fetching points:", error);
        }
      };
    fetchPoints();
  }, [userId]);

  const savePoints = async (newCount: number) => {
    if (userId) {
      try {
        const response = await fetch('https://your-vercel-url.vercel.app/api/updatePoints', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ userId, points: newCount }),
        });
        if (!response.ok) {
          throw new Error('Failed to update points');
        }
      } catch (error) {
        console.error("Error saving points:", error);
      }
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

    if (barrelRef.current) {
      const barrelRect = barrelRef.current.getBoundingClientRect();
      
      // Add clicked class for bounce animation
      barrelRef.current.classList.add('clicked');
      setTimeout(() => {
        barrelRef.current?.classList.remove('clicked');
      }, 300);

      // Calculate click position relative to the barrel
      const clickX = event.clientX - barrelRect.left;
      const clickY = event.clientY - barrelRect.top;

      for (let i = 0; i < numBitcoins; i++) {
        const angle = (i / numBitcoins) * Math.PI * 2;
        createFloatingBitcoin(clickX, clickY, angle, barrelRect);
      }
    }
  };

  const createFloatingBitcoin = (startX: number, startY: number, angle: number, barrelRect: DOMRect) => {
    if (!containerRef.current) return;

    const bitcoin = document.createElement('img');
    bitcoin.src = bitcoinLogo;
    bitcoin.className = 'floating-bitcoin';

    const distance = 100 + Math.random() * 150; // Reverted to original larger distance
    const endX = startX + Math.cos(angle) * distance;
    const endY = startY + Math.sin(angle) * distance;

    bitcoin.style.setProperty('--start-x', `${startX}px`);
    bitcoin.style.setProperty('--start-y', `${startY}px`);
    bitcoin.style.setProperty('--end-x', `${endX - startX}px`);
    bitcoin.style.setProperty('--end-y', `${endY - startY}px`);

    // Position the bitcoin relative to the viewport
    bitcoin.style.position = 'fixed';
    bitcoin.style.left = `${barrelRect.left + startX - 15}px`;
    bitcoin.style.top = `${barrelRect.top + startY - 15}px`;

    document.body.appendChild(bitcoin);

    setTimeout(() => bitcoin.remove(), 1500);
  };

  return (
    <div className="page-container">
      <div className="logo-container">
        <img src={bitcoinLogo} className="logo" alt="Bitcoin logo" />
        <span className="logo-plus">+</span>
        <img src={eulerLogo} className="logo" alt="Euler logo" />
      </div>
      <div className="content-container points-content" ref={containerRef}>
        <div className="points-display">
          <span className="points-label">Points: </span>
          <span className="points-value">{count}</span>
        </div>
        <div className="barrel-container" onClick={incrementCount}>
          <img
            ref={barrelRef}
            src={oilBarrel}
            alt="Oil Barrel"
            className="barrel-image oil-barrel"
          />
          <Tooltip show={showTooltip} />
        </div>
        <div className="feature-list">
          <div className="feature-item">🎯 Tap to earn more points!</div>
          <div className="feature-item">🏆 Unlock exciting rewards</div>
        </div>
      </div>
    </div>
  );
}

export default PointsPage;