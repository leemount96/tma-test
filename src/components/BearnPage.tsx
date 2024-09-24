import bitcoinLogo from '../assets/Bearn.png';
import eulerLogo from '../assets/euler.png';

function BearnPage() {
  return (
    <div className="page-container">
      <div className="logo-container">
        <img src={bitcoinLogo} className="logo" alt="Bitcoin logo" />
        <span className="logo-plus">+</span>
        <img src={eulerLogo} className="logo" alt="Euler logo" />
      </div>
      <div className="page-content">
        <h2 className="coming-soon">Coming Soon:</h2>
        <h3 className="coming-soon">Earning yield on bitcoin</h3>
        <h3 className="coming-soon">is better than ever</h3>
      </div>
    </div>
  );
}

export default BearnPage;