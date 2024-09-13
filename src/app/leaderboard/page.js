'use client';

import React, { useEffect, useState } from 'react';

function Leaderboard() {
  const [users, setUsers] = useState([]);

  // Fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      const response = await fetch('/api/leaderboard');
      const data = await response.json();
      setUsers(data); // Assuming data contains `firstName`, `lastName`, `username`, and `points`
    };
    fetchLeaderboardData();
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-8 animate-bounce">Leaderboard</h1>

      {/* Leaderboard container */}
      <div className="w-full max-w-md bg-gray-100 rounded-xl shadow-lg p-6">
        {users.length > 0 ? (
          <ul className="space-y-4">
            {users.map((user, index) => (
              <li
                key={user._id}
                className="bg-white p-4 rounded-lg flex justify-between items-center shadow-md transform transition-all hover:scale-105"
              >
                <div className="flex items-center space-x-4">
                  <span className="text-xl font-semibold text-gray-800">{index + 1}.</span>
                  {/* Display Telegram name (firstName and lastName or username) */}
                  <span className="text-lg text-gray-700">
                    {user.firstName} {user.lastName || ''} @{user.username}
                  </span>
                </div>
                <span className="text-lg font-medium text-green-600">{user.points} points</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-600 animate-pulse">No users found.</p>
        )}
      </div>
    </div>
  );
}

export default Leaderboard;
