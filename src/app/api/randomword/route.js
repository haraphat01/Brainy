// app/api/random-word/route.js

import { NextResponse } from 'next/server';

// This is a simple word list. In a real application, you'd want a much larger list.
const words = [
  'REACT', 'NEXT', 'JAVASCRIPT', 'TYPESCRIPT', 'NODE', 'EXPRESS', 'MONGO', 'POSTGRES',
  'PYTHON', 'DJANGO', 'FLASK', 'RUBY', 'RAILS', 'PHP', 'LARAVEL', 'JAVA', 'SPRING',
  'KOTLIN', 'SWIFT', 'OBJECTIVE', 'SCALA', 'HASKELL', 'RUST', 'GO', 'ELIXIR', 'PHOENIX'
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const length = searchParams.get('length');

  let filteredWords = words;
  if (length) {
    filteredWords = words.filter(word => word.length === parseInt(length));
  }

  if (filteredWords.length === 0) {
    return NextResponse.json({ error: 'No words found with the specified length' }, { status: 404 });
  }

  const randomWord = filteredWords[Math.floor(Math.random() * filteredWords.length)];
  
  return NextResponse.json({ word: randomWord });
}