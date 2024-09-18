'use client';
import { useState, useEffect, useCallback } from 'react';
import { useTelegram } from '../TelegramProvider';
import { useSpring, animated, config } from 'react-spring';

const GAME_DURATION = 30; // 30 seconds per word
const COOLDOWN_PERIOD = 0.001 * 60 * 60 * 1000; // 3 hours in milliseconds

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
  const [isCorrect, setIsCorrect] = useState(false);
  const [hint, setHint] = useState('');

  // Animations
  const fadeIn = useSpring({
    opacity: isLoading ? 0 : 1,
    config: config.molasses,
  });

  const scoreAnimation = useSpring({
    number: score,
    from: { number: 0 },
  });

  const scrambleAnimation = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    reset: true,
    key: scrambledWord,
  });

  const timerAnimation = useSpring({
    width: `${(timeLeft / GAME_DURATION) * 100}%`,
    config: config.molasses,
  });

  const correctAnimation = useSpring({
    transform: isCorrect ? 'scale(1.1)' : 'scale(1)',
    config: config.wobbly,
  });

  const scrambleWord = useCallback((word) => {
    return word.split('').sort(() => Math.random() - 0.5).join('');
  }, []);

  const fetchNewWord = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/randomword`);
      if (!response.ok) {
        throw new Error('Failed to fetch word');
      }
      const data = await response.json();
      setCurrentWord(data.word);
      setScrambledWord(scrambleWord(data.word));
      setHint(data.hint); // Set the hint from the API response
      setTimeLeft(GAME_DURATION);
      setUserInput('');
    } catch (error) {
      console.error('Error fetching new word:', error);
      const fallbackWord = 'BITCOIN';
      setCurrentWord(fallbackWord);
      setScrambledWord(scrambleWord(fallbackWord));
      setHint('A popular cryptocurrency');
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
        setCooldownTime((prevTime) => {
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
      const pointsEarned = Math.ceil(timeLeft / 3);
      setScore(score + pointsEarned);
      setIsCorrect(true);
      setTimeout(() => setIsCorrect(false), 500);
      fetchNewWord();
    } else {
      // Wrong answer shake animation
      const input = document.getElementById('word-input');
      input.classList.add('shake');
      setTimeout(() => input.classList.remove('shake'), 500);
    }
  };

  const sendScoreToAPI = async () => {
 
    if (score > 0) {
      try {
        const res = await fetch('/api/addGamePoints', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ telegramId: user.id, points: score }),
        });
        const updatedUser = await res.json();
        console.log('Score sent to API:', updatedUser);
      } catch (error) {
        console.error('Error sending score to API:', error);
      }
    }

    // Always update the last play time, regardless of score
    localStorage.setItem(`lastPlayTime_${user.id}`, Date.now().toString());
    checkCooldown();
  };

  const formatTime = (ms) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-black relative overflow-hidden">
      {/* Background Circles for effect */}
      <div className="absolute w-64 h-64 bg-black opacity-10 rounded-full top-10 left-10 animate-pulse"></div>
      <div className="absolute w-48 h-48 bg-black opacity-10 rounded-full bottom-10 right-10 animate-pulse"></div>

      {/* Main Content */}
      <div className="w-full max-w-md p-4 text-center bg-white shadow-xl rounded-lg z-10 relative">
        <h2 className="text-3xl font-bold mb-6">🧩 Unscramble the Word! 🧩</h2>
        <p className="text-xl font-semibold mb-4">Guess the country or crypto term</p>
        {!canPlay ? (
          <div className="text-lg text-red-500">
            <p>⏳ You need to wait before playing again.</p>
            <p>Time remaining: {formatTime(cooldownTime)}</p>
          </div>
        ) : !gameOver ? (
          <animated.div style={fadeIn}>
            <p className="mb-4 text-xl">
              Score: <animated.span>{scoreAnimation.number.to((n) => Math.floor(n))}</animated.span>
            </p>

            {/* Timer Bar */}
            <div className="w-full bg-gray-300 rounded-full h-4 mb-6">
              <animated.div className="bg-black h-4 rounded-full" style={timerAnimation}></animated.div>
            </div>

            {isLoading ? (
              <div className="loader">Loading...</div>
            ) : (
              <>
                <animated.p className="text-4xl font-bold mb-4" style={{ ...scrambleAnimation, ...correctAnimation }}>
                  {scrambledWord}
                </animated.p>
                <p className="text-lg mb-4">Hint: {hint}</p>
                <input
                  id="word-input"
                  type="text"
                  value={userInput}
                  onChange={handleInputChange}
                  className="w-full p-3 mb-4 border border-black rounded-lg text-center text-xl"
                  placeholder="Enter your guess"
                />
                <button
                  onClick={checkAnswer}
                  className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-all"
                >
                  Submit
                </button>
              </>
            )}
          </animated.div>
        ) : (
          <div className="text-lg">
            <p className="mb-4">Game Over! Your final score: {score}</p>
            <p>You can play again in: {formatTime(cooldownTime)}</p>
            <button
              onClick={() => {
                setScore(0);
                setGameOver(false);
                checkCooldown();
              }}
              className="w-full px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-900 transition-all mt-6"
              disabled={!canPlay}
            >
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
