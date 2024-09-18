'use client';
import Link from 'next/link';
import { useTelegram } from '../TelegramProvider'

export default function Navbar() {
  const telegram = useTelegram();
  const user = telegram?.user;
  console.log(user);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300">
      <div className="flex justify-around items-center h-16">
        <Link href="/home" className="bg-black text-white hover:bg-white hover:text-black border border-black rounded-full py-2 px-4">
          <span className="text-sm">Home</span>
        </Link>
        <Link href="/tasks" className="bg-black text-white hover:bg-white hover:text-black border border-black rounded-full py-2 px-4">
          <span className="text-sm">Earn</span>
        </Link>
        <Link href="/wallet" className="bg-black text-white hover:bg-white hover:text-black border border-black rounded-full py-2 px-4">
          <span className="text-sm">Wallet</span>
        </Link>
        <Link href="/home" className="bg-black text-white hover:bg-white hover:text-black border border-black rounded-full py-2 px-4">
          <span className="text-sm">AI</span>
        </Link>
      </div>
    </nav>
  );
}