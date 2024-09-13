'use client';
import { useState, useEffect } from 'react';
import { useTelegram } from '../TelegramProvider';
import Link from 'next/link';  // Import Link component

export default function Homepage() {
  const telegram = useTelegram();
  const user = telegram?.user;
  const [userPoints, setUserPoints] = useState(null);
  
  const getUserName = () => {
    if (!user) return 'Guest';
    return user.first_name || user.username || 'User';
  };

  useEffect(() => {
    const fetchUserPoints = async () => {
      if (user) {
        try {
          const res = await fetch(`/api/userspoint?telegramId=${user.id}`);  // Updated to GET request with query parameter
          const data = await res.json();
          setUserPoints(data.points);
        } catch (error) {
          console.error('Error fetching user points:', error);
        }
      }
    };

    fetchUserPoints();
  }, [user]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white text-black relative overflow-hidden"
         style={{ paddingTop: 'env(safe-area-inset-top)', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {/* Background animation */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-white opacity-60 animate-pulse" />
      
      {/* Content */}
      <div className="z-10 w-full max-w-xs text-center space-y-6 p-6 border border-black rounded-lg shadow-xl bg-white bg-opacity-90 relative">
        {user ? (
          <>
            <h1 className="text-4xl font-extrabold mb-2 animate-fade-in">👋 Welcome, {getUserName()}!</h1>
            <p className="text-lg animate-fade-in">
              You currently have
              <span className="font-bold block mt-2 text-3xl text-white bg-black border border-black px-4 py-2 rounded-lg inline-block">
                {userPoints !== null ? userPoints : '...'} Brainys
              </span>
            </p>

            <div className="mt-6 space-y-4">
              {/* Animating cards */}
              <div className="flex flex-col items-center gap-4">
                <Link href="/tasks">  
                  <button className="transition-transform transform hover:scale-105 bg-black text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg">
                    🎯 Daily Task
                  </button>
                </Link>
                
                <Link href="/game">  
                  <button className="transition-transform transform hover:scale-105 bg-black text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg">
                    🎮 Play Games
                  </button>
                </Link>
                <Link href="/leaderboard">  
                  <button className="transition-transform transform hover:scale-105 bg-black text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg">
                    🏆 Leaderboards
                  </button>
                </Link>
              </div>
            </div>

            <p className="mt-6 text-sm text-gray-600 animate-fade-in">
              Brainy is your personal cognitive enhancement app. Complete tasks, play games, and compete with others to boost your mental agility!
            </p>
          </>
        ) : (
          <p className="text-lg animate-fade-in">Loading user data...</p>
        )}
      </div>

      {/* Floating animated shapes */}
      <div className="absolute w-32 h-32 bg-black opacity-20 rounded-full top-10 left-10 animate-bounce-slow" />
      <div className="absolute w-24 h-24 bg-black opacity-10 rounded-full bottom-20 right-10 animate-bounce-reverse-slow" />
    </div>
  );
}
