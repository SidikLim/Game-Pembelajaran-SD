import { motion } from 'framer-motion';
import { useMemo, useState } from 'react';
import { makeCountQuestions } from '../lib/questions';
import { seeded } from '../lib/random';
import { sfx } from '../lib/audio';
import type { ChallengeProps } from './types';

/** Mengenal angka: pilih kelompok apel yang jumlahnya sama dengan angka di soal. */
export function CountPick({ level, index, seed, onAnswer }: ChallengeProps) {
  const q = useMemo(() => makeCountQuestions(seeded(seed), level.questions, level.params.maxCount ?? 5)[index], [level, index, seed]);
  const [wrongPicks, setWrongPicks] = useState<number[]>([]);
  const [picked, setPicked] = useState<number | null>(null);
  const [locked, setLocked] = useState(false);
  const big = q.options.some((n) => n > 10);

  const choose = (n: number) => {
    if (locked || wrongPicks.includes(n)) return;
    setPicked(n);
    sfx.tap();
    const ok = n === q.target;
    if (ok) setLocked(true);
    else setWrongPicks((w) => [...w, n]);
    onAnswer(ok);
  };

  return (
    <div className="flex w-full flex-col items-center gap-4">
      <div className="card flex items-center gap-3 text-center">
        <span className="text-7xl font-extrabold" aria-label={`Angka ${q.target}`}>{q.target}</span>
      </div>
      <p className="text-lg font-bold">Pilih kelompok apel yang jumlahnya sama 🍎</p>
      {wrongPicks.length > 0 && (
        <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-sand-200 px-4 py-2 text-center text-lg font-bold">
          Petunjuk: hitung apelnya satu per satu ya 👆
        </motion.p>
      )}
      <div className="flex w-full flex-col gap-3">
        {q.options.map((n, i) => {
          const wrong = wrongPicks.includes(n);
          const right = locked && n === q.target;
          return (
            <motion.button key={n} onClick={() => choose(n)} disabled={wrong || locked} whileTap={{ scale: 0.97 }}
              animate={picked === n && wrong ? { x: [0, -10, 10, -6, 6, 0] } : right ? { scale: [1, 1.06, 1] } : {}}
              aria-label={`Pilihan ${i + 1}`}
              className={`card flex min-h-[72px] flex-wrap content-center justify-center gap-1 border-4 ${right ? 'border-leaf-400' : 'border-transparent'} ${wrong ? 'opacity-30' : ''}`}>
              {Array.from({ length: n }, (_, k) => <span key={k} className={big ? 'text-2xl' : 'text-4xl'} aria-hidden>🍎</span>)}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
