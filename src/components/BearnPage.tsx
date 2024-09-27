import bitcoinLogo from '../assets/bitcoin.png';

function BearnPage({ userId }: { userId: string | null }) {
    console.log('BearnPage userId: ', userId);
  return (
    <div className="page-container">
      <div className="logo-container">
        <img src={bitcoinLogo} className="logo" alt="Bitcoin logo" />
      </div>
      <div className="content-container bearn-content">
        <h2 className="coming-soon-title">Coming Soon:</h2>
        <h3 className="feature-text" style={{ marginTop: '-10px' }}>Supercharged Bitcoin Yield</h3>
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