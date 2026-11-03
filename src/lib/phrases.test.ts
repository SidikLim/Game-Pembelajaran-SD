import { describe, expect, it } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { LEVELS } from '../data/levels';
import { collectPhrases } from './phrases';
import { makePickQuestions, makePrepQuestions, makeSpellQuestions, makeStoryQuestions, makeFillQuestions, makeVerbQuestions } from './questions';
import { seeded } from './random';
import { speechKey, speechSlug } from './speechKey';

const known = new Set(collectPhrases());

describe('daftar ucapan (phrases)', () => {
  it('kunci seragam dan nama file aman', () => {
    expect(speechKey('  The CAT  is   on the box. ')).toBe('the cat is on the box.');
    expect(speechSlug('a. apple')).toBe('a-apple');
    expect(speechSlug('the cat is on the box.')).toBe('the-cat-is-on-the-box');
    const long = 'ana and her father go to the market. they buy fish, rice, and vegetables. ana carries the vegetables.';
    expect(speechSlug(long).length).toBeLessThanOrEqual(60);
    expect(speechSlug(long)).toBe(speechSlug(long)); // stabil
    expect(speechSlug(long + ' x')).not.toBe(speechSlug(long)); // beda teks, beda nama
  });

  it('nama file unik untuk semua ucapan', () => {
    const slugs = collectPhrases().map(speechSlug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('semua ucapan dari pembangkit soal tercakup di collectPhrases', () => {
    const missing = new Set<string>();
    const check = (t: string) => { if (!known.has(speechKey(t))) missing.add(t); };
    for (const lv of [...LEVELS.english]) {
      const p = lv.params;
      for (let seed = 1; seed <= 25; seed++) {
        if (lv.challenge === 'pickMatch') {
          makePickQuestions(seeded(seed), lv.questions, p.pool!, p.options ?? 3, p.letterCount).forEach((q) => { check(q.speak); q.options.forEach((o) => check(o.speak)); });
        } else if (lv.challenge === 'spellingBee') {
          makeSpellQuestions(seeded(seed), lv.questions, p.wordLength!).forEach((q) => { check(q.entry.word); q.letters.forEach(check); });
        } else if (lv.challenge === 'actionVerb') {
          makeVerbQuestions(seeded(seed), lv.questions, p.options ?? 3).forEach((q) => { check(q.verb); q.options.forEach(check); });
        } else if (lv.challenge === 'fillBlank') {
          makeFillQuestions(seeded(seed), lv.questions, p.fillTier!).forEach((q) => check(q.text.replace('___', q.answer)));
        } else if (lv.challenge === 'story') {
          makeStoryQuestions(seeded(seed), lv.questions, p.storyLevel!).forEach((q) => check(q.story));
        } else if (lv.challenge === 'preposition') {
          makePrepQuestions(seeded(seed), lv.questions, p.preps!, p.options ?? 3).forEach((q) => check(`The ${q.obj.name} is ${q.prep} ${q.prep === 'under' ? 'the table' : 'the box'}.`));
        }
      }
    }
    expect([...missing]).toEqual([]);
  });

  it('bila folder public/audio berisi manifest, semua ucapan punya file', () => {
    const dir = new URL('../../public/audio/', import.meta.url);
    const manifestPath = new URL('manifest.json', dir);
    if (!existsSync(manifestPath)) return; // audio belum dibuat: game memakai Web Speech API
    const manifest = JSON.parse(readFileSync(manifestPath, 'utf8')) as Record<string, string>;
    const files = new Set(readdirSync(dir));
    expect([...known].filter((k) => !manifest[k])).toEqual([]);
    expect(Object.values(manifest).filter((f) => !files.has(f))).toEqual([]);
  });
});
