import dbConnect from '../../../lib/dbConnect'
import User from '../../../model/User'
import { NextResponse } from 'next/server'

export async function GET() {
    await dbConnect(); // Connect to the database
    const users = await User.find().sort({ points: -1 }).limit(15); // Fetch top 15 users by points
    return NextResponse.json(users); // Return the users as JSON response
}