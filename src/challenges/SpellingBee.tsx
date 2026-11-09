import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { idSpeakToken } from '../data/indonesia';
import { makeIdSpellQuestions, makeSentenceQuestions, makeSpellQuestions, makeSyllableQuestions } from '../lib/questions';
import { seeded } from '../lib/random';
import { sfx, speak } from '../lib/audio';
import type { ChallengeProps } from './types';

/**
 * Susun huruf (atau suku kata) acak menjadi kata. Ketuk kepingan untuk mendengarnya.
 * Bahasa Inggris: huruf kapital. Bahasa Indonesia (params.lang = 'id'): huruf kecil; params.syllableGroup = susun suku kata;
 * params.sentenceGroup = susun kata menjadi kalimat.
 */
export function SpellingBee({ level, index, seed, onAnswer }: ChallengeProps) {
  const lang = level.params.lang ?? 'en';
  const q = useMemo(() => {
    const rng = seeded(seed);
    const { syllableGroup, sentenceGroup, wordLength = 3 } = level.params;
    const list = sentenceGroup ? makeSentenceQuestions(rng, level.questions, sentenceGroup) : syllableGroup ? makeSyllableQuestions(rng, level.questions, syllableGroup)
      : lang === 'id' ? makeIdSpellQuestions(rng, level.questions, wordLength) : makeSpellQuestions(rng, level.questions, wordLength);
    return list[index];
  }, [level, index, seed, lang]);
  const tokens = q.tokens; // urutan benar: huruf atau suku kata
  const word = q.entry.word;
  const sentence = !!level.params.sentenceGroup; // kepingan = kata
  const wide = tokens.some((t) => t.length > 1); // suku kata / kata: kepingan lebih lebar
  const [slots, setSlots] = useState<(number | null)[]>(() => Array(tokens.length).fill(null)); // indeks tile
  const [wrongs, setWrongs] = useState(0);
  const [locked, setLocked] = useState(false);
  const [shake, setShake] = useState(0);
  const [wave, setWave] = useState(0);

  const hintOn = wrongs >= 2; // petunjuk: kepingan pertama diberikan
  const firstTile = q.letters.findIndex((c) => c === tokens[0]);
  const used = new Set(slots.filter((s): s is number => s !== null));

  const say = (text: string) => { setWave((w) => w + 1); if (!speak(text, lang)) sfx.tap(); };

  const place = (tile: number) => {
    if (locked || used.has(tile)) return;
    const at = slots.findIndex((s, i) => s === null && !(hintOn && i === 0));
    if (at === -1) return;
    const next = [...slots];
    next[at] = tile;
    setSlots(next);
    say(lang === 'id' ? idSpeakToken(q.letters[tile]) : q.letters[tile]);
    if (next.every((s, i) => s !== null || (hintOn && i === 0))) evaluate(next);
  };
  const remove = (slot: number) => {
    if (locked || slots[slot] === null) return;
    setSlots((s) => s.map((v, i) => (i === slot ? null : v)));
    sfx.pop();
  };
  const evaluate = (filled: (number | null)[]) => {
    const guess = filled.map((t, i) => (hintOn && i === 0 ? tokens[0] : t === null ? '' : q.letters[t])).join('');
    const ok = guess === tokens.join('');
    if (ok) setLocked(true);
    else {
      setWrongs((w) => w + 1);
      setShake((s) => s + 1);
      setTimeout(() => setSlots(Array(tokens.length).fill(null)), 500);
    }
    onAnswer(ok);
  };

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="card flex flex-col items-center gap-1 !py-2">
        <div className={`${sentence ? 'text-6xl' : 'text-7xl'} leading-tight`} role="img" aria-label="Gambar kata">{q.entry.emoji}</div>
        <button className="btn btn-secondary relative" onClick={() => say(word)}>
          <span aria-hidden>🔊</span> Dengar
          {wave > 0 && [0, 1].map((r) => (
            <motion.span key={`${wave}-${r}`} className="pointer-events-none absolute inset-0 rounded-2xl border-4 border-sea-400"
              initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 1.6 + r * 0.3, opacity: 0 }} transition={{ duration: 0.8, delay: r * 0.15 }} />
          ))}
        </button>
      </div>
      <motion.div key={shake} className={`flex flex-wrap justify-center ${tokens.length >= 6 || sentence ? 'gap-1' : 'gap-2'}`} animate={shake ? { x: [0, -10, 10, -6, 6, 0] } : {}} transition={{ duration: 0.4 }}>
        {slots.map((tile, i) => {
          const hinted = hintOn && i === 0;
          return (
            <button key={i} onClick={() => remove(i)} aria-label={`Kotak huruf ${i + 1}`}
              className={`grid ${sentence ? 'h-12 min-w-[4rem] px-2 text-xl' : wide ? 'h-14 min-w-[3.5rem] px-1 text-2xl' : tokens.length >= 6 ? 'h-12 w-10 text-2xl' : 'h-14 w-12 text-3xl'} place-items-center rounded-2xl border-4 font-extrabold ${hinted ? 'border-sand-400 bg-sand-200' : 'border-sea-400 bg-white'}`}>
              {hinted ? tokens[0] : tile !== null ? q.letters[tile] : ''}
            </button>
          );
        })}
      </motion.div>
      {hintOn && <p className="rounded-2xl bg-sand-200 px-3 py-1 text-base font-bold">Petunjuk: {sentence ? 'kata' : wide ? 'suku kata' : 'huruf'} pertamanya {tokens[0]} 😉</p>}
      <div className="flex flex-wrap justify-center gap-3">
        {q.letters.map((c, i) => (
          <motion.button key={i} whileTap={{ scale: 0.9 }} whileHover={{ y: -3 }} onClick={() => place(i)} disabled={used.has(i) || (hintOn && i === firstTile)}
            className={`grid ${sentence ? 'h-12 min-w-[3.5rem] px-3 text-xl' : `h-14 ${wide ? 'min-w-[3.5rem] px-2' : 'w-14'} text-3xl`} place-items-center rounded-2xl bg-coral-600 font-extrabold text-white shadow-chunky ${used.has(i) || (hintOn && i === firstTile) ? 'opacity-20' : ''}`}>
            {c}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
