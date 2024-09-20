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
  const containerRef = useRef<HTMLDivElement>(null)
  const barrelRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const tooltipTimer = setTimeout(() => {
      setShowTooltip(true)
    }, 2000) // Show tooltip after 2 seconds

    const cleanup = () => {
      const floatingBitcoins = document.querySelectorAll('.floating-bitcoin')
      floatingBitcoins.forEach(bitcoin => bitcoin.remove())
      clearTimeout(tooltipTimer)
    }

    return cleanup
  }, [])

  const createFloatingBitcoin = (x: number, y: number, angle: number) => {
    if (!containerRef.current) return

    const bitcoin = document.createElement('img')
    bitcoin.src = bitcoinLogo
    bitcoin.className = 'floating-bitcoin'
    
    bitcoin.style.left = `${x}px`
    bitcoin.style.top = `${y}px`

    const distance = 50 + Math.random() * 100
    const endX = x + Math.cos(angle) * distance
    const endY = y + Math.sin(angle) * distance

    bitcoin.style.setProperty('--start-x', `${x}px`)
    bitcoin.style.setProperty('--start-y', `${y}px`)
    bitcoin.style.setProperty('--end-x', `${endX}px`)
    bitcoin.style.setProperty('--end-y', `${endY}px`)

    containerRef.current.appendChild(bitcoin)

    setTimeout(() => bitcoin.remove(), 1000)
  }

  const incrementCount = () => {
    setCount((prevCount) => prevCount + 1)
    setShowTooltip(false) // Hide tooltip when barrel is clicked
    const numBitcoins = 15
    
    if (containerRef.current && barrelRef.current) {
      const containerRect = containerRef.current.getBoundingClientRect()
      const barrelRect = barrelRef.current.getBoundingClientRect()

      // Calculate the center of the barrel
      const centerX = barrelRect.width / 2
      const centerY = barrelRect.height / 2

      // Calculate the explosion start point (center of the barrel)
      const startX = barrelRect.left - containerRect.left + centerX
      const startY = barrelRect.top - containerRect.top + centerY

      for (let i = 0; i < numBitcoins; i++) {
        const angle = (i / numBitcoins) * Math.PI * 2
        createFloatingBitcoin(startX, startY, angle)
      }
    }
  }

  return (
    <div className="points-page" ref={containerRef}>
      <div className="logo-container">
        <img src={bitcoinLogo} className="logo" alt="Bitcoin logo" />
        <span className="logo-plus">+</span>
        <img src={eulerLogo} className="logo" alt="Euler logo" />
      </div>
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
  )
}

export default PointsPage