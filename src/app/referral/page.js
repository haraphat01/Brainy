'use client';
import React, { useState, useEffect } from 'react';
import { useTelegram } from '../TelegramProvider';
import { QRCodeSVG } from 'qrcode.react';

export default function Referral() {
  const { user, webApp } = useTelegram();
  const [referralLink, setReferralLink] = useState('');
  const [referralPoints, setReferralPoints] = useState(0);
  const [referralCount, setReferralCount] = useState(0);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      const link = `https://t.me/fomoflip_bot/arafat?start=${user.id}`;
      setReferralLink(link);
      fetchReferralData();
    } else {
      setError('User information not available');
      setIsLoading(false);
    }
  }, [user?.id]);

  const fetchReferralData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/referral?userId=${user?.id}`);
      if (!response.ok) {
        throw new Error('Failed to fetch referral data');
      }
      const data = await response.json();
      setReferralPoints(data.referralPoints || 0);
      setReferralCount(data.referralCount || 0);
      setError('');
    } catch (error) {
      console.error('Error fetching referral data:', error);
      setError('Failed to load referral data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

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

  if (isLoading) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-500">{error}</div>;
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
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-black">Your Referral Points: {referralPoints}</p>
          <p className="text-lg font-semibold text-black">Total Referrals: {referralCount}</p>
        </div>
      </div>
    </div>
  );
}