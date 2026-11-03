import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { makeMulQuestions } from '../lib/questions';
import { seeded } from '../lib/random';
import { sfx } from '../lib/audio';
import type { ChallengeProps } from './types';

/** Perkalian dasar: a piring, masing-masing berisi b kue. Hitung semuanya. */
export function Multiply({ level, index, seed, onAnswer }: ChallengeProps) {
  const q = useMemo(() => makeMulQuestions(seeded(seed), level.questions, level.params.maxFactor ?? 3)[index], [level, index, seed]);
  const [wrongPicks, setWrongPicks] = useState<number[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);

  const choose = (n: number) => {
    if (locked || wrongPicks.includes(n)) return;
    setPicked(n);
    sfx.tap();
    const ok = n === q.answer;
    if (ok) setLocked(true); else setWrongPicks((w) => [...w, n]);
    onAnswer(ok);
  };

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="card !py-2 text-4xl font-extrabold" aria-label={`${q.a} kali ${q.b}`}>{q.a} × {q.b} = ?</div>
      <p className="text-base font-bold">{q.a} piring, tiap piring {q.b} kue. Ada berapa kue? 🍰</p>
      <div className="flex w-full flex-wrap justify-center gap-2" aria-label="Piring berisi kue">
        {Array.from({ length: q.a }, (_, i) => (
          <motion.div key={i} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: i * 0.08 }}
            className="flex min-h-[56px] min-w-[64px] max-w-[30%] flex-wrap content-center justify-center rounded-full border-4 border-sand-400 bg-white p-1.5 text-2xl">
            {Array.from({ length: q.b }, (_, k) => <span key={k} aria-hidden>🍰</span>)}
          </motion.div>
        ))}
      </div>
      {wrongPicks.length >= 2 && (
        <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-sand-200 px-3 py-1 text-center text-base font-bold">
          Petunjuk: tambah {q.b} sebanyak {q.a} kali — {Array(q.a).fill(q.b).join(' + ')}
        </motion.p>
      )}
      <div className="flex gap-3">
        {q.options.map((n, i) => {
          const wrong = wrongPicks.includes(n);
          return (
            <motion.button key={n} onClick={() => choose(n)} disabled={wrong || locked} whileTap={{ scale: 0.93 }} aria-label={`Pilihan ${i + 1}`}
              animate={picked === n && wrong ? { x: [0, -10, 10, -6, 6, 0] } : {}}
              className={`btn btn-secondary !min-h-[64px] !min-w-[72px] !text-3xl ${wrong ? 'opacity-30' : ''} ${locked && n === q.answer ? '!bg-leaf-600' : ''}`}>{n}</motion.button>
          );
        })}
      </div>
    </div>
  );
}
