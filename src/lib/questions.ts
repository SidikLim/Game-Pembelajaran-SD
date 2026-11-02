import { randInt, shuffle, type Rng } from './random';

export interface SumQuestion { a: number; b: number; answer: number }

/** Soal penjumlahan acak dengan jumlah 2..maxSum; soal berurutan tidak identik. */
export function makeSumQuestions(rng: Rng, count: number, maxSum: number): SumQuestion[] {
  const out: SumQuestion[] = [];
  let guard = 0;
  while (out.length < count && guard++ < 500) {
    const a = randInt(rng, 1, Math.max(1, maxSum - 1));
    const b = randInt(rng, 1, maxSum - a);
    if (b < 1) continue;
    const prev = out[out.length - 1];
    if (prev && prev.a === a && prev.b === b) continue;
    out.push({ a, b, answer: a + b });
  }
  return out;
}

export interface CountQuestion { target: number; options: number[] }

/** Soal "pilih kelompok berjumlah N": 3 pilihan berbeda dalam 1..max, target tak sama dengan soal sebelumnya. */
export function makeCountQuestions(rng: Rng, count: number, max: number): CountQuestion[] {
  const out: CountQuestion[] = [];
  while (out.length < count) {
    const target = randInt(rng, 1, max);
    if (out.length && out[out.length - 1].target === target && max > 1) continue;
    const opts = new Set<number>([target]);
    const want = Math.min(3, max);
    while (opts.size < want) opts.add(randInt(rng, 1, max));
    out.push({ target, options: shuffle(rng, [...opts]) });
  }
  return out;
}

export interface WordEntry { word: string; emoji: string; id: string }

export const WORDS: WordEntry[] = [
  { word: 'CAT', emoji: '🐱', id: 'cat' }, { word: 'DOG', emoji: '🐶', id: 'dog' },
  { word: 'PIG', emoji: '🐷', id: 'pig' }, { word: 'COW', emoji: '🐮', id: 'cow' },
  { word: 'HEN', emoji: '🐔', id: 'hen' }, { word: 'BEE', emoji: '🐝', id: 'bee' },
  { word: 'SUN', emoji: '☀️', id: 'sun' }, { word: 'BUS', emoji: '🚌', id: 'bus' },
  { word: 'FISH', emoji: '🐟', id: 'fish' }, { word: 'BIRD', emoji: '🐦', id: 'bird' },
  { word: 'FROG', emoji: '🐸', id: 'frog' }, { word: 'DUCK', emoji: '🦆', id: 'duck' },
  { word: 'STAR', emoji: '⭐', id: 'star' }, { word: 'MOON', emoji: '🌙', id: 'moon' },
  { word: 'TREE', emoji: '🌳', id: 'tree' }, { word: 'BOOK', emoji: '📖', id: 'book' },
];

export interface SpellQuestion { entry: WordEntry; letters: string[] }

/** Acak huruf; dijamin urutannya berbeda dari kata asli bila memungkinkan. */
export function scramble(rng: Rng, word: string): string[] {
  const chars = word.split('');
  if (new Set(chars).size < 2) return chars;
  let out = shuffle(rng, chars);
  let guard = 0;
  while (out.join('') === word && guard++ < 50) out = shuffle(rng, chars);
  return out;
}

export function makeSpellQuestions(rng: Rng, count: number, wordLength: number): SpellQuestion[] {
  const pool = shuffle(rng, WORDS.filter((w) => w.word.length === wordLength));
  return pool.slice(0, count).map((entry) => ({ entry, letters: scramble(rng, entry.word) }));
}
