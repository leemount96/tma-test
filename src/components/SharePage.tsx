import { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import bitcoinLogo from '../assets/Bearn.png';
import eulerLogo from '../assets/euler.png';

function SharePage() {
  const [referralLink, setReferralLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    const initData = WebApp.initData;
    let userId = 'unknown';

    if (typeof initData === 'object' && initData.user && initData.user.id) {
      userId = initData.user.id.toString();
    } else {
      console.error('User data not available in WebApp.initData');
    }
    
    const baseUrl = 'https://t.me/Bearn_Bot';
    const generatedLink = `${baseUrl}?start=ref_${userId}`;
    setReferralLink(generatedLink);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    }, (err) => {
      console.error('Could not copy text: ', err);
      WebApp.showAlert('Failed to copy referral link.');
    });
  };

  return (
    <div className="page-container">
      <div className="logo-container">
        <img src={bitcoinLogo} className="logo" alt="Bitcoin logo" />
        <span className="logo-plus">+</span>
        <img src={eulerLogo} className="logo" alt="Euler logo" />
      </div>
      <div className="content-container share-content">
        <h2 className="share-title">Invite Friends & Earn!</h2>
        <div className="share-card">
          <p className="share-reward">🎉 Earn 100 Points per Referral!</p>
          <div className="referral-link-container">
            <input type="text" value={referralLink} readOnly className="referral-input" />
            <button 
              onClick={copyToClipboard}
              className={`copy-button ${isCopied ? 'copied' : ''}`}
            >
              {isCopied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
        <div className="feature-list">
          <div className="feature-item">💰 Earn points for each friend</div>
          <div className="feature-item">🏆 Unlock exclusive rewards</div>
          <div className="feature-item">🚀 Help friends boost earnings</div>
        </div>
      </div>
    </div>
  );
}

export default SharePage;