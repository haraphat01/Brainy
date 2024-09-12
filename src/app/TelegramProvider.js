'use client';

import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import Script from 'next/script';

// Create the Telegram context
const TelegramContext = createContext({});

// Hook to use Telegram context
export const useTelegram = () => useContext(TelegramContext);
// TelegramProvider component to wrap around your app
export  default function TelegramProvider ({ children }) {
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [webApp, setWebApp] = useState(null);

  useEffect(() => {
    const initTelegram = async () => {
      if (typeof window !== 'undefined') {
        const WebApp = (await import('@twa-dev/sdk')).default;
        WebApp.ready();
        const initDataUnsafe = WebApp.initDataUnsafe || {};

        if (initDataUnsafe.user) {
          try {
            // Fetch user data
            const response = await fetch('/api/user', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ telegramId: initDataUnsafe.user.id })
            });
            const userData = await response.json();
            setUser(userData);
          } catch (error) {
            console.error('Failed to fetch user data:', error);
          }
        }

        setWebApp(WebApp); // Set the WebApp instance
        setIsReady(true);  // Set the app as ready
      }
    };

    initTelegram();
  }, []);

  // Memoize the context value for performance
  const value = useMemo(() => {
    return webApp
      ? {
          webApp,
          unsafeData: webApp.initDataUnsafe,
          user: webApp.initDataUnsafe.user,
        }
      : { user };  // Return `user` when `webApp` is not available
  }, [webApp, user]);

  if (!isReady) {
    return <div>Loading...</div>;
  }

  return (
    <TelegramContext.Provider value={value}>
      {/* Ensure Telegram WebApp SDK script is loaded */}
      <script src="https://telegram.org/js/telegram-web-app.js"></script>
      {children}
    </TelegramContext.Provider>
  );
}

 