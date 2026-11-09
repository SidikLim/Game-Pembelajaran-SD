import { describe, expect, it } from 'vitest';
import { seeded } from './random';
import { FILL_BANK, STORY_BANK } from '../data/english3';
import { ID_FILL_BANK, ID_SENTENCE_GROUPS, type IdFillBank } from '../data/indonesia2';
import { ID_LETTER_NAME, ID_LETTER_WORDS, ID_OBJECTS, ID_SENTENCES, ID_SYLLABLES, ID_WORDS } from '../data/indonesia';
import { LEVELS } from '../data/levels';
import { makeIdFillQuestions, makeSentenceQuestions, makeIdSpellQuestions, makeSyllableQuestions, fmtDec, makeArithQuestions, makeFillQuestions, makePrepQuestions, makeStoryQuestions, type ArithKind, fmtTime, makeClockQuestions, makeFractionQuestions, makeMulQuestions, makeShareQuestions, makeVerbQuestions, makeCountQuestions, makePickQuestions, makeShapePuzzles, makeSubQuestions, makeSpellQuestions, makeSumQuestions, scramble } from './questions';
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

describe('soal pengurangan balon', () => {
  it('a - b selalu valid, hasil >= 1, pilihan unik memuat jawaban', () => {
    for (let seed = 1; seed <= 50; seed++) {
      makeSubQuestions(seeded(seed), 5, 10).forEach((q) => {
        expect(q.a).toBeLessThanOrEqual(10);
        expect(q.b).toBeGreaterThanOrEqual(1);
        expect(q.answer).toBe(q.a - q.b);
        expect(q.answer).toBeGreaterThanOrEqual(1);
        expect(new Set(q.options).size).toBe(3);
        expect(q.options).toContain(q.answer);
      });
    }
  });
});

describe('puzzle bentuk', () => {
  it('tiap bentuk muncul tepat perShape kali dengan id unik', () => {
    for (const per of [1, 2]) {
      makeShapePuzzles(seeded(7), 3, per).forEach((pieces) => {
        expect(pieces).toHaveLength(3 * per);
        expect(new Set(pieces.map((p) => p.id)).size).toBe(3 * per);
        for (const shape of ['circle', 'square', 'triangle']) expect(pieces.filter((p) => p.shape === shape)).toHaveLength(per);
      });
    }
  });
});

describe('Tingkat 2 Matematika', () => {
  it('perkalian: jawaban = a*b, faktor dalam batas, 3 pilihan unik memuat jawaban', () => {
    for (let seed = 1; seed <= 50; seed++) {
      makeMulQuestions(seeded(seed), 5, 5).forEach((q) => {
        expect(q.answer).toBe(q.a * q.b);
        expect(Math.max(q.a, q.b)).toBeLessThanOrEqual(5);
        expect(q.answer).toBeGreaterThanOrEqual(2);
        expect(new Set(q.options).size).toBe(3);
        expect(q.options).toContain(q.answer);
        q.options.forEach((o) => expect(o).toBeGreaterThanOrEqual(1));
      });
    }
  });
  it('berbagi rata: total = piring x isi dan <= 20', () => {
    for (let seed = 1; seed <= 50; seed++) {
      makeShareQuestions(seeded(seed), 5, 4, 5).forEach((q) => {
        expect(q.total).toBe(q.plates * q.each);
        expect(q.total).toBeLessThanOrEqual(20);
        expect(q.plates).toBeGreaterThanOrEqual(2);
      });
    }
  });
  it('jam: format HH:MM, jam pas bila halfHours=false, pilihan unik memuat jawaban', () => {
    for (let seed = 1; seed <= 50; seed++) {
      makeClockQuestions(seeded(seed), 5, false).forEach((q) => {
        expect(q.m).toBe(0);
        expect(q.answer).toBe(fmtTime(q.h, 0));
        expect(new Set(q.options).size).toBe(3);
        expect(q.options).toContain(q.answer);
      });
      makeClockQuestions(seeded(seed), 5, true).forEach((q) => {
        expect([0, 30]).toContain(q.m);
        expect(new Set(q.options).size).toBe(3);
        expect(q.options).toContain(q.answer);
      });
    }
  });
  it('pecahan: jumlah potong berwarna sesuai jawaban; level 1 hanya 1/2 dan 1/4', () => {
    for (let seed = 1; seed <= 60; seed++) {
      makeFractionQuestions(seeded(seed), 5, 1).forEach((q) => {
        expect(['1/2', '1/4']).toContain(q.answerId);
        expect(q.options).toHaveLength(2);
      });
      makeFractionQuestions(seeded(seed), 5, 2).forEach((q) => {
        const k = q.colored.filter(Boolean).length;
        const [n, d] = q.answerId.split('/').map(Number);
        expect(k / q.slices).toBeCloseTo(n / d);
        expect(q.options).toHaveLength(3);
        expect(q.options.map((o) => o.id)).toContain(q.answerId);
      });
    }
  });
});

describe('Tingkat 2 Inggris', () => {
  it('kata kerja: pilihan unik memuat jawaban, tak berulang beruntun', () => {
    for (let seed = 1; seed <= 50; seed++) {
      const qs = makeVerbQuestions(seeded(seed), 5, 4);
      qs.forEach((q, i) => {
        expect(new Set(q.options).size).toBe(4);
        expect(q.options).toContain(q.verb);
        if (i) expect(q.verb).not.toBe(qs[i - 1].verb);
      });
    }
  });
  it('pool baru (keluarga, tubuh, kalimat) menghasilkan soal valid', () => {
    for (const pool of ['family', 'body', 'familyBody', 'sentences'] as const) {
      for (let seed = 1; seed <= 30; seed++) {
        makePickQuestions(seeded(seed), 5, pool, 4).forEach((q) => {
          expect(new Set(q.options.map((o) => o.id)).size).toBe(4);
          expect(q.options.map((o) => o.id)).toContain(q.answerId);
          if (pool === 'sentences') expect(q.promptText).toBeUndefined();
        });
      }
    }
  });
  it('spelling bee 5, 6, 7 huruf punya cukup kata untuk 5 soal', () => {
    for (const len of [5, 6, 7]) {
      const qs = makeSpellQuestions(seeded(1), 5, len);
      expect(qs).toHaveLength(5);
      qs.forEach((q) => expect(q.entry.word).toHaveLength(len));
    }
  });
});

describe('Tingkat 3 Matematika', () => {
  const kinds: ArithKind[] = ['mul', 'div', 'mulDiv', 'discountAmount', 'discountPrice', 'decimal', 'storyBasic', 'storyMulDiv', 'storyTwoStep', 'storyMix'];
  const digits = (t: string) => Number(t.replace(/\./g, '').replace(/[^0-9]/g, ''));
  it('semua jenis: pilihan unik, memuat jawaban, id unik, hint tidak kosong', () => {
    for (const kind of kinds) {
      for (let seed = 1; seed <= 40; seed++) {
        const qs = makeArithQuestions(seeded(seed), 5, kind, 4);
        expect(qs).toHaveLength(5);
        qs.forEach((q, i) => {
          expect(new Set(q.options.map((o) => o.id)).size).toBe(4);
          expect(new Set(q.options.map((o) => o.text)).size).toBe(4);
          expect(q.options.map((o) => o.id)).toContain(q.answerId);
          q.options.forEach((o) => expect(Number(o.id)).toBeGreaterThanOrEqual(1));
          expect(q.hint.length).toBeGreaterThan(5);
          if (i) expect(q.text).not.toBe(qs[i - 1].text);
        });
      }
    }
  });
  it('kali dan bagi: jawaban benar', () => {
    for (let seed = 1; seed <= 60; seed++) {
      makeArithQuestions(seeded(seed), 5, 'mulDiv', 3).forEach((q) => {
        const m = q.text.match(/^(\d+) ([×÷]) (\d+) = \?$/)!;
        const a = Number(m[1]), b = Number(m[3]);
        expect(Number(q.answerId)).toBe(m[2] === '×' ? a * b : a / b);
        if (m[2] === '÷') expect(Number.isInteger(a / b)).toBe(true);
      });
    }
  });
  it('diskon: potongan dan harga akhir benar', () => {
    for (let seed = 1; seed <= 60; seed++) {
      makeArithQuestions(seeded(seed), 5, 'discountAmount', 3).forEach((q) => {
        const pct = Number(q.text.match(/(\d+)%/)![1]), price = digits(q.sub!);
        expect(Number(q.answerId)).toBe((price * pct) / 100);
      });
      makeArithQuestions(seeded(seed), 5, 'discountPrice', 3).forEach((q) => {
        const pct = Number(q.text.match(/(\d+)%/)![1]), price = digits(q.sub!);
        expect(Number(q.answerId)).toBe(price - (price * pct) / 100);
      });
    }
  });
  it('desimal: hasil benar dan tampil berkoma', () => {
    expect(fmtDec(125)).toBe('1,25');
    expect(fmtDec(150)).toBe('1,5');
    expect(fmtDec(200)).toBe('2');
    expect(fmtDec(75)).toBe('0,75');
    for (let seed = 1; seed <= 60; seed++) {
      makeArithQuestions(seeded(seed), 5, 'decimal', 3).forEach((q) => {
        const m = q.text.match(/^([\d,]+) ([+−]) ([\d,]+) = \?$/)!;
        const a = Math.round(parseFloat(m[1].replace(',', '.')) * 100), b = Math.round(parseFloat(m[3].replace(',', '.')) * 100);
        const exp = m[2] === '+' ? a + b : a - b;
        expect(exp).toBeGreaterThan(0);
        expect(q.options.find((o) => o.id === q.answerId)!.text).toBe(fmtDec(exp));
      });
    }
  });
  it('soal cerita dua langkah: sisa koin benar dan tidak negatif', () => {
    for (let seed = 1; seed <= 60; seed++) {
      makeArithQuestions(seeded(seed), 5, 'storyTwoStep', 4).forEach((q) => {
        const [a, n, p] = q.text.match(/\d+/g)!.map(Number);
        expect(a - n * p).toBeGreaterThan(0);
        expect(Number(q.answerId)).toBe(a - n * p);
      });
    }
  });
});

describe('Tingkat 3 Inggris', () => {
  it('bank soal rumpang dan cerita valid', () => {
    for (const tier of [1, 2, 3] as const) {
      expect(FILL_BANK[tier].length).toBeGreaterThanOrEqual(5);
      FILL_BANK[tier].forEach((f) => {
        expect(f.text.split('___')).toHaveLength(2);
        expect(f.wrongs).not.toContain(f.answer);
        expect(new Set([f.answer, ...f.wrongs]).size).toBe(3);
      });
    }
    for (const lv of [1, 2, 3, 4] as const) {
      expect(STORY_BANK[lv].length).toBeGreaterThanOrEqual(5);
      STORY_BANK[lv].forEach((st) => {
        expect(st.wrongs).not.toContain(st.answer);
        expect(new Set([st.answer, ...st.wrongs]).size).toBe(3);
        expect(st.question.endsWith('?')).toBe(true);
      });
    }
  });
  it('generator rumpang dan cerita: 5 soal unik, jawaban ada di pilihan', () => {
    for (let seed = 1; seed <= 30; seed++) {
      for (const tier of [1, 2, 3] as const) {
        const qs = makeFillQuestions(seeded(seed), 5, tier);
        expect(new Set(qs.map((q) => q.text)).size).toBe(5);
        qs.forEach((q) => expect(q.options).toContain(q.answer));
      }
      for (const lv of [1, 2, 3, 4] as const) {
        const qs = makeStoryQuestions(seeded(seed), 5, lv);
        expect(new Set(qs.map((q) => q.story)).size).toBe(5);
        qs.forEach((q) => expect(q.options).toContain(q.answer));
      }
    }
  });
  it('preposisi: pilihan unik, memuat jawaban, hanya dari daftar', () => {
    for (let seed = 1; seed <= 40; seed++) {
      makePrepQuestions(seeded(seed), 5, ['in', 'on', 'under'], 3).forEach((q) => {
        expect(new Set(q.options).size).toBe(3);
        expect(q.options).toContain(q.prep);
        q.options.forEach((o) => expect(['in', 'on', 'under']).toContain(o));
      });
      makePrepQuestions(seeded(seed), 5, ['in', 'on', 'under', 'behind'], 4).forEach((q) => expect(new Set(q.options).size).toBe(4));
    }
  });
});

describe('Bahasa Indonesia (Tingkat 1)', () => {
  it('data bank konsisten', () => {
    expect(Object.keys(ID_LETTER_NAME)).toHaveLength(26);
    expect(Object.keys(ID_LETTER_WORDS)).toHaveLength(26);
    for (const list of [ID_OBJECTS, ID_SENTENCES]) {
      expect(new Set(list.map((v) => v.id)).size).toBe(list.length);
      expect(new Set(list.map((v) => v.emoji)).size).toBe(list.length); // satu gambar unik per butir
    }
    for (const g of [1, 2, 3] as const) {
      expect(ID_SYLLABLES[g].length).toBeGreaterThanOrEqual(5);
      ID_SYLLABLES[g].forEach((w) => {
        expect(w.syllables.join('')).toBe(w.word);
        expect(w.syllables).toHaveLength(g === 3 ? 3 : 2);
      });
    }
    for (const n of [4, 5]) expect(ID_WORDS.filter((w) => w.word.length === n).length).toBeGreaterThanOrEqual(5);
  });
  it('soal huruf: hanya dari letterSet, pilihan unik, teks huruf kecil, ucapan memakai nama huruf', () => {
    for (let seed = 1; seed <= 40; seed++) {
      makePickQuestions(seeded(seed), 5, 'idLetters', 3, 26, 'aiueo').forEach((q) => {
        expect(new Set(q.options.map((o) => o.id)).size).toBe(3);
        expect(q.options.map((o) => o.id)).toContain(q.answerId);
        q.options.forEach((o) => { expect('AIUEO').toContain(o.id); expect(o.text).toBe(o.id.toLowerCase()); expect(o.speak).toBe(ID_LETTER_NAME[o.id.toLowerCase()]); });
      });
      makePickQuestions(seeded(seed), 5, 'idLetters', 4, 26, 'abcdefghijklmnopqrstuvwxyz').forEach((q) => expect(new Set(q.options.map((o) => o.id)).size).toBe(4));
    }
  });
  it('soal kata/kalimat: pilihan unik memuat jawaban; kalimat tidak dikapitalkan semua', () => {
    for (const pool of ['idObjects', 'idSentences'] as const) {
      for (let seed = 1; seed <= 30; seed++) {
        makePickQuestions(seeded(seed), 5, pool, 3).forEach((q) => {
          expect(new Set(q.options.map((o) => o.id)).size).toBe(3);
          expect(q.options.map((o) => o.id)).toContain(q.answerId);
          if (pool === 'idSentences') expect(q.promptText).not.toBe(q.promptText!.toUpperCase());
        });
      }
    }
  });
  it('susun suku kata dan huruf: urutan benar, kepingan = permutasi, tidak sama dengan urutan benar', () => {
    for (let seed = 1; seed <= 40; seed++) {
      for (const g of [1, 2, 3] as const) {
        const qs = makeSyllableQuestions(seeded(seed), 5, g);
        expect(new Set(qs.map((q) => q.entry.word)).size).toBe(5);
        qs.forEach((q) => {
          expect(q.tokens.join('')).toBe(q.entry.word);
          expect([...q.letters].sort()).toEqual([...q.tokens].sort());
          expect(q.letters.join('-')).not.toBe(q.tokens.join('-'));
        });
      }
      for (const n of [4, 5]) makeIdSpellQuestions(seeded(seed), 5, n).forEach((q) => {
        expect(q.entry.word).toHaveLength(n);
        expect(q.letters.join('')).not.toBe(q.entry.word);
        expect([...q.letters].sort().join('')).toBe([...q.tokens].sort().join(''));
      });
    }
  });
  it('30 level per mata pelajaran; Indonesia L1-10 bisa dimainkan, L11-30 "segera hadir"', () => {
    for (const subj of ['math', 'english', 'indonesia'] as const) {
      expect(LEVELS[subj].map((l) => l.id)).toEqual(Array.from({ length: 30 }, (_, i) => i + 1));
      LEVELS[subj].forEach((l) => expect(l.tier).toBe(l.id <= 10 ? 1 : l.id <= 20 ? 2 : 3));
    }
    expect(LEVELS.indonesia.filter((l) => l.challenge !== 'comingSoon').map((l) => l.id)).toEqual(Array.from({ length: 20 }, (_, i) => i + 1));
    expect(isUnlocked(profile(), 'indonesia', 1)).toBe(true);
    expect(isUnlocked(profile(), 'indonesia', 2)).toBe(false);
    expect(isUnlocked(recordResult(profile(), 'indonesia', 10, 1, 100), 'indonesia', 11)).toBe(true);
  });
});

describe('Bahasa Indonesia (Tingkat 2)', () => {
  const banks = Object.keys(ID_FILL_BANK) as IdFillBank[];
  it('bank rumpang valid: satu "___", jawaban tidak ada di pengecoh, 3 pilihan unik, petunjuk terisi', () => {
    for (const b of banks) {
      expect(ID_FILL_BANK[b].length).toBeGreaterThanOrEqual(8);
      ID_FILL_BANK[b].forEach((f) => {
        expect(f.text.split('___')).toHaveLength(2);
        expect(f.wrongs).not.toContain(f.answer);
        expect(new Set([f.answer, ...f.wrongs]).size).toBe(3);
        expect(f.hint.length).toBeGreaterThan(10);
      });
    }
  });
  it('generator rumpang: 5 soal unik, jawaban ada di pilihan, petunjuk dibawa', () => {
    for (let seed = 1; seed <= 30; seed++) for (const b of banks) {
      const qs = makeIdFillQuestions(seeded(seed), 5, b);
      expect(new Set(qs.map((q) => q.text)).size).toBe(5);
      qs.forEach((q) => { expect(q.options).toContain(q.answer); expect(q.hint).toBeTruthy(); });
    }
  });
  it('kalimat untuk disusun: kata pertama kapital, diakhiri titik, jumlah kata sesuai kelompok, hasil acak berbeda', () => {
    for (const g of [1, 2] as const) {
      ID_SENTENCE_GROUPS[g].forEach((s) => {
        const w = s.text.split(' ');
        expect(w[0][0]).toBe(w[0][0].toUpperCase());
        expect(s.text.endsWith('.')).toBe(true);
        if (g === 1) expect(w).toHaveLength(3); else expect(w.length).toBeGreaterThanOrEqual(4);
      });
      expect(new Set(ID_SENTENCE_GROUPS[g].map((s) => s.emoji)).size).toBe(ID_SENTENCE_GROUPS[g].length);
    }
    for (let seed = 1; seed <= 40; seed++) for (const g of [1, 2] as const) {
      const qs = makeSentenceQuestions(seeded(seed), 5, g);
      expect(new Set(qs.map((q) => q.entry.word)).size).toBe(5);
      qs.forEach((q) => {
        expect(q.tokens.join(' ')).toBe(q.entry.word);
        expect([...q.letters].sort()).toEqual([...q.tokens].sort());
        expect(q.letters.join(' ')).not.toBe(q.entry.word);
      });
    }
  });
  it('Tingkat 2 terbuka berurutan dan Level 21 masih "segera hadir"', () => {
    expect(isUnlocked(profile(), 'indonesia', 11)).toBe(false);
    expect(isUnlocked(recordResult(profile(), 'indonesia', 10, 1, 100), 'indonesia', 11)).toBe(true);
    expect(LEVELS.indonesia.find((l) => l.id === 21)!.challenge).toBe('comingSoon');
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
  it('Tingkat 2 terbuka berurutan: level 11 menunggu level 10', () => {
    expect(isUnlocked(profile(), 'math', 11)).toBe(false);
    expect(isUnlocked(recordResult(profile(), 'math', 10, 1, 100), 'math', 11)).toBe(true);
    expect(isUnlocked(recordResult(profile(), 'english', 10, 1, 100), 'english', 11)).toBe(true);
  });
  it('Tingkat 3 terbuka berurutan: level 21 menunggu level 20', () => {
    expect(isUnlocked(profile(), 'math', 21)).toBe(false);
    expect(isUnlocked(recordResult(profile(), 'math', 20, 1, 100), 'math', 21)).toBe(true);
    expect(isUnlocked(recordResult(profile(), 'english', 20, 1, 100), 'english', 21)).toBe(true);
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
