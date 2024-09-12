'use client';

import Link from 'next/link';
import { useTelegram } from './TelegramProvider';

export default function Home() {
  const { user } = useTelegram();

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      <p>Hello, {user ? user.telegramId : 'Guest'}!</p>
      {user && (
        <div className="flex flex-col items-center gap-4">
          <p>Your points: {user.points}</p>
          <nav className="flex gap-4">
            <Link href="/tasks" className="text-blue-500 hover:underline">Tasks</Link>
            <Link href="/game" className="text-blue-500 hover:underline">Game</Link>
            <Link href="/referral" className="text-blue-500 hover:underline">Referral</Link>
          </nav>
        </div>
      )}
    </div>
  );
}
