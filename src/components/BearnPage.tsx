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
        <h2 className="coming-soon-title">Get Ready for Something Big!</h2>
        <div className="coming-soon-container">
          <h3 className="coming-soon-text">Coming Soon:</h3>
          <h3 className="feature-text">Supercharged Bitcoin Yield</h3>
          <p className="feature-description">
            Earn like never before with our revolutionary approach to Bitcoin yield.
          </p>
        </div>
        <div className="feature-list">
          <div className="feature-item">🚀 Boost Your Earnings</div>
          <div className="feature-item">🔒 Enhanced Security</div>
          <div className="feature-item">💡 Innovative Strategies</div>
        </div>
        <div className="cta-container">
          <button className="cta-button">Get Notified</button>
        </div>
      </div>
    </div>
  );
}

export default BearnPage;