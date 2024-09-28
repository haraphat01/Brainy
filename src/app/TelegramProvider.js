'use client';

import { createContext, useContext, useEffect, useState, useMemo } from 'react';

// Create the Telegram context
const TelegramContext = createContext({});

// Hook to use Telegram context
export const useTelegram = () => useContext(TelegramContext);

// TelegramProvider component to wrap around your app
export default function TelegramProvider({ children }) {
  const [user, setUser] = useState(null);
  const [webApp, setWebApp] = useState(null);
  const [startParam, setStartParam] = useState(null); // State to capture referral start parameter

  useEffect(() => {
    const initTelegram = async () => {
      if (typeof window !== 'undefined') {
        try {
          // Load Telegram WebApp SDK
          await new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://telegram.org/js/telegram-web-app.js';
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });

          const WebApp = window.Telegram.WebApp;
          WebApp.ready();

          const initDataUnsafe = WebApp.initDataUnsafe || {};
          if (initDataUnsafe.user) {
            const { id, first_name, last_name, username } = initDataUnsafe.user;

            // Set user data
            setUser({
              id,
              firstName: first_name,
              lastName: last_name,
              username,
            });

            // Optionally, send user data to your API
            await fetch('/api/user', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                telegramId: id,
                firstName: first_name,
                lastName: last_name,
                username,
              }),
            });
          }

          setWebApp(WebApp); // Set the WebApp instance

          // Capture the start parameter (referral ID)
          const startParameter = initDataUnsafe.start_param || '';
          if (startParameter) {
            setStartParam(startParameter); // Store start param if exists
          }
        } catch (error) {
          console.error('Error initializing Telegram WebApp:', error);
        }
      }
    };

    initTelegram();
  }, []);

  useEffect(() => {
    if (user?.id && startParam) {
      handleReferral(user.id, startParam); // Process referral if both user and start param are available
    }
  }, [user, startParam]);

  // Function to handle referral processing
  const handleReferral = async (referredId, referrerId) => {
    try {
      const response = await fetch('/api/referral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ referredId, referrerId }),
      });

      if (!response.ok) {
        throw new Error('Failed to process referral');
      }

      // Optionally, show a success popup in the Telegram WebApp
      webApp?.showPopup({ message: 'Welcome! You\'ve been successfully referred.' });
    } catch (error) {
      console.error('Error processing referral:', error);
      // Show an error popup in case of failure
      webApp?.showPopup({ message: 'There was an error processing your referral.' });
    }
  };

  // Memoize the context value for performance
  const value = useMemo(() => ({
    webApp,
    user,
    startParam,
  }), [webApp, user, startParam]);

  if (!webApp) {
    return <div>Loading...</div>; // Consider adding a better loading component
  }

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  );
}