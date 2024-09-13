'use client';
import React, { useState, useEffect } from 'react';
import { useTelegram } from '../TelegramProvider';
import { QRCodeSVG } from 'qrcode.react';

export default function Referral() {
  const { user, webApp } = useTelegram();  // Destructure user and webApp from context
  const [referralLink, setReferralLink] = useState('');
  const [referralPoints, setReferralPoints] = useState(0);
  const [level2Points, setLevel2Points] = useState(0);

  useEffect(() => {
    if (user?.id) {
      const link = `https://t.me/fomoflip_bot/arafat?start=${user.id}`;
      setReferralLink(link);
      fetchReferralData();
    }
  }, [user?.id]);

  const fetchReferralData = async () => {
    try {
      const response = await fetch(`/api/referral?userId=${user?.id}`);
      const data = await response.json();
      setReferralPoints(data.referralPoints);
      setLevel2Points(data.level2Points);
    } catch (error) {
      console.error('Error fetching referral data:', error);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralLink);
    alert('Referral link copied to clipboard!');
  };

  const shareLink = () => {
    if (webApp && typeof webApp.shareUrl === 'function') {
      webApp.shareUrl(referralLink, 'Check out FOMOFlips!');
    } else {
      alert('Sharing is not available in this environment.');
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white shadow-lg rounded-lg overflow-hidden mt-8 p-6 border border-gray-300">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-center text-black">Refer a Friend</h2>

        {/* QR Code */}
        <div className="flex justify-center">
          <QRCodeSVG value={referralLink} size={180} bgColor="#fff" fgColor="#000" />
        </div>

        {/* Referral Link */}
        <input
          value={referralLink}
          readOnly
          className="w-full text-center p-3 border border-black rounded-lg bg-white text-black focus:outline-none focus:ring-2 focus:ring-gray-800 transition"
        />

        {/* Buttons */}
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

        {/* Referral Points */}
        <div className="text-center space-y-2">
          <p className="text-lg font-semibold text-black">Your Referral Points: {referralPoints}</p>
          <p className="text-lg font-semibold text-black">Level 2 Referral Points: {level2Points}</p>
        </div>
      </div>
    </div>
  );
}
