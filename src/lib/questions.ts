import { ANIMALS, BODY, COLORS, FAMILY, FRUITS, SENTENCES, LETTERS, LETTER_WORDS, NUMBERS, type PoolName, type VocabItem } from '../data/vocab';
import { FILL_BANK, STORY_BANK } from '../data/english3';
import { ID_FILL_BANK, ID_SENTENCE_GROUPS, type IdFillBank } from '../data/indonesia2';
import { ID_LETTERS, ID_LETTER_NAME, ID_LETTER_WORDS, ID_OBJECTS, ID_SENTENCES, ID_SYLLABLES, ID_WORDS } from '../data/indonesia';
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

/** `tokens` = urutan benar (huruf atau suku kata); `letters` = token yang sudah diacak. */
export interface SpellQuestion { entry: WordEntry; letters: string[]; tokens: string[] }

/** Acak token; dijamin urutannya berbeda dari aslinya bila memungkinkan. */
export function scrambleTokens(rng: Rng, tokens: string[]): string[] {
  if (new Set(tokens).size < 2) return [...tokens];
  const word = tokens.join('');
  let out = shuffle(rng, tokens);
  let guard = 0;
  while (out.join('') === word && guard++ < 50) out = shuffle(rng, tokens);
  return out;
}

/** Acak huruf sebuah kata. */
export function scramble(rng: Rng, word: string): string[] {
  return scrambleTokens(rng, word.split(''));
}

export function makeSpellQuestions(rng: Rng, count: number, wordLength: number): SpellQuestion[] {
  const pool = shuffle(rng, WORDS.filter((w) => w.word.length === wordLength));
  return pool.slice(0, count).map((entry) => ({ entry, letters: scramble(rng, entry.word), tokens: entry.word.split('') }));
}

/** Susun huruf Bahasa Indonesia (kata 4 atau 5 huruf, huruf kecil). */
export function makeIdSpellQuestions(rng: Rng, count: number, wordLength: number): SpellQuestion[] {
  const pool = shuffle(rng, ID_WORDS.filter((w) => w.word.length === wordLength));
  return pool.slice(0, count).map((entry) => ({ entry, letters: scramble(rng, entry.word), tokens: entry.word.split('') }));
}

/** Susun suku kata menjadi kata. group 1: ba-ju, 2: ru-mah, 3: se-pa-tu. */
export function makeSyllableQuestions(rng: Rng, count: number, group: 1 | 2 | 3): SpellQuestion[] {
  return shuffle(rng, ID_SYLLABLES[group]).slice(0, count).map((w) => ({
    entry: { word: w.word, emoji: w.emoji, id: w.word },
    letters: scrambleTokens(rng, w.syllables),
    tokens: w.syllables,
  }));
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

function poolItems(pool: Exclude<PoolName, 'letters' | 'idLetters'>): VocabItem[] {
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
    case 'idObjects': return ID_OBJECTS;
    case 'idSentences': return ID_SENTENCES;
  }
}

/** Soal pilih-yang-cocok: huruf (dengar -> pilih huruf) atau kata (baca/dengar -> pilih gambar). */
export function makePickQuestions(rng: Rng, count: number, pool: PoolName, optionCount: number, letterCount = 26, letterSet?: string): PickQuestion[] {
  const out: PickQuestion[] = [];
  let lastId = '';
  const isLetters = pool === 'letters' || pool === 'idLetters';
  const letterIds = letterSet ? letterSet.toUpperCase().split('') : (pool === 'idLetters' ? ID_LETTERS : LETTERS).slice(0, letterCount);
  const ids = isLetters ? letterIds : poolItems(pool as Exclude<PoolName, 'letters' | 'idLetters'>).map((i) => i.id);
  while (out.length < count) {
    const answerId = ids[randInt(rng, 0, ids.length - 1)];
    if (answerId === lastId && ids.length > 1) continue;
    lastId = answerId;
    if (pool === 'idLetters') {
      const lw = ID_LETTER_WORDS[answerId];
      const name = ID_LETTER_NAME[answerId.toLowerCase()];
      const others = shuffle(rng, ids.filter((l) => l !== answerId)).slice(0, optionCount - 1);
      out.push({
        speak: `${name}. ${lw.word}`,
        options: shuffle(rng, [answerId, ...others]).map((l) => ({ id: l, text: l.toLowerCase(), speak: ID_LETTER_NAME[l.toLowerCase()] })),
        answerId,
        hint: `Huruf ini ada di kata ${lw.word.toUpperCase()} ${lw.emoji}`,
        instruction: 'Dengarkan, lalu pilih hurufnya 👂',
      });
    } else if (pool === 'letters') {
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
      const keepCase = pool === 'idSentences'; // kalimat dibaca apa adanya, bukan huruf kapital semua
      out.push({
        promptText: listening ? undefined : keepCase ? answer.word : answer.word.toUpperCase(),
        speak: answer.word,
        options: shuffle(rng, [answer, ...others]).map(asOption),
        answerId,
        hint: listening ? `Kalimatnya: "${answer.word}"` : keepCase ? 'Baca pelan-pelan, atau tekan 🔊 untuk mendengarkan kalimatnya' : 'Tekan 🔊 untuk mendengar kata, lalu ketuk gambar untuk mendengar namanya',
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
function numberOptions(rng: Rng, answer: number, candidates: number[], count = 3, step = 1): number[] {
  const picked = shuffle(rng, [...new Set(candidates.filter((c) => Number.isInteger(c) && c >= 1 && c !== answer))]).slice(0, count - 1);
  for (let extra = answer + step; picked.length < count - 1; extra += step) if (!picked.includes(extra)) picked.push(extra);
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

// ---------------------------------------------------------------- Tingkat 3 (kelas 5-6)

export type ArithKind = 'mul' | 'div' | 'mulDiv' | 'discountAmount' | 'discountPrice' | 'decimal' | 'storyBasic' | 'storyMulDiv' | 'storyTwoStep' | 'storyMix';
export interface ChoiceOption { id: string; text: string }
export interface ArithQuestion {
  emoji: string;
  /** Soal utama (atau isi cerita). */
  text: string;
  /** Keterangan tambahan, mis. nama barang dan harga. */
  sub?: string;
  options: ChoiceOption[];
  answerId: string;
  hint: string;
}

export const rupiah = (n: number) => `Rp ${n.toLocaleString('id-ID')}`;
/** Ratusan -> teks desimal berkoma: 125 -> "1,25", 150 -> "1,5", 200 -> "2". */
export function fmtDec(hundredths: number): string {
  const whole = Math.floor(hundredths / 100), frac = hundredths % 100;
  if (frac === 0) return String(whole);
  return `${whole},${String(frac).padStart(2, '0').replace(/0$/, '')}`;
}

function choiceSet(rng: Rng, answer: number, cands: number[], count: number, fmt: (n: number) => string, step = 1): { options: ChoiceOption[]; answerId: string } {
  const nums = numberOptions(rng, answer, cands, count, step);
  return { options: nums.map((n) => ({ id: String(n), text: fmt(n) })), answerId: String(answer) };
}

const TOYS = [{ emoji: '🧸', name: 'Boneka' }, { emoji: '🚗', name: 'Mobil mainan' }, { emoji: '🤖', name: 'Robot' }, { emoji: '🪁', name: 'Layang-layang' }];
const pick = <T,>(rng: Rng, arr: readonly T[]): T => arr[randInt(rng, 0, arr.length - 1)];

type Gen = (rng: Rng, count: number) => Omit<ArithQuestion, 'options' | 'answerId'> & { answer: number; cands: number[]; fmt?: (n: number) => string; step?: number };

const gMul: Gen = (rng, _c) => {
  const a = randInt(rng, 2, 10), b = randInt(rng, 2, 10), answer = a * b;
  return { emoji: '✖️', text: `${a} × ${b} = ?`, hint: `${a} × ${b}: tambahkan ${a} sebanyak ${b} kali`, answer, cands: [answer + a, answer - a, answer + b, answer - b, (a + 1) * b, (a - 1) * b, a * (b + 1), a * (b - 1), a + b] };
};
const gDivision: Gen = (rng) => {
  const b = randInt(rng, 2, 10), q = randInt(rng, 2, 10), a = b * q;
  return { emoji: '➗', text: `${a} ÷ ${b} = ?`, hint: `${b} × ? = ${a}`, answer: q, cands: [q + 1, q - 1, q + 2, q - 2, b, a - b] };
};
const gDiscAmount: Gen = (rng) => {
  const price = pick(rng, [10000, 20000, 40000, 50000, 80000, 100000]), pct = pick(rng, [10, 20, 50]), toy = pick(rng, TOYS);
  const amount = (price * pct) / 100;
  return { emoji: toy.emoji, text: `Diskon ${pct}% — berapa potongan harganya?`, sub: `${toy.name} ${rupiah(price)}`, hint: `${pct}% artinya ${pct} per 100. Hitung ${rupiah(price)} × ${pct} ÷ 100`, answer: amount, cands: [price - amount, amount * 2, price / 10, price / 2, price / 4, amount + 1000], fmt: rupiah, step: 1000 };
};
const gDiscPrice: Gen = (rng) => {
  const price = pick(rng, [20000, 40000, 50000, 80000, 100000]), pct = pick(rng, [10, 20, 25, 50]), toy = pick(rng, TOYS);
  const amount = (price * pct) / 100;
  return { emoji: toy.emoji, text: `Diskon ${pct}% — berapa harga yang harus dibayar?`, sub: `${toy.name} ${rupiah(price)}`, hint: `Hitung potongan dulu (${pct}% dari ${rupiah(price)}), lalu kurangkan dari harga`, answer: price - amount, cands: [amount, price + amount, price - 2 * amount, price / 2], fmt: rupiah, step: 1000 };
};
const DEC_ITEMS = [{ emoji: '🧃', name: 'jus', unit: 'liter' }, { emoji: '🍎', name: 'apel', unit: 'kg' }, { emoji: '🧵', name: 'pita', unit: 'meter' }];
const gDecimal: Gen = (rng) => {
  const item = pick(rng, DEC_ITEMS), plus = rng() < 0.5;
  const a = randInt(rng, 10, 80) * 5; // 0,5 .. 4,0
  const b = plus ? randInt(rng, 5, 60) * 5 : randInt(rng, 5, Math.max(5, a / 5 - 5)) * 5;
  const answer = plus ? a + b : a - b;
  return { emoji: item.emoji, text: `${fmtDec(a)} ${plus ? '+' : '−'} ${fmtDec(b)} = ?`, sub: `${item.name} (${item.unit})`, hint: `Samakan jumlah angka di belakang koma, lalu ${plus ? 'tambahkan' : 'kurangkan'}`, answer, cands: [answer + 10, answer - 10, answer + 100, answer - 100, answer + 50, answer - 50], fmt: fmtDec, step: 5 };
};

const story = {
  add: ((rng) => { const a = randInt(rng, 10, 60), b = randInt(rng, 10, 99 - a), t = a + b;
    return { emoji: '🪙', text: `Kapten Kaka menemukan ${a} koin emas di pantai dan ${b} koin lagi di gua. Berapa koin yang ia punya sekarang?`, hint: 'Gabungkan kedua jumlah koin: tambahkan', answer: t, cands: [t + 10, t - 10, t + 1, t - 1, a - b] }; }) as Gen,
  sub: ((rng) => { const a = randInt(rng, 20, 90), b = randInt(rng, 5, a - 5), t = a - b;
    return { emoji: '📦', text: `Kapal bajak laut memuat ${a} peti. ${b} peti diturunkan di pulau. Berapa peti yang masih ada di kapal?`, hint: 'Peti diturunkan, jadi kurangkan', answer: t, cands: [a + b, t + 10, t - 10, b, t + 1] }; }) as Gen,
  mul: ((rng) => { const a = randInt(rng, 2, 9), b = randInt(rng, 2, 10), t = a * b;
    return { emoji: '🦪', text: `Ada ${a} kantong, setiap kantong berisi ${b} mutiara. Berapa semua mutiara?`, hint: 'Kelompok yang sama banyak: kalikan', answer: t, cands: [a + b, t + a, t - b, t + b, t - a] }; }) as Gen,
  div: ((rng) => { const n = randInt(rng, 2, 8), each = randInt(rng, 2, 9), total = n * each;
    return { emoji: '💎', text: `${total} permata dibagi rata kepada ${n} awak kapal. Berapa permata untuk tiap awak?`, hint: 'Dibagi rata: gunakan pembagian', answer: each, cands: [each + 1, each - 1, each + 2, n, total - n] }; }) as Gen,
  two: ((rng) => { const n = randInt(rng, 2, 5), p = randInt(rng, 1, 4) * 5, a = n * p + randInt(rng, 5, 40), t = a - n * p;
    return { emoji: '🗺️', text: `Kapten punya ${a} koin. Ia membeli ${n} peta harta, harga satu peta ${p} koin. Berapa sisa koin Kapten?`, hint: 'Hitung dulu harga semua peta (kali), lalu kurangkan dari koinnya', answer: t, cands: [a - p, a + n * p, n * p, t + 10, t - 5, t + 5] }; }) as Gen,
  pct: ((rng) => { const price = pick(rng, [20, 40, 50, 80, 100]), pc = pick(rng, [10, 20, 25, 50]), d = (price * pc) / 100, t = price - d;
    return { emoji: '🏴‍☠️', text: `Peta harta dijual ${price} koin dengan diskon ${pc}%. Berapa koin yang harus dibayar?`, hint: 'Hitung diskonnya dulu, lalu kurangkan dari harga', answer: t, cands: [d, price + d, price - 2 * d, price / 2] }; }) as Gen,
};

const ARITH_GENS: Record<ArithKind, Gen[]> = {
  mul: [gMul], div: [gDivision], mulDiv: [gMul, gDivision],
  discountAmount: [gDiscAmount], discountPrice: [gDiscPrice], decimal: [gDecimal],
  storyBasic: [story.add, story.sub], storyMulDiv: [story.mul, story.div], storyTwoStep: [story.two],
  storyMix: [story.add, story.sub, story.mul, story.div, story.two, story.pct],
};

/** Soal hitung Tingkat 3 (kali/bagi, diskon, desimal, soal cerita); tidak ada dua soal identik beruntun. */
export function makeArithQuestions(rng: Rng, count: number, kind: ArithKind, optionCount: number): ArithQuestion[] {
  const gens = ARITH_GENS[kind];
  const out: ArithQuestion[] = [];
  let guard = 0;
  while (out.length < count && guard++ < 500) {
    const g = pick(rng, gens)(rng, count);
    if (out.length && out[out.length - 1].text === g.text) continue;
    const { answer, cands, fmt = String, step, ...rest } = g;
    const { options, answerId } = choiceSet(rng, answer, cands, optionCount, fmt, step);
    out.push({ ...rest, options, answerId });
  }
  return out;
}

export type Prep = 'in' | 'on' | 'under' | 'behind';
export interface PrepQuestion { prep: Prep; obj: { emoji: string; name: string }; options: Prep[] }
export const PREP_OBJECTS = [{ emoji: '🐱', name: 'cat' }, { emoji: '🐶', name: 'dog' }, { emoji: '⚽', name: 'ball' }, { emoji: '🐭', name: 'mouse' }, { emoji: '🐥', name: 'chick' }];

export function makePrepQuestions(rng: Rng, count: number, preps: Prep[], optionCount: number): PrepQuestion[] {
  const out: PrepQuestion[] = [];
  while (out.length < count) {
    const prep = pick(rng, preps);
    if (out.length && out[out.length - 1].prep === prep && preps.length > 1) continue;
    const others = shuffle(rng, preps.filter((p) => p !== prep)).slice(0, optionCount - 1);
    out.push({ prep, obj: pick(rng, PREP_OBJECTS), options: shuffle(rng, [prep, ...others]) });
  }
  return out;
}

export interface FillQuestion { text: string; answer: string; options: string[]; emoji: string; hint?: string }
export function makeFillQuestions(rng: Rng, count: number, tier: 1 | 2 | 3): FillQuestion[] {
  return shuffle(rng, FILL_BANK[tier]).slice(0, count).map((f) => ({ text: f.text, answer: f.answer, emoji: f.emoji, options: shuffle(rng, [f.answer, ...f.wrongs]) }));
}

/** Soal rumpang Bahasa Indonesia Tingkat 2 (imbuhan, lawan/persamaan kata, tanda baca, huruf kapital). */
export function makeIdFillQuestions(rng: Rng, count: number, bank: IdFillBank): FillQuestion[] {
  return shuffle(rng, ID_FILL_BANK[bank]).slice(0, count).map((f) => ({ text: f.text, answer: f.answer, emoji: f.emoji, hint: f.hint, options: shuffle(rng, [f.answer, ...f.wrongs]) }));
}

/** Menyusun kalimat: token = kata (kata pertama berhuruf kapital, titik di kata terakhir). */
export function makeSentenceQuestions(rng: Rng, count: number, group: 1 | 2): SpellQuestion[] {
  return shuffle(rng, ID_SENTENCE_GROUPS[group]).slice(0, count).map((s) => {
    const tokens = s.text.split(' ');
    return { entry: { word: s.text, emoji: s.emoji, id: s.text }, tokens, letters: scrambleTokens(rng, tokens) };
  });
}

export interface StoryQuestion { story: string; emoji: string; question: string; answer: string; options: string[] }
export function makeStoryQuestions(rng: Rng, count: number, level: 1 | 2 | 3 | 4): StoryQuestion[] {
  return shuffle(rng, STORY_BANK[level]).slice(0, count).map((st) => ({ story: st.story, emoji: st.emoji, question: st.question, answer: st.answer, options: shuffle(rng, [st.answer, ...st.wrongs]) }));
}
