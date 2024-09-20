import { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import bitcoinLogo from '../assets/bitcoin.png';
import eulerLogo from '../assets/euler.png';

function SharePage() {
  const [referralLink, setReferralLink] = useState('');

  useEffect(() => {
    const initData = WebApp.initData;
    const parsedInitData = new URLSearchParams(initData);
    const userDataString = parsedInitData.get('user');
    let userId = 'unknown';

    if (userDataString) {
      try {
        const userData = JSON.parse(userDataString);
        userId = userData.id?.toString() || 'unknown';
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
    
    // Generate a referral link using the user's ID
    const baseUrl = 'https://t.me/tma_test_test_bot'; // Replace with your bot's username
    const generatedLink = `${baseUrl}?start=ref_${userId}`;
    setReferralLink(generatedLink);
  }, []);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      WebApp.showAlert('Referral link copied to clipboard!');
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
      <div className="page-content">
        <h2>Share ₿earn</h2>
        <p>Share your referral link with friends:</p>
        <div className="referral-link">
          <input type="text" value={referralLink} readOnly />
          <button onClick={copyToClipboard}>Copy</button>
        </div>
      </div>
    </div>
  );
}

export default SharePage;