import { NextResponse } from 'next/server'
import dbConnect from '../../../lib/dbConnect'
import Task from '../../../model/Task'
import User from '../../../model/User'

export async function GET(req) {
  await dbConnect();
  
  const telegramId = req.headers.get('telegram_id');
  console.log('Fetched tasks:', telegramId);
  if (!telegramId) {
    return NextResponse.json({ error: 'Telegram ID is required' }, { status: 400 });
  }

  const user = await User.findOne({ telegramId });
  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const completedTasks = user.completedTasks || [];

  const tasks = await Task.find({ _id: { $nin: completedTasks } });

  console.log('Fetched tasks:', tasks);

  return NextResponse.json(tasks);
}