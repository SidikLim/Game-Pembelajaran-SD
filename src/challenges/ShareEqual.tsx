import { motion } from 'framer-motion';
import { useEffect, useMemo, useRef, useState } from 'react';
import { makeShareQuestions } from '../lib/questions';
import { seeded } from '../lib/random';
import { sfx } from '../lib/audio';
import type { ChallengeProps } from './types';

/** Pembagian sebagai berbagi rata: ketuk piring untuk memberi satu kue, sampai semua kue terbagi sama banyak. */
export function ShareEqual({ level, index, seed, onAnswer }: ChallengeProps) {
  const q = useMemo(() => makeShareQuestions(seeded(seed), level.questions, level.params.maxPlates ?? 2, level.params.maxEach ?? 3)[index], [level, index, seed]);
  const [counts, setCounts] = useState<number[]>(() => Array(q.plates).fill(0));
  const [wrongs, setWrongs] = useState(0);
  const [locked, setLocked] = useState(false);
  const [shake, setShake] = useState(0);
  const timer = useRef<number>();
  useEffect(() => () => clearTimeout(timer.current), []);

  const given = counts.reduce((a, b) => a + b, 0);
  const left = q.total - given;

  const give = (i: number) => {
    if (locked || left <= 0) return;
    const next = counts.map((c, k) => (k === i ? c + 1 : c));
    setCounts(next);
    sfx.pop();
    if (next.reduce((a, b) => a + b, 0) === q.total) {
      const ok = next.every((c) => c === q.each);
      if (ok) { setLocked(true); onAnswer(true); }
      else {
        setWrongs((w) => w + 1);
        setShake((s) => s + 1);
        onAnswer(false);
        timer.current = window.setTimeout(() => setCounts(Array(q.plates).fill(0)), 900);
      }
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-2">
      <div className="card !py-2 text-4xl font-extrabold" aria-label={`${q.total} dibagi ${q.plates}`}>{q.total} ÷ {q.plates} = ?</div>
      <p className="text-base font-bold">Bagi {q.total} kue ke {q.plates} piring sama banyak. Ketuk piring! 🍰</p>
      {wrongs >= 2 && (
        <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-sand-200 px-3 py-1 text-center text-base font-bold">
          Petunjuk: bagi bergantian satu-satu — piring 1, piring 2{q.plates > 2 ? ', piring 3…' : ', lalu ulangi'}
        </motion.p>
      )}
      <div className="flex min-h-[48px] flex-wrap justify-center gap-0.5 text-2xl" aria-label={`Sisa kue ${left}`}>
        {Array.from({ length: left }, (_, i) => <span key={i} aria-hidden>🍰</span>)}
        {left === 0 && !locked && <span className="text-base font-bold">Mengulang…</span>}
      </div>
      <motion.div key={shake} animate={shake ? { x: [0, -10, 10, -6, 6, 0] } : {}} transition={{ duration: 0.4 }} className="flex w-full flex-wrap justify-center gap-2">
        {counts.map((c, i) => (
          <motion.button key={i} onClick={() => give(i)} whileTap={{ scale: 0.95 }} aria-label={`Piring ${i + 1}, berisi ${c} kue`}
            className={`flex min-h-[96px] min-w-[110px] flex-1 basis-[22%] flex-col items-center justify-center rounded-3xl border-4 bg-white p-2 ${locked ? 'border-leaf-400' : 'border-sand-400'}`}>
            <span className="text-3xl">🍽️</span>
            <span className="flex flex-wrap justify-center text-xl">{Array.from({ length: c }, (_, k) => <span key={k} aria-hidden>🍰</span>)}</span>
          </motion.button>
        ))}
      </motion.div>
    </div>
  );
}
