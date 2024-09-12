import dbConnect from '../../../lib/dbConnect';
import User from '../../../model/User'; 
import { NextResponse } from 'next/server';

export async function GET(req) {  // Use GET method
  await dbConnect();

  // Get telegramId from query string
  const { searchParams } = new URL(req.url);
  const telegramId = searchParams.get('telegramId');
  
  console.log(telegramId);

  const user = await User.findOne({ telegramId });
  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 404 });
  }

  return NextResponse.json({ points: user.points });
}
