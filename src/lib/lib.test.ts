import { describe, expect, it } from 'vitest';
import { seeded } from './random';
import { makeCountQuestions, makePickQuestions, makeSpellQuestions, makeSumQuestions, scramble } from './questions';
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

describe('soal mengenal angka', () => {
  it('target dalam batas, 3 pilihan berbeda memuat target, tak berulang beruntun', () => {
    for (let seed = 1; seed <= 50; seed++) {
      const qs = makeCountQuestions(seeded(seed), 5, 20);
      qs.forEach((q, i) => {
        expect(q.target).toBeGreaterThanOrEqual(1);
        expect(q.target).toBeLessThanOrEqual(20);
        expect(q.options).toHaveLength(3);
        expect(new Set(q.options).size).toBe(3);
        expect(q.options).toContain(q.target);
        if (i) expect(q.target).not.toBe(qs[i - 1].target);
      });
    }
  });
});

describe('soal pilih-yang-cocok (Inggris L1-8)', () => {
  const pools = ['letters', 'animals', 'colors', 'animalsColors', 'numbers', 'numbersFruits'] as const;
  it('tiap pool: jumlah pilihan benar, unik, memuat jawaban, tak berulang beruntun', () => {
    for (const pool of pools) {
      for (let seed = 1; seed <= 30; seed++) {
        const qs = makePickQuestions(seeded(seed), 5, pool, 4, 14);
        qs.forEach((q, i) => {
          expect(q.options).toHaveLength(4);
          expect(new Set(q.options.map((o) => o.id)).size).toBe(4);
          expect(q.options.map((o) => o.id)).toContain(q.answerId);
          if (i) expect(q.answerId).not.toBe(qs[i - 1].answerId);
        });
      }
    }
  });
  it('huruf dibatasi letterCount', () => {
    for (let seed = 1; seed <= 30; seed++) {
      makePickQuestions(seeded(seed), 5, 'letters', 3, 6).forEach((q) => q.options.forEach((o) => expect('ABCDEF').toContain(o.id)));
    }
  });
  it('angka dan buah tidak dicampur dalam satu soal', () => {
    for (let seed = 1; seed <= 50; seed++) {
      makePickQuestions(seeded(seed), 5, 'numbersFruits', 4).forEach((q) => {
        const isNum = (id: string) => /^n\d+$/.test(id);
        const kinds = new Set(q.options.map((o) => isNum(o.id)));
        expect(kinds.size).toBe(1);
      });
    }
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
  it('matematika mulai dari level 1; level 4 baru terbuka setelah level 3 selesai', () => {
    expect(isUnlocked(profile(), 'math', 1)).toBe(true);
    expect(isUnlocked(profile(), 'math', 2)).toBe(false);
    expect(isUnlocked(profile(), 'math', 4)).toBe(false);
    expect(isUnlocked(recordResult(profile(), 'math', 3, 1, 100), 'math', 4)).toBe(true);
  });
  it('inggris mulai dari level 1; level 9 baru terbuka setelah level 8 selesai', () => {
    expect(isUnlocked(profile(), 'english', 1)).toBe(true);
    expect(isUnlocked(profile(), 'english', 9)).toBe(false);
    expect(isUnlocked(recordResult(profile(), 'english', 8, 1, 100), 'english', 9)).toBe(true);
  });
  it('menyelesaikan level membuka level berikutnya; hasil terbaik tak turun', () => {
    let p = recordResult(profile(), 'math', 4, 3, 500);
    expect(isUnlocked(p, 'math', 5)).toBe(true);
    p = recordResult(p, 'math', 4, 1, 100);
    expect(p.progress['math:4']).toMatchObject({ stars: 3, bestScore: 500 });
  });
});
