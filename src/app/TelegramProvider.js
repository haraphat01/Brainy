'use client';
import { createContext, useContext, useEffect, useState, useMemo, useCallback } from 'react';

// Create the Telegram context
const TelegramContext = createContext({});

// Hook to use Telegram context
export const useTelegram = () => useContext(TelegramContext);

// TelegramProvider component to wrap around your app
export default function TelegramProvider({ children }) {
  const [user, setUser] = useState(null);
  const [webApp, setWebApp] = useState(null);
  const [startParam, setStartParam] = useState(null); // State to capture referral start parameter

  // Initialize Telegram WebApp and fetch user/startParam data
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
            const userResponse = await fetch('/api/user', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                telegramId: id,
                firstName: first_name,
                lastName: last_name,
                username,
              }),
            });

            if (!userResponse.ok) {
              console.error('Failed to send user data');
            }
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

  // Watch for changes in user and startParam, call handleReferral when both are set
 

  // Function to handle referral processing
  const handleReferral = useCallback(async (referredId, referrerId) => {
    console.log('handleReferral called with:', { referredId, referrerId });
    try {
      const response = await fetch('/api/referral', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ referredId, referrerId }),
      });

      const data = await response.json();
      console.log('Referral response:', data);

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process referral');
      }

      webApp?.showPopup({ 
        message: "Welcome! You've been successfully referred.",
        buttons: [{ type: "ok" }]
      });
    } catch (error) {
      console.error('Error processing referral:', error);
      webApp?.showPopup({ 
        message: 'There was an error processing your referral: ' + error.message,
        buttons: [{ type: "ok" }]
      });
    }
  }, [webApp]);
  useEffect(() => {
    if (user?.id && startParam) {
      console.log('Calling handleReferral with user ID and startParam:', user.id, startParam);
      handleReferral(user.id, startParam);
    } else {
      console.log('handleReferral not called: User or startParam not available', { user, startParam });
    }
  }, [user, startParam, handleReferral]);
  // Memoize the context value for performance
  const value = useMemo(
    () => ({
      webApp,
      user,
      startParam,
    }),
    [webApp, user, startParam]
  );

  if (!webApp) {
    return <div>Loading...</div>; // Consider adding a better loading component
  }

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  );
}
