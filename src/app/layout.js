import localFont from "next/font/local";
import "./globals.css";
import TelegramProvider from "./TelegramProvider";
import Navbar from "./components/navbar";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata = {
  title: 'Telegram Mini App',
  description: 'A task and game app for Telegram',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
       <TelegramProvider>
      
          {children}
          <Navbar/>
        </TelegramProvider>
     
      </body>
    </html>
  );
}
