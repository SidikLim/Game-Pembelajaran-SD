import { ANIMALS, BODY, COLORS, FAMILY, FRUITS, SENTENCES, LETTERS, LETTER_WORDS, NUMBERS, type PoolName, type VocabItem } from '../data/vocab';
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
  // 5 huruf
  { word: 'APPLE', emoji: '🍎', id: 'apple' }, { word: 'HORSE', emoji: '🐴', id: 'horse' }, { word: 'TIGER', emoji: '🐯', id: 'tiger' },
  { word: 'SNAKE', emoji: '🐍', id: 'snake' }, { word: 'MOUSE', emoji: '🐭', id: 'mouse' }, { word: 'HOUSE', emoji: '🏠', id: 'house' },
  { word: 'BREAD', emoji: '🍞', id: 'bread' }, { word: 'TRAIN', emoji: '🚂', id: 'train' }, { word: 'PIZZA', emoji: '🍕', id: 'pizza' },
  // 6 huruf
  { word: 'ORANGE', emoji: '🍊', id: 'orange' }, { word: 'BANANA', emoji: '🍌', id: 'banana' }, { word: 'RABBIT', emoji: '🐰', id: 'rabbit' },
  { word: 'MONKEY', emoji: '🐵', id: 'monkey' }, { word: 'FLOWER', emoji: '🌸', id: 'flower' }, { word: 'GUITAR', emoji: '🎸', id: 'guitar' },
  { word: 'SPIDER', emoji: '🕷️', id: 'spider' }, { word: 'TURTLE', emoji: '🐢', id: 'turtle' },
  // 7 huruf
  { word: 'CHICKEN', emoji: '🐔', id: 'chicken' }, { word: 'PENGUIN', emoji: '🐧', id: 'penguin' }, { word: 'DOLPHIN', emoji: '🐬', id: 'dolphin' },
  { word: 'PUMPKIN', emoji: '🎃', id: 'pumpkin' }, { word: 'PANCAKE', emoji: '🥞', id: 'pancake' }, { word: 'LOBSTER', emoji: '🦞', id: 'lobster' },
  { word: 'BALLOON', emoji: '🎈', id: 'balloon' },
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

export interface PickOption { id: string; text?: string; emoji?: string; color?: string; count?: number; speak: string }
export interface PickQuestion {
  /** Teks soal yang ditampilkan (kosong untuk soal mendengarkan huruf). */
  promptText?: string;
  /** Kalimat yang diucapkan tombol 🔊. */
  speak: string;
  options: PickOption[];
  answerId: string;
  /** Petunjuk setelah anak salah. */
  hint: string;
  /** Instruksi singkat di atas pilihan. */
  instruction: string;
}

const asOption = (v: VocabItem): PickOption => ({ id: v.id, emoji: v.emoji, color: v.color, count: v.count, speak: v.word });

function poolItems(pool: Exclude<PoolName, 'letters'>): VocabItem[] {
  switch (pool) {
    case 'animals': return ANIMALS;
    case 'colors': return COLORS;
    case 'animalsColors': return [...ANIMALS, ...COLORS];
    case 'numbers': return NUMBERS;
    case 'numbersFruits': return [...NUMBERS, ...FRUITS];
    case 'family': return FAMILY;
    case 'body': return BODY;
    case 'familyBody': return [...FAMILY, ...BODY];
    case 'sentences': return SENTENCES;
  }
}

/** Soal pilih-yang-cocok: huruf (dengar -> pilih huruf) atau kata (baca/dengar -> pilih gambar). */
export function makePickQuestions(rng: Rng, count: number, pool: PoolName, optionCount: number, letterCount = 26): PickQuestion[] {
  const out: PickQuestion[] = [];
  let lastId = '';
  const ids = pool === 'letters' ? LETTERS.slice(0, letterCount) : poolItems(pool).map((i) => i.id);
  while (out.length < count) {
    const answerId = ids[randInt(rng, 0, ids.length - 1)];
    if (answerId === lastId && ids.length > 1) continue;
    lastId = answerId;
    if (pool === 'letters') {
      const lw = LETTER_WORDS[answerId];
      const others = shuffle(rng, ids.filter((l) => l !== answerId)).slice(0, optionCount - 1);
      out.push({
        speak: `${answerId}. ${lw.word}`,
        options: shuffle(rng, [answerId, ...others]).map((l) => ({ id: l, text: l, speak: l })),
        answerId,
        hint: `Huruf ini ada di kata ${lw.word.toUpperCase()} ${lw.emoji}`,
        instruction: 'Dengarkan, lalu pilih hurufnya 👂',
      });
    } else {
      const items = poolItems(pool);
      const answer = items.find((i) => i.id === answerId)!;
      // Pilihan sejenis dengan jawaban (mis. angka dengan angka) agar adil.
      const kind = (i: VocabItem) => (i.count ? 'n' : i.color ? 'c' : 'e');
      const sameKind = items.filter((i) => i.id !== answerId && (pool !== 'numbersFruits' && pool !== 'animalsColors' ? true : kind(i) === kind(answer)));
      const others = shuffle(rng, sameKind).slice(0, optionCount - 1);
      const listening = pool === 'sentences';
      out.push({
        promptText: listening ? undefined : answer.word.toUpperCase(),
        speak: answer.word,
        options: shuffle(rng, [answer, ...others]).map(asOption),
        answerId,
        hint: listening ? `Kalimatnya: "${answer.word}"` : 'Tekan 🔊 untuk mendengar kata, lalu ketuk gambar untuk mendengar namanya',
        instruction: listening ? 'Dengarkan kalimatnya, lalu pilih gambarnya 👂' : 'Pilih gambar yang cocok 👆',
      });
    }
  }
  return out;
}

export interface SubQuestion { a: number; b: number; answer: number; options: number[] }

/** Pengurangan a - b dengan a <= maxMinuend dan hasil >= 1; 3 pilihan jawaban berbeda. */
export function makeSubQuestions(rng: Rng, count: number, maxMinuend: number): SubQuestion[] {
  const out: SubQuestion[] = [];
  let guard = 0;
  while (out.length < count && guard++ < 500) {
    const a = randInt(rng, 2, maxMinuend);
    const b = randInt(rng, 1, a - 1);
    const prev = out[out.length - 1];
    if (prev && prev.a === a && prev.b === b) continue;
    const answer = a - b;
    const opts = new Set<number>([answer]);
    while (opts.size < 3) opts.add(randInt(rng, 0, maxMinuend));
    out.push({ a, b, answer, options: shuffle(rng, [...opts]) });
  }
  return out;
}

export type ShapeKind = 'circle' | 'square' | 'triangle';
export const SHAPES: ShapeKind[] = ['circle', 'square', 'triangle'];
export const SHAPE_COLORS = ['#FF7A59', '#26C6DA', '#F6C453', '#4CC38A', '#8E6BE8', '#F48FB1'];
export interface ShapePiece { id: number; shape: ShapeKind; color: string; size: number }

/** Satu puzzle = `perShape` keping untuk tiap bentuk, diacak urutannya. */
export function makeShapePuzzles(rng: Rng, count: number, perShape: number): ShapePiece[][] {
  return Array.from({ length: count }, () => {
    const pieces: ShapePiece[] = [];
    SHAPES.forEach((shape) => {
      for (let k = 0; k < perShape; k++) {
        pieces.push({ id: pieces.length, shape, color: SHAPE_COLORS[randInt(rng, 0, SHAPE_COLORS.length - 1)], size: perShape > 1 ? randInt(rng, 52, 72) : 64 });
      }
    });
    return shuffle(rng, pieces).map((p, i) => ({ ...p, id: i }));
  });
}

/** Pilihan angka: jawaban + pengecoh dari kandidat (>= 1, bukan jawaban); dilengkapi bila kandidat kurang. */
function numberOptions(rng: Rng, answer: number, candidates: number[], count = 3): number[] {
  const picked = shuffle(rng, [...new Set(candidates.filter((c) => c >= 1 && c !== answer))]).slice(0, count - 1);
  for (let extra = answer + 1; picked.length < count - 1; extra++) if (!picked.includes(extra)) picked.push(extra);
  return shuffle(rng, [answer, ...picked]);
}

export interface MulQuestion { a: number; b: number; answer: number; options: number[] }

/** a kelompok berisi b benda; faktor 1..maxFactor (bukan 1x1), tidak berulang beruntun. */
export function makeMulQuestions(rng: Rng, count: number, maxFactor: number): MulQuestion[] {
  const out: MulQuestion[] = [];
  let guard = 0;
  while (out.length < count && guard++ < 500) {
    const a = randInt(rng, 1, maxFactor), b = randInt(rng, 1, maxFactor);
    if (a * b < 2) continue;
    const prev = out[out.length - 1];
    if (prev && prev.a === a && prev.b === b) continue;
    const answer = a * b;
    out.push({ a, b, answer, options: numberOptions(rng, answer, [a + b, answer + 1, answer - 1, answer + 2, answer - 2]) });
  }
  return out;
}

export interface ShareQuestion { plates: number; each: number; total: number }

/** Berbagi rata: total = piring x isi, total <= 20. */
export function makeShareQuestions(rng: Rng, count: number, maxPlates: number, maxEach: number): ShareQuestion[] {
  const out: ShareQuestion[] = [];
  let guard = 0;
  while (out.length < count && guard++ < 500) {
    const plates = randInt(rng, 2, maxPlates), each = randInt(rng, 1, maxEach);
    const prev = out[out.length - 1];
    if (prev && prev.plates === plates && prev.each === each) continue;
    out.push({ plates, each, total: plates * each });
  }
  return out;
}

export const fmtTime = (h: number, m: number) => `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
export interface ClockQuestion { h: number; m: number; answer: string; options: string[] }

/** Jam 1..12, menit 0 (dan 30 bila halfHours); 3 pilihan waktu berbeda. */
export function makeClockQuestions(rng: Rng, count: number, halfHours: boolean): ClockQuestion[] {
  const out: ClockQuestion[] = [];
  let guard = 0;
  while (out.length < count && guard++ < 500) {
    const h = randInt(rng, 1, 12), m = halfHours && rng() < 0.5 ? 30 : 0;
    const answer = fmtTime(h, m);
    if (out.length && out[out.length - 1].answer === answer) continue;
    const cands = [fmtTime((h % 12) + 1, m), fmtTime(((h + 10) % 12) + 1, m)];
    if (halfHours) cands.push(fmtTime(h, m === 0 ? 30 : 0));
    const picked = shuffle(rng, [...new Set(cands.filter((c) => c !== answer))]).slice(0, 2);
    while (picked.length < 2) {
      const c = fmtTime(randInt(rng, 1, 12), halfHours && rng() < 0.5 ? 30 : 0);
      if (c !== answer && !picked.includes(c)) picked.push(c);
    }
    out.push({ h, m, answer, options: shuffle(rng, [answer, ...picked]) });
  }
  return out;
}

export interface FractionOption { id: string; num: number; den: number }
export interface FractionQuestion { slices: number; colored: boolean[]; answerId: string; options: FractionOption[] }

const FRAC = { half: { id: '1/2', num: 1, den: 2 }, quarter: { id: '1/4', num: 1, den: 4 }, three: { id: '3/4', num: 3, den: 4 } };

/** Potongan pizza. Level 1: 1/2 dan 1/4 (2 pilihan). Level 2: + 3/4 (3 pilihan); 1/2 kadang digambar 2 dari 4 potong. */
export function makeFractionQuestions(rng: Rng, count: number, level: 1 | 2): FractionQuestion[] {
  const targets = level === 1 ? [FRAC.half, FRAC.quarter] : [FRAC.half, FRAC.quarter, FRAC.three];
  const out: FractionQuestion[] = [];
  let last = '';
  while (out.length < count) {
    const t = targets[randInt(rng, 0, targets.length - 1)];
    if (t.id === last && targets.length > 1) continue;
    last = t.id;
    const slices = t.den === 2 && level === 2 && rng() < 0.5 ? 4 : t.den;
    const k = slices === 4 && t.den === 2 ? 2 : t.num;
    const order = shuffle(rng, Array.from({ length: slices }, (_, i) => i));
    const colored = Array(slices).fill(false) as boolean[];
    order.slice(0, k).forEach((i) => { colored[i] = true; });
    out.push({ slices, colored, answerId: t.id, options: shuffle(rng, targets) });
  }
  return out;
}

export const VERBS = ['run', 'jump', 'sleep', 'eat', 'swim', 'dance', 'read', 'sing'] as const;
export type Verb = (typeof VERBS)[number];
export interface VerbQuestion { verb: Verb; options: Verb[] }

export function makeVerbQuestions(rng: Rng, count: number, optionCount: number): VerbQuestion[] {
  const out: VerbQuestion[] = [];
  while (out.length < count) {
    const verb = VERBS[randInt(rng, 0, VERBS.length - 1)];
    if (out.length && out[out.length - 1].verb === verb) continue;
    const others = shuffle(rng, VERBS.filter((v) => v !== verb)).slice(0, optionCount - 1);
    out.push({ verb, options: shuffle(rng, [verb, ...others]) });
  }
  return out;
}
