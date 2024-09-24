import { useState, useEffect } from 'react';
import WebApp from '@twa-dev/sdk';
import bitcoinLogo from '../assets/Bearn.png';
import eulerLogo from '../assets/euler.png';

function SharePage() {
  const [referralLink, setReferralLink] = useState('');

  useEffect(() => {
    const initData = WebApp.initData;
    if (initData.user) {
      const userId = initData.user.id;
      // Generate the referral link using the bot's username and the user's ID
      const botUsername = 'Bearn_Bot'; // Replace with your actual bot username if different
      setReferralLink(`https://t.me/${botUsername}?start=ref_${userId}`);
    }
  }, []);

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      // Remove the confirmation pop-up and prevent the app from closing
      WebApp.showAlert('Referral link copied to clipboard!', { keepAppOpen: true });
    }).catch(() => {
      WebApp.showAlert('Failed to copy referral link.', { keepAppOpen: true });
    });
  };

  return (
    <div className="page-container">
      <div className="logo-container">
        <img src={bitcoinLogo} className="logo" alt="Bitcoin Logo" />
        <span className="logo-plus">+</span>
        <img src={eulerLogo} className="logo" alt="Euler Logo" />
      </div>
      <div className="page-content">
        <div className="referral-link">
          <input type="text" value={referralLink} readOnly />
          <button onClick={copyReferralLink}>Copy Referral Link</button>
        </div>
      </div>
    </div>
  );
}

export default SharePage;