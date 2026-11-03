import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { makeSpellQuestions } from '../lib/questions';
import { seeded } from '../lib/random';
import { sfx, speak } from '../lib/audio';
import type { ChallengeProps } from './types';

/** Spelling Bee: susun huruf acak menjadi kata. Ketuk huruf untuk mendengar bunyinya. */
export function SpellingBee({ level, index, seed, onAnswer }: ChallengeProps) {
  const q = useMemo(() => makeSpellQuestions(seeded(seed), level.questions, level.params.wordLength ?? 3)[index], [level, index, seed]);
  const word = q.entry.word;
  const [slots, setSlots] = useState<(number | null)[]>(() => Array(word.length).fill(null)); // indeks tile
  const [wrongs, setWrongs] = useState(0);
  const [locked, setLocked] = useState(false);
  const [shake, setShake] = useState(0);
  const [wave, setWave] = useState(0);

  const hintOn = wrongs >= 2; // petunjuk: huruf pertama diberikan
  const firstTile = q.letters.findIndex((c) => c === word[0]);
  const used = new Set(slots.filter((s): s is number => s !== null));

  const say = (text: string) => { setWave((w) => w + 1); if (!speak(text)) sfx.tap(); };

  const place = (tile: number) => {
    if (locked || used.has(tile)) return;
    const at = slots.findIndex((s, i) => s === null && !(hintOn && i === 0));
    if (at === -1) return;
    const next = [...slots];
    next[at] = tile;
    setSlots(next);
    say(q.letters[tile]);
    if (next.every((s, i) => s !== null || (hintOn && i === 0))) evaluate(next);
  };
  const remove = (slot: number) => {
    if (locked || slots[slot] === null) return;
    setSlots((s) => s.map((v, i) => (i === slot ? null : v)));
    sfx.pop();
  };
  const evaluate = (filled: (number | null)[]) => {
    const guess = filled.map((t, i) => (hintOn && i === 0 ? word[0] : t === null ? '' : q.letters[t])).join('');
    const ok = guess === word;
    if (ok) setLocked(true);
    else {
      setWrongs((w) => w + 1);
      setShake((s) => s + 1);
      setTimeout(() => setSlots(Array(word.length).fill(null)), 500);
    }
    onAnswer(ok);
  };

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <div className="card flex flex-col items-center gap-1 !py-2">
        <div className="text-7xl" aria-label="Gambar kata">{q.entry.emoji}</div>
        <button className="btn btn-secondary relative" onClick={() => say(word)} aria-label="Dengarkan kata">
          🔊 Dengar
          {wave > 0 && [0, 1].map((r) => (
            <motion.span key={`${wave}-${r}`} className="pointer-events-none absolute inset-0 rounded-2xl border-4 border-sea-400"
              initial={{ scale: 1, opacity: 0.8 }} animate={{ scale: 1.6 + r * 0.3, opacity: 0 }} transition={{ duration: 0.8, delay: r * 0.15 }} />
          ))}
        </button>
      </div>
      <motion.div key={shake} className="flex gap-2" animate={shake ? { x: [0, -10, 10, -6, 6, 0] } : {}} transition={{ duration: 0.4 }}>
        {slots.map((tile, i) => {
          const hinted = hintOn && i === 0;
          return (
            <button key={i} onClick={() => remove(i)} aria-label={`Kotak huruf ${i + 1}`}
              className={`grid h-14 w-12 place-items-center rounded-2xl border-4 text-3xl font-extrabold ${hinted ? 'border-sand-400 bg-sand-200' : 'border-sea-400 bg-white'}`}>
              {hinted ? word[0] : tile !== null ? q.letters[tile] : ''}
            </button>
          );
        })}
      </motion.div>
      {hintOn && <p className="rounded-2xl bg-sand-200 px-3 py-1 text-base font-bold">Petunjuk: huruf pertamanya {word[0]} 😉</p>}
      <div className="flex flex-wrap justify-center gap-3">
        {q.letters.map((c, i) => (
          <motion.button key={i} whileTap={{ scale: 0.9 }} whileHover={{ y: -3 }} onClick={() => place(i)} disabled={used.has(i) || (hintOn && i === firstTile)}
            className={`grid h-14 w-14 place-items-center rounded-2xl bg-coral-400 text-3xl font-extrabold text-white shadow-chunky ${used.has(i) || (hintOn && i === firstTile) ? 'opacity-20' : ''}`}>
            {c}
          </motion.button>
        ))}
      </div>
    </div>
  );
}
