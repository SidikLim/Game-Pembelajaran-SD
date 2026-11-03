/**
 * Membuat daftar semua ucapan yang perlu direkam: docs/daftar-ucapan.csv
 * (untuk perekam suara manusia: teks yang dibaca, nama file tujuan, dan kategori).
 *
 *   npx tsx scripts/list-phrases.ts
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { collectPhrases } from '../src/lib/phrases';
import { speechSlug } from '../src/lib/speechKey';

const LETTER_NAME: Record<string, string> = {
  a: 'ay', b: 'bee', c: 'see', d: 'dee', e: 'ee', f: 'eff', g: 'jee', h: 'aitch', i: 'eye', j: 'jay', k: 'kay', l: 'ell', m: 'em',
  n: 'en', o: 'oh', p: 'pee', q: 'cue', r: 'are', s: 'ess', t: 'tee', u: 'you', v: 'vee', w: 'double you', x: 'ex', y: 'why', z: 'zee',
};
const category = (k: string) =>
  k.length === 1 ? 'huruf (nama huruf)' : /^[a-z]\. /.test(k) ? 'huruf + kata contoh' : k.split(' ').length === 1 ? 'kata' : k.length > 60 ? 'cerita' : 'kalimat';
const reading = (k: string) => {
  if (LETTER_NAME[k]) return `${k.toUpperCase()} (dibaca "${LETTER_NAME[k]}")`;
  const m = k.match(/^([a-z])\. (.+)$/);
  return m ? `${m[1].toUpperCase()} (dibaca "${LETTER_NAME[m[1]]}"), lalu ${m[2]}` : k;
};

const used = new Set<string>();
const rows = collectPhrases().map((key) => {
  let file = `${speechSlug(key)}.mp3`;
  for (let n = 2; used.has(file); n++) file = `${speechSlug(key)}-${n}.mp3`;
  used.add(file);
  return [category(key), reading(key), file, key];
});
const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;
const csv = ['kategori,teks yang dibaca,nama file (public/audio),kunci manifest', ...rows.map((r) => r.map(esc).join(','))].join('\n') + '\n';
mkdirSync('docs', { recursive: true });
writeFileSync('docs/daftar-ucapan.csv', csv);
console.log(`${rows.length} ucapan → docs/daftar-ucapan.csv`);
