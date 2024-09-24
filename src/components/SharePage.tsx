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
      setReferralLink(`https://example.com/referral?user=${userId}`);
    }
  }, []);

  const copyReferralLink = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      WebApp.showAlert('Referral link copied to clipboard!');
    }).catch(() => {
      WebApp.showAlert('Failed to copy referral link.');
    });
  };

  return (
    <div>
      <img src={bitcoinLogo} alt="Bitcoin Logo" />
      <img src={eulerLogo} alt="Euler Logo" />
      <button onClick={copyReferralLink}>Copy Referral Link</button>
    </div>
  );
}

export default SharePage;