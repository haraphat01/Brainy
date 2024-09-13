'use client';
import { useState, useEffect } from 'react';
import { useTelegram } from '../TelegramProvider';

export default function Tasks() {
  const { user, setUser } = useTelegram(); // Get user and setUser from context
  const [tasks, setTasks] = useState([]); // Initialize tasks as an empty array
  const [loading, setLoading] = useState(true); // Track loading state

  useEffect(() => {
    // Fetch tasks from the API
    const fetchTasks = async () => {
      try {
        const res = await fetch('/api/tasks');
        const data = await res.json();
        setTasks(data); // Set tasks data from the API response
      } catch (error) {
        console.error("Failed to fetch tasks:", error);
        setTasks([]); // Set tasks to an empty array in case of error
      } finally {
        setLoading(false); // Stop loading when tasks are fetched
      }
    };
    fetchTasks();
  }, []);

  const completeTask = async (taskId) => {
    if (!user) return;

    // Send task completion to the server
    const res = await fetch('/api/completeTask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ telegramId: user?.telegramId, taskId }),
    });

    const updatedUser = await res.json();
    setUser(updatedUser); // Update user with the new completed tasks
  };

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Available Tasks</h2>

      {/* Task list container */}
      <div className="w-full max-w-lg bg-gray-100 rounded-xl shadow-lg p-6">
        {loading ? (
          <p className="text-center text-gray-600">Loading tasks...</p>
        ) : tasks.length > 0 ? (
          tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white p-4 rounded-lg flex justify-between items-center shadow-md mb-4 transform transition-all hover:scale-105"
            >
              {/* Task information */}
              <div>
                <span className="text-lg font-medium text-gray-800">{task.name}</span>
                <span className="text-sm text-gray-500 block">{task.credits} credits</span>
              </div>

              {/* Claim button */}
              <button
                onClick={() => completeTask(task.id)}
                disabled={!user || (user.completedTasks && user.completedTasks.includes(task.id))} // Disable if task already claimed
                className={`ml-2 px-4 py-2 font-semibold rounded ${
                  user?.completedTasks?.includes(task.id)
                    ? 'bg-green-500 text-white'
                    : 'bg-blue-500 text-white'
                } disabled:bg-gray-300`}
              >
                {user?.completedTasks?.includes(task.id) ? 'Claimed' : 'Claim'}
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
