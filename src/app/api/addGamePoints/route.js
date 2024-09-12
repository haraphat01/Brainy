import dbConnect from '../../../lib/dbConnect'
import User from '../../../model/User'
import { NextResponse } from 'next/server'



export async function POST(request) {
    await dbConnect()
  
    const { telegramId, points } = await request.json()
    const user = await User.findOne({ telegramId })
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 })
  
    user.points += points
    await user.save()
  
    return NextResponse.json(user)
  }
  