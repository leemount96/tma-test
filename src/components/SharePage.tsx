import { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import bitcoinLogo from '../assets/Bearn.png';
import eulerLogo from '../assets/euler.png';

function SharePage() {
  const [referralLink, setReferralLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [shareCount, setShareCount] = useState(0);

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
      setShareCount(prevCount => prevCount + 1);
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
      <div className="share-content">
        <h2 className="share-title">Spread the ₿earn Love!</h2>
        <div className="reward-info">
          <h3>🎉 Earn 100 Points per Referral! 🎉</h3>
        </div>
        <div className="referral-link-container">
          <input type="text" value={referralLink} readOnly className="referral-input" />
          <button 
            onClick={copyToClipboard}
            className={`copy-button ${isCopied ? 'copied' : ''}`}
          >
            {isCopied ? 'Copied!' : 'Copy'}
          </button>
        </div>
        <div className="share-stats">
          <p>Shares: {shareCount} | Keep climbing!</p>
        </div>
        <div className="share-benefits">
          <ul>
            <li>💰 Earn points for referrals</li>
            <li>🏆 Unlock exclusive rewards</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default SharePage;