import { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import bitcoinLogo from '../assets/bitcoin.png'
import eulerLogo from '../assets/euler.png'
import oilBarrel from '../assets/oil.png'

function PointsPage() {
  const [count, setCount] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const cleanup = () => {
      const floatingBitcoins = document.querySelectorAll('.floating-bitcoin')
      floatingBitcoins.forEach(bitcoin => bitcoin.remove())
    }

    return cleanup
  }, [])

  const createFloatingBitcoin = (x: number, y: number, angle: number) => {
    if (!containerRef.current) return

    const bitcoin = document.createElement('img')
    bitcoin.src = bitcoinLogo
    bitcoin.className = 'floating-bitcoin'
    
    const containerRect = containerRef.current.getBoundingClientRect()

    const startX = x - containerRect.left
    const startY = y - containerRect.top

    bitcoin.style.left = `${startX}px`
    bitcoin.style.top = `${startY}px`

    const distance = 50 + Math.random() * 100
    const endX = startX + Math.cos(angle) * distance
    const endY = startY + Math.sin(angle) * distance

    bitcoin.style.setProperty('--start-x', `${startX}px`)
    bitcoin.style.setProperty('--start-y', `${startY}px`)
    bitcoin.style.setProperty('--end-x', `${endX}px`)
    bitcoin.style.setProperty('--end-y', `${endY}px`)

    containerRef.current.appendChild(bitcoin)

    setTimeout(() => bitcoin.remove(), 1000)
  }

  const incrementCount = (e: React.MouseEvent<HTMLImageElement>) => {
    setCount((prevCount) => prevCount + 1)
    const numBitcoins = 15
    const clickX = e.clientX
    const clickY = e.clientY
    for (let i = 0; i < numBitcoins; i++) {
      const angle = (i / numBitcoins) * Math.PI * 2
      createFloatingBitcoin(clickX, clickY, angle)
    }
  }

  return (
    <div className="points-page" ref={containerRef}>
      <div className="logo-container">
        <a href="https://bitcoin.org" target="_blank" rel="noopener noreferrer">
          <img src={bitcoinLogo} className="logo" alt="Bitcoin logo" />
        </a>
        <span className="logo-plus">+</span>
        <a href="http://euler.finance/" target="_blank" rel="noopener noreferrer">
          <img src={eulerLogo} className="logo" alt="Euler logo" />
        </a>
      </div>
      <div className="card">
        <img 
          src={oilBarrel} 
          alt="Oil Barrel" 
          className="oil-barrel" 
          onClick={incrementCount}
        />
        <p>₿earn points: {count}</p>
      </div>
      <Link to="/" className="back-button">
        Back to Home
      </Link>
    </div>
  )
}

export default PointsPage