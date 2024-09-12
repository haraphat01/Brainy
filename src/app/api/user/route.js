import dbConnect from '../../../lib/dbConnect'
import User from '../../../model/User'
import { NextResponse } from 'next/server'

export async function POST(request) {
    await dbConnect()
  
    const { telegramId } = await request.json()
    let user = await User.findOne({ telegramId })
    console.log(user)
    if (!user) {
      user = new User({ telegramId })
      await user.save()
    }
    return NextResponse.json(user)
  }