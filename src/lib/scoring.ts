import type { RunStats } from './types';

/**
 * Bintang berdasarkan kesalahan (bukan waktu):
 * 3 bintang bila salah <= 1, 2 bintang bila <= 3, selebihnya 1 bintang (selesai).
 */
export function starsFor(mistakes: number): 1 | 2 | 3 {
  if (mistakes <= 1) return 3;
  if (mistakes <= 3) return 2;
  return 1;
}

/** Skor = akurasi x 100 per soal + bonus combo. Tanpa tekanan waktu (Tingkat 1-2). */
export function scoreFor(stats: RunStats): number {
  if (stats.total === 0) return 0;
  const accuracy = stats.correct / (stats.correct + stats.mistakes);
  return Math.round(accuracy * stats.total * 100) + stats.bestCombo * 10;
}

export function comboLabel(combo: number): string | null {
  if (combo >= 5) return 'Hebat Sekali!';
  if (combo >= 3) return 'Super!';
  if (combo === 2) return '2x Combo!';
  return null;
}
