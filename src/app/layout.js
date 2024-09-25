import localFont from "next/font/local";
import "./globals.css";
import  TelegramProvider   from "./TelegramProvider";
import Navbar from "./components/navbar";
import { GoogleAnalytics } from '@next/third-parties/google'
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
  title: 'Brainy',
  description: 'A game that tests your intelligence',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
       <TelegramProvider>
      
          {children}
          <GoogleAnalytics gaId="G-06GKRDP0K4" />
          <Navbar/>
        </TelegramProvider>
     
      </body>
    </html>
  );
}
