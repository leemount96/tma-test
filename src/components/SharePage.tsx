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
    
    // Generate a referral link using the user's ID
    const baseUrl = 'https://t.me/Bearn_Bot'; // Replace with your bot's username
    const generatedLink = `${baseUrl}?start=ref_${userId}`;
    setReferralLink(generatedLink);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000); // Reset after 2 seconds
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
      <h2>Share ₿earn</h2>
      <p>Share your referral link with friends:</p>
      <div className="referral-link">
        <input type="text" value={referralLink} readOnly />
        <button 
          onClick={copyToClipboard}
          className={isCopied ? 'copied' : ''}
        >
          {isCopied ? 'Copied!' : 'Copy'}
        </button>
      </div>
    </div>
  );
}

export default SharePage;