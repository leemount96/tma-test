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
      <div className="content-container bearn-content">
        <h2 className="coming-soon-title">Coming Soon:</h2>
        <h3 className="feature-text">Supercharged Bitcoin Yield</h3>
        <div className="feature-list">
          <div className="feature-item">🚀 Boost Earnings</div>
          <div className="feature-item">🔒 Enhanced Security</div>
          <div className="feature-item">💡 Innovative Strategies</div>
        </div>
        <button className="cta-button">Get Notified</button>
      </div>
    </div>
  );
}

export default BearnPage;