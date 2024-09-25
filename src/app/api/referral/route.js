// app/api/referral/route.js
import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import User from '../../../model/User';
import Referral from '../../../model/Referral';
export async function POST(req) {
  await dbConnect();

  try {
    const { referredId, referrerId } = await req.json();

    // Validate incoming data
    if (!referredId || !referrerId) {
      return new Response(
        JSON.stringify({ error: 'Missing referredId or referrerId' }),
        { status: 400 }
      );
    }

    // Check if the referral already exists in the Referral model
    const existingReferral = await Referral.findOne({ referredId });
    if (existingReferral) {
      return new Response(
        JSON.stringify({ error: 'This user has already been referred.' }),
        { status: 400 }
      );
    }

    // Create new referral entry
    await Referral.create({
      referrerId,
      referredId,
      pointsAwarded: false,
    });

    // Check if the referred user exists
    const referredUser = await User.findOne({ telegramId: referredId });
    if (!referredUser) {
      // Create new user if not exists
      await User.create({
        telegramId: referredId,
        points: 20, // New user gets 20 points for joining
        referredBy: referrerId,
      });
    }

    // Find the referrer and update their points
    const referrer = await User.findOne({ telegramId: referrerId });
    if (!referrer) {
      return new Response(
        JSON.stringify({ error: 'Referrer not found.' }),
        { status: 400 }
      );
    }

    // Add 10 points to referrer for referring
    referrer.points += 10;
    await referrer.save();

    // Mark the referral as awarded
    await Referral.updateOne({ referredId }, { pointsAwarded: true });

    return new Response(
      JSON.stringify({ message: 'Referral successful. Referrer has been awarded points.' }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: `Failed to process referral: ${error.message}` }),
      { status: 500 }
    );
  }
}