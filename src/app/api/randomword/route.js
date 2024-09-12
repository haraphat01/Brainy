// app/api/random-word/route.js

import { NextResponse } from 'next/server';

// This is a simple word list. In a real application, you'd want a much larger list.
const words = [
    'BITCOIN', 'ETHEREUM', 'BLOCKCHAIN', 'ALTCOIN', 'WALLET', 'MINING', 'TOKEN', 'DEFI',
    'NFT', 'SMART CONTRACT', 'EXCHANGE', 'LEDGER', 'HASH',
    'DECENTRALIZED', 'CRYPTOGRAPHY', 'SATOSHI', 'ICO', 'HODL', 'FIAT', 'DAPP', 'FORK',
    'HALVING', 'STABLECOIN', 'RIPPLE', 'LITECOIN', 'DOGECOIN', 'METAMASK', 'BINANCE'
  ];

export async function GET(request) {
  // ... existing code ...
  
  // Remove length filtering
  // const length = searchParams.get('length');
  
  // let filteredWords = words;
  // if (length) {
  //   filteredWords = words.filter(word => word.length === parseInt(length));
  // }

  // Use the full word list directly
  const randomWord = words[Math.floor(Math.random() * words.length)];
  
  return NextResponse.json({ word: randomWord });
}