'use client';
import Link from 'next/link'
import { useTelegram } from '../TelegramProvider';

export default function Navbar() {
  const telegram = useTelegram();
  const user = telegram?.user;

  console.log(user);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <p>Hello, {user ? user.id : 'Guest'}!</p>
      {user && (
        <div className="flex flex-col items-center gap-4">
          <p>Your user ID: {user.id}</p>
          <nav className="flex gap-4">
            <Link href="/tasks" className="text-blue-500 hover:underline">Tasks</Link>
            <Link href="/game" className="text-blue-500 hover:underline">Game</Link>
            <Link href="/referral" className="text-blue-500 hover:underline">Referral</Link>
          </nav>
        </div>
      )}
    </div>
  )
}