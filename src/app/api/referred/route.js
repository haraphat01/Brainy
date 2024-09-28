import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../model/User';

export async function GET(req) {
  console.log("GET request received"); // Add this line
  await dbConnect();

  const { searchParams } = new URL(req.url);
  console.log("search",searchParams)
  const referrerId = searchParams.get('referrerId');

  if (!referrerId) {
    return NextResponse.json({ error: 'Missing referrerId' }, { status: 400 });
  }

  try {
    const referredUsers = await User.find({ referredBy: referrerId }).limit(10);
    return NextResponse.json({ users: referredUsers });
  } catch (error) {
    return NextResponse.json({ error: `Failed to fetch referred users: ${error.message}` }, { status: 500 });
  }
}