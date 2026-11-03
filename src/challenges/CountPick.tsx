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
  const most = Math.max(...q.options);
  // Ukuran emoji seragam dalam satu soal (agar ukuran tidak membocorkan jawaban).
  const emojiSize = most > 10 ? 'text-xl' : most > 5 ? 'text-3xl' : 'text-4xl';

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
    <div className="flex w-full flex-col items-center gap-2">
      <div className="card flex items-center gap-3 text-center !px-6 !py-2 [@media(min-height:760px)]:!py-3">
        <span className="text-5xl font-extrabold" role="img" aria-label={`Angka ${q.target}`}>{q.target}</span>
      </div>
      <p className="text-base font-bold">Pilih kelompok apel yang sama 🍎</p>
      {wrongPicks.length > 0 && (
        <motion.p initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl bg-sand-200 px-3 py-1 text-center text-base font-bold">
          Petunjuk: hitung apelnya satu per satu ya 👆
        </motion.p>
      )}
      <div className="flex w-full flex-col gap-2">
        {q.options.map((n, i) => {
          const wrong = wrongPicks.includes(n);
          const right = locked && n === q.target;
          return (
            <motion.button key={n} onClick={() => choose(n)} disabled={wrong || locked} whileTap={{ scale: 0.97 }}
              animate={picked === n && wrong ? { x: [0, -10, 10, -6, 6, 0] } : right ? { scale: [1, 1.06, 1] } : {}}
              aria-label={`Pilihan ${i + 1}`} data-choice=""
              className={`card flex min-h-[64px] [@media(min-height:760px)]:min-h-[88px] flex-wrap content-center justify-center gap-0.5 border-4 !p-2 ${right ? 'border-leaf-400' : 'border-transparent'} ${wrong ? 'opacity-30' : ''}`}>
              {Array.from({ length: n }, (_, k) => <span key={k} className={emojiSize} aria-hidden>🍎</span>)}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
