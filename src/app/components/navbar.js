'use client';
import Link from 'next/link';
import { useTelegram } from '../TelegramProvider';

export default function Navbar() {
  const telegram = useTelegram();
  const user = telegram?.user;
  console.log(user);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300">
      <div className="flex justify-around items-center h-16">
      <Link href="/home" className="flex flex-col items-center rounded-full justify-center w-full h-full text-black hover:bg-gray-100 border-r border-gray-300">
          <span className="text-sm">Home</span>
        </Link>
        <Link href="/tasks" className="flex flex-col items-center rounded-full justify-center w-full h-full text-black hover:bg-gray-100 border-r border-gray-300">
          <span className="text-sm">Tasks</span>
        </Link>
        <Link href="/game" className="flex flex-col items-center rounded-full justify-center w-full h-full text-black hover:bg-gray-100 border-r border-gray-300">
          <span className="text-sm">Game</span>
        </Link>
        <Link href="/referral" className="flex flex-col rounded-full items-center justify-center w-full h-full text-black hover:bg-gray-100">
          <span className="text-sm">Referral</span>
        </Link>
        <Link href="/referral" className="flex flex-col rounded-full items-center justify-center w-full h-full text-black hover:bg-gray-100">
          <span className="text-sm">Leader Board</span>
        </Link>
      </div>
    </nav>
  );
}




