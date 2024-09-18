import dbConnect from '../../../lib/dbConnect';
import User from '../../../model/User';
import Task from '../../../model/Task'; // Import Task model
import { NextResponse } from 'next/server';

export async function POST(request) {
  await dbConnect();

  const { telegramId, taskId } = await request.json(); // Ensure this is correctly parsing the JSON
  console.log('User Telegram ID:', telegramId); // Check if telegramId is defined
  console.log('Task ID:', taskId); // Log the task ID

  // Use _id instead of id for MongoDB
  const task = await Task.findOne({ _id: taskId }); // Fetch task using _id
  if (!task) return NextResponse.json({ message: 'Task not found' }, { status: 404 });

  const user = await User.findOne({ telegramId });
  if (!user) return NextResponse.json({ message: 'User not found' }, { status: 404 });

  if (user.completedTasks.includes(taskId)) return NextResponse.json({ message: 'Task already completed' }, { status: 400 });

  user.points += task.credits; // Points are credited here
  user.completedTasks.push(taskId);
  await user.save();

  return NextResponse.json(user);
}
