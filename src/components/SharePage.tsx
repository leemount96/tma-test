import bitcoinLogo from '../assets/bitcoin.png';
import eulerLogo from '../assets/euler.png';

function SharePage() {
  return (
    <div className="page-container">
      <div className="logo-container">
        <img src={bitcoinLogo} className="logo" alt="Bitcoin logo" />
        <span className="logo-plus">+</span>
        <img src={eulerLogo} className="logo" alt="Euler logo" />
      </div>
      <h2 className="coming-soon">Coming Soon!</h2>
    </div>
  );
}

export default SharePage;