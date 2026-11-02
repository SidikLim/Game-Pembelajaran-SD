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
}

const MATH: StepDef[] = [
  { tier: 1, step: 1, from: 1, to: 3, title: 'Mengenal Angka 1–20', goal: 'Pilih kelompok apel dengan jumlah yang tepat', challenge: 'countPick', params: [{ maxCount: 5 }, { maxCount: 10 }, { maxCount: 20 }] },
  { tier: 1, step: 2, from: 4, to: 6, title: 'Menjumlah di Keranjang', goal: 'Seret buah ke keranjang sesuai hasil penjumlahan', challenge: 'dragSum', params: [{ maxSum: 5 }, { maxSum: 8 }, { maxSum: 10 }] },
  { tier: 1, step: 3, from: 7, to: 8, title: 'Mengurang dengan Balon', goal: 'Pecahkan balon untuk mengurangi', challenge: 'comingSoon' },
  { tier: 1, step: 4, from: 9, to: 10, title: 'Puzzle Bentuk', goal: 'Pasangkan lingkaran, persegi, segitiga', challenge: 'comingSoon' },
  { tier: 2, step: 5, from: 11, to: 13, title: 'Perkalian Dasar', goal: 'Hitung kelompok gambar berulang', challenge: 'comingSoon' },
  { tier: 2, step: 6, from: 14, to: 16, title: 'Berbagi Rata', goal: 'Bagi rata ke beberapa piring', challenge: 'comingSoon' },
  { tier: 2, step: 7, from: 17, to: 18, title: 'Membaca Jam', goal: 'Hubungkan jarum jam dengan angka waktu', challenge: 'comingSoon' },
  { tier: 2, step: 8, from: 19, to: 20, title: 'Pecahan Dasar', goal: 'Potong pizza menjadi ½, ¼, ¾', challenge: 'comingSoon' },
  { tier: 3, step: 9, from: 21, to: 23, title: 'Kali & Bagi Lanjut', goal: 'Perkalian dan pembagian 1–10', challenge: 'comingSoon' },
  { tier: 3, step: 10, from: 24, to: 26, title: 'Desimal & Persen', goal: 'Hitung diskon di toko mainan', challenge: 'comingSoon' },
  { tier: 3, step: 11, from: 27, to: 30, title: 'Soal Cerita Petualangan', goal: 'Pilih jawaban dari cerita petualangan', challenge: 'comingSoon' },
];

const ENGLISH: StepDef[] = [
  { tier: 1, step: 1, from: 1, to: 3, title: 'Phonics & Alphabet', goal: 'Dengar bunyi, cocokkan huruf', challenge: 'comingSoon' },
  { tier: 1, step: 2, from: 4, to: 6, title: 'Animals & Colors', goal: 'Sentuh gambar, dengar katanya', challenge: 'comingSoon' },
  { tier: 1, step: 3, from: 7, to: 8, title: 'Numbers & Fruits', goal: 'Cocokkan teks dengan gambar', challenge: 'comingSoon' },
  { tier: 1, step: 4, from: 9, to: 10, title: 'Spelling Bee', goal: 'Susun huruf acak menjadi kata', challenge: 'spellingBee', params: [{ wordLength: 3 }, { wordLength: 4 }] },
  { tier: 2, step: 5, from: 11, to: 13, title: 'Family & Body Parts', goal: 'Kenali anggota keluarga dan tubuh', challenge: 'comingSoon' },
  { tier: 2, step: 6, from: 14, to: 16, title: 'Spelling Bee 5–7 Huruf', goal: 'Susun kata yang lebih panjang', challenge: 'comingSoon' },
  { tier: 2, step: 7, from: 17, to: 18, title: 'Action Verbs', goal: 'Lihat karakter bergerak sesuai kata', challenge: 'comingSoon' },
  { tier: 2, step: 8, from: 19, to: 20, title: 'Listening', goal: 'Dengar kalimat, pilih gambar', challenge: 'comingSoon' },
  { tier: 3, step: 9, from: 21, to: 23, title: 'Fill in the Blanks', goal: 'Lengkapi kalimat rumpang', challenge: 'comingSoon' },
  { tier: 3, step: 10, from: 24, to: 26, title: 'Prepositions', goal: 'In, On, Under, Behind', challenge: 'comingSoon' },
  { tier: 3, step: 11, from: 27, to: 30, title: 'Short Stories', goal: 'Baca cerita bergambar, jawab pertanyaan', challenge: 'comingSoon' },
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
        questions: 5,
        params: d.params?.[id - d.from] ?? {},
      });
    }
  }
  return levels;
}

export const LEVELS: Record<Subject, LevelConfig[]> = {
  math: build('math', MATH),
  english: build('english', ENGLISH),
};

export const SUBJECT_LABEL: Record<Subject, string> = { math: 'Matematika', english: 'Bahasa Inggris' };

export const getLevel = (subject: Subject, id: number) => LEVELS[subject].find((l) => l.id === id);
