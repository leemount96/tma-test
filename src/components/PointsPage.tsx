import  { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import bitcoinLogo from '../assets/bitcoin.png'
import eulerLogo from '../assets/euler.png'
import oilBarrel from '../assets/oil.png'

function PointsPage() {
  const [count, setCount] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const barrelRef = useRef<HTMLImageElement>(null)

  useEffect(() => {
    const cleanup = () => {
      const floatingBitcoins = document.querySelectorAll('.floating-bitcoin')
      floatingBitcoins.forEach(bitcoin => bitcoin.remove())
    }

    return cleanup
  }, [])

  const createFloatingBitcoin = () => {
    if (!containerRef.current || !barrelRef.current) return

    const bitcoin = document.createElement('img')
    bitcoin.src = bitcoinLogo
    bitcoin.className = 'floating-bitcoin'
    
    const containerRect = containerRef.current.getBoundingClientRect()
    const barrelRect = barrelRef.current.getBoundingClientRect()

    const startX = barrelRect.left - containerRect.left + barrelRect.width / 2
    const startY = barrelRect.top - containerRect.top + barrelRect.height / 2

    bitcoin.style.left = `${startX}px`
    bitcoin.style.top = `${startY}px`

    const angle = Math.random() * Math.PI * 2
    const distance = 50 + Math.random() * 100
    const endX = startX + Math.cos(angle) * distance
    const endY = startY + Math.sin(angle) * distance

    bitcoin.style.setProperty('--end-x', `${endX}px`)
    bitcoin.style.setProperty('--end-y', `${endY}px`)

    containerRef.current.appendChild(bitcoin)

    setTimeout(() => bitcoin.remove(), 1000)
  }

  const incrementCount = () => {
    setCount((prevCount) => prevCount + 1)
    for (let i = 0; i < 15; i++) {
      setTimeout(() => createFloatingBitcoin(), i * 50)
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
          ref={barrelRef}
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