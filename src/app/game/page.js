'use client';
import { useState, useEffect, useCallback } from 'react';
import { useTelegram } from '../TelegramProvider';

const GAME_DURATION = 30; // 30 seconds per word
const WORD_LENGTH = 5; // We'll fetch 5-letter words, you can adjust this
const COOLDOWN_PERIOD = 3 * 60 * 60 * 1000; // 3 hours in milliseconds

export default function ScrabbleGame() {
  const { user } = useTelegram();
  const [currentWord, setCurrentWord] = useState('');
  const [scrambledWord, setScrambledWord] = useState('');
  const [userInput, setUserInput] = useState('');
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [gameOver, setGameOver] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [canPlay, setCanPlay] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);

  const scrambleWord = useCallback((word) => {
    return word.split('').sort(() => Math.random() - 0.5).join('');
  }, []);

  const fetchNewWord = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/randomword?length=${WORD_LENGTH}`);
      if (!response.ok) {
        throw new Error('Failed to fetch word');
      }
      const data = await response.json();
      setCurrentWord(data.word);
      setScrambledWord(scrambleWord(data.word));
      setTimeLeft(GAME_DURATION);
      setUserInput('');
    } catch (error) {
      console.error('Error fetching new word:', error);
      // Fallback to a default word if API fails
      const fallbackWord = 'REACT';
      setCurrentWord(fallbackWord);
      setScrambledWord(scrambleWord(fallbackWord));
    } finally {
      setIsLoading(false);
    }
  }, [scrambleWord]);

  const checkCooldown = useCallback(() => {
    const lastPlayTime = localStorage.getItem(`lastPlayTime_${user.id}`);
    if (lastPlayTime) {
      const timeSinceLastPlay = Date.now() - parseInt(lastPlayTime);
      if (timeSinceLastPlay < COOLDOWN_PERIOD) {
        setCanPlay(false);
        setCooldownTime(COOLDOWN_PERIOD - timeSinceLastPlay);
      } else {
        setCanPlay(true);
        setCooldownTime(0);
      }
    } else {
      setCanPlay(true);
      setCooldownTime(0);
    }
  }, [user.id]);

  useEffect(() => {
    checkCooldown();
  }, [checkCooldown]);

  useEffect(() => {
    if (canPlay && !gameOver) {
      fetchNewWord();
    }
  }, [canPlay, gameOver, fetchNewWord]);

  useEffect(() => {
    if (timeLeft > 0 && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !gameOver) {
      setGameOver(true);
      sendScoreToAPI();
    }
  }, [timeLeft, gameOver]);

  useEffect(() => {
    if (cooldownTime > 0) {
      const timer = setTimeout(() => {
        setCooldownTime(prevTime => {
          if (prevTime <= 1000) {
            checkCooldown();
            return 0;
          }
          return prevTime - 1000;
        });
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldownTime, checkCooldown]);

  const handleInputChange = (e) => {
    setUserInput(e.target.value.toUpperCase());
  };

  const checkAnswer = () => {
    if (userInput === currentWord) {
      const pointsEarned = Math.ceil(timeLeft / 3); // More points for faster answers
      setScore(score + pointsEarned);
      fetchNewWord();
    }
  };

  const sendScoreToAPI = async () => {
    try {
      const res = await fetch('/api/addGamePoints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ telegramId: user.id, points: score })
      });
      const updatedUser = await res.json();
      console.log('Score sent to API:', updatedUser);

      // Update cooldown in local storage
      localStorage.setItem(`lastPlayTime_${user.id}`, Date.now().toString());
      checkCooldown();
    } catch (error) {
      console.error('Error sending score to API:', error);
    }
  };

  const formatTime = (ms) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="p-4 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Unscramble the Word!</h2>
      {!canPlay ? (
        <div>
          <p>You need to wait before playing again.</p>
          <p>Time remaining: {formatTime(cooldownTime)}</p>
        </div>
      ) : !gameOver ? (
        <>
          <p className="mb-2">Score: {score}</p>
          <p className="mb-2">Time left: {timeLeft} seconds</p>
          {isLoading ? (
            <p>Loading new word...</p>
          ) : (
            <>
              <p className="text-xl font-bold mb-4">{scrambledWord}</p>
              <input
                type="text"
                value={userInput}
                onChange={handleInputChange}
                className="w-full p-2 mb-4 border rounded"
                placeholder="Enter your guess"
              />
              <button
                onClick={checkAnswer}
                className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Submit
              </button>
            </>
          )}
        </>
      ) : (
        <div>
          <p className="mb-4">Game Over! Your final score: {score}</p>
          <p>You can play again in: {formatTime(cooldownTime)}</p>
          <button
            onClick={() => {
              setScore(0);
              setGameOver(false);
              checkCooldown();
            }}
            className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 mt-4"
            disabled={!canPlay}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}