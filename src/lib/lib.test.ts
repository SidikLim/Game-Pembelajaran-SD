import { describe, expect, it } from 'vitest';
import { seeded } from './random';
import { makeSpellQuestions, makeSumQuestions, scramble } from './questions';
import { scoreFor, starsFor } from './scoring';
import { isUnlocked, recordResult } from './progress';
import type { Profile } from './types';

const profile = (): Profile => ({ id: 'p', name: 'Budi', hat: 'teal', progress: {} });

describe('soal penjumlahan', () => {
  it('jumlah selalu dalam batas dan jawaban benar', () => {
    for (let seed = 1; seed <= 50; seed++) {
      const qs = makeSumQuestions(seeded(seed), 5, 8);
      expect(qs).toHaveLength(5);
      for (const q of qs) {
        expect(q.a).toBeGreaterThanOrEqual(1);
        expect(q.b).toBeGreaterThanOrEqual(1);
        expect(q.answer).toBe(q.a + q.b);
        expect(q.answer).toBeLessThanOrEqual(8);
      }
    }
  });
  it('seed berbeda menghasilkan soal berbeda ("Ulangi" tidak identik)', () => {
    const a = JSON.stringify(makeSumQuestions(seeded(1), 5, 10));
    const b = JSON.stringify(makeSumQuestions(seeded(2), 5, 10));
    expect(a).not.toBe(b);
  });
});

describe('spelling bee', () => {
  it('huruf diacak berbeda dari kata asli', () => {
    for (let seed = 1; seed <= 50; seed++) {
      expect(scramble(seeded(seed), 'CAT').join('')).not.toBe('CAT');
    }
  });
  it('panjang kata sesuai level & tanpa duplikat', () => {
    const qs = makeSpellQuestions(seeded(3), 5, 4);
    expect(qs).toHaveLength(5);
    expect(new Set(qs.map((q) => q.entry.word)).size).toBe(5);
    qs.forEach((q) => expect(q.entry.word).toHaveLength(4));
  });
});

describe('skor & bintang', () => {
  it('bintang berdasar kesalahan', () => {
    expect(starsFor(0)).toBe(3);
    expect(starsFor(1)).toBe(3);
    expect(starsFor(3)).toBe(2);
    expect(starsFor(4)).toBe(1);
  });
  it('skor memakai akurasi dan combo, tanpa waktu', () => {
    expect(scoreFor({ total: 5, correct: 5, mistakes: 0, bestCombo: 5 })).toBe(550);
    expect(scoreFor({ total: 5, correct: 5, mistakes: 5, bestCombo: 1 })).toBe(260);
  });
});

describe('progres', () => {
  it('level 4 matematika terbuka karena level 1-3 belum tersedia', () => {
    expect(isUnlocked(profile(), 'math', 4)).toBe(true);
    expect(isUnlocked(profile(), 'math', 5)).toBe(false);
  });
  it('menyelesaikan level membuka level berikutnya; hasil terbaik tak turun', () => {
    let p = recordResult(profile(), 'math', 4, 3, 500);
    expect(isUnlocked(p, 'math', 5)).toBe(true);
    p = recordResult(p, 'math', 4, 1, 100);
    expect(p.progress['math:4']).toMatchObject({ stars: 3, bestScore: 500 });
  });
});
