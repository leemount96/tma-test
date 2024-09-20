import { useState, useRef, useEffect } from 'react'
import bitcoinLogo from '../assets/bitcoin.png'
import eulerLogo from '../assets/euler.png'
import oilBarrel from '../assets/oil.png'

function Tooltip({ show }: { show: boolean }) {
  return (
    <div className={`tooltip ${show ? 'show' : ''}`}>
      Tap the barrel to start ₿earning points!
    </div>
  )
}

function PointsPage() {
  const [count, setCount] = useState(0)
  const [showTooltip, setShowTooltip] = useState(false)
  const [hasClicked, setHasClicked] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const barrelRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    if (!hasClicked) {
      const tooltipTimer = setTimeout(() => {
        setShowTooltip(true)
      }, 2000) // Show tooltip after 2 seconds if user hasn't clicked

      return () => clearTimeout(tooltipTimer)
    }
  }, [hasClicked])

  const createFloatingBitcoin = (startX: number, startY: number, angle: number) => {
    if (!containerRef.current) return

    const bitcoin = document.createElement('img')
    bitcoin.src = bitcoinLogo
    bitcoin.className = 'floating-bitcoin'
    
    const distance = 50 + Math.random() * 100
    const endX = startX + Math.cos(angle) * distance
    const endY = startY + Math.sin(angle) * distance

    bitcoin.style.left = `${startX}px`
    bitcoin.style.top = `${startY}px`
    bitcoin.style.setProperty('--start-x', `${startX}px`)
    bitcoin.style.setProperty('--start-y', `${startY}px`)
    bitcoin.style.setProperty('--end-x', `${endX}px`)
    bitcoin.style.setProperty('--end-y', `${endY}px`)

    containerRef.current.appendChild(bitcoin)

    setTimeout(() => bitcoin.remove(), 1000)
  }

  const incrementCount = () => {
    setCount((prevCount) => prevCount + 1)
    setShowTooltip(false)
    setHasClicked(true)
    const numBitcoins = 15
    
    if (containerRef.current && barrelRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const barrelRect = barrelRef.current.getBoundingClientRect()

      const centerX = barrelRect.left - containerRect.left + barrelRect.width / 2
      const centerY = barrelRect.top - containerRect.top + barrelRect.height / 2

      for (let i = 0; i < numBitcoins; i++) {
        const angle = (i / numBitcoins) * Math.PI * 2
        createFloatingBitcoin(centerX, centerY, angle)
      }
    }
  }

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
  )
}

export default PointsPage