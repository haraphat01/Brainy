'use client';
import { useState, useEffect } from 'react';
import { useTelegram } from '../TelegramProvider';

export default function Tasks() {
  const { user, setUser } = useTelegram();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!user || !user.id) {
        setLoading(false);
        return;
      }
      try {
        const res = await fetch('/api/tasks', {
          headers: {
            'telegram_id': user.id
          }
        });
        if (!res.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await res.json();
        console.log('Fetched tasks:', data);
        setTasks(data);
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        setTasks([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [user]);

  const completeTask = async (taskId) => {
    if (!user) return;

    try {
      const res = await fetch('/api/completeTask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId: user.id, taskId }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        setUser(updatedUser);
        // Remove the completed task from the list
        setTasks(tasks.filter(task => task._id !== taskId));
      } else {
        console.error('Failed to complete task');
      }
    } catch (error) {
      console.error('Error completing task:', error);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Available Tasks</h2>

      <div className="w-full max-w-lg bg-gray-100 rounded-xl shadow-lg p-6">
        {loading ? (
          <p className="text-center text-gray-600">Loading tasks...</p>
        ) : tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task._id}
              className="bg-white p-4 rounded-lg flex justify-between items-center shadow-md mb-4 transform transition-all hover:scale-105"
            >
              <div>
                <span className="text-lg font-medium text-gray-800">{task.name}</span>
                <span className="text-sm text-gray-500 block">{task.credits} credits</span>
              </div>

              <button
                onClick={() => completeTask(task._id)}
                className="ml-2 px-4 py-2 font-semibold rounded bg-blue-500 text-white hover:bg-blue-600"
              >
                Claim
              </button>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600">No tasks available at the moment.</p>
        )}
      </div>
    </div>
  );
}