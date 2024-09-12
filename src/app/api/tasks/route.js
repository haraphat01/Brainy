import { NextResponse } from 'next/server'

const tasks = [
  { id: 'task1', name: 'Complete profile', credits: 10 },
  { id: 'task2', name: 'Invite a friend', credits: 20 },
  { id: 'task3', name: 'Play the game', credits: 5 },
]

export async function GET() {
  return NextResponse.json(tasks)
}