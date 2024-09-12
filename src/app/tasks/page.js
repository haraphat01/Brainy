'use client'

import { useState, useEffect } from 'react'
import { useTelegram } from '../TelegramProvider'

export default function Tasks() {
  const { user, setUser } = useTelegram()
  const [tasks, setTasks] = useState([])

  useEffect(() => {
    fetch('/api/tasks')
      .then(res => res.json())
      .then(setTasks)
  }, [])

  const completeTask = async (taskId) => {
    const res = await fetch('/api/completeTask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegramId: user?.telegramId, taskId })
    })
    const updatedUser = await res.json()
    setUser(updatedUser)
  }

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Tasks</h2>
      {tasks.map(task => (
        <div key={task.id} className="mb-2">
          <span>{task.name} - {task.credits} credits</span>
          <button 
            onClick={() => completeTask(task.id)}
            disabled={!user || !user.completedTasks || user.completedTasks.includes(task.id)} // {{ edit_2 }}
            className="ml-2 px-2 py-1 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            {user?.completedTasks?.includes(task.id) ? 'Claimed' : 'Claim'} 
          </button>
        </div>
      ))}
    </div>
  )
}