import { AnimatePresence, motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { makeSubQuestions } from '../lib/questions';
import { seeded } from '../lib/random';
import { sfx } from '../lib/audio';
import type { ChallengeProps } from './types';

/** Pengurangan visual: pecahkan b balon dari a balon, lalu pilih jumlah balon yang tersisa. */
export function BalloonSub({ level, index, seed, onAnswer }: ChallengeProps) {
  const q = useMemo(() => makeSubQuestions(seeded(seed), level.questions, level.params.maxMinuend ?? 5)[index], [level, index, seed]);
  const [popped, setPopped] = useState<Set<number>>(new Set());
  const [wrongPicks, setWrongPicks] = useState<number[]>([]);
  const [locked, setLocked] = useState(false);
  const phase = popped.size >= q.b ? 'answer' : 'pop';

  const pop = (i: number) => {
    if (phase !== 'pop' || popped.has(i)) return;
    setPopped((p) => new Set(p).add(i));
    sfx.pop();
  };
  const choose = (n: number) => {
    if (locked || wrongPicks.includes(n)) return;
    const ok = n === q.answer;
    if (ok) setLocked(true); else setWrongPicks((w) => [...w, n]);
    onAnswer(ok);
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="card text-5xl font-extrabold" aria-label={`${q.a} dikurangi ${q.b}`}>{q.a} − {q.b} = ?</div>
      <p className="text-lg font-bold" aria-live="polite">
        {phase === 'pop' ? `Pecahkan ${q.b - popped.size} balon lagi 🎈` : 'Berapa balon yang tersisa?'}
      </p>
      <div className="flex min-h-[150px] flex-wrap justify-center gap-2" aria-label="Balon">
        <AnimatePresence>
          {Array.from({ length: q.a }, (_, i) => i).filter((i) => !popped.has(i)).map((i) => (
            <motion.button key={i} layout onClick={() => pop(i)} disabled={phase !== 'pop'} aria-label="Pecahkan balon"
              initial={{ scale: 0 }} animate={{ scale: 1, y: [0, -5, 0] }} transition={{ y: { repeat: Infinity, duration: 2 + (i % 3) * 0.4 } }}
              exit={{ scale: 1.8, opacity: 0, transition: { duration: 0.25 } }} whileTap={{ scale: 0.85 }}
              className="grid h-[72px] w-[72px] place-items-center text-6xl" style={{ filter: `hue-rotate(${i * 47}deg)` }}>🎈</motion.button>
          ))}
        </AnimatePresence>
      </div>
      {wrongPicks.length >= 2 && (
        <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-sand-200 px-4 py-2 text-center text-lg font-bold">
          Petunjuk: hitung balon yang masih ada satu per satu 👆
        </motion.p>
      )}
      {phase === 'answer' && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="flex gap-3">
          {q.options.map((n, i) => {
            const wrong = wrongPicks.includes(n);
            return (
              <motion.button key={n} onClick={() => choose(n)} disabled={wrong || locked} whileTap={{ scale: 0.93 }} aria-label={`Pilihan ${i + 1}`}
                className={`btn btn-secondary !min-h-[72px] !min-w-[72px] !text-4xl ${wrong ? 'opacity-30' : ''} ${locked && n === q.answer ? '!bg-leaf-600' : ''}`}>
                {n}
              </motion.button>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}
