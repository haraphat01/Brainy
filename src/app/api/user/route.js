// pages/api/user.js
import dbConnect from '../../../lib/dbConnect';
import User from '../../../model/User';
import { NextResponse } from 'next/server';

export async function POST(request) {
  await dbConnect();

  const { telegramId } = await request.json();
  
  try {
    const user = await User.findOneAndUpdate(
      { telegramId },
      { $setOnInsert: { telegramId, points: 20 } }, // Added points: 20 for new users
      { upsert: true, new: true }
    );

    return NextResponse.json(user);
  } catch (error) {
    console.error('Error handling user request:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}