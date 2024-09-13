// app/api/referral/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../model/User';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');

  if (!userId) {
    return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
  }

  try {
    await dbConnect();
    const user = await User.findOne({ telegramId: userId });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      referralPoints: user.referrals.length * 12, // 12 points per referral
      level2Points: await calculateLevel2Points(user),
    });
  } catch (error) {
    console.error('Error fetching referral data:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request) {
  const { referrerId, referredId } = await request.json();

  if (!referrerId || !referredId) {
    return NextResponse.json({ error: 'Both referrer and referred IDs are required' }, { status: 400 });
  }

  try {
    await dbConnect();
    const referrer = await User.findOne({ telegramId: referrerId });
    const referred = await User.findOne({ telegramId: referredId });

    if (!referrer || !referred) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    if (referrer.referrals.includes(referredId)) {
      return NextResponse.json({ error: 'User has already been referred' }, { status: 400 });
    }

    // Update referrer
    referrer.referrals.push(referredId);
    await referrer.save();

    // Update level 2 referrals
    if (referrer.referrals.length > 0) {
      const level2Referrer = await User.findOne({ referrals: referrerId });
      if (level2Referrer) {
        // No need to update points directly, as we calculate them on-the-fly
        await level2Referrer.save();
      }
    }
0
    return NextResponse.json({ message: 'Referral successful' });
  } catch (error) {
    console.error('Error processing referral:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function calculateLevel2Points(user) {
  const level1Referrals = await User.find({ telegramId: { $in: user.referrals } });
  return level1Referrals.reduce((total, referral) => total + referral.referrals.length * 5, 0);
}