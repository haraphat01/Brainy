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
        referralPoints: user.points || 0,
        referralCount: user.referrals ? user.referrals.length : 0,
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

    // Credit points to the referrer (12 points)
    referrer.points += 12;
    referrer.referrals.push(referredId);
    await referrer.save();

    // Check for level 2 referral
    const level2Referrer = await User.findOne({ referrals: referrerId });
    if (level2Referrer) {
      // Credit points to the level 2 referrer (5 points)
      level2Referrer.points += 5;
      await level2Referrer.save();
    }

    return NextResponse.json({ 
      message: 'Referral successful',
      referrerPoints: referrer.points,
      level2ReferrerPoints: level2Referrer ? level2Referrer.points : null
    });
  } catch (error) {
    console.error('Error processing referral:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}