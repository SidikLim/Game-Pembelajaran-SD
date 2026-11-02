import type { LevelConfig } from '../lib/types';

export interface ChallengeProps {
  level: LevelConfig;
  /** Nomor soal (0-based). Komponen di-remount tiap soal lewat `key`. */
  index: number;
  /** Seed per permainan: "Ulangi" memakai seed baru => soal berbeda. */
  seed: number;
  /** Dipanggil tiap kali anak memeriksa jawaban. Benar => game lanjut ke soal berikut. */
  onAnswer: (correct: boolean) => void;
}
