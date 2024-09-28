'use client';

import { useEffect, useState } from 'react';
import { useTelegram } from '../TelegramProvider'; // Import useTelegram hook
import { QRCodeSVG } from 'qrcode.react';
export default function ReferralPage() {
  const { user, webApp } = useTelegram();// Get user from context
  const [referralLink, setReferralLink] = useState('');
  const [referredUsers, setReferredUsers] = useState([]); // New state for referred users

  useEffect(() => {
    if (user?.id) {
      // Generate the referral link using the user's Telegram ID
      const link = `https://t.me/fomoflip_bot/arafat?start=${user.id}`;
      setReferralLink(link);
    }
  }, [user?.id]);

  useEffect(() => {
    const fetchReferredUsers = async () => {
      if (user?.id) {
        const response = await fetch(`/api/referral/referred?referrerId=${user.id}`);
        const data = await response.json();
        if (data.users) {
          setReferredUsers(data.users.slice(0, 10)); // Get the first 10 referred users
        }
      }
    };
    fetchReferredUsers();
  }, [user?.id]);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    webApp?.showPopup({ message: 'Referral link copied to clipboard!' });
  };

  const shareLink = () => {
    if (webApp?.shareUrl) {
      webApp.shareUrl(referralLink);
    } else {
      webApp?.showPopup({ message: 'Sharing is not available in this environment.' });
    }
  };
  if (!user) {
    return <div>Loading user data...</div>;
  }

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-8 p-6 border border-gray-300">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center text-black">Refer a Friend</h2>
        <div className="flex justify-center">
          <QRCodeSVG value={referralLink} size={180} bgColor="#fff" fgColor="#000" />
        </div>
        <input
          value={referralLink}
          readOnly
          className="w-full text-center p-3 border border-black rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-gray-800 transition"
        />
        <div className="flex justify-center space-x-4">
          <button
            onClick={copyToClipboard}
            className="px-4 py-2 border border-black text-black bg-white rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-800 transition"
          >
            Copy Link
          </button>
          <button
            onClick={shareLink}
            className="px-4 py-2 border border-black text-black bg-white rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-800 transition"
          >
            Share Link
          </button>
        </div>
        <div className="mt-6">
          <h3 className="text-xl font-bold">Referred Users:</h3>
          <ul>
            {referredUsers.map((user) => (
              <li key={user.telegramId} className="text-black">{user.telegramId}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}