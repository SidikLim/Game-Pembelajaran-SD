import type { ChallengeType, LevelConfig, Subject } from '../lib/types';

interface StepDef {
  tier: 1 | 2 | 3;
  step: number;
  from: number;
  to: number;
  title: string;
  goal: string;
  challenge: ChallengeType;
  /** Parameter tiap level dalam step (opsional), diindeks dari level pertama step. */
  params?: LevelConfig['params'][];
  /** Jumlah soal per level (bawaan 5). */
  questions?: number;
}

const MATH: StepDef[] = [
  { tier: 1, step: 1, from: 1, to: 3, title: 'Mengenal Angka 1–20', goal: 'Pilih kelompok apel dengan jumlah yang tepat', challenge: 'countPick', params: [{ maxCount: 5 }, { maxCount: 10 }, { maxCount: 20 }] },
  { tier: 1, step: 2, from: 4, to: 6, title: 'Menjumlah di Keranjang', goal: 'Seret buah ke keranjang sesuai hasil penjumlahan', challenge: 'dragSum', params: [{ maxSum: 5 }, { maxSum: 8 }, { maxSum: 10 }] },
  { tier: 1, step: 3, from: 7, to: 8, title: 'Mengurang dengan Balon', goal: 'Pecahkan balon, lalu hitung sisanya', challenge: 'balloonSub', params: [{ maxMinuend: 5 }, { maxMinuend: 10 }] },
  { tier: 1, step: 4, from: 9, to: 10, title: 'Puzzle Bentuk', goal: 'Pasangkan lingkaran, persegi, segitiga', challenge: 'shapePuzzle', questions: 3, params: [{ perShape: 1 }, { perShape: 2 }] },
  { tier: 2, step: 5, from: 11, to: 13, title: 'Perkalian Dasar', goal: 'Hitung kelompok gambar berulang', challenge: 'multiply', params: [{ maxFactor: 3 }, { maxFactor: 4 }, { maxFactor: 5 }] },
  { tier: 2, step: 6, from: 14, to: 16, title: 'Berbagi Rata', goal: 'Bagi rata kue ke beberapa piring', challenge: 'shareEqual', params: [{ maxPlates: 2, maxEach: 3 }, { maxPlates: 3, maxEach: 4 }, { maxPlates: 4, maxEach: 5 }] },
  { tier: 2, step: 7, from: 17, to: 18, title: 'Membaca Jam', goal: 'Hubungkan jarum jam dengan angka waktu', challenge: 'clockRead', params: [{ halfHours: false }, { halfHours: true }] },
  { tier: 2, step: 8, from: 19, to: 20, title: 'Pecahan Dasar', goal: 'Kenali ½, ¼, ¾ dari potongan pizza', challenge: 'fractionPick', params: [{ fractionLevel: 1 }, { fractionLevel: 2 }] },
  { tier: 3, step: 9, from: 21, to: 23, title: 'Kali & Bagi Lanjut', goal: 'Perkalian dan pembagian 1–10', challenge: 'arith', params: [{ arith: 'mul', options: 3 }, { arith: 'div', options: 3 }, { arith: 'mulDiv', options: 3 }] },
  { tier: 3, step: 10, from: 24, to: 26, title: 'Desimal & Persen', goal: 'Hitung diskon di toko mainan', challenge: 'arith', params: [{ arith: 'discountAmount', options: 3 }, { arith: 'discountPrice', options: 3 }, { arith: 'decimal', options: 3 }] },
  { tier: 3, step: 11, from: 27, to: 30, title: 'Soal Cerita Petualangan', goal: 'Pilih jawaban dari cerita petualangan', challenge: 'arith', params: [{ arith: 'storyBasic', options: 4 }, { arith: 'storyMulDiv', options: 4 }, { arith: 'storyTwoStep', options: 4 }, { arith: 'storyMix', options: 4 }] },
];

const ENGLISH: StepDef[] = [
  { tier: 1, step: 1, from: 1, to: 3, title: 'Phonics & Alphabet', goal: 'Dengar bunyi, cocokkan huruf', challenge: 'pickMatch', params: [{ pool: 'letters', letterCount: 6, options: 3 }, { pool: 'letters', letterCount: 14, options: 3 }, { pool: 'letters', letterCount: 26, options: 4 }] },
  { tier: 1, step: 2, from: 4, to: 6, title: 'Animals & Colors', goal: 'Sentuh gambar, dengar katanya', challenge: 'pickMatch', params: [{ pool: 'animals', options: 3 }, { pool: 'colors', options: 3 }, { pool: 'animalsColors', options: 4 }] },
  { tier: 1, step: 3, from: 7, to: 8, title: 'Numbers & Fruits', goal: 'Cocokkan teks dengan gambar', challenge: 'pickMatch', params: [{ pool: 'numbers', options: 3 }, { pool: 'numbersFruits', options: 4 }] },
  { tier: 1, step: 4, from: 9, to: 10, title: 'Spelling Bee', goal: 'Susun huruf acak menjadi kata', challenge: 'spellingBee', params: [{ wordLength: 3 }, { wordLength: 4 }] },
  { tier: 2, step: 5, from: 11, to: 13, title: 'Family & Body Parts', goal: 'Kenali anggota keluarga dan tubuh', challenge: 'pickMatch', params: [{ pool: 'family', options: 3 }, { pool: 'body', options: 3 }, { pool: 'familyBody', options: 4 }] },
  { tier: 2, step: 6, from: 14, to: 16, title: 'Spelling Bee 5–7 Huruf', goal: 'Susun kata yang lebih panjang', challenge: 'spellingBee', params: [{ wordLength: 5 }, { wordLength: 6 }, { wordLength: 7 }] },
  { tier: 2, step: 7, from: 17, to: 18, title: 'Action Verbs', goal: 'Cocokkan gerakan dengan kata kerja', challenge: 'actionVerb', params: [{ verbMode: 'see', options: 3 }, { verbMode: 'read', options: 4 }] },
  { tier: 2, step: 8, from: 19, to: 20, title: 'Listening', goal: 'Dengar kalimat, pilih gambar', challenge: 'pickMatch', params: [{ pool: 'sentences', options: 3 }, { pool: 'sentences', options: 4 }] },
  { tier: 3, step: 9, from: 21, to: 23, title: 'Fill in the Blanks', goal: 'Lengkapi kalimat rumpang', challenge: 'fillBlank', params: [{ fillTier: 1 }, { fillTier: 2 }, { fillTier: 3 }] },
  { tier: 3, step: 10, from: 24, to: 26, title: 'Prepositions', goal: 'In, On, Under, Behind', challenge: 'preposition', params: [{ preps: ['in', 'on', 'under'], options: 3 }, { preps: ['in', 'on', 'under', 'behind'], options: 4 }, { preps: ['in', 'on', 'under', 'behind'], options: 4, sentenceMode: true }] },
  { tier: 3, step: 11, from: 27, to: 30, title: 'Short Stories', goal: 'Baca cerita bergambar, jawab pertanyaan', challenge: 'story', params: [{ storyLevel: 1 }, { storyLevel: 2 }, { storyLevel: 3 }, { storyLevel: 4 }] },
];

const INDONESIA: StepDef[] = [
  { tier: 1, step: 1, from: 1, to: 3, title: 'Mengenal Huruf', goal: 'Dengarkan huruf, pilih hurufnya', challenge: 'pickMatch',
    params: [{ pool: 'idLetters', letterSet: 'aiueo', options: 3, lang: 'id' }, { pool: 'idLetters', letterSet: 'abcdefghijklm', options: 3, lang: 'id' }, { pool: 'idLetters', letterSet: 'abcdefghijklmnopqrstuvwxyz', options: 4, lang: 'id' }] },
  { tier: 1, step: 2, from: 4, to: 6, title: 'Menyusun Suku Kata', goal: 'Susun suku kata menjadi kata', challenge: 'spellingBee',
    params: [{ syllableGroup: 1, lang: 'id' }, { syllableGroup: 2, lang: 'id' }, { syllableGroup: 3, lang: 'id' }] },
  { tier: 1, step: 3, from: 7, to: 8, title: 'Menyusun Huruf Menjadi Kata', goal: 'Susun huruf acak menjadi kata', challenge: 'spellingBee',
    params: [{ wordLength: 4, lang: 'id' }, { wordLength: 5, lang: 'id' }] },
  { tier: 1, step: 4, from: 9, to: 10, title: 'Membaca Kata dan Kalimat', goal: 'Baca, lalu pilih gambar yang cocok', challenge: 'pickMatch',
    params: [{ pool: 'idObjects', options: 3, lang: 'id' }, { pool: 'idSentences', options: 3, lang: 'id' }] },
  { tier: 2, step: 5, from: 11, to: 13, title: 'Kata Berimbuhan', goal: 'Kenali awalan dan akhiran', challenge: 'comingSoon' },
  { tier: 2, step: 6, from: 14, to: 16, title: 'Lawan dan Persamaan Kata', goal: 'Pasangkan kata yang berlawanan dan bermakna sama', challenge: 'comingSoon' },
  { tier: 2, step: 7, from: 17, to: 18, title: 'Menyusun Kalimat', goal: 'Susun kata acak menjadi kalimat', challenge: 'comingSoon' },
  { tier: 2, step: 8, from: 19, to: 20, title: 'Tanda Baca dan Huruf Kapital', goal: 'Lengkapi kalimat dengan tanda baca yang tepat', challenge: 'comingSoon' },
  { tier: 3, step: 9, from: 21, to: 23, title: 'Kalimat Efektif', goal: 'Pilih kalimat yang tepat', challenge: 'comingSoon' },
  { tier: 3, step: 10, from: 24, to: 26, title: 'Ide Pokok dan Bacaan', goal: 'Temukan ide pokok paragraf', challenge: 'comingSoon' },
  { tier: 3, step: 11, from: 27, to: 30, title: 'Puisi, Pantun, dan Cerita', goal: 'Pahami puisi, pantun, dan cerita', challenge: 'comingSoon' },
];

function build(subject: Subject, defs: StepDef[]): LevelConfig[] {
  const levels: LevelConfig[] = [];
  for (const d of defs) {
    for (let id = d.from; id <= d.to; id++) {
      levels.push({
        id,
        subject,
        tier: d.tier,
        step: d.step,
        title: d.title,
        goal: d.goal,
        challenge: d.challenge,
        questions: d.questions ?? 5,
        params: d.params?.[id - d.from] ?? {},
      });
    }
  }
  return levels;
}

export const LEVELS: Record<Subject, LevelConfig[]> = {
  math: build('math', MATH),
  english: build('english', ENGLISH),
  indonesia: build('indonesia', INDONESIA),
};

export const SUBJECT_LABEL: Record<Subject, string> = { math: 'Matematika', english: 'Bahasa Inggris', indonesia: 'Bahasa Indonesia' };

export const getLevel = (subject: Subject, id: number) => LEVELS[subject].find((l) => l.id === id);
