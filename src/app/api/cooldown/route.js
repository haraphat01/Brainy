// app/api/game-cooldown/route.js

import { NextResponse } from 'next/server';

// In a real application, you would use a database to store this information
let userLastPlayTime = new Map();

export async function POST(request) {
  const { telegramId } = await request.json();

  const currentTime = Date.now();
  const lastPlayTime = userLastPlayTime.get(telegramId) || 0;
  const timeSinceLastPlay = currentTime - lastPlayTime;
  const cooldownPeriod = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

  if (timeSinceLastPlay < cooldownPeriod) {
    const remainingTime = cooldownPeriod - timeSinceLastPlay;
    return NextResponse.json({ canPlay: false, remainingTime });
  }

  userLastPlayTime.set(telegramId, currentTime);
  return NextResponse.json({ canPlay: true, remainingTime: 0 });
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const telegramId = searchParams.get('telegramId');

  if (!telegramId) {
    return NextResponse.json({ error: 'Telegram ID is required' }, { status: 400 });
  }

  const currentTime = Date.now();
  const lastPlayTime = userLastPlayTime.get(telegramId) || 0;
  const timeSinceLastPlay = currentTime - lastPlayTime;
  const cooldownPeriod = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

  if (timeSinceLastPlay < cooldownPeriod) {
    const remainingTime = cooldownPeriod - timeSinceLastPlay;
    return NextResponse.json({ canPlay: false, remainingTime });
  }

  return NextResponse.json({ canPlay: true, remainingTime: 0 });
}