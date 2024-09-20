import { useState } from 'react'
import bitcoinLogo from './assets/bitcoin.png'
import eulerLogo from './assets/euler.png'
import oilBarrel from './assets/oil.png'
import './App.css'

import WebApp from '@twa-dev/sdk'

function App() {
  const [count, setCount] = useState(0)

  const incrementCount = () => {
    setCount((prevCount) => prevCount + 1)
    WebApp.showAlert(`Barrel clicked! Count is now ${count + 1}`)
  }

  return (
    <>
      <div>
        <a href="https://bitcoin.org" target="_blank">
          <img src={bitcoinLogo} className="logo" alt="Bitcoin logo" />
        </a>
        <a href="https://en.wikipedia.org/wiki/Leonhard_Euler" target="_blank">
          <img src={eulerLogo} className="logo" alt="Euler logo" />
        </a>
      </div>
      <h1>Welcome to ₿earn</h1>
      <div className="card">
        <img 
          src={oilBarrel} 
          alt="Oil Barrel" 
          className="oil-barrel" 
          onClick={incrementCount}
        />
        <p>₿earn points: {count}</p>
      </div>
    </>
  )
}

export default App