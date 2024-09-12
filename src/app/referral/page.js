'use client'

import { useTelegram } from '../TelegramProvider'

export default function Referral() {
    const telegram = useTelegram();
    const user = telegram?.user;
  const referralLink = `https://t.me/fomoflip_bot/arafat?start=${user.telegramId}`

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Refer a Friend</h2>
      <p className="mb-2">Share this link to earn bonus points:</p>
      <input type="text" value={referralLink} readOnly className="w-full p-2 border rounded" />
    </div>
  )
}