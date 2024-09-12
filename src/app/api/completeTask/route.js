import dbConnect from '../../../lib/dbConnect'
import User from '../../../model/User'
import { NextResponse } from 'next/server'

export async function POST(request) {
    await dbConnect()
  
    const { telegramId, taskId } = await request.json()
    const task = tasks.find(t => t.id === taskId)
    if (!task) return NextResponse.json({ message: 'Task not found' }, { status: 404 })
  
    const user = await User.findOne({ telegramId })
    if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 })
  
    if (user.completedTasks.includes(taskId)) return NextResponse.json({ message: 'Task already completed' }, { status: 400 })
  
    user.points += task.credits
    user.completedTasks.push(taskId)
    await user.save()
  
    return NextResponse.json(user)
  }