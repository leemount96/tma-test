import { useState, useEffect } from 'react';
import bitcoinLogo from '../assets/Bearn.png';
import eulerLogo from '../assets/euler.png';

function SharePage({ userId }: { userId: string | null }) {
  const [referralLink, setReferralLink] = useState('');
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      const baseUrl = 'https://t.me/Bearn_Bot';
      const generatedLink = `${baseUrl}?start=ref_${userId}`;
      setReferralLink(generatedLink);
    } else {
      setError('User ID not available. Unable to generate referral link.');
    }
  }, [userId]);

  const copyToClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(referralLink).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      }, (err) => {
        console.error('Could not copy text: ', err);
        setError('Failed to copy referral link.');
      });
    } else {
      setError('Clipboard functionality not available in this environment.');
    }
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
        {error && <div className="error-message">{error}</div>}
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