import { ANIMALS, BODY, COLORS, FAMILY, FRUITS, LETTERS, LETTER_WORDS, NUMBERS, SENTENCES } from '../data/vocab';
import { FILL_BANK, STORY_BANK } from '../data/english3';
import { PREP_OBJECTS, VERBS, WORDS } from './questions';
import { speechKey } from './speechKey';

/**
 * Daftar SEMUA ucapan yang bisa diminta game lewat speak(). Dipakai untuk membuat/memeriksa
 * file audio (docs/PANDUAN-SUARA.md). Bila menambah soal yang diucapkan, tambahkan di sini;
 * tes `phrases.test.ts` menjaga agar tidak ada ucapan yang terlewat.
 */
export function collectPhrases(): string[] {
  const out = new Set<string>();
  const add = (t: string) => out.add(speechKey(t));

  for (const l of LETTERS) { add(l); add(`${l}. ${LETTER_WORDS[l].word}`); }
  for (const list of [ANIMALS, COLORS, NUMBERS, FRUITS, FAMILY, BODY, SENTENCES]) for (const v of list) add(v.word);
  for (const w of WORDS) add(w.word);
  for (const v of VERBS) add(v);
  for (const tier of [1, 2, 3] as const) for (const f of FILL_BANK[tier]) add(f.text.replace('___', f.answer));
  for (const lv of [1, 2, 3, 4] as const) for (const s of STORY_BANK[lv]) add(s.story);
  for (const o of PREP_OBJECTS) for (const p of ['in', 'on', 'behind'] as const) add(`The ${o.name} is ${p} the box.`);
  for (const o of PREP_OBJECTS) add(`The ${o.name} is under the table.`);

  return [...out].sort();
}
