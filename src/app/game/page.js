'use client';
import React, { useState, useEffect, useCallback } from 'react';
import { useTelegram } from '../TelegramProvider';
import { useSpring, animated, config } from 'react-spring';

const GAME_DURATION = 30; // 30 seconds per word
const COOLDOWN_PERIOD = 0.001 * 60 * 60 * 1000; // 3 hours in milliseconds

const CORRECT_ROASTS = [
  "Wow, you actually got that right! Even a broken clock is right twice a day.",
  "Congratulations! Your brain cells finally decided to show up for work.",
  "Look at you, solving words like a pro! Your parents must be so proud.",
  "Correct! I bet you feel like a genius now. Don't let it go to your head.",
  "You got it! Maybe there's hope for you after all.",
  "Well, well, well, someone actually knows what they’re doing for once.",
  "Nicely done! I’m genuinely shocked you didn’t mess that up.",
  "You got that one right? Maybe today is your lucky day.",
  "Congrats! Now don’t get cocky, it might just be a fluke.",
  "You did it! I’m starting to think you're on a roll… a very slow roll.",
  "Amazing! I didn’t know guessing could be so accurate.",
  "That’s right! Maybe miracles do happen.",
  "Yes! You finally decided to use your brain. Keep it up.",
  "Correct! See? You're not completely hopeless after all.",
  "I can’t believe it… you got it right! I'm still in shock.",
  "Well done! You must have had a rare moment of clarity.",
  "Hey, you got one! Maybe the stars aligned just for this moment.",
  "Correct again! Are you secretly Googling the answers?",
  "Nice! I guess even you deserve a win sometimes.",
  "Boom! Right on the money. Are you sure you’re the same person as before?"
];


const INCORRECT_ROASTS = [
  "Wrong! Did you forget how to spell, or is your keyboard broken?",
  "Nope! Maybe try using your brain next time?",
  "Incorrect! I've seen smarter answers written in crayon.",
  "Wrong again! You're really committed to being wrong, aren't you?",
  "That's not it! Are you trying to lose on purpose?",
  "Wrong! That answer was as disappointing as a soggy sandwich.",
  "Nope! It’s like you're aiming for the wrong answer on purpose.",
  "Incorrect! You’re about as accurate as a weather forecast.",
  "Nope! Your wrong answer streak is really impressive at this point.",
  "Wrong again! If there were an award for failure, you’d be on top.",
  "Nope! Were you even paying attention, or was that a wild guess?",
  "Incorrect! That answer was more off the mark than a dart thrown blindfolded.",
  "Wrong! Is your keyboard working, or is this some kind of sabotage?",
  "Nope! I'm pretty sure even a random guess would have been better than that.",
  "Incorrect! Are you trying to win the award for most consistent failure?",
  "Wrong! Did you try turning your brain off and on again?",
  "Nope! That’s like trying to fit a square peg in a round hole.",
  "Wrong! You really took a detour on the road to the right answer.",
  "Incorrect! If I had a dollar for every wrong answer, I’d be rich by now.",
  "Nope! I’m amazed at your dedication to being wrong."
];


export default function ScrabbleGame() {
  const { user } = useTelegram();
  const [words, setWords] = useState([]);
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
  const [roast, setRoast] = useState('');

  // Fetch all words once
  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch('/api/randomword');
        if (!response.ok) {
          throw new Error('Failed to fetch words');
        }
        const data = await response.json();
        setWords(data.words);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching words:', error);
        setIsLoading(false);
      }
    };
    fetchWords();
  }, []);

  const scrambleWord = useCallback((word) => {
    return word.split('').sort(() => Math.random() - 0.5).join('');
  }, []);

  const fetchNewWord = useCallback(() => {
    if (words.length > 0) {
      const randomIndex = Math.floor(Math.random() * words.length);
      const newWord = words[randomIndex];
      setCurrentWord(newWord);
      setScrambledWord(scrambleWord(newWord));
      setHint(''); // Set the hint if needed
      setTimeLeft(GAME_DURATION);
      setUserInput('');
    }
  }, [words, scrambleWord]);

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
      setRoast(CORRECT_ROASTS[Math.floor(Math.random() * CORRECT_ROASTS.length)]);
      setTimeout(() => {
        setIsCorrect(false);
        setRoast('');
        fetchNewWord();
      }, 2000);
    } else {
      setIsCorrect(false);
      setRoast(INCORRECT_ROASTS[Math.floor(Math.random() * INCORRECT_ROASTS.length)]);
      const input = document.getElementById('word-input');
      input.classList.add('shake');
      setTimeout(() => {
        input.classList.remove('shake');
        setRoast('');
      }, 3000);
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

    localStorage.setItem(`lastPlayTime_${user.id}`, Date.now().toString());
    checkCooldown();
  };

  const formatTime = (ms) => {
    const hours = Math.floor(ms / 3600000);
    const minutes = Math.floor((ms % 3600000) / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  // Animations
  const fadeIn = useSpring({
    opacity: isLoading ? 0 : 1,
    config: config.molasses,
  });

  const scoreAnimation = useSpring({
    number: score,
    from: { number: 0 },
  });

  const timerAnimation = useSpring({
    width: `${(timeLeft / GAME_DURATION) * 100}%`,
    config: config.molasses,
  });

  const scrambleAnimation = useSpring({
    opacity: 1,
    from: { opacity: 0 },
    reset: true,
    key: scrambledWord,
  });

  const correctAnimation = useSpring({
    transform: isCorrect ? 'scale(1.1)' : 'scale(1)',
    config: config.wobbly,
  });

  const roastAnimation = useSpring({
    opacity: roast ? 1 : 0,
    transform: roast ? 'translateY(0)' : 'translateY(20px)',
    config: config.wobbly,
  });

  return (
    <div className="flex items-center justify-center min-h-screen bg-white text-black relative overflow-hidden">
      <div className="absolute w-64 h-64 bg-black opacity-10 rounded-full top-10 left-10 animate-pulse"></div>
      <div className="absolute w-48 h-48 bg-black opacity-10 rounded-full bottom-10 right-10 animate-pulse"></div>

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
                <animated.p style={roastAnimation} className="mt-4 text-lg font-bold">
                  {roast}
                </animated.p>
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