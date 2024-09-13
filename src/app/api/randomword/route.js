// app/api/random-word/route.js

import { NextResponse } from 'next/server';

// This is a simple word list. In a real application, you'd want a much larger list.
const words = [
    'BITCOIN', 'ETHEREUM', 'BLOCKCHAIN', 'ALTCOIN', 'WALLET', 'MINING', 'TOKEN', 'DEFI',
    'NFT', 'CONTRACT', 'EXCHANGE', 'LEDGER', 'HASH',
    'DECENTRALIZED', 'CRYPTOGRAPHY', 'SATOSHI', 'ICO', 'HODL', 'FIAT', 'DAPP',
    'HALVING', 'STABLECOIN', 'RIPPLE', 'LITECOIN', 'DOGECOIN', 'METAMASK', 'BINANCE', 'AFGHANISTAN', 'ALBANIA', 'ALGERIA', 'ANDORRA', 'ANGOLA', 
    'ARGENTINA', 'ARMENIA', 'AUSTRALIA', 'AUSTRIA', 'AZERBAIJAN', 'BAHAMAS', 
    'BAHRAIN', 'BANGLADESH', 'BARBADOS', 'BELARUS', 'BELGIUM', 'BELIZE', 
    'BENIN', 'BHUTAN', 'BOLIVIA', 'BOTSWANA', 
    'BRAZIL', 'BRUNEI', 'BULGARIA', 'BURUNDI', 
    'CAMBODIA', 'CAMEROON', 'CANADA', 'CHAD', 
    'CHILE', 'CHINA', 'COLOMBIA', 'COMOROS', 'CONGO', 'COSTA RICA', 
    'CROATIA', 'CUBA', 'CYPRUS', 'CZECHIA', 'DENMARK', 'DJIBOUTI', 
    'DOMINICA', 'ECUADOR', 'EGYPT', 'SALVADOR', 
     'ERITREA', 'ESTONIA', 'ESWATINI', 'ETHIOPIA', 
    'FIJI', 'FINLAND', 'FRANCE', 'GABON', 'GAMBIA', 'GEORGIA', 
    'GERMANY', 'GHANA', 'GREECE', 'GRENADA', 'GUATEMALA', 'GUINEA', 
     'GUYANA', 'HAITI', 'HONDURAS', 'HUNGARY', 
    'ICELAND', 'INDIA', 'INDONESIA', 'IRAN', 'IRAQ', 'IRELAND', 
    'ISRAEL', 'ITALY', 'JAMAICA', 'JAPAN', 'JORDAN', 'KAZAKHSTAN', 
    'KENYA', 'KIRIBATI', 'KOREA', 'KOSOVO', 
    'KUWAIT', 'KYRGYZSTAN', 'LAOS', 'LATVIA', 'LEBANON', 'LESOTHO', 
    'LIBERIA', 'LIBYA', 'LIECHTENSTEIN', 'LITHUANIA', 'LUXEMBOURG', 
    'MADAGASCAR', 'MALAWI', 'MALAYSIA', 'MALDIVES', 'MALI', 
    'MALTA', 'MAROCCO', 'MAURITANIA', 'MAURITIUS', 'MEXICO', 
    'MICRONESIA', 'MOLDOVA', 'MONACO', 'MONGOLIA', 'MONTENEGRO', 
    'MOROCCO', 'MOZAMBIQUE', 'MYANMAR', 'NAMIBIA', 'NEPAL', 
    'NETHERLANDS', 'NEW ZEALAND', 'NICARAGUA', 'NIGER', 'NIGERIA', 
    'NORTH MACEDONIA', 'NORWAY', 'OMAN', 'PAKISTAN', 'PALAU', 
    'PANAMA', 'PAPUA NEW GUINEA', 'PARAGUAY', 'PERU', 'PHILIPPINES', 
    'POLAND', 'PORTUGAL', 'QATAR', 'ROMANIA', 'RUSSIA', 
    'RWANDA', 
    'SAMOA', 'SENEGAL', 'SERBIA', 
    'SEYCHELLES', 'SIERRA LEONE', 'SINGAPORE', 'SLOVAKIA', 'SLOVENIA', 
     'SOMALIA', 'AFRICA', 'SUDAN', 
    'SPAIN', 'SRI LANKA', 'SUDAN', 'SURINAME', 'SWEDEN', 
    'SWITZERLAND', 'SYRIA', 'TAIWAN', 'TAJIKISTAN', 'TANZANIA', 
    'THAILAND', 'TOGO', 'TONGA', 'TUNISIA', 
    'TURKMENISTAN', 'TURKEY', 'TUVALU', 'UGANDA', 'UKRAINE', 
    'UNITED ARAB EMIRATES', 'UNITED KINGDOM', 'UNITED STATES', 
    'URUGUAY', 'UZBEKISTAN', 'VANUATU', 'VATICAN CITY', 'VENEZUELA', 
    'VIETNAM', 'YEMEN', 'ZAMBIA', 'ZIMBABWE'
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