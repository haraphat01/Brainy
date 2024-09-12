'use client';
import Link from 'next/link'
import { useTelegram } from './TelegramProvider';

export default function Home() {
  const telegram = useTelegram();
  const user = telegram?.user;

  console.log(user);

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
     
    
        
      
    </div>
  )
}